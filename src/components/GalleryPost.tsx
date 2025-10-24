'use client';

import { useState } from 'react';
import { GalleryPost as GalleryPostType } from '@/types/gallery';
import Image from 'next/image';
import ImageModal from './ImageModal';

interface GalleryPostProps {
  post: GalleryPostType;
}

export default function GalleryPost({ post }: GalleryPostProps) {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
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
    <article className="group bg-gradient-to-br from-white to-amber-50/50 border-2 border-orange-300/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-orange-400 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 flex flex-col shadow-lg backdrop-blur-sm">
      <div className="p-4 flex flex-col">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <time className="text-xs text-orange-700 font-medium">
              {formatDate(post.created_at)}
            </time>
            <span className="text-sm font-semibold text-gray-800 mt-1">
              @{post.user}
            </span>
          </div>
        </div>

        {/* 画像表示 */}
        {post.image && (
          <div className="mb-2 flex-shrink-0">
            {/* スマホ：縦1列 */}
            <div className="sm:hidden">
              <div
                onClick={() => setSelectedImageUrl(post.image!)}
                className="relative bg-gray-100 overflow-hidden aspect-[3/4] rounded-xl cursor-pointer group/image"
              >
                <Image
                  src={post.image}
                  alt={`@${post.user} の画像`}
                  fill
                  className="object-cover group-hover/image:scale-105 transition-transform duration-300"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-orange-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* PC：X風レイアウト */}
            <div className="hidden sm:block">
              <div
                onClick={() => setSelectedImageUrl(post.image!)}
                className="relative bg-gray-100 overflow-hidden aspect-[16/10] rounded-xl cursor-pointer group/image"
              >
                <Image
                  src={post.image}
                  alt={`@${post.user} の画像`}
                  fill
                  className="object-cover group-hover/image:scale-105 transition-transform duration-300"
                  sizes="(max-width: 1200px) 50vw, 33vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-orange-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* フッター - ツイートへのリンク */}
        <div className="mt-auto">
          <a
            href={post.tweet_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #45C6B9 0%, #3AB5A8 100%)' }}
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

