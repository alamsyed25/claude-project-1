# CLAUDE.md — DocsCompare

## Project Overview

DocsCompare is a **Compare Document Tool**: upload two documents and visually compare differences. Built with Next.js 14 (App Router), React 18, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TypeScript, Tailwind CSS
- **Conventions**: Functional components, named exports, colocated files

## Project Structure

See **VIBE_CODING.md** for full folder structure and **PROJECT_BRIEF.md** for the copy-paste session brief.

```
src/
├── app/                  # App Router (page.tsx, compare/page.tsx, layout.tsx)
├── components/           # ui/, upload/, diff/, export/
├── hooks/                # useFileUpload, useDiff, etc.
├── lib/                  # Utilities, diff engine, parsers
├── types/                # document.ts and other interfaces
└── constants/            # Config, theme tokens
```

Core types live in `src/types/document.ts`: `DocumentFile`, `DiffResult`, `Change`, `DiffSummary`. Use them everywhere.

## Common Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Conventions

- TypeScript strict mode; no `any`
- Functional components, named exports
- Tailwind only (no inline styles)
- File naming: kebab-case for files, PascalCase for components
- One clear task per prompt when vibe coding

## Reference

- **VIBE_CODING.md** — Vibe coding guide, prompting strategies, build phases, quality checklist
- **PROJECT_BRIEF.md** — Brief to paste at the start of each AI session

## Build Phases (from VIBE_CODING.md)

1. Foundation — setup, types, layout
2. Input — file upload, parsing, preview
3. Core logic — diff engine, change detection
4. Display — side-by-side viewer, highlighting, navigation
5. Polish — export, responsive, loading/error states, shortcuts
