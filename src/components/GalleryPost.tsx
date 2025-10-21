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

  const removeUrls = (text: string) => {
    // URLを削除する正規表現（http, https両対応）
    return text.replace(/https?:\/\/\S+/g, '').trim();
  };

  return (
    <>
    <article className="group bg-gradient-to-br from-white to-amber-50 border-2 border-orange-300 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-orange-400 hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-lg">
      <div className="p-3 flex flex-col">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-start mb-2">
          <time className="text-xs text-orange-700 font-medium">
            {formatDate(post.created_at)}
          </time>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500 text-white shadow-md transition-colors">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-xs font-semibold">{post.likes.toLocaleString()}</span>
          </div>
        </div>

        {/* テキスト部分 */}
        {post.text && removeUrls(post.text) && (
          <p className="text-sm leading-relaxed text-gray-800 mb-2 whitespace-pre-wrap">
            {removeUrls(post.text)}
          </p>
        )}

        {/* 画像グリッド */}
        {post.images && post.images.length > 0 && (
          <div className="mb-2 flex-shrink-0">
            <div className="grid gap-1.5 rounded-xl overflow-hidden grid-cols-1">
              {post.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => {
                    // PC（640px以上）でのみクリック拡大を有効化
                    if (window.innerWidth >= 640) {
                      setSelectedImageUrl(image.url);
                    }
                  }}
                  className="relative bg-gray-100 overflow-hidden aspect-[3/4] sm:aspect-[4/3] sm:cursor-pointer group/image"
                >
                  <Image
                    src={image.url}
                    alt={`${post.text.substring(0, 50)}... の画像 ${index + 1}`}
                    fill
                    className="object-cover sm:group-hover/image:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                  />
                  {/* 拡大アイコン（PCのみ表示） */}
                  <div className="hidden sm:flex absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 items-center justify-center">
                    <div className="opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-orange-900"
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
        <div className="mt-auto">
          <a
            href={post.tweet_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-200"
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
        alt={post.text}
        isOpen={!!selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
        tweetUrl={post.tweet_url}
      />
    )}
    </>
  );
}

