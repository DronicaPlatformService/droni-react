'use client';

import { type JSX, useCallback, useEffect, useRef } from 'react';

// Daum 우편번호 타입 선언
declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
        onclose?: () => void;
        [key: string]: unknown;
      }) => {
        embed: (element: HTMLElement) => void;
      };
    };
  }
}

interface DaumPostcodeData {
  address: string;
  [key: string]: unknown;
}

interface AddressSearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: string) => void;
}

/**
 * Daum 우편번호 스크립트 로딩 및 Postcode embed 훅
 */
function useDaumPostcode(
  isOpen: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  onSelect: (address: string) => void,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isOpen) return;

    let script: HTMLScriptElement | null = null;

    function openPostcode() {
      if (!containerRef.current || !window.daum?.Postcode) return;
      containerRef.current.innerHTML = '';
      try {
        new window.daum.Postcode({
          oncomplete: (data: DaumPostcodeData) => {
            onSelect(data.address);
          },
          onclose: onClose,
        }).embed(containerRef.current);
      } catch (err) {
        console.error('Daum Postcode embed 실패:', err);
        alert('주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
        onClose();
      }
    }

    if (!window.daum?.Postcode) {
      script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = openPostcode;
      script.onerror = () => {
        alert('주소 검색 스크립트 로딩에 실패했습니다.');
        onClose();
      };
      document.body.appendChild(script);
    } else {
      openPostcode();
    }

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
      if (script) {
        script.onload = null;
        script.onerror = null;
      }
    };
  }, [isOpen, containerRef, onSelect, onClose]);
}

export const AddressSearchPopup = ({
  isOpen,
  onClose,
  onSelect,
}: AddressSearchPopupProps): JSX.Element | null => {
  const containerRef = useRef<HTMLDivElement>(null);

  useDaumPostcode(isOpen, containerRef, onSelect, onClose);

  // ESC로만 닫기, Enter/Space는 내부 버튼에만 적용
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0, 0, 0, 0.50)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-search-title"
      tabIndex={-1}
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="flex w-full animate-slide-up flex-col rounded-t-lg bg-white px-5 pt-2.5"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby="address-search-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          // 내부에서 Enter/Space는 전파 방지
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
          }
        }}
      >
        <div className="mb-5 flex w-full items-center justify-center">
          <div className="h-1 w-17.5 rounded-[5px] bg-gray-300" />
        </div>
        <div className="mb-4 flex">
          <h2 id="address-search-title" className="text-system-03 tracking-[-0.18px]">
            주소지 찾기
          </h2>
        </div>
        {/* Daum 우편번호 서비스가 마운트될 컨테이너 */}
        <div
          id="postcode-container"
          ref={containerRef}
          style={{ height: '83vh' }}
          className="overflow-y-auto"
        />
      </div>
    </div>
  );
};
