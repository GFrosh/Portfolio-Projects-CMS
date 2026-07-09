'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardShell from '@/components/DashboardShell';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isReady, signOut } = useAuth();

  useEffect(() => {
    if (isReady && !user) router.replace('/login');
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-ink-700 border-t-iris-400 animate-spin" />
          <p className="text-ink-300 text-sm">Loading dashboard…</p>
        </div>
      </main>
    );
  }

  return <DashboardShell user={user} signOut={signOut} />;
}
