# Modern React Coding Guidelines (Production Level with TanStack & Biome)

**Current Date for Context:** May 8, 2025

These guidelines aim to promote code that is readable, maintainable, scalable, performant, and testable. They emphasize modern React features, best practices, and the use of the TanStack ecosystem (Query, Router, Table, Form, Store) and Biome for tooling. This includes considerations for evolving patterns like React Server Components.

---

## 1. General Principles

1.  **Functional Components and Hooks First:**
    * **Always prefer functional components with Hooks over class components for client-side interactivity.**
    * Understand the distinction between Client Components (interactive, using Hooks) and Server Components (see section 16).
    * Leverage the TanStack ecosystem for robust, type-safe, and headless solutions to common application concerns.

2.  **Immutability:**
    * **Never mutate state or props directly.** Always create new objects/arrays when updating state.
    * TanStack libraries (like Query, Store) often manage their state immutably internally or provide mechanisms that encourage it.

3.  **Readability and Simplicity (KISS):**
    * Write code that is easy to understand. TanStack's declarative APIs can aid in this.
    * Avoid overly clever solutions. Break down complex logic into smaller, well-named functions or custom Hooks.

4.  **DRY (Don't Repeat Yourself):**
    * Abstract repetitive logic into reusable components, custom Hooks, or leverage TanStack utilities.
    * Be mindful of premature abstraction.

5.  **Single Responsibility Principle (SRP):**
    * Components and Hooks should ideally do one thing well.
    * TanStack's headless libraries help by separating concerns (e.g., table logic from table presentation).

6.  **TypeScript (Mandatory):**
    * **Use TypeScript for all new React code.** The TanStack ecosystem is built with TypeScript first, offering excellent type safety and inference.
    * Define clear types/interfaces for props, state, API responses, form schemas, route params, etc.

---

## 2. Component Design

1.  **Naming Conventions:**
    * **Components:** `PascalCase` (e.g., `UserProfileCard.tsx`). Mark client components explicitly if using RSCs (e.g., `UserProfileCard.client.tsx` or with `"use client";` directive).
    * **Component Files:** Match the component name.
    * **Hooks:** `useCamelCase` (e.g., `useUserData.ts`).
    * **Regular Functions/Variables:** `camelCase`.
    * **Constants:** `UPPER_SNAKE_CASE`.

2.  **Component Structure (Example - Client Component):**
    * *Note on `React.FC`*: Explicitly typing props without `React.FC` (e.g., `const MyComponent = (props: MyComponentProps): JSX.Element => { ... };`) is often preferred for clarity, especially if `children` are not always expected.

    ```typescript
    // src/components/UserProfileCard/UserProfileCard.client.tsx
    "use client";

    import React from 'react';
    import { useSuspenseQuery } from '@tanstack/react-query'; // Example with TanStack Query
    import { fetchUserProfile } from '@/api/userService'; // Your API function
    import styles from './UserProfileCard.module.css';

    interface UserProfileCardProps {
      userId: string;
      initialName?: string;
    }

    /**
     * @description Displays user profile information. Fetches data using TanStack Query.
     * @param {string} userId - The ID of the user to display.
     * @param {string} [initialName] - An optional initial name for suspense fallback.
     */
    const UserProfileCard = ({ userId, initialName = "Loading..." }: UserProfileCardProps): JSX.Element => {
      const { data: userData, error, isLoading } = useSuspenseQuery({ // or useQuery
        queryKey: ['userProfile', userId],
        queryFn: () => fetchUserProfile(userId),
        enabled: !!userId, // Only run if userId is present
      });

      // isLoading state might be handled by <Suspense> if using useSuspenseQuery
      // For useQuery, you would handle isLoading explicitly:
      // if (isLoading) return <div className={styles.loadingState}>Loading profile for {initialName}...</div>;

      if (error) {
        return <div className={styles.errorState}>Error: {error.message}</div>;
      }

      return (
        <div className={styles.card}>
          <h2>{userData.name}</h2>
          <p>Email: {userData.email}</p>
          {/* Further actions could use TanStack Form or mutations via TanStack Query */}
        </div>
      );
    };

    export default UserProfileCard;
    ```

3.  **Props:**
    * Destructure props. Provide default values. Use TypeScript interfaces/types.
    * Avoid prop drilling. Consider `useContext`, component composition, or state management solutions like TanStack Store.

4.  **Conditional Rendering:** Use ternaries, `&&`, or map data to UI. Suspense (often paired with TanStack Query) handles loading states declaratively.
5.  **Fragments:** Use `<>` or `React.Fragment`.
6.  **Keys:** Provide stable, unique `key` props for lists.
7.  **Semantic HTML & Accessibility (a11y):**
    * Prioritize semantic HTML. Ensure keyboard accessibility. Use ARIA attributes correctly.
    * Many TanStack libraries (like Table, Form) are headless, giving you full control over markup and a11y.

---

## 3. Client-Side State Management

1.  **Local Component State (`useState`, `useReducer`):**
    * Use for simple, component-specific UI state that doesn't need to be shared or persisted globally.

2.  **Global Client State (TanStack Store - formerly Zustand):**
    * **Prefer TanStack Store for global client-side state management.**
    * Its benefits include:
        * **Simplicity:** Minimal boilerplate, intuitive API.
        * **Performance:** Renders components only on relevant state changes.
        * **Flexibility:** Can be used with or without React Context.
        * **TypeScript Support:** Excellent type safety.
    * Suitable for theme, user preferences, session information (non-sensitive), UI state shared across many components.

    ```typescript
    // src/stores/uiStore.ts
    import { createStore } from '@tanstack/store';

    interface UIState {
      isSidebarOpen: boolean;
      toggleSidebar: () => void;
    }

    export const uiStore = createStore<UIState>((set) => ({
      isSidebarOpen: false,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }));

    // In a component:
    // import { uiStore } from '@/stores/uiStore';
    // const isSidebarOpen = uiStore.useStore((state) => state.isSidebarOpen);
    // const toggleSidebar = uiStore.useStore((state) => state.toggleSidebar);
    ```

---

## 4. Data Fetching and Server State Management (TanStack Query)

* **Utilize TanStack Query (React Query) for all asynchronous server state management.** This includes data fetching, caching, synchronization, and updates.
* **Key Features & Benefits:**
    * **Declarative Data Fetching:** Simplifies fetching, caching, and updating data.
    * **Automatic Caching & Refetching:** Stale-while-revalidate, window focus refetching, polling.
    * **Optimistic Updates:** Improve perceived performance for mutations.
    * **Pagination & Infinite Scroll:** Built-in support.
    * **Devtools:** Excellent for debugging queries and mutations.
    * **Suspense & Error Boundary Integration:** Works seamlessly.
    * **Framework Agnostic Core:** React adapters provide Hooks like `useQuery`, `useSuspenseQuery`, `useMutation`.
    * **Complements RSCs & Server Actions:** Use TanStack Query in Client Components to fetch data or call Server Actions (via mutations) and manage the server state.

```typescript
// src/api/userService.ts (example API function)
export interface User { id: string; name: string; email: string; }
export const fetchUserProfile = async (userId: string): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};
export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
};

// src/components/EditUserProfileForm.client.tsx
"use client";
import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { updateUserProfile, User } from '@/api/userService';
// Assume TanStack Form is used here (see section 5)

const EditUserProfileForm = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedData: Partial<User>) => updateUserProfile(userId, updatedData),
    onSuccess: (data) => {
      // Invalidate and refetch the userProfile query after a successful update
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      // Optionally, update the cache directly
      queryClient.setQueryData(['userProfile', userId], data);
      console.log('Profile updated!', data);
    },
    onError: (error) => {
      console.error('Update failed:', error.message);
    },
  });

  const handleSubmit = (formData: Partial<User>) => { // formData from TanStack Form
    mutation.mutate(formData);
  };

  // ... form rendering using TanStack Form ...
  // On form submit, call handleSubmit(formData)
  return (
    <form onSubmit={(e) => { /* e.preventDefault(); handle actual form submission */ }}>
      {/* Form fields for name, email etc. */}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save Changes'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </form>
  );
};
export default EditUserProfileForm;
```

---

## 5. Forms (TanStack Form)

* **Adopt TanStack Form for building and managing forms.**
* **Advantages:**
    * **Headless:** Gives full control over markup and styling.
    * **Type-Safe:** Excellent TypeScript support for form values, validation, and submission.
    * **Performant:** Optimized for minimal re-renders.
    * **Framework Agnostic Core:** Built for many frameworks, with great React integration.
    * **Validation:** Integrates with validation libraries like Zod, Yup, Valibot or supports custom validation.

```typescript
// src/components/MyForm.client.tsx
"use client";
import React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter'; // Example with Zod
import { z } from 'zod';

const MyForm = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      // `value` is type-safe here
      console.log('Form submitted:', value);
      // Example: call a mutation from TanStack Query
      // await loginMutation.mutateAsync(value);
    },
    validatorAdapter: zodValidator,
  });

  return (
    <form.Provider>
      <form onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}>
        <form.Field
          name="email"
          validators={{
            onChange: z.string().email('Invalid email address'),
          }}
          children={(field) => (
            <div>
              <label htmlFor={field.name}>Email:</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors && <em role="alert">{field.state.meta.errors.join(', ')}</em>}
            </div>
          )}
        />
        {/* ... other fields (password, etc.) ... */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        />
      </form>
    </form.Provider>
  );
};
export default MyForm;
```

---

## 6. Data Display - Tables & Lists (TanStack Table)

* **Use TanStack Table for any complex table or data grid requirements.**
* **Benefits:**
    * **Headless:** You control the rendering, styling, and markup completely.
    * **Powerful Features:** Sorting, filtering, pagination, grouping, column resizing, virtualization hooks, etc.
    * **Lightweight and Performant.**
    * **Extensible Plugin System.**
    * **Excellent TypeScript Support.**

```typescript
// In a component using TanStack Table
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from '@tanstack/react-table';
//
// const columnHelper = createColumnHelper<YourDataType>();
// const columns = [ /* Define your columns using columnHelper */ ];
// const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
//
// // Then render table.getHeaderGroups(), table.getRowModel().rows, etc.
```

---

## 7. Routing (TanStack Router)

* **Employ TanStack Router for client-side and type-safe routing.**
* **Key Advantages:**
    * **Fully Type-Safe:** End-to-end type safety for routes, search params, path params.
    * **Modern Features:** File-based routing option, nested routes, layouts, search param schemas (with validation e.g., Zod), pending UI, data loading.
    * **Performance:** Built with performance in mind.
    * **RSC and Suspense Ready:** Designed for modern React features.
    * **Integration with TanStack Query:** For seamless data loading on route transitions.

```typescript
// src/routeTree.gen.ts - often auto-generated by TanStack Router CLI
// Defines your route structure

// Example of defining a route (can also be file-based)
// import { createRootRoute, createRoute } from '@tanstack/react-router'
// import { z } from 'zod'

// const rootRoute = createRootRoute()
// const postsRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: 'posts',
//   // loader: async () => ({ posts: await fetchPosts() }) // Data loading
// })
// const postIdRoute = createRoute({
//   getParentRoute: () => postsRoute,
//   path: '$postId',
//   parseParams: (params) => ({ postId: z.number().int().parse(parseInt(params.postId)) }),
//   // loader: async ({ params }) => ({ post: await fetchPostById(params.postId) })
// })
// ...
```

---

## 8. Hooks (Custom React Hooks)

1.  **Rules of Hooks:** Adhere strictly.
2.  **`useEffect`:**
    * Use sparingly. Many side effects related to data fetching and synchronization are better handled by TanStack Query.
    * Still useful for browser-specific side effects not covered by other libraries (e.g., direct DOM manipulation, certain event listeners).
    * **Dependency Array:** Always provide a correct and stable dependency array. Be wary of objects/arrays recreated on each render.
    * **Cleanup Function:** Essential for subscriptions, timers.
3.  **`useCallback`, `useMemo`:**
    * Use to optimize performance by memoizing functions and values, especially when passing them as props to memoized components (`React.memo`) or as dependencies to other Hooks.
    * Profile first. Overuse can add complexity without benefit. TanStack libraries often handle memoization internally where critical.
4.  **`useRef`:** For DOM access or mutable values not triggering re-renders.
5.  **Custom Hooks:** Extract reusable client-side logic. Start names with `use`.

---

## 9. Styling

(This section remains largely the same as the previous version, as TanStack libraries are headless and don't dictate styling methods.)

1.  **Choose a Strategy and Be Consistent:** CSS Modules, Styled-components/Emotion, Tailwind CSS, Plain CSS/Sass with BEM.
2.  **Avoid Inline Styles for Complex Styling.**
3.  **Theming:** Use React Context API or CSS Custom Properties.

---

## 10. Performance Optimization (General React)

(TanStack libraries are generally very performant, but these React-specific tips still apply.)

1.  **`React.memo` (For Client Components):** Memoize components if props are stable and rendering is expensive.
2.  **Code Splitting (`React.lazy` and `Suspense`):** For client components not immediately needed.
3.  **Windowing/Virtualization for Large Lists:**
    * Use libraries like `react-virtual` (from TanStack) or `react-window` for client-rendered large lists.
    * TanStack Table has hooks to assist with virtualization.
4.  **Minimize Re-renders:** Profile with React DevTools.
5.  **Debouncing and Throttling:** For frequent client events.

---

## 11. Error Handling

1.  **TanStack Query Error Handling:**
    * Use the `error` state and `onError` callbacks provided by `useQuery` and `useMutation`.
    * Integrates with React's Error Boundaries for render errors if queries suspend.
2.  **TanStack Form Validation Errors:** Handled by the library, display them appropriately.
3.  **Error Boundaries (Client Components):** Catch rendering errors in child components.
4.  **Try/Catch:** For imperative async code or event handlers not covered by TanStack Query.
5.  **Suspense for Data Fetching:** Handles loading and error states declaratively, especially when used with TanStack Query and TanStack Router.

---

## 12. Testing

1.  **Test Runner & Utilities:** Use Vitest or Jest. Use React Testing Library (RTL) for component interaction testing.
2.  **TanStack Query Testing:**
    * Wrap tests with `QueryClientProvider`.
    * Mock API calls (e.g., using `msw` - Mock Service Worker).
    * Test loading, success, and error states of queries and mutations.
3.  **TanStack Form Testing:** Test form submissions, validation logic, and user interactions. RTL is excellent for this.
4.  **TanStack Table Testing:** Test interactions like sorting, filtering if UI controls are provided.
5.  **TanStack Router Testing:** Test navigation, route loading, and param handling.
6.  **Accessibility (a11y) Testing:** Use `jest-axe` or similar tools.

---

## 13. Commenting Guidelines

(This section remains largely the same, ensure JSDoc describes props, hook params, and TanStack configurations where non-obvious.)

1.  **Why, Not What.**
2.  **JSDoc for Components, Props, Hooks, Server Actions, and complex TanStack configurations.**
3.  **Comment Complex Logic.**
4.  **`// TODO:`, `// FIXME:`, `// HACK:`**.
5.  **Avoid Obsolete Comments.**
6.  **Header Comments for Files (Optional).**
7.  **Comment Exported Functions/Values.**

---

## 14. Code Formatting & Linting (Biome)

* **Utilize Biome for all code formatting, linting, and organization needs.**
* **Benefits of Biome:**
    * **All-in-One Tool:** Replaces Prettier, ESLint, and others with a single, fast binary.
    * **Performance:** Extremely fast, written in Rust.
    * **Sensible Defaults:** Provides good defaults with options for configuration via `biome.json`.
    * **Comprehensive:** Lints for correctness, style, complexity, and accessibility. Formats code consistently.
* **Configuration:**
    * Create a `biome.json` or `biome.jsonc` file in your project root.
    * Configure formatter (e.g., line width, indent style) and linter rules as needed.
    * Example `biome.jsonc`:
        ```jsonc
        // biome.jsonc
        {
          "$schema": "[https://biomejs.dev/schemas/1.7.3/schema.json](https://biomejs.dev/schemas/1.7.3/schema.json)", // Use the latest schema version
          "organizeImports": {
            "enabled": true
          },
          "linter": {
            "enabled": true,
            "rules": {
              "recommended": true,
              // Example: enable specific React lint rules if not covered by recommended
              "suspicious": {
                "noExplicitAny": "warn" // Or "off" / "error"
              },
              "style": {
                // "noNonNullAssertion": "warn"
              }
              // Configure more rules as needed
            }
          },
          "formatter": {
            "enabled": true,
            "formatWithErrors": false,
            "indentStyle": "space",
            "indentWidth": 2,
            "lineWidth": 100
          },
          "javascript": {
            "formatter": {
              "quoteStyle": "single",
              "jsxQuoteStyle": "double",
              "semicolons": "always"
            }
          }
        }
        ```
* **Integration:**
    * Integrate Biome with your editor (e.g., VS Code extension).
    * Add Biome commands to your `package.json` scripts and pre-commit hooks (e.g., using `lint-staged`).
        ```bash
        # package.json scripts example
        # "scripts": {
        #   "lint": "biome lint ./src",
        #   "format": "biome format --write ./src",
        #   "check": "biome check --apply ./src"
        # }
        ```
* **Enforce in CI/CD:** Run `biome check` or `biome lint && biome format --check` in your CI pipeline.

---

## 15. File and Folder Structure

(This section remains largely the same. Co-locate TanStack configurations like route definitions or store slices with their relevant features if using a feature-based structure.)

1.  **Organize by Feature or Domain.**
2.  **Co-locate Component Files.**
3.  **Use `index.ts` for Exports.**

---

## 16. Evolving Patterns: React Server Components (RSCs)

(This section remains important. TanStack libraries are generally designed to work well in both client and server environments, or provide clear guidance on their usage with RSCs.)

1.  **Understand Server vs. Client Components.**
2.  **`"use client";` Directive:** Marks the boundary.
3.  **Server Actions:** Use for mutations from client to server. TanStack Query's `useMutation` can call Server Actions.
4.  **Data Fetching with RSCs:**
    * Server Components can fetch data directly or use TanStack Query (if adapted for server environments, often via framework integration like Next.js App Router data fetching).
    * Client Components use TanStack Query for their data needs.
5.  **Interleaving and Props:** Standard RSC rules apply.
6.  **When to Use Which:** Prioritize Server Components; use Client Components for interactivity. TanStack libraries can bridge or operate within these contexts. For instance, TanStack Router is being designed with RSCs in mind.

---

By adhering to these guidelines, your team can build robust, maintainable, and modern React applications leveraging the power and type safety of the TanStack ecosystem and Biome. Remember that guidelines are living documents.
