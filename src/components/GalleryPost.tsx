'use client';

import { useEffect, useRef, useState } from 'react';
import { GalleryPost as GalleryPostType } from '@/types/gallery';
import Image from 'next/image';
import ImageModal from './ImageModal';

interface GalleryPostProps {
  post: GalleryPostType;
  onEdit?: (post: GalleryPostType) => void;
}

export default function GalleryPost({ post, onEdit }: GalleryPostProps) {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  // スクロール連動 reveal
  useEffect(() => {
    const el = articleRef.current;
    if (!el || revealed) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed]);

  // 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = articleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--tilt-x', `${-y * 4}deg`);
    el.style.setProperty('--tilt-y', `${x * 5}deg`);
  };
  const handleMouseLeave = () => {
    const el = articleRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', `0deg`);
    el.style.setProperty('--tilt-y', `0deg`);
  };

  // 画像が読み込めない (鍵垢・ツイ消し等) 投稿は表示しない
  if (imageError) return null;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  return (
    <>
    <article
      ref={articleRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group diner-card tilt-card reveal ${revealed ? 'is-visible' : ''} overflow-hidden hover:shadow-[6px_6px_0px_#2D1810] transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 pt-6 flex flex-col">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <time className="text-xs text-[#2D1810]/60 font-medium">
              {formatDate(post.created_at)}
            </time>
            <span className="text-sm font-bold text-[#2D1810] mt-1">
              @{post.user}
            </span>
          </div>
        </div>

        {/* 画像表示 */}
        {post.image && (
          <div className="mb-2 flex-shrink-0">
            <div
              onClick={() => setSelectedImageUrl(post.image!)}
              className="relative bg-[#E8E0D8] overflow-hidden rounded-lg border-2 border-[#2D1810] cursor-pointer group/image"
            >
              <Image
                src={post.image}
                alt={`@${post.user} の画像`}
                width={800}
                height={600}
                className="w-full h-auto max-h-[400px] sm:max-h-[500px] object-contain group-hover/image:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-[#2D1810] shadow-[2px_2px_0px_#2D1810]">
                  <svg className="w-6 h-6 text-[#2D1810]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* キャラクタータグ (常時表示、Awwwards 風チップ) */}
        {post.characters && post.characters.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {post.characters.map((c) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-[#FFFBF5] text-[#2D1810] border-2 border-[#2D1810] shadow-[2px_2px_0_#2D1810] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#FF9A33] transition-all duration-150"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9A33]" />
                {c.name}
              </span>
            ))}
          </div>
        )}

        {/* フッター - ツイートへのリンク */}
        <div className="mt-auto flex flex-wrap gap-2">
          <a
            href={post.tweet_url}
            target="_blank"
            rel="noopener noreferrer"
            className="diner-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#45C6B9] transition-all duration-200"
          >
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            元のポストを見る
          </a>
          {onEdit && (
            <button
              onClick={() => onEdit(post)}
              className="diner-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#FF9A33] transition-all duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              キャラを修正
            </button>
          )}
        </div>
      </div>
    </article>

    {/* 画像モーダル */}
    {selectedImageUrl && (
      <ImageModal
        imageUrl={selectedImageUrl}
        alt={`@${post.user} の画像`}
        isOpen={!!selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
        tweetUrl={post.tweet_url}
      />
    )}
    </>
  );
}
