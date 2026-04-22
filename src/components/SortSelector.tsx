'use client';

import { useState } from 'react';

export type SortOption = 'newest' | 'oldest';

interface SortSelectorProps {
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: '新しい順' },
  { value: 'oldest', label: '古い順' },
];

export default function SortSelector({
  selectedSort,
  onSelectSort,
}: SortSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = sortOptions.find((opt) => opt.value === selectedSort)?.label;

  return (
    <div className="relative">
      {/* ソートボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="diner-btn flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-[#FFFBF5] transition-all duration-200 w-full justify-center sm:w-auto"
      >
        <svg
          className="w-4.5 h-4.5 text-[#FF9A33]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
        <span className="font-bold text-sm text-[#2D1810]">{currentLabel}</span>
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <>
          {/* 背景オーバーレイ */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* メニュー */}
          <div className="absolute top-full mt-3 right-0 w-full sm:w-52 bg-[#FFFBF5] border-3 border-[#2D1810] rounded-xl shadow-[4px_4px_0px_#2D1810] z-20 overflow-hidden">
            {sortOptions.map((option, index) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelectSort(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3.5 transition-all duration-150 ${
                  index !== sortOptions.length - 1 ? 'border-b-2 border-[#2D1810]/20' : ''
                } ${
                  selectedSort === option.value
                    ? 'bg-[#FF9A33]/15 text-[#2D1810] font-bold'
                    : 'text-[#2D1810] font-medium hover:bg-[#FF9A33]/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{option.label}</span>
                  {selectedSort === option.value && (
                    <svg
                      className="w-4 h-4 text-[#FF9A33]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
