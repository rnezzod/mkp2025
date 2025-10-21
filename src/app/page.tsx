'use client';

import Link from 'next/link';

export default function Home() {
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
      <main className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-6xl sm:text-7xl md:text-8xl font-black mb-12">
            <span style={{ color: '#FF9A33' }}>TASTY</span><br/>
            <span style={{ color: '#45C6B9' }}>VIVID</span><br/>
            <span style={{ color: '#FD4B5D' }}>TUNE</span>
          </h2>
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
