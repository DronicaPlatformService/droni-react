# GitHub Copilot Instructions for Droni React

## 1. Architecture & Patterns
- **Hybrid App**: React (TypeScript), TanStack (Router, Query, Store), Tailwind CSS, Vite, Capacitor for mobile/web.
- **Routing**: File-based with TanStack Router (`src/routes`). Root layout in `__root.tsx` applies to all routes. Use `<Outlet />` for nested content.
- **Data Fetching**: Prefer TanStack Query for server state. Use route `loader` for SSR-like data preloading. See `src/integrations/tanstack-query/` for setup and global error handling.
- **State Management**: TanStack Store for global client state (see `src/stores/`). Local state via `useState`/`useReducer`.
- **Styling**: Tailwind CSS utility classes in JSX. No custom CSS except for variables in `src/styles.css`. Use `clsx`/`tailwind-merge` for dynamic classes.
- **Component Structure**: Co-locate feature components, hooks, and tests. Use `index.ts` for barrel exports.
- **TypeScript**: All code is strictly typed. Props, state, and API responses must have explicit types.

## 2. Developer Workflow
- **Install**: `pnpm install`
- **Dev Server**: `pnpm start` (Vite)
- **Build**: `pnpm build`
- **Test**: `pnpm test` (Vitest + React Testing Library)
- **Lint/Format**: `pnpm lint`, `pnpm format`, `pnpm check` (Biome)
- **Deploy**: Use `./deploy.sh [production|staging] [options]` (see `DEPLOYMENT.md` for advanced/rollback)
- **Logs**: `tail -f logs/deploy-*.log` or `docker compose logs -f frontend`

## 3. Project Conventions
- **Absolute Imports**: Use `@/` for `src/` (see `vite.config.js` alias).
- **Commit Style**: Conventional Commits (`feat:`, `fix:`, etc.).
- **Immutability**: Never mutate state/props directly.
- **SRP/DRY**: Extract logic to hooks/components. Example: `useTokenExpirationMonitor` in `src/hooks/`.
- **Error Handling**: Use TanStack Query's error states and global handlers in `root-provider.tsx`.
- **Testing**: Focus on user-centric tests. Use MSW for API mocking.

## 4. Integration & External
- **API**: Use `src/lib/apiClient.ts` for HTTP. JWT utils in `src/lib/jwtUtils.ts`.
- **Mobile**: Capacitor config in `capacitor.config.ts` and `android/`.
- **Env Vars**: Only `VITE_`-prefixed vars are exposed to client. Type in `vite-env.d.ts`.
- **Proxy**: Dev API proxy set in `vite.config.js`.

## 5. Examples & References
- **Feature Example**: See `src/components/Dashboard/` for co-located UI, types, and index barrel.
- **Global Query Setup**: `src/integrations/tanstack-query/root-provider.tsx`
- **Deployment**: `DEPLOYMENT.md` and `deploy.sh` for full CI/CD and troubleshooting.

---
For more, see `README.md` and `DEPLOYMENT.md`. When in doubt, follow patterns from existing feature folders and scripts.
