import type { Project } from '../types/project';

interface ProjectDetailProps {
  project: Project;
  onEdit: () => void;
}

const STATUS_STYLES: Record<Project['status'], string> = {
  published: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30',
  draft:     'bg-amber-500/15 text-amber-400 ring-1 ring-inset ring-amber-500/30',
  archived:  'bg-slate-500/15 text-slate-400 ring-1 ring-inset ring-slate-500/30',
};

export default function ProjectDetail({ project, onEdit }: ProjectDetailProps) {
  const created = new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const updated = new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-5">
      {/* Cover image */}
      {project.imageUrl && (
        <div className="rounded-xl overflow-hidden h-52 bg-slate-800 -mx-1">
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Title + badges */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-white">{project.title}</h2>
          <p className="text-xs text-slate-500 mt-1">Created {created} · Updated {updated}</p>
        </div>
        <div className="flex items-center gap-2">
          {project.featured && (
            <span className="px-2.5 py-1 rounded-lg bg-brand-600/20 text-brand-300 text-xs font-medium ring-1 ring-inset ring-brand-500/30">
              Featured
            </span>
          )}
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_STYLES[project.status]}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Short description */}
      <p className="text-sm text-slate-300 leading-relaxed">{project.description}</p>

      {/* Long description */}
      {project.longDescription && (
        <div className="prose prose-sm prose-invert max-w-none">
          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">{project.longDescription}</p>
        </div>
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {(project.githubUrl || project.demoUrl) && (
        <div className="flex items-center gap-3 flex-wrap">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View on GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Live Demo
            </a>
          )}
        </div>
      )}

      {/* Edit button */}
      <div className="flex justify-end pt-2 border-t border-slate-800">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit Project
        </button>
      </div>
    </div>
  );
}
