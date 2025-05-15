import { ChevronRightIcon } from '@heroicons/react/24/outline';
import type { JSX } from 'react';

export const AddressManagementSection = (): JSX.Element => {
  return (
    <section className="mt-[10px] bg-white p-5 font-spoqa tracking-tight-1pct">
      <div className="mb-4">
        <span className="text-system-05 text-gray-800">주소지</span>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="text-system-07 text-gray-800">주소지 관리</div>
          <div className="text-system-10 text-gray-800">
            자주 사용하시는 주소지를 등록하실 수 있어요
          </div>
        </div>
        <div>
          <ChevronRightIcon className="h-6 w-6 text-gray-400" />
        </div>
      </div>
    </section>
  );
};
