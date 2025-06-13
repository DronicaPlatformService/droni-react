// 임시 authStore 및 authService (실제 프로젝트에서는 별도 파일로 분리)
interface UserProfile {
  id: string;
  name: string;
  email?: string;
}

// 실제 exchangeNaverCodeForToken 함수는 백엔드와 통신해야 합니다.
export const exchangeNaverCodeForToken = async (
  code: string,
  state: string,
): Promise<{ token: string; user: UserProfile }> => {
  console.log('백엔드로 네이버 인증 코드 전송 시도:', { code, state });
  // 여기에 실제 백엔드 API 호출 로직을 구현합니다.
  // 예:
  // const response = await fetch('/api/auth/naver/token', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ code, state }),
  // });
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.message || '네이버 토큰 교환 실패');
  // }
  // return response.json();

  // 임시 응답 (실제 백엔드 응답으로 대체)
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 네트워크 지연 시뮬레이션
  return {
    token: `mock_naver_access_token_for_${code}`,
    user: { id: 'naver_user_123', name: '네이버사용자', email: 'naver@example.com' },
  };
};
