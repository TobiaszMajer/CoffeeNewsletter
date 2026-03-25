import { supabase } from "./supabase";

export async function ensureAnonymousSession() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (session) return session;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;

  return data.session;
}

export async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("No authenticated user found");

  return user.id;
}

export async function ensureProfile() {
  await ensureAnonymousSession();
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    }
  );

  if (error) throw error;

  return userId;
}