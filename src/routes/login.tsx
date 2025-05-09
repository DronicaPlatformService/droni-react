'use client';

import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

// TODO: 실제 로고 이미지를 추가하고 아래 주석을 해제하세요.
// import DroniLogo from '@/assets/images/droni-logo.svg'; // 예: src/assets/images/droni-logo.svg

export const Route = createFileRoute('/login')({
  component: LoginScreen,
});

function LoginScreen(): JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-between min-h-screen bg-white p-3 mx-auto font-spoqa"
      style={{ maxWidth: '375px' }}
    >
      {/* 상단 여백 (Figma의 Status Bar 영역을 고려한 간격) */}
      <div className="h-12 shrink-0" />

      {/* 로고 및 텍스트 섹션 */}
      <div className="flex flex-col items-center text-center px-3">
        {/* 로고 Placeholder */}
        {/* <img src={DroniLogo} alt="드로니 로고" className="w-[90px] h-[90px] mb-8" /> */}
        <div className="w-[90px] h-[90px] bg-gray-200 rounded-full mb-8 flex items-center justify-center text-sm text-gray-500">
          로고
        </div>
        <h1 className="text-system-20 font-bold text-gray-800 leading-28 mb-2">
          당신 근처의 드로니
        </h1>
        <p className="text-system-14 font-medium text-gray-600 leading-20">
          드로니는 드론방제 서비스 앱이에요. 내 동네를 설정하고 시작해보세요!
        </p>
      </div>

      {/* 버튼 섹션 */}
      <div className="w-full mt-auto pt-6">
        <button
          type="button"
          className="w-full h-[54px] bg-[#F9E007] rounded-lg flex items-center justify-center mb-3"
          // onClick={() => { /* TODO: 카카오 로그인 로직 구현 */ }}
        >
          {/* TODO: 카카오 아이콘 SVG 또는 이미지 추가 */}
          <span className="text-system-16 font-bold text-gray-600 leading-20">
            카카오로 3초만에 시작하기
          </span>
        </button>
        <button
          type="button"
          className="w-full h-[54px] bg-white border border-gray-300 rounded-lg flex items-center justify-center"
          // onClick={() => { /* TODO: 네이버 로그인 로직 구현 */ }}
        >
          {/* TODO: 네이버 아이콘 SVG 또는 이미지 추가 */}
          <span className="text-system-16 font-bold text-gray-600 leading-20">
            네이버로 시작하기
          </span>
        </button>
      </div>
    </div>
  );
}
