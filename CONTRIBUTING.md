# Contribution Guide

Thanks for contributing to Portfolio CMS.

## 1. Prerequisites

- Node.js 18+
- npm 9+
- Git

## 2. Local Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Run the app locally:

```bash
npm run dev
```

4. Build before opening a PR:

```bash
npm run build
```

## 3. Project Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Browser localStorage for persistence

## 4. Branching and Commits

- Create a feature branch from main.
- Keep commits small and focused.
- Use clear commit messages.

Suggested commit style:

- feat: add search debounce
- fix: prevent modal close on inner click
- docs: update developer guide

## 5. Coding Standards

- Follow existing TypeScript patterns and strict typing.
- Keep components focused and reusable.
- Prefer descriptive variable names.
- Avoid unrelated refactors in feature/fix PRs.
- Keep UI behavior accessible (keyboard and focus handling).

## 6. Data and Storage Rules

- Current persistence uses localStorage key: portfolio_cms_projects.
- Any changes to project schema must include:
  - Type updates
  - UI/form updates
  - Backward compatibility handling for existing localStorage data

## 7. Pull Request Checklist

Before opening a PR, confirm:

- App builds successfully with npm run build
- Feature works in dev mode
- No obvious regressions in create/edit/view/delete flows
- Documentation updated when behavior changes
- PR description explains:
  - What changed
  - Why it changed
  - How it was tested

## 8. Bug Reports

Please include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or short recording (if UI issue)
- Environment details (OS, browser, Node version)

## 9. Feature Requests

Please include:

- Problem statement
- Proposed solution
- Alternative approaches considered
- Any UX or technical constraints

## 10. Scope Notes

This app is currently frontend-only.

- No backend API
- No authentication
- Data is local to the browser/device

Contributions that add these areas are welcome, but should be discussed in an issue first if they are large changes.

## 11. License

By contributing, you agree that your contributions will be licensed under the MIT License. See [LICENSE](LICENSE) for the full text.
