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
          className="aspect-[1.35] w-[162px] rounded-lg object-contain"
        />
        <div className="mt-2.5 w-full">
          <p className="text-gray-500 text-system-10 tracking-tight-1pct">{category}</p>
          <h3 className="text-gray-600 text-system-08 tracking-tight-1pct">{title}</h3>
        </div>
      </div>
    </article>
  );
};
