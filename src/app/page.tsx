'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import movieData from '@/../../public/movie_urls.json';
import informationData from '@/../../public/information.json';
import snsData from '@/../../public/SNS_urls.json';
import ImageModal from '@/components/ImageModal';

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

function proxyVideoUrl(url: string): string {
  return `/api/video?url=${encodeURIComponent(url)}`;
}

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
  const [storyPlaying, setStoryPlaying] = useState(false);
  const storyVideoRef = useRef<HTMLVideoElement>(null);

  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  
  const charactersRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);

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
        // story動画を停止
        if (storyVideoRef.current && storyPlaying) {
          storyVideoRef.current.pause();
          setStoryPlaying(false);
        }
      }
    }
  };

  const restartPlay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      // story動画を停止
      if (storyVideoRef.current && storyPlaying) {
        storyVideoRef.current.pause();
        setStoryPlaying(false);
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
        // characters動画を停止
        if (videoRef.current && isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  const restartStoryPlay = () => {
    if (storyVideoRef.current) {
      storyVideoRef.current.currentTime = 0;
      storyVideoRef.current.play();
      setStoryPlaying(true);
      // characters動画を停止
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
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

  // 動画切り替え時に状態をリセット
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(() => {
        // autoplay policy で再生できない場合は静かに失敗
      });
      setIsPlaying(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // ストーリー切り替え時に状態をリセット
  useEffect(() => {
    setStoryCurrentTime(0);
    setStoryDuration(0);
    const video = storyVideoRef.current;
    if (video) {
      video.load();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyIndex]);

  // 初期ローディング（最低0.3秒間表示）
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);


  // ヘッダーの表示/非表示制御
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // 一番下に到達したら表示
      if (currentScrollY + windowHeight >= documentHeight - 10) {
        setHeaderVisible(true);
      }
      // 下にスクロール
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHeaderVisible(false);
      }
      // 上にスクロール
      else if (currentScrollY < lastScrollY) {
        setHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // セクションの表示に応じた動画の自動再生制御
  useEffect(() => {
    // ローディング中は何もしない
    if (isLoading) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // 画面中央付近に来たときに発火
      threshold: 0.1, // 10%以上表示されたら
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === charactersRef.current) {
            // Charactersセクションが表示されたら
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.currentTime = 0; // 最初から再生
              videoRef.current.play().catch((error) => {
                console.log('Characters video autoplay prevented:', error);
              });
              setIsPlaying(true);
            }
            // Story動画を停止
            if (storyVideoRef.current && !storyVideoRef.current.paused) {
              storyVideoRef.current.pause();
              setStoryPlaying(false);
            }
          } else if (entry.target === storiesRef.current) {
            // Storyセクションが表示されたら
            if (storyVideoRef.current && storyVideoRef.current.paused) {
              storyVideoRef.current.currentTime = 0; // 最初から再生
              storyVideoRef.current.play().catch((error) => {
                console.log('Story video autoplay prevented:', error);
              });
              setStoryPlaying(true);
            }
            // Characters動画を停止
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    if (charactersRef.current) {
      observer.observe(charactersRef.current);
    }
    if (storiesRef.current) {
      observer.observe(storiesRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#FFF8F0] flex items-center justify-center z-50">
        <img
          src="/logo.png"
          alt="Loading..."
          width={192}
          height={192}
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen diner-bg diner-checker relative">
      {/* ヘッダー */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 diner-header transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="diner-awning"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight hover:opacity-80 transition-opacity duration-200 cursor-pointer neon-orange animate-neon"
              style={{
                color: '#FF9A33',
                fontFamily: 'Impact, sans-serif',
                fontWeight: 'bold',
                letterSpacing: '0.01em'
              }}
            >
              TASTY VIVID TUNE!
            </button>
            <div className="flex gap-2">
              <Link
                href="/about"
                className="diner-btn px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#FF9A33] transition-all duration-200"
              >
                About
              </Link>
              <Link
                href="/gallery"
                className="diner-btn px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#45C6B9] transition-all duration-200"
              >
                Gallery
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        {/* タイトル */}
        <div className="text-center mb-16">
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-black mb-8 leading-none">
            <span className="inline-block hover:scale-110 transition-transform duration-300 neon-orange animate-neon" style={{ color: '#FF9A33', fontFamily: 'Arial Black, Impact, sans-serif', fontWeight: 'bold' }}>TASTY</span><br/>
            <span className="inline-block hover:scale-110 transition-transform duration-300 neon-teal" style={{ color: '#45C6B9', fontFamily: 'Arial Black, Impact, sans-serif', fontWeight: 'bold' }}>VIVID</span><br/>
            <span className="inline-block hover:scale-110 transition-transform duration-300 neon-red" style={{ color: '#FD4B5D', fontFamily: 'Arial Black, Impact, sans-serif', fontWeight: 'bold' }}>TUNE!</span>
          </h2>
          <div className="diner-divider max-w-xs mx-auto mt-4"></div>
        </div>

        {/* タブナビゲーション */}
        <div className="flex justify-center mb-16">
          <div className="diner-card flex gap-2 sm:gap-4 md:gap-8 justify-center px-4 sm:px-6 py-3 overflow-x-auto">
            <button
              onClick={() => document.getElementById('characters')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="diner-badge transition-all duration-200 hover:scale-105 whitespace-nowrap"
              style={{ color: '#FF9A33', borderColor: '#FF9A33' }}
            >
              CHARACTERS
            </button>
            <button
              onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="diner-badge transition-all duration-200 hover:scale-105 whitespace-nowrap"
              style={{ color: '#FD4B5D', borderColor: '#FD4B5D' }}
            >
              STORY
            </button>
            <button
              onClick={() => document.getElementById('information')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="diner-badge transition-all duration-200 hover:scale-105 whitespace-nowrap"
              style={{ color: '#45C6B9', borderColor: '#45C6B9' }}
            >
              INFORMATION
            </button>
            {/* GOODS セクション非表示中
            <button
              onClick={() => document.getElementById('goods')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="diner-badge transition-all duration-200 hover:scale-105 whitespace-nowrap"
              style={{ color: '#9B59B6', borderColor: '#9B59B6' }}
            >
              GOODS
            </button>
            */}
          </div>
        </div>

        {/* キャラクター見出し */}
        <div id="characters" className="text-center mb-12 scroll-mt-32">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wider neon-orange diner-title" style={{ color: '#FF9A33', fontFamily: 'Impact, Arial Black, sans-serif' }}>
            CHARACTERS
          </h3>
        </div>

        {/* 動画カルーセル */}
        <div ref={charactersRef} className="relative max-w-3xl mx-auto mb-16">
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

          {/* 最初から再生ボタン */}
          <button
            onClick={restartPlay}
            className="absolute -top-8 right-20 px-2 py-1 rounded-md flex items-center gap-1 shadow-md transition-all duration-200 hover:scale-105 z-10"
            style={{ background: '#FF9A33' }}
            aria-label="最初から再生"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            </svg>
            <span className="text-xs font-bold text-white">
              最初から
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
          <div className="relative diner-card-teal no-card-dots overflow-hidden animate-jukebox transition-all duration-300">
            <video
              ref={videoRef}
              key={movies[currentIndex].id}
              src={proxyVideoUrl(movies[currentIndex].url)}
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={goToNext}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onCanPlay={handleLoadedMetadata}
              className="w-full aspect-video bg-black"
              preload="auto"
            />
            
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
                className={`absolute left-0 top-0 bottom-0 flex items-center justify-center transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95 ${
                  movies[currentIndex].id === 'floats' ? 'w-8 sm:w-10' : 'w-10 sm:w-12'
                }`}
                style={{ background: 'linear-gradient(90deg, #FF9A33 0%, #FF8820 100%)' }}
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
              <div className={`flex-1 ${
                movies[currentIndex].id === 'floats' ? 'px-10 sm:px-12' : 'px-12 sm:px-14'
              }`}>
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
                className={`absolute right-0 top-0 bottom-0 flex items-center justify-center transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95 ${
                  movies[currentIndex].id === 'floats' ? 'w-8 sm:w-10' : 'w-10 sm:w-12'
                }`}
                style={{ background: 'linear-gradient(90deg, #FD4B5D 0%, #FF3545 100%)' }}
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
        <div id="stories" className="text-center mb-12 mt-24 scroll-mt-32">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wider neon-red diner-title" style={{ color: '#FD4B5D', fontFamily: 'Impact, Arial Black, sans-serif' }}>
            STORY
          </h3>
        </div>

        {/* ストーリーカルーセル */}
        <div ref={storiesRef} className="relative max-w-3xl mx-auto mb-16">
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

          {/* 最初から再生ボタン */}
          <button
            onClick={restartStoryPlay}
            className="absolute -top-8 right-20 px-2 py-1 rounded-md flex items-center gap-1 shadow-md transition-all duration-200 hover:scale-105 z-10"
            style={{ background: '#FF9A33' }}
            aria-label="最初から再生"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            </svg>
            <span className="text-xs font-bold text-white">
              最初から
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
          <div className="relative diner-card-red no-card-dots overflow-hidden animate-jukebox transition-all duration-300">
            <video
              ref={storyVideoRef}
              key={stories[storyIndex].id}
              src={proxyVideoUrl(stories[storyIndex].url)}
              muted={storyMuted}
              playsInline
              onEnded={goToStoryNext}
              onTimeUpdate={handleStoryTimeUpdate}
              onLoadedMetadata={handleStoryLoadedMetadata}
              onCanPlay={handleStoryLoadedMetadata}
              className="w-full aspect-video bg-black"
              preload="auto"
            />
            
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
              <div className="mb-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 text-center" style={{ color: '#FD4B5D' }}>
                  {stories[storyIndex].title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-left" style={{ color: '#666' }}>
                  {stories[storyIndex].text}
                </p>
              </div>

              {/* ナビゲーションボタン */}
              {stories.length > 1 && (
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={goToStoryPrevious}
                    className="px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #FF9A33 0%, #FF8820 100%)' }}
                    aria-label="前のストーリー"
                  >
                    ← 前へ
                  </button>
                  <button
                    onClick={goToStoryNext}
                    className="px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #FD4B5D 0%, #FF3545 100%)' }}
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

        {/* INFORMATION見出し */}
        <div id="information" className="text-center mb-12 mt-24 scroll-mt-32">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wider neon-teal diner-title" style={{ color: '#45C6B9', fontFamily: 'Impact, Arial Black, sans-serif' }}>
            INFORMATION
          </h3>
        </div>

        {/* INFORMATIONコンテンツ */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 公演情報 */}
            <div className="diner-card-teal p-8 transition-all duration-300 hover:translate-y-[-2px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #45C6B9 0%, #3AB5A8 100%)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-black" style={{ color: '#45C6B9' }}>公演情報（アンコール公演）</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-lg font-bold mb-2" style={{ color: '#FF9A33' }}>公演時間</h5>
                  <div className="space-y-1">
                    {Object.entries(informationData.information.公演時間).map(([date, time]) => (
                      <div key={date} className="flex items-center py-1">
                        <span className="font-semibold w-16">{date}</span>
                        <div className="ml-3">
                          {date === '10/25' ? (
                            <div className="space-y-1">
                              <div className="text-gray-700 relative">
                                <span className="line-through text-gray-400">15:10~15:40</span>
                                <span className="ml-2 text-xs text-red-600 font-semibold">雨天のため変更</span>
                              </div>
                              <div className="text-gray-700 font-semibold">{time}</div>
                            </div>
                          ) : date === '10/26' ? (
                            <div className="space-y-1">
                              <div className="text-gray-700 relative">
                                <span className="line-through text-gray-400">15:10~15:40</span>
                                <span className="ml-2 text-xs text-red-600 font-semibold">雨天のため変更</span>
                              </div>
                              <div className="text-gray-700 font-semibold">{time}</div>
                            </div>
                          ) : (
                            <span className="text-gray-700">{time}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-lg font-bold mb-2" style={{ color: '#FF9A33' }}>公演場所</h5>
                  <div className="space-y-1">
                    {Object.entries(informationData.information.公演場所).map(([condition, location]) => (
                      <div key={condition} className="flex items-center py-1">
                        <span className="font-semibold w-16">{condition}</span>
                        <span className="text-gray-700 ml-3">{location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-lg font-bold mb-2" style={{ color: '#FF9A33' }}>公演注意事項</h5>
                  <ul className="space-y-1">
                    {informationData.information.公演注意事項.map((note, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-[#45C6B9] mt-1">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 展示情報 (非表示中) */}
            <div className="hidden diner-card-red p-8 transition-all duration-300 hover:translate-y-[-2px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FD4B5D 0%, #E53E3E 100%)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-2xl font-black" style={{ color: '#FD4B5D' }}>展示情報</h4>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-lg font-bold mb-2" style={{ color: '#FF9A33' }}>展示場所</h5>
                  <p className="text-gray-700 font-semibold">{informationData.information.展示場所}</p>
                </div>

                <div>
                  <h5 className="text-lg font-bold mb-2" style={{ color: '#FF9A33' }}>展示時間</h5>
                  <div className="space-y-1">
                    {Object.entries(informationData.information.展示時間).map(([date, time]) => (
                      <div key={date} className="flex items-center py-1">
                        <span className="font-semibold w-16">{date}</span>
                        <span className="text-gray-700 ml-3">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-lg font-bold mb-2" style={{ color: '#FF9A33' }}>展示注意事項</h5>
                  <ul className="space-y-1">
                    {informationData.information.展示注意事項.map((note, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-[#FD4B5D] mt-1">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GOODS見出し (非表示中) */}
        <div id="goods" className="hidden text-center mb-12 mt-24 scroll-mt-32">
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wider neon-purple diner-title" style={{ color: '#9B59B6', fontFamily: 'Impact, Arial Black, sans-serif' }}>
            GOODS
          </h3>
        </div>

        {/* GOODSコンテンツ (非表示中) */}
        <div className="hidden max-w-6xl mx-auto mb-16">
          <div className="diner-card-purple p-4 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#2D1810]" style={{ background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-black neon-purple" style={{ color: '#9B59B6' }}>お品書き</h4>
              </div>
              
              <div id="spoiler-warning" className="flex flex-col items-center gap-4 py-8">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-orange-900 mb-2">
                    ⚠️ ネタバレ注意 ⚠️
                  </p>
                  <p className="text-sm text-orange-700 mb-4">
                    お品書きには公演内容に関する情報が含まれています
                  </p>
                  <button
                    onClick={() => {
                      const img = document.getElementById('goods-image');
                      const warning = document.getElementById('spoiler-warning');
                      if (img && warning) {
                        img.style.display = 'block';
                        warning.style.display = 'none';
                      }
                    }}
                    className="px-6 py-2 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-colors duration-200"
                  >
                    お品書きを見る
                  </button>
                </div>
              </div>
              
              <img 
                id="goods-image"
                src="/お品書き.png" 
                alt="お品書き" 
                className="max-w-full h-auto rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                style={{ maxHeight: '800px', display: 'none' }}
                onClick={() => setSelectedImageUrl('/お品書き.png')}
              />
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="diner-footer py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SNSリンクセクション */}
          <div className="mb-8">
            <h4 className="text-center text-lg font-bold mb-6 neon-orange" style={{ color: '#FF9A33' }}>
              Follow Us
            </h4>
            <div className="flex justify-center gap-3">
              <a
                href={snsData.X}
                target="_blank"
                rel="noopener noreferrer"
                className="diner-btn flex items-center gap-1 px-4 py-2 rounded-lg bg-white text-[#2D1810] text-xs font-bold transition-all duration-200"
                aria-label="X でフォロー"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>X</span>
              </a>
              <a
                href={snsData.Instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="diner-btn flex items-center gap-1 px-4 py-2 rounded-lg text-white text-xs font-bold transition-all duration-200"
                style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}
                aria-label="Instagram でフォロー"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href={snsData.YouTube}
                target="_blank"
                rel="noopener noreferrer"
                className="diner-btn flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold transition-all duration-200"
                aria-label="YouTube でフォロー"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
          <div className="diner-divider mb-6"></div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#FF9A33]">
              &copy; 2025 Magic Kingdom Project. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 画像モーダル */}
      {selectedImageUrl && (
        <ImageModal
          imageUrl={selectedImageUrl}
          alt="お品書き"
          isOpen={!!selectedImageUrl}
          onClose={() => setSelectedImageUrl(null)}
          tweetUrl="#"
        />
      )}
    </div>
  );
}
