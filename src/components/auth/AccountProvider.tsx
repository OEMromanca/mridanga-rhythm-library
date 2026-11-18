"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";

interface User {
  id: string;
  email: string;
}

export const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID || "50e3789e-a27e-4e77-9b56-7b3c6530dad2";

interface AccountContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;

    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email || "" });
          } else {
            // Check fallback localStorage user
            const saved = localStorage.getItem("mridanga_user");
            if (saved) {
              setUser(JSON.parse(saved));
            }
          }
        }
      } catch (err: unknown) {
        console.error("Auth session error:", err instanceof Error ? err.message : String(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: import("@supabase/supabase-js").Session | null) => {
      if (isMounted) {
        if (session?.user) {
          const u = { id: session.user.id, email: session.user.email || "" };
          setUser(u);
          localStorage.setItem("mridanga_user", JSON.stringify(u));
        } else {
          setUser(null);
          localStorage.removeItem("mridanga_user");
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  const signIn = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.error("Auth Sign-In Error:", error.message);
      throw new Error(error.message);
    }
    const authData = data as { user?: { id?: string } | null };
    const u = { id: authData?.user?.id || Math.random().toString(36).substring(2), email };
    setUser(u);
    try {
      localStorage.setItem("mridanga_user", JSON.stringify(u));
    } catch (err: unknown) {
      console.error("Failed to store user:", err instanceof Error ? err.message : String(err));
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    try {
      localStorage.removeItem("mridanga_user");
    } catch (err: unknown) {
      console.error("Failed to remove user:", err instanceof Error ? err.message : String(err));
    }
  };

  const isAdmin = user?.id === ADMIN_USER_ID;

  return <AccountContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  return useContext(AccountContext);
}
