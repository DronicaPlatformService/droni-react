import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { NotificationSettingsSection, ServiceInfoSection } from '@/components/Settings';
import { requireAuth } from '@/lib/authGuard';

export const Route = createFileRoute('/mypage/settings')({
  beforeLoad: requireAuth,
  component: SettingsScreen,
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
        <header className="flex items-center bg-white px-5 py-5">
          <button type="button" onClick={handleGoBack} aria-label="뒤로 가기" className="-ml-1 p-1">
            <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
          </button>
          <span className="ml-1 text-system-03 tracking-tight-1pct text-gray-800">설정</span>
        </header>

        <NotificationSettingsSection />

        <ServiceInfoSection className="mt-2.5" />
      </main>
    </div>
  );
}
