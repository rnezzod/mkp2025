'use client';

import { useEffect, useState } from 'react';
import { GalleryPost as GalleryPostType } from '@/types/gallery';
import GalleryPost from '@/components/GalleryPost';
import CharacterFilter from '@/components/CharacterFilter';
import SortSelector, { SortOption } from '@/components/SortSelector';
import Pagination from '@/components/Pagination';
import CharacterEditModal from '@/components/CharacterEditModal';
import Link from 'next/link';
import { CHARACTER_LIST } from '@/constants/characters';

const POSTS_PER_PAGE = 18;
const AUTH_KEY = 'gallery_admin_auth_v1';
const AUTH_PASSWORD = 'makeadream';

export default function GalleryAdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);

  const [posts, setPosts] = useState<GalleryPostType[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<GalleryPostType | null>(null);

  // 認証復元
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setAuthed(sessionStorage.getItem(AUTH_KEY) === '1');
  }, []);

  const submitPw = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === AUTH_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
      setPwError(null);
    } else {
      setPwError('パスワードが違います');
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: POSTS_PER_PAGE.toString(),
        sort: sortOption,
      });
      if (selectedCharacters.length > 0) {
        queryParams.append('characters', selectedCharacters.join(','));
      }
      const response = await fetch(`/api/gallery?${queryParams.toString()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('データの取得に失敗しました');
      const data = await response.json();
      setPosts(data.posts);
      setTotalCount(data.totalCount);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authed) return;
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, currentPage, selectedCharacters, sortOption]);

  const handleSaved = (id: string, characters: string[]) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, characters: characters.map((name) => ({ name })) } : p
      )
    );
  };

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  if (authed === null) {
    return <div className="min-h-screen diner-bg" />;
  }

  if (!authed) {
    return (
      <div className="min-h-screen diner-bg diner-checker flex items-center justify-center p-4">
        <form onSubmit={submitPw} className="diner-card p-8 w-full max-w-md">
          <h1
            className="text-2xl font-black text-center mb-6 neon-orange"
            style={{ color: '#FF9A33', fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            GALLERY ADMIN
          </h1>
          <label className="block text-sm font-bold text-[#2D1810] mb-2">
            パスワード
          </label>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            className="w-full px-4 py-2 rounded border-2 border-[#2D1810] bg-[#FFFBF5] text-[#2D1810] font-bold"
            autoFocus
          />
          {pwError && (
            <p className="mt-2 text-sm text-[#FD4B5D] font-bold">{pwError}</p>
          )}
          <button
            type="submit"
            className="diner-btn w-full mt-4 px-4 py-3 rounded bg-[#FF9A33] text-white font-bold"
          >
            入る
          </button>
          <Link
            href="/gallery"
            className="block text-center mt-4 text-sm text-[#2D1810]/70 hover:text-[#2D1810]"
          >
            ← ギャラリーに戻る
          </Link>
        </form>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen diner-bg diner-checker flex items-center justify-center">
        <div className="diner-card p-8 max-w-md">
          <p className="text-lg font-semibold text-[#2D1810]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen diner-bg diner-checker relative">
      <header className="sticky top-0 z-30 diner-header">
        <div className="diner-awning-teal"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 py-4 sm:py-0">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-[#2D1810]"
                style={{ background: 'linear-gradient(135deg, #FD4B5D 0%, #FF3545 100%)' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span
                className="text-2xl sm:text-3xl font-black tracking-tight neon-orange"
                style={{ color: '#FF9A33', fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                GALLERY ADMIN
              </span>
            </div>
            <div className="flex items-center flex-wrap justify-center gap-3">
              <Link
                href="/gallery"
                className="diner-btn px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#45C6B9] transition-all duration-200"
              >
                &larr; ギャラリー
              </Link>
              <SortSelector selectedSort={sortOption} onSelectSort={(s) => { setSortOption(s); setCurrentPage(1); }} />
              <CharacterFilter
                characters={CHARACTER_LIST}
                selectedCharacters={selectedCharacters}
                onSelectCharacters={(cs) => { setSelectedCharacters(cs); setCurrentPage(1); }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="diner-badge flex items-center gap-2 px-6 py-3 bg-[#FFFBF5]">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FD4B5D' }}></div>
            <span className="text-sm font-semibold text-[#2D1810]">
              {totalCount}件 / 編集モード
            </span>
          </div>
          {totalPages > 1 && (
            <div className="diner-badge px-4 py-2 bg-[#FFFBF5]" style={{ borderColor: '#45C6B9' }}>
              <span className="text-xs font-semibold" style={{ color: '#45C6B9' }}>
                ページ {currentPage} / {totalPages}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-[#FF9A33]"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-lg font-medium text-[#2D1810]">該当する画像がありません</p>
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 [&>*]:mb-4 sm:[&>*]:mb-5 [&>*]:break-inside-avoid">
              {posts.map((post) => (
                <GalleryPost key={post.id} post={post} onEdit={setEditing} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </main>

      {editing && (
        <CharacterEditModal
          isOpen={!!editing}
          postId={editing.id}
          postUser={editing.user}
          imageUrl={editing.image}
          initialCharacters={(editing.characters || []).map((c) => c.name)}
          onClose={() => setEditing(null)}
          onSaved={(chars) => handleSaved(editing.id, chars)}
        />
      )}
    </div>
  );
}
