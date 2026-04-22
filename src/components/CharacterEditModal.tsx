'use client';

import { useEffect, useState } from 'react';
import { CHARACTER_LIST } from '@/constants/characters';

interface CharacterEditModalProps {
  isOpen: boolean;
  postId: string;
  postUser: string;
  initialCharacters: string[];
  imageUrl?: string;
  onClose: () => void;
  onSaved: (characters: string[]) => void;
}

export default function CharacterEditModal({
  isOpen,
  postId,
  postUser,
  initialCharacters,
  imageUrl,
  onClose,
  onSaved,
}: CharacterEditModalProps) {
  const [selected, setSelected] = useState<string[]>(initialCharacters);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelected(initialCharacters);
    setError(null);
  }, [initialCharacters, isOpen]);

  if (!isOpen) return null;

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/gallery/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: postId, characters: selected }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `保存に失敗しました (${res.status})`);
      }
      onSaved(selected);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : '不明なエラー');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="diner-card bg-[#FFFBF5] w-full max-w-2xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-lg sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー (固定・画像サムネ付き) */}
        <div className="px-4 py-3 border-b-2 border-[#2D1810] flex items-center gap-3 flex-shrink-0">
          {imageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageUrl}
              alt=""
              className="w-12 h-12 object-cover rounded border-2 border-[#2D1810] flex-shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <h3
              className="text-sm sm:text-base font-bold text-[#2D1810] truncate"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              キャラクターを修正
            </h3>
            <p className="text-xs text-[#2D1810]/70 truncate">
              @{postUser} · 選択 <span className="font-bold">{selected.length}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#2D1810] hover:opacity-70 text-2xl leading-none flex-shrink-0 px-2"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        {/* 本体 (スクロール可) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {CHARACTER_LIST.map((name) => {
              const checked = selected.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggle(name)}
                  className={`diner-btn px-2 py-1.5 rounded text-[11px] sm:text-xs font-bold text-left transition-all duration-150 ${
                    checked
                      ? 'bg-[#FF9A33] text-white border-[#2D1810]'
                      : 'bg-[#E8E0D8] text-[#2D1810] border-[#2D1810]'
                  }`}
                >
                  <span className="inline-block w-3.5">{checked ? '✓' : ''}</span>
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="px-4 py-2 text-xs text-[#FD4B5D] font-bold flex-shrink-0 border-t border-[#2D1810]/20">
            {error}
          </div>
        )}

        {/* フッター (固定) */}
        <div className="p-3 sm:p-4 border-t-2 border-[#2D1810] flex gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={saving}
            className="diner-btn flex-1 px-3 py-2 rounded bg-[#E8E0D8] text-[#2D1810] text-sm font-bold disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="diner-btn flex-1 px-3 py-2 rounded bg-[#45C6B9] text-white text-sm font-bold disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
