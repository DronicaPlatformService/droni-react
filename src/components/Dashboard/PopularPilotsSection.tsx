'use client';

import { ChevronRightIcon, DefaultProfileIcon } from '@/components/Icons';
import type { JSX } from 'react';

interface PilotProfile {
  id: string;
  nickname: string;
  imageUrl?: string;
}

interface PopularPilotsSectionProps {
  pilots: PilotProfile[];
  onSeeMoreClick?: () => void; // "더 보기" 클릭 핸들러 (선택 사항)
}

/**
 * @description 인기있는 조종사 목록을 표시하는 섹션 컴포넌트입니다.
 * @param {PilotProfile[]} pilots - 표시할 조종사 프로필 배열.
 * @param {() => void} [onSeeMoreClick] - "더 보기" 버튼 클릭 시 호출될 함수.
 */
export function PopularPilotsSection({
  pilots,
  onSeeMoreClick,
}: PopularPilotsSectionProps): JSX.Element {
  return (
    <section className="h-43.5 bg-white py-6 px-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-spoqa text-system-03 tracking-tight-1pct text-gray-800">
            인기있는 조종사들
          </h2>
          <button
            type="button"
            onClick={onSeeMoreClick}
            className="flex items-center justify-center"
            aria-label="인기있는 조종사 더 보기"
          >
            <ChevronRightIcon className="h-6.5 w-6.5" />
          </button>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto">
          {pilots.map((pilot) => (
            <div
              key={pilot.id}
              className="flex flex-shrink-0 cursor-pointer flex-col items-center gap-1.5"
              // TODO: 각 조종사 클릭 시 프로필 페이지로 이동하는 로직 추가
              // onClick={() => navigateToPilotProfile(pilot.id)}
            >
              {pilot.imageUrl ? (
                <img
                  src={pilot.imageUrl}
                  alt={`${pilot.nickname} 프로필 이미지`}
                  className="h-16 w-16 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <DefaultProfileIcon className="h-16 w-16" />
              )}
              <span className="font-spoqa text-system-10 tracking-tight-1pct text-gray-600">
                {pilot.nickname}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
