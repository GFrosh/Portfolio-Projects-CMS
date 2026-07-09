'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Portal from '@/data/auth/Portal';
import styles from '@/components/PortDeck.module.css';

function CallbackInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>(
    'loading',
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMessage(
        error === 'access_denied'
          ? 'You cancelled the GitHub sign-in. Please try again.'
          : `Authentication failed: ${error}`,
      );
      return;
    }

    if (!token) {
      setStatus('error');
      setErrorMessage(
        'No authentication token received. Please try signing in again.',
      );
      return;
    }

    (async () => {
      const result = await Portal.processOAuthCallback(token);
      if (result.success && result.user) {
        setStatus('success');
        setTimeout(() => router.replace('/dashboard'), 500);
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Failed to process authentication.');
      }
    })();
  }, [searchParams, router]);

  return (
    <main className={styles.loaderScreen}>
      <section className={`${styles.glassStrong} ${styles.shadowCard} ${styles.modalPanel}`}>
        {status === 'loading' && (
          <div className={styles.loaderStack}>
            <div className={styles.loaderSpinner} />
            <p style={{ color: 'var(--color-ink-200)', textAlign: 'center', fontSize: '0.875rem' }}>
              Processing your GitHub sign-in…
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className={styles.loaderStack}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <svg
                style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-mint-400)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p style={{ color: 'var(--color-ink-200)', textAlign: 'center', fontSize: '0.875rem' }}>
              Successfully signed in! Redirecting…
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.loaderStack}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
              }}
            >
              <svg
                style={{ width: '1.5rem', height: '1.5rem', color: 'var(--color-rose-soft)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p style={{ color: 'var(--color-ink-200)', textAlign: 'center', fontWeight: 500 }}>
              {errorMessage}
            </p>
            <Link
              href="/login"
              className={styles.buttonPrimary}
            >
              Return to Sign In
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.loaderScreen}>
          <div className={styles.loaderSpinner} />
        </main>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
