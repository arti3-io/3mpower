export const Skeleton = () => {
  return (
    <div role="status" className="max-w-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-8"></div>
    </div>
  );
};

export const SkeletonUser = () => {
  return (
    <div role="status" className="animate-pulse">
      <div className="flex col-span-2 lg:col-span-1 gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-700 mr-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
          <div className="flex flex-col gap-1">
            <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
            <div className="w-20 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="w-10 h-5 bg-gray-200 rounded-full dark:bg-gray-700 mr-3"></div>
        </div>
      </div>
    </div>
  );
};
