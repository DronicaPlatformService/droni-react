'use client';

interface DroneContentItemProps {
  imageUrl: string;
  category: string;
  title: string;
}

export const DroneContentItem = ({ imageUrl, category, title }: DroneContentItemProps) => {
  return (
    <article className="flex-1 shrink basis-0">
      <div className="w-full">
        <img
          src={imageUrl}
          alt={title}
          className="object-contain rounded-lg aspect-[1.35] w-[162px]"
        />
        <div className="mt-2.5 w-full">
          <p className="text-system-10 tracking-tight-1pct text-gray-500">{category}</p>
          <h3 className="text-system-08 tracking-tight-1pct text-gray-600">{title}</h3>
        </div>
      </div>
    </article>
  );
};
