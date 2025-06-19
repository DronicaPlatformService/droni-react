import { redirect } from '@tanstack/react-router';
import { authStore } from '@/stores/authStore';

/**
 * @description 인증이 필요한 라우트에서 호출. 인증되지 않은 경우 /login으로 리다이렉트.
 * @throws redirect 예외 (TanStack Router에서 자동 처리)
 */
export function requireAuth() {
  const { isAuthenticated, accessToken } = authStore.state;
  if (!isAuthenticated || !accessToken) {
    throw redirect({ to: '/login' });
  }
}
