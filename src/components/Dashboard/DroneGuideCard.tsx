'use client';

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { DroneContentItem } from './DroneContentItem';

interface DroneContent {
  id: string;
  imageUrl: string;
  category: string;
  title: string;
}

export const DroneGuideCard = () => {
  const droneContents: DroneContent[] = [
    {
      id: 'guide-1',
      imageUrl: '/samples/c5029c3105bd909fc3b1e1c1bac7512962540f57.png',
      category: '일반사용자',
      title: '드론콘텐츠 제목은 2줄까지 노출합니다!',
    },
    {
      id: 'guide-2',
      imageUrl: '/samples/15070dcccecd1c9ea9242f9319cc8ee812521431.png',
      category: '조종사',
      title: '드론콘텐츠 제목은 2줄까지 노출합니다!',
    },
  ];

  return (
    <section className="px-5 py-6">
      <div className="w-full">
        <h2 className="text-system-03 tracking-tight-1pct text-gray-800">드로니 활용백서</h2>
        <div className="mt-3 flex w-full items-start gap-3">
          {droneContents.map((content) => (
            <DroneContentItem
              key={content.id}
              imageUrl={content.imageUrl}
              category={content.category}
              title={content.title}
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="mt-5 flex w-full items-center justify-center rounded-lg border border-solid border-gray-300 p-3 text-system-07 tracking-tight-1pct"
      >
        <span className="my-auto self-stretch text-gray-900">더보러 가기</span>
        <ChevronRightIcon className="my-auto ml-1 aspect-square h-4 w-4 shrink-0 self-stretch" />
      </button>
    </section>
  );
};
