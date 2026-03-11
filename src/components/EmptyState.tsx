interface EmptyStateProps {
  filtered: boolean;
  onNewProject: () => void;
}

export default function EmptyState({ filtered, onNewProject }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800 mb-4">
        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      </div>
      {filtered ? (
        <>
          <h3 className="text-base font-semibold text-white mb-1">No projects match</h3>
          <p className="text-sm text-slate-400">Try adjusting your search or filter criteria.</p>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold text-white mb-1">No projects yet</h3>
          <p className="text-sm text-slate-400 mb-5">Get started by adding your first portfolio project.</p>
          <button
            onClick={onNewProject}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Project
          </button>
        </>
      )}
    </div>
  );
}
