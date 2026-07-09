'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function RootPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    router.replace(user ? '/dashboard' : '/login');
  }, [isReady, user, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-ink-700 border-t-iris-400 animate-spin" />
        <p className="text-ink-300 text-sm">Loading PortDeck…</p>
      </div>
    </main>
  );
}
