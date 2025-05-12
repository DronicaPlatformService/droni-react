'use client';

import type { JSX } from 'react';

interface ConsentItem {
  id: string;
  text: string;
  isOptional?: boolean;
}

interface KakaoConsentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  consentItems: ConsentItem[];
}

/**
 * @description 카카오 로그인 시 사용자 동의를 구하는 팝업 컴포넌트입니다.
 * @param {boolean} isOpen - 팝업 표시 여부.
 * @param {() => void} onClose - 팝업 닫기 또는 취소 시 호출될 함수.
 * @param {() => void} onAgree - 동의 버튼 클릭 시 호출될 함수.
 * @param {ConsentItem[]} consentItems - 동의 항목 목록.
 */
const KakaoConsentPopup = ({
  isOpen,
  onClose,
  onAgree,
  consentItems,
}: KakaoConsentPopupProps): JSX.Element | null => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kakao-consent-title"
      onClick={onClose} // 배경 클릭 시 닫기
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} // 팝업 내부 클릭 시 이벤트 전파 중단
      >
        <h2 id="kakao-consent-title" className="mb-4 text-xl font-bold text-gray-800">
          카카오 로그인 동의
        </h2>
        <p className="mb-1 text-sm text-gray-700">
          원활한 서비스 이용을 위해 다음 정보 제공에 동의해주세요.
        </p>
        <p className="mb-4 text-xs text-gray-500">
          동의하지 않아도 서비스 이용은 가능하나, 일부 기능 사용에 제한이 있을 수 있습니다. (선택
          항목의 경우)
        </p>
        <ul className="mb-6 space-y-3">
          {consentItems.map((item) => (
            <li key={item.id} className="flex items-start text-sm">
              <svg
                className={`mr-3 mt-0.5 h-4 w-4 flex-shrink-0 ${
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
                  className={`ml-1 text-xs ${item.isOptional ? 'text-gray-500' : 'text-yellow-600 font-semibold'}`}
                >
                  ({item.isOptional ? '선택' : '필수'})
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col space-y-3 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:w-auto"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onAgree}
            className="w-full rounded-md border border-transparent bg-yellow-400 px-4 py-2.5 text-sm font-medium text-black shadow-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:w-auto"
          >
            동의하고 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default KakaoConsentPopup;
