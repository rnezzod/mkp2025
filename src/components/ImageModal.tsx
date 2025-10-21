'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface ImageModalProps {
  imageUrl: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  tweetUrl: string;
}

export default function ImageModal({
  imageUrl,
  alt,
  isOpen,
  onClose,
  tweetUrl,
}: ImageModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-200 shadow-lg"
        aria-label="閉じる"
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
            strokeWidth={3}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* 画像 */}
      <div
        className="relative max-w-[95vw] max-h-[95vh] cursor-pointer group"
        onClick={(e) => {
          e.stopPropagation();
          window.open(tweetUrl, '_blank', 'noopener,noreferrer');
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          width={1200}
          height={1200}
          className="w-auto h-auto max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl"
          quality={100}
          priority
        />
        {/* ホバー時のヒント */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 py-2 bg-teal-500 text-white text-sm font-bold rounded-full shadow-lg pointer-events-none">
          クリックでポストを見る
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

