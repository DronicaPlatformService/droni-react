'use client';

import { ChevronRightIcon } from '../Icons';

const contents = [
  {
    id: 1,
    imageurl: `${import.meta.env.BASE_URL}samples/c5029c3105bd909fc3b1e1c1bac7512962540f57.png`,
    title: '드론콘텐츠 제목은 2줄까지 노출합니다!',
  },
  {
    id: 2,
    imageurl: `${import.meta.env.BASE_URL}samples/15070dcccecd1c9ea9242f9319cc8ee812521431.png`,
    title: '드론콘텐츠 제목은 2줄까지 노출합니다!',
  },
  {
    id: 3,
    imageurl: `${import.meta.env.BASE_URL}samples/c5029c3105bd909fc3b1e1c1bac7512962540f57.png`,
    title: '드론콘텐츠 제목은 2줄까지 노출합니다!',
  },
];

export const DroneContentsSection = () => {
  return (
    <section className="flex flex-col items-start gap-3 px-5 py-6">
      <div className="flex w-full justify-around">
        <h2 className="flex-1 flex-shrink-0 basis-0 text-gray-800 text-system-03 tracking-[-0.18px]">
          드론관련 콘텐츠
        </h2>
        <ChevronRightIcon color="#6D7183" size={26} />
      </div>

      <div className="no-scrollbar flex w-full items-start gap-2 overflow-x-auto">
        {contents.map((content) => (
          <div className="flex w-[132px] flex-shrink-0 flex-col gap-3" key={content.id}>
            <img
              alt={content.title}
              className="h-[132px] w-[132px] rounded-lg object-cover"
              loading="lazy"
              src={content.imageurl}
            />
            <p className="line-clamp-2 text-gray-600 text-system-08 tracking-[-0.14px]">
              {content.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
