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
import styles from './PortDeck.module.css';

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
    <article className={`${styles.projectCard} ${styles.glass} ${styles.shadowCard}`}>
      {/* Thumbnail */}
      <button
        type="button"
        onClick={() => onView(project)}
        className={styles.projectCardThumb}
        aria-label={`View ${project.title}`}
      >
        {project.imageUrl && !imgError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className={styles.projectCardImage}
              onError={() => setImgError(true)}
            />
            <div className={styles.projectCardOverlay} />
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
          <span className={styles.projectCardFeatured}>
            <StarIcon className="w-3 h-3" />
            Featured
          </span>
        )}

        {/* Status pill */}
        <span
          className={`${styles.projectCardStatus} ${STATUS_STYLES[project.status]}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[project.status]}`} />
          {STATUS_LABEL[project.status]}
        </span>
      </button>

      {/* Content */}
      <div className={styles.projectCardContent}>
        <div>
          <h3
            className={`${styles.projectCardTitle} ${styles.lineClamp1}`}
            onClick={() => onView(project)}
          >
            {project.title || 'Untitled project'}
          </h3>
          <p className={`${styles.projectCardDescription} ${styles.lineClamp2}`}>
            {project.description || 'No description yet.'}
          </p>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className={styles.projectCardTags}>
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className={styles.tagChipMuted}
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className={styles.tagChipMuted}>
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className={styles.projectCardFooter}>
          <span className={styles.projectCardMeta}>Updated {updatedDate}</span>
          <div className={styles.projectCardLinks}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.projectCardLink}
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
                className={styles.projectCardLink}
                title="Live demo"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalIcon className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => onEdit(project)}
              className={styles.projectCardLink}
              title="Edit"
            >
              <EditIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className={`${styles.projectCardLink} ${styles.projectCardLinkDanger}`}
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
