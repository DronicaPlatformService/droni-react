import { createFileRoute, useRouter } from '@tanstack/react-router';
import { CommonBottomButton, CommonBottomButtonWrapper, CommonHeader } from '@/components/MyPage';
import { ReviewDetailForm } from '@/components/MyPage/Review/ReviewDetailForm';
import { requireAuth } from '@/lib/authGuard';

export const Route = createFileRoute('/mypage/review-manage/$id')({
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
    <section className="flex min-h-screen flex-col bg-gray-100 pb-[env(safe-area-inset-bottom)]">
      <CommonHeader bgColorClassName="bg-gray-100" onBack={handleGoBack} pageTitle="리뷰 관리" />

      <ReviewDetailForm />

      <CommonBottomButtonWrapper>
        <CommonBottomButton
          onClick={(): void => {
            throw new Error('Function not implemented.');
          }}
          text={'리뷰 등록'}
        />
      </CommonBottomButtonWrapper>
    </section>
  );
}
