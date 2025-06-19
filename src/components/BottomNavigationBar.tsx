'use client';

import { Link, useMatchRoute } from '@tanstack/react-router';
import { type JSX, useMemo } from 'react';
import { ChatIcon, EstimateIcon, HomeIcon, MyPageIcon, SearchExpertIcon } from '@/components/Icons';

interface NavItem {
  id: string;
  label: string;
  icon: (props: { isActive: boolean; className?: string }) => JSX.Element;
  path: string;
  /** 하위 경로도 활성 상태로 처리할지 여부 */
  fuzzy?: boolean;
  /** 항상 활성 상태 색상을 사용할지 여부 (홈의 경우) */
  alwaysActive?: boolean;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: '홈',
    icon: HomeIcon,
    path: '/dashboard/user',
    fuzzy: false,
    alwaysActive: true,
  },
  { id: 'expert', label: '전문가 찾기', icon: SearchExpertIcon, path: '/experts', fuzzy: true },
  { id: 'estimate', label: '견적', icon: EstimateIcon, path: '/estimates', fuzzy: true },
  { id: 'chat', label: '채팅', icon: ChatIcon, path: '/chat', fuzzy: true },
  { id: 'mypage', label: '마이페이지', icon: MyPageIcon, path: '/mypage', fuzzy: true },
];

/**
 * @description 애플리케이션 하단 네비게이션 바 컴포넌트입니다.
 */
export function BottomNavigationBar(): JSX.Element {
  const matchRoute = useMatchRoute();

  const activeStates = useMemo(() => {
    return navItems.reduce(
      (acc, item) => {
        const isMatched = !!matchRoute({
          to: item.path,
          fuzzy: item.fuzzy ?? true,
        });

        acc[item.id] = item.alwaysActive || isMatched;
        return acc;
      },
      {} as Record<string, boolean>,
    );
  }, [matchRoute]);

  return (
    <nav className="pb-safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white">
      <div className="mx-auto flex h-[53px] max-w-screen-sm justify-around font-spoqa">
        {navItems.map((item) => {
          const isActive = activeStates[item.id];

          return (
            <Link
              to={item.path}
              key={item.id}
              className={`flex flex-1 flex-col items-center justify-center space-y-0.5 pt-1.5 pb-1 text-xs font-medium transition-colors hover:text-gray-600 focus:outline-none focus:text-gray-600 ${
                isActive ? 'text-gray-600' : 'text-gray-300'
              }`}
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
