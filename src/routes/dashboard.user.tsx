'use client';

import {
  AppHeader,
  Banner,
  BottomNavigationBar,
  DroneGuideCard,
  PopularPilotsSection,
} from '@/components';
import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

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

  const handleSeeMorePilots = () => {
    // TODO: 인기있는 조종사 "더 보기" 페이지로 이동하는 로직 구현
    console.log('인기있는 조종사 더 보기 클릭');
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Header */}
      <AppHeader userName={userName} hasUnreadNotification={hasUnreadNotification} />

      {/* Banner */}
      <Banner className="shrink-0" />

      {/* 인기있는 조종사들 섹션 */}
      <PopularPilotsSection pilots={samplePilots} onSeeMoreClick={handleSeeMorePilots} />

      {/* 드로니 활용백서 섹션 */}
      <div className="flex-1 overflow-y-auto pb-[calc(53px+env(safe-area-inset-bottom))]">
        <DroneGuideCard />
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavigationBar />
    </div>
  );
}
