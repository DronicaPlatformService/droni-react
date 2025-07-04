'use client';

import type { JSX } from 'react';

const KAKAO_CONSENT_ITEMS = [
  { id: 'profile', text: '프로필 정보 (닉네임, 프로필 사진)', isOptional: false },
  { id: 'email', text: '카카오계정 (이메일)', isOptional: false },
  { id: 'gender', text: '성별', isOptional: true },
  { id: 'age_range', text: '연령대', isOptional: true },
  { id: 'shipping_address', text: '배송지 정보 (이름, 연락처, 주소)', isOptional: true },
];

interface KakaoConsentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

/**
 * @description 카카오 로그인 시 사용자 동의를 구하는 팝업 컴포넌트입니다.
 * @param {boolean} isOpen - 팝업 표시 여부.
 * @param {() => void} onClose - 팝업 닫기 또는 취소 시 호출될 함수.
 * @param {() => void} onAgree - 동의 버튼 클릭 시 호출될 함수.
 * @param {ConsentItem[]} consentItems - 동의 항목 목록.
 */
export const KakaoConsentPopup = ({
  isOpen,
  onClose,
  onAgree,
}: KakaoConsentPopupProps): JSX.Element | null => {
  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-black/50 p-4"
      aria-labelledby="kakao-consent-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLDialogElement>) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      tabIndex={-1}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 id="kakao-consent-title" className="mb-4 font-bold text-gray-800 text-xl">
          카카오 로그인 동의
        </h2>
        <p className="mb-1 text-gray-700 text-sm">
          원활한 서비스 이용을 위해 다음 정보 제공에 동의해주세요.
        </p>
        <p className="mb-4 text-gray-500 text-xs">
          동의하지 않아도 서비스 이용은 가능하나, 일부 기능 사용에 제한이 있을 수 있습니다. (선택
          항목의 경우)
        </p>
        <ul className="mb-6 space-y-3">
          {KAKAO_CONSENT_ITEMS.map((item) => (
            <li key={item.id} className="flex items-start text-sm">
              <svg
                className={`mt-0.5 mr-3 h-4 w-4 flex-shrink-0 ${
                  item.isOptional ? 'text-gray-400' : 'text-yellow-500'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <span className="text-gray-800">{item.text}</span>
                <span
                  className={`ml-1 text-xs ${item.isOptional ? 'text-gray-500' : 'font-semibold text-yellow-600'}`}
                >
                  ({item.isOptional ? '선택' : '필수'})
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col space-y-3 sm:flex-row sm:justify-end sm:space-x-3 sm:space-y-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:w-auto"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onAgree}
            className="w-full rounded-md border border-transparent bg-yellow-400 px-4 py-2.5 font-medium text-black text-sm shadow-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:w-auto"
          >
            동의하고 계속하기
          </button>
        </div>
      </div>
    </dialog>
  );
};
