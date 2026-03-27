# LEARN.md — Understanding & Extending Portfolio Projects CMS

This guide is a “how it works” companion to the codebase. It’s aimed at helping you:
- understand the architecture quickly
- debug common issues
- extend the app safely (especially the project schema + storage)

## 1) Mental Model: What This App Is (and Isn’t)

This is a **single-user, client-side CMS**:
- All projects live in React state while the app is running
- All projects are persisted to **browser localStorage**
- There is **no backend**, no API, no database, no accounts

If you want multi-device sync or multiple users, you’ll need to replace the storage layer with a real API.

---

## 2) Core Flow: State + Persistence

### Where state lives
Project data lives in a custom hook:

- `src/hooks/useProjects.ts`

It initializes state like this:

- `useState<Project[]>(loadProjects)`

So `loadProjects()` runs once on first render and hydrates from localStorage.

### How persistence works
Every mutation runs through a `persist(updated)` helper that:
1. updates React state
2. writes the entire array back to localStorage

Storage implementation:
- `src/utils/storage.ts`
- Key: `portfolio_cms_projects`
- Missing key → returns `[]`
- Bad JSON → returns `[]`

**Important:** there’s no migration/versioning layer for stored data.

---

## 3) UI Orchestration (App.tsx)

`src/App.tsx` is the “coordination layer.” It owns:

### Toolbar state
- `search` (string)
- `filterStatus` (`all | draft | published | archived`)
- `sortField` (`updatedAt | createdAt | title`)
- `sortOrder` (`asc | desc`)

### Derived list logic
A `useMemo` computes `filtered`:
1. Filter by status (if not `all`)
2. Apply search across:
   - title
   - description
   - tags
3. Sort:
   - `title` uses locale compare
   - `createdAt` / `updatedAt` are compared as timestamps
4. Sort direction is flipped by `sortOrder`

### Modal routing (single state machine)
Modal state is a single discriminated union, so only one modal can be open:

- `{ type: 'create' }`
- `{ type: 'edit', project }`
- `{ type: 'view', project }`
- `{ type: 'delete', projectId, title }`
- `null` (closed)

This prevents “multiple modal” bugs and keeps UI transitions deterministic.

---

## 4) CRUD Details (useProjects)

### Create
- Generates `id` with UUID v4
- Sets `createdAt` + `updatedAt` to `new Date().toISOString()`
- Prepends the new project to the list (newest first)

### Update
- Maps over existing projects, replaces the matching `id`
- Refreshes `updatedAt`

### Delete
- Filters out the matching `id`

---

## 5) Validation (Front-end Only)

There’s no server-side validation since there’s no backend.

The form validation includes:
- Required fields:
  - title
  - short description
- Optional URL fields:
  - `githubUrl`, `demoUrl`, `imageUrl`
  - must start with `http://` or `https://` (basic regex)

---

## 6) Debugging Tips

### “My projects disappeared”
Most common causes:
- localStorage cleared (manually or by the browser)
- different browser/profile/device
- different origin (domain/port) — localStorage is scoped per origin

### “UI shows nothing”
Check:
- is the list empty, or are filters/search hiding everything?
- status filter set to `archived`/`draft` unintentionally?
- search query too specific?

### “Bad data breaks the app”
The storage layer safely returns `[]` on corrupted JSON, so the app should recover (but user data will be lost).

---

## 7) Extending the Schema Safely

If you add fields to `Project`:

1. Update type definition:
   - `src/types/project.ts`

2. Update the form defaults + UI inputs:
   - `ProjectForm` (and any empty form constants)

3. Update display surfaces:
   - project cards
   - detail view
   - any derived logic (search/sort/filter) if relevant

4. Consider backward compatibility:
   - old localStorage data won’t have your new fields
   - you can either:
     - provide defaults in the UI/form, or
     - add a “hydration normalization” step when loading

**Recommended approach:** on load, map projects and fill missing fields with safe defaults.

---

## 8) If You Later Add a Backend

A safe migration path:
1. Keep `Project` as your domain contract
2. Replace `loadProjects/saveProjects` with async API calls
3. Update `useProjects` to handle:
   - loading
   - error states
   - optimistic updates or refetch strategies

---

## 9) Quick Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm test
npm run test:run
```
