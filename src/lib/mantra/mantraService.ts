import { supabase } from "@/lib/supabase/client";
import { Mantra, CATEGORIES, Category, Stroke } from "@/lib/mantra/types";
import { DatabaseMantraRow, DatabaseMantraInsert, DatabaseMantraUpdate } from "./supabase-types";

export async function fetchMantras(): Promise<Mantra[]> {
  await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("mantras")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    throw error || new Error("Failed to fetch mantras");
  }

  return (data as DatabaseMantraRow[]).map((item) => ({
    id: String(item.id || ""),
    name: String(item.name || ""),
    category: (CATEGORIES.includes(item.category as Category) ? item.category : CATEGORIES[0]) as Category,
    author: String(item.author || ""),
    description: String(item.description || ""),
    strokes: Array.isArray(item.strokes) ? (item.strokes as Stroke[]) : [],
  }));
}

export async function saveMantra(mantra: Omit<Mantra, "id"> & { id?: string }): Promise<Mantra> {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user ? user.id : null;

  // Check if it's an existing valid uuid update (not a seed item and not a local form generated random string ID)
  const isExistingUuid = mantra.id && !mantra.id.startsWith("seed-") && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(mantra.id);

  if (isExistingUuid && mantra.id) {
    const payload: DatabaseMantraUpdate = {
      name: mantra.name,
      category: mantra.category,
      author: mantra.author && mantra.author.trim() !== "" ? mantra.author.trim() : null,
      description: mantra.description && mantra.description.trim() !== "" ? mantra.description.trim() : null,
      strokes: mantra.strokes as unknown[],
      user_id: userId,
    };

    const { data, error } = await supabase
      .from("mantras")
      // @ts-expect-error - Supabase update typings workaround for jsonb array
      .update(payload)
      .eq("id", mantra.id)
      .select()
      .single();

    if (error || !data) throw error || new Error("Failed to update mantra");
    const item = data as DatabaseMantraRow;
    return {
      id: item.id,
      name: item.name,
      category: (CATEGORIES.includes(item.category as Category) ? item.category : CATEGORIES[0]) as Category,
      author: item.author || "",
      description: item.description || "",
      strokes: Array.isArray(item.strokes) ? (item.strokes as Stroke[]) : [],
    };
  } else {
    const payload: DatabaseMantraInsert = {
      name: mantra.name,
      category: mantra.category,
      author: mantra.author && mantra.author.trim() !== "" ? mantra.author.trim() : null,
      description: mantra.description && mantra.description.trim() !== "" ? mantra.description.trim() : null,
      strokes: mantra.strokes as unknown[],
      user_id: userId,
    };

    const { data, error } = await supabase
      .from("mantras")
      // @ts-expect-error - Supabase insert typings workaround for jsonb array
      .insert([payload])
      .select()
      .single();

    if (error || !data) throw error || new Error("Failed to insert mantra");
    const item = data as DatabaseMantraRow;
    return {
      id: item.id,
      name: item.name,
      category: (CATEGORIES.includes(item.category as Category) ? item.category : CATEGORIES[0]) as Category,
      author: item.author || "",
      description: item.description || "",
      strokes: Array.isArray(item.strokes) ? (item.strokes as Stroke[]) : [],
    };
  }
}

export async function deleteMantraService(id: string): Promise<void> {
  if (id.startsWith("seed-")) return; // Mock item
  const { error } = await supabase.from("mantras").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchMantraById(id: string): Promise<Mantra | null> {
  await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("mantras")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  const item = data as DatabaseMantraRow;
  return {
    id: String(item.id || ""),
    name: String(item.name || ""),
    category: (CATEGORIES.includes(item.category as Category) ? item.category : CATEGORIES[0]) as Category,
    author: String(item.author || ""),
    description: String(item.description || ""),
    strokes: Array.isArray(item.strokes) ? (item.strokes as Stroke[]) : [],
  };
}

