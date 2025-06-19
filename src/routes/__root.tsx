import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet, useMatches } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { BottomNavigationBar } from '@/components';
import { useTokenExpirationMonitor } from '@/hooks';
import TanstackQueryLayout from '../integrations/tanstack-query/layout';

interface MyRouterContext {
  queryClient: QueryClient;
  hideBottomNav?: boolean;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: () => {
    return <p>Not Found (on root route)</p>;
  },
});

function RootComponent() {
  const matches = useMatches();

  const hideBottomNav = matches.some((m) => m.context?.hideBottomNav);

  // JWT 토큰 만료 감지 및 자동 갱신 모니터링 시작
  useTokenExpirationMonitor();

  return (
    <>
      <Outlet />
      {!hideBottomNav && <BottomNavigationBar />}
      <TanStackRouterDevtools />
      <TanstackQueryLayout />
    </>
  );
}
