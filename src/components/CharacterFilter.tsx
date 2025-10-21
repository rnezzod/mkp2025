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
        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border-2 border-teal-400 hover:bg-teal-50 hover:border-teal-500 shadow-md hover:shadow-lg transition-all duration-200"
      >
        <svg
          className="w-4.5 h-4.5 text-teal-600"
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
        <span className="font-bold text-sm text-teal-900">
          {selectedCharacters.length === 0
            ? 'キャラクター'
            : selectedCharacters.length === 1
            ? selectedCharacters[0]
            : `${selectedCharacters.length}件選択中`}
        </span>
        {selectedCharacters.length > 0 && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full bg-red-500 text-white shadow-sm">
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
          <div className="absolute top-full mt-3 right-0 w-80 bg-white border-2 border-teal-400 rounded-2xl shadow-2xl z-20 flex flex-col max-h-[60vh] sm:max-h-[calc(100vh-120px)] overflow-hidden sm:w-96">
            {/* ヘッダー */}
            <div className="flex-shrink-0 bg-teal-50 border-b-2 border-teal-300 px-5 py-4 flex justify-between items-center">
              <span className="text-sm font-bold text-teal-900">
                キャラクター選択
              </span>
              {selectedCharacters.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
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
                  className="flex items-center px-5 py-3.5 hover:bg-teal-50 cursor-pointer transition-all duration-150 group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCharacters.includes(character)}
                    onChange={() => toggleCharacter(character)}
                    className="w-4.5 h-4.5 text-teal-600 bg-white border-2 border-teal-400 rounded-md focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer flex-shrink-0"
                  />
                  <span className="ml-3.5 text-sm font-medium text-gray-800 group-hover:text-teal-900 transition-colors break-words">
                    {character}
                  </span>
                </label>
              ))}
            </div>

            {/* フッター - 選択数表示 */}
            {selectedCharacters.length > 0 && (
              <div className="flex-shrink-0 bg-teal-50 border-t-2 border-teal-300 px-5 py-3">
                <p className="text-xs font-bold text-teal-800">
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

