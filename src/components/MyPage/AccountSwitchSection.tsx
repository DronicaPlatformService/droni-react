import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import type { JSX } from 'react';

/**
 * @description 마이페이지의 계정 전환 섹션 컴포넌트입니다.
 */
export const AccountSwitchSection = (): JSX.Element => {
  const handleSignUpClick = () => {
    // TODO: 조종사 가입 페이지로 이동하는 로직 구현
    console.log('조종사 가입하기 클릭');
  };

  return (
    <section className="mt-[10px] bg-white p-5 font-spoqa tracking-tight-1pct">
      <div className="mb-4">
        <h2 className="text-gray-800 text-system-05 tracking-tight-1pct">계정 전환</h2>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <h3 className="mb-1 text-gray-800 text-system-07 tracking-tight-1pct">조종사로 전환</h3>
            <div className="flex items-center">
              <ExclamationCircleIcon className="mr-1 h-4 w-4 text-[#FF385C]" />
              <span className="text-gray-600 text-system-10 tracking-tight-1pct">
                현재 가입하신 조종사 계정이 없어요
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignUpClick}
            className="rounded-sm border border-gray-200 px-3 py-1"
          >
            <span className="text-gray-900 text-system-10 tracking-tight-1pct">가입하기</span>
          </button>
        </div>
      </div>
    </section>
  );
};
