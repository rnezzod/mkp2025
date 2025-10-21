'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  imageUrl: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  onImageClick: () => void;
}

export default function ImageModal({
  imageUrl,
  alt,
  isOpen,
  onClose,
  onImageClick,
}: ImageModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.remove('no-zoom');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.add('no-zoom');
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.add('no-zoom');
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 group"
        aria-label="閉じる"
      >
        <svg
          className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* 説明テキスト */}
      <div className="absolute top-6 left-6 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
        <p className="text-sm text-white font-medium">
          画像をクリックでポストに移動
        </p>
      </div>

      {/* 画像 */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onImageClick();
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          width={1200}
          height={1200}
          className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          quality={100}
          priority
        />
      </div>
    </div>
  );
}

