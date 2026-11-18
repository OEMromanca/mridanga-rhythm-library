import React from 'react';
import { fetchMantras } from '@/lib/mantra/mantraService';
import { Sidebar } from '@/components/mantra/Sidebar';
import type { Mantra } from '@/lib/mantra/types';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function LibraryLayout({ children }: LayoutProps) {
  const mantras = await fetchMantras().catch((error: unknown) => {
    console.error('Failed to fetch mantras for library layout sidebar:', error);
    return [] as Mantra[];
  });

  return (
    <div className="min-h-screen w-full flex">
      <aside className="fixed inset-y-0 left-0 hidden w-[250px] border-r border-sidebar-border bg-sidebar lg:block z-30">
        <Sidebar mantras={mantras} />
      </aside>
      <main className="flex-1 lg:pl-[250px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
