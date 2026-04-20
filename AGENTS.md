# Agent guide — enotas

Context for AI assistants and humans working in this repository.

## What this is

- **Monorepo**: [Turborepo](https://turborepo.dev/) with **pnpm** workspaces (`pnpm@10.33.0` per root `packageManager`).
- **Workspace globs**: `apps/*`, `packages/*` (see `pnpm-workspace.yaml`).
- **Stack**: TypeScript-first; Next.js/React are expected for apps and UI packages per `README.md` and shared configs.

## Toolchain (do not assume ESLint / Prettier)

| Concern    | Tool           | Notes                                                                     |
| ---------- | -------------- | ------------------------------------------------------------------------- |
| Linting    | **Oxlint**     | Presets from `@repo/oxlint-config` (`base`, `react-internal`, `next-js`). |
| Formatting | **Oxfmt**      | Root `.oxfmtrc.json`; run from repo root.                                 |
| Types      | **TypeScript** | `^6` at workspace root; shared `tsconfig` from `@repo/typescript-config`. |
| Tasks      | **turbo**      | Declared in root `package.json`; pipeline in `turbo.json`.                |

Prefer [Oxc docs](https://oxc.rs/docs/guide/usage/linter) for Oxlint/Oxfmt behavior.

## Shared packages

- **`@repo/typescript-config`** — `base.json` (strict, `ES2024`, `NodeNext`), `nextjs.json`, `react-library.json`. Extend these in app/package `tsconfig.json`; do not fork unrelated compiler defaults without a reason.
- **`@repo/oxlint-config`** — JSON presets; packages/apps should use `.oxlintrc.json` with `"extends": ["@repo/oxlint-config/<preset>"]` and a `lint` script that runs `oxlint`.
- **`@repo/db`** — PostgreSQL via **Prisma**. Schema in `packages/db/prisma/schema.prisma`; migrations via Prisma Client (`db:generate`, `db:migrate`, `db:push`). Requires `DATABASE_URL`.

## Commands (from repository root)

Use a **local** install so `turbo` and tools resolve from `node_modules` (avoid relying on global `turbo`).

```sh
pnpm install
pnpm exec turbo run build
pnpm exec turbo run lint
pnpm exec turbo run check-types
pnpm run format:fix      # oxfmt --write .
```

To install a **new library** in a specific workspace package (from repository root), use pnpm’s filter:

```sh
pnpm add <lib-name> --filter @repo/<package>
```

For devDependencies: `pnpm add -D <lib-name> --filter @repo/<package>`.

After substantive edits, run the relevant `turbo` tasks for affected packages (use `--filter=<name>` when appropriate).

## Conventions

- **Package manager**: **pnpm** only; respect workspace protocol (`workspace:*`) for internal deps.
- **TypeScript**: Match existing strictness (`strict`, `verbatimModuleSyntax`, etc. in `packages/typescript-config/base.json`). Prefer `import type` where `verbatimModuleSyntax` requires it.
- **Arrays in types**: Use `T[]` / `Foo[]`, not the `Array<T>` type form (project preference).
- **Imports**: Keep imports at the top of files; avoid inline/dynamic imports unless the codebase already uses them for a pattern.
- **Server logic**: Admin data access uses TanStack Start `createServerFn` handlers under `apps/admin/src/server/` with Prisma via `@repo/db`.
- **Scope**: Change only what the task needs; avoid drive-by refactors and unrelated files.
- **Docs**: Do not add or expand markdown docs unless the user asked for them.

## Turborepo

- Cached tasks and outputs are defined in `turbo.json` (`build`, `lint`, `check-types`, `dev`).
- New apps/packages should expose `build`, `lint`, and `check-types` scripts where applicable so `pnpm exec turbo run …` stays consistent.

### Root-only tasks (repo root `package.json`)

When a script should run **once at the monorepo root** (not in every workspace)—for example repo-wide lint/format—do **both**:

1. Add a **`scripts`** entry on the **root** `package.json` (e.g. `"lint": "oxlint ."`).
2. Register a matching task in **`turbo.json`** using the root task name form **`//#<scriptName>`** so Turbo knows how to cache and orchestrate it (e.g. `"//#lint": {}` pairs with the root `lint` script).

Then run it with `pnpm run <scriptName>` or `pnpm exec turbo run //#<scriptName>` as needed. See [Turborepo — Configuring tasks](https://turborepo.dev/docs/crafting-your-repository/configuring-tasks) and root vs package tasks in the same docs.

## When adding a new workspace package

1. Place it under `apps/` or `packages/` with its own `package.json`.
2. Wire `tsconfig` to `@repo/typescript-config` presets.
3. Add `.oxlintrc.json` extending the right oxlint preset; add `oxlint` + `@repo/oxlint-config` as devDependencies where needed.
4. Register scripts compatible with `turbo.json` tasks.

## Learned User Preferences

- When changing tooling or library integration, consult current upstream docs (e.g. Context7) instead of relying on memory alone.
- Prefer clear, intention-revealing names for plugins and shared infrastructure over opaque `*Impl`-style identifiers in public-facing code.
- When committing or pushing, exclude `.cursor` (and similar IDE/agent artifacts) if the user asked to avoid Cursor-related commits; review `.gitignore` diffs first and do not stage `.gitignore` changes unless the user explicitly requests them.
- **Prefer truthy checks**: Use `value && ...` instead of `value !== undefined && value !== null`. Truthy checks are more concise and idiomatic.
- When the user forbids edits under `packages/ui`, fix admin styling and behavior in `apps/admin` (e.g. Tailwind `@source`, `styles.css`, route/layout composition) instead of changing the shared package.
- For Stitch-derived admin UI, prefer rebuilding screens as React/TSX in the app over embedding exported HTML in iframes when the user asks for native components.
- `FormBuilder` public API uses flat root props (`layout`, `order`, `fields`) rather than a nested `ui` object (`{ ui: { layout, order, fields } }`). The user explicitly rejected the nested shape.

```ts
// ❌ Avoid
if (value !== undefined && value !== null) { ... }
const result = value !== undefined && value !== null ? value : fallback;

// ✅ Prefer
if (value) { ... }
const result = value || fallback;
```

## Learned Workspace Facts

- Use `workspace:*` only for packages that exist under `apps/` or `packages/`; npm-only tools (`oxlint`, `typescript`, `prisma`, etc.) need normal semver ranges in `package.json`.
- From the repository root, `pnpm db:generate`, `db:migrate`, `db:push`, and `db:studio` delegate to `@repo/db` via `pnpm --filter`; set `DATABASE_URL` when using Prisma.
- In `apps/admin`, Tailwind v4 must scan shared packages (e.g. `@source` to `packages/ui/src` and `packages/form-builder/src` in `apps/admin/src/styles.css`) so utilities used by `@repo/ui` and related code are generated in the admin CSS bundle (dialogs, tables, etc.).
- Shared `packages/ui` shadcn setup uses a valid `components.json` and `pnpm dlx shadcn@latest add <component>` from `packages/ui`; do not run `shadcn init --template start` inside the bare UI package (that template targets a TanStack Start app layout).
- Admin shell scroll containers often use `overscroll-y-none` with vertical overflow to limit scroll chaining at scroll extremes.
- `apps/admin` resolves `@repo/form-builder` from its `./dist/` output (see `packages/form-builder/package.json` exports). After editing form-builder source, run `bun run build` inside `packages/form-builder` before type-checking `apps/admin`; otherwise `apps/admin` will still see the old compiled types.

## Patterns

### Database layer

- **Prisma** with PostgreSQL, schema in `packages/db/prisma/schema.prisma`
- **Client**: import `getPrisma` / helpers from `@repo/db` in server handlers
- **Migrations**: `pnpm db:generate` → `pnpm db:migrate` (requires `DATABASE_URL`)
- **Transactions**: `prisma.$transaction([...])` when you need atomic multi-step writes

### Admin server modules

- Prefer `createServerFn` in `apps/admin/src/server/` with Zod `inputValidator` where inputs need validation; keep handlers focused and colocate shared helpers next to the module that uses them unless a clear shared utility emerges.
