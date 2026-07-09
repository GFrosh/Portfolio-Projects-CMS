'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { AuthUser } from '@/types/auth';
import Portal from '@/data/auth/Portal';
import { CheckIcon, CopyIcon } from './icons';
import styles from './PortDeck.module.css';

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
    <section className={`${styles.endpointsSection} ${styles.glass}`}>
      <div className={styles.endpointsHeader}>
        <div>
          <h2 className={styles.endpointsHeading}>
            Export & endpoints
          </h2>
          <p className={styles.endpointsCopy}>
            Wire your public portfolio site to these ready-to-use REST endpoints.
          </p>
        </div>
        <span className={styles.endpointsEyebrow}>
          Copy-paste friendly
        </span>
      </div>

      <div className={styles.endpointsGrid}>
        {endpoints.map((ep) => (
          <article
            key={ep.key}
            className={`${styles.endpointCard} ${styles.glassStrong}`}
            style={{ background: `linear-gradient(135deg, var(--color-ink-900), var(--color-ink-950))` }}
          >
            <div>
              <p className={styles.endpointSub}>
                {ep.subtitle}
              </p>
              <p className={styles.endpointTitle}>
                {ep.title}
              </p>
              <p className={styles.endpointUrl}>
                {ep.url}
              </p>
            </div>

            <div className={styles.endpointActions}>
              <button
                onClick={() => handleCopy(ep.url, `${ep.key}-url`)}
                className={styles.endpointButton}
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
                className={`${styles.endpointButton} ${styles.endpointButtonAlt}`}
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

            <pre className={styles.endpointCode}>
              {ep.curl}
            </pre>
          </article>
        ))}
      </div>
    </section>
  );
}
