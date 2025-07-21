'use client';

import { MapPinIcon } from '@heroicons/react/24/outline';
import { memo } from 'react';
import type { Address } from '@/routes/mypage/address';

interface AddressCardProps {
  address: Address;
  isDefault?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AddressCard = memo(function AddressCard({
  address,
  isDefault = false,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <section
      aria-label={`${address.farmName} 주소지 카드`}
      className="flex-shrink-0 rounded-lg border-2 border-droni-blue-300 bg-white p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-600 text-white">
            <MapPinIcon aria-hidden className="h-3.5 w-3.5" />
          </span>
          <span className="text-gray-800 text-system-05 tracking-[-0.16px]">
            {address.farmName}
          </span>
          {isDefault && (
            <span
              className="inline-flex items-center justify-center rounded-xl px-2 pt-[3px] pb-0.5"
              style={{
                background: 'linear-gradient(90deg, #1660FF 0%, #0045DB 100%)',
              }}
            >
              <span className="font-bold text-[10px] text-white leading-[14px] tracking-[-0.1px]">
                기본 주소지
              </span>
            </span>
          )}
        </div>
        <button
          aria-label={`${address.farmName} 주소지 수정`}
          className="inline-flex items-center justify-center gap-2.5 rounded border border-gray-200 px-3 py-1"
          onClick={onEdit}
          type="button"
        >
          <span className="text-gray-900 text-system-10 tracking-[-0.12px]">수정</span>
        </button>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <span className="text-gray-800 text-system-07 tracking-[-0.14px]">{address.name}</span>
        <span aria-hidden className="h-3 w-[1px] bg-[#EBEDF0]" />
        <span className="text-gray-800 text-system-07 tracking-[-0.14px]">{address.phone}</span>
      </div>

      <address className="mt-2 flex flex-col text-gray-600 text-system-10 not-italic tracking-[-0.12px]">
        <div>{address.address1}</div>
        <div>{address.address2}</div>
      </address>

      <div className="mt-1 flex items-center justify-end">
        <button
          aria-label={`${address.farmName} 주소지 삭제`}
          className="cursor-pointer text-right font-medium text-gray-800 text-xs leading-[18px] tracking-[-0.12px] underline"
          onClick={onDelete}
          style={{
            textDecorationStyle: 'solid',
            textDecorationSkipInk: 'none',
            textDecorationThickness: 'auto',
            textUnderlineOffset: 'auto',
            textUnderlinePosition: 'from-font',
          }}
          type="button"
        >
          삭제
        </button>
      </div>
    </section>
  );
});
