import { ChevronRightIcon } from '@heroicons/react/24/solid';
import type { JSX } from 'react';
import { DefaultProfileIcon } from '@/components/Icons';

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
    <section className="bg-white px-5 py-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-800 text-system-03 tracking-[-0.18px]">인기있는 조종사들</h2>
          <button
            aria-label="인기있는 조종사 더 보기"
            className="flex items-center justify-center"
            onClick={onSeeMoreClick}
            type="button"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5">
          {pilots.map((pilot) => (
            <div
              className="flex flex-shrink-0 cursor-pointer flex-col items-center gap-1.5"
              key={pilot.id}
              // TODO: 각 조종사 클릭 시 프로필 페이지로 이동하는 로직 추가
              // onClick={() => navigateToPilotProfile(pilot.id)}
            >
              {pilot.imageUrl ? (
                <img
                  alt={`${pilot.nickname} 프로필 이미지`}
                  className="h-16 w-16 rounded-full border border-gray-200 object-cover"
                  src={pilot.imageUrl}
                />
              ) : (
                <DefaultProfileIcon className="h-16 w-16" />
              )}
              <span className="font-spoqa text-gray-600 text-system-10 tracking-tight-1pct">
                {pilot.nickname}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
