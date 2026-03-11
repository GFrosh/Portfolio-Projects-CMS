# Portfolio CMS Developer Guide

This document explains how the app works internally, from rendering and UI state to persistence and CRUD behavior.

## 1. Tech Stack and Runtime

- Frontend framework: React 18 + TypeScript
- Build tool: Vite
- Styling: Tailwind CSS
- Data persistence: Browser localStorage
- ID generation: uuid (v4)

Key scripts in package configuration:

- `npm run dev`: Starts Vite dev server
- `npm run build`: Runs TypeScript check then production build
- `npm run preview`: Serves production build locally

## 2. Project Structure Overview

- `src/main.tsx`: App bootstrap and root render
- `src/App.tsx`: Main orchestration (toolbar, list, modal routing)
- `src/hooks/useProjects.ts`: Project state and CRUD functions
- `src/utils/storage.ts`: localStorage load/save helpers
- `src/types/project.ts`: Shared domain types
- `src/components/`: UI components (header, cards, forms, modals, dialogs)

## 3. Data Model

The core entity is `Project`.

Fields:

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
- `createdAt: string` (ISO timestamp)
- `updatedAt: string` (ISO timestamp)

Form payloads use `ProjectFormData`, which is the same shape minus `id`, `createdAt`, and `updatedAt`.

## 4. Storage Layer (Exact Behavior)

Storage is browser localStorage in `src/utils/storage.ts`.

- Storage key: `portfolio_cms_projects`
- Write format: `JSON.stringify(projects)`
- Read format: `JSON.parse(raw)` cast to `Project[]`
- Corrupted JSON behavior: safely returns empty array
- Missing key behavior: returns empty array

Important implications:

- Data is client-side only (per browser + per device + per origin)
- No backend/database sync
- Clearing site data or localStorage removes all projects
- No multi-user auth or permissions

## 5. State Management and CRUD Flow

State is managed with a custom hook: `useProjects`.

Internal flow:

1. On initial render, projects are loaded from localStorage.
2. In-memory state is kept in React state (`useState<Project[]>`).
3. Every mutation calls `persist(updated)`:
   - updates React state
   - writes the full array to localStorage

CRUD implementations:

- Create (`addProject`)
  - creates UUID via `uuidv4()`
  - sets `createdAt` and `updatedAt` to now (ISO)
  - prepends new item to the list

- Update (`updateProject`)
  - maps existing list
  - replaces matching project by id
  - updates `updatedAt`

- Delete (`deleteProject`)
  - filters out project by id

## 6. App Orchestration in App.tsx

`App.tsx` is the coordination layer.

It controls:

- Toolbar state:
  - `search`
  - `filterStatus`
  - `sortField`
  - `sortOrder`
- Modal routing via discriminated union `ModalMode`
- Derived list (`filtered`) using `useMemo`
- Published count (`publishedCount`) using `useMemo`

Filtering and sorting logic:

- Status filter first
- Search across title, description, and tags (case-insensitive)
- Sort by selected field:
  - `title` uses locale string compare
  - date fields (`createdAt`/`updatedAt`) use timestamp numeric compare
- Asc/desc direction toggled by UI button

## 7. UI Component Responsibilities

- `Header.tsx`
  - Displays app branding and project counters
  - Exposes New Project action

- `ProjectCard.tsx`
  - Renders each project summary
  - Handles View, Edit, Delete actions
  - Shows badges for featured/status
  - Shows GitHub/demo links if provided

- `ProjectForm.tsx`
  - Used for both create and edit modes
  - Manages local form state + validation errors
  - URL validation uses basic regex (`http/https` required)
  - Tag input supports Enter/comma add and Backspace remove-last

- `Modal.tsx`
  - Generic modal wrapper
  - Closes on Escape key
  - Closes on backdrop click
  - Locks body scroll while open

- `ProjectDetail.tsx`
  - Read-only detail view in modal
  - Displays long description, tags, links, metadata

- `ConfirmDialog.tsx`
  - Delete confirmation UI

- `EmptyState.tsx`
  - Two states:
    - no projects exist
    - no projects match current filters

## 8. Modal State Machine

Modal state is a single union value:

- `{ type: 'create' }`
- `{ type: 'edit', project }`
- `{ type: 'view', project }`
- `{ type: 'delete', projectId, title }`
- `null` for closed

This keeps modal rendering deterministic and avoids multiple open modals.

## 9. Validation Rules

Current frontend validation in `ProjectForm.tsx`:

- Required:
  - title
  - short description
- Optional fields with format checks:
  - githubUrl
  - demoUrl
  - imageUrl
- URL regex requires string to begin with `http://` or `https://`

No server-side validation exists because there is no backend.

## 10. Styling and Theming

- Tailwind utility classes are used in components
- Brand palette extends Tailwind config as `brand` colors
- Global styles loaded through `src/index.css`

## 11. Data Lifecycle (End-to-End)

Create:

1. User opens create modal
2. User submits valid form
3. `addProject` creates complete `Project`
4. State updates and localStorage is rewritten
5. Modal closes and grid rerenders

Update:

1. User opens edit modal from card/detail
2. Form initializes from selected project
3. Submit calls `updateProject`
4. Matching item replaced and timestamp refreshed
5. State + localStorage update, modal closes

Delete:

1. User clicks delete
2. Confirmation dialog opens
3. Confirm triggers `deleteProject`
4. Item removed from state and localStorage
5. Grid rerenders

## 12. Known Constraints

- No backend API or database
- No authentication
- No pagination/virtualization for very large datasets
- Data is not shared across browsers/devices
- No migration/versioning layer for stored schema

## 13. How To Extend Safely

If you add fields to `Project`:

1. Update `src/types/project.ts`
2. Update `EMPTY_FORM` and form inputs in `ProjectForm.tsx`
3. Update display components (`ProjectCard`, `ProjectDetail`)
4. Consider backward compatibility for old localStorage data

If you move to API storage:

1. Keep `Project` types as domain contract
2. Replace `loadProjects/saveProjects` with async API client methods
3. Convert `useProjects` to async actions with loading/error states
4. Add optimistic update or refetch strategy

## 14. Quick Dev Commands

- Install deps: `npm install`
- Run dev server: `npm run dev`
- Build production: `npm run build`
- Preview production build: `npm run preview`
