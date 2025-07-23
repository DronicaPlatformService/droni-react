import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface CommonHeaderProps {
  pageTitle?: string;
  onBack: () => void;
  bgColorClassName?: string;
}

export const CommonHeader = ({
  pageTitle,
  onBack,
  bgColorClassName = 'bg-white',
}: CommonHeaderProps) => {
  return (
    <header className={clsx('flex h-13 w-full items-center gap-0.5 px-5', bgColorClassName)}>
      <button
        aria-label="뒤로 가기"
        className="-ml-1 flex-shrink-0 p-1"
        onClick={onBack}
        type="button"
      >
        <ChevronLeftIcon className="h-5 w-5 text-gray-800" />
      </button>

      <span className="text-gray-800 text-system-03 tracking-[-0.18px]">{pageTitle}</span>
    </header>
  );
};
