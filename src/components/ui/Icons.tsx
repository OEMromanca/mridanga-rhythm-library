import React from "react";
import { cn } from "@/lib/utils";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function CircleIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export function FilledCircleIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export function CrossCircleIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  );
}

export function DrumIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      <path d="M19 6h-1V5c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v1H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1v1c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-1h1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM8 5h8v2H8V5zm8 14H8v-2h8v2zm3-4h-1V9h1v6zM5 9h1v6H5V9z" />
    </svg>
  );
}

export function BeatIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("inline-block shrink-0", className)}
      {...props}
    >
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}
