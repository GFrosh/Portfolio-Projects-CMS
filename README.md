# PortDeck — Next.js edition

A modern rebuild of PortDeck on the **Next.js 15 App Router** with a redesigned
frontend. Same backend-first REST contract as the original; new design system,
new layout, new interactions.

## What's new vs. the original Vite/React app

**Framework**

- Migrated Vite + `react-router-dom` → **Next.js 15 App Router**
- Real routes: `/`, `/login`, `/signup`, `/auth/callback`, `/dashboard`
- Client components explicitly marked with `'use client'`; SSR-safe
  `Portal`/`Sheet` clients (no `localStorage` access on the server)
- `@/*` path alias for cleaner imports
- Node ≥ 20.19 (unchanged)

**Design system**

- Palette swap: slate/orange → **ink (deep navy) + iris/violet + emerald** with
  a soft, layered radial background
- Typography: Inter (unchanged) + **JetBrains Mono** for endpoints
- New utility classes: `.glass`, `.glass-strong`, `.text-gradient`,
  `.shadow-glow`, `.ring-focus`
- Custom subtle scrollbars & selection color

**Auth screens**

- Split-screen layout with an animated gradient brand panel and marketing copy
- Segmented Sign In / Sign Up tab now driven by real routes
- Compact glass card, gradient primary button, GitHub OAuth secondary action

**Dashboard**

- New **hero header** with per-user greeting and four stat pills (Total /
  Published / Drafts / Featured)
- **Segmented status filter** (was a `<select>`)
- New **grid ↔ list view toggle**
- Cards: hover-lift, cover-image gradient overlay, status dot + pill,
  hover-revealed actions
- Reworked endpoints panel with per-card gradient tints and animated copy state
  (URL / curl)
- Modals: glassmorphism, scale-in animation, sticky title with optional subtitle
- Confirm dialog: gradient danger button, keyboard `Esc` to close

**Reliability**

- All localStorage access guarded for SSR
- Optimistic UI updates preserved; revert-on-failure logic preserved
- Empty-image graceful fallback via React state (no DOM `display: none`
  side-effects)

## Preserved features

Full parity with the original:

- CRUD (create / edit / view / delete) with optimistic updates
- Search across title, description, tags
- Filter by status: `draft`, `published`, `archived`
- Sort by `updatedAt`, `createdAt`, `title` (asc/desc)
- Featured toggle
- GitHub import (username → repo list → auto-fill form)
- Email/password auth + GitHub OAuth callback flow
- Public API endpoints panel with URL + curl copy actions

## Getting started

```bash
npm install
cp .env.example .env.local        # optional
npm run dev
```

Open <http://localhost:3000>.

## Environment

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3000` | Backend REST base |
| `NEXT_PUBLIC_USER_KEY` | `portdeck_auth_user` | localStorage key for cached user |

## Backend contract (unchanged)

- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/edit/{id}`
- `DELETE /api/projects/delete/{id}`
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `GET /api/auth/user`
- `GET /api/auth/github` (OAuth start; returns to `/auth/callback?token=…`)

## Project structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout, global CSS
│   ├── page.tsx             # Redirect gate → /login or /dashboard
│   ├── globals.css          # Tailwind v4 + design tokens
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── auth/callback/page.tsx
│   └── dashboard/page.tsx
├── components/
│   ├── AuthShell.tsx        # Split-screen auth UI
│   ├── DashboardShell.tsx   # Hero, toolbar, grid/list, modals
│   ├── EndpointsPanel.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectForm.tsx      # incl. GitHub import
│   ├── ProjectDetail.tsx
│   ├── Modal.tsx
│   ├── ConfirmDialog.tsx
│   ├── EmptyState.tsx
│   └── icons.tsx
├── data/
│   ├── auth/Portal.ts       # SSR-safe REST client
│   └── projects/Sheet.ts
├── hooks/
│   ├── useAuth.ts
│   └── useProjects.ts
└── types/
    ├── auth.ts
    └── project.ts
```

## License

MIT
