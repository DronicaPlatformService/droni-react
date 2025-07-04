'use client';

import type { ComponentType, JSX } from 'react';

export interface ActionButtonProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  ariaLabel: string;
}

/**
 * @description 아이콘과 텍스트 라벨을 포함하는 액션 버튼 컴포넌트입니다.
 */
export const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  ariaLabel,
}: ActionButtonProps): JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className="flex h-[80px] w-[111px] flex-col items-center justify-center rounded-lg bg-gray-100 p-2 text-center hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-droni-blue-500/50"
  >
    <Icon className="mb-1 h-8 w-8" />
    <span className="font-spoqa text-gray-800 text-system-07 tracking-tight-1pct">{label}</span>
  </button>
);
