'use client';

import { ReviewCard } from './ReviewCard';

export interface ReviewWriteListItem {
  id: string;
  name: string;
  region: string;
  rating: number;
  type: string;
  reviewCount: number;
  reviewPeriod: number;
  completedAt: string; // ISO 8601 형식(예: "2025-07-04T12:34:56Z")
  imageUrl?: string;
}

interface ReviewWriteListProps {
  items: ReviewWriteListItem[];
}

export function ReviewWriteList({ items }: ReviewWriteListProps) {
  return (
    <div className="px-3">
      <div className="mb-5 ml-5">
        <span className="text-gray-800 text-system-01 tracking-[-0.2px]">
          완료된 방제 내역 <span className="text-droni-blue-500">{items.length}개</span>에 대해서
          <br />
          리뷰를 작성하실 수 있어요
        </span>
      </div>

      <div className="flex flex-col gap-7.5">
        {items.length === 0 ? (
          <div className="py-8 text-center text-gray-500">작성 가능한 리뷰가 없습니다.</div>
        ) : (
          items.map((item) => <ReviewCard key={item.id} mode={'write-list'} {...item} />)
        )}
      </div>
    </div>
  );
}
