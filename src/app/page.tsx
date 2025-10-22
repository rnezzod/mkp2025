'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import movieData from '@/../../public/movie_urls.json';

type MovieData = {
  title: string;
  name: string;
  url: string;
};

type StoryData = {
  title: string;
  text: string;
  url: string;
};

export default function Home() {
  const movies = Object.entries(movieData.characters).map(([key, value]) => ({
    id: key,
    ...(value as MovieData),
  }));

  const stories = Object.entries(movieData.stories).map(([key, value]) => ({
    id: key,
    ...(value as StoryData),
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [storyIndex, setStoryIndex] = useState(0);
  const [storyMuted, setStoryMuted] = useState(true);
  const [storyCurrentTime, setStoryCurrentTime] = useState(0);
  const [storyDuration, setStoryDuration] = useState(0);
  const [storyPlaying, setStoryPlaying] = useState(true);
  const storyVideoRef = useRef<HTMLVideoElement>(null);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const seekTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = seekTime;
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const goToStoryPrevious = () => {
    setStoryIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const goToStoryNext = () => {
    setStoryIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  const toggleStoryMute = () => {
    setStoryMuted((prev) => !prev);
  };

  const toggleStoryPlay = () => {
    if (storyVideoRef.current) {
      if (storyPlaying) {
        storyVideoRef.current.pause();
        setStoryPlaying(false);
      } else {
        storyVideoRef.current.play();
        setStoryPlaying(true);
      }
    }
  };

  const handleStoryTimeUpdate = () => {
    if (storyVideoRef.current) {
      setStoryCurrentTime(storyVideoRef.current.currentTime);
    }
  };

  const handleStoryLoadedMetadata = () => {
    if (storyVideoRef.current) {
      setStoryDuration(storyVideoRef.current.duration);
    }
  };

  const handleStorySeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (storyVideoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const seekTime = (clickX / rect.width) * storyDuration;
      storyVideoRef.current.currentTime = seekTime;
    }
  };

  const storyProgress = storyDuration > 0 ? (storyCurrentTime / storyDuration) * 100 : 0;

  // 動画切り替え時に状態をリセットし、メタデータを再取得
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
    if (videoRef.current) {
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  }, [currentIndex]);

  // ストーリー切り替え時に状態をリセットし、メタデータを再取得
  useEffect(() => {
    setStoryCurrentTime(0);
    setStoryDuration(0);
    setStoryPlaying(true);
    if (storyVideoRef.current) {
      if (storyVideoRef.current.duration) {
        setStoryDuration(storyVideoRef.current.duration);
      }
    }
  }, [storyIndex]);

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

          {/* 再生/停止ボタン */}
          <button
            onClick={togglePlay}
            className="absolute -top-8 right-2 px-2 py-1 rounded-md flex items-center gap-1 shadow-md transition-all duration-200 hover:scale-105 z-10"
            style={{ background: '#FF9A33' }}
            aria-label={isPlaying ? '一時停止' : '再生'}
          >
            {isPlaying ? (
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span className="text-xs font-bold text-white">
              {isPlaying ? '停止' : '再生'}
            </span>
          </button>

          {/* 動画カード */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-[#45C6B9]/50">
            <video
              ref={videoRef}
              key={movies[currentIndex].id}
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={goToNext}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onCanPlay={handleLoadedMetadata}
              onLoadStart={handleLoadedMetadata}
              className="w-full aspect-video bg-black"
              preload="metadata"
            >
              <source src={movies[currentIndex].url} type="video/mp4" />
              お使いのブラウザは動画タグをサポートしていません。
            </video>
            
            {/* カスタムシークバー */}
            <div 
              onClick={handleSeek}
              className="h-2 sm:h-3 cursor-pointer"
              style={{ background: '#E0E0E0' }}
            >
              <div 
                className="h-full transition-all duration-100"
                style={{ 
                  width: `${progress}%`,
                  background: '#45C6B9'
                }}
              />
            </div>
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
                <h3 className="text-sm sm:text-base md:text-lg font-black mb-0.5 leading-tight whitespace-pre-line" style={{ color: '#45C6B9' }}>
                  {movies[currentIndex].title}
                </h3>
                <p className="text-xs sm:text-xs md:text-sm font-semibold leading-tight whitespace-pre-line" style={{ color: '#666' }}>
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

        {/* ストーリー見出し */}
        <div className="text-center mb-12 mt-24">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wider" style={{ color: '#FD4B5D' }}>
            STORIES
          </h3>
        </div>

        {/* ストーリーカルーセル */}
        <div className="relative max-w-3xl mx-auto mb-16">
          {/* 音量ボタン */}
          <button
            onClick={toggleStoryMute}
            className="absolute -top-8 left-2 px-2 py-1 rounded-md flex items-center gap-1 shadow-md transition-all duration-200 hover:scale-105 z-10"
            style={{ background: storyMuted ? '#999' : '#FD4B5D' }}
            aria-label={storyMuted ? '音声をONにする' : '音声をOFFにする'}
          >
            {storyMuted ? (
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
              {storyMuted ? 'OFF' : 'ON'}
            </span>
          </button>

          {/* 再生/停止ボタン */}
          <button
            onClick={toggleStoryPlay}
            className="absolute -top-8 right-2 px-2 py-1 rounded-md flex items-center gap-1 shadow-md transition-all duration-200 hover:scale-105 z-10"
            style={{ background: '#FF9A33' }}
            aria-label={storyPlaying ? '一時停止' : '再生'}
          >
            {storyPlaying ? (
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span className="text-xs font-bold text-white">
              {storyPlaying ? '停止' : '再生'}
            </span>
          </button>

          {/* ストーリーカード */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FD4B5D]/50">
            <video
              ref={storyVideoRef}
              key={stories[storyIndex].id}
              autoPlay
              muted={storyMuted}
              playsInline
              onEnded={goToStoryNext}
              onTimeUpdate={handleStoryTimeUpdate}
              onLoadedMetadata={handleStoryLoadedMetadata}
              onCanPlay={handleStoryLoadedMetadata}
              onLoadStart={handleStoryLoadedMetadata}
              className="w-full aspect-video bg-black"
              preload="metadata"
            >
              <source src={stories[storyIndex].url} type="video/mp4" />
              お使いのブラウザは動画タグをサポートしていません。
            </video>
            
            {/* カスタムシークバー */}
            <div 
              onClick={handleStorySeek}
              className="h-2 sm:h-3 cursor-pointer"
              style={{ background: '#E0E0E0' }}
            >
              <div 
                className="h-full transition-all duration-100"
                style={{ 
                  width: `${storyProgress}%`,
                  background: '#FD4B5D'
                }}
              />
            </div>
            <div className="p-6">
              {/* タイトルとテキスト */}
              <div className="text-center mb-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3" style={{ color: '#FD4B5D' }}>
                  {stories[storyIndex].title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#666' }}>
                  {stories[storyIndex].text}
                </p>
              </div>

              {/* ナビゲーションボタン */}
              {stories.length > 1 && (
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={goToStoryPrevious}
                    className="px-6 py-2 rounded-full font-bold text-white shadow-md transition-all duration-200 hover:scale-105"
                    style={{ background: '#FF9A33' }}
                    aria-label="前のストーリー"
                  >
                    ← 前へ
                  </button>
                  <button
                    onClick={goToStoryNext}
                    className="px-6 py-2 rounded-full font-bold text-white shadow-md transition-all duration-200 hover:scale-105"
                    style={{ background: '#FD4B5D' }}
                    aria-label="次のストーリー"
                  >
                    次へ →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* インジケーター（ドット） */}
          {stories.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStoryIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === storyIndex
                      ? 'w-8 shadow-lg'
                      : 'opacity-40 hover:opacity-70'
                  }`}
                  style={{
                    background: index === storyIndex ? '#FD4B5D' : '#FF9A33',
                  }}
                  aria-label={`ストーリー ${index + 1} に移動`}
                />
              ))}
            </div>
          )}
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
