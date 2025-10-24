'use client';

import { useEffect, useState } from 'react';
import { GalleryPost as GalleryPostType } from '@/types/gallery';
import GalleryPost from '@/components/GalleryPost';
import CharacterFilter from '@/components/CharacterFilter';
import SortSelector, { SortOption } from '@/components/SortSelector';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import snsData from '@/../../public/SNS_urls.json';

const POSTS_PER_PAGE = 18;

export default function GalleryPage() {
  const [posts, setPosts] = useState<GalleryPostType[]>([]);
  const [allPosts, setAllPosts] = useState<GalleryPostType[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 初期ローディング（最低1秒間表示）
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await response.json();
        setAllPosts(data.posts);
        setPosts(data.posts);
        setCharacters(data.characters);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  useEffect(() => {
    let filtered = [...allPosts];

    // charactersが空または存在しないポストを除外
    filtered = filtered.filter((post) => {
      return post.characters && post.characters.length > 0;
    });

    // フィルタリング: 選択した全てのキャラクターを含む投稿のみ（AND条件）
    if (selectedCharacters.length > 0) {
      filtered = filtered.filter((post) => {
        const postCharacterNames = post.characters?.map((char) => char.name) || [];
        return selectedCharacters.every((selectedChar) =>
          postCharacterNames.includes(selectedChar)
        );
      });
    }

    // ソート
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
          return 0;
      }
    });

    setPosts(sorted);
    setCurrentPage(1); // フィルター・ソート変更時は1ページ目に戻る
  }, [selectedCharacters, sortOption, allPosts]);

  const handleSelectCharacters = (characters: string[]) => {
    setSelectedCharacters(characters);
  };

  const handleSelectSort = (sort: SortOption) => {
    setSortOption(sort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ページネーション用の計算
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  if (isInitialLoading || loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="animate-pulse">
          <img
            src="/white_logo.png"
            alt="Loading..."
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-orange-900 mb-2">{error}</p>
          <p className="text-sm text-orange-700">
            環境変数が正しく設定されているか確認してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-100 to-red-50 relative">
      {/* 背景装飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#FF9A33]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#45C6B9]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-[#FD4B5D]/5 rounded-full blur-3xl"></div>
      </div>
      {/* ヘッダー */}
      <header className={`fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-b-2 border-orange-300/50 shadow-lg transition-transform duration-300 ${
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 py-4 sm:py-0">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #FD4B5D 0%, #FF3545 100%)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-2xl sm:text-3xl font-black tracking-tight hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                  style={{ color: '#FF9A33' }}
                >
                  ギャラリー
                </button>
              </div>
            </div>
            <div className="flex items-center flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #FF9A33 0%, #FF8820 100%)' }}
              >
                ← ホーム
              </Link>
              <SortSelector
                selectedSort={sortOption}
                onSelectSort={handleSelectSort}
              />
              <CharacterFilter
                characters={characters}
                selectedCharacters={selectedCharacters}
                onSelectCharacters={handleSelectCharacters}
              />
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-56 md:pt-32">
        {/* 統計情報 */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 py-3 rounded-full bg-white/95 backdrop-blur-md border-2 border-orange-300/50 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#45C6B9' }}></div>
              <span className="text-sm font-semibold text-orange-900">
                {posts.length}件の画像
              </span>
            </div>
            {selectedCharacters.length > 0 && (
              <>
                <div className="w-full sm:w-px h-px sm:h-4 bg-orange-300"></div>
                <span className="text-xs font-medium text-orange-700">
                  {selectedCharacters.join('、')}
                </span>
              </>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border-2 border-[#45C6B9]/50 shadow-lg">
              <span className="text-xs font-semibold" style={{ color: '#45C6B9' }}>
                ページ {currentPage} / {totalPages}
              </span>
            </div>
          )}
        </div>

        {/* ギャラリーグリッド */}
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg font-medium text-orange-900 mb-2">
              {selectedCharacters.length > 0
                ? '該当する画像が見つかりませんでした'
                : '画像がありません'}
            </p>
            <p className="text-sm text-orange-700">
              {selectedCharacters.length > 0
                ? 'フィルター条件を変更してみてください'
                : 'コンテンツが追加されるまでお待ちください'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-start">
              {currentPosts.map((post) => (
                <GalleryPost key={post.id} post={post} />
              ))}
            </div>

            {/* ページネーション */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      {/* フッター */}
      <footer className="mt-20 py-12 border-t border-orange-300/50 bg-orange-100/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SNSリンクセクション */}
          <div className="mb-8">
            <h4 className="text-center text-lg font-bold mb-6" style={{ color: '#FF9A33' }}>
              Follow Us
            </h4>
            <div className="flex justify-center gap-6">
              {/* X (Twitter) リンク */}
              <a
                href={snsData.X}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label="X (Twitter) でフォロー"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-sm">X</span>
              </a>

              {/* Instagram リンク */}
              <a
                href={snsData.Instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}
                aria-label="Instagram でフォロー"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-sm">Instagram</span>
              </a>

              {/* YouTube リンク */}
              <a
                href={snsData.YouTube}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label="YouTube でフォロー"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-sm">YouTube</span>
              </a>
            </div>
          </div>

          {/* コピーライト */}
          <div className="text-center">
            <p className="text-sm font-medium text-orange-700">
              © 2025 Magic Kingdom Project. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

