import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';
import { KakaoTalkIcon } from '@/components/Icons';
import {
  AccountSwitchSection,
  type ActionButtonProps,
  AddressManagementSection,
  MyPageHeader,
  MyPageInfoSection,
  ReviewSection,
} from '@/components/MyPage';

export const Route = createFileRoute('/mypage')({
  component: MyPageScreen,
});

/**
 * @description 사용자 마이페이지 화면 컴포넌트입니다.
 * 이 화면은 사용자 정보, 설정 등을 표시합니다.
 */
function MyPageScreen(): JSX.Element {
  const userName = '이종현';
  const userEmail = 'lwhdgus924@naver.com';
  const usageCount = 0;
  const inquiryCount = 0;
  const latestNotice = '드론 방제 서비스 드로니 앱 신규 출시';

  const handleChatConsultClick = () => {};

  const handleFaqClick = () => {};

  const handleInquiryClick = () => {};

  const handleNoticeClick = () => {};

  const actionButtonsData: ActionButtonProps[] = [
    {
      icon: KakaoTalkIcon,
      label: '채팅 상담',
      onClick: handleChatConsultClick,
      ariaLabel: '카카오톡 채팅 상담 바로가기',
    },
    {
      icon: KakaoTalkIcon,
      label: 'FAQ',
      onClick: handleFaqClick,
      ariaLabel: '자주 묻는 질문(FAQ) 페이지로 이동',
    },
    {
      icon: KakaoTalkIcon,
      label: '1 : 1 문의',
      onClick: handleInquiryClick,
      ariaLabel: '1대1 문의 페이지로 이동',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-[calc(53px+env(safe-area-inset-bottom))]">
      <MyPageHeader />
      <MyPageInfoSection
        userName={userName}
        userEmail={userEmail}
        usageCount={usageCount}
        inquiryCount={inquiryCount}
        actionButtonsData={actionButtonsData}
        latestNotice={latestNotice}
        onNoticeClick={handleNoticeClick}
      />
      <AddressManagementSection />
      <ReviewSection />
      <AccountSwitchSection />
    </div>
  );
}
