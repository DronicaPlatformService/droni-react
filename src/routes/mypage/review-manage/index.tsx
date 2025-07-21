import { createFileRoute, useRouter } from '@tanstack/react-router';
import { CommonHeader } from '@/components/MyPage';
import { ReviewCard } from '@/components/MyPage/Review/ReviewCard';
import { requireAuth } from '@/lib/authGuard';

export const Route = createFileRoute('/mypage/review-manage/')({
  beforeLoad: requireAuth,
  component: RouteComponent,
  context: (ctx) => ({ ...ctx.context, hideBottomNav: true }),
});

function RouteComponent() {
  const router = useRouter();

  const handleGoBack = () => {
    router.history.back();
  };

  return (
    <section className="flex min-h-screen flex-col bg-gray-100 px-3 pb-[env(safe-area-inset-bottom)]">
      <CommonHeader bgColorClassName="bg-gray-100" onBack={handleGoBack} />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex justify-start">
          <span className="mx-3 mt-3 text-left text-gray-800 text-system-01 tracking-[-0.2px]">
            작성한 리뷰 <span className="text-droni-blue-500">2개</span>에 대해서
            <br />
            관리하실 수 있어요
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-7.5">
          <ReviewCard
            completedAt={'2024-04-26'}
            id={'1'}
            mode={'manage-list'}
            name={'김철수'}
            rating={5}
            region={'충남 서산면'}
            reviewContent={'엄청 친절하게 해주셨어요~ 만족합니다.'}
            reviewCount={2}
            type={'인기 조종사'}
          />
          <ReviewCard
            completedAt={'2024-04-19'}
            id={'2'}
            mode={'manage-list'}
            name={'홍길동'}
            rating={0}
            region={'충남 예산군'}
            reviewContent={'별로에요 ㅡㅡ'}
            reviewCount={0}
          />
        </div>
      </div>
    </section>
  );
}
