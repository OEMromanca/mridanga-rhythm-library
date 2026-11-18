"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const INACTIVITY_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours

export function AuthTimeoutHandler(): null {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out on inactivity:", error);
    } finally {
      localStorage.removeItem("mridanga_user");
      router.push("/");
      router.refresh();
    }
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      handleSignOut();
    }, INACTIVITY_TIMEOUT_MS);
  }, [handleSignOut]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    const handleActivity = () => {
      resetTimer();
    };

    // Initialize timer on mount
    resetTimer();

    // Attach listeners
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);

  return null;
}
