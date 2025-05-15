import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import type { JSX } from 'react';

/**
 * @description 마이페이지 화면의 헤더 컴포넌트입니다.
 * "마이페이지" 제목과 설정 아이콘을 포함합니다.
 */
export const MyPageHeader = (): JSX.Element => {
  const handleSettingsClick = () => {
    // TODO: 설정 페이지로 이동하거나 설정 관련 액션 시트/모달을 표시하는 로직 구현
    console.log('설정 아이콘 클릭');
  };

  return (
    <>
      <header className="item-center flex h-[52px] w-full flex-shrink-0 justify-between bg-white px-5 py-[13px]">
        <h1 className="font-spoqa text-system-03 tracking-tight-1pct text-gray-800">마이페이지</h1>
        <button
          type="button"
          aria-label="설정"
          onClick={handleSettingsClick}
          className="rounded p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-droni-blue-500/50"
        >
          <Cog8ToothIcon className="h-7 w-7 text-black" />
        </button>
      </header>
    </>
  );
};
