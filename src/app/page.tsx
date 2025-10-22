'use client';

import { useState } from 'react';
import Link from 'next/link';
import movieData from '@/../../public/movie_urls.json';

export default function Home() {
  const movies = Object.entries(movieData).map(([key, value]) => ({
    id: key,
    ...value,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5ED] via-[#FFFAF7] to-[#FFF0F0]">
      {/* ヘッダー */}
      <header className="border-b-2 border-[#FF9A33]/30 bg-white/95 backdrop-blur-xl shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black" style={{ color: '#FF9A33' }}>
              TASTY VIVID TUNE
            </h1>
            <Link
              href="/gallery"
              className="px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-md hover:shadow-lg transition-all duration-200"
              style={{ background: '#45C6B9' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#3AB3A6'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#45C6B9'}
            >
              ギャラリーへ
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* タイトル */}
        <div className="text-center mb-16">
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-black mb-12">
            <span style={{ color: '#FF9A33' }}>TASTY</span><br/>
            <span style={{ color: '#45C6B9' }}>VIVID</span><br/>
            <span style={{ color: '#FD4B5D' }}>TUNE</span>
          </h2>
        </div>

        {/* キャラクター見出し */}
        <div className="text-center mb-12">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wider" style={{ color: '#FF9A33' }}>
            CHARACTERS
          </h3>
        </div>

        {/* 動画カルーセル */}
        <div className="relative max-w-3xl mx-auto mb-16">
          {/* 動画カード */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-[#45C6B9]/50">
            <video
              key={movies[currentIndex].id}
              controls
              autoPlay
              muted
              loop
              className="w-full aspect-video bg-black"
              preload="metadata"
            >
              <source src={movies[currentIndex].url} type="video/mp4" />
              お使いのブラウザは動画タグをサポートしていません。
            </video>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-black mb-2" style={{ color: '#45C6B9' }}>
                {movies[currentIndex].name}
              </h3>
              <p className="text-sm font-medium" style={{ color: '#FF9A33' }}>
                {currentIndex + 1} / {movies.length}
              </p>
            </div>

            {/* 左矢印 */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 bottom-4 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110"
              style={{ background: '#FF9A33' }}
              aria-label="前の動画"
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* 右矢印 */}
            <button
              onClick={goToNext}
              className="absolute right-4 bottom-4 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110"
              style={{ background: '#FD4B5D' }}
              aria-label="次の動画"
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* インジケーター（ドット） */}
          <div className="flex justify-center gap-2 mt-6">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 shadow-lg'
                    : 'opacity-40 hover:opacity-70'
                }`}
                style={{
                  background: index === currentIndex ? '#45C6B9' : '#FF9A33',
                }}
                aria-label={`動画 ${index + 1} に移動`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="py-12 border-t-2 border-[#FF9A33]/30 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: '#FF9A33' }}>
              © 2025 Magic Kingdom Project. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
