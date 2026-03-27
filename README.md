# Portfolio Projects CMS

A lightweight, client-side CMS for managing portfolio projects. Create, edit, view, filter, sort, and delete projects — with persistence handled entirely in the browser via `localStorage`.

**Live site:** https://portfolio-projects-cms.vercel.app

## Features

- CRUD for portfolio projects (create / edit / view / delete)
- Search across title, description, and tags
- Filter by status: `draft`, `published`, `archived`
- Sort by `updatedAt`, `createdAt`, or `title` (asc/desc)
- Featured projects toggle
- Modal-driven UI (create/edit/view/delete confirmation)
- Data persists in-browser using `localStorage` (no backend)

## Tech Stack

- React (see `package.json` for exact version)
- TypeScript
- Vite
- Tailwind CSS
- UUID v4 for ID generation
- Vitest for tests

## Requirements

- Node.js **>= 20.19.0** (per `package.json`)
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run tests:

```bash
npm test
```

Run tests once (CI-style):

```bash
npm run test:run
```

## How Data Persistence Works

Projects are stored in the browser at:

- **Storage:** `window.localStorage`
- **Key:** `portfolio_cms_projects`
- **Format:** JSON array of `Project` objects

Implications:

- Data is **per-browser / per-device / per-origin**
- Clearing site data clears your projects
- No authentication, no server-side validation, no sync across devices

## Data Model

A `Project` contains:

- `id: string`
- `title: string`
- `description: string`
- `longDescription: string`
- `tags: string[]`
- `githubUrl: string`
- `demoUrl: string`
- `imageUrl: string`
- `status: 'draft' | 'published' | 'archived'`
- `featured: boolean`
- `createdAt: string` (ISO)
- `updatedAt: string` (ISO)

Forms use `ProjectFormData` (same shape minus `id`, `createdAt`, `updatedAt`).

## Project Structure (high-level)

- `src/main.tsx` – app bootstrap
- `src/App.tsx` – toolbar state, filtering/sorting, modal routing
- `src/hooks/useProjects.ts` – project state + CRUD + persistence calls
- `src/utils/storage.ts` – `localStorage` load/save helpers
- `src/types/project.ts` – domain types
- `src/components/` – UI components (cards, forms, modals, etc.)

## Contributing / Extending

If you add new fields to `Project`:
1. Update `src/types/project.ts`
2. Update form defaults + inputs in `ProjectForm`
3. Update UI surfaces (`ProjectCard`, `ProjectDetail`, etc.)
4. Consider backward compatibility for previously saved `localStorage` data

## License

MIT
