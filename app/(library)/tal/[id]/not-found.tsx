'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Tal nebol nájdený</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Požadovaný tal neexistuje alebo bol odstránený. Skontrolujte prosím adresu alebo sa vráťte do zoznamu talov.
      </p>
      <Button asChild variant="default" className="flex items-center gap-2">
        <Link href="/tal">
          <ArrowLeft className="w-4 h-4" />
          Späť na zoznam talov
        </Link>
      </Button>
    </div>
  );
}
