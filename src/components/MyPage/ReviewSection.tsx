'use client';

import { ChevronRightIcon } from '@heroicons/react/24/outline';
import type { JSX } from 'react';

/**
 * @description 마이페이지의 리뷰 관련 섹션 컴포넌트입니다.
 * 사용자는 이 섹션을 통해 리뷰를 작성하거나 관리할 수 있습니다.
 */
export const ReviewSection = (): JSX.Element => {
  return (
    <section className="mt-[10px] bg-white p-5 font-spoqa tracking-tight-1pct">
      <div className="mb-4">
        <span className="text-gray-800 text-system-05">리뷰</span>
      </div>
      <div className="flex flex-col gap-5">
        <button
          type="button"
          // onClick={/* 리뷰 작성 페이지로 이동하는 함수 */}
          className="-m-1 flex items-center justify-between rounded p-1 text-left hover:bg-gray-50"
          aria-label="리뷰 작성 페이지로 이동"
        >
          <div className="flex flex-col gap-0.5">
            <div className="text-gray-800 text-system-07">리뷰 작성</div>
            <div className="text-gray-600 text-system-10">
              받은 방제 서비스에 대한 리뷰를 작성하실 수 있어요
            </div>
          </div>
          <div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </div>
        </button>

        <button
          type="button"
          // onClick={/* 리뷰 관리 페이지로 이동하는 함수 */}
          className="-m-1 flex items-center justify-between rounded p-1 text-left hover:bg-gray-50"
          aria-label="리뷰 관리 페이지로 이동"
        >
          <div className="flex flex-col gap-0.5">
            <div className="text-gray-800 text-system-07">리뷰 관리</div>
            <div className="text-gray-600 text-system-10">작성한 리뷰를 관리하실 수 있어요</div>
          </div>
          <div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </div>
        </button>
      </div>
    </section>
  );
};
