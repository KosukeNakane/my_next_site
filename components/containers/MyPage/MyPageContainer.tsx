"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useIsMobile from "../../../hooks/useIsMobile";
import DesktopMyPage, { type BookmarkItem } from "../../presentational/MyPage/MyPage";
import SpMyPage from "../../presentational/MyPage/SpMyPage";

const MyPageContainer = () => {
  const router = useRouter();
  const isMobile = useIsMobile(768);

  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<BookmarkItem[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/session", { cache: "no-store" });
        const data = await res.json();
        if (data.logged_in) {
          setUsername(data.username || null);
          const b = await fetch('/api/bookmarks', { cache: 'no-store' });
          const bd = await b.json();
          if (bd.success && Array.isArray(bd.items)) setItems(bd.items);
          try {
            const a = await fetch('/api/images/random', { cache: 'no-store' });
            const ad = await a.json();
            if (ad?.image) setAvatar(ad.image);
          } catch {}
        }
      } catch {
        setError("セッション取得に失敗しました");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const bookmarkLabel = (path: string) => {
    const noQuery = path.split('?')[0].split('#')[0];
    const parts = noQuery.split('/').filter(Boolean);
    const label = parts.length ? parts.join(' ▶ ') : '/';
    try { return decodeURIComponent(label); } catch { return label; }
  };

  const onCardClick = (path: string) => {
    const [base, hash] = path.split('#');
    try {
      if (hash) sessionStorage.setItem('pendingTarget', hash);
    } catch {}
    router.push(base);
  };

  const onDelete = async (path: string) => {
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });
      const d = await res.json();
      if (d.success) setItems(prev => prev.filter(p => p.path !== path));
    } catch {}
  };

  const common = { username, loading, error, avatar, items, onCardClick, onDelete, bookmarkLabel };
  const thumbFor = (path: string): string => {
    const noQuery = path.split('?')[0];
    const [base, hash] = noQuery.split('#');
    const id = hash || '';
    const num = parseInt(id.split('-')[1] || '1', 10) || 1;
    if (base.startsWith('/food')) {
      const n = Math.min(Math.max(num, 1), 8);
      const pad = String(n).padStart(2, '0');
      return `/images/food/food_${pad}.jpg`;
    }
    if (base.startsWith('/himeji')) {
      const n = Math.min(Math.max(num, 1), 5);
      const pad = String(n).padStart(2, '0');
      return `/images/himeji/scenery_${pad}.JPG`;
    }
    if (base.startsWith('/tokyo-yokohama')) {
      switch (num) {
        case 1: return '/images/tokyo-yokohama/TY_01.jpg';
        case 2: return '/images/tokyo-yokohama/TY_02.jpg';
        case 3: return '/images/tokyo-yokohama/TY_03.jpg';
        case 4: return '/images/tokyo-yokohama/TY_04.jpg';
        case 5: return '/images/home/home_02.jpg';
        case 6: return '/images/home/home_03.jpg';
        default: return '/images/tokyo-yokohama/TY_01.jpg';
      }
    }
    // Default placeholder
    return '/icons/icon.jpg';
  };

  const commonWithThumb = { ...common, thumbFor } as const;
  return isMobile ? <SpMyPage {...commonWithThumb} /> : <DesktopMyPage {...commonWithThumb} />;
};

export default MyPageContainer;
