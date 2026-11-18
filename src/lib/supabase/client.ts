import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

type SupabaseClientType = ReturnType<typeof createBrowserClient<Database>>;

const createClientInstance = (): SupabaseClientType => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Using a module-level constant since createBrowserClient is idempotent or we can cache it in a getter using a closure if desired, but standard singleton pattern can also be a lazy getter or immutable module initialization. Wait, getSupabaseBrowserClient can just return a cached const initialized via IIFE or function.
const supabaseInstance: SupabaseClientType = createClientInstance();

export function getSupabaseBrowserClient(): SupabaseClientType {
  return supabaseInstance;
}

export const supabase = getSupabaseBrowserClient();
