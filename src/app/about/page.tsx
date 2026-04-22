'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import mkpData from '@/../../public/mkp_is.json';
import snsData from '@/../../public/SNS_urls.json';

export default function AboutPage() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 初期ローディング（最低1秒間表示）
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#FFF8F0] flex items-center justify-center z-50">
        <Image
          src="/logo.png"
          alt="Loading..."
          width={192}
          height={192}
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
          priority
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
            <Link
              href="/"
              className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight hover:opacity-80 transition-opacity duration-200 cursor-pointer neon-orange animate-neon"
              style={{
                color: '#FF9A33',
                fontFamily: 'Impact, sans-serif',
                fontWeight: 'bold',
                letterSpacing: '0.01em'
              }}
            >
              TASTY VIVID TUNE
            </Link>
            <Link
              href="/"
              className="diner-btn px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#45C6B9] transition-all duration-200"
            >
              &larr; ホーム
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        {/* タイトル */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 leading-none">
            <span className="inline-block hover:scale-110 transition-transform duration-300 neon-orange" style={{ color: '#FF9A33', fontFamily: 'Arial Black, Impact, sans-serif', fontWeight: 'bold' }}>We Are MKP</span>
          </h1>
          <div className="diner-divider max-w-xs mx-auto mt-4"></div>
        </div>

        {/* MKPについての説明 */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="diner-card p-8 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="mb-6">
              <h2 className="text-2xl font-black neon-orange" style={{ color: '#FF9A33' }}>{mkpData.abstruct.title}</h2>
            </div>

            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-[#2D1810]/80">
                {mkpData.abstruct.description}
              </p>
            </div>
          </div>
        </div>

        {/* 各班の紹介 */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-3xl sm:text-4xl font-black text-center mb-12 neon-teal diner-title" style={{ color: '#45C6B9', fontFamily: 'Impact, Arial Black, sans-serif' }}>
            各班の紹介
          </h3>

          <div className="diner-card-teal p-8 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* ダンサー班 */}
              <a
                href={mkpData.departments.dancer.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="diner-btn flex items-center justify-center px-4 py-3 rounded-lg text-sm font-bold text-white bg-[#45C6B9] transition-all duration-200"
              >
                <span className="text-center">{mkpData.departments.dancer.name}</span>
              </a>

              {/* コスチューム班 */}
              <a
                href={mkpData.departments.costume.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="diner-btn flex items-center justify-center px-4 py-3 rounded-lg text-sm font-bold text-white bg-[#45C6B9] transition-all duration-200"
              >
                <span className="text-center">{mkpData.departments.costume.name}</span>
              </a>

              {/* メイク班 */}
              <a
                href={mkpData.departments.makeup.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="diner-btn flex items-center justify-center px-4 py-3 rounded-lg text-sm font-bold text-white bg-[#45C6B9] transition-all duration-200"
              >
                <span className="text-center">{mkpData.departments.makeup.name}</span>
              </a>

              {/* フロート班 */}
              <a
                href={mkpData.departments.float.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="diner-btn flex items-center justify-center px-4 py-3 rounded-lg text-sm font-bold text-white bg-[#45C6B9] transition-all duration-200"
              >
                <span className="text-center">{mkpData.departments.float.name}</span>
              </a>

              {/* 広報班 */}
              <a
                href={mkpData.departments.promotion.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="diner-btn flex items-center justify-center px-4 py-3 rounded-lg text-sm font-bold text-white bg-[#45C6B9] transition-all duration-200"
              >
                <span className="text-center">{mkpData.departments.promotion.name}</span>
              </a>

              {/* 音源班 */}
              <a
                href={mkpData.departments.sound.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="diner-btn flex items-center justify-center px-4 py-3 rounded-lg text-sm font-bold text-white bg-[#45C6B9] transition-all duration-200"
              >
                <span className="text-center">{mkpData.departments.sound.name}</span>
              </a>

              {/* 展示班 */}
              <a
                href={mkpData.departments.display.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="diner-btn flex items-center justify-center px-4 py-3 rounded-lg text-sm font-bold text-white bg-[#45C6B9] transition-all duration-200"
              >
                <span className="text-center">{mkpData.departments.display.name}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 各種SNS */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="diner-card-purple p-8 transition-all duration-300 hover:translate-y-[-2px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#2D1810]" style={{ background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 4h6V3H9v1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black neon-purple" style={{ color: '#9B59B6' }}>各種SNS</h3>
            </div>

            <div className="text-left">
              <p className="text-[#2D1810]/80 mb-6">
                Magic Kingdom Projectの最新情報や活動報告は、各種SNSアカウントでお知らせしています。
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href={snsData.X}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diner-btn flex items-center gap-1 px-4 py-2 rounded-lg bg-[#2D1810] text-white text-xs font-bold transition-all duration-200"
                >
                    X
                </a>
                <a
                  href={snsData.Instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diner-btn px-4 py-2 rounded-lg text-white text-xs font-bold transition-all duration-200"
                  style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}
                >
                  Instagram
                </a>
                <a
                  href={snsData.YouTube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diner-btn px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold transition-all duration-200"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="diner-footer py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium text-[#FF9A33]">
              &copy; 2025 Magic Kingdom Project. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
