'use client';

import { useMemo, useState } from 'react';
import type { AuthUser } from '@/types/auth';
import type {
  Project,
  FilterStatus,
  SortField,
  SortOrder,
} from '@/types/project';
import { useProjects } from '@/hooks/useProjects';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import EmptyState from './EmptyState';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import ProjectDetail from './ProjectDetail';
import EndpointsPanel from './EndpointsPanel';
import {
  LogoMarkIcon,
  PlusIcon,
  SearchIcon,
  SignOutIcon,
  SortIcon,
  GridIcon,
  ListIcon,
} from './icons';

interface DashboardShellProps {
  user: AuthUser;
  signOut: () => Promise<void>;
}

type ModalMode =
  | { type: 'create' }
  | { type: 'edit'; project: Project }
  | { type: 'view'; project: Project }
  | { type: 'delete'; projectId: string; title: string };

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'archived', label: 'Archived' },
];

export default function DashboardShell({ user, signOut }: DashboardShellProps) {
  const { projects, loading, error, addProject, updateProject, deleteProject } =
    useProjects();
  const [modal, setModal] = useState<ModalMode | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    let list = [...projects];
    if (filterStatus !== 'all') {
      list = list.filter((p) => p.status === filterStatus);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'title') cmp = a.title.localeCompare(b.title);
      else cmp = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [projects, search, filterStatus, sortField, sortOrder]);

  const counts = useMemo(() => {
    const published = projects.filter((p) => p.status === 'published').length;
    const drafts = projects.filter((p) => p.status === 'draft').length;
    const archived = projects.filter((p) => p.status === 'archived').length;
    const featured = projects.filter((p) => p.featured).length;
    return { published, drafts, archived, featured };
  }, [projects]);

  const closeModal = () => setModal(null);
  const displayName = user.name || user.email || 'Account';
  const initials = displayName
    .split(/\s+/)
    .map((s) => s.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-white/8 bg-ink-950/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-iris-500 to-violet-accent flex items-center justify-center shadow-glow">
                <LogoMarkIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-none tracking-tight">
                  PortDeck
                </p>
                <p className="text-[11px] text-ink-400 mt-1">
                  {counts.published} published · {projects.length} total
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setModal({ type: 'create' })}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-iris-500 to-violet-accent text-white text-sm font-semibold shadow-glow hover:brightness-110 transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline">New Project</span>
                <span className="sm:hidden">New</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10">
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-iris-400 to-violet-accent flex items-center justify-center text-[11px] font-semibold text-white shadow-sm"
                  title={displayName}
                >
                  {initials || 'U'}
                </div>
                <div className="text-xs text-ink-300 max-w-[140px] truncate">
                  {displayName}
                </div>
              </div>

              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-ink-200 hover:text-white text-sm transition-colors"
                title="Sign out"
                aria-label="Sign out"
              >
                <SignOutIcon className="w-4 h-4" />
                <span className="hidden md:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Hero / stat pills */}
        <section className="glass rounded-3xl p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-iris-300">
                Dashboard
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome back,{' '}
                <span className="text-gradient">
                  {displayName.split(' ')[0] || 'friend'}
                </span>
              </h1>
              <p className="mt-1 text-sm text-ink-400">
                Manage the projects that shape your portfolio.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:min-w-[520px]">
              <Stat label="Total" value={projects.length} tone="iris" />
              <Stat label="Published" value={counts.published} tone="mint" />
              <Stat label="Drafts" value={counts.drafts} tone="amber" />
              <Stat label="Featured" value={counts.featured} tone="violet" />
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section className="glass rounded-2xl p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, description, tags…"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-iris-400 text-sm text-ink-100 placeholder:text-ink-500 outline-none transition-colors"
              />
            </div>

            {/* Segmented status filter */}
            <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1 overflow-x-auto scrollbar-thin">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterStatus(opt.value)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterStatus === opt.value
                      ? 'bg-gradient-to-r from-iris-500/90 to-violet-accent/90 text-white shadow-sm'
                      : 'text-ink-300 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Sort + view */}
            <div className="flex gap-2">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-iris-400 text-sm text-ink-100 outline-none transition-colors"
              >
                <option value="updatedAt">Last updated</option>
                <option value="createdAt">Created</option>
                <option value="title">Title</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
                }
                className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 text-ink-300 hover:text-white transition-colors"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                <SortIcon
                  className={`w-4 h-4 transition-transform ${
                    sortOrder === 'asc' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div className="hidden sm:inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    view === 'grid'
                      ? 'bg-white/10 text-white'
                      : 'text-ink-400 hover:text-white'
                  }`}
                  title="Grid view"
                >
                  <GridIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    view === 'list'
                      ? 'bg-white/10 text-white'
                      : 'text-ink-400 hover:text-white'
                  }`}
                  title="List view"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Loading / error / count */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-sm text-ink-400">
              <span className="w-4 h-4 border-2 border-ink-700 border-t-iris-400 rounded-full animate-spin" />
              Loading projects…
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-400/30 text-rose-200 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {!loading && projects.length > 0 && (
          <p className="text-xs text-ink-500 -mb-2">
            Showing {filtered.length} of {projects.length} project
            {projects.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Grid / list */}
        {!loading && filtered.length === 0 ? (
          <EmptyState
            filtered={projects.length > 0}
            onNewProject={() => setModal({ type: 'create' })}
          />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={(p) => setModal({ type: 'view', project: p })}
                onEdit={(p) => setModal({ type: 'edit', project: p })}
                onDelete={(id) =>
                  setModal({
                    type: 'delete',
                    projectId: id,
                    title: project.title,
                  })
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onView={() => setModal({ type: 'view', project })}
                onEdit={() => setModal({ type: 'edit', project })}
                onDelete={() =>
                  setModal({
                    type: 'delete',
                    projectId: project.id,
                    title: project.title,
                  })
                }
              />
            ))}
          </div>
        )}

        {/* Endpoints */}
        <EndpointsPanel user={user} />
      </main>

      {/* Modals */}
      {modal?.type === 'create' && (
        <Modal
          title="New project"
          subtitle="Add a new entry to your portfolio."
          onClose={closeModal}
          size="lg"
        >
          <ProjectForm
            submitLabel="Create project"
            onCancel={closeModal}
            onSubmit={(data) => {
              addProject(data);
              closeModal();
            }}
          />
        </Modal>
      )}

      {modal?.type === 'edit' && (
        <Modal
          title="Edit project"
          subtitle={modal.project.title}
          onClose={closeModal}
          size="lg"
        >
          <ProjectForm
            initial={{ ...modal.project }}
            submitLabel="Save changes"
            onCancel={closeModal}
            onSubmit={(data) => {
              updateProject(modal.project.id, data);
              closeModal();
            }}
          />
        </Modal>
      )}

      {modal?.type === 'view' && (
        <Modal
          title={modal.project.title}
          subtitle="Project details"
          onClose={closeModal}
          size="xl"
        >
          <ProjectDetail
            project={modal.project}
            onEdit={() => setModal({ type: 'edit', project: modal.project })}
          />
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <ConfirmDialog
          title="Delete project"
          message={`Are you sure you want to delete "${modal.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={closeModal}
          onConfirm={() => {
            deleteProject(modal.projectId);
            closeModal();
          }}
        />
      )}
    </div>
  );
}

/* -------- helpers -------- */

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'iris' | 'mint' | 'amber' | 'violet';
}) {
  const toneMap: Record<typeof tone, string> = {
    iris: 'from-iris-500/25 to-iris-500/5 text-iris-200',
    mint: 'from-mint-500/25 to-mint-500/5 text-mint-400',
    amber: 'from-amber-400/25 to-amber-400/5 text-amber-200',
    violet: 'from-fuchsia-500/25 to-fuchsia-500/5 text-fuchsia-200',
  };
  return (
    <div
      className={`rounded-2xl border border-white/8 bg-gradient-to-br ${toneMap[tone]} p-3.5`}
    >
      <p className="text-[10px] uppercase tracking-widest text-ink-300">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-white tabular-nums">
        {value}
      </p>
    </div>
  );
}

function ProjectRow({
  project,
  onView,
  onEdit,
  onDelete,
}: {
  project: Project;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const status = project.status;
  const statusStyle =
    status === 'published'
      ? 'bg-mint-500/15 text-mint-400 ring-mint-500/25'
      : status === 'draft'
      ? 'bg-amber-400/15 text-amber-300 ring-amber-400/25'
      : 'bg-white/10 text-ink-300 ring-white/10';

  return (
    <article className="group glass rounded-2xl px-4 py-3 flex items-center gap-4 hover:border-white/20 transition-colors">
      <button
        onClick={onView}
        className="min-w-0 flex-1 text-left flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-iris-500/25 to-violet-accent/15 border border-white/8 flex items-center justify-center shrink-0 overflow-hidden">
          {project.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={project.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="text-[11px] font-semibold text-white/70">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white truncate">
              {project.title || 'Untitled'}
            </p>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium ring-1 ring-inset ${statusStyle}`}
            >
              {status}
            </span>
            {project.featured && (
              <span className="text-[10px] uppercase tracking-widest text-iris-300 font-semibold">
                ★ Featured
              </span>
            )}
          </div>
          <p className="text-xs text-ink-400 truncate">
            {project.description || 'No description'}
          </p>
        </div>
      </button>

      <div className="hidden md:flex items-center gap-1 text-[11px] text-ink-500">
        <span>
          {new Date(project.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="px-2.5 py-1.5 rounded-lg text-xs text-ink-200 hover:text-white hover:bg-white/10 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-2.5 py-1.5 rounded-lg text-xs text-ink-300 hover:text-rose-soft hover:bg-rose-500/10 transition-colors"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
