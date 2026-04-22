'use client';

import { useEffect, useState } from 'react';

/**
 * グローバル装飾レイヤー:
 *  - スクロール進捗バー (チェッカー柄)
 *  - フィルムグレインオーバーレイ
 */
export default function SiteOverlays() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      h.style.setProperty('--scroll-progress', `${pct}%`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="scroll-progress" aria-hidden />
      <div className="grain-overlay" aria-hidden />
    </>
  );
}
