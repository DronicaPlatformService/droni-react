import type { ReactNode } from 'react';

export const CommonBottomButtonWrapper = ({ children }: { children: ReactNode }) => (
  <div className="sticky right-0 bottom-0 left-0 z-10 bg-gray-100 px-3 pb-[calc(16px+env(safe-area-inset-bottom))]">
    {children}
  </div>
);
