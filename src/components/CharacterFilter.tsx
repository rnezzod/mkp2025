'use client';

import { useState, useEffect } from 'react';

interface CharacterFilterProps {
  characters: string[];
  selectedCharacters: string[];
  onSelectCharacters: (characters: string[]) => void;
}

export default function CharacterFilter({
  characters,
  selectedCharacters,
  onSelectCharacters,
}: CharacterFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(80);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    updateHeaderHeight();

    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  const toggleCharacter = (character: string) => {
    if (selectedCharacters.includes(character)) {
      onSelectCharacters(selectedCharacters.filter((c) => c !== character));
    } else {
      onSelectCharacters([...selectedCharacters, character]);
    }
  };

  const clearAll = () => {
    onSelectCharacters([]);
  };

  return (
    <div className="relative">
      {/* フィルターボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="diner-btn flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-[#FFFBF5] transition-all duration-200"
      >
        <svg
          className="w-4.5 h-4.5 text-[#45C6B9]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="font-bold text-sm text-[#2D1810]">
          {selectedCharacters.length === 0
            ? 'キャラクター'
            : selectedCharacters.length === 1
            ? selectedCharacters[0]
            : `${selectedCharacters.length}件選択中`}
        </span>
        {selectedCharacters.length > 0 && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full bg-[#FD4B5D] text-white border border-[#2D1810]">
            {selectedCharacters.length}
          </span>
        )}
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
          <div
            className="fixed left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 w-[90vw] max-w-md md:w-96 bg-[#FFFBF5] border-3 border-[#2D1810] rounded-xl shadow-[4px_4px_0px_#2D1810] z-50 flex flex-col overflow-hidden"
            style={{
              top: `${headerHeight + 16}px`,
              maxHeight: `calc(100vh - ${headerHeight + 80}px)`
            }}
          >
            {/* ヘッダー */}
            <div className="flex-shrink-0 bg-[#45C6B9] border-b-3 border-[#2D1810] px-4 md:px-5 py-3 md:py-4 flex justify-between items-center gap-3">
              <span className="text-sm font-bold text-white flex-1 min-w-0">
                キャラクター選択
              </span>
              {selectedCharacters.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs font-bold text-white/80 hover:text-white transition-colors"
                >
                  クリア
                </button>
              )}
            </div>

            {/* キャラクターリスト */}
            <div className="flex-1 overflow-y-auto">
              {characters.map((character) => (
                <label
                  key={character}
                  className="flex items-center px-4 md:px-5 py-3 md:py-3.5 hover:bg-[#FF9A33]/10 cursor-pointer transition-all duration-150 group border-b border-[#2D1810]/10"
                >
                  <input
                    type="checkbox"
                    checked={selectedCharacters.includes(character)}
                    onChange={() => toggleCharacter(character)}
                    className="w-4.5 h-4.5 text-[#45C6B9] bg-white border-2 border-[#2D1810] rounded-md focus:ring-2 focus:ring-[#45C6B9] transition-all cursor-pointer flex-shrink-0"
                  />
                  <span className="ml-3 md:ml-3.5 text-sm font-medium text-[#2D1810] group-hover:text-[#FF9A33] transition-colors break-words">
                    {character}
                  </span>
                </label>
              ))}
            </div>

            {/* フッター - 選択数表示 */}
            {selectedCharacters.length > 0 && (
              <div className="flex-shrink-0 bg-[#45C6B9]/10 border-t-3 border-[#2D1810] px-4 md:px-5 py-3">
                <p className="text-xs font-bold text-[#2D1810]">
                  {selectedCharacters.length}件のキャラクターを選択中
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
