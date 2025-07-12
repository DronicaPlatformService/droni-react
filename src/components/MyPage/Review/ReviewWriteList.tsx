'use client';

import { ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid';

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

interface RatingStarProps {
  rating: number; // 0~5 (소수점 허용)
  max?: number;
}

function RatingStar({ rating, max = 5 }: RatingStarProps) {
  const percent = Math.max(0, Math.min(rating / max, 1)) * 100;
  return (
    <span className="relative inline-block h-4 w-4 align-middle">
      {/* 회색 별 */}
      <StarIcon className="absolute top-0 left-0 h-4 w-4 text-gray-300" />
      {/* 노란색 별 (채워지는 부분만 보이게) */}
      <StarIcon
        className="absolute top-0 left-0 h-4 w-4 text-[#FFCE51]"
        style={{
          clipPath: `inset(0 ${100 - percent}% 0 0)`,
        }}
      />
    </span>
  );
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
          items.map((item) => (
            <div key={item.id} className="flex flex-col">
              <div className="mb-2 ml-2 text-gray-800 text-system-07 tracking-[-0.14px]">
                {new Date(item.completedAt)
                  .toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .replace(/\.\s/g, '.')
                  .replace(/\.$/, '')}{' '}
                방제 완료
              </div>

              <div className="flex flex-shrink-0 flex-col gap-3 rounded-lg border-gray-200 bg-white p-4">
                <div className="flex items-center">
                  <div
                    className=" h-10.5 w-10.5 rounded-full border-gray-200"
                    style={{
                      background: `url(${item.imageUrl}) lightgray 50% / cover no-repeat`,
                    }}
                  />

                  <div className="ml-2.5 flex w-full flex-1 gap-1">
                    <div className="flex flex-1 flex-col justify-between">
                      {/* naem */}
                      <div className="text-gray-800">
                        <span className="text-system-07 tracking-[-0.14px]">{item.name}</span>{' '}
                        <span className="text-system-08 tracking-[-0.14px]">({item.region})</span>
                      </div>

                      {/* type */}
                      {item.type && (
                        <div className="text-gray-600 text-system-09 tracking-[-0.12px]">
                          {item.type}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      {/* rating */}
                      <div className="flex items-center gap-1">
                        <RatingStar rating={item.rating} />
                        <span className="text-gray-600 text-system-09 tracking-[-0.12px]">
                          {item.rating.toFixed(1)}
                        </span>
                      </div>

                      {/* review */}
                      <div className="flex justify-between">
                        <div className="text-gray-600 text-system-10 tracking-[-0.12px]">
                          방제 후기 {item.reviewCount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* divider */}
                <div className="h-px w-full bg-gray-200" />

                {/* review period */}
                <div className="text-gray-800 text-system-10 tracking-[-0.12px]">
                  리뷰 작성 기간이 <span className="text-system-09">{item.reviewPeriod}</span>일
                  남았어요
                </div>

                {/* button */}
                <div className="flex h-8.5 w-full flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 p-3">
                  <span className="mr-1 text-gray-900 text-system-09 tracking-[-0.12px]">
                    리뷰 작성
                  </span>
                  <ChevronRightIcon className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
