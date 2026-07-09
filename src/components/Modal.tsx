'use client';

import { useEffect, useRef } from 'react';
import { CloseIcon } from './icons';

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
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-md overflow-y-auto py-8 px-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={`relative w-full ${sizeClass} glass-strong rounded-3xl shadow-card animate-scale-in`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-white/8">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-white tracking-tight truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-ink-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg text-ink-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
