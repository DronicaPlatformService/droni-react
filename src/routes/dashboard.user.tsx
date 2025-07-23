'use client';

import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';
import {
  Banner,
  DashboardHeader,
  DroneContentsSection,
  DroneGuideCard,
  EstimateRequestButton,
  PopularPilotsSection,
} from '@/components/Dashboard';
import { requireAuth } from '@/lib/authGuard';

export const Route = createFileRoute('/dashboard/user')({
  beforeLoad: requireAuth,
  component: DashboardUserScreen,
  context: (ctx) => ({ ...ctx.context, hideBottomNav: false }),
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
  { id: '7', nickname: '야경촬영왕', imageUrl: '' },
  { id: '8', nickname: '산림감시자', imageUrl: '' },
  { id: '9', nickname: '드론정비사', imageUrl: '' },
  { id: '10', nickname: '농촌지킴이', imageUrl: '' },
  { id: '11', nickname: '해양탐험가', imageUrl: '' },
  { id: '12', nickname: '도심촬영전문', imageUrl: '' },
];

/**
 * @description 일반 사용자로 로그인했을 때 보여지는 메인 대시보드 화면입니다.
 * 이 화면은 사용자의 주요 정보 및 서비스 접근 지점을 제공합니다.
 */
function DashboardUserScreen(): JSX.Element {
  const userName = '이종현'; // 사용자 이름 예시
  const hasUnreadNotification = true; // 읽지 않은 알림 예시

  const handleSeeMorePilots = () => {};

  return (
    <>
      {/* Header */}
      <DashboardHeader hasUnreadNotification={hasUnreadNotification} userName={userName} />

      <main className="mb-[calc(52px+env(safe-area-inset-bottom))] flex-1 overflow-y-auto">
        {/* Banner */}
        <Banner className="shrink-0" />

        {/* 인기있는 조종사들 섹션 */}
        <PopularPilotsSection onSeeMoreClick={handleSeeMorePilots} pilots={samplePilots} />

        {/* 드로니 활용백서 섹션 */}
        <DroneGuideCard />

        {/* 드론관련 콘텐츠 섹션 */}
        <DroneContentsSection />

        {/* 견적 요청 버튼 */}
        <EstimateRequestButton />
      </main>
    </>
  );
}
