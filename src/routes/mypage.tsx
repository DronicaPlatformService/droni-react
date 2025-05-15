import { BottomNavigationBar } from '@/components';
import { KakaoTalkIcon } from '@/components/Icons';
import {
  type ActionButtonProps,
  AddressManagementSection,
  MyPageHeader,
  MyPageInfoSection,
  ReviewSection,
} from '@/components/MyPage';
import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';

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

  const handleChatConsultClick = () => {
    // TODO: 채팅 상담 로직 구현
    console.log('채팅 상담 클릭');
  };

  const handleFaqClick = () => {
    // TODO: FAQ 페이지 라우팅
    console.log('FAQ 클릭');
  };

  const handleInquiryClick = () => {
    // TODO: 1:1 문의 페이지 라우팅
    console.log('1:1 문의 클릭');
  };

  const handleNoticeClick = () => {
    // TODO: 공지사항 상세 페이지 라우팅
    console.log('공지사항 클릭');
  };

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
    <div className="flex h-screen flex-col">
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
      <BottomNavigationBar />
    </div>
  );
}
