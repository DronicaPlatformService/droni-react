'use client';

import { AppHeader, Banner } from '@/components';
import { ChatIcon } from '@/components/icons/ChatIcon';
import { EstimateIcon } from '@/components/icons/EstimateIcon';
import { HomeIcon } from '@/components/icons/HomeIcon';
import { MyPageIcon } from '@/components/icons/MyPageIcon';
import { SearchExpertIcon } from '@/components/icons/SearchExpertIcon';
import { Link, createFileRoute, useMatchRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

export const Route = createFileRoute('/dashboard/user')({
  component: DashboardUserScreen,
});

const navItems = [
  { id: 'home', label: '홈', icon: HomeIcon, path: '/dashboard/user' },
  { id: 'expert', label: '전문가 찾기', icon: SearchExpertIcon, path: '/experts' },
  { id: 'estimate', label: '견적', icon: EstimateIcon, path: '/estimates' },
  { id: 'chat', label: '채팅', icon: ChatIcon, path: '/chat' },
  { id: 'mypage', label: '마이페이지', icon: MyPageIcon, path: '/mypage' },
];

/**
 * @description 일반 사용자로 로그인했을 때 보여지는 메인 대시보드 화면입니다.
 * 이 화면은 사용자의 주요 정보 및 서비스 접근 지점을 제공합니다.
 */
function DashboardUserScreen(): JSX.Element {
  const matchRoute = useMatchRoute();
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
      <nav className="pb-safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white">
        <div className="mx-auto flex h-[53px] max-w-screen-sm justify-around font-spoqa">
          {navItems.map((item) => {
            // 현재 경로와 네비게이션 아이템의 경로가 일치하는지 확인합니다.
            // 홈('/dashboard/user')의 경우 정확히 일치해야 하고, 다른 경로는 fuzzy 매칭을 허용할 수 있습니다.
            // 현재는 모든 경로에 대해 시작 부분을 기준으로 매칭하도록 설정합니다.
            const isActive = !!matchRoute({
              to: item.path,
              fuzzy: item.path !== '/dashboard/user',
            });

            let textColorClass = 'text-gray-300'; // 기본 비활성 색상 (견적, 채팅, 마이페이지용)
            if (item.id === 'home') {
              textColorClass = isActive ? 'text-gray-600' : 'text-gray-600';
            } else if (item.id === 'expert') {
              textColorClass = isActive ? 'text-gray-600' : 'text-gray-300'; // 전문가 찾기 기본 색상
            } else if (isActive) {
              textColorClass = 'text-gray-600';
            }

            return (
              <Link
                to={item.path}
                key={item.id}
                className={`flex flex-1 flex-col items-center justify-center space-y-0.5 pt-1.5 pb-1 text-xs font-medium ${textColorClass} hover:text-gray-600 focus:outline-none focus:text-gray-600`}
                // TanStack Router의 Link 컴포넌트는 activeProps/inactiveProps를 직접 지원하지 않으므로,
                // className으로 활성 상태를 관리합니다.
              >
                <item.icon isActive={isActive} className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
