'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // 全ページを表示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 省略記号を使って表示
      if (currentPage <= 4) {
        // 最初の方にいる場合
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // 最後の方にいる場合
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 真ん中にいる場合
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-12 px-2">
      {/* 前へボタン */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 rounded-full bg-white border-2 border-orange-300 text-sm font-bold text-orange-900 hover:bg-orange-50 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-orange-300 transition-all duration-200 shadow-md flex-shrink-0"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden sm:inline">前へ</span>
      </button>

      {/* ページ番号 */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-shrink">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-orange-400"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[40px] h-10 px-3 rounded-full text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-white border-2 border-orange-300 text-orange-900 hover:bg-orange-50 hover:border-orange-400 shadow-md'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* 次へボタン */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 rounded-full bg-white border-2 border-orange-300 text-sm font-bold text-orange-900 hover:bg-orange-50 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-orange-300 transition-all duration-200 shadow-md flex-shrink-0"
      >
        <span className="hidden sm:inline">次へ</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

