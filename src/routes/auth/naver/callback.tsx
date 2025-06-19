import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type JSX, useEffect } from 'react';
import { logTokenInfo } from '@/lib/jwtUtils';
import { login, setLoading } from '@/stores/authStore';

export const Route = createFileRoute('/auth/naver/callback')({
  component: NaverCallbackPageComponent,
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    access_token?: string;
    error?: string;
  } => {
    return {
      access_token: search.access_token as string | undefined,
      error: search.error as string | undefined,
    };
  },
});

function NaverCallbackPageComponent(): JSX.Element | null {
  const navigate = useNavigate();
  const search = Route.useSearch();

  useEffect(() => {
    setLoading(true);
    const { access_token, error } = search;

    if (error) {
      console.error(`[NaverCallback] OAuth Error from search params: ${error}`);
      alert(`네이버 로그인 오류: ${error}`);
      setLoading(false);
      navigate({ to: '/login', search: { error: error }, replace: true });
      return;
    }

    if (access_token) {
      // 개발 환경에서 토큰 정보 로깅
      if (import.meta.env.DEV) {
        logTokenInfo(access_token, 'Naver OAuth Access Token');
      }

      login({ accessToken: access_token });

      setLoading(false);
      setTimeout(() => {
        navigate({ to: '/dashboard/user', replace: true });
      }, 2000);
    } else if (!error) {
      console.warn(
        '[NaverCallback] Callback invoked without access_token or error. search:',
        search,
      );
      alert('잘못된 접근입니다. 다시 시도해주세요.');
      setLoading(false);
      navigate({ to: '/login', search: { error: 'Invalid callback parameters' }, replace: true });
    }
  }, [search, navigate]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>네이버 로그인</h2>
      <p>인증 정보를 처리 중입니다...</p>
    </div>
  );
}
