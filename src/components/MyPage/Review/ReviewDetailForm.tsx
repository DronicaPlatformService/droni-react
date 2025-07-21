import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { ReviewCard } from './ReviewCard';

export const ReviewDetailForm = () => {
  const [rating, setRating] = useState<number>(0);

  return (
    <>
      {/* contents */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
        <ReviewCard
          id={''}
          mode={'edit'}
          name={'김철수'}
          rating={5}
          region={'충남 서산면'}
          reviewCount={2}
          type={'인기 조종사'}
        />

        <div className="mt-5 flex flex-col items-center">
          <span className="text-gray-800 text-system-01 tracking-[-0.2px]">
            서비스는 만족하셨나요?
          </span>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                aria-label={`${star}점`}
                className="focus:outline-none"
                key={star}
                onClick={() => setRating(star)}
                type="button"
              >
                <svg
                  className="h-[36px] w-[36px]"
                  fill={star <= rating ? '#FFCE51' : 'none'}
                  stroke="#FFCE51"
                  strokeWidth={1.5}
                  viewBox="0 0 36 36"
                >
                  <title>{`${star}점 별점`}</title>
                  <path
                    d="M16.9238 5.19163C17.364 4.29973 18.6358 4.29973 19.0759 5.19163L22.5069 12.1435C22.6817 12.4977 23.0196 12.7432 23.4104 12.8L31.0823 13.9148C32.0666 14.0578 32.4596 15.2673 31.7474 15.9616L26.1959 21.3729C25.9131 21.6486 25.7841 22.0458 25.8508 22.435L27.1613 30.0759C27.3295 31.0562 26.3006 31.8037 25.4202 31.3409L18.5583 27.7334C18.2087 27.5496 17.791 27.5496 17.4415 27.7334L10.5795 31.3409C9.69917 31.8037 8.67026 31.0562 8.83839 30.0759L10.1489 22.435C10.2157 22.0458 10.0866 21.6486 9.80378 21.3729L4.25237 15.9616C3.54015 15.2673 3.93316 14.0578 4.91743 13.9148L12.5893 12.8C12.9801 12.7432 13.318 12.4977 13.4928 12.1435L16.9238 5.19163Z"
                    fill={star <= rating ? '#FFCE51' : 'none'}
                    stroke="#FFCE51"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7.5 flex flex-col tracking-[-0.14px]">
          <span className="pl-2 text-gray-800 text-system-07">리뷰 작성 (선택)</span>
          <textarea
            className="mt-2 flex-shrink-0 rounded-lg border border-droni-blue-300 bg-white p-4 placeholder:text-gray-400 placeholder:text-system-08"
            placeholder="받아보신 서비스의 만족도에 대한 후기를 남겨주세요."
            rows={4}
          />
          <div className="mt-2 mr-2 flex justify-end text-gray-400">
            <span className="text-system-08">0 / 200</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <div className="flex items-center justify-center rounded-lg border border-gray-300 border-dashed p-3">
            <span className="text-gray-900 text-system-07 tracking-[-0.14px]">사진 첨부하기</span>
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </div>
          <div className="mt-2.5 flex justify-between gap-2 sm:justify-start">
            {[1, 2, 3].map((index) => (
              <div
                className="relative h-[110px] w-[110px] flex-shrink-0 rounded-lg border-gray-200 bg-gray-200 sm:h-[140px] sm:w-[140px]"
                key={index}
              >
                <button
                  aria-label="사진 삭제"
                  className="-top-1 -right-1 absolute z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/80"
                  type="button"
                >
                  <svg
                    fill="none"
                    height="16"
                    viewBox="0 0 16 16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>사진 삭제 아이콘</title>
                    <path
                      d="M12.1997 3.80664C12.0752 3.6818 11.9061 3.61165 11.7297 3.61165C11.5534 3.61165 11.3843 3.6818 11.2597 3.80664L7.99974 7.05997L4.73974 3.79997C4.61518 3.67514 4.44608 3.60498 4.26974 3.60498C4.09339 3.60498 3.92429 3.67514 3.79974 3.79997C3.53974 4.05997 3.53974 4.47997 3.79974 4.73997L7.05974 7.99997L3.79974 11.26C3.53974 11.52 3.53974 11.94 3.79974 12.2C4.05974 12.46 4.47974 12.46 4.73974 12.2L7.99974 8.93997L11.2597 12.2C11.5197 12.46 11.9397 12.46 12.1997 12.2C12.4597 11.94 12.4597 11.52 12.1997 11.26L8.93974 7.99997L12.1997 4.73997C12.4531 4.48664 12.4531 4.05997 12.1997 3.80664Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
