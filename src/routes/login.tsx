'use client';

import KakaoIcon from '@/assets/icons/kakao-icon.svg';
import NaverIcon from '@/assets/icons/naver-icon.svg';
import DroniLogo from '@/assets/images/droni-logo.svg';
import { KakaoConsentPopup } from '@/components';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type JSX, useState } from 'react';

export const Route = createFileRoute('/login')({
  component: LoginScreen,
});

/**
 * @description 소셜 로그인을 제공하는 로그인 화면 컴포넌트입니다.
 * 사용자는 카카오 또는 네이버를 통해 로그인할 수 있습니다.
 */
function LoginScreen(): JSX.Element {
  const [isKakaoConsentOpen, setIsKakaoConsentOpen] = useState(false);
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    setIsKakaoConsentOpen(true);
  };

  const handleNaverLogin = () => {
    const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
    const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI;

    if (!NAVER_CLIENT_ID || !NAVER_REDIRECT_URI) {
      console.error('네이버 로그인 환경 변수가 설정되지 않았습니다.');
      return;
    }

    // CSRF 토큰 생성
    let STATE: string;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      STATE = crypto.randomUUID();
    } else {
      // crypto.randomUUID가 지원되지 않는 환경을 위한 대체 로직
      console.warn(
        'crypto.randomUUID is not available. Using fallback for STATE token generation.',
      );
      STATE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        // eslint-disable-next-line no-bitwise
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    sessionStorage.setItem('naver_csrf_token', STATE);

    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${STATE}`;

    window.location.href = NAVER_AUTH_URL;
  };

  const handleKakaoConsentAgree = () => {
    setIsKakaoConsentOpen(false); // 팝업 닫기
    // TODO: 실제 카카오 로그인 API 호출 및 다음 단계 진행
    // 예: window.location.href = '카카오_인증_URL_이동';
    navigate({ to: '/dashboard/user' });
  };

  const handleKakaoConsentClose = () => {
    setIsKakaoConsentOpen(false); // 팝업 닫기
  };

  return (
    <div
      className="flex flex-col bg-white"
      style={{ minHeight: 'calc(100vh - var(--safe-area-inset-top))' }}
    >
      {/* Main content area */}
      {/* min-h 계산 시 body의 padding-top을 고려해야 할 수 있습니다.
          또는 calc에서 --safe-area-inset-top 변수를 직접 사용할 수도 있습니다.
          여기서는 단순화를 위해 기존 스타일을 유지하되, body 패딩으로 인해 시각적으로 조정될 수 있음을 인지합니다.
      */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
        <img src={DroniLogo} alt="Droni Logo" className="mb-6 h-[90px] w-[90px]" />
        <p
          className="mb-1.5 text-center font-spoqa text-system-01 text-gray-800"
          style={{ letterSpacing: '-1%' }}
        >
          당신 근처의 드로니
        </p>
        <p
          className="text-center font-spoqa text-system-08 text-gray-600"
          style={{ letterSpacing: '-1%' }}
        >
          드로니는 드론방제 서비스 앱이에요.
          <br />내 동네를 설정하고 시작해보세요!
        </p>
      </div>

      {/* Social login buttons area */}
      <div className="flex-shrink-0 w-full bg-white px-3 pt-4 shadow-up pb-[calc(1rem+var(--safe-area-inset-bottom))]">
        <div className="mx-auto max-w-md space-y-3">
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="relative mx-auto flex h-[54px] w-full items-center justify-center rounded-md bg-[#F9E007] py-3 pr-3 pl-4 text-gray-600"
          >
            <img
              src={KakaoIcon}
              className="absolute top-1/2 left-4 h-8 w-8 -translate-y-1/2"
              alt="카카오 로그인 아이콘"
            />
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-spoqa text-base leading-none font-bold tracking-normal">
              카카오로 3초만에 시작하기
            </span>
          </button>
          <button
            type="button"
            onClick={handleNaverLogin}
            className="relative mx-auto flex h-[54px] w-full items-center justify-center rounded-md border border-gray-300 bg-white py-3 pr-3 pl-4"
          >
            <img
              src={NaverIcon}
              className="absolute top-1/2 left-[22px] h-5 w-5 -translate-y-1/2"
              alt="네이버 로그인 아이콘"
            />
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-spoqa text-base leading-none font-bold tracking-normal text-gray-600">
              네이버로 시작하기
            </span>
          </button>
        </div>
      </div>

      {/* 카카오 동의 팝업 */}
      <KakaoConsentPopup
        isOpen={isKakaoConsentOpen}
        onClose={handleKakaoConsentClose}
        onAgree={handleKakaoConsentAgree}
      />
    </div>
  );
}

export default LoginScreen;
