'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardShell from '@/components/DashboardShell';
import styles from '@/components/PortDeck.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isReady, signOut } = useAuth();

  useEffect(() => {
    if (isReady && !user) router.replace('/login');
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return (
      <main className={styles.loaderScreen}>
        <div className={styles.loaderStack}>
          <div className={styles.loaderSpinner} />
          <p className={styles.loaderText}>Loading dashboard…</p>
        </div>
      </main>
    );
  }

  return <DashboardShell user={user} signOut={signOut} />;
}
