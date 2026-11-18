'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function TalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Tal load error isolated:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Nepodarilo sa načítať tal</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        {error.message || 'Nastala neočakávaná chyba pri načítaní detailu talu zo Supabase.'}
      </p>
      <Button
        onClick={() => reset()}
        variant="default"
        className="flex items-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Skúsiť znova
      </Button>
    </div>
  );
}
