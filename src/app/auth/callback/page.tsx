'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Portal from '@/data/auth/Portal';

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
    <main className="min-h-screen flex items-center justify-center p-4">
      <section className="w-full max-w-md glass-strong rounded-3xl p-6 sm:p-8 shadow-card animate-scale-in">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-ink-700 border-t-iris-400 rounded-full animate-spin" />
            <p className="text-ink-200 text-center text-sm">
              Processing your GitHub sign-in…
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-mint-500/15 border border-mint-500/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-mint-400"
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
            <p className="text-ink-200 text-center text-sm">
              Successfully signed in! Redirecting…
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-rose-soft"
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
            <p className="text-ink-200 text-center font-medium">
              {errorMessage}
            </p>
            <Link
              href="/login"
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-iris-500 to-violet-accent text-white text-sm font-medium shadow-glow hover:brightness-110 transition-all"
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
        <main className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-ink-700 border-t-iris-400 animate-spin" />
        </main>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
