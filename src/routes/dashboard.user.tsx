'use client';

import { AppHeader, Banner, BottomNavigationBar } from '@/components';
import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

export const Route = createFileRoute('/dashboard/user')({
  component: DashboardUserScreen,
});

/**
 * @description 일반 사용자로 로그인했을 때 보여지는 메인 대시보드 화면입니다.
 * 이 화면은 사용자의 주요 정보 및 서비스 접근 지점을 제공합니다.
 */
function DashboardUserScreen(): JSX.Element {
  const userName = '이종현'; // 사용자 이름 예시
  const hasUnreadNotification = true; // 읽지 않은 알림 예시

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Header */}
      <AppHeader userName={userName} hasUnreadNotification={hasUnreadNotification} />

      {/* Banner */}
      <Banner className="shrink-0" />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">일반 사용자 메인 화면</h1>
          <p className="mt-2 text-gray-600">
            환영합니다! 서비스 이용을 위한 주요 기능을 이곳에서 확인하세요.
          </p>
          {/* TODO: 일반 사용자 대시보드에 표시될 실제 콘텐츠 (예: 알림, 바로가기 등)를 여기에 구현합니다. */}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavigationBar />
    </div>
  );
}
