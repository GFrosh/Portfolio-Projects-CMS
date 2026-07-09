'use client';

import { useEffect, useRef } from 'react';
import { CloseIcon } from './icons';
import styles from './PortDeck.module.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
  subtitle?: string;
}

export default function Modal({
  title,
  onClose,
  children,
  size = 'lg',
  subtitle,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const sizeClass = {
    md: '28rem',
    lg: '42rem',
    xl: '56rem',
  }[size];

  return (
    <div
      ref={overlayRef}
      className={`${styles.modalOverlay} ${styles.glass}`}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={`${styles.modalPanel} ${styles.glassStrong} ${styles.shadowCard}`}
        style={{ maxWidth: sizeClass }}
      >
        <div className={styles.modalHeader}>
          <div style={{ minWidth: 0 }}>
            <h2 className={styles.modalTitle}>
              {title}
            </h2>
            {subtitle && (
              <p className={styles.modalSubtitle}>{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className={styles.modalCloseButton}
            aria-label="Close"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}
