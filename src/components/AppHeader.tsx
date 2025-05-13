'use client';

import { NotificationIcon } from '@/components/icons/NotificationIcon';
import type { JSX } from 'react';

interface AppHeaderProps {
  userName: string;
  hasUnreadNotification?: boolean;
}

/**
 * @description 애플리케이션 헤더 컴포넌트. 사용자 이름과 알림 아이콘을 표시합니다.
 * @param {AppHeaderProps} props - 애플리케이션 헤더의 속성 객체입니다.
 * @param {string} props.userName - 표시될 사용자 이름.
 * @param {boolean} [props.hasUnreadNotification=false] - 읽지 않은 알림 유무.
 */
export function AppHeader({
  userName,
  hasUnreadNotification = false,
}: AppHeaderProps): JSX.Element {
  return (
    <header className="flex h-[52px] items-center justify-between px-5 py-3">
      <p className="font-spoqa text-system-01 tracking-tight-1pct text-gray-800">
        {userName} 이용자님
      </p>
      <button
        type="button"
        aria-label="알림"
        className="rounded p-1 text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-droni-blue-500/50 focus:outline-none"
      >
        <NotificationIcon hasUnread={hasUnreadNotification} className="h-4.5 w-4.5" />
      </button>
    </header>
  );
}
