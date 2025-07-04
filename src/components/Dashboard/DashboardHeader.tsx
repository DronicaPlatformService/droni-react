'use client';

import type { JSX } from 'react';
import { NotificationIcon } from '@/components/Icons';

interface DashboardHeaderProps {
  userName: string;
  hasUnreadNotification?: boolean;
}

/**
 * @description 애플리케이션 헤더 컴포넌트. 사용자 이름과 알림 아이콘을 표시합니다.
 * @param {DashboardHeaderProps} props - 애플리케이션 헤더의 속성 객체입니다.
 * @param {string} props.userName - 표시될 사용자 이름.
 * @param {boolean} [props.hasUnreadNotification=false] - 읽지 않은 알림 유무.
 */
export function DashboardHeader({
  userName,
  hasUnreadNotification = false,
}: DashboardHeaderProps): JSX.Element {
  return (
    <header className="flex h-[52px] items-center justify-between px-5 py-3">
      <p className="font-spoqa text-gray-800 text-system-01 tracking-tight-1pct">
        {userName} 이용자님
      </p>
      <button type="button" aria-label="알림" className="rounded p-1">
        <NotificationIcon hasUnread={hasUnreadNotification} className="h-4.5 w-4.5" />
      </button>
    </header>
  );
}
