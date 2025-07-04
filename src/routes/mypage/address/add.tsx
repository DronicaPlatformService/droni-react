'use client';

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { AddressInput } from '@/components/Address/AddressInput';
import { AddressLayout } from '@/components/Address/AddressLayout';
import { AddressSearchPopup } from '@/components/Address/AddressSearchPopup';
import { requireAuth } from '@/lib/authGuard';

export const Route = createFileRoute('/mypage/address/add')({
  beforeLoad: requireAuth,
  component: AddAddressScreen,
  context: (ctx) => ({ ...ctx.context, hideBottomNav: true }),
});

function AddAddressScreen() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const handleConfirm = useCallback(() => {
    if (selectedAddress && name && phone) {
      // TODO: 주소 저장 API 호출 및 에러 핸들링
      // 예: await saveAddress({ name, phone, address: selectedAddress, detail: addressDetail });
      navigate({ to: '/mypage/address', replace: true });
    }
  }, [selectedAddress, name, phone, navigate]);

  const handleSelectAddress = useCallback((address: string) => {
    setSelectedAddress(address);
    setIsPopupOpen(false);
  }, []);

  return (
    <AddressLayout
      pageTitle="주소지 추가하기"
      buttonText="확인"
      onButtonClick={handleConfirm}
      isButtonDisabled={!selectedAddress || !name || !phone}
    >
      <section className="space-y-5 p-3">
        <AddressInput
          id="address-name"
          label="이름"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={setName}
        />
        <AddressInput
          id="address-phone"
          label="연락처"
          placeholder="연락처를 입력해주세요"
          value={phone}
          onChange={setPhone}
        />
        <div>
          <label
            htmlFor="postcode"
            className="ml-2 block text-gray-700 text-system-07 tracking-[-0.14px]"
          >
            주소지
          </label>
          <div className="relative mb-2.5">
            <AddressInput
              id="postcode"
              label=""
              placeholder="우편번호 찾기"
              value={selectedAddress}
              readOnly
              onClick={() => setIsPopupOpen(true)}
              iconLeft={
                <svg width="17.5" height="17.5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M15 15L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              }
              iconRight={<ChevronRightIcon className="h-5 w-5" />}
              ariaLabel="우편번호 찾기"
            />
          </div>
          <AddressInput
            id="address-detail"
            label=""
            placeholder="상세주소를 입력해주세요"
            value={addressDetail}
            onChange={setAddressDetail}
          />
        </div>
      </section>

      <AddressSearchPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSelect={handleSelectAddress}
      />
    </AddressLayout>
  );
}
