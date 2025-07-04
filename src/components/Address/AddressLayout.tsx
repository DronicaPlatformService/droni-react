'use client';

import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from '@tanstack/react-router';
import type { JSX, ReactNode } from 'react';

interface AddressLayoutProps {
  pageTitle?: string;
  children: ReactNode;
  buttonText: string;
  onButtonClick: () => void;
  isButtonDisabled?: boolean;
}

function Header({ pageTitle, onBack }: { pageTitle?: string; onBack: () => void }): JSX.Element {
  return (
    <header className="flex min-h-13 flex-shrink-0 items-center px-5">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로 가기"
        className="-ml-1 flex-shrink-0 p-1"
      >
        <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
      </button>
      <h1 className="inline-block text-gray-800 text-system-03 tracking-[-0.18px]">{pageTitle}</h1>
    </header>
  );
}

function BottomButton({
  text,
  onClick,
  disabled,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}): JSX.Element {
  return (
    <div className="w-full flex-shrink-0 px-3 pt-4 pb-[calc(1rem+var(--safe-area-inset-bottom))] shadow-up">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-disabled={disabled}
        className="h-[54px] w-full rounded-lg bg-droni-blue-500 font-bold text-base text-white disabled:bg-gray-300"
      >
        {text}
      </button>
    </div>
  );
}

export const AddressLayout = ({
  pageTitle,
  children,
  buttonText,
  onButtonClick,
  isButtonDisabled,
}: AddressLayoutProps): JSX.Element => {
  const router = useRouter();

  const handleGoBack = () => {
    router.history.back();
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <Header pageTitle={pageTitle} onBack={handleGoBack} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <BottomButton text={buttonText} onClick={onButtonClick} disabled={isButtonDisabled} />
    </div>
  );
};
