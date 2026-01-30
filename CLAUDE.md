# CLAUDE.md - AI Assistant Guide for Francis Habits

## Project Overview

**Francis Habits** is an AI-powered habit coaching system based on James Clear's *Atomic Habits* principles. It's a full-stack TypeScript web application built on the Start UI Web starter kit from BearStudio.

### Tech Stack
- **Frontend**: React 19, TypeScript, TanStack Router, TanStack Query, Tailwind CSS 4
- **Backend**: Node.js 22+, ORPC (type-safe RPC), Prisma ORM, Better Auth
- **Database**: PostgreSQL
- **Testing**: Vitest (unit/browser), Playwright (E2E)
- **Build**: Vite, ES modules only
- **UI Components**: shadcn/ui patterns, Radix UI primitives

---

## Quick Commands Reference

### Development
```bash
pnpm dev              # Start dev server with all services (app + mail server)
pnpm build            # Build for production
pnpm start            # Start production server
pnpm storybook        # Start Storybook on port 6006
```

### Code Quality
```bash
pnpm lint             # Run all linting (ESLint + TypeScript)
pnpm lint:eslint      # Run ESLint with auto-fix
pnpm lint:ts          # TypeScript type checking (no emit)
pnpm pretty           # Format code with Prettier
```

### Testing
```bash
pnpm test             # Run tests in browser (headless)
pnpm test:ci          # Run tests in CI mode (single run)
pnpm test:ui          # Run tests with UI
# Single test file:
vitest run --reporter=verbose path/to/test.file.ts
```

### E2E Testing
```bash
pnpm e2e              # Run Playwright tests (headless)
pnpm e2e:ui           # Run Playwright with UI
pnpm e2e:setup        # Setup auth context for tests
```

### Database
```bash
pnpm db:push          # Push schema changes to database
pnpm db:seed          # Seed database with initial data
pnpm db:ui            # Open Prisma Studio
pnpm db:init          # Initialize database (push + seed)
pnpm gen:prisma       # Generate Prisma client
```

### Docker
```bash
pnpm dk:init          # Initialize Docker containers
pnpm dk:start         # Start Docker containers
pnpm dk:stop          # Stop Docker containers
pnpm dk:clear         # Remove containers and volumes
```

### Code Generation
```bash
pnpm gen:icons        # Generate React icons from SVGs in src/components/icons/svg-sources/
pnpm gen:build-info   # Generate build info JSON
```

---

## Project Architecture

### Directory Structure
```
francis/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base UI primitives (button, card, etc.)
│   │   ├── form/        # Form field components
│   │   ├── icons/       # Icon components (generated from SVGs)
│   │   ├── brand/       # Brand components (logo)
│   │   └── errors/      # Error boundary components
│   ├── features/        # Feature-specific modules
│   │   ├── auth/        # Authentication (login, guards, permissions)
│   │   ├── account/     # User account management
│   │   ├── book/        # Book management (example feature)
│   │   ├── user/        # User management (admin)
│   │   └── devtools/    # Development utilities
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configurations
│   ├── routes/          # TanStack Router route definitions
│   │   ├── api/         # API routes (RPC, auth, uploads)
│   │   ├── app/         # User-facing app routes
│   │   ├── manager/     # Admin/manager routes
│   │   └── login/       # Authentication routes
│   ├── server/          # Backend code
│   │   ├── routers/     # ORPC API routers
│   │   ├── db/          # Prisma client and generated types
│   │   └── upload/      # File upload handlers
│   ├── env/             # Environment variable schemas
│   ├── locales/         # i18n translation files (en, fr, ar, sw)
│   ├── emails/          # Email templates (react-email)
│   └── types/           # TypeScript type definitions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed/            # Database seeding scripts
├── e2e/                 # Playwright E2E tests
├── public/              # Static assets
└── .storybook/          # Storybook configuration
```

### Key Architectural Patterns

#### API Layer (ORPC)
- Routes defined in `src/server/routers/*.ts`
- Combined in `src/server/router.ts`
- Two procedure types:
  - `publicProcedure()` - No auth required
  - `protectedProcedure({ permission })` - Requires authentication and optional permission check
- Use `context.db` for Prisma, `context.logger` for logging
- Throw `ORPCError` for API errors with proper HTTP status codes

#### Frontend Data Fetching
- TanStack Query via ORPC client
- Client setup in `src/lib/orpc-client.ts`
- Use `orpc.router.procedure.useQuery()` for queries
- Use `orpc.router.procedure.useMutation()` for mutations
- Invalidate queries after mutations with `.invalidate()`

#### Routing (TanStack Router)
- File-based routing in `src/routes/`
- Route files: `index.tsx` for page, `route.tsx` for layout
- Dynamic params: `$id.index.tsx`
- API routes: `api/*.ts`

#### Forms
- `react-hook-form` with Zod validation
- Form components in `src/components/form/`
- Schema definitions in `src/features/*/schema.ts`
- Pattern: `FormField*` components with `FieldProps` type

---

## Code Style Guidelines

### File Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | kebab-case | `user-card.tsx` |
| Hooks | camelCase with `use-` | `use-mobile.ts` |
| Utils/libs | kebab-case | `query-client.tsx` |
| Routes | TanStack Router conventions | `$id.index.tsx` |
| Stories | kebab-case + `.stories.tsx` | `button.stories.tsx` |
| Unit tests | `*.unit.{test,spec}.{ts,tsx}` | `utils.unit.spec.ts` |
| Browser tests | `*.browser.{test,spec}.{ts,tsx}` | `calendar.browser.spec.tsx` |

### Import Organization (Auto-sorted by ESLint)
1. External libraries (React, third-party packages)
2. CSS/SCSS files
3. Internal lib and hooks (`@/lib`, `@/hooks`)
4. Static data (`@/data`)
5. Components (`@/components`, `@/container`)
6. Zustand store (`@/store`)
7. Other internal imports (`@/`)
8. Relative imports (up to 3 levels)
9. Type definitions (`@/types`)

### TypeScript Conventions
- **Strict mode enabled**: `strictNullChecks`, `noUncheckedIndexedAccess`, `noImplicitAny`
- **Unused variables**: Prefix with `_` to ignore (e.g., `_unusedVar`)
- **Path aliases**: `@/*` maps to `./src/*`
- **Type definitions**: Use Zod schemas for runtime validation
- **Naming**: Types in PascalCase, avoid `T` prefix

### Component Patterns
```typescript
// Standard component structure
import { cn } from '@/lib/tailwind-utils';

interface MyComponentProps {
  title: string;
  className?: string;
}

export function MyComponent({ title, className }: MyComponentProps) {
  return (
    <div className={cn('base-classes', className)}>
      {title}
    </div>
  );
}
```

### API Router Pattern (ORPC)
```typescript
// src/server/routers/example.ts
import { z } from 'zod';
import { ORPCError } from '@orpc/server';
import { protectedProcedure } from '@/server/orpc';

const exampleRouter = {
  getAll: protectedProcedure({ permission: 'example:read' })
    .handler(async ({ context }) => {
      return context.db.example.findMany();
    }),

  create: protectedProcedure({ permission: 'example:create' })
    .input(z.object({ name: z.string().min(1) }))
    .handler(async ({ input, context }) => {
      context.logger.info({ name: input.name }, 'Creating example');
      return context.db.example.create({ data: input });
    }),
};

export default exampleRouter;
```

### Error Handling
- Use `ORPCError` for API errors with proper status codes
- React Error Boundaries for component errors
- Use `try/catch` with `context.logger` for server-side errors
- User-friendly messages via i18n translations

---

## Environment Variables

**CRITICAL**: Never use `process.env` or `import.meta.env` directly in source code.

- **Client-side**: Import from `@/env/client`
- **Server-side**: Import from `@/env/server`

ESLint enforces this rule to prevent accidental exposure of server secrets.

---

## Testing Patterns

### Browser Tests (Vitest + Playwright)
```typescript
// component.browser.spec.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('MyComponent', () => {
  it('renders correctly', async () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeDefined();
  });
});
```

### E2E Tests (Playwright)
```typescript
// e2e/example.spec.ts
import { test, expect } from '@playwright/test';

test('user can complete action', async ({ page }) => {
  await page.goto('/app');
  await expect(page.getByRole('heading')).toBeVisible();
});
```

---

## Git Hooks (Lefthook)

- **pre-commit**: Prettier formatting on staged files
- **pre-push**: Full linting (`pnpm lint`)

Always run `pnpm lint` before pushing changes.

---

## Database (Prisma)

### Schema Location
`prisma/schema.prisma`

### Generated Client
`src/server/db/generated/` (via `pnpm gen:prisma`)

### Common Operations
```typescript
// In ORPC handlers, use context.db
const users = await context.db.user.findMany();
const user = await context.db.user.create({ data: {...} });
await context.db.user.update({ where: { id }, data: {...} });
await context.db.user.delete({ where: { id } });
```

---

## Internationalization (i18n)

- **Library**: i18next + react-i18next
- **Locales**: `src/locales/{en,fr,ar,sw}/`
- **Usage**: `useTranslation()` hook
- **Required translations**: English and French for PRs

---

## Key Files Reference

| Purpose | File |
|---------|------|
| Main router | `src/server/router.ts` |
| ORPC procedures | `src/server/orpc.ts` |
| Auth config | `src/server/auth.tsx` |
| Database client | `src/server/db/index.ts` |
| Prisma schema | `prisma/schema.prisma` |
| Root route | `src/routes/__root.tsx` |
| ESLint config | `eslint.config.ts` |
| Vite config | `vite.config.ts` (implicit via TanStack Start) |
| Tailwind config | Embedded in source via Tailwind 4 |
| Environment schemas | `src/env/client.ts`, `src/env/server.ts` |

---

## Project-Specific Documentation

This project has detailed documentation for the Francis Habits system:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and technical design
- **[DATA_MODEL.md](./DATA_MODEL.md)** - Complete database schema and data models
- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - All API endpoints with TypeScript types
- **[DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)** - Development phases and milestones
- **[PROJECT_SKELETON.md](./PROJECT_SKELETON.md)** - Complete file structure guide
- **[AGENTS.md](./AGENTS.md)** - Development guidelines and coding standards

---

## Common Workflows

### Adding a New Feature
1. Create feature folder: `src/features/my-feature/`
2. Add Zod schema: `src/features/my-feature/schema.ts`
3. Create ORPC router: `src/server/routers/my-feature.ts`
4. Register router in `src/server/router.ts`
5. Add Prisma model if needed, run `pnpm gen:prisma`
6. Create page components: `src/features/my-feature/page-*.tsx`
7. Add routes: `src/routes/app/my-feature/*.tsx`
8. Add translations: `src/locales/*/my-feature.ts`

### Adding a New API Endpoint
1. Create/update router in `src/server/routers/`
2. Use `protectedProcedure` or `publicProcedure`
3. Define Zod input schema with `.input()`
4. Implement handler with `.handler()`
5. Export and register in `src/server/router.ts`

### Creating a New UI Component
1. Create in appropriate folder under `src/components/`
2. Use `cn()` for Tailwind class merging
3. Add Storybook story: `*.stories.tsx`
4. Add browser tests if interactive: `*.browser.spec.tsx`

---

## Tips for AI Assistants

1. **Always run linting before committing**: `pnpm lint`
2. **Read existing code patterns** before implementing new features
3. **Use the existing component library** in `src/components/ui/`
4. **Follow the ORPC pattern** for API endpoints
5. **Never expose environment variables** - use `@/env/*` imports
6. **Test components** with browser tests for interactions
7. **Translations are required** for user-facing text (en/fr minimum)
8. **Prisma changes** require `pnpm gen:prisma` and `pnpm db:push`
9. **Check AGENTS.md** for detailed coding standards
10. **Use context.logger** for server-side logging, not console.log
