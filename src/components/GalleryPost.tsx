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

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImageUrl(null);
  };

  const handleNavigateToPost = () => {
    window.open(post.tweet_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
      <div className="p-5">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-start mb-4">
          <time className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {formatDate(post.created_at)}
          </time>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-sm font-semibold">{post.likes.toLocaleString()}</span>
          </div>
        </div>

        {/* テキスト部分 */}
        {post.text && (
          <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100 mb-4 whitespace-pre-wrap">
            {post.text}
          </p>
        )}

        {/* 画像グリッド */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4">
            <div
              className={`grid gap-2 rounded-2xl overflow-hidden ${
                post.images.length === 1
                  ? 'grid-cols-1'
                  : post.images.length === 2
                  ? 'grid-cols-2'
                  : post.images.length === 3
                  ? 'grid-cols-2'
                  : 'grid-cols-2'
              }`}
            >
              {post.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(image.url)}
                  className={`relative bg-gray-100 dark:bg-gray-800 group/image overflow-hidden cursor-pointer ${
                    post.images.length === 1
                      ? 'aspect-video'
                      : post.images.length === 3 && index === 0
                      ? 'col-span-2 aspect-video'
                      : 'aspect-square'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${post.text.substring(0, 50)}... の画像 ${index + 1}`}
                    fill
                    className="object-cover group-hover/image:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/5 transition-colors duration-300" />
                  
                  {/* 拡大アイコン */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-900 dark:text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* フッター - ツイートへのリンク */}
        <a
          href={post.tweet_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          元のポストを見る
        </a>
      </div>

      {/* 画像モーダル */}
      {selectedImageUrl && (
        <ImageModal
          imageUrl={selectedImageUrl}
          alt={post.text}
          isOpen={!!selectedImageUrl}
          onClose={handleCloseModal}
          onImageClick={handleNavigateToPost}
        />
      )}
    </article>
  );
}

