'use client';

import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';
import {
  Banner,
  DashboardHeader,
  DroneGuideCard,
  PopularPilotsSection,
} from '@/components/Dashboard';
import { EstimateRequestIcon } from '@/components/Icons';

export const Route = createFileRoute('/dashboard/user')({
  component: DashboardUserScreen,
});

// 샘플 조종사 데이터
interface PilotProfile {
  id: string;
  nickname: string;
  imageUrl?: string;
}

const samplePilots: PilotProfile[] = [
  { id: '1', nickname: '드론마스터', imageUrl: '' },
  { id: '2', nickname: '항공촬영전문', imageUrl: '' },
  { id: '3', nickname: '스피드레이서', imageUrl: '' },
  { id: '4', nickname: '정밀농업용사', imageUrl: '' },
  { id: '5', nickname: 'FPV여행가', imageUrl: '' },
  { id: '6', nickname: '교육의신', imageUrl: '' },
];

/**
 * @description 일반 사용자로 로그인했을 때 보여지는 메인 대시보드 화면입니다.
 * 이 화면은 사용자의 주요 정보 및 서비스 접근 지점을 제공합니다.
 */
function DashboardUserScreen(): JSX.Element {
  const userName = '이종현'; // 사용자 이름 예시
  const hasUnreadNotification = true; // 읽지 않은 알림 예시

  const handleSeeMorePilots = () => {};

  const handleEstimateRequestClick = () => {};

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <DashboardHeader userName={userName} hasUnreadNotification={hasUnreadNotification} />

      {/* Banner */}
      <Banner className="shrink-0" />

      {/* 인기있는 조종사들 섹션 */}
      <PopularPilotsSection pilots={samplePilots} onSeeMoreClick={handleSeeMorePilots} />

      {/* 드로니 활용백서 섹션 */}
      <div className="flex-1 overflow-y-auto pb-[calc(53px+env(safe-area-inset-bottom))]">
        <DroneGuideCard />
      </div>

      {/* 견적 요청 버튼 */}
      <button
        type="button"
        onClick={handleEstimateRequestClick}
        className="fixed right-5 bottom-[75px] z-40 flex h-[44px] w-[115px] items-center justify-center gap-1 rounded-full bg-droni-blue-500 px-[14px] py-[10px] shadow-[0px_0px_4px_rgba(0,0,0,0.1),_0px_0px_12px_rgba(0,0,0,0.2)] hover:bg-droni-blue-600 focus:ring-2 focus:ring-droni-blue-500/75 focus:outline-none"
        aria-label="견적 요청하기"
      >
        <EstimateRequestIcon className="h-6 w-6" />
        <span className="font-spoqa text-base leading-6 font-bold tracking-tight-1pct text-white">
          견적요청
        </span>
      </button>
    </div>
  );
}
