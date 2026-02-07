# Project Brief — Paste at the start of each session

```
Project: Compare Document Tool
Stack: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
Purpose: Upload two documents and visually compare differences
Key features: file upload, side-by-side diff view, highlight changes, export report
Conventions: functional components, named exports, colocated files
```

## Folder structure (follow every time)

- `src/app/` — App Router pages (page.tsx, compare/page.tsx, layout.tsx)
- `src/components/ui/` — Primitives (Button, Modal)
- `src/components/upload/` — DropZone, FilePreview
- `src/components/diff/` — DiffViewer, DiffLine, ChangeMarker
- `src/components/export/` — ExportButton, ReportPreview
- `src/hooks/` — useFileUpload, useDiff
- `src/lib/` — Utilities, diff engine, parsers
- `src/types/` — TypeScript interfaces (see document.ts)
- `src/constants/` — Config, theme tokens
