'use client';

import { useRouter } from '@tanstack/react-router';
import type { JSX, ReactNode } from 'react';
import { CommonBottomButton } from '../CommonBottomButton';
import { CommonHeader } from '../CommonHeader';

interface AddressLayoutProps {
  pageTitle?: string;
  children: ReactNode;
  buttonText: string;
  onButtonClick: () => void;
  isButtonDisabled?: boolean;
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
    <div className="flex h-screen w-full flex-col bg-gray-100 pb-[calc(1rem+var(--safe-area-inset-bottom))]">
      <CommonHeader bgColorClassName="bg-gray-100" onBack={handleGoBack} pageTitle={pageTitle} />

      <main className="flex-1 overflow-y-auto">{children}</main>

      <CommonBottomButton disabled={isButtonDisabled} onClick={onButtonClick} text={buttonText} />
    </div>
  );
};
