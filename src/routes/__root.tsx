import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import TanstackQueryLayout from '../integrations/tanstack-query/layout';

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: () => {
    return <p>Not Found (on root route)</p>;
  },
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />

      <TanstackQueryLayout />
    </>
  );
}
