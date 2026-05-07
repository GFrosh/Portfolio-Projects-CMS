# PortDeck

A lightweight, backend-first portfolio project manager. Create, edit, view, filter, sort, and delete projects with a clean React UI backed by a REST API.

## Features

- CRUD for portfolio projects (create / edit / view / delete)
- Search across title, description, and tags
- Filter by status: `draft`, `published`, `archived`
- Sort by `updatedAt`, `createdAt`, or `title` (asc/desc)
- Featured projects toggle
- Modal-driven UI (create/edit/view/delete confirmation)
- User authentication
- GitHub import integration (fetch repos and auto-fill form)
- Optimistic UI updates with error recovery
- All data persists on the backend server

## Tech Stack

- React (see `package.json` for exact version)
- TypeScript
- Vite
- Tailwind CSS
- UUID v4 for ID generation

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



## Backend Requirements

PortDeck requires a backend API server with the following endpoints:

- `GET /api/projects` – fetch all projects
- `POST /api/projects` – create a new project
- `PUT /api/projects/{id}` – update a project
- `DELETE /api/projects/{id}` – delete a project

The backend base URL is configurable via `VITE_API_BASE_URL` environment variable (defaults to `http://localhost:3000`).

## Authentication

Auth is handled via the backend Portal service. Update the credentials in the login screen to match your backend.

- Default demo: `user@portfolio.local` / `user123`

## Architecture

**Frontend:** React + TypeScript (Vite)
- Optimistic UI updates (changes appear immediately)
- Error states with retry guidance
- Real-time sync with backend

**Backend:** REST API (must be implemented)
- Store projects in a database
- Validate and enforce business rules
- Handle authentication and authorization

**Data Flow:**
1. UI dispatches action → React state updated optimistically
2. Backend call issued in background
3. On success: Backend returns updated project
4. On error: UI reverts to previous state and shows error message

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
- `src/App.tsx` – auth gate, toolbar state, filtering/sorting, modal routing
- `src/hooks/useAuth.ts` – auth state + sign-in/sign-out flows
- `src/data/auth/repository.ts` – auth repository (current local adapter)
- `src/hooks/useProjects.ts` – project state + CRUD + repository calls
- `src/data/projects/repository.ts` – project repository contract
- `src/data/projects/localProjectRepository.ts` – local project adapter
- `src/types/project.ts` – domain types
- `src/types/auth.ts` – auth domain types
- `src/components/` – UI components (cards, forms, modals, etc.)

## DB Integration Path

The app now uses repository contracts for both projects and auth.

To integrate a database, add new adapters (for example API-backed repositories) that implement:

- `AuthRepository` in `src/types/auth.ts`
- `ProjectRepository` in `src/data/projects/repository.ts`

Then switch the exported repository instance to the DB-backed implementation.

## Contributing / Extending

If you add new fields to `Project`:
1. Update `src/types/project.ts`
2. Update form defaults + inputs in `ProjectForm`
3. Update UI surfaces (`ProjectCard`, `ProjectDetail`, etc.)
4. Consider backward compatibility for previously saved `localStorage` data

## License

MIT
