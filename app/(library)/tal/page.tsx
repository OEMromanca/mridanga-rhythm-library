import React from 'react';
import { redirect } from 'next/navigation';
import { fetchMantras } from '@/lib/mantra/mantraService';

export default async function LibraryIndexPage() {
  try {
    const mantras = await fetchMantras();
    if (mantras && mantras.length > 0) {
      redirect(`/tal/${mantras[0].id}`);
    }
  } catch (error) {
    console.error('Failed to fetch initial mantras for redirect:', error);
  }

  // Fallback if no mantras exist or fetch fails
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-2xl font-semibold mb-2">Mridanga Rhythm Library</h1>
      <p className="text-muted-foreground">Žiadne taly nie sú dostupné v databáze.</p>
    </div>
  );
}
