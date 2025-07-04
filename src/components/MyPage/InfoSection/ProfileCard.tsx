'use client';

import type { JSX } from 'react';
import { DefaultProfileIcon, EmailIcon } from '@/components/Icons';

interface ProfileCardProps {
  userName: string;
  userEmail: string;
  usageCount: number;
  inquiryCount: number;
}

/**
 * @description 사용자 프로필 정보를 표시하는 카드 컴포넌트입니다.
 */
export const ProfileCard = ({
  userName,
  userEmail,
  usageCount,
  inquiryCount,
}: ProfileCardProps): JSX.Element => (
  <article className="mb-[10px] h-[136px] w-full rounded-lg bg-gray-600 p-4 text-white">
    <div className="flex items-center">
      <DefaultProfileIcon className="h-[42px] w-[42px] rounded-full" />
      <div className="ml-[10px]">
        <h3 className="font-spoqa text-system-07 text-white tracking-tight-1pct">
          {userName} 이용자님
        </h3>
        <div className="mt-1 flex items-center">
          <div className="mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-800">
            <EmailIcon className="h-[14px] w-[14px]" />
          </div>
          <p className="font-spoqa text-gray-300 text-system-10 tracking-tight-1pct">{userEmail}</p>
        </div>
      </div>
    </div>
    <div className="mt-5 flex items-center justify-around">
      <dl className="text-center">
        <dt className="mb-1 font-spoqa text-system-09 text-white tracking-tight-1pct">방제 이용</dt>
        <dd className="font-spoqa text-system-07 text-white tracking-tight-1pct">
          {usageCount} 회
        </dd>
      </dl>
      <div className="h-7.5 w-px bg-white" aria-hidden="true" />
      <dl className="text-center">
        <dt className="mb-1 font-spoqa text-system-09 text-white tracking-tight-1pct">협의 중</dt>
        <dd className="font-spoqa text-system-07 text-white tracking-tight-1pct">
          {inquiryCount} 건
        </dd>
      </dl>
    </div>
  </article>
);
