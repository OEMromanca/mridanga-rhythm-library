import { supabase } from "@/lib/supabase/client";

export async function registerAccount(email: string, password?: string, origin?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: password || "",
    options: {
      emailRedirectTo: origin ? `${origin}/auth` : undefined,
    },
  });

  if (error) {
    console.error("Auth Sign-Up Error:", error.message);
    throw new Error(error.message);
  }

  if (data.session?.user) {
    const user = { id: data.session.user.id, email: data.session.user.email || email.trim() };
    localStorage.setItem("mridanga_user", JSON.stringify(user));
  } else if (data.user) {
    const user = { id: data.user.id, email: data.user.email || email.trim() };
    localStorage.setItem("mridanga_user", JSON.stringify(user));
  } else {
    // Fallback if email confirmation is enabled or session is deferred
    const user = { email: email.trim(), id: Math.random().toString(36).substring(2) };
    localStorage.setItem("mridanga_user", JSON.stringify(user));
  }

  return "signed-in" as const;
}

export async function signInAccount(email: string, password?: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: password || "",
  });

  if (error) {
    console.error("Auth Sign-In Error:", error.message);
    throw new Error(error.message);
  }

  if (data.session?.user) {
    const user = { id: data.session.user.id, email: data.session.user.email || email.trim() };
    localStorage.setItem("mridanga_user", JSON.stringify(user));
  } else {
    const user = { email: email.trim(), id: Math.random().toString(36).substring(2) };
    localStorage.setItem("mridanga_user", JSON.stringify(user));
  }
}

export async function requestPasswordReset(email?: string, origin?: string) {
  if (!email) return;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: origin ? `${origin}/auth/reset-password` : undefined,
  });
  if (error) {
    console.error("Password Reset Error:", error.message);
    throw new Error(error.message);
  }
}

export async function updateRecoveryPassword(password?: string) {
  if (!password) return;
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error("Update Password Error:", error.message);
    throw new Error(error.message);
  }
}

export async function signOutAccount() {
  await supabase.auth.signOut();
  localStorage.removeItem("mridanga_user");
}
