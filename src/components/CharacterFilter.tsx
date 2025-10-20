'use client';

import { useState } from 'react';

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
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
      >
        <svg
          className="w-4.5 h-4.5 text-gray-600 dark:text-gray-400"
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
        <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
          {selectedCharacters.length === 0
            ? 'キャラクター'
            : selectedCharacters.length === 1
            ? selectedCharacters[0]
            : `${selectedCharacters.length}件選択中`}
        </span>
        {selectedCharacters.length > 0 && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full bg-blue-500 text-white">
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
          <div className="absolute top-full mt-3 right-0 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl z-20 flex flex-col max-h-[calc(100vh-120px)] overflow-hidden">
            {/* ヘッダー */}
            <div className="flex-shrink-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                キャラクター選択
              </span>
              {selectedCharacters.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
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
                  className="flex items-center px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-all duration-150 group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCharacters.includes(character)}
                    onChange={() => toggleCharacter(character)}
                    className="w-4.5 h-4.5 text-blue-600 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all cursor-pointer flex-shrink-0"
                  />
                  <span className="ml-3.5 text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors break-words">
                    {character}
                  </span>
                </label>
              ))}
            </div>

            {/* フッター - 選択数表示 */}
            {selectedCharacters.length > 0 && (
              <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800/30 px-5 py-3">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
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

