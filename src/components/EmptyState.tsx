'use client';

import { PlusIcon, ImageIcon } from './icons';

interface EmptyStateProps {
  filtered: boolean;
  onNewProject: () => void;
}

export default function EmptyState({ filtered, onNewProject }: EmptyStateProps) {
  return (
    <div className="glass rounded-3xl flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-iris-500/15 to-violet-accent/15 border border-white/10 mb-5">
        <ImageIcon className="w-10 h-10 text-ink-400" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-mint-500 shadow-lg shadow-mint-500/40" />
      </div>
      {filtered ? (
        <>
          <h3 className="text-lg font-semibold text-white mb-1">
            No projects match
          </h3>
          <p className="text-sm text-ink-400 max-w-sm">
            Try adjusting your search or filter criteria to find what you&apos;re
            looking for.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-white mb-1">
            Start your deck
          </h3>
          <p className="text-sm text-ink-400 mb-6 max-w-sm">
            Add your first portfolio project — import from GitHub or start from a
            blank slate.
          </p>
          <button
            onClick={onNewProject}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-iris-500 to-violet-accent text-white text-sm font-semibold shadow-glow hover:brightness-110 transition-all"
          >
            <PlusIcon className="w-4 h-4" />
            Add your first project
          </button>
        </>
      )}
    </div>
  );
}
