'use client';

interface CommonBottomButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export const CommonBottomButton = ({ text, onClick, disabled }: CommonBottomButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className="mx-3 flex h-13 items-center justify-center rounded-lg bg-droni-blue-500 disabled:bg-gray-300"
    >
      <span className="text-center font-bold font-spoqa text-base text-white leading-normal">
        {text}
      </span>
    </button>
  );
};
