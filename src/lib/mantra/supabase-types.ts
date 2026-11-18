import { Database } from "@/types/supabase";

export type DatabaseMantraRow = Database["public"]["Tables"]["mantras"]["Row"];
export type DatabaseMantraInsert = Database["public"]["Tables"]["mantras"]["Insert"];
export type DatabaseMantraUpdate = Database["public"]["Tables"]["mantras"]["Update"];
