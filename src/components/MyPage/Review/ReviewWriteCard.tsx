import { ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid';
import { useRouter } from '@tanstack/react-router';

export interface ReviewWriteCardProps {
  id: string;
  name: string;
  region: string;
  rating: number;
  type: string;
  reviewCount: number;
  reviewPeriod?: number;
  completedAt?: string; // ISO 8601 형식(예: "2025-07-04T12:34:56Z")
  imageUrl?: string;
  /** 리뷰 작성 버튼/기간 영역 노출 여부 (기본값: true) */
  showWriteAction?: boolean;
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

export function ReviewWriteCard({
  id,
  name,
  region,
  rating,
  type,
  reviewCount,
  reviewPeriod,
  completedAt,
  imageUrl,
  showWriteAction = true,
}: ReviewWriteCardProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      {completedAt && (
        <div className="mb-2 ml-2 text-gray-800 text-system-07 tracking-[-0.14px]">
          {new Date(completedAt)
            .toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
            .replace(/\.\s/g, '.')
            .replace(/\.$/, '')}{' '}
          방제 완료
        </div>
      )}

      {/* card */}
      <div className="flex flex-shrink-0 flex-col gap-3 rounded-lg border-gray-200 bg-white p-4">
        <div className="flex items-center">
          {/* profile image */}
          <div
            className=" h-10.5 w-10.5 rounded-full border-gray-200"
            style={{
              background: `url(${imageUrl}) lightgray 50% / cover no-repeat`,
            }}
          />

          <div className="ml-2.5 flex w-full flex-1 gap-1">
            <div className="flex flex-1 flex-col justify-between">
              {/* name */}
              <div className="text-gray-800">
                <span className="text-system-07 tracking-[-0.14px]">{name}</span>{' '}
                <span className="text-system-08 tracking-[-0.14px]">({region})</span>
              </div>

              {/* type */}
              {type && (
                <div className="text-gray-600 text-system-09 tracking-[-0.12px]">{type}</div>
              )}
            </div>

            <div className="flex flex-col items-end justify-between">
              {/* rating */}
              <div className="flex items-center gap-1">
                <RatingStar rating={rating} />
                <span className="text-gray-600 text-system-09 tracking-[-0.12px]">
                  {rating.toFixed(1)}
                </span>
              </div>

              {/* review */}
              <div className="flex justify-between">
                <div className="text-gray-600 text-system-10 tracking-[-0.12px]">
                  방제 후기 {reviewCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* divider 및 리뷰 작성 영역 조건부 렌더링 */}
        {showWriteAction && (
          <>
            {/* divider */}
            <div className="h-px w-full bg-gray-200" />

            {/* review period */}
            <div className="text-gray-800 text-system-10 tracking-[-0.12px]">
              리뷰 작성 기간이 <span className="text-system-09">{reviewPeriod}</span>일 남았어요
            </div>

            {/* button */}
            <button
              aria-label={`${name} 리뷰 작성 페이지로 이동`}
              className="flex h-8.5 w-full flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 p-3"
              onClick={() => router.navigate({ to: `/mypage/review-write-list/${id}` })}
              type="button"
            >
              <span className="mr-1 text-gray-900 text-system-09 tracking-[-0.12px]">
                리뷰 작성
              </span>
              <ChevronRightIcon className="h-3 w-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
