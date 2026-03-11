import { useState, useMemo } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import ProjectCard from './components/ProjectCard';
import ProjectForm from './components/ProjectForm';
import ProjectDetail from './components/ProjectDetail';
import ConfirmDialog from './components/ConfirmDialog';
import EmptyState from './components/EmptyState';
import { useProjects } from './hooks/useProjects';
import type { Project, FilterStatus, SortField, SortOrder } from './types/project';

type ModalMode =
  | { type: 'create' }
  | { type: 'edit'; project: Project }
  | { type: 'view'; project: Project }
  | { type: 'delete'; projectId: string; title: string };

export default function App() {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [modal, setModal] = useState<ModalMode | null>(null);

  // Toolbar state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

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

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header
        totalProjects={projects.length}
        publishedCount={publishedCount}
        onNewProject={() => setModal({ type: 'create' })}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-brand-500 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Filter by status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-brand-500 text-sm text-slate-300 outline-none transition-colors"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 focus:border-brand-500 text-sm text-slate-300 outline-none transition-colors"
            >
              <option value="updatedAt">Last updated</option>
              <option value="createdAt">Created</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <svg className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Results count */}
        {projects.length > 0 && (
          <p className="text-xs text-slate-500 mb-4">
            Showing {filtered.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
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

      {/* Create modal */}
      {modal?.type === 'create' && (
        <Modal title="New Project" onClose={closeModal} size="lg">
          <ProjectForm
            submitLabel="Create Project"
            onCancel={closeModal}
            onSubmit={(data) => { addProject(data); closeModal(); }}
          />
        </Modal>
      )}

      {/* Edit modal */}
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

      {/* View modal */}
      {modal?.type === 'view' && (
        <Modal title={modal.project.title} onClose={closeModal} size="xl">
          <ProjectDetail
            project={modal.project}
            onEdit={() => setModal({ type: 'edit', project: modal.project })}
          />
        </Modal>
      )}

      {/* Delete confirmation */}
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
