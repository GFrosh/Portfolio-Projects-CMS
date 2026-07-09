'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/components/PortDeck.module.css';

export default function RootPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    router.replace(user ? '/dashboard' : '/login');
  }, [isReady, user, router]);

  return (
    <main className={styles.loaderScreen}>
      <div className={styles.loaderStack}>
        <div className={styles.loaderSpinner} />
        <p className={styles.loaderText}>Loading PortDeck…</p>
      </div>
    </main>
  );
}
