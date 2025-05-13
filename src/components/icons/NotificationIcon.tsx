import type { JSX, SVGProps } from 'react';

interface NotificationIconProps extends SVGProps<SVGSVGElement> {
  hasUnread?: boolean;
}

/**
 * @description 알림 아이콘 컴포넌트. 읽지 않은 알림이 있을 경우 표시합니다.
 * @param {boolean} [hasUnread=false] - 읽지 않은 알림 유무.
 */
export function NotificationIcon({
  hasUnread = false,
  className,
  ...props
}: NotificationIconProps): JSX.Element {
  return (
    <div className="relative">
      <svg
        width="19"
        height="20"
        viewBox="0 0 19 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.31973 0.0649414C5.60956 0.0649414 2.60187 3.07263 2.60187 6.7828V12.2791H2.15903C1.05447 12.2791 0.159035 13.1745 0.159035 14.2791V15.3434C0.159035 15.6748 0.427663 15.9434 0.759034 15.9434H17.8805C18.2119 15.9434 18.4805 15.6748 18.4805 15.3434V14.2791C18.4805 13.1745 17.5851 12.2791 16.4805 12.2791H16.0376V6.78281C16.0376 3.07263 13.0299 0.0649414 9.31973 0.0649414Z"
          fill="currentColor"
        />
        <path
          d="M11.7733 16.8816C12.1047 16.8816 12.3793 17.1527 12.3146 17.4777C12.2756 17.6733 12.2176 17.865 12.1409 18.0501C11.9874 18.4206 11.7625 18.7572 11.479 19.0408C11.1954 19.3243 10.8588 19.5493 10.4883 19.7027C10.1178 19.8562 9.72076 19.9352 9.31976 19.9352C8.91876 19.9352 8.52168 19.8562 8.1512 19.7027C7.78073 19.5493 7.4441 19.3243 7.16055 19.0408C6.877 18.7572 6.65208 18.4206 6.49862 18.0501C6.42195 17.865 6.36387 17.6733 6.32494 17.4777C6.26025 17.1527 6.53481 16.8816 6.86618 16.8816L9.31976 16.8816H11.7733Z"
          fill="currentColor"
        />
      </svg>
      {hasUnread && (
        <span className="absolute top-0 right-0 block h-1 w-1 rounded-full bg-notification-red ring-1 ring-white" />
      )}
    </div>
  );
}
