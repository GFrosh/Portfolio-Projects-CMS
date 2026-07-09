'use client';

import { useState, type KeyboardEvent } from 'react';
import type { ProjectFormData } from '@/types/project';
import { CloseIcon, GitHubIcon, ImageIcon } from './icons';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

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

export default function ProjectForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormData>(initial ?? EMPTY_FORM);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProjectFormData, string>>
  >({});
  const [githubUsername, setGithubUsername] = useState('');
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [loadingRepoDetails, setLoadingRepoDetails] = useState(false);
  const [githubError, setGithubError] = useState('');
  const [imgPreviewError, setImgPreviewError] = useState(false);

  const set = <K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (key === 'imageUrl') setImgPreviewError(false);
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      set('tags', [...form.tags, trimmed]);
    }
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
    set(
      'tags',
      form.tags.filter((t) => t !== tag),
    );
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (!form.description.trim())
      newErrors.description = 'Short description is required.';
    if (form.githubUrl && !/^https?:\/\/.+/.test(form.githubUrl))
      newErrors.githubUrl = 'Must be a valid URL.';
    if (form.demoUrl && !/^https?:\/\/.+/.test(form.demoUrl))
      newErrors.demoUrl = 'Must be a valid URL.';
    if (form.imageUrl && !/^https?:\/\/.+/.test(form.imageUrl))
      newErrors.imageUrl = 'Must be a valid URL.';
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
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
        { headers: { Accept: 'application/vnd.github+json' } },
      );
      if (!res.ok) {
        if (res.status === 404) throw new Error('GitHub user not found.');
        throw new Error('Failed to fetch repositories from GitHub.');
      }
      const repos = (await res.json()) as GitHubRepo[];
      setGithubRepos(repos);
      if (repos.length === 0) {
        setGithubError('No public repositories found for this user.');
      }
    } catch (error) {
      setGithubRepos([]);
      setGithubError(
        error instanceof Error ? error.message : 'Could not load repositories.',
      );
    } finally {
      setLoadingRepos(false);
    }
  };

  const fetchRepoDetailsAndFill = async (repoFullName: string) => {
    if (!repoFullName) return;
    setLoadingRepoDetails(true);
    setGithubError('');
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repoFullName}`,
        { headers: { Accept: 'application/vnd.github+json' } },
      );
      if (!res.ok) throw new Error('Failed to fetch repository details.');
      const repo = (await res.json()) as GitHubRepo;
      const description = repo.description ?? '';
      const longDescriptionParts = [
        description,
        repo.language ? `Primary language: ${repo.language}.` : '',
        `Stars: ${repo.stargazers_count}.`,
        `Forks: ${repo.forks_count}.`,
        `Open issues: ${repo.open_issues_count}.`,
      ].filter(Boolean);

      const normalizedTitle = repo.name
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const mergedTags = Array.from(
        new Set([
          ...form.tags,
          ...(repo.topics ?? []),
          ...(repo.language ? [repo.language] : []),
        ]),
      ).filter((tag) => tag.trim().length > 0);

      setForm((prev) => ({
        ...prev,
        title: normalizedTitle || prev.title,
        description: description || prev.description,
        longDescription:
          longDescriptionParts.join(' ') || prev.longDescription,
        githubUrl: repo.html_url || prev.githubUrl,
        demoUrl: repo.homepage || prev.demoUrl,
        tags: mergedTags,
      }));
    } catch (error) {
      setGithubError(
        error instanceof Error
          ? error.message
          : 'Could not load repository details.',
      );
    } finally {
      setLoadingRepoDetails(false);
    }
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <div className="space-y-6 scrollbar-thin">
      {/* GitHub import */}
      <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent p-4">
        <div className="flex items-center gap-2 mb-3">
          <GitHubIcon className="w-4 h-4 text-ink-300" />
          <p className="text-sm font-semibold text-white">Import from GitHub</p>
          <span className="text-[10px] uppercase tracking-widest text-ink-500">
            Optional
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            placeholder="GitHub username"
            className={inputClass(false)}
          />
          <button
            type="button"
            onClick={fetchRepos}
            disabled={loadingRepos}
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {loadingRepos ? 'Loading…' : 'Load repos'}
          </button>
        </div>

        {githubRepos.length > 0 && (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className={inputClass(false)}
            >
              <option value="">Select a repository</option>
              {githubRepos.map((repo) => (
                <option key={repo.id} value={repo.full_name}>
                  {repo.full_name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => fetchRepoDetailsAndFill(selectedRepo)}
              disabled={!selectedRepo || loadingRepoDetails}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-iris-500 to-violet-accent text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-glow hover:brightness-110 transition-all"
            >
              {loadingRepoDetails ? 'Importing…' : 'Import repo'}
            </button>
          </div>
        )}

        {githubError && (
          <p className="mt-2 text-xs text-rose-soft">{githubError}</p>
        )}
      </div>

      {/* Title */}
      <Field label="Title" error={errors.title} required>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="My awesome project"
          className={inputClass(!!errors.title)}
        />
      </Field>

      {/* Short description */}
      <Field
        label="Short description"
        error={errors.description}
        required
        hint="Shown on the card"
      >
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="A brief summary of what this project is…"
          rows={2}
          className={inputClass(!!errors.description)}
        />
      </Field>

      {/* Long description */}
      <Field label="Full description" hint="Optional">
        <textarea
          value={form.longDescription}
          onChange={(e) => set('longDescription', e.target.value)}
          placeholder="Tech used, challenges, outcomes, key insights…"
          rows={4}
          className={inputClass(false)}
        />
      </Field>

      {/* Tags */}
      <Field label="Tags" hint="Press Enter or comma to add">
        <div
          className={`flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-white/[0.03] border ${
            errors.tags ? 'border-rose-400/50' : 'border-white/10'
          } focus-within:border-iris-400 transition-colors min-h-[46px]`}
        >
          {form.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-iris-500/20 text-iris-200 text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-white transition-colors"
              >
                <CloseIcon className="w-3 h-3" />
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
            className="flex-1 min-w-[120px] bg-transparent text-sm text-ink-100 placeholder:text-ink-500 outline-none"
          />
        </div>
      </Field>

      {/* URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="GitHub URL" error={errors.githubUrl}>
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) => set('githubUrl', e.target.value)}
            placeholder="https://github.com/…"
            className={inputClass(!!errors.githubUrl)}
          />
        </Field>
        <Field label="Demo URL" error={errors.demoUrl}>
          <input
            type="url"
            value={form.demoUrl}
            onChange={(e) => set('demoUrl', e.target.value)}
            placeholder="https://myapp.vercel.app"
            className={inputClass(!!errors.demoUrl)}
          />
        </Field>
      </div>

      {/* Cover image */}
      <Field label="Cover image URL" error={errors.imageUrl}>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => set('imageUrl', e.target.value)}
          placeholder="https://…/cover.png"
          className={inputClass(!!errors.imageUrl)}
        />
        {form.imageUrl && !errors.imageUrl && (
          <div className="mt-2 rounded-xl overflow-hidden h-32 bg-white/[0.03] border border-white/8 flex items-center justify-center">
            {!imgPreviewError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setImgPreviewError(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-ink-500">
                <ImageIcon className="w-6 h-6" />
                <p className="text-xs">Cover unavailable</p>
              </div>
            )}
          </div>
        )}
      </Field>

      {/* Status + Featured */}
      <div className="flex flex-wrap items-end gap-6">
        <Field label="Status" inline>
          <select
            value={form.status}
            onChange={(e) =>
              set('status', e.target.value as ProjectFormData['status'])
            }
            className={`${inputClass(false)} w-auto`}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>

        <label className="inline-flex items-center gap-3 cursor-pointer select-none mt-6">
          <div className="relative">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-white/10 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-iris-500 peer-checked:to-violet-accent transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <span className="text-sm text-ink-200">Feature this project</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-3 border-t border-white/8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-sm font-medium text-ink-200 hover:text-white hover:bg-white/8 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-iris-500 to-violet-accent text-white text-sm font-semibold shadow-glow hover:brightness-110 transition-all"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

/* --- helpers --- */

function inputClass(hasError: boolean) {
  return `w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border ${
    hasError
      ? 'border-rose-400/60 focus:border-rose-400'
      : 'border-white/10 focus:border-iris-400'
  } text-sm text-ink-100 placeholder:text-ink-500 outline-none transition-colors`;
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  inline?: boolean;
}

function Field({ label, children, error, hint, required, inline }: FieldProps) {
  return (
    <div className={inline ? 'flex flex-col gap-1.5' : 'flex flex-col gap-2'}>
      <label className="text-xs font-medium text-ink-300 flex items-center gap-1.5">
        {label}
        {required && <span className="text-rose-soft">*</span>}
        {hint && (
          <span className="text-ink-500 font-normal">· {hint}</span>
        )}
      </label>
      {children}
      {error && <p className="text-xs text-rose-soft">{error}</p>}
    </div>
  );
}
