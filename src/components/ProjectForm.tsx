'use client';

import { useState, type KeyboardEvent } from 'react';
import env from '@/lib/env';
import type { ProjectFormData, GitHubRepo } from '@/utils/types';
import { CloseIcon, GitHubIcon, ImageIcon } from './icons';
import styles from './PortDeck.module.css';



const EMPTY_FORM: ProjectFormData = {
	title: '',
	description: '',
	longDescription: '',
	tags: [],
	githubUrl: '',
	demoUrl: '',
	imageUrl: '',
	status: 'draft',
	featured: false,
};

interface ProjectFormProps {
	initial?: ProjectFormData;
	onSubmit: (data: ProjectFormData) => void;
	onCancel: () => void;
	submitLabel: string;
}

export default function ProjectForm({ initial, onSubmit, onCancel, submitLabel }: ProjectFormProps) {
	const [form, setForm] = useState<ProjectFormData>(initial ?? EMPTY_FORM);
	const [tagInput, setTagInput] = useState('');
	const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
	const [githubUsername, setGithubUsername] = useState('');
	const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
	const [selectedRepo, setSelectedRepo] = useState('');
	const [loadingRepos, setLoadingRepos] = useState(false);
	const [loadingRepoDetails, setLoadingRepoDetails] = useState(false);
	const [githubError, setGithubError] = useState('');
	const [imgPreviewError, setImgPreviewError] = useState(false);

	const set = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => {
		setForm((f) => ({ ...f, [key]: value }));
		if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
		if (key === 'imageUrl') setImgPreviewError(false);
	};

	const addTag = () => {
		const trimmed = tagInput.trim();
		if (trimmed && !form.tags.includes(trimmed)) set('tags', [...form.tags, trimmed]);
		setTagInput('');
	};

	const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addTag();
		}
		if (e.key === 'Backspace' && tagInput === '' && form.tags.length > 0) {
			set('tags', form.tags.slice(0, -1));
		}
	};

	const removeTag = (tag: string) => {
		set('tags', form.tags.filter((t) => t !== tag));
	};

	const validate = (): boolean => {
		const newErrors: typeof errors = {};
		if (!form.title.trim()) newErrors.title = 'Title is required.';
		if (!form.description.trim()) newErrors.description = 'Short description is required.';
		if (form.githubUrl && !/^https?:\/\/.+/.test(form.githubUrl)) newErrors.githubUrl = 'Must be a valid URL.';
		if (form.demoUrl && !/^https?:\/\/.+/.test(form.demoUrl)) newErrors.demoUrl = 'Must be a valid URL.';
		if (form.imageUrl && !/^https?:\/\/.+/.test(form.imageUrl)) newErrors.imageUrl = 'Must be a valid URL.';
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const fetchRepos = async () => {
		const username = githubUsername.trim();
		if (!username) {
			setGithubError('GitHub username is required.');
			return;
		}
		setLoadingRepos(true);
		setGithubError('');
		setSelectedRepo('');
		try {
			const res = await fetch(`/api/projects/github/user-repo?username=${encodeURIComponent(username)}`);
			if (!res.ok) {
				if (res.status === 404) throw new Error('GitHub user not found.');
				throw new Error('Failed to fetch repositories from GitHub.');
			}
			const data = await res.json();
			const repos = data.data as GitHubRepo[];
			console.log('Fetched repos:', repos);
			setGithubRepos(repos);
			if (repos.length === 0) setGithubError('No public repositories found for this user.');
		} catch (error) {
			setGithubRepos([]);
			setGithubError(error instanceof Error ? error.message : 'Could not load repositories.');
		} finally {
			setLoadingRepos(false);
		}
	};

	const fetchRepoDetailsAndFill = async (repoFullName: string) => {
		if (!repoFullName) return;
		setLoadingRepoDetails(true);
		setGithubError('');
		try {
			const res = await fetch(`/api/projects/github?repo=${encodeURIComponent(repoFullName)}`);
			if (!res.ok) throw new Error('Failed to fetch repository details.');
			const data = await res.json();
			const repo = data.data as GitHubRepo;
			const description = repo.description ?? '';
			const longDescriptionParts = [
				description,
				repo.language ? `Primary language: ${repo.language}.` : '',
				`Stars: ${repo.stargazers_count}.`,
				`Forks: ${repo.forks_count}.`,
				`Open issues: ${repo.open_issues_count}.`,
			].filter(Boolean);
			const normalizedTitle = repo.name.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
			const mergedTags = Array.from(new Set([...form.tags, ...(repo.topics ?? []), ...(repo.language ? [repo.language] : [])])).filter((tag) => tag.trim().length > 0);

			setForm((prev) => ({
				...prev,
				title: normalizedTitle || prev.title,
				description: description || prev.description,
				longDescription: longDescriptionParts.join(' ') || prev.longDescription,
				githubUrl: repo.html_url || prev.githubUrl,
				demoUrl: repo.homepage || prev.demoUrl,
				tags: mergedTags,
			}));
		} catch (error) {
			setGithubError(error instanceof Error ? error.message : 'Could not load repository details.');
		} finally {
			setLoadingRepoDetails(false);
		}
	};

	const handleSubmit = () => {
		if (validate()) onSubmit(form);
	};

	return (
		<div className={styles.formShell}>
			<section className={styles.importPanel}>
				<div className={styles.importHeader}>
					<GitHubIcon style={{ width: '1rem', height: '1rem', color: 'var(--color-ink-300)' }} />
					<p className={styles.importTitle}>Import from GitHub</p>
					<span className={styles.importBadge}>Optional</span>
				</div>

				<div className={styles.importGrid}>
					<input type="text" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="GitHub username" className={styles.input} />
					<button type="button" onClick={fetchRepos} disabled={loadingRepos} className={styles.buttonSecondary}>
						{loadingRepos ? 'Loading…' : 'Load repos'}
					</button>
				</div>

				{githubRepos.length > 0 && (
					<div className={styles.importGrid} style={{ marginTop: '0.5rem' }}>
						<select value={selectedRepo} onChange={(e) => setSelectedRepo(e.target.value)} className={styles.select}>
							<option value="">Select a repository</option>
							{githubRepos.map((repo) => (
								<option key={repo.id} value={repo.full_name}>{repo.full_name}</option>
							))}
						</select>
						<button type="button" onClick={() => fetchRepoDetailsAndFill(selectedRepo)} disabled={!selectedRepo || loadingRepoDetails} className={styles.buttonPrimary}>
							{loadingRepoDetails ? 'Importing…' : 'Import repo'}
						</button>
					</div>
				)}

				{githubError && <p className={styles.fieldHintBlock} style={{ color: 'var(--color-rose-soft)' }}>{githubError}</p>}
			</section>

			<Field label="Title" error={errors.title} required>
				<input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="My awesome project" className={`${styles.input} ${errors.title ? styles.inputError : ''}`} />
			</Field>

			<Field label="Short description" error={errors.description} required hint="Shown on the card">
				<textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="A brief summary of what this project is…" rows={2} className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`} />
			</Field>

			<Field label="Full description" hint="Optional">
				<textarea value={form.longDescription} onChange={(e) => set('longDescription', e.target.value)} placeholder="Tech used, challenges, outcomes, key insights…" rows={4} className={styles.textarea} />
			</Field>

			<Field label="Tags" hint="Press Enter or comma to add">
				<div className={`${styles.tagInputWrap} ${errors.tags ? styles.tagInputWrapError : ''}`}>
					{form.tags.map((tag) => (
						<span key={tag} className={styles.tagChip}>
							{tag}
							<button type="button" onClick={() => removeTag(tag)} className={styles.projectTagRemove} aria-label={`Remove ${tag}`}>
								<CloseIcon style={{ width: '0.75rem', height: '0.75rem' }} />
							</button>
						</span>
					))}
					<input
						type="text"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						onKeyDown={handleTagKeyDown}
						onBlur={addTag}
						placeholder={form.tags.length === 0 ? 'React, TypeScript, Next.js…' : ''}
						className={styles.tagInputField}
					/>
				</div>
			</Field>

			<div className={styles.dualGrid}>
				<Field label="GitHub URL" error={errors.githubUrl}>
					<input type="url" value={form.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} placeholder="https://github.com/…" className={`${styles.input} ${errors.githubUrl ? styles.inputError : ''}`} />
				</Field>
				<Field label="Demo URL" error={errors.demoUrl}>
					<input type="url" value={form.demoUrl} onChange={(e) => set('demoUrl', e.target.value)} placeholder="https://myapp.vercel.app" className={`${styles.input} ${errors.demoUrl ? styles.inputError : ''}`} />
				</Field>
			</div>

			<Field label="Cover image URL" error={errors.imageUrl}>
				<input type="url" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://…/cover.png" className={`${styles.input} ${errors.imageUrl ? styles.inputError : ''}`} />
				{form.imageUrl && !errors.imageUrl && (
					<div className={styles.previewWrap}>
						{!imgPreviewError ? (
							/* eslint-disable-next-line @next/next/no-img-element */
							<img src={form.imageUrl} alt="Preview" className={styles.previewImage} onError={() => setImgPreviewError(true)} />
						) : (
							<div className={styles.previewFallback}>
								<ImageIcon style={{ width: '1.5rem', height: '1.5rem' }} />
								<p style={{ fontSize: '0.75rem' }}>Cover unavailable</p>
							</div>
						)}
					</div>
				)}
			</Field>

			<div className={styles.statusGrid}>
				<Field label="Status" inline>
					<select value={form.status} onChange={(e) => set('status', e.target.value as ProjectFormData['status'])} className={`${styles.select} ${styles.input}`}>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
						<option value="archived">Archived</option>
					</select>
				</Field>

				<label className={styles.toggleLabel}>
					<div className={styles.toggleWrap}>
						<input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className={styles.toggleInput} />
						<div className={styles.toggleTrack} />
						<div className={styles.toggleThumb} />
					</div>
					<span style={{ color: 'var(--color-ink-200)', fontSize: '0.875rem' }}>Feature this project</span>
				</label>
			</div>

			<div className={styles.formActions}>
				<button type="button" onClick={onCancel} className={styles.buttonSecondary}>Cancel</button>
				<button type="button" onClick={handleSubmit} className={styles.buttonPrimary}>{submitLabel}</button>
			</div>
		</div>
	);
}

function Field({ label, children, error, hint, required, inline }: { label: string; children: React.ReactNode; error?: string; hint?: string; required?: boolean; inline?: boolean; }) {
	return (
		<div className={inline ? styles.fieldStackCompact : styles.fieldStack}>
			<label className={styles.fieldLabelInline}>
				{label}
				{required && <span style={{ color: 'var(--color-rose-soft)' }}>*</span>}
				{hint && <span className={styles.fieldHint}>· {hint}</span>}
			</label>
			{children}
			{error && <p style={{ margin: 0, color: 'var(--color-rose-soft)', fontSize: '0.75rem' }}>{error}</p>}
		</div>
	);
}