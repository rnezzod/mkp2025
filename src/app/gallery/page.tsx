'use client';

import { useEffect, useState } from 'react';
import { GalleryPost as GalleryPostType } from '@/types/gallery';
import GalleryPost from '@/components/GalleryPost';
import CharacterFilter from '@/components/CharacterFilter';
import SortSelector, { SortOption } from '@/components/SortSelector';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

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
        case 'likes':
          return b.likes - a.likes;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-red-500"></div>
          <p className="mt-6 text-base font-medium text-orange-900">読み込み中...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-100 to-red-50">
      {/* ヘッダー */}
      <header className={`fixed top-0 left-0 right-0 z-30 bg-orange-100/95 backdrop-blur-xl border-b border-orange-300/50 shadow-md transition-transform duration-300 ${
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 py-4 sm:py-0">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-orange-900">
                  ギャラリー
                </h1>
              </Link>
            </div>
            <div className="flex items-center flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 rounded-full text-xs font-bold text-orange-900 bg-white border-2 border-orange-300 hover:bg-orange-50 hover:border-orange-400 shadow-md hover:shadow-lg transition-all duration-200"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-44 md:pt-32">
        {/* 統計情報 */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 py-3 rounded-full bg-white/90 border border-orange-300 shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-orange-900">
                {posts.length}件のポスト
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-teal-300 shadow-md">
              <span className="text-xs font-semibold text-teal-800">
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
                ? '該当するポストが見つかりませんでした'
                : 'ポストがありません'}
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

