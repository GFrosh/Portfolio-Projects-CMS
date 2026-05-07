import { useEffect, useMemo, useRef, useState } from 'react';
import Header from './Header';
import Modal from './Modal';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import ProjectDetail from './ProjectDetail';
import ConfirmDialog from './ConfirmDialog';
import EmptyState from './EmptyState';
import { useProjects } from '../hooks/useProjects';
import type { AuthUser } from '../types/auth';
import type { Project, FilterStatus, SortField, SortOrder } from '../types/project';
import Portal from '../data/auth/Portal';

interface DashboardPageProps {
  user: AuthUser;
  signOut: () => Promise<void>;
}

type ModalMode =
  | { type: 'create' }
  | { type: 'edit'; project: Project }
  | { type: 'view'; project: Project }
  | { type: 'delete'; projectId: string; title: string };

export default function DashboardPage({ user, signOut }: DashboardPageProps) {
  const { projects, loading, error, addProject, updateProject, deleteProject } = useProjects();
  const [modal, setModal] = useState<ModalMode | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

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
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'title') {
        cmp = a.title.localeCompare(b.title);
      } else {
        cmp = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [projects, search, filterStatus, sortField, sortOrder]);

  const publishedCount = useMemo(() => projects.filter((p) => p.status === 'published').length, [projects]);

  const closeModal = () => setModal(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const endpoints = useMemo(() => {
    const base = Portal.BASE_URL.replace(/\/$/, '');
    const userPath = `/api/users/${encodeURIComponent(user.name)}/projects`;
    const publicPath = `/api/public/projects`;
    const singlePath = (id = '{id}') => `/api/projects/${id}`;

    return [
      {
        key: 'user-projects',
        title: 'Your Projects (private)',
        url: `${base}${userPath}`,
        curl: `curl -H "Authorization: Bearer <TOKEN>" ${base}${userPath}`,
      },
      {
        key: 'public-projects',
        title: 'Public Projects (published)',
        url: `${base}${publicPath}`,
        curl: `curl ${base}${publicPath}`,
      },
      {
        key: 'single-project',
        title: 'Single Project by ID',
        url: `${base}${singlePath()}`,
        curl: `curl -H "Authorization: Bearer <TOKEN>" ${base}${singlePath()}`,
      },
    ];
  }, [user.id]);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage(key);

      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }

      toastTimerRef.current = window.setTimeout(() => {
        setToastMessage(null);
      }, 2200);
    } catch (e) {
      console.error('Copy failed', e);
      setToastMessage('Copy failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950/80">
      <Header
        totalProjects={projects.length}
        publishedCount={publishedCount}
        currentUser={user}
        onSignOut={signOut}
        onNewProject={() => setModal({ type: 'create' })}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur p-3 sm:p-4 mb-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_220px] lg:items-center">
            <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-brand-500 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors"
            />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-brand-500 text-sm text-slate-300 outline-none transition-colors"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <div className="flex gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-brand-500 text-sm text-slate-300 outline-none transition-colors"
            >
              <option value="updatedAt">Last updated</option>
              <option value="createdAt">Created</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              className="px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <svg className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
              </svg>
            </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        {!loading && projects.length > 0 && (
          <p className="text-xs text-slate-500 mb-4">
            Showing {filtered.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        )}

        {!loading && filtered.length === 0 ? (
          <EmptyState
            filtered={projects.length > 0}
            onNewProject={() => setModal({ type: 'create' })}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={(p) => setModal({ type: 'view', project: p })}
                onEdit={(p) => setModal({ type: 'edit', project: p })}
                onDelete={(id) => setModal({ type: 'delete', projectId: id, title: project.title })}
              />
            ))}
          </div>
        )}
      </main>

      <aside className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pb-8">
        <section className="mt-2 sm:mt-8 rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur p-4 sm:p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-100">Export & Endpoints</h2>
              <p className="text-sm text-slate-400 max-w-2xl">Copy endpoints and example commands for exposing project data to portfolio tooling or external integrations.</p>
            </div>
            <p className="text-xs text-slate-500">Optimized for mobile and desktop</p>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {endpoints.map((ep) => (
              <article key={ep.key} className="rounded-2xl border border-slate-800 bg-slate-950/55 p-4 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{ep.title}</div>
                    <div className="mt-1 text-sm text-slate-100 break-all leading-5">{ep.url}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleCopy(ep.url, `${ep.key}-url`)}
                    className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleCopy(ep.curl, `${ep.key}-curl`)}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm font-medium text-slate-200 hover:border-slate-600 transition-colors"
                  >
                    Copy curl
                  </button>
                </div>

                <pre className="overflow-x-auto rounded-xl bg-slate-900/80 p-3 text-xs text-slate-300 leading-5 whitespace-pre-wrap break-words">
                  {ep.curl}
                </pre>
              </article>
            ))}
          </div>
        </section>
      </aside>

      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-2xl border border-slate-700 bg-slate-950/95 px-4 py-3 shadow-2xl backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-brand-600/20 text-brand-300">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-100">Copied to clipboard</p>
              <p className="text-xs text-slate-400 break-words">{toastMessage}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="rounded-lg p-1 text-slate-500 hover:text-slate-200"
              aria-label="Dismiss toast"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {modal?.type === 'create' && (
        <Modal title="New Project" onClose={closeModal} size="lg">
          <ProjectForm
            submitLabel="Create Project"
            onCancel={closeModal}
            onSubmit={(data) => { addProject(data); closeModal(); }}
          />
        </Modal>
      )}

      {modal?.type === 'edit' && (
        <Modal title="Edit Project" onClose={closeModal} size="lg">
          <ProjectForm
            initial={{ ...modal.project }}
            submitLabel="Save Changes"
            onCancel={closeModal}
            onSubmit={(data) => { updateProject(modal.project.id, data); closeModal(); }}
          />
        </Modal>
      )}

      {modal?.type === 'view' && (
        <Modal title={modal.project.title} onClose={closeModal} size="xl">
          <ProjectDetail
            project={modal.project}
            onEdit={() => setModal({ type: 'edit', project: modal.project })}
          />
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <ConfirmDialog
          title="Delete Project"
          message={`Are you sure you want to delete "${modal.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onCancel={closeModal}
          onConfirm={() => { deleteProject(modal.projectId); closeModal(); }}
        />
      )}
    </div>
  );
}
