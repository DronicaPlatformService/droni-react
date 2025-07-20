import { createFileRoute, useRouter } from '@tanstack/react-router';
import { CommonHeader } from '@/components/MyPage';
import { NotificationSettingsSection, ServiceInfoSection } from '@/components/MyPage/Settings';
import { requireAuth } from '@/lib/authGuard';

export const Route = createFileRoute('/mypage/settings')({
  beforeLoad: requireAuth,
  component: SettingsScreen,
  context: (ctx) => ({ ...ctx.context, hideBottomNav: true }),
});

/**
 * @description 애플리케이션 설정 화면입니다.
 * 알림 설정 및 서비스 정보를 포함합니다.
 */
function SettingsScreen() {
  const router = useRouter();

  const handleGoBack = () => {
    router.history.back();
  };

  return (
    <div>
      <main className="min-h-screen flex-1 bg-gray-100">
        <CommonHeader pageTitle="설정" onBack={handleGoBack} />

        <NotificationSettingsSection />

        <ServiceInfoSection className="mt-2.5" />
      </main>
    </div>
  );
}
