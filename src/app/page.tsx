'use client';

import { useEffect, useState } from 'react';
import { GalleryPost as GalleryPostType } from '@/types/gallery';
import GalleryPost from '@/components/GalleryPost';
import CharacterFilter from '@/components/CharacterFilter';
import SortSelector, { SortOption } from '@/components/SortSelector';
import Pagination from '@/components/Pagination';

const POSTS_PER_PAGE = 20;

export default function Home() {
  const [posts, setPosts] = useState<GalleryPostType[]>([]);
  const [allPosts, setAllPosts] = useState<GalleryPostType[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-800 border-t-blue-500 dark:border-t-blue-400"></div>
          <p className="mt-6 text-base font-medium text-gray-700 dark:text-gray-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            環境変数が正しく設定されているか確認してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      {/* ヘッダー */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                ギャラリー
              </h1>
            </div>
            <div className="flex items-center gap-3">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 統計情報 */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {posts.length}件のポスト
              </span>
            </div>
            {selectedCharacters.length > 0 && (
              <>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {selectedCharacters.join('、')}
                </span>
              </>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                ページ {currentPage} / {totalPages}
              </span>
            </div>
          )}
        </div>

        {/* ギャラリーグリッド */}
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {selectedCharacters.length > 0
                ? '該当するポストが見つかりませんでした'
                : 'ポストがありません'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedCharacters.length > 0
                ? 'フィルター条件を変更してみてください'
                : 'コンテンツが追加されるまでお待ちください'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <footer className="mt-20 py-12 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Powered by{' '}
              <span className="font-bold text-gray-900 dark:text-white">microCMS</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
