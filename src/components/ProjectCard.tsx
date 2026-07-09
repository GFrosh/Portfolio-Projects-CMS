'use client';

import { useState } from 'react';
import type { Project } from '@/types/project';
import {
  EditIcon,
  TrashIcon,
  ExternalIcon,
  GitHubIcon,
  StarIcon,
  ImageIcon,
} from './icons';

const STATUS_STYLES: Record<Project['status'], string> = {
  published:
    'bg-mint-500/15 text-mint-400 ring-1 ring-inset ring-mint-500/25',
  draft: 'bg-amber-400/15 text-amber-300 ring-1 ring-inset ring-amber-400/25',
  archived: 'bg-white/10 text-ink-300 ring-1 ring-inset ring-white/10',
};

const STATUS_DOT: Record<Project['status'], string> = {
  published: 'bg-mint-400',
  draft: 'bg-amber-300',
  archived: 'bg-ink-400',
};

const STATUS_LABEL: Record<Project['status'], string> = {
  published: 'Published',
  draft: 'Draft',
  archived: 'Archived',
};

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onView: (project: Project) => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  onView,
}: ProjectCardProps) {
  const [imgError, setImgError] = useState(false);
  const updatedDate = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group relative flex flex-col rounded-2xl overflow-hidden glass hover:border-white/20 hover:shadow-card transition-all duration-300 hover:-translate-y-0.5">
      {/* Thumbnail */}
      <button
        type="button"
        onClick={() => onView(project)}
        className="relative h-40 bg-gradient-to-br from-iris-500/20 via-violet-accent/10 to-mint-500/10 overflow-hidden text-left focus:outline-none"
        aria-label={`View ${project.title}`}
      >
        {project.imageUrl && !imgError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex flex-col items-center gap-2 text-ink-500">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs uppercase tracking-wider">
                No cover
              </span>
            </div>
          </div>
        )}

        {/* Featured badge */}
        {project.featured && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-iris-500 to-violet-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg shadow-iris-900/30">
            <StarIcon className="w-3 h-3" />
            Featured
          </span>
        )}

        {/* Status pill */}
        <span
          className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[project.status]}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[project.status]}`} />
          {STATUS_LABEL[project.status]}
        </span>
      </button>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3
            className="text-sm font-semibold text-white leading-snug cursor-pointer hover:text-iris-300 transition-colors line-clamp-1"
            onClick={() => onView(project)}
          >
            {project.title || 'Untitled project'}
          </h3>
          <p className="text-xs text-ink-400 mt-1 line-clamp-2 leading-relaxed min-h-[2.4em]">
            {project.description || 'No description yet.'}
          </p>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/5 text-ink-200 text-[10px] font-medium"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-ink-400 text-[10px]">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/8">
          <span className="text-[11px] text-ink-500">Updated {updatedDate}</span>
          <div className="flex items-center gap-0.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-ink-400 hover:text-white hover:bg-white/10 transition-colors"
                title="GitHub"
                onClick={(e) => e.stopPropagation()}
              >
                <GitHubIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-ink-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Live demo"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalIcon className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 rounded-lg text-ink-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Edit"
            >
              <EditIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-1.5 rounded-lg text-ink-400 hover:text-rose-soft hover:bg-rose-500/10 transition-colors"
              title="Delete"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
