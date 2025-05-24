import type { JSX, SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  isActive?: boolean;
}

export function HomeIcon({ isActive, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-labelledby="homeIconTitle"
      {...props}
    >
      <title id="homeIconTitle">Home</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.1593 2.66167C10.5385 2.34056 11.094 2.34454 11.4677 2.67193C12.7579 3.80213 15.7155 6.37263 17.9411 8.15343C18.1802 8.34475 18.3198 8.63299 18.3198 8.93923V16.4793C18.3198 17.0316 17.872 17.4793 17.3198 17.4793H13.7419C13.1896 17.4793 12.7419 17.0316 12.7419 16.4793V13.0974C12.7419 12.5451 12.2942 12.0974 11.7419 12.0974H9.89764C9.34535 12.0974 8.89764 12.5451 8.89764 13.0974V16.4793C8.89764 17.0316 8.44992 17.4793 7.89764 17.4793H4.31976C3.76748 17.4793 3.31976 17.0316 3.31976 16.4793V8.91781C3.31976 8.62382 3.44913 8.34472 3.67348 8.15472L10.1593 2.66167Z"
        fill={isActive ? 'var(--color-gray-600)' : 'var(--color-gray-300)'}
      />
    </svg>
  );
}
