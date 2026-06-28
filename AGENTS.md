# Focus Companion — Agent Configuration

## Project Context

Desktop productivity app (Electron + React + TypeScript). Offline-first, lightweight, privacy-first.

**Tech Stack:** TypeScript, Electron, React, Vite, TailwindCSS, shadcn/ui, Zustand, SQLite, Drizzle ORM, Zod, Vitest, Playwright

**Read:** [PRD.md](docs/prd/PRD.md) — full product spec

---

## Session Defaults

Load every session, no exceptions.

### Required Skills (auto-load)

| Skill | Purpose |
|-------|---------|
| `caveman` | Ultra-compressed output, ~75% token cut |
| `code-review-graph` | AST-based blast radius before multi-file edits |
| `ponytail` | Plugin — YAGNI, stdlib-first, shortest diff |
| `senior-frontend` | React, Vite, TailwindCSS, shadcn/ui patterns |
| `senior-backend` | SQLite, Drizzle ORM, Zod validation, IPC |
| `database-architect` | Schema design, migrations, Drizzle patterns |
| `tdd` | Vitest + Playwright red-green-refactor |
| `clean-code` | Pragmatic coding standards |
| `review-architecture` | Module boundaries, dependency direction |
| `security-auditor` | Privacy, local-only data, no telemetry |

### Auto-Trigger Rules

- **ponytail**: EVERY RESPONSE. Ladder: does it need to exist? → stdlib? → native? → existing dep? → one line? → minimum code
- **caveman**: Every response. Drop to `lite` for security warnings
- **code-review-graph**: Before any multi-file edit or code review
- **review-architecture**: Before any multi-file edit or refactor
- **senior-frontend**: Component gen, Vite config, Tailwind, shadcn/ui
- **senior-backend**: IPC handlers, Drizzle queries, Zod schemas
- **database-architect**: Schema changes, migrations
- **tdd**: When building features or fixing bugs
- **security-auditor**: Any data handling, IPC, storage

---

## Project Conventions

### Code Style

- TypeScript strict mode
- No comments unless asked
- Prefer `type` over `interface` (Zod inference)
- Functional components only
- Tailwind utility-first, no custom CSS unless necessary
- shadcn/ui for components — extend, don't reinvent

### Architecture

```
src/
├── features/          # Feature modules (pomodoro, tasks, meeting, companion)
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types.ts
├── components/        # Shared UI components
├── hooks/             # Shared hooks
├── services/          # Business logic layer
├── repositories/      # Data access layer (Drizzle)
├── ipc/               # Electron IPC handlers
├── store/             # Zustand stores
├── types/             # Shared types
└── utils/             # Utilities
```

### State Management

- Zustand for global state
- Feature-local state in hooks
- IPC bridge for Electron ↔ React

### Database

- SQLite via Drizzle ORM
- Schema in `src/database/schema.ts`
- Migrations via Drizzle Kit
- Zod schemas from Drizzle tables

### Testing

- Vitest for unit/integration
- Playwright for E2E
- Test files next to source: `*.test.ts`
- No mocking unless necessary

---

## Memory Blocks

| Block | Scope | Purpose |
|-------|-------|---------|
| `project` | project | Focus Companion codebase knowledge |
| `human` | global | User preferences |
| `persona` | global | Agent behavior |

---

## Ponytail Principles

**EVERY response MUST follow:**

1. Does it need to exist? — If no, don't create it
2. Stdlib first — Use framework features before writing new code
3. Shortest diff — Minimal changes, not full rewrites
4. One line fix — Don't create a class for what a method can do
5. Delete > Add — Remove dead code, don't add wrappers

**Before writing ANY code, ask:**
- Can Electron/React/Drizzle do this natively?
- Can I add 5 lines instead of 50?
- Can I edit the existing file instead of creating a new one?

---

## Caveman Mode

Default: `full` intensity. Compressed output, technical accuracy preserved.

Trigger: `/caveman` or "caveman mode"

---

## RTK (Read The Knowledge)

Read at session start:
- `docs/prd/PRD.md` — product spec
- `docs/issues/*.md` — implementation tasks
