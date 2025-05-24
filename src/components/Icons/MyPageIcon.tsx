import type { JSX, SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  isActive?: boolean;
}

export function MyPageIcon({ isActive, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-labelledby="myPageIconTitle"
      {...props}
    >
      <title id="myPageIconTitle">My Page</title>
      <ellipse
        cx="7.81978"
        cy="4.15234"
        rx="3.55175"
        ry="3.55175"
        fill={isActive ? 'var(--color-gray-600)' : 'var(--color-gray-300)'}
      />
      <path
        d="M14.4956 15.6035C15.0479 15.6035 15.5023 15.1539 15.4305 14.6063C15.3434 13.9411 15.1692 13.2886 14.9113 12.6661C14.5255 11.7348 13.9602 10.8887 13.2474 10.1759C12.5346 9.46315 11.6885 8.89776 10.7572 8.51202C9.82593 8.12627 8.82781 7.92773 7.81981 7.92773C6.81181 7.92773 5.81369 8.12627 4.88242 8.51202C3.95115 8.89776 3.10498 9.46315 2.39222 10.1759C1.67946 10.8887 1.11407 11.7348 0.728326 12.6661C0.470464 13.2886 0.296257 13.9411 0.209092 14.6063C0.137342 15.1539 0.591758 15.6035 1.14404 15.6035L7.81981 15.6035H14.4956Z"
        fill={isActive ? 'var(--color-gray-600)' : 'var(--color-gray-300)'}
      />
    </svg>
  );
}
