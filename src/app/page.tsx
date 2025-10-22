'use client';

import { useState } from 'react';
import Link from 'next/link';
import movieData from '@/../../public/movie_urls.json';

type MovieData = {
  title: string;
  name: string;
  url: string;
};

export default function Home() {
  const movies = Object.entries(movieData).map(([key, value]) => ({
    id: key,
    ...(value as MovieData),
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
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
          {/* 音量ボタン */}
          <button
            onClick={toggleMute}
            className="absolute -top-8 left-2 px-2 py-1 rounded-md flex items-center gap-1 shadow-md transition-all duration-200 hover:scale-105 z-10"
            style={{ background: isMuted ? '#999' : '#45C6B9' }}
            aria-label={isMuted ? '音声をONにする' : '音声をOFFにする'}
          >
            {isMuted ? (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            )}
            <span className="text-xs font-bold text-white">
              {isMuted ? 'OFF' : 'ON'}
            </span>
          </button>

          {/* 動画カード */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-[#45C6B9]/50">
            <video
              key={movies[currentIndex].id}
              controls
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={goToNext}
              className="w-full aspect-video bg-black"
              preload="metadata"
            >
              <source src={movies[currentIndex].url} type="video/mp4" />
              お使いのブラウザは動画タグをサポートしていません。
            </video>
            <div className="p-4 text-center relative flex items-center justify-center">
              {/* 左ボタン */}
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 flex items-center justify-center transition-all duration-200 hover:brightness-110"
                style={{ background: '#FF9A33' }}
                aria-label="前の動画"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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

              {/* テキスト部分 */}
              <div className="flex-1 px-12 sm:px-14">
                <h3 className="text-base sm:text-lg font-black mb-0.5 leading-tight whitespace-pre-line" style={{ color: '#45C6B9' }}>
                  {movies[currentIndex].title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold leading-tight whitespace-pre-line" style={{ color: '#666' }}>
                  {movies[currentIndex].name}
                </p>
              </div>

              {/* 右ボタン */}
              <button
                onClick={goToNext}
                className="absolute right-0 top-0 bottom-0 w-10 sm:w-12 flex items-center justify-center transition-all duration-200 hover:brightness-110"
                style={{ background: '#FD4B5D' }}
                aria-label="次の動画"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
