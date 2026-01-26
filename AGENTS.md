# AGENTS.md - Development Guidelines

## Project Overview

This is a React 19 TypeScript web application using modern patterns with TanStack Router, TanStack Query, Prisma ORM, Better Auth, and Tailwind CSS. The project follows a full-stack architecture with shared types and a structured component system.

## Commands

### Development
- `pnpm dev` - Start development server with all services
- `pnpm build` - Build for production 
- `pnpm start` - Start production server
- `pnpm storybook` - Start Storybook dev server

### Code Quality
- `pnpm lint` - Run all linting (ESLint + TypeScript)
- `pnpm lint:eslint` - Run ESLint with auto-fix
- `pnpm lint:ts` - TypeScript type checking (no emit)
- `pnpm pretty` - Format code with Prettier

### Testing
- `pnpm test` - Run tests in browser (headless)
- `pnpm test:ci` - Run tests in CI mode (single run)
- `pnpm test:ui` - Run tests with UI
- **Single test**: Use `vitest run --reporter=verbose path/to/test.file.ts` for specific test files

### E2E Testing
- `pnpm e2e` - Run Playwright tests
- `pnpm e2e:ui` - Run Playwright with UI
- `pnpm e2e:setup` - Run Playwright setup tests

### Database
- `pnpm db:push` - Push schema changes to database
- `pnpm db:seed` - Seed database with initial data
- `pnpm db:ui` - Open Prisma Studio
- `pnpm gen:prisma` - Generate Prisma client

### Code Generation
- `pnpm gen:build-info` - Generate build info JSON
- `pnpm gen:icons` - Generate React icons from SVGs

## Code Style Guidelines

### File Naming
- **Components**: kebab-case (e.g., `user-card.tsx`, `form-field-text.tsx`)
- **Hooks**: camelCase with `use-` prefix (e.g., `use-mobile.ts`, `use-clipboard.ts`)
- **Utils/libraries**: kebab-case (e.g., `query-client.tsx`, `tailwind-utils.ts`)
- **Routes**: follow TanStack Router conventions
- **Stories**: kebab-case with `.stories.tsx` suffix
- **Tests**: 
  - Unit: `*.unit.{test,spec}.{ts,tsx}`
  - Browser: `*.browser.{test,spec}.{ts,tsx}`

### Import Organization
Imports are auto-sorted by eslint-plugin-simple-import-sort with this order:
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
- **Unused variables**: Prefix with `_` to ignore unused warnings
- **Type definitions**: Use Zod schemas for runtime validation
- **Path aliases**: `@/*` maps to `./src/*`

### Component Patterns
- Use React 19 features (Server Components when applicable)
- Forms with `react-hook-form` + Zod validation
- State management with Zustand
- Styled with Tailwind CSS using `cn()` utility
- Error boundaries for error handling

### API Layer
- ORPC for type-safe API routes
- Prisma for database operations
- Protected procedures with permissions
- Consistent error handling with `ORPCError`
- Use `context.logger` for logging

### Naming Conventions
- **Variables**: camelCase
- **Functions**: camelCase, verb-first for actions (`getUser`, `createHabit`)
- **Components**: PascalCase (React), kebab-case for files
- **Constants**: UPPER_SNAKE_CASE for exports
- **Types**: PascalCase, prefix with `T` rarely (prefer interfaces/type inference)
- **Enums**: PascalCase with descriptive names

### Error Handling
- Use `ORPCError` for API errors with proper HTTP status codes
- React Error Boundaries for component errors
- `try/catch` with proper logging using `context.logger`
- User-friendly error messages via i18n

### Styling Guidelines
- Tailwind CSS with `cn()` utility for conditional classes
- Component variants using `class-variance-authority`
- Responsive design mobile-first
- Dark mode support via `next-themes`

### Environment Variables
- **Client**: Use `@/env/client` instead of `import.meta.env`
- **Server**: Use `@/env/server` instead of `process.env`
- Custom env variables are blocked by ESLint rule

### Testing Patterns
- Unit tests with Vitest (Node environment)
- Browser tests with Vitest + Playwright
- E2E tests with Playwright
- Test files co-located with source files
- Use `*.browser.spec.tsx` for component interaction tests

### Internationalization
- i18next for translations
- Locale files in `src/locales/[lang]/`
- React components use `useTranslation()` hook
- Support for multiple languages (en, ar, sw, fr)

### Git Hooks
- Lefthook manages pre-commit hooks
- Runs linting and type checking on commit
- Ensure all tests pass before pushing

## Architecture Notes

### Directory Structure
```
src/
├── components/     # Reusable UI components
├── features/      # Feature-specific components and logic
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── routes/        # TanStack Router route definitions
├── server/        # Backend code (API, DB, auth)
├── types/         # TypeScript type definitions
└── tests/         # Test setup and utilities
```

### Key Technologies
- **Frontend**: React 19, TypeScript, Tailwind CSS, TanStack Router/Query
- **Backend**: Node.js, Prisma, Better Auth, ORPC
- **Testing**: Vitest, Playwright, Testing Library
- **Build**: Vite, ES modules only

### Development Workflow
1. Feature development in feature branches
2. Code review ensures adherence to these guidelines
3. CI/CD runs linting, type checking, and tests
4. Deploy to staging for manual testing
5. Merge to main triggers production deployment

Remember to run `pnpm lint` and `pnpm test:ci` before committing changes.