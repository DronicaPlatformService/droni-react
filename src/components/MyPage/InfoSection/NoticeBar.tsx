import { ChevronRightIcon } from '@heroicons/react/24/outline';
import type { JSX } from 'react';

interface NoticeBarProps {
  noticeText: string;
  onClick?: () => void;
}

/**
 * @description 공지사항을 표시하는 바 컴포넌트입니다.
 */
export const NoticeBar = ({ noticeText, onClick }: NoticeBarProps): JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`공지사항: ${noticeText}, 자세히 보기`}
    className="flex h-9 w-full items-center justify-between rounded-lg bg-gray-100 px-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-droni-blue-500/50"
  >
    <div className="flex items-center">
      <span className="font-spoqa text-system-09 tracking-tight-1pct text-gray-800">공지</span>
      <span className="ml-2 font-spoqa text-system-10 tracking-tight-1pct text-gray-800">
        {noticeText}
      </span>
    </div>
    <ChevronRightIcon className="h-4 w-4 text-gray-400" />
  </button>
);
