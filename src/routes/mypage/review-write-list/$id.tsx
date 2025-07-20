import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { createFileRoute, useParams, useRouter } from '@tanstack/react-router';
import type { JSX } from 'react';
import { requireAuth } from '@/lib/authGuard';

export const Route = createFileRoute('/mypage/review-write-list/$id')({
  beforeLoad: requireAuth,
  component: ReviewWritePage,
  context: (ctx) => ({ ...ctx.context, hideBottomNav: true }),
});

function ReviewWritePage(): JSX.Element {
  const router = useRouter();
  const { id } = useParams({ from: '/mypage/review-write-list/$id', strict: true });

  const handleGoBack = () => {
    router.history.back();
  };

  // TODO: id로 리뷰 대상 데이터 fetch (TanStack Query 사용 권장)
  // const { data, isLoading, error } = useQuery(...);

  return (
    <section className="flex min-h-screen flex-col bg-gray-100 pb-[calc(53px+env(safe-area-inset-bottom))]">
      {/* header */}
      <div className="flex h-13 flex-shrink-0 items-center px-4">
        <button type="button" aria-label="이전 페이지로" onClick={handleGoBack} className="mr-1">
          <ChevronLeftIcon className="h-6 w-6 flex-shrink-0 text-gray-800" />
        </button>
        <span className="text-gray-900 text-system-03 tracking-[-0.18px]">리뷰 작성</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
        <div className="mb-6 font-semibold text-gray-800 text-system-06">
          리뷰 작성 폼 (ID: {id})
        </div>
        {/* TODO: TanStack Form + Zod로 리뷰 작성 폼 구현 */}
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-500">여기에 리뷰 작성 폼이 들어갑니다.</p>
        </div>
      </div>
    </section>
  );
}
