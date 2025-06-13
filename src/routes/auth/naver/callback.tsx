import { exchangeNaverCodeForToken } from '@/services/authService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type JSX, useEffect } from 'react';

export const Route = createFileRoute('/auth/naver/callback')({
  component: NaverCallbackPageComponent,
  validateSearch: (
    search: Record<string, unknown>,
  ): { code?: string; state?: string; error?: string; error_description?: string } => {
    return {
      code: search.code as string | undefined,
      state: search.state as string | undefined,
      error: search.error as string | undefined,
      error_description: search.error_description as string | undefined,
    };
  },
});

function NaverCallbackPageComponent(): JSX.Element | null {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = Route.useSearch();
  // const { login } = authStore.useStore(); // 실제 스토어 사용 시

  const mutation = useMutation({
    mutationFn: (params: { code: string; state: string }) =>
      exchangeNaverCodeForToken(params.code, params.state),
    onSuccess: (data) => {
      // login(data.user, data.token); // 실제 스토어의 login 액션 호출
      console.log('네이버 로그인 및 토큰 교환 성공:', data);
      // TODO: 발급받은 토큰을 안전하게 저장 (예: HttpOnly 쿠키는 백엔드에서 설정)
      // TODO: 전역 인증 상태 업데이트 (authStore 사용)
      queryClient.invalidateQueries({ queryKey: ['currentUser'] }); // 현재 사용자 정보 관련 쿼리 무효화
      alert('네이버 로그인 성공!'); // 사용자 피드백 (임시)
      navigate({ to: '/dashboard/user', replace: true }); // 로그인 후 대시보드로 이동
    },
    onError: (error) => {
      console.error('네이버 로그인 처리 실패:', error);
      alert(`네이버 로그인 처리 중 오류가 발생했습니다: ${error.message}`);
      navigate({ to: '/login', search: { error: error.message }, replace: true }); // 오류 시 로그인 페이지로 이동
    },
  });

  useEffect(() => {
    const { code, state, error, error_description } = search;

    if (error) {
      console.error(`네이버 OAuth 오류: ${error} - ${error_description}`);
      mutation.reset();
      alert(`네이버 로그인 오류: ${error_description || error}`);
      navigate({ to: '/login', search: { error: error_description || error }, replace: true });
      return;
    }

    if (code && state) {
      const storedState = localStorage.getItem('naver_oauth_state');
      if (storedState !== state) {
        console.error('유효하지 않은 state 파라미터입니다.');
        localStorage.removeItem('naver_oauth_state');
        alert('네이버 로그인 상태 정보가 일치하지 않습니다. 다시 시도해주세요.');
        navigate({ to: '/login', search: { error: 'Invalid state' }, replace: true });
        return;
      }
      localStorage.removeItem('naver_oauth_state'); // 사용 후 즉시 제거
      mutation.mutate({ code, state });
    } else if (!mutation.isPending && !mutation.isSuccess) {
      // code나 state 없이 콜백 페이지에 접근한 경우
      console.warn('네이버 콜백이 code 또는 state 없이 호출되었습니다.');
      navigate({ to: '/login', search: { error: '잘못된 접근입니다.' }, replace: true });
    }
  }, [search, navigate, mutation]);

  if (mutation.isPending) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2>네이버 로그인</h2>
        <p>인증 정보를 처리 중입니다...</p>
      </div>
    );
  }

  // 성공 또는 실패 시 useEffect 내에서 navigate가 처리하므로,
  // 이 컴포넌트가 직접적으로 렌더링하는 내용은 로딩 상태 외에는 최소화될 수 있습니다.
  // 오류 발생 시 사용자에게 보여줄 UI를 여기에 추가할 수도 있습니다.
  if (mutation.isError) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center', color: 'red' }}>
        <h2>네이버 로그인 실패</h2>
        <p>{mutation.error?.message || '알 수 없는 오류가 발생했습니다.'}</p>
        <button type="button" onClick={() => navigate({ to: '/login', replace: true })}>
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return null; // 또는 기본 로딩/리디렉션 메시지
}
