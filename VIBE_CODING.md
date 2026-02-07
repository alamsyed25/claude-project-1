# Vibe Coding Fundamentals & Best Practices
## Compare Document Project — React / Next.js

---

## 1. What Is Vibe Coding?

Vibe coding is AI-assisted development where you describe **what you want** in natural language and let an AI generate the code. You steer, review, and iterate — the AI builds. The key shift: you become the architect and editor, not the typist.

> **Golden rule:** The clearer your intent, the better the output.

---

## 2. Project Setup & Architecture

### 2.1 Start With a Solid Foundation Prompt

Before writing a single line of code, give the AI full context about your project. Create a **project brief** you can paste at the start of every session:

```
Project: Compare Document Tool
Stack: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
Purpose: Upload two documents and visually compare differences
Key features: file upload, side-by-side diff view, highlight changes, export report
Conventions: functional components, named exports, colocated files
```

### 2.2 Folder Structure Convention

Decide your structure early and tell the AI to follow it every time:

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home / upload screen
│   ├── compare/
│   │   └── page.tsx      # Comparison view
│   └── layout.tsx
├── components/
│   ├── ui/               # Reusable primitives (Button, Modal, etc.)
│   ├── upload/            # DropZone, FilePreview
│   ├── diff/              # DiffViewer, DiffLine, ChangeMarker
│   └── export/            # ExportButton, ReportPreview
├── hooks/                 # Custom hooks (useFileUpload, useDiff, etc.)
├── lib/                   # Utilities, diff engine, parsers
├── types/                 # TypeScript interfaces & types
└── constants/             # Config values, theme tokens
```

### 2.3 Define Types Early

Give the AI your core types upfront so every component stays consistent. See `src/types/document.ts`.

---

## 3. Prompting Strategies

### 3.1 The Prompt Hierarchy (Most → Least Effective)

| Level | Prompt Style | Example |
|-------|-------------|---------|
| ⭐⭐⭐ | **Specific + Constrained** | "Create a DiffViewer component using `diff` library. It takes `changes: Change[]` and renders a side-by-side view. Green for additions, red for removals. Use Tailwind. No external state." |
| ⭐⭐ | **Descriptive** | "Build a component that shows document differences side by side with color coding." |
| ⭐ | **Vague** | "Make a diff viewer." |

### 3.2 The CRISP Framework

Use this for every significant prompt:

- **C**ontext — What does this fit into? ("This is part of the compare page")
- **R**ole — What should the AI act as? ("Act as a senior React developer")
- **I**nput/Output — What goes in, what comes out? ("Takes two strings, returns JSX")
- **S**tyle — Conventions to follow ("Use Tailwind, functional components, TypeScript")
- **P**recision — Edge cases & constraints ("Handle empty files, max 10MB, show loading state")

### 3.3 Prompt Templates for Common Tasks

**New Component:**
```
Create a [ComponentName] React component in TypeScript.
- Props: [list props with types]
- Behavior: [what it does]
- Styling: Tailwind CSS
- Must handle: [edge cases]
- No external dependencies unless specified.
- Include brief JSDoc comment at the top.
```

**Bug Fix:**
```
Bug: [describe what's happening]
Expected: [describe what should happen]
File: [filename]
Relevant code: [paste the broken section]
Fix this while keeping the existing patterns intact.
```

**Refactor:**
```
Refactor [component/function] to:
- [specific improvement]
- Keep the same external API / props
- Don't change behavior, only structure
- Explain what you changed and why in a brief comment.
```

---

## 4. Iterating & Debugging With AI

### 4.1 The Build Loop

```
┌─────────────────────────────────────┐
│  1. DESCRIBE what you want          │
│  2. REVIEW the generated code       │
│  3. TEST it (run it, click around)  │
│  4. REFINE with a follow-up prompt  │
│  5. COMMIT when it works            │
└─────────────────────────────────────┘
        ↑                    │
        └────────────────────┘
           Repeat until solid
```

### 4.2 Effective Iteration Rules

1. **One thing at a time.** Don't ask for a file upload component, diff engine, and export feature in one prompt. Build in slices.

2. **Paste errors directly.** When something breaks, paste the full error message — not your interpretation of it.

3. **Show, don't just tell.** Instead of "it looks wrong," say "the red highlight is wrapping to the next line instead of staying inline."

4. **Lock what works.** When a component is solid, tell the AI: "Don't modify `DiffViewer`. Only change `DiffLine`."

5. **Use checkpoints.** Commit working code to git before asking for big changes. You can always roll back.

### 4.3 Debugging Prompts That Work

| Situation | Prompt |
|-----------|--------|
| Runtime error | "I'm getting this error: `[paste error]`. Here's the component: `[paste code]`. Fix it." |
| Visual bug | "The diff lines are overlapping. They should each be their own row with 8px gap. Here's the current JSX and Tailwind classes." |
| Logic bug | "The diff algorithm is marking unchanged lines as 'modified'. Here's the input: `[example]`. Expected output: `[example]`. Actual: `[example]`." |
| Performance | "The diff view re-renders on every keystroke in the search bar. Make the diff memoized and only recalculate when documents change." |

---

## 5. Quality Guardrails & Testing

### 5.1 The "Trust But Verify" Checklist

After every AI-generated code block, scan for:

- [ ] **Does it actually use my types?** (AI loves to invent its own)
- [ ] **Are there hardcoded values that should be props or constants?**
- [ ] **Is it importing from the right paths?**
- [ ] **Does it handle loading, empty, and error states?**
- [ ] **Is it accessible?** (keyboard nav, aria labels, contrast)
- [ ] **Are there console.logs or TODO comments left behind?**

### 5.2 Testing Strategy

Keep it simple. Three layers:

```
Layer 1: Type Safety (free, automatic)
  → TypeScript strict mode catches most shape errors

Layer 2: Component Tests (targeted)
  → Test DiffViewer with known inputs → known outputs
  → Test file upload with valid/invalid/empty files
  → Use React Testing Library + Vitest

Layer 3: Manual Smoke Test (fast)
  → Upload two real docs → does the diff look right?
  → Try edge cases: empty file, huge file, same file twice
```

**Prompt for generating tests:**
```
Write Vitest + React Testing Library tests for [Component].
Cover: happy path, empty state, error state.
Mock these dependencies: [list].
Use the existing types from @/types.
```

### 5.3 AI-Generated Code Red Flags

| Red Flag | Why It Happens | Fix |
|----------|---------------|-----|
| `any` types everywhere | AI takes shortcuts | "Replace all `any` with proper types from @/types" |
| Giant 300+ line components | No constraint given | "Split this into sub-components. Max 80 lines each." |
| Unused imports / variables | Copy-paste artifacts | Linter catches these — keep ESLint on |
| Inline styles mixed with Tailwind | Inconsistent context | "Use only Tailwind. Remove all inline styles." |
| Re-implementing built-in logic | AI doesn't check npm | "Use the `diff` library instead of a custom algorithm" |

---

## 6. Workflow Best Practices

### 6.1 Session Management

- **Start each session** by pasting your project brief + the file(s) you're working on.
- **End each session** by asking: "Summarize what we built and what's left to do." Save this as your next session's starting point.
- **Don't context-switch.** One feature per session keeps the AI focused.

### 6.2 Git Discipline

```bash
# Commit after every working feature
git add -A && git commit -m "feat: side-by-side diff viewer"

# Branch for experiments
git checkout -b experiment/inline-diff-mode

# Didn't work? Easy rollback
git checkout main
```

### 6.3 Progressive Feature Building

Build your compare document tool in this order:

```
Phase 1: Foundation
  ✓ Project setup (Next.js + TypeScript + Tailwind)
  ✓ Core types defined
  ✓ Basic layout / navigation

Phase 2: Input
  → File upload component (drag & drop)
  → File parsing (txt → string, docx → string, pdf → string)
  → File preview / validation

Phase 3: Core Logic
  → Diff engine integration (e.g., `diff` or `jsdiff` library)
  → Change detection & categorization
  → Diff result data structure

Phase 4: Display
  → Side-by-side diff viewer
  → Line-level highlighting (add/remove/modify)
  → Change navigation (next/prev change)
  → Summary stats (X additions, Y removals)

Phase 5: Polish
  → Export comparison report
  → Responsive layout
  → Loading / error states
  → Keyboard shortcuts
```

### 6.4 The "Explain Before You Build" Technique

Before asking the AI to build something complex, ask it to **explain its plan first**:

```
Before writing any code, explain how you would architect a 
side-by-side document diff viewer in React. 

Consider: large documents (10k+ lines), performance, 
synchronized scrolling, and highlighting changes.

Give me the plan, then I'll tell you to proceed.
```

---

## 7. Quick Reference Card

### Prompting Dos & Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Provide types and interfaces | Let the AI guess your data shape |
| Specify one task per prompt | Ask for 5 features at once |
| Paste actual errors | Say "it's broken" |
| Set constraints (max lines, no deps) | Leave it open-ended |
| Ask for explanation before complex code | Blindly accept 200+ lines |
| Commit working code before big changes | YOLO it with no version control |

### Essential Prompts to Keep Handy

```
"Follow the existing patterns in [file]. Don't introduce new conventions."

"Only modify [specific section]. Leave everything else untouched."

"This isn't working. Here's the error, the code, and what I expected.
 Fix only what's broken."

"Refactor this for readability. Same behavior, better structure."

"Add TypeScript types to everything. No `any` allowed."

"What could go wrong with this approach? List edge cases."
```

---

*Last updated: February 2026 • Stack: Next.js 14 / React 18 / TypeScript / Tailwind CSS*
