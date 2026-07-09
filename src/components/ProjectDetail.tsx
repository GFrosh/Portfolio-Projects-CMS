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
import styles from './PortDeck.module.css';

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
    <div className={styles.detailShell}>
      {/* Cover */}
      <div className={styles.detailCover}>
        {project.imageUrl && !imgError ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className={styles.detailImage}
              onError={() => setImgError(true)}
            />
            <div className={styles.detailOverlay} />
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <ImageIcon className="w-12 h-12 text-ink-500" />
          </div>
        )}
      </div>

      {/* Header */}
      <div className={styles.detailHeader}>
        <div>
          <h2 className={styles.detailTitle}>
            {project.title}
          </h2>
          <p className={styles.detailMeta}>
            Created {created} · Updated {updated}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {project.featured && (
            <span className={styles.projectCardFeatured}>
              <StarIcon className="w-3 h-3" />
              Featured
            </span>
          )}
          <span
            className={`${styles.projectCardStatus} ${STATUS_STYLES[project.status]}`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Short description */}
      <p className={styles.detailText}>
        {project.description}
      </p>

      {/* Long description */}
      {project.longDescription && (
        <div className={styles.detailPanel}>
          <p className={styles.detailPanelTitle}>
            About this project
          </p>
          <p className={styles.detailText} style={{ whiteSpace: 'pre-wrap', color: 'var(--color-ink-300)' }}>
            {project.longDescription}
          </p>
        </div>
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <div>
          <p className={styles.detailTagsTitle}>
            Tech stack
          </p>
          <div className={styles.detailTags}>
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={styles.tagChipMuted}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {(project.githubUrl || project.demoUrl) && (
        <div className={styles.detailActions}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.buttonSecondary} ${styles.detailActionButton}`}
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
              className={`${styles.buttonPrimary} ${styles.detailActionButton}`}
            >
              <ExternalIcon className="w-4 h-4" />
              Live demo
            </a>
          )}
        </div>
      )}

      <div className={styles.detailFooter}>
        <button
          onClick={onEdit}
          className={`${styles.buttonSecondary} ${styles.detailActionButton}`}
        >
          <EditIcon className="w-4 h-4" />
          Edit project
        </button>
      </div>
    </div>
  );
}
