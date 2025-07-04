import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

export const AddressManagementSection = (): JSX.Element => {
  return (
    <section className="mt-[10px] bg-white p-5 font-spoqa tracking-tight-1pct">
      <div className="mb-4">
        <span className="text-gray-800 text-system-05">주소지</span>
      </div>
      <Link
        to="/mypage/address"
        className="flex cursor-pointer items-center justify-between"
        aria-label="주소지 관리 페이지로 이동"
      >
        <div className="flex flex-col gap-0.5">
          <div className="text-gray-800 text-system-07">주소지 관리</div>
          <div className="text-gray-800 text-system-10">
            자주 사용하시는 주소지를 등록하실 수 있어요
          </div>
        </div>
        <div>
          <ChevronRightIcon className="h-5 w-5 text-gray-400" />
        </div>
      </Link>
    </section>
  );
};
