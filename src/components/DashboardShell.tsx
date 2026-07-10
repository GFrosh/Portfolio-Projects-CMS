'use client';

import { useEffect, useMemo, useState } from 'react';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import EmptyState from './EmptyState';
import ProjectForm from './ProjectForm';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';
import EndpointsPanel from './EndpointsPanel';
import { LogoMarkIcon, PlusIcon, SearchIcon, SignOutIcon, SortIcon, GridIcon, ListIcon } from './icons';
import styles from './PortDeck.module.css';
import type { Session } from 'next-auth';

interface DashboardShellProps {
	user: Session['user'];
	signOut: () => Promise<void>;
}

type ModalMode =
  | { type: 'create' }
  | { type: 'edit'; project: any }
  | { type: 'view'; project: any }
  | { type: 'delete'; projectId: string; title: string };

type FilterStatus = 'all' | 'published' | 'draft' | 'archived';
type SortField = 'updatedAt' | 'createdAt' | 'title';
type SortOrder = 'asc' | 'desc';

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
  { value: 'archived', label: 'Archived' },
];

export default function DashboardShell({ user, signOut }: DashboardShellProps) {
	const [modal, setModal] = useState<ModalMode | null>(null);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
	const [sortField, setSortField] = useState<SortField>('updatedAt');
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
	const [view, setView] = useState<'grid' | 'list'>('grid');
	const [projects, setProjects] = useState<any[]>([]);



	useEffect(() => {
		let cancelled = false;
		async function loadProjects() {
			setLoading(true);
			setError(null);
			try {
				const res = await fetch('/api/projects');
				if (!res.ok) throw new Error('Failed to load projects');
				const data = await res.json();
				if (!cancelled) setProjects(data);
			} catch (err) {
				if (!cancelled) setError(err instanceof Error ? err.message : 'Something went wrong');
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		loadProjects();
		return () => {
			cancelled = true;
		};
	}, []);

	const filtered = useMemo(() => {
		let list = [...projects];
		if (filterStatus !== 'all') list = list.filter((p) => p.status === filterStatus);
		if (search.trim()) {
		const q = search.toLowerCase();
		list = list.filter(
			(p) =>
			p.title.toLowerCase().includes(q) ||
			p.description.toLowerCase().includes(q) ||
			p.tags.some((t: any) => t.toLowerCase().includes(q)),
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
  	const displayName = user?.name || user?.email || 'Account';
  	const initials = displayName.split(/\s+/).map((s: string) => s.charAt(0).toUpperCase()).slice(0, 2).join('');
  
	return (
	<div className={styles.dashboardShell}>
		<header className={styles.dashboardHeader}>
		<div className={styles.dashboardHeaderInner}>
			<div className={styles.dashboardBrand}>
			<div className={`${styles.logoMark} ${styles.dashboardBrandMark}`}>
				<LogoMarkIcon style={{ width: '1rem', height: '1rem', color: '#fff' }} />
			</div>
			<div>
				<p className={styles.authBrandName} style={{ lineHeight: 1 }}>PortDeck</p>
				<p className={styles.dashboardBrandCounts}>{counts.published} published · {projects.length} total</p>
			</div>
			</div>

			<div className={styles.dashboardActions}>
			<button onClick={() => setModal({ type: 'create' })} className={styles.buttonPrimary}>
				<PlusIcon style={{ width: '1rem', height: '1rem' }} />
				<span className="hidden sm:inline">New Project</span>
				<span className="sm:hidden">New</span>
			</button>

			<div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10">
				<div className={styles.dashboardAvatar} title={displayName}>{initials || 'U'}</div>
				<div className={styles.dashboardAvatarName}>{displayName}</div>
			</div>

			<button onClick={signOut} className={styles.buttonSecondary} title="Sign out" aria-label="Sign out">
				<SignOutIcon style={{ width: '1rem', height: '1rem' }} />
				<span className="hidden md:inline">Sign out</span>
			</button>
			</div>
		</div>
		</header>

		<main className={styles.dashboardMain}>
		<section className={`${styles.dashboardSection} ${styles.glass}`}>
			<div className={styles.heroHeader}>
			<div>
				<p className={styles.heroKicker}>Dashboard</p>
				<h1 className={styles.heroTitle}>Welcome back, <span className={styles.textGradient}>{displayName.split(' ')[0] || 'friend'}</span></h1>
				<p className={styles.heroLead}>Manage the projects that shape your portfolio.</p>
			</div>
			<div className={styles.statsGrid}>
				<Stat label="Total" value={projects.length} tone="iris" />
				<Stat label="Published" value={counts.published} tone="mint" />
				<Stat label="Drafts" value={counts.drafts} tone="amber" />
				<Stat label="Featured" value={counts.featured} tone="violet" />
			</div>
			</div>
		</section>

		<section className={`${styles.dashboardSection} ${styles.toolbarSection} ${styles.glass}`}>
			<div className={styles.toolbar}>
			<div className={styles.searchWrap}>
				<SearchIcon className={styles.searchIcon} style={{ width: '1rem', height: '1rem' }} />
				<input
				type="text"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Search title, description, tags…"
				className={`${styles.input} ${styles.searchInput}`}
				/>
			</div>

			<div className={`${styles.filterBar} ${styles.scrollThin}`}>
				{STATUS_OPTIONS.map((opt) => (
				<button
					key={opt.value}
					onClick={() => setFilterStatus(opt.value)}
					className={`${styles.filterButton} ${filterStatus === opt.value ? styles.filterButtonActive : ''}`}
				>
					{opt.label}
				</button>
				))}
			</div>

			<div className={styles.sortGroup}>
				<select value={sortField} onChange={(e) => setSortField(e.target.value as SortField)} className={`${styles.select} ${styles.input}`}>
				<option value="updatedAt">Last updated</option>
				<option value="createdAt">Created</option>
				<option value="title">Title</option>
				</select>
				<button onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))} className={styles.buttonSecondary} title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}>
				<SortIcon style={{ width: '1rem', height: '1rem', transform: sortOrder === 'asc' ? 'rotate(180deg)' : undefined }} />
				</button>
				<div className={styles.viewGroup}>
				<button onClick={() => setView('grid')} className={`${styles.viewButton} ${view === 'grid' ? styles.viewButtonActive : ''}`} title="Grid view">
					<GridIcon style={{ width: '1rem', height: '1rem' }} />
				</button>
				<button onClick={() => setView('list')} className={`${styles.viewButton} ${view === 'list' ? styles.viewButtonActive : ''}`} title="List view">
					<ListIcon style={{ width: '1rem', height: '1rem' }} />
				</button>
				</div>
			</div>
			</div>
		</section>

		{loading && (
			<div className={styles.loadingRow}>
			<div className={styles.loaderStack}>
				<div className={styles.loaderSpinner} />
				<p className={styles.loaderText}>Loading projects…</p>
			</div>
			</div>
		)}

		{error && <div className={styles.errorRow}>{error}</div>}

		{!loading && projects.length > 0 && (
			<p className={styles.countRow}>Showing {filtered.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}</p>
		)}

		{!loading && filtered.length === 0 ? (
			<EmptyState filtered={projects.length > 0} onNewProject={() => setModal({ type: 'create' })} />
		) : view === 'grid' ? (
			<div className={styles.cardsGrid}>
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
		) : (
			<div className={styles.rowsList}>
			{filtered.map((project) => (
				<ProjectRow
				key={project.id}
				project={project}
				onView={() => setModal({ type: 'view', project })}
				onEdit={() => setModal({ type: 'edit', project })}
				onDelete={() => setModal({ type: 'delete', projectId: project.id, title: project.title })}
				/>
			))}
			</div>
		)}

		<EndpointsPanel user={user} />
		</main>

		{modal?.type === 'create' && (
		<Modal title="New project" subtitle="Add a new entry to your portfolio." onClose={closeModal} size="lg">
			<ProjectForm submitLabel="Create project" onCancel={closeModal} onSubmit={(data) => { console.log(`Supposed to create project: ${data.title}`); closeModal(); }} />
		</Modal>
		)}

		{modal?.type === 'edit' && (
		<Modal title="Edit project" subtitle={modal.project.title} onClose={closeModal} size="lg">
			<ProjectForm initial={{ ...modal.project }} submitLabel="Save changes" onCancel={closeModal} onSubmit={(data) => { console.log(`Supposed to update project: ${modal.project.title}`); closeModal(); }} />
		</Modal>
		)}

		{modal?.type === 'view' && (
		<Modal title={modal.project.title} subtitle="Project details" onClose={closeModal} size="xl">
			<ProjectDetail project={modal.project} onEdit={() => setModal({ type: 'edit', project: modal.project })} />
		</Modal>
		)}

		{modal?.type === 'delete' && (
		<ConfirmDialog
			title="Delete project"
			message={`Are you sure you want to delete "${modal.title}"? This action cannot be undone.`}
			confirmLabel="Delete"
			onCancel={closeModal}
			onConfirm={() => { console.log(`Supposed to delete project: ${modal.title}`); closeModal(); }}
		/>
		)}
	</div>
	);
	}

	function Stat({ label, value, tone }: { label: string; value: number; tone: 'iris' | 'mint' | 'amber' | 'violet' }) {
	const toneClass = tone === 'iris' ? styles.statToneIris : tone === 'mint' ? styles.statToneMint : tone === 'amber' ? styles.statToneAmber : styles.statToneViolet;
	return (
	<div className={`${styles.statCard} ${toneClass} ${styles.shadowCard}`}>
		<p className={styles.statLabel}>{label}</p>
		<p className={styles.statValue}>{value}</p>
	</div>
	);
	}

	function ProjectRow({ project, onView, onEdit, onDelete }: { project: any; onView: () => void; onEdit: () => void; onDelete: () => void; }) {
	const statusClass = project.status === 'published' ? styles.statusPublished : project.status === 'draft' ? styles.statusDraft : styles.statusArchived;
	const statusDot = project.status === 'published' ? styles.statusDotPublished : project.status === 'draft' ? styles.statusDotDraft : styles.statusDotArchived;

	return (
	<article className={`${styles.rowCard} ${styles.glass}`}>
		<button onClick={onView} className={styles.rowBody}>
		<div className={styles.rowThumb}>
			{project.imageUrl ? (
			/* eslint-disable-next-line @next/next/no-img-element */
			<img
				src={project.imageUrl}
				alt=""
				style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
			/>
			) : (
			<span className={styles.rowThumbFallback}>{project.title.slice(0, 2).toUpperCase()}</span>
			)}
		</div>
		<div className={styles.rowBody}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
			<p className={styles.rowTitle}>{project.title || 'Untitled'}</p>
			<span className={`${styles.projectCardStatus} ${statusClass}`}>
				<span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
				{project.status}
			</span>
			{project.featured && <span className={styles.heroKicker} style={{ fontSize: '0.625rem' }}>★ Featured</span>}
			</div>
			<p className={styles.rowDescription}>{project.description || 'No description'}</p>
		</div>
		</button>

		<div className={styles.rowMeta}>
		{new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
		</div>

		<div className={styles.rowActions}>
		<button onClick={onEdit} className={styles.rowActionButton}>Edit</button>
		<button onClick={onDelete} className={`${styles.rowActionButton} ${styles.rowActionDanger}`}>Delete</button>
		</div>
	</article>
	);
}
