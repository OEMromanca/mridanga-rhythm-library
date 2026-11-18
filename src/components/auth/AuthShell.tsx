"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Drum } from "lucide-react";
import Image from "next/image";
import drumPhoto from "@/assets/mridanga-account.jpg";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-sidebar">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Mridanga Rhythm Library home">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft"><Drum className="h-5 w-5" /></span>
            <span className="font-display text-[17px] font-semibold leading-tight">Mridanga<span className="block font-sans text-xs font-medium text-muted-foreground">Rhythm Library</span></span>
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-md px-5 pb-10 pt-5 sm:pt-7">
        <Image src={drumPhoto} alt="Traditional clay mridanga drum" width={1280} height={512} className="mx-auto mb-5 aspect-[5/2] w-full rounded-lg object-cover bg-muted" priority />
        {children}
      </main>
    </div>
  );
}
