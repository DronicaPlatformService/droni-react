import { StarIcon } from '@heroicons/react/24/solid';

interface RatingStarProps {
  rating: number; // 0~5 (소수점 허용)
  max?: number;
  className?: string;
}

export const RatingStar = ({ rating, max = 5, className = '' }: RatingStarProps) => {
  const percent = Math.max(0, Math.min(rating / max, 1)) * 100;

  return (
    <span className={`relative inline-block h-4 w-4 align-middle ${className}`}>
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
};
