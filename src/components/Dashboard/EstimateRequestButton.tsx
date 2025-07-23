import { EstimateRequestIcon } from '../Icons';

export const EstimateRequestButton = () => {
  const handleEstimateRequestClick = () => {};

  return (
    <button
      aria-label="견적 요청하기"
      className="fixed right-5 bottom-[75px] z-40 flex h-[44px] w-[115px] items-center justify-center gap-1 rounded-full bg-droni-blue-500 px-[14px] py-[10px] shadow-[0px_0px_4px_rgba(0,0,0,0.1),_0px_0px_12px_rgba(0,0,0,0.2)] hover:bg-droni-blue-600 focus:outline-none focus:ring-2 focus:ring-droni-blue-500/75"
      onClick={handleEstimateRequestClick}
      type="button"
    >
      <EstimateRequestIcon className="h-6 w-6" />
      <span className="font-bold text-base text-white leading-6 tracking-[-0.16px]">견적요청</span>
    </button>
  );
};
