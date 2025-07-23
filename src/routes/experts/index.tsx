import { ChevronDownIcon, MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/solid';
import { createFileRoute } from '@tanstack/react-router';
import { NotificationIcon, RatingStar } from '@/components/Icons';
import { requireAuth } from '@/lib/authGuard';

export const Route = createFileRoute('/experts/')({
  beforeLoad: requireAuth,
  component: RouteComponent,
  context: (ctx) => ({ ...ctx.context, hideBottomNav: false }),
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-white pb-[env(safe-area-inset-bottom)]">
      <header className="flex h-13 items-center justify-between bg-white px-5">
        <h1 className="text-gray-900 text-system-03 tracking-[-0.18px]">조종사 찾기</h1>
        <NotificationIcon hasUnread={true} />
      </header>

      <main className="flex-1 overflow-y-auto px-5">
        <div className="relative">
          <input
            aria-label="조종사 검색"
            className="w-full rounded-lg border border-gray-200 px-4 py-3.5 pl-9 text-system-08 placeholder-gray-400 placeholder:tracking-[-0.14px] focus:border-primary-500 focus:bg-white focus:outline-none"
            placeholder="조종사를 검색해 보세요."
            type="search"
          />
          <MagnifyingGlassIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 h-4 w-4 text-gray-400" />
        </div>

        <div className="mt-4 flex items-center justify-between text-system-08 tracking-[-0.14px]">
          <div className="flex gap-2 text-gray-500">
            <div className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1.5">
              <StarIcon className="h-4 w-4 text-gray-500" />
              찜한 조종사
            </div>
            <div className="rounded-full border border-gray-300 bg-white px-3 py-1.5">주소</div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-700">인기 순</span>
            <ChevronDownIcon className="h-4 w-4 text-gray-600" />
          </div>
        </div>

        {Array.from({ length: 10 }).map((_, index, arr) => (
          <>
            <div className="flex items-center gap-2 py-3.5" key={`${Math.random()}+${index}`}>
              {/* profile image */}
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                <span className="flex h-full w-full items-center justify-center font-semibold text-gray-400 text-xl">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>temp profile image</title>
                    <circle cx="12" cy="8" fill="#d1d5db" r="4" />
                    <rect fill="#d1d5db" height="4" rx="2" width="16" x="4" y="16" />
                  </svg>
                </span>
              </div>

              <div className="flex flex-col items-start justify-center gap-0.5">
                <div className="text-gray-800 text-system-05 tracking-[-0.16px]">김철수</div>

                <div className="flex items-center gap-2">
                  <div>
                    <RatingStar className="h-4 w-4" rating={5} />
                    <span className="text-gray-800 text-system-07 tracking-[-0.14px]">5.0</span>
                    <span className="ml-[3px] text-gray-500 text-system-10 tracking-[-0.12px]">
                      (2건)
                    </span>
                  </div>
                  <div className="text-gray-600 tracking-[-0.14px]">
                    <span className="text-system-08">방제 횟수</span>
                    <span className="ml-0.5 text-system-07">2</span>
                  </div>
                </div>
              </div>
            </div>

            {index < arr.length - 1 && <div className="h-[1px] w-full bg-gray-200" />}
          </>
        ))}
      </main>
    </div>
  );
}
