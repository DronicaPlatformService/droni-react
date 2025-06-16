import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiError } from '../../lib/apiClient';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // apiClient가 이미 401 오류를 처리하고 (예: 토큰 재발급 시도 후 실패)
        // 세션을 종료한 경우, TanStack Query는 해당 오류를 다시 시도하지 않아야 합니다.
        if (error instanceof ApiError && error.status === 401) {
          return false;
        }
        // 다른 일반적인 오류에 대한 기본 재시도 로직 (예: 네트워크 오류)
        // 프로덕션에서는 재시도 횟수를 신중하게 결정하세요.
        return failureCount < 2; // 예시: 최대 2번 재시도
      },
      // 필요에 따라 다른 전역 쿼리 옵션 추가
      // 예: staleTime, gcTime 등
    },
    mutations: {
      onError: (error) => {
        // 전역 뮤테이션 에러 핸들러
        if (error instanceof ApiError && error.status === 401) {
          // apiClient에서 이미 리디렉션 등의 처리를 했을 것입니다.
          // 여기서는 추가적인 전역 로깅 또는 알림 등의 부수 효과를 처리할 수 있습니다.
          console.error('Global mutation error handler (auth related):', error.message);
        }
        // 다른 종류의 뮤테이션 에러에 대한 공통 처리
      },
      // 필요에 따라 다른 전역 뮤테이션 옵션 추가
    },
  },
});

export function getContext() {
  return {
    queryClient,
  };
}

export function Provider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
