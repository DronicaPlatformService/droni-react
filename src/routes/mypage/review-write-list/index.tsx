import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { createFileRoute } from '@tanstack/react-router';
import type { JSX } from 'react';
import { requireAuth } from '@/lib/authGuard';
import {
  ReviewWriteList,
  type ReviewWriteListItem,
} from '../../../components/MyPage/Review/ReviewWriteList';

// 예시 더미 데이터 (서버에서 내려오는 형태와 동일하게 작성)
export const reviewWriteListDummy: ReviewWriteListItem[] = [
  {
    id: '1',
    name: '김철수',
    region: '충남 서산면',
    rating: 5.0,
    type: '인기 조종사',
    reviewCount: 2,
    reviewPeriod: 14,
    completedAt: '2024-04-26T10:00:00Z',
  },
  {
    id: '2',
    name: '홍길동',
    region: '충남 예산군',
    rating: 0.0,
    type: '',
    reviewCount: 0,
    reviewPeriod: 7,
    completedAt: '2024-04-19T15:30:00Z',
  },
];

export const Route = createFileRoute('/mypage/review-write-list/')({
  beforeLoad: requireAuth,
  component: ReviewWriteListPage,
  context: (ctx) => ({ ...ctx.context, hideBottomNav: true }),
});

function ReviewWriteListPage(): JSX.Element {
  // TODO: 서버에서 데이터 fetch
  return (
    <section className="flex min-h-screen flex-col bg-gray-100 pb-[calc(53px+env(safe-area-inset-bottom))]">
      <div className="flex h-13 flex-shrink-0 items-center gap-0.5 px-5">
        <ChevronLeftIcon className="h-6 w-6 flex-shrink-0 text-gray-800" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ReviewWriteList items={reviewWriteListDummy} />
      </div>
    </section>
  );
}
