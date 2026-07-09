'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { AuthUser } from '@/types/auth';
import Portal from '@/data/auth/Portal';
import { CheckIcon, CopyIcon } from './icons';

interface EndpointsPanelProps {
  user: AuthUser;
}

export default function EndpointsPanel({ user }: EndpointsPanelProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const endpoints = useMemo(() => {
    const base = Portal.BASE_URL.replace(/\/$/, '');
    const userPath = `/api/users/${encodeURIComponent(user.name)}/projects`;
    const publicPath = `/api/public/projects`;
    const singlePath = (id = '{id}') => `/api/projects/${id}`;

    return [
      {
        key: 'user-projects',
        title: 'Your projects',
        subtitle: 'Private · authenticated',
        url: `${base}${userPath}`,
        curl: `curl -H "Authorization: Bearer <TOKEN>" ${base}${userPath}`,
        tint: 'from-iris-500/20 to-violet-accent/10',
      },
      {
        key: 'public-projects',
        title: 'Public projects',
        subtitle: 'Published only · no auth',
        url: `${base}${publicPath}`,
        curl: `curl ${base}${publicPath}`,
        tint: 'from-mint-500/20 to-iris-500/10',
      },
      {
        key: 'single-project',
        title: 'Single project',
        subtitle: 'By ID · authenticated',
        url: `${base}${singlePath()}`,
        curl: `curl -H "Authorization: Bearer <TOKEN>" ${base}${singlePath()}`,
        tint: 'from-fuchsia-500/20 to-amber-400/10',
      },
    ];
  }, [user.name]);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopiedKey(null), 1600);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Export & endpoints
          </h2>
          <p className="text-sm text-ink-400 max-w-2xl mt-0.5">
            Wire your public portfolio site to these ready-to-use REST endpoints.
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-ink-500">
          Copy-paste friendly
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {endpoints.map((ep) => (
          <article
            key={ep.key}
            className={`relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br ${ep.tint} p-4 flex flex-col gap-3`}
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-300">
                {ep.subtitle}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {ep.title}
              </p>
              <p className="mt-2 text-xs font-mono text-ink-200 break-all leading-5">
                {ep.url}
              </p>
            </div>

            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleCopy(ep.url, `${ep.key}-url`)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors"
              >
                {copiedKey === `${ep.key}-url` ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-3.5 h-3.5" />
                    URL
                  </>
                )}
              </button>
              <button
                onClick={() => handleCopy(ep.curl, `${ep.key}-curl`)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-black/30 hover:bg-black/40 border border-white/10 px-3 py-1.5 text-xs font-medium text-ink-100 transition-colors"
              >
                {copiedKey === `${ep.key}-curl` ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-3.5 h-3.5" />
                    curl
                  </>
                )}
              </button>
            </div>

            <pre className="mt-1 overflow-x-auto scrollbar-thin rounded-lg bg-black/30 border border-white/8 p-2.5 text-[11px] font-mono text-ink-300 leading-5 whitespace-pre-wrap break-words">
              {ep.curl}
            </pre>
          </article>
        ))}
      </div>
    </section>
  );
}
