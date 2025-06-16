import { login, setLoading } from '@/stores/authStore';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type JSX, useEffect } from 'react';

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
      console.error(
        `[NaverCallback] OAuth Error from search params: ${error}`,
      );
      alert(`네이버 로그인 오류: ${error}`);
      setLoading(false);
      navigate({ to: '/login', search: { error: error }, replace: true });
      return;
    }

    if (access_token) {
      /* try {
        const payloadBase64 = access_token.split('.')[1];
        if (payloadBase64) {
          // Base64URL 디코딩을 위해 '-'를 '+', '_'를 '/'로 변경
          const correctedBase64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
          // 패딩 추가 (Base64 문자열 길이는 4의 배수여야 함)
          const paddedBase64 = correctedBase64 + '==='.slice((correctedBase64.length + 3) % 4);
          const decodedPayload = atob(paddedBase64);
          const payloadObject = JSON.parse(decodedPayload);
          console.log('[NaverCallback] Decoded Access Token Payload:', payloadObject);
        } else {
          console.warn('[NaverCallback] Access token does not contain a payload part.');
        }
      } catch (e) {
        console.error('[NaverCallback] Error decoding access token:', e);
      } */

      login({ accessToken: access_token });

      setLoading(false);
      navigate({ to: '/dashboard/user', replace: true });
    } else if (!error) {
      console.warn('[NaverCallback] Callback invoked without access_token or error. search:', search);
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
