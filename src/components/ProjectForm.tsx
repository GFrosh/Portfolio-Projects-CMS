import { useState, KeyboardEvent } from 'react';
import type { ProjectFormData } from '../types/project';

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

  const set = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
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

  const handleSubmit = () => {
    if (validate()) onSubmit(form);
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <Field label="Title" error={errors.title} required>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="My Awesome Project"
          className={input(!!errors.title)}
        />
      </Field>

      {/* Short description */}
      <Field label="Short Description" error={errors.description} required>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="A brief summary shown on the project card…"
          rows={2}
          className={input(!!errors.description)}
        />
      </Field>

      {/* Long description */}
      <Field label="Full Description">
        <textarea
          value={form.longDescription}
          onChange={(e) => set('longDescription', e.target.value)}
          placeholder="Detailed write-up: tech used, challenges, outcomes…"
          rows={4}
          className={input(false)}
        />
      </Field>

      {/* Tags */}
      <Field label="Tags" hint="Press Enter or comma to add">
        <div className={`flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-slate-800 border ${errors.tags ? 'border-red-500' : 'border-slate-700'} focus-within:border-brand-500 transition-colors min-h-[42px]`}>
          {form.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-600/20 text-brand-300 text-xs">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={addTag}
            placeholder={form.tags.length === 0 ? 'React, TypeScript…' : ''}
            className="flex-1 min-w-[100px] bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
          />
        </div>
      </Field>

      {/* URLs row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="GitHub URL" error={errors.githubUrl}>
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) => set('githubUrl', e.target.value)}
            placeholder="https://github.com/…"
            className={input(!!errors.githubUrl)}
          />
        </Field>
        <Field label="Demo URL" error={errors.demoUrl}>
          <input
            type="url"
            value={form.demoUrl}
            onChange={(e) => set('demoUrl', e.target.value)}
            placeholder="https://myapp.vercel.app"
            className={input(!!errors.demoUrl)}
          />
        </Field>
      </div>

      {/* Image URL */}
      <Field label="Cover Image URL" error={errors.imageUrl}>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => set('imageUrl', e.target.value)}
          placeholder="https://…/cover.png"
          className={input(!!errors.imageUrl)}
        />
        {form.imageUrl && !errors.imageUrl && (
          <div className="mt-2 rounded-lg overflow-hidden h-28 bg-slate-800">
            <img
              src={form.imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
      </Field>

      {/* Status + Featured row */}
      <div className="flex items-center gap-6 flex-wrap">
        <Field label="Status" inline>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value as ProjectFormData['status'])}
            className={`${input(false)} w-auto`}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>

        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none mt-5">
          <div className="relative">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 rounded-full peer-checked:bg-brand-600 transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <span className="text-sm text-slate-300">Featured</span>
        </label>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white text-sm font-medium transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

/* --- Helpers --- */

function input(hasError: boolean) {
  return `w-full px-3 py-2 rounded-lg bg-slate-800 border ${hasError ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-brand-500'} text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors`;
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
    <div className={inline ? 'flex flex-col gap-1' : 'flex flex-col gap-1.5'}>
      <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
        {label}
        {required && <span className="text-red-400">*</span>}
        {hint && <span className="text-slate-600 font-normal">({hint})</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
