import type { JSX, SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  isActive?: boolean;
}

export function SearchExpertIcon({ isActive, className, ...props }: IconProps): JSX.Element {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-labelledby="searchExpertIconTitle"
      {...props}
    >
      <title id="searchExpertIconTitle">Search Expert</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.05417 3.23437C3.05417 2.68209 3.50188 2.23438 4.05417 2.23438H17.5854C18.1377 2.23438 18.5854 2.68209 18.5854 3.23438V16.7656C18.5854 17.3179 18.1377 17.7656 17.5854 17.7656H4.05417C3.50188 17.7656 3.05417 17.3179 3.05417 16.7656V3.23437ZM10.181 12.438C11.8803 12.438 13.2578 11.0605 13.2578 9.36118C13.2578 7.66189 11.8803 6.28434 10.181 6.28434C8.48168 6.28434 7.10413 7.66189 7.10413 9.36118C7.10413 11.0605 8.48168 12.438 10.181 12.438ZM12.7523 12.7838C12.0364 13.3225 11.146 13.6418 10.181 13.6418C7.81684 13.6418 5.90034 11.7253 5.90034 9.36118C5.90034 6.99705 7.81684 5.08054 10.181 5.08054C12.5451 5.08054 14.4616 6.99705 14.4616 9.36118C14.4616 10.3262 14.1423 11.2166 13.6036 11.9326L16.2864 14.6154C16.5215 14.8505 16.5215 15.2316 16.2864 15.4666C16.0514 15.7017 15.6703 15.7017 15.4352 15.4666L12.7523 12.7838Z"
        fill={isActive ? 'var(--color-gray-600)' : 'var(--color-gray-300)'}
      />
    </svg>
  );
}
