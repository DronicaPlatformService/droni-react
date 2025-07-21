'use client';

interface AddressInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  onClick?: () => void;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  type?: string;
  ariaLabel?: string;
}

export function AddressInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  readOnly = false,
  onClick,
  iconRight,
  iconLeft,
  type = 'text',
  ariaLabel,
}: AddressInputProps) {
  return (
    <div className="space-y-2">
      <label className="ml-2 block text-gray-700 text-system-07 tracking-[-0.14px]" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        {iconLeft && (
          <span className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 flex h-6 w-6 items-center justify-center text-gray-400">
            {iconLeft}
          </span>
        )}
        <input
          aria-label={ariaLabel || label}
          className={`block w-full flex-shrink-0 rounded-lg border-gray-200 bg-white py-5 text-system-08 ${
            iconLeft ? 'pl-10' : 'pl-3'
          } ${iconRight ? 'pr-10' : 'pr-3'} ${onClick ? 'cursor-pointer' : ''}`}
          id={id}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          onClick={onClick}
          placeholder={placeholder}
          readOnly={readOnly}
          tabIndex={onClick ? 0 : undefined}
          type={type}
          value={value}
        />
        {iconRight && (
          <span className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 text-gray-800">
            {iconRight}
          </span>
        )}
      </div>
    </div>
  );
}
