'use client';

import { useState } from 'react';
import type { Project } from '@/types/project';
import {
  EditIcon,
  ExternalIcon,
  GitHubIcon,
  StarIcon,
  ImageIcon,
} from './icons';

interface ProjectDetailProps {
  project: Project;
  onEdit: () => void;
}

const STATUS_STYLES: Record<Project['status'], string> = {
  published:
    'bg-mint-500/15 text-mint-400 ring-1 ring-inset ring-mint-500/25',
  draft: 'bg-amber-400/15 text-amber-300 ring-1 ring-inset ring-amber-400/25',
  archived: 'bg-white/10 text-ink-300 ring-1 ring-inset ring-white/10',
};

export default function ProjectDetail({ project, onEdit }: ProjectDetailProps) {
  const [imgError, setImgError] = useState(false);
  const created = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const updated = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Cover */}
      <div className="relative rounded-2xl overflow-hidden h-56 bg-gradient-to-br from-iris-500/20 via-violet-accent/10 to-mint-500/10 -mx-1">
        {project.imageUrl && !imgError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <ImageIcon className="w-12 h-12 text-ink-500" />
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            {project.title}
          </h2>
          <p className="text-xs text-ink-500 mt-1">
            Created {created} · Updated {updated}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {project.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-iris-500/25 to-violet-accent/25 text-iris-200 text-xs font-semibold ring-1 ring-inset ring-iris-400/30">
              <StarIcon className="w-3 h-3" />
              Featured
            </span>
          )}
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_STYLES[project.status]}`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Short description */}
      <p className="text-sm text-ink-200 leading-relaxed">
        {project.description}
      </p>

      {/* Long description */}
      {project.longDescription && (
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2">
            About this project
          </p>
          <p className="text-sm text-ink-300 leading-relaxed whitespace-pre-wrap">
            {project.longDescription}
          </p>
        </div>
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2">
            Tech stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/8 text-ink-200 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {(project.githubUrl || project.demoUrl) && (
        <div className="flex items-center gap-2 flex-wrap">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/8 hover:bg-white/[0.08] text-ink-100 text-sm font-medium transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              View source
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-iris-500 to-violet-accent text-white text-sm font-semibold shadow-glow hover:brightness-110 transition-all"
            >
              <ExternalIcon className="w-4 h-4" />
              Live demo
            </a>
          )}
        </div>
      )}

      <div className="flex justify-end pt-3 border-t border-white/8">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/8 hover:bg-white/[0.08] text-ink-100 text-sm font-medium transition-colors"
        >
          <EditIcon className="w-4 h-4" />
          Edit project
        </button>
      </div>
    </div>
  );
}
