import React from 'react';
import { notFound } from 'next/navigation';
import { fetchMantraById } from '@/lib/mantra/mantraService';
import { AppLayout } from '@/components/mantra/AppLayout';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TalDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  const mantra = await fetchMantraById(id);

  if (!mantra) {
    notFound();
  }

  return <AppLayout />;
}
