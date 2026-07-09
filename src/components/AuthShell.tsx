'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Portal from '@/data/auth/Portal';
import { useAuth } from '@/hooks/useAuth';

interface AuthShellProps {
  mode: 'signin' | 'signup';
}

export default function AuthShell({ mode }: AuthShellProps) {
  const router = useRouter();
  const { user, isReady, isAuthenticating, error, signIn, signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('user@portdeck.local');
  const [password, setPassword] = useState('password123');

  useEffect(() => {
    if (isReady && user) router.replace('/dashboard');
  }, [isReady, user, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok =
      mode === 'signup'
        ? await signUp({ name, email, password })
        : await signIn({ email, password });
    if (ok) router.replace('/dashboard');
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Left — brand & story panel */}
      <aside className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-16 w-[520px] h-[520px] rounded-full bg-iris-500/30 blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-[420px] h-[420px] rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full bg-emerald-500/15 blur-3xl" />
        </div>

        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="text-sm font-semibold tracking-tight">PortDeck</p>
            <p className="text-xs text-ink-400">Portfolio CMS · v2</p>
          </div>
        </div>

        <div className="max-w-lg space-y-6">
          <p className="text-xs uppercase tracking-[0.24em] text-iris-300">
            Ship your work · fast
          </p>
          <h2 className="text-4xl xl:text-5xl font-bold leading-[1.05] tracking-tight">
            A quiet, focused home for{' '}
            <span className="text-gradient">every project</span> you ship.
          </h2>
          <p className="text-ink-300 leading-relaxed">
            Create, curate, and publish your portfolio in a clean, backend‑first
            CMS. Import from GitHub, tag your stack, and expose ready‑to‑use
            REST endpoints for your public site.
          </p>

          <ul className="space-y-3 pt-2">
            {[
              'GitHub import — auto-fills metadata from any repo',
              'Draft, publish, archive — clean lifecycle',
              'REST endpoints for your public portfolio',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-mint-500/20 text-mint-400">
                  <CheckIcon />
                </span>
                <span className="text-ink-200">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-ink-500">
          © {new Date().getFullYear()} PortDeck. Backend‑first portfolio manager.
        </p>
      </aside>

      {/* Right — form panel */}
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <LogoMark />
            <p className="text-sm font-semibold tracking-tight">PortDeck</p>
          </div>

          <div className="glass-strong rounded-3xl p-6 sm:p-8 shadow-card animate-fade-in">
            <div className="flex items-baseline justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </h1>
            </div>
            <p className="text-sm text-ink-400 mt-2">
              {mode === 'signup'
                ? 'Start managing your portfolio projects in minutes.'
                : 'Sign in to continue to your dashboard.'}
            </p>

            {/* Mode switcher */}
            <div className="mt-6 grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
              <Link
                href="/login"
                className={`text-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'signin'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-ink-400 hover:text-ink-100'
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={`text-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-ink-400 hover:text-ink-100'
                }`}
              >
                Sign Up
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === 'signup' && (
                <TextField
                  label="Name"
                  id="name"
                  type="text"
                  value={name}
                  onChange={setName}
                  required
                  placeholder="Ada Lovelace"
                />
              )}
              <TextField
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                required
                placeholder="you@portdeck.local"
              />
              <TextField
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={setPassword}
                required
                placeholder="••••••••"
              />

              {error && (
                <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="group relative w-full inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-iris-500 to-violet-accent hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed shadow-glow transition-all"
              >
                {isAuthenticating
                  ? 'Please wait…'
                  : mode === 'signup'
                  ? 'Create Account'
                  : 'Sign In'}
                <ArrowIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-transparent text-ink-500">
                  Or continue with
                </span>
              </div>
            </div>

            <a
              href={Portal.getGitHubLoginUrl()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-ink-100 transition-colors"
            >
              <GitHubIcon />
              GitHub
            </a>

            <p className="mt-6 text-center text-xs text-ink-500">
              Demo credentials pre-filled · you can also create a new account.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------------- helpers ------------- */

function TextField({
  label,
  id,
  type,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-ink-300 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/[0.03] border border-white/10 focus:border-iris-400 focus:ring-focus px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 outline-none transition-all"
      />
    </div>
  );
}

function LogoMark() {
  return (
    <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-iris-500 to-violet-accent flex items-center justify-center shadow-glow">
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7l8-4 8 4v10l-8 4-8-4V7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7l8 4 8-4M12 11v10"
        />
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-3 w-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M5 12h13" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
