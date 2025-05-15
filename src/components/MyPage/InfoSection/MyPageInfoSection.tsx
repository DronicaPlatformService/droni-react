import type { JSX } from 'react';
import { ActionButton, type ActionButtonProps } from './ActionButton';
import { NoticeBar } from './NoticeBar';
import { ProfileCard } from './ProfileCard';

interface MyPageInfoSectionProps {
  userName: string;
  userEmail: string;
  usageCount: number;
  inquiryCount: number;
  actionButtonsData: ActionButtonProps[];
  latestNotice: string;
  onNoticeClick: () => void;
}

/**
 * @description 마이페이지의 프로필 정보, 액션 버튼, 공지사항을 표시하는 섹션 컴포넌트입니다.
 * @param {MyPageInfoSectionProps} props - 컴포넌트에 전달되는 속성들.
 */
export const MyPageInfoSection = ({
  userName,
  userEmail,
  usageCount,
  inquiryCount,
  actionButtonsData,
  latestNotice,
  onNoticeClick,
}: MyPageInfoSectionProps): JSX.Element => {
  return (
    <section className="flex flex-col bg-white px-3 pt-3 pb-[17px]">
      <ProfileCard
        userName={userName}
        userEmail={userEmail}
        usageCount={usageCount}
        inquiryCount={inquiryCount}
      />

      <div className="mb-[10px] flex w-full justify-between space-x-[9px]">
        {actionButtonsData.map((buttonInfo) => (
          <ActionButton
            key={buttonInfo.label}
            icon={buttonInfo.icon}
            label={buttonInfo.label}
            onClick={buttonInfo.onClick}
            ariaLabel={buttonInfo.ariaLabel}
          />
        ))}
      </div>

      <NoticeBar noticeText={latestNotice} onClick={onNoticeClick} />
    </section>
  );
};
