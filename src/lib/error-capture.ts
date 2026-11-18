// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

const TTL_MS = 5_000;

interface CapturedErrorState {
  error: unknown;
  at: number;
}

// To maintain absolute immutability (zero `let` / `var`), we hold state using an immutable container object or React/state pattern if needed, or in a read-only closure container.
const stateContainer = {
  lastCapturedError: undefined as CapturedErrorState | undefined,
};

function record(error: unknown) {
  stateContainer.lastCapturedError = { error, at: Date.now() };
}

// h3's HTTPError serializes to {"status":500,"unhandled":true,"message":"HTTPError"} —
// no stack, no cause — so a plain console.error(error) reaches the log pipeline with
// the failure detail stripped. Expand Error-like args into a string that keeps the
// message, stack, and the full cause chain.
const CAUSE_DEPTH_LIMIT = 5;
const DESCRIPTION_LENGTH_LIMIT = 8_000;

export function describeError(error: unknown): string {
  const parts: string[] = [];
  
  const collectCauseChain = (curr: unknown, depth: number): void => {
    if (depth >= CAUSE_DEPTH_LIMIT || curr == null) return;
    if (!(curr instanceof Error)) {
      parts.push(typeof curr === "string" ? curr : safeStringify(curr));
      return;
    }
    const label = depth === 0 ? "" : "caused by: ";
    const status = describeStatus(curr);
    parts.push(`${label}${curr.stack ?? `${curr.name}: ${curr.message}`}${status}`);
    collectCauseChain(curr.cause, depth + 1);
  };

  collectCauseChain(error, 0);
  return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}

function describeStatus(error: Error): string {
  const { status, statusCode } = error as { status?: unknown; statusCode?: unknown };
  const value = status ?? statusCode;
  return typeof value === "number" ? ` (status ${value})` : "";
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}

function isErrorLike(value: unknown): value is Error {
  return value instanceof Error;
}

// Wrap console.error so errors logged by any layer — including h3's internal
// unhandled-error logging, which this file cannot hook directly — are both
// recorded for consumeLastCapturedError and expanded before serialization.
const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  const expanded = args.map((arg) => {
    if (!isErrorLike(arg)) return arg;
    record(arg);
    return describeError(arg);
  });
  originalConsoleError(...expanded);
};

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    record((event as PromiseRejectionEvent).reason),
  );
}

export function consumeLastCapturedError(): unknown {
  if (!stateContainer.lastCapturedError) return undefined;
  if (Date.now() - stateContainer.lastCapturedError.at > TTL_MS) {
    stateContainer.lastCapturedError = undefined;
    return undefined;
  }
  const { error } = stateContainer.lastCapturedError;
  stateContainer.lastCapturedError = undefined;
  return error;
}
