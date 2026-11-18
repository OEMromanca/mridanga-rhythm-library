"use client";

import { useMemo, useState, useEffect } from "react";
import { LogIn, LogOut, Menu, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "@/components/auth/AccountProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fetchMantras, saveMantra, deleteMantraService } from "@/lib/mantra/mantraService";
import type { Category, Mantra } from "@/lib/mantra/types";
import { Sidebar } from "./Sidebar";
import { MantraTable } from "./MantraTable";
import { BeatsView } from "./BeatsView";
import { MantraDetailsModal } from "./MantraDetailsModal";
import { MantraFormModal, type FormState } from "./MantraFormModal";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

export function AppLayout() {
  const { user, isAdmin, loading: authLoading, signOut } = useAccount();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loadingMantras, setLoadingMantras] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;

    async function loadData() {
      try {
        const data = await fetchMantras();
        if (isMounted) {
          setMantras(data);
        }
      } catch (err: unknown) {
        const error = err as { message?: string; status?: number; hint?: string; details?: string };
        console.error("Failed to fetch mantras:", {
          message: error?.message,
          status: error?.status,
          hint: error?.hint,
          details: error?.details,
          full: JSON.stringify(err, null, 2),
        });
        toast.error(`Failed to load mantras: ${error?.message || "Unknown error"}`);
      } finally {
        if (isMounted) setLoadingMantras(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const [category, setCategory] = useState<Category | "Beats">("Kaharwa Tal");
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(null);
  const [toDelete, setToDelete] = useState<Mantra | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    mantras.forEach((m) => (c[m.category] = (c[m.category] ?? 0) + 1));
    return c;
  }, [mantras]);

  if (!mounted) {
    return null;
  }

  const isBeatsView = category === "Beats";
  const inCategory = isBeatsView ? [] : mantras.filter((m) => m.category === category);
  const q = query.trim().toLowerCase();
  const visible = q ? inCategory.filter((m) => m.name.toLowerCase().includes(q) || m.author.toLowerCase().includes(q)) : inCategory;
  const details = mantras.find((m) => m.id === detailsId) ?? null;

  const selectCategory = (c: Category) => { setCategory(c); setQuery(""); setDrawer(false); };
  const selectBeats = () => { setCategory("Beats"); setQuery(""); setDrawer(false); };

  const save = async (m: Mantra, mode: "create" | "edit") => {
    try {
      const savedMantra = await saveMantra(m);
      setMantras((list) => (mode === "create" ? [savedMantra, ...list] : list.map((x) => (x.id === savedMantra.id ? savedMantra : x))));
      setForm(null);
      toast.success(mode === "create" ? `“${savedMantra.name}” added to ${savedMantra.category}` : `“${savedMantra.name}” updated`);
    } catch (err: unknown) {
      let errorMessage = 'Unknown error';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = (err as { message?: string; details?: string }).message || (err as { message?: string; details?: string }).details || JSON.stringify(err);
      } else {
        errorMessage = String(err);
      }
      console.error("Failed to save mantra:", errorMessage);
      toast.error("Failed to save mantra to Supabase.");
    }
  };

  const sidebar = <Sidebar selected={category} counts={counts} onSelect={selectCategory} isBeatsActive={isBeatsView} onSelectBeats={selectBeats} />;

  async function logout() {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/auth");
      router.refresh();
    } catch { toast.error("Couldn’t sign out. Please try again."); }
    finally { setSigningOut(false); }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen w-full">
        <aside className="fixed inset-y-0 left-0 hidden w-[250px] border-r border-sidebar-border bg-sidebar lg:block">{sidebar}</aside>
        <Sheet open={drawer} onOpenChange={setDrawer}>
          <SheetContent side="left" className="w-[260px] bg-sidebar p-0">
            <SheetTitle className="sr-only">Categories</SheetTitle>
            {sidebar}
          </SheetContent>
        </Sheet>

        <main className="lg:pl-[250px]">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
            <div className="mb-5 flex min-h-8 items-center justify-end gap-3">
              {!authLoading && (user ? <>
                <span className="max-w-48 truncate text-sm text-muted-foreground" title={user.email}>{user.email} {isAdmin && "(Admin)"}</span>
                <Button size="sm" variant="outline" disabled={signingOut} onClick={() => void logout()}><LogOut />Sign out</Button>
              </> : <>
                <Button asChild size="sm" variant="ghost"><Link href="/auth"><LogIn />Sign in</Link></Button>
              </>)}
            </div>
            <div className="mb-4 flex items-center gap-2 lg:hidden">
              <Button variant="outline" size="icon" aria-label="Open categories" onClick={() => setDrawer(true)}><Menu className="h-4 w-4" /></Button>
              <span className="font-display font-semibold">Mridanga Rhythm Library</span>
            </div>

            {!isBeatsView && (
              <>
                <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
                  Rhythm Library <span className="mx-1.5">/</span> <span className="text-foreground">{category}</span>
                </nav>
                <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{category}</h1>
                  </div>
                  {isAdmin && (
                    <Button onClick={() => setForm({ mode: "create", category: category as Category })}><Plus className="h-4 w-4" /> Add Mantra</Button>
                  )}
                </div>
              </>
            )}

            {isBeatsView ? (
              <div className="mt-3">
                <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl mb-6">Beats</h1>
                <BeatsView />
              </div>
            ) : (
              <>
                <div className="mt-8 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input aria-label="Search mantras" placeholder="Search by name or author" className="bg-card pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {q ? `${visible.length} of ` : ""}{inCategory.length} {inCategory.length === 1 ? "mantra" : "mantras"}
                  </p>
                </div>

                {loadingMantras ? (
                  <div className="py-12 text-center text-muted-foreground">Loading mantras from Supabase...</div>
                ) : (
                  <MantraTable
                    mantras={visible}
                    query={query}
                    isAdmin={isAdmin}
                    onDetails={(m) => setDetailsId(m.id)}
                    onEdit={(m) => setForm({ mode: "edit", mantra: m })}
                    onDelete={setToDelete}
                  />
                )}
              </>
            )}
          </div>
        </main>

        <MantraDetailsModal
          isOpen={!!detailsId}
          mantra={details}
          isAdmin={isAdmin}
          onClose={() => setDetailsId(null)}
          onSave={async (m) => {
            await save(m, "edit");
          }}
        />
        <MantraFormModal state={form} onClose={() => setForm(null)} onSave={save} />
        <DeleteConfirmationDialog mantra={toDelete} onCancel={() => setToDelete(null)}
          onConfirm={async (m) => {
            try {
              await deleteMantraService(m.id);
              setMantras((l) => l.filter((x) => x.id !== m.id));
              setToDelete(null);
              toast.success(`“${m.name}” deleted`);
            } catch (err: unknown) {
              console.error("Failed to delete mantra:", err instanceof Error ? err.message : String(err));
              toast.error("Failed to delete mantra from Supabase.");
            }
          }} />
      </div>
    </TooltipProvider>
  );
}
