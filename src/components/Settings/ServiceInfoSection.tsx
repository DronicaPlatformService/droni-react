'use client';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { Link } from '@tanstack/react-router';
import type { JSX } from 'react';

interface ServiceInfoSectionProps {
  className?: string;
}

interface ServiceInfoItem {
  id: string;
  label: string;
  value?: string;
  href?: string; // Link 컴포넌트 사용 시
  onClick?: () => void; // button 사용 시
  isExternal?: boolean; // 외부 링크 여부
  showUpdateNeeded?: boolean;
}

const currentAppVersion: string = '2.3.6'; // 실제 앱 버전은 동적으로 가져와야 합니다.
const latestAppVersion: string = '2.4.0'; // 예시 최신 버전

const serviceInfoItems: ServiceInfoItem[] = [
  {
    id: 'version',
    label: '버전 정보',
    value: currentAppVersion,
    showUpdateNeeded: currentAppVersion !== latestAppVersion, // 버전 비교 로직 필요
    // onClick: () => console.log('Update app or show update info'), // 업데이트 로직
  },
  {
    id: 'terms',
    label: '이용 약관',
    href: '/terms',
  },
  {
    id: 'privacy',
    label: '개인정보 처리 방침',
    href: '/privacy',
  },
];

/**
 * @description 서비스 정보(버전, 약관 등)를 표시하는 섹션 컴포넌트입니다.
 * @param {ServiceInfoSectionProps} props - 컴포넌트 props
 */
export const ServiceInfoSection = ({ className }: ServiceInfoSectionProps): JSX.Element => {
  // TODO: 실제 앱에서는 앱 스토어 링크나 업데이트 안내 페이지로 이동하는 로직을 구현해야 합니다.
  const handleUpdateClick = () => {
    alert('새로운 버전으로 업데이트 해주세요! (스토어로 이동)');
  };

  return (
    <section className={className}>
      <div className="flex flex-col bg-white p-5 font-spoqa tracking-tight-1pct">
        <h3 className="text-gray-800 text-system-05">서비스 정보</h3>

        <ul className="mt-4 flex flex-col">
          {serviceInfoItems.map((item, index) => (
            <li key={item.id} className={index > 0 ? 'mt-5' : ''}>
              {item.id === 'version' ? (
                <button
                  type="button"
                  onClick={
                    item.id === 'version' && item.showUpdateNeeded
                      ? handleUpdateClick
                      : item.onClick
                  }
                  className="-m-1 flex w-full items-start justify-between p-1 text-left"
                  aria-describedby={
                    item.id === 'version' && item.showUpdateNeeded
                      ? `${item.id}-update-desc`
                      : undefined
                  }
                >
                  <div className="flex flex-col">
                    <span className="text-gray-800 text-system-07">{item.label}</span>
                    {item.showUpdateNeeded && (
                      <div id={`${item.id}-update-desc`} className="mt-1 flex items-center">
                        <ExclamationCircleIcon className="mr-1 h-4 w-4 text-[#FF385C]" />
                        <span className="text-gray-600 text-system-10">
                          새로운 버전으로 업데이트 해주세요
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    {item.value && (
                      <span className="text-gray-800 text-system-07">{item.value}</span>
                    )}
                  </div>
                </button>
              ) : (
                <Link
                  to={item.href}
                  className="-m-1 flex items-center justify-between p-1"
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                >
                  <div>
                    <span className="text-gray-800 text-system-07">{item.label}</span>
                  </div>
                  <div>
                    <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
