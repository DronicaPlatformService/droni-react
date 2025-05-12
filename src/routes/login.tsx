'use client';

import KakaoIcon from '@/assets/icons/kakao-icon.svg';
import NaverIcon from '@/assets/icons/naver-icon.svg';
import DroniLogo from '@/assets/images/droni-logo.svg';
import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

export const Route = createFileRoute('/login')({
  component: LoginScreen,
});

/**
 * @description 소셜 로그인을 제공하는 로그인 화면 컴포넌트입니다.
 * 사용자는 카카오 또는 네이버를 통해 로그인할 수 있습니다.
 */
function LoginScreen(): JSX.Element {
  const handleKakaoLogin = () => {
    console.log('카카오 로그인 시도');
  };

  const handleNaverLogin = () => {
    console.log('네이버 로그인 시도');
  };

  return (
    <>
      {/* Status bar */}
      <div className="h-12 w-full md:h-0" />

      {/* Main content area */}
      <div className="flex flex-1 flex-col items-center justify-center p-4 min-h-[calc(100vh-3rem-132px)]">
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
      <div className="shadow-up fixed inset-x-0 bottom-0 w-full bg-white px-3 pb-4 md:relative md:shadow-none">
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
    </>
  );
}
