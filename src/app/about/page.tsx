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
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="animate-pulse">
          <Image
            src="/white_logo.png"
            alt="Loading..."
            width={192}
            height={192}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5ED] via-[#FFFAF7] to-[#FFF0F0] relative">
      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF9A33]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#45C6B9]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#FD4B5D]/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* ヘッダー */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 border-b-2 border-[#FF9A33]/30 bg-white/95 backdrop-blur-xl shadow-md transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              href="/"
              className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight hover:opacity-80 transition-opacity duration-200 cursor-pointer"
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
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #45C6B9 0%, #3AB5A8 100%)' }}
            >
              ← ホーム
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-32">
        {/* タイトル */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none">
            <span className="inline-block hover:scale-110 transition-transform duration-300" style={{ color: '#FF9A33', fontFamily: 'Arial Black, Impact, sans-serif', fontWeight: 'bold' }}>We Are MKP</span><br/>
          </h1>
        </div>

        {/* MKPについての説明 */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 border-[#FF9A33]/30 hover:border-[#FF9A33]/50 transition-all duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-black" style={{ color: '#FF9A33' }}>{mkpData.abstruct.title}</h2>
            </div>
            
            <div className="space-y-6 text-lg leading-relaxed">
              <p className="text-gray-700">
                {mkpData.abstruct.description}
              </p>
            </div>
          </div>
        </div>

        {/* 各班の紹介 */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-3xl sm:text-4xl font-black text-center mb-12" style={{ color: '#45C6B9' }}>
            各班の紹介
          </h3>
          
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 border-[#45C6B9]/30 hover:border-[#45C6B9]/50 transition-all duration-300">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* ダンサー班 */}
              <a
                href={mkpData.departments.dancer.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #45C6B9 0%, #3AB5A8 100%)' }}
              >
                <span className="text-center">{mkpData.departments.dancer.name}</span>
              </a>

              {/* コスチューム班 */}
              <a
                href={mkpData.departments.costume.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #45C6B9 0%, #3AB5A8 100%)' }}
              >
                <span className="text-center">{mkpData.departments.costume.name}</span>
              </a>

              {/* メイク班 */}
              <a
                href={mkpData.departments.makeup.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #45C6B9 0%, #3AB5A8 100%)' }}
              >
                <span className="text-center">{mkpData.departments.makeup.name}</span>
              </a>

              {/* フロート班 */}
              <a
                href={mkpData.departments.float.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #45C6B9 0%, #3AB5A8 100%)' }}
              >
                <span className="text-center">{mkpData.departments.float.name}</span>
              </a>

              {/* 広報班 */}
              <a
                href={mkpData.departments.promotion.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #45C6B9 0%, #3AB5A8 100%)' }}
              >
                <span className="text-center">{mkpData.departments.promotion.name}</span>
              </a>

              {/* 音源班 */}
              <a
                href={mkpData.departments.sound.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #45C6B9 0%, #3AB5A8 100%)' }}
              >
                <span className="text-center">{mkpData.departments.sound.name}</span>
              </a>

              {/* 展示班 */}
              <a
                href={mkpData.departments.display.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #45C6B9 0%, #3AB5A8 100%)' }}
              >
                <span className="text-center">{mkpData.departments.display.name}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 各種SNS */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-2 border-[#9B59B6]/30 hover:border-[#9B59B6]/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 4h6V3H9v1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black" style={{ color: '#9B59B6' }}>各種SNS</h3>
            </div>
            
            <div className="text-left">
              <p className="text-gray-700 mb-6">
                Magic Kingdom Projectの最新情報や活動報告は、各種SNSアカウントでお知らせしています。
              </p>
              <div className="flex justify-center gap-2">
                <a
                  href={snsData.X}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 rounded-full bg-black text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
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
                  className="px-3 py-2 rounded-full text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}
                >
                  Instagram
                </a>
                <a
                  href={snsData.YouTube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-full bg-red-600 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  YouTube
                </a>
              </div>
            </div>
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
