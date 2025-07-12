# GitHub Copilot Instructions for Modern React Development

## 1. Core Stack & Principles

-   **Tech Stack**: React (with Server Components), TypeScript, TanStack (Query, Router, Table, Form, Store), Tailwind CSS, Vite.
-   **Tooling**: Use **Biome** for all formatting and linting.
-   **Commits**: Adhere strictly to **Conventional Commits** (`feat:`, `fix:`, `refactor:`, etc.).
-   **Architecture**: This is a hybrid app using **Capacitor**, so ensure web standards compatibility. The primary framework pattern is **React Server Components (RSCs)**.
-   **Guiding Principles**:
    -   **Functional Components & Hooks First**: No class components.
    -   **TypeScript is Mandatory**: Type everything (props, state, API responses).
    -   **Immutability**: Never mutate state or props directly.
    -   **Single Responsibility Principle (SRP)**: Components and hooks should do one thing well.
    -   **DRY**: Abstract repeated logic into custom hooks and common UI into reusable components.

---

## 2. Component & File Structure

-   **Component Naming**: `PascalCase` (e.g., `UserProfile.tsx`).
-   **Hook Naming**: `useCamelCase` (e.g., `useUserData.ts`).
-   **Client Components**: Must start with the `"use client";` directive. Keep them as small as possible ("islands of interactivity").
-   **Server Components (RSC)**: The default. Use them for data fetching (`async/await`) and passing data down to client components. They cannot use hooks like `useState`.
-   **File Organization**: Organize by feature/domain. Co-locate related files (component, test, styles) in the same folder. Use `index.ts` barrel files for clean exports.
-   **Path Aliases**: Use `@/*` for absolute imports from the `src/` directory.

---

## 3. State & Data Management

-   **Server State**: Use **TanStack Query** (`useQuery`, `useSuspenseQuery`, `useMutation`) for all API interactions (fetching, caching, updating). This is the standard for server state.
    -   Mutations should often call **Server Actions**.
    -   Leverage `queryKey` for caching and invalidation.
-   **Global Client State**: Use **TanStack Store** (formerly Zustand) for UI state shared across the application (e.g., theme, sidebar open/closed).
-   **Local Component State**: Use `useState` or `useReducer` for state that is local to a single component and doesn't need to be shared.

---

## 4. Key Libraries & Usage

-   **Styling**: **Tailwind CSS** is the primary method.
    -   Use utility classes directly in JSX.
    -   For reusable styles, create a React component (e.g., `<Button>`), not custom CSS classes with `@apply`.
    -   Use `tailwind-merge` and `clsx` to handle conditional and conflicting classes in components.
-   **Forms**: Use **TanStack Form**.
    -   It's headless, giving full control over markup and styling with Tailwind.
    -   Integrate with a schema validator like **Zod** for type-safe validation.
-   **Tables & Data Grids**: Use **TanStack Table**.
    -   It's headless; you are responsible for all rendering and styling with `<table>`, `<td>`, etc., using Tailwind classes.
    -   Implement features like sorting, filtering, and pagination using the provided hooks.
-   **Routing**: Use **TanStack Router**.
    -   It's fully type-safe (paths, params, search).
    -   Use its file-based routing or code-based configuration.
    -   Leverage loaders to fetch data before rendering a route.
-   **Environment Variables**:
    -   Use Vite's convention: only variables prefixed with `VITE_` are exposed to the client.
    -   Access them via `import.meta.env.VITE_VARIABLE_NAME`.
    -   Define types for env variables in `vite-env.d.ts`.

---

## 5. Coding & API Design

-   **Props**: Always destructure props and define their types using a TypeScript `interface` or `type`.
-   **Custom Hooks**: Extract any reusable logic (e.g., `useDebounce`, `useWindowSize`). They must be testable in isolation.
-   **`useEffect`**: Use sparingly. TanStack Query should handle most data-fetching side effects. Reserve `useEffect` for interactions with browser APIs or third-party libraries.
-   **Error Handling**: Use TanStack Query's `error` state, mutation `onError` callbacks, and React **Error Boundaries** to handle errors gracefully.
-   **Testing**: Use **Vitest** and **React Testing Library (RTL)**.
    -   Focus on user-centric testing; avoid implementation details.
    -   Use **Mock Service Worker (MSW)** to mock API requests.
    -   Test custom hooks with `@testing-library/react`'s `renderHook`.

---

# 6. package.json Dependencies (Based on Major Versions)

## dependencies
- @capacitor/android: ^7
- @capacitor/core: ^7
- @capacitor/ios: ^7
- @headlessui/react: ^2
- @heroicons/react: ^2
- @tailwindcss/vite: ^4
- @tanstack/react-form: ^1
- @tanstack/react-query: ^5
- @tanstack/react-query-devtools: ^5
- @tanstack/react-router: ^1
- @tanstack/react-router-devtools: ^1
- @tanstack/react-store: ^0
- @tanstack/router-core: ^1
- @tanstack/router-plugin: ^1
- @tanstack/store: ^0
- axios: ^1
- react: ^19
- react-dom: ^19
- tailwind-merge: ^3
- tailwindcss: ^4
- tiny-invariant: ^1
- zod: ^3

## devDependencies
- @capacitor/cli: ^7
- @testing-library/dom: ^10
- @testing-library/react: ^16
- @types/node: ^24
- @types/react: ^19
- @types/react-dom: ^19
- @vitejs/plugin-react: ^4
- dotenv-cli: ^8
- jsdom: ^26
- typescript: ^5
- vite: ^7
- vitest: ^3
- web-vitals: ^5
