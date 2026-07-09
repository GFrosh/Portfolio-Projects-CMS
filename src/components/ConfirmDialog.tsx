'use client';

import { useEffect } from 'react';
import { AlertIcon } from './icons';
import styles from './PortDeck.module.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div className={styles.confirmOverlay}>
      <div className={`${styles.confirmPanel} ${styles.glassStrong} ${styles.shadowCard}`}>
        <div className="flex items-start gap-4">
          <div className={styles.confirmIconWrap}>
            <AlertIcon className="w-5 h-5 text-rose-soft" />
          </div>
          <div>
            <h3 className={styles.confirmTitle}>{title}</h3>
            <p className={styles.confirmMessage}>
              {message}
            </p>
          </div>
        </div>
        <div className={styles.confirmActions}>
          <button
            onClick={onCancel}
            className={styles.buttonSecondary}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={styles.buttonDanger}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
