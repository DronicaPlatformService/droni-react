# Modern React Coding Guidelines (Production Level with TanStack, Tailwind CSS & Biome)

**Current Date for Context:** May 9, 2025

These guidelines aim to promote code that is readable, maintainable, scalable, performant, and testable. They emphasize modern React features, best practices, the use of the TanStack ecosystem (Query, Router, Table, Form, Store), Tailwind CSS for styling, and Biome for tooling. This includes considerations for evolving patterns like React Server Components.

---

## 1. General Principles

1.  **Functional Components and Hooks First:**

    - **Always prefer functional components with Hooks over class components for client-side interactivity.**
    - Understand the distinction between Client Components (interactive, using Hooks) and Server Components (see section 16).
    - Leverage the TanStack ecosystem for robust, type-safe, and headless solutions to common application concerns.

2.  **Immutability:**

    - **Never mutate state or props directly.** Always create new objects/arrays when updating state.
    - TanStack libraries (like Query, Store) often manage their state immutably internally or provide mechanisms that encourage it.

3.  **Readability and Simplicity (KISS):**

    - Write code that is easy to understand. TanStack's declarative APIs and Tailwind's semantic class names (when composed well) can aid in this.
    - Avoid overly clever solutions. Break down complex logic into smaller, well-named functions or custom Hooks.

4.  **DRY (Don't Repeat Yourself):**

    - Abstract repetitive logic or **common UI patterns/class combinations (especially with Tailwind CSS)** into reusable components or custom Hooks. Use Tailwind's `@apply` directive sparingly for very common, small utility combinations within CSS if necessary.
    - Be mindful of premature abstraction.

5.  **Single Responsibility Principle (SRP):**

    - Components and Hooks should ideally do one thing well.
    - TanStack's headless libraries help by separating concerns. Tailwind CSS allows presentational components to focus solely on their appearance via utility classes.

6.  **TypeScript (Mandatory):**
    - **Use TypeScript for all new React code.** The TanStack ecosystem is built with TypeScript first, offering excellent type safety and inference.
    - Define clear types/interfaces for props, state, API responses, form schemas, route params, etc.

---

## 2. Component Design

1.  **Naming Conventions:**

    - **Components:** `PascalCase` (e.g., `UserProfileCard.tsx`). Mark client components explicitly if using RSCs (e.g., `UserProfileCard.client.tsx` or with `"use client";` directive).
    - **Component Files:** Match the component name.
    - **Hooks:** `useCamelCase` (e.g., `useUserData.ts`).
    - **Regular Functions/Variables:** `camelCase`.
    - **Constants:** `UPPER_SNAKE_CASE`.

2.  **Component Structure (Example - Client Component with Tailwind CSS):**

    - _Note on `React.FC`_: Explicitly typing props without `React.FC` (e.g., `const MyComponent = (props: MyComponentProps): JSX.Element => { ... };`) is often preferred for clarity.

    ```typescript
    // src/components/UserProfileCard/UserProfileCard.client.tsx
    'use client';

    import React from 'react';
    import { useSuspenseQuery } from '@tanstack/react-query';
    import { fetchUserProfile } from '@/api/userService'; // Assuming userService is in @/api or @/services
    // No specific CSS import needed for Tailwind utilities if configured globally

    interface UserProfileCardProps {
      userId: string;
      initialName?: string;
    }

    /**
     * @description Displays user profile information. Fetches data using TanStack Query.
     * Styled with Tailwind CSS.
     * @param {string} userId - The ID of the user to display.
     * @param {string} [initialName="Loading..."] - An optional initial name for suspense fallback.
     */
    const UserProfileCard = ({
      userId,
      initialName = 'Loading...',
    }: UserProfileCardProps): JSX.Element => {
      const { data: userData, error } = useSuspenseQuery({
        queryKey: ['userProfile', userId],
        queryFn: () => fetchUserProfile(userId),
        enabled: !!userId,
      });

      // isLoading state handled by <Suspense> boundary typically

      if (error) {
        return (
          <div className="p-4 border border-red-300 bg-red-100 text-red-700 rounded-md shadow-sm">
            <p className="font-semibold">Error:</p>
            <p>{error.message}</p>
          </div>
        );
      }

      return (
        <div className="p-6 bg-white shadow-xl rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{userData.name}</h2>
          <p className="text-md text-gray-600">
            <span className="font-semibold">Email:</span> {userData.email}
          </p>
          {/* Further actions could use TanStack Form or mutations via TanStack Query */}
        </div>
      );
    };

    export default UserProfileCard;
    ```

3.  **Props:**

    - Destructure props. Provide default values. Use TypeScript interfaces/types.
    - Avoid prop drilling. Consider `useContext`, component composition, or state management solutions like TanStack Store.

4.  **Conditional Rendering:** Use ternaries, `&&`, or map data to UI. Suspense (often paired with TanStack Query) handles loading states declaratively. Use libraries like `clsx` or `tailwind-merge` for conditionally applying Tailwind classes.
5.  **Fragments:** Use `<>` or `React.Fragment`.
6.  **Keys:** Provide stable, unique `key` props for lists.
7.  **Semantic HTML & Accessibility (a11y):**
    - Prioritize semantic HTML. Ensure keyboard accessibility. Use ARIA attributes correctly.
    - Tailwind CSS gives you full control over the markup, so ensure generated HTML is accessible. Many TanStack libraries (like Table, Form) are headless, aiding this.

---

## 3. Client-Side State Management

1.  **Local Component State (`useState`, `useReducer`):**

    - Use for simple, component-specific UI state that doesn't need to be shared or persisted globally.

2.  **Global Client State (TanStack Store - formerly Zustand):**

    - **Prefer TanStack Store for global client-side state management.**
    - Its benefits include:
      - **Simplicity:** Minimal boilerplate, intuitive API.
      - **Performance:** Renders components only on relevant state changes.
      - **Flexibility:** Can be used with or without React Context.
      - **TypeScript Support:** Excellent type safety.
    - Suitable for theme, user preferences, session information (non-sensitive), UI state shared across many components.

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

- **Utilize TanStack Query (React Query) for all asynchronous server state management.** This includes data fetching, caching, synchronization, and updates.
- **Key Features & Benefits:**
  - **Declarative Data Fetching:** Simplifies fetching, caching, and updating data.
  - **Automatic Caching & Refetching:** Stale-while-revalidate, window focus refetching, polling.
  - **Optimistic Updates:** Improve perceived performance for mutations.
  - **Pagination & Infinite Scroll:** Built-in support.
  - **Devtools:** Excellent for debugging queries and mutations.
  - **Suspense & Error Boundary Integration:** Works seamlessly.
  - **Framework Agnostic Core:** React adapters provide Hooks like `useQuery`, `useSuspenseQuery`, `useMutation`.
  - **Complements RSCs & Server Actions:** Use TanStack Query in Client Components to fetch data or call Server Actions (via mutations) and manage the server state.

```typescript
// src/services/userService.ts (example API function)
export interface User {
  id: string;
  name: string;
  email: string;
}

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
('use client');
import React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { updateUserProfile, User } from '@/services/userService'; // Assuming path alias for services
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

  const handleSubmit = (formData: Partial<User>) => {
    // formData from TanStack Form
    mutation.mutate(formData);
  };

  // ... form rendering using TanStack Form ...
  // On form submit, call handleSubmit(formData)
  return (
    <form
      onSubmit={(e) => {
        /* e.preventDefault(); handle actual form submission from TanStack Form */
      }}
    >
      {/* Form fields for name, email etc. */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
      >
        {mutation.isPending ? 'Saving...' : 'Save Changes'}
      </button>
      {mutation.isError && (
        <p className="mt-2 text-sm text-red-600">Error: {mutation.error.message}</p>
      )}
    </form>
  );
};
export default EditUserProfileForm;
```

---

## 5. Forms (TanStack Form)

- **Adopt TanStack Form for building and managing forms.**
- **Advantages:**
  - **Headless:** Gives full control over markup and styling (apply Tailwind classes directly to your inputs, labels, etc.).
  - **Type-Safe:** Excellent TypeScript support for form values, validation, and submission.
  - **Performant:** Optimized for minimal re-renders.
  - **Framework Agnostic Core:** Built for many frameworks, with great React integration.
  - **Validation:** Integrates with validation libraries like Zod, Yup, Valibot or supports custom validation.

```typescript
// src/components/MyForm.client.tsx
'use client';
import React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter'; // Example with Zod
import { z } from 'zod';
// For conditional classes: import clsx from 'clsx'; // Useful for complex conditional styling

const MyForm = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      subscribeToNewsletter: false,
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-6 p-4 bg-gray-50 rounded-lg shadow"
      >
        <form.Field
          name="email"
          validators={{
            onChange: z.string().min(1, 'Email is required').email('Invalid email address'),
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="email"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  field.state.meta.touchedErrors.length
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="you@example.com"
              />
              {field.state.meta.touchedErrors.length > 0 && (
                <em role="alert" className="mt-2 text-sm text-red-600">
                  {field.state.meta.touchedErrors.join(', ')}
                </em>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: z.string().min(8, 'Password must be at least 8 characters'),
          }}
        >
          {(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                Password:
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="password"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                  field.state.meta.touchedErrors.length
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
              {field.state.meta.touchedErrors.length > 0 && (
                <em role="alert" className="mt-2 text-sm text-red-600">
                  {field.state.meta.touchedErrors.join(', ')}
                </em>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="subscribeToNewsletter"
          // No specific validator needed for a boolean usually, unless it's required to be true for example
        >
          {(field) => (
            <div className="flex items-center">
              <input
                id={field.name}
                name={field.name}
                type="checkbox"
                checked={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor={field.name} className="ml-2 block text-sm text-gray-900">
                Subscribe to newsletter
              </label>
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </form.Subscribe>
      </form>
    </form.Provider>
  );
};
export default MyForm;
```

---

## 6. Data Display - Tables & Lists (TanStack Table)

- **Use TanStack Table for any complex table or data grid requirements.** Its headless architecture allows full control over markup and styling, making it perfect for use with Tailwind CSS.
- **Benefits:**

  - **Headless by Design:** You define the components and markup for `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`, etc., applying Tailwind classes as needed for complete visual control.
  - **Powerful Features:** Built-in support for sorting, filtering (column and global), pagination, grouping, column ordering, visibility, pinning, and more.
  - **Performant:** Optimized for large datasets. Provides hooks and utilities for virtualization (e.g., with `@tanstack/react-virtual`) if needed.
  - **Extensible Plugin System:** Customize or extend functionality.
  - **Excellent TypeScript Support:** Strongly typed for data, columns, and table state.

- **Key Concepts:**

  - **Column Definitions:** Define columns using `createColumnHelper` for type safety. Specify accessors, headers, cell renderers, and enable/disable features per column.
  - **Table Instance:** Created with `useReactTable`, taking your data, columns, and state management configurations.
  - **Core Model (`getCoreRowModel`):** The basic row model. Additional models for features like filtering (`getFilteredRowModel`), sorting (`getSortedRowModel`), pagination (`getPaginationRowModel`) need to be explicitly included.
  - **State Management:** TanStack Table can manage its own state (sorting, pagination, etc.) or you can control it externally using React state.

- **Example Structure:**

  ```typescript
  // src/components/MyDataTable/MyDataTable.client.tsx
  'use client';

  import React, { useState } from 'react';
  import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnFiltersState,
    SortingState,
  } from '@tanstack/react-table';

  // Define your data type
  type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
  };

  const defaultData: Person[] = [
    {
      firstName: 'Tanner',
      lastName: 'Linsley',
      age: 30,
      visits: 100,
      status: 'Active',
      progress: 75,
    },
    {
      firstName: 'Kevin',
      lastName: 'Vargas',
      age: 28,
      visits: 50,
      status: 'Inactive',
      progress: 25,
    },
    // ... more data
  ];

  const columnHelper = createColumnHelper<Person>();

  const columns = [
    columnHelper.accessor('firstName', {
      cell: (info) => info.getValue(),
      header: () => <span>First Name</span>,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      cell: (info) => <em>{info.getValue()}</em>,
      header: () => <span>Last Name</span>,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      cell: (info) => info.renderValue(),
    }),
    // Add more columns as needed
  ];

  const MyDataTable = () => {
    const [data] = useState(() => [...defaultData]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
      data,
      columns,
      state: {
        sorting,
        columnFilters,
        globalFilter,
      },
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      debugTable: true, // Useful for development
    });

    return (
      <div className="p-2">
        {/* Global Filter Example */}
        <div className="mb-4">
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(String(e.target.value))}
            className="p-2 border border-gray-300 rounded-md shadow-sm text-sm"
            placeholder="Search all columns..."
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Example */}
        <div className="py-3 flex items-center justify-between">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  export default MyDataTable;
  ```

---

## 7. Routing (TanStack Router)

- **Employ TanStack Router for client-side and type-safe routing.** It's built from the ground up with TypeScript and modern React features like Suspense and RSCs in mind.
- **Key Advantages:**

  - **Fully Type-Safe:** End-to-end type safety for route paths, path parameters, search parameters, route state, and navigation.
  - **Modern Features:** File-based routing or code-based configuration, nested routes, layouts, programmatic navigation, link components with type-safe params.
  - **Data Loading:** Built-in mechanisms for data loading tied to routes, often integrating seamlessly with TanStack Query. Supports loaders that run before a route renders.
  - **Search Parameter Schemas:** Define and validate search parameters using libraries like Zod.
  - **Pending UI & Error Components:** Declaratively handle loading and error states for routes.
  - **Performance:** Optimized for speed and minimal bundle size.
  - **RSC and Suspense Ready:** Designed to work well within React Server Components architecture and leverages Suspense for asynchronous operations.

- **Core Concepts:**

  - **Route Definitions:** Define routes (often in a `routeTree.gen.ts` file if using file-based routing, or manually). Specify paths, parent routes, loaders, components, error components, pending components, and search param validators.
  - **Router Instance:** Create a router instance with your route tree.
  - **`RouterProvider`:** Wrap your application with this provider.
  - **`Link` Component:** Type-safe navigation. IntelliSense for `to` prop and `params`/`search` props.
  - **Hooks:** `useNavigate`, `useParams`, `useSearch`, `useLoaderData` for accessing router state and data.

- **Example (Conceptual - Code-based Route Definition):**
  _API functions (`WorkspacePosts`, `WorkspacePostById`) are illustrative and would typically reside in dedicated API service files (e.g., `src/services/postService.ts`)._

  ```typescript
  // src/routes.tsx (or individual route files for file-based routing)
  import {
    Outlet,
    createRootRoute,
    createRoute,
    createRouter,
    Link,
    useParams,
    useSearch,
    useLoaderData,
  } from '@tanstack/react-router';
  import { z } from 'zod';
  // Assume QueryClientProvider is set up higher in the tree for TanStack Query

  // --- API Functions (example - typically in src/services/...) ---
  interface PostSummary {
    id: string;
    title: string;
  }
  interface PostFull extends PostSummary {
    content: string;
  }

  async function fetchPosts(): Promise<PostSummary[]> {
    // Placeholder: const response = await fetch('/api/posts'); return response.json();
    return [
      { id: '1', title: 'Post 1' },
      { id: '2', title: 'Post 2' },
    ];
  }
  async function fetchPostById(postId: string): Promise<PostFull> {
    // Placeholder: const response = await fetch(`/api/posts/${postId}`); return response.json();
    return {
      id: postId,
      title: `Post ${postId}`,
      content: `Content for post ${postId}. Lorem ipsum...`,
    };
  }

  // --- Root Route ---
  const rootRoute = createRootRoute({
    component: RootComponent,
  });

  function RootComponent() {
    return (
      <>
        <nav className="p-2 flex gap-2 bg-gray-100">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <Link to="/posts" className="[&.active]:font-bold">
            Posts
          </Link>
        </nav>
        <hr />
        <Outlet /> {/* Where child routes will render */}
      </>
    );
  }

  // --- Index Route ---
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomeComponent,
  });

  function HomeComponent() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    );
  }

  // --- Posts Route ---
  const postsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'posts',
    loader: () => fetchPosts(), // Data loader for this route
    component: PostsComponent,
  });

  function PostsComponent() {
    const posts = useLoaderData({ from: postsRoute.id }); // Type-safe access to loader data
    return (
      <div className="p-2">
        <h3 className="text-xl font-semibold">Posts</h3>
        <ul className="list-disc pl-5">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                to="/posts/$postId"
                params={{ postId: post.id }}
                className="text-blue-600 hover:underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
        <Outlet />
      </div>
    );
  }

  // --- Single Post Route (with path param and search param schema) ---
  const postIdRoute = createRoute({
    getParentRoute: () => postsRoute, // Nested under posts
    path: '$postId', // Path parameter
    parseParams: (params) => ({ postId: z.string().parse(params.postId) }), // Ensure postId is a string
    validateSearch: (
      search // Search param validation with Zod
    ) => z.object({ version: z.number().int().optional() }).parse(search),
    loader: async ({ params }) => fetchPostById(params.postId), // Access type-safe params
    component: PostIdComponent,
    errorComponent: ({ error }) => <div>Error loading post: {error.message}</div>,
    pendingComponent: () => <div className="p-4">Loading post...</div>,
  });

  function PostIdComponent() {
    const { postId } = useParams({ from: postIdRoute.id }); // Type-safe path param
    const { version } = useSearch({ from: postIdRoute.id }); // Type-safe search param
    const post = useLoaderData({ from: postIdRoute.id });

    return (
      <div className="p-4 mt-2 border rounded-md">
        <h4 className="text-lg font-bold">
          {post.title} (ID: {postId})
        </h4>
        {version && <p className="text-sm text-gray-500">Viewing version: {version}</p>}
        <p className="mt-2">{post.content}</p>
      </div>
    );
  }

  // --- Route Tree & Router ---
  const routeTree = rootRoute.addChildren([indexRoute, postsRoute.addChildren([postIdRoute])]);

  export const router = createRouter({ routeTree });

  // In your main app file (e.g., src/main.tsx):
  // import { RouterProvider } from '@tanstack/react-router';
  // import { router } from './routes';
  // ReactDOM.createRoot(document.getElementById('root')!).render(
  //   <RouterProvider router={router} />
  // );

  // Declare module augmentation for type safety
  declare module '@tanstack/react-router' {
    interface Register {
      router: typeof router;
    }
  }
  ```

---

## 8. Hooks (Custom React Hooks)

1.  **Rules of Hooks:** Adhere strictly. Only call Hooks at the top level of React function components or custom Hooks. Don't call them inside loops, conditions, or nested functions.

2.  **`useEffect`:**

    - **Use Sparingly:** With TanStack Query handling server state synchronization, and TanStack Router managing data loading for routes, many common use cases for `useEffect` (like manual data fetching) are significantly reduced.
    - **When Still Useful:**
      - Interacting with browser APIs directly (e.g., `localStorage`, `navigator`, timers, DOM event listeners not managed by React's synthetic events).
      - Triggering animations or focus management based on state changes.
      - Integrating with third-party non-React libraries or widgets that require imperative control.
    - **Dependency Array:** Always provide a correct and stable dependency array.
      - `[]`: Runs once after initial render and cleanup runs on unmount.
      - `[dep1, dep2]`: Runs after initial render and whenever any dependency changes.
      - **Caution:** Avoid including objects or arrays defined within the component body directly in the dependency array if they are recreated on every render. Memoize them with `useMemo` or `useCallback`, or use primitive dependencies if possible. An unstable dependency array leads to the effect running more often than intended.
    - **Cleanup Function:** Return a cleanup function if the effect sets up subscriptions, timers, or event listeners to prevent memory leaks and unexpected behavior.

3.  **`useCallback` & `useMemo`:**

    - **Purpose:** Performance optimization tools. `useCallback` memoizes functions, `useMemo` memoizes values.
    - **When to Use:**
      - When passing functions or objects as props to components wrapped with `React.memo`.
      - As dependencies in `useEffect`, `useMemo`, or `useCallback` itself to prevent unnecessary re-runs or re-calculations.
      - For computationally expensive calculations within a component that you don't want to re-run on every render.
    - **Profile First:** Don't overuse them. Premature optimization can add complexity. Use React DevTools Profiler to identify actual performance bottlenecks before applying these Hooks.
    - **Dependency Arrays:** Crucial for their correct behavior. Ensure dependencies are stable and correctly listed.

4.  **`useRef`:**

    - Accessing DOM elements directly (e.g., for focus management, triggering animations, measuring elements). Use sparingly; often there's a more declarative React way.
    - Storing mutable values that do not trigger a re-render when changed (e.g., timer IDs, previous state values for comparison, instance variables in functional components).

5.  **Custom Hooks (`useMyLogic`):**

    - **Purpose:** Extract reusable stateful logic from components into shareable functions. This is a powerful pattern for code organization and reuse in React.
    - **Naming:** Must start with `use` (e.g., `useFormInput`, `useWindowSize`, `useDebounce`).
    - **Single Responsibility:** A custom Hook should ideally manage a specific piece of related logic.
    - **Clear API:** Define clear inputs (arguments) and outputs (return values, often an object or array).
    - **Can Call Other Hooks:** Custom Hooks can internally use built-in Hooks (`useState`, `useEffect`, etc.) or other custom Hooks.
    - **Testing:** Test custom Hooks thoroughly, often using `@testing-library/react`'s `renderHook`.

    ```typescript
    // src/hooks/useDebounce.ts
    'use client'; // If it uses client-side timers

    import { useState, useEffect } from 'react';

    /**
     * @description Debounces a value.
     * @param value The value to debounce.
     * @param delay The debounce delay in milliseconds.
     * @returns The debounced value.
     */
    export function useDebounce<T>(value: T, delay: number): T {
      const [debouncedValue, setDebouncedValue] = useState<T>(value);

      useEffect(() => {
        // Set timeout to update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);

        // Cleanup function to clear timeout if value or delay changes, or on unmount
        return () => {
          clearTimeout(handler);
        };
      }, [value, delay]); // Only re-call effect if value or delay changes

      return debouncedValue;
    }

    // Example Usage in a component:
    // const searchTermFromInput = useFormInput(''); // Assume useFormInput is another custom hook
    // const debouncedSearchTerm = useDebounce(searchTermFromInput.value, 500);
    // useEffect(() => {
    //   if (debouncedSearchTerm) {
    //     // Perform search API call
    //   }
    // }, [debouncedSearchTerm]);
    ```

---

## 9. Styling (Tailwind CSS First - v4 Focused)

By May 2025, Tailwind CSS v4 is the established standard, bringing significant performance improvements with its new engine (Lightning CSS) and more powerful ways to customize and extend the framework directly within your CSS using the `@theme` directive.

1.  **Primary Recommendation: Tailwind CSS v4**

    - **Embrace Tailwind CSS v4 as the primary styling methodology.**
    - **Benefits (Enhanced with v4):**

      - **Utility-First:** Rapid UI development directly in your markup.
      - **Consistency:** Enforces a consistent design language through its predefined scale.
      - **Exceptional Performance:**
        - **Lightning Fast Builds:** The v4 engine written in Rust (Lightning CSS) offers dramatically faster build times.
        - **Optimized Production CSS:** Inherently optimized output, shipping only the CSS you use without explicit purge configurations.
      - **Responsive Design:** Intuitive responsive prefixes (`sm:`, `md:`, `lg:`).
      - **Enhanced Customization:** Highly customizable via `tailwind.config.js` and now directly within your CSS using the `@theme` directive for more powerful, co-located theme extensions.
      - **Native Modern CSS:** Better support for and leveraging of modern CSS features like cascade layers and CSS variables.
      - **No Context Switching:** Style and structure in the same place.
      - **Pairs Well with Headless Components:** TanStack libraries (Table, Form, etc.) are headless, giving you full control to apply Tailwind classes.

    - **Best Practices with Tailwind CSS v4:**

      - **Component Abstraction:** For repeated complex UI patterns or long lists of utility classes, encapsulate them into React components. Use `tailwind-merge` for robust class name composition.

        ```tsx
        // Example: Reusable Button Component (remains relevant)
        import React from 'react';
        import { twMerge } from 'tailwind-merge'; // Still crucial for component variants

        interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
          variant?: 'primary' | 'secondary';
        }
        const Button = ({ children, className, variant = 'primary', ...props }: ButtonProps) => {
          const baseClasses =
            'py-2 px-4 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75';
          const variantClasses =
            variant === 'primary'
              ? 'bg-blue-500 hover:bg-blue-700 text-white focus:ring-blue-400' // These could also leverage CSS vars defined via @theme
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400';

          return (
            <button className={twMerge(baseClasses, variantClasses, className)} {...props}>
              {children}
            </button>
          );
        };
        // Usage: <Button variant="primary" className="mt-4">Click Me</Button>
        ```

      - **`clsx` or `tailwind-merge`:** Use utility libraries like `clsx` for conditionally applying classes and `tailwind-merge` to intelligently merge Tailwind classes without style conflicts (especially useful with variants and component composition, as shown in the Button example).
      - **`@apply` Sparingly (and consider `@theme` for alternatives):** While `@apply` still exists, use it cautiously in your global CSS for very small, extremely common utility combinations if components aren't suitable. For more complex reusable styles or custom utilities, prefer defining them with the `@theme` directive in your CSS.
      - **Configuration (`tailwind.config.js` and CSS with `@theme`):**

        - Leverage `tailwind.config.js` for global theme configuration (colors, fonts, spacing), plugins, and variants.
        - Utilize the `@theme` directive directly in your CSS files (e.g., `global.css` or feature-specific CSS) to define custom utilities, extend the theme, or create component-like styles in a more CSS-native way. This allows for better co-location of styling logic if desired.

        ```css
        /* Example of @theme usage in your main CSS file */
        @theme {
          --color-brand-primary: theme('colors.blue.500'); /* Define CSS var from theme */

          .btn-custom-primary {
            @apply py-2 px-4 rounded-md text-white;
            background-color: var(--color-brand-primary); /* Use the CSS var */
          }
          /* Define custom utility using theme values */
          .text-body-large {
            font-size: theme('fontSize.lg');
            line-height: theme('lineHeight.snug');
          }
        }
        ```

      - **Readability:** For very long class strings, consider formatting them across multiple lines in your editor or, preferably, abstracting the element into a well-named component or a custom utility/class via `@theme`.

2.  **Alternative Strategies (for specific or legacy contexts):**

    - **CSS Modules (`.module.css`):** Can still be useful for highly isolated, complex component-specific styles that are difficult to achieve with utilities alone (e.g., intricate animations, dynamic styles based on many props not easily covered by conditional classes), or when integrating with existing non-Tailwind parts of an application.
    - **Styled-components / Emotion (CSS-in-JS):** Consider if deep dynamic theming heavily tied to JavaScript state is a paramount requirement and CSS variables with Tailwind (now even more robust with `@theme`) are insufficient. Generally, prefer Tailwind's approach for its performance, ecosystem benefits, and the power of v4.

3.  **Theming (Leveraging CSS Variables and `@theme`):**

    - **CSS Custom Properties (Variables) are Central:** Define your theme palette and scales using CSS Custom Properties in your global CSS (e.g., `src/app/global.css`), often within `:root` or theme-specific classes (e.g., `.theme-dark`).
    - **`tailwind.config.js` for Consumption:** Reference these CSS variables within your `tailwind.config.js` to make them available as Tailwind utilities.
      ```javascript
      // tailwind.config.js
      module.exports = {
        theme: {
          extend: {
            colors: {
              primary: 'var(--color-primary)', // Consumes CSS variable
              secondary: 'var(--color-secondary)',
              // ... other semantic colors
            },
            backgroundColor: {
              // Ensure background colors also use these
              primary: 'var(--color-primary)',
              secondary: 'var(--color-secondary)',
            },
            textColor: {
              // And text colors
              primary: 'var(--color-text-on-primary)', // Example for text on primary background
              muted: 'var(--color-text-muted)',
            },
          },
        },
        // ... other config
      };
      ```
    - **`@theme` for Dynamic Styles and Utilities:** Use the `@theme` directive in your CSS to consume theme values or define theme-aware utilities and component styles. This is powerful for creating styles that adapt to your defined theme.

      ```css
      /* In your global.css or relevant CSS file */
      :root {
        --color-primary: #007bff; /* Blue */
        --color-secondary: #6c757d; /* Gray */
        --color-text-on-primary: #ffffff;
        --color-text-muted: #6c757d;
        /* ... other theme variables */
      }

      .theme-dark {
        --color-primary: #1a73e8; /* Darker Blue */
        --color-secondary: #5f6368; /* Darker Gray */
        --color-text-on-primary: #e8eaed;
        --color-text-muted: #9aa0a6;
      }

      @theme {
        .custom-card {
          background-color: theme(
            'colors.white'
          ); /* Will use white from default or your extended theme */
          border: 1px solid theme('colors.gray.300');
          padding: theme('spacing.4');
          /* In dark theme, you might have specific overrides if not handled by variable swaps */
        }

        .text-link {
          color: theme('colors.primary'); /* Uses the 'primary' color from your theme */
          @apply hover:underline;
        }
      }
      ```

    - This combined approach allows for dynamic theme switching (by changing CSS variables via JavaScript or class toggles) while still leveraging Tailwind's utility classes and the new `@theme` capabilities for CSS-first customizations.

---

## 10. Performance Optimization (General React)

1.  **`React.memo` (For Client Components):**

    - A higher-order component that memoizes a component. If its props are the same (shallow comparison), React skips rendering the component and reuses the last rendered result.
    - Use for components that:
      - Render often with the same props.
      - Are computationally expensive to render.
    - Often requires `useCallback` for function props and `useMemo` for object/array props passed to the memoized component to ensure stable references.
    - **Profile first:** Use React DevTools Profiler to identify components that would benefit. Premature memoization can sometimes add overhead or mask underlying issues.

2.  **Code Splitting (`React.lazy` and `Suspense`):**

    - Split your client-side JavaScript bundle into smaller chunks that are loaded on demand, improving initial page load time.
    - Use `React.lazy` for route-based code splitting (often handled by frameworks like Next.js or TanStack Router) or for large components not immediately visible.
    - Wrap lazy-loaded components with `<Suspense fallback={<LoadingSpinner />}>` to show a loading indicator.
    - Consider how RSCs inherently reduce client bundle sizes by rendering on the server.

3.  **Windowing/Virtualization for Large Lists & Grids:**

    - For rendering very long lists or large grids on the client, only render the items currently visible in the viewport.
    - Use libraries like `@tanstack/react-virtual` (also known as React Virtual) or `react-window`.
    - TanStack Table also provides hooks and utilities to facilitate virtualization.

4.  **Minimize Re-renders:**

    - **Identify Bottlenecks:** Use the React DevTools Profiler to see which components are re-rendering unnecessarily and why.
    - **Stable Prop References:** Ensure objects and functions passed as props maintain stable references between renders if they haven't actually changed. Use `useMemo` for objects/arrays and `useCallback` for functions.
    - **Correct `useEffect` Dependencies:** Unstable or incorrect dependency arrays can cause excessive effect re-runs and subsequent re-renders.
    - **Appropriate State Structure:** Avoid deeply nested state objects that cause widespread re-renders when a small part changes. Consider splitting state or using state management libraries that optimize subscriptions (like TanStack Store).
    - **Avoid Anonymous Functions in Props:** `onClick={() => doSomething()}` creates a new function on every render. If passed to a memoized component, it will break memoization. Use `useCallback` or define handlers outside the JSX.

5.  **Debouncing and Throttling (Client Events):**

    - For frequent events like window resize, scroll, or user input in search fields, use debouncing (executes after a pause in events) or throttling (executes at most once per specified interval) to limit the rate of handler execution.
    - Implement using a custom hook (like `useDebounce` shown earlier) or utility libraries like Lodash.

6.  **Bundle Analysis:**

    - Regularly analyze your client-side bundle size using tools like `webpack-bundle-analyzer` (if using Webpack), `next/bundle-analyzer` (for Next.js), or similar tools for Vite/Parcel.
    - Identify large dependencies or duplicated modules to optimize.

7.  **Image Optimization:**

    - Serve images in modern formats (e.g., WebP, AVIF).
    - Use responsive images (`<picture>` element or `srcset` attribute).
    - Lazy-load offscreen images.
    - Frameworks like Next.js provide an `Image` component that handles many of these optimizations automatically.

8.  **Leverage React Server Components (RSCs):**
    - As detailed in Section 16, RSCs significantly contribute to performance by moving rendering work and data fetching to the server, thus reducing the amount of JavaScript shipped to the client.

---

## 11. Error Handling

1.  **TanStack Query Error Handling:**

    - `useQuery` and `useSuspenseQuery` return an `error` object. Check this state to display error messages to the user.
    - `useMutation` provides `onError` callbacks and an `error` state.
    - Configure global error handlers in `QueryClient` for centralized error logging or default UI feedback.
    - Use the `retry` option in queries carefully to avoid overwhelming failing APIs.

2.  **TanStack Form Validation & Submission Errors:**

    - Validation errors (from Zod, Yup, etc., via adapters) are available on field state (`field.state.meta.errors`). Display these inline.
    - Submission errors (e.g., API errors when `onSubmit` calls a mutation) should be handled within the `onSubmit` function (e.g., by setting a form-level error message in local state or displaying feedback from a TanStack Query mutation's `onError`).

3.  **Error Boundaries (Client Components):**

    - **Purpose:** Catch JavaScript errors anywhere in their child component tree during rendering, log those errors, and display a fallback UI.
    - **Implementation:** Create a class component with `static getDerivedStateFromError()` and `componentDidCatch()`.
    - **Placement:** Strategically place Error Boundaries:
      - Around individual routes or route groups (often handled by frameworks like Next.js or TanStack Router's `errorComponent` feature).
      - Around major UI sections or widgets that are non-critical (so a part of the app can fail gracefully without crashing the whole page).
      - Avoid overly granular Error Boundaries as they can add complexity.
    - **Limitations:** Do not catch errors in event handlers, asynchronous code (like `setTimeout` or promise chains outside render, unless using Suspense-enabled data fetching), server-side rendering (framework specific handling), or errors in the Error Boundary itself.

4.  **Try/Catch in Event Handlers and Asynchronous Code:**

    - For logic within event handlers, `useEffect` (if not handled by Suspense), or any imperative asynchronous operations not managed by TanStack Query, use `try...catch` blocks to handle errors gracefully.
    - Update component state to reflect error states and provide user feedback (e.g., toast notifications, inline messages).

5.  **Suspense for Data Fetching & Code Splitting:**

    - When used with `React.lazy` or Suspense-enabled data fetching libraries (like TanStack Query's `useSuspenseQuery`), `<Suspense>` can catch errors during the loading of code-split components or data.
    - Pair Suspense boundaries with Error Boundaries to handle both loading states and potential errors during async rendering.

6.  **Error Logging & Monitoring:**

    - Integrate an error monitoring service (e.g., Sentry, LogRocket, Datadog) to capture, track, and analyze errors occurring in production.
    - Log relevant context (user ID, component name, state) with errors to aid debugging.
    - Use `componentDidCatch` in Error Boundaries and global error handlers (e.g., `window.onerror`) to report errors.

7.  **User Feedback for Errors:**

    - Always provide clear, user-friendly feedback when errors occur. Avoid showing raw error messages or stack traces directly to users.
    - Use toast notifications, inline messages, or dedicated error sections.
    - Provide guidance on how the user might resolve the issue or whom to contact.

8.  **Graceful Degradation:**
    - For non-critical features, design them to fail gracefully. If a widget can't load its data, it shouldn't break the entire page. Error Boundaries can help achieve this.

---

## 12. Testing

1.  **Test Runner & Frameworks:**

    - **Vitest or Jest:** Choose one as your primary test runner. Vitest is often preferred for its speed and modern ESM support, especially in Vite-based projects.
    - **React Testing Library (RTL):** For testing React components. Focus on testing component behavior from a user's perspective, interacting with components as a user would (finding elements by accessible roles, text, labels, etc.). Avoid testing implementation details.

2.  **Types of Tests:**

    - **Unit Tests:**
      - Test individual, isolated functions, simple custom Hooks (without heavy DOM interaction), or utility logic.
      - Typically don't involve rendering components.
    - **Integration Tests (Component Tests):**
      - The majority of your tests. Test components interacting with each other, including state changes, context, and props.
      - Use RTL to render components and assert their output and behavior.
    - **End-to-End (E2E) Tests (Brief Mention):**
      - For critical user flows across multiple pages (e.g., authentication, checkout process).
      - Use tools like **Playwright** or **Cypress**. These are heavier and slower, so reserve them for the most important scenarios.

3.  **Mocking Strategies:**

    - **API Calls:** Use **Mock Service Worker (MSW)** to intercept network requests and return mock responses. This allows testing data fetching, loading, and error states realistically.
    - **Modules/Functions:** Use Jest's (`jest.mock`, `jest.spyOn`) or Vitest's (`vi.mock`, `vi.spyOn`) mocking capabilities for third-party libraries or internal modules that are difficult to control in a test environment.
    - **Timers:** Use `vi.useFakeTimers()` (Vitest) or `jest.useFakeTimers()` (Jest) for testing logic involving `setTimeout`, `setInterval`, or debouncing/throttling.

4.  **Testing Specific TanStack Libraries:**

    - **TanStack Query:**
      - Wrap tests needing query functionality with `QueryClientProvider` and a fresh `QueryClient` instance for each test.
      - Test custom hooks that use `useQuery` or `useMutation`.
      - Assert loading states, success states (data rendering), and error states. Mock API responses using MSW.
    - **TanStack Form:**
      - Use RTL to fill out form fields, trigger validations, and simulate submissions.
      - Assert validation messages appear/disappear correctly.
      - Mock submission handlers (e.g., mutations) to verify they are called with correct data.
    - **TanStack Table:**
      - Test interactions if you build UI controls for sorting, filtering, pagination.
      - Verify that the table renders the correct data and responds to these interactions.
    - **TanStack Router:**
      - Test navigation logic, that correct components are rendered for routes, and data loaders function as expected.
      - Often involves setting up a mock router or testing within the context of a router instance. Framework-specific testing utilities may help.

5.  **Testing Custom Hooks:**

    - Use RTL's `renderHook` utility to test custom Hooks in isolation.
    - Assert their return values and any side effects they perform.
    - Use `act` when testing Hooks that cause state updates.

6.  **Accessibility (a11y) Testing:**

    - Use `jest-axe` (with Jest) or `axe-core` directly (can be integrated with Vitest/RTL) to automatically check for accessibility violations in your rendered component output.
    - Integrate into your component tests to catch issues early.

7.  **Test Coverage:**

    - Aim for good test coverage, but focus on quality over quantity. Prioritize testing critical paths, complex logic, and user-facing behavior.
    - Use coverage reports as a guide, not an absolute target. 100% coverage doesn't guarantee bug-free code.

8.  **Test Organization:**
    - Co-locate test files with the modules they are testing (e.g., `MyComponent.test.tsx` next to `MyComponent.tsx`).

---

## 13. Commenting Guidelines

1.  **Why, Not What:**

    - Good code, especially with TypeScript's type annotations, is often self-documenting in _what_ it does.
    - Comments should primarily explain _why_ a particular approach was taken, clarify complex algorithms, non-obvious logic, or important business rules.
    - Avoid comments that merely restate the code, as they add noise and can become outdated.

      ```typescript
      // Bad:
      // Check if user is active
      if (user.isActive) {
        /* ... */
      }

      // Good (if the reason for the check is non-obvious):
      // Only process orders for active users to prevent issues with legacy accounts.
      if (user.isActive) {
        /* ... */
      }
      ```

2.  **JSDoc for Public APIs (Components, Hooks, Functions):**

    - Use JSDoc-style comments (`/** ... */`) for all exported components, custom Hooks, and significant utility functions. This is especially important for libraries or shared code.
    - TypeScript types define the _shape_ and _type_ ("what"), so JSDoc should focus on:
      - **`@description`**: A concise explanation of the entity's purpose.
      - **`@param`**: Description, type (if not obvious from TS), and purpose of each parameter. Note default values using `[paramName=defaultValue]` syntax.
      - **`@returns`**: Description of the return value.
      - **`@example`**: Optional usage examples.
      - **`@throws`**: If a function can throw specific errors.
    - This aids IntelliSense in editors and can be used by documentation generation tools (e.g., TypeDoc).

    ```typescript
    /**
     * @description A custom hook to manage a counter with increment, decrement, and reset functionality.
     * @param {number} [initialValue=0] The initial value for the counter.
     * @returns An object containing the current count and functions to manipulate it.
     * @example
     * const { count, increment, decrement, reset } = useCounter(10);
     */
    export function useCounter(initialValue: number = 0) {
      const [count, setCount] = useState(initialValue);
      const increment = useCallback(() => setCount((c) => c + 1), []);
      const decrement = useCallback(() => setCount((c) => c - 1), []);
      const reset = useCallback(() => setCount(initialValue), [initialValue]);
      return { count, increment, decrement, reset };
    }
    ```

3.  **Comment Complex or Non-Obvious Logic:**

    - If a piece of code involves intricate algorithms, workarounds for specific issues, or has non-obvious side effects, add comments to explain the reasoning and approach.
    - Break down complex sections with comments before or within the logic block.

4.  **Standard Markers (`// TODO:`, `// FIXME:`, `// HACK:`):**

    - Use these to highlight areas requiring future attention:
      - `// TODO:`: Functionality that is planned but not yet implemented.
      - `// FIXME:`: A known bug or issue that needs to be addressed.
      - `// HACK:`: A workaround that is less than ideal but necessary for now.
    - Optionally include your name/initials, date, and a ticket/issue number for context:
      `// FIXME: (dev_name 2025-05-10 #JIRA-451) Temporary fix for rendering issue on Safari.`

5.  **Keep Comments Up-to-Date (Crucial):**

    - An incorrect or outdated comment is worse than no comment at all, as it can mislead developers.
    - When you modify code, always review and update any associated comments to reflect the changes. If a comment is no longer relevant, remove it.

6.  **File Header Comments (Optional but Recommended for Key Modules):**

    - For significant modules, custom Hooks, or complex utility files, a brief comment at the top of the file explaining its overall purpose and responsibility can be very helpful for context.

7.  **Avoid Over-Commenting:**
    - Don't comment obvious code. Trust that your team members understand the language and common patterns.
    - Focus comments on the parts of the code that are not immediately clear from reading the code itself.

---

## 14. Code Formatting & Linting (Biome)

- **Utilize Biome for all code formatting, linting, and organization needs.** Biome is an extremely fast all-in-one tool written in Rust, designed to replace Prettier, ESLint, and other related tools.
- **Benefits of Biome:**

  - **All-in-One Tool:** Handles formatting, linting (correctness, style, complexity, accessibility), import sorting, and more with a single binary and configuration.
  - **Performance:** Significantly faster than JavaScript-based toolchains.
  - **Sensible Defaults:** Provides good defaults that work well out-of-the-box, minimizing configuration overhead.
  - **Comprehensive:** Offers a wide range of lint rules.
  - **Easy Setup:** Typically requires just adding Biome and a `biome.jsonc` configuration file.

- **Configuration (`biome.jsonc`):**

  - Create a `biome.jsonc` (or `biome.json`) file in your project root to customize Biome's behavior.
  - Biome has built-in support for sorting Tailwind CSS classes. This is often enabled by default or follows Prettier's Tailwind plugin conventions.
  - _Ensure the `$schema` URL points to the latest version available from Biome's documentation at the time of setup._

  ```jsonc
  // biome.jsonc
  {
    "$schema": "[https://biomejs.dev/schemas/1.8.0/schema.json](https://biomejs.dev/schemas/1.8.0/schema.json)", // Check Biome docs for the latest schema version
    "organizeImports": {
      "enabled": true // Enables import sorting
    },
    "linter": {
      "enabled": true,
      "rules": {
        "recommended": true, // Enables a curated set of recommended lint rules
        // Example: Customize specific rules
        "suspicious": {
          "noExplicitAny": "warn", // Downgrade 'noExplicitAny' from error to warning
          "noConsoleLog": "off" // Allow console.log (consider "warn" for production builds)
        },
        "style": {
          "noNonNullAssertion": "error" // Disallow non-null assertions
        },
        "a11y": {
          // Accessibility rules
          "useKeyWithClickEvents": "error"
        }
        // Add more rule customizations as needed (e.g., for React, TypeScript)
      }
    },
    "formatter": {
      "enabled": true,
      "formatWithErrors": false, // Recommended to not format if there are syntax errors
      "indentStyle": "space", // "tab" or "space"
      "indentWidth": 2,
      "lineWidth": 100, // Max line width
      "lineEnding": "lf" // "lf", "crlf", "cr"
      // Biome automatically handles Tailwind CSS class sorting if configured (or by default).
    },
    "javascript": {
      // JavaScript/TypeScript specific formatter settings
      "formatter": {
        "quoteStyle": "single", // "double" or "single"
        "jsxQuoteStyle": "double", // For JSX attributes
        "quoteProperties": "asNeeded", // "asNeeded" or "preserve"
        "trailingCommas": "all", // "all", "es5", "none"
        "semicolons": "always", // "always" or "asNeeded"
        "arrowParentheses": "always", // "always" or "asNeeded"
        "bracketSpacing": true,
        "bracketSameLine": false
      }
    },
    "files": {
      // Configure which files Biome should process or ignore
      "ignore": [
        "node_modules",
        "dist",
        "build",
        "*.generated.ts"
        // Add other patterns to ignore
      ]
    }
  }
  ```

- **Integration:**

  - **Editor Integration:** Install the Biome extension for your editor (e.g., VS Code, IntelliJ IDEA). Configure it to format on save and display lint diagnostics.
  - **`package.json` Scripts:** Add scripts for running Biome commands:
    ```json
    // package.json
    "scripts": {
      "lint": "biome lint ./src",
      "lint:fix": "biome lint --apply ./src",
      "format": "biome format --write ./src",
      "check": "biome check --apply ./src" // Runs format, lint, and import sort then applies fixes
    },
    ```
  - **Pre-commit Hooks:** Use tools like `lint-staged` and `husky` to run Biome (e.g., `biome check --apply --staged`) on staged files before committing, ensuring code quality and consistency.

- **Enforce in CI/CD:**
  - Run `biome check` (or `biome lint && biome format --check`) in your Continuous Integration pipeline to fail builds if code doesn't adhere to formatting or linting rules.

---

## 15. File and Folder Structure

1.  **Organize by Feature or Domain (Recommended for Scalability):**

    - Instead of grouping files by type (e.g., all components in one `components` folder, all hooks in `hooks`), group files related to a specific feature or domain together. This improves modularity, makes it easier to locate related code, and scales better for larger applications.
    - **Example Feature-Based Structure:**
      ```
      src/
      ├── app/                  # Next.js App Router: Routes, layouts, pages (often feature-driven)
      │   ├── (auth)/           # Route group for authentication
      │   │   ├── login/
      │   │   │   └── page.tsx
      │   │   └── layout.tsx
      │   ├── products/
      │   │   ├── [productId]/
      │   │   │   └── page.tsx  # Product detail page (Server Component)
      │   │   ├── ProductList.client.tsx # Client component for product list interaction
      │   │   └── layout.tsx
      │   └── layout.tsx        # Root layout
      │   └── global.css        # Global styles, Tailwind base/components/utilities
      ├── components/           # Shared, reusable UI components (dumb components)
      │   ├── Button/
      │   │   ├── Button.tsx
      │   │   └── index.ts
      │   ├── Modal/
      │   ├── ...
      ├── features/             # Explicit feature folders (alternative or complementary to app/ routing)
      │   ├── authentication/
      │   │   ├── components/   # Components specific to auth feature
      │   │   │   └── LoginForm.client.tsx
      │   │   ├── hooks/        # Hooks specific to auth
      │   │   │   └── useAuth.ts
      │   │   ├── services/     # API service calls for auth (e.g., loginUser.ts)
      │   │   ├── types/        # Types specific to auth
      │   │   │   └── index.ts
      │   │   └── index.ts      # Barrel file for the auth feature
      │   ├── user-profile/
      │   │   └── ...
      ├── hooks/                # Globally shared custom Hooks (e.g., useDebounce.ts)
      ├── lib/                  # Utility functions, API client configurations, constants
      │   ├── apiClient.ts
      │   ├── utils.ts
      │   └── constants.ts
      ├── services/             # Shared API service definitions (e.g., userService.ts, postService.ts)
      │   ├── userService.ts
      │   └── postService.ts
      ├── stores/               # Global state stores (e.g., TanStack Store modules)
      │   ├── uiStore.ts
      │   └── cartStore.ts
      ├── types/                # Globally shared TypeScript types/interfaces
      │   └── common.d.ts
      └── tailwind.config.js    # Tailwind CSS configuration
      └── biome.jsonc           # Biome configuration
      └── ...                   # Other config files (tsconfig.json, package.json)
      ```

2.  **Co-locate Component-Specific Files:**

    - For complex components, keep their related files (styles if not using Tailwind exclusively, tests, stories for Storybook) in the same directory.
    - Example:
      ```
      src/components/ComplexWidget/
      ├── ComplexWidget.tsx
      ├── ComplexWidget.test.tsx
      ├── ComplexWidget.stories.tsx
      └── index.ts
      ```

3.  **Use `index.ts` (Barrel Files) for Exports:**

    - Use an `index.ts` file within feature or component directories to re-export their public interface. This simplifies import paths in other parts of the application.
    - Example (`src/features/authentication/index.ts`):
      ```typescript
      export * from './components/LoginForm.client';
      export * from './hooks/useAuth';
      export * from './services/loginUser'; // Assuming loginUser.ts is in ./services/
      export * from './types';
      ```
    - Usage: `import { LoginForm, useAuth } from '@/features/authentication';` (assuming path aliases are configured).
    - **Caution:** Avoid overly large barrel files that re-export everything, as this can sometimes negatively impact tree-shaking or IDE performance. Be selective about what is public.

4.  **Path Aliases:**
    - Configure path aliases (e.g., `@/*` pointing to `src/*`) in your `tsconfig.json` (and bundler config like Webpack/Vite) for cleaner and more maintainable import paths, avoiding deep relative imports like `../../../../components/Button`.

---

## 16. Evolving Patterns: React Server Components (RSCs)

React Server Components (RSCs) represent a paradigm shift, allowing components to run on the server (or at build time), significantly reducing client-side JavaScript and enabling direct server-side data access. By May 2025, their adoption via frameworks like Next.js (App Router) and Remix is mainstream for new projects.

1.  **Understand the Core Distinction:**

    - **Server Components (Default in frameworks like Next.js App Router):**
      - Run on the server. Cannot use Hooks (`useState`, `useEffect`, etc.) or browser-only APIs (e.g., `window`).
      - Can be `async/await` to directly fetch data or access server-side resources (databases, file system).
      - Their code is **never** shipped to the client, reducing bundle size.
      - Ideal for static content, data fetching, and sections not requiring interactivity. Render to a virtual DOM representation that can be streamed to the client.
    - **Client Components (Opt-in with `"use client";` directive):**
      - Render initially on the server (SSR/SSG by frameworks) and then "hydrate" and run on the client, enabling interactivity.
      - Can use Hooks (`useState`, `useEffect`), browser APIs, and manage client-side state.
      - Their code **is** shipped to the client.

2.  **`"use client";` Directive:**

    - Place this directive at the **top** of a file. It marks the module and all its imported dependencies (that are not Server Components themselves) as part of the client bundle.
    - This is the boundary between Server and Client environments. Use it judiciously at the "leaves" of your component tree where interactivity is needed.

3.  **Server Actions:**

    - Functions defined with the `"use server";` directive (can be at the top of a file for all exports, or inline for a specific function).
    - Allow Client Components to securely call server-side code (e.g., for form submissions, data mutations) without manually creating API endpoints.
    - Can be called directly from forms (`<form action={myServerAction}>`) for progressive enhancement or invoked from JavaScript (e.g., using TanStack Query's `useMutation`).
    - **Security:** Always validate input and handle permissions within Server Actions, as they are exposed to the client.

4.  **Data Fetching with RSCs:**

    - **Server Components:** Fetch data directly within their `async` component functions. This data is then passed as props to Client Components if needed.

      ```typescript
      // app/posts/[id]/page.tsx (Server Component)

      // Illustrative: Actual data fetching logic would use your DB client or ORM
      interface Post {
        id: string;
        title: string;
        content: string /* ...other fields */;
      }

      async function getPost(id: string): Promise<Post | null> {
        // const post = await db.post.findUnique({ where: { id } }); return post;
        // Placeholder for demonstration:
        if (id === '1')
          return { id: '1', title: 'Understanding RSCs', content: 'RSCs run on the server...' };
        if (id === '2')
          return {
            id: '2',
            title: 'Client Components',
            content: 'Client Components enable interactivity...',
          };
        return null;
      }

      // Assume PostDisplay is a Client or Server Component that takes post data
      // import PostDisplay from '@/components/PostDisplay'; // You'd create this component
      const PostDisplay = ({ post }: { post: Post }) => (
        <div>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </div>
      );
      // import { notFound } from 'next/navigation'; // If using Next.js

      export default async function PostPage({ params }: { params: { id: string } }) {
        const post = await getPost(params.id);
        if (!post) {
          // notFound(); // Example for Next.js to show a 404 page
          return <div>Post not found</div>; // Fallback if not using a framework's notFound
        }
        return <PostDisplay post={post} />; // Pass data to Client or Server Component
      }
      ```

    - **Client Components:** Typically receive initial data as props from parent Server Components. For subsequent client-side fetches or mutations, use TanStack Query, which can call Server Actions or traditional API routes.

5.  **State Management with RSCs:**

    - **Server State:** Managed on the server (e.g., in databases). RSCs re-fetch or re-render when server state changes (often triggered by cache invalidation or Server Actions).
    - **Client State:** Managed within Client Components using `useState`, `useReducer`, TanStack Store, etc. This state is lost if the browser is refreshed without persistence mechanisms.
    - Avoid trying to "lift state up" from a Client Component to a Server Component. Instead, use Server Actions to modify server state and trigger RSC re-renders.

6.  **Interleaving Components:**

    - Server Components can import and render Client Components.
    - Client Components **cannot directly import and render Server Components**. They can, however, receive Server Components as props (e.g., `children`). This allows Server Components to "fill slots" within Client Component layouts.

7.  **Streaming with Suspense:**

    - RSCs and frameworks like Next.js leverage React Suspense to stream UI updates. This allows users to see parts of the page (e.g., static shell, already loaded data) while other parts (slower data fetches in Server Components) are still loading.
    - Wrap slower Server Components or data fetching operations in `<Suspense fallback={<MySpinner />}>` within a parent Server Component. (MySpinner would be a simple loading component).

8.  **Mental Model Shift:**
    - Think about where your code _runs_ (server vs. client).
    - Minimize what goes into Client Components to reduce bundle size and improve performance. Keep Client Components as "islands of interactivity" within a sea of Server Components.
    - Leverage Server Actions for mutations to simplify backend interactions.

---

## 17. Additional Considerations

While the above sections cover core guidelines, a few additional areas are worth noting for production applications:

1.  **Environment Variables:**

    - Securely manage environment-specific configurations (API keys, database URLs, feature flags).
    - Utilize `.env` files (e.g., `.env.local`, `.env.production`) following framework conventions (like Next.js).
    - Be mindful of how variables are exposed:
      - **Server-side only:** Variables used in Server Components or Server Actions are generally not exposed to the client.
      - **Client-side:** Variables needed by Client Components must be explicitly prefixed (e.g., `NEXT_PUBLIC_` in Next.js) to be bundled. Avoid embedding sensitive information in client-side variables.

2.  **Internationalization (i18n):**

    - For applications requiring multiple language support, integrate a reputable i18n library (e.g., `next-intl`, `i18next`, `react-i18next`).
    - Structure translation files logically (e.g., per feature or globally).
    - Ensure your i18n solution works effectively with both Server Components (for initial render) and Client Components (for dynamic updates or client-side-only text).

3.  **Component Driven Development (CDD) & Storybook:**
    - Consider using Storybook for developing UI components in isolation. This promotes reusability, visual testing, and documentation.
    - Co-locate stories with their components (e.g., `MyComponent.stories.tsx`) as mentioned in Section 15.
    - Write stories to cover different states and props variations of your components. This helps in testing edge cases and provides a living style guide.

---

By adhering to these guidelines, your team can build robust, maintainable, and modern React applications leveraging Tailwind CSS for styling, the power of the TanStack ecosystem, and Biome for an efficient developer workflow. Remember that guidelines are living documents and should be revisited and updated as the ecosystem and project evolve.

---

## 18. Commit Message Guidelines (Conventional Commits)

To ensure consistent and meaningful commit messages, which aids in changelog generation and project history navigation, we will adhere to the Conventional Commits specification.

1.  **Format:**
    The commit message should be structured as follows:

    ```
    <type>[optional scope]: <description>

    [optional body]

    [optional footer(s)]
    ```

2.  **Type:**
    Must be one of the following:

    - **feat**: A new feature for the user.
    - **fix**: A bug fix for the user.
    - **docs**: Documentation only changes.
    - **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc). Should be used sparingly if Biome handles most formatting.
    - **refactor**: A code change that neither fixes a bug nor adds a feature.
    - **perf**: A code change that improves performance.
    - **test**: Adding missing tests or correcting existing tests.
    - **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
    - **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs).
    - **chore**: Other changes that don't modify `src` or `test` files (e.g., updating build tasks, package manager configs).
    - **revert**: Reverts a previous commit.

3.  **Scope (Optional):**

    - The scope provides contextual information and is contained within parentheses, e.g., `feat(parser): add ability to parse arrays`.
    - It can be a specific feature name, component name, or module affected by the change. (e.g., `user-profile`, `button`, `api-client`).

4.  **Description:**

    - A short summary of the code changes.
    - Use the imperative, present tense: "change" not "changed" nor "changes".
    - Don't capitalize the first letter.
    - No dot (.) at the end.

5.  **Body (Optional):**

    - Use the imperative, present tense.
    - Should include the motivation for the change and contrast this with previous behavior.
    - Longer, more detailed explanation of the changes.

6.  **Footer(s) (Optional):**

    - **Breaking Changes:** All breaking changes MUST be indicated at the very beginning of the footer section. A breaking change MUST consist of the uppercase text `BREAKING CHANGE:`, followed by a summary of the breaking change.
      ```
      BREAKING CHANGE: `useUserProfile` hook now requires a `userId` parameter.
      ```
    - **Referencing Issues:** Closed issues should be listed on a separate line in the footer prefixed with "Closes" keyword like:
      ```
      Closes #234
      ```
      or
      ```
      Closes #123, Closes #456
      ```

7.  **Examples:**

    - **feat:**

      ```
      feat: allow provided config object to extend other configs

      This allows users to extend existing configurations, making it easier
      to share and reuse settings across projects.
      ```

    - **fix (with scope):**

      ```
      fix(product-list): correct pagination error on empty results

      The pagination component was throwing an error when the product search
      returned no items. This commit ensures the component handles empty
      states gracefully.

      Closes #101
      ```

    - **feat (with BREAKING CHANGE):**

      ```
      feat(auth): switch to JWT-based authentication

      The authentication system has been upgraded from session-based to
      JWT-based authentication for improved statelessness and scalability.

      BREAKING CHANGE: The `GET /api/me` endpoint now requires an
      Authorization header with a Bearer token instead of a session cookie.
      Client-side token handling is now required.
      ```

    - **chore:**
      ```
      chore: update biome to v1.8.0
      ```
    - **docs(readme):**
      ```
      docs(readme): add setup instructions for new developers
      ```
