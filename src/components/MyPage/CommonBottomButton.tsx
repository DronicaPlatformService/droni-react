'use client';

interface CommonBottomButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export const CommonBottomButton = ({ text, onClick, disabled }: CommonBottomButtonProps) => {
  return (
    <button
      aria-disabled={disabled}
      className="flex h-13 w-full items-center justify-center rounded-lg bg-droni-blue-500 disabled:bg-gray-300"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className="text-center font-bold font-spoqa text-base text-white leading-normal">
        {text}
      </span>
    </button>
  );
};
