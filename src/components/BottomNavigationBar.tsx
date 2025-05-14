'use client';

import { ChatIcon, EstimateIcon, HomeIcon, MyPageIcon, SearchExpertIcon } from '@/components/Icons';
import { Link, useMatchRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: (props: { isActive: boolean; className?: string }) => JSX.Element;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: '홈', icon: HomeIcon, path: '/dashboard/user' },
  { id: 'expert', label: '전문가 찾기', icon: SearchExpertIcon, path: '/experts' },
  { id: 'estimate', label: '견적', icon: EstimateIcon, path: '/estimates' },
  { id: 'chat', label: '채팅', icon: ChatIcon, path: '/chat' },
  { id: 'mypage', label: '마이페이지', icon: MyPageIcon, path: '/mypage' },
];

/**
 * @description 애플리케이션 하단 네비게이션 바 컴포넌트입니다.
 */
export function BottomNavigationBar(): JSX.Element {
  const matchRoute = useMatchRoute();

  return (
    <nav className="pb-safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white">
      <div className="mx-auto flex h-[53px] max-w-screen-sm justify-around font-spoqa">
        {navItems.map((item) => {
          const isActive = !!matchRoute({
            to: item.path,
            fuzzy: item.path !== '/dashboard/user', // 홈은 정확히 일치, 나머지는 fuzzy 매칭
          });

          let textColorClass = 'text-gray-300'; // 기본 비활성 색상
          if (item.id === 'home') {
            textColorClass = isActive ? 'text-gray-600' : 'text-gray-600';
          } else if (item.id === 'expert') {
            textColorClass = isActive ? 'text-gray-600' : 'text-gray-300';
          } else if (isActive) {
            textColorClass = 'text-gray-600';
          }

          return (
            <Link
              to={item.path}
              key={item.id}
              className={`flex flex-1 flex-col items-center justify-center space-y-0.5 pt-1.5 pb-1 text-xs font-medium ${textColorClass} hover:text-gray-600 focus:outline-none focus:text-gray-600`}
            >
              <item.icon isActive={isActive} className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
