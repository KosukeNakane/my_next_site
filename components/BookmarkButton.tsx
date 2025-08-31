"use client";
import { useEffect, useState } from "react";
import BookmarkIcon from '@mui/icons-material/Bookmark';

type Props = {
  path: string;
  title: string;
};

export default function BookmarkButton({ path, title }: Props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await fetch('/api/session', { cache: 'no-store' });
        const sd = await s.json();
        if (!cancelled) setLoggedIn(!!sd.logged_in);
        if (sd.logged_in) {
          const b = await fetch(`/api/bookmarks?path=${encodeURIComponent(path)}`, { cache: 'no-store' });
          const bd = await b.json();
          if (!cancelled) setActive(!!bd.bookmarked);
        } else {
          if (!cancelled) setActive(false);
        }
      } catch { }
    })();
    return () => { cancelled = true; };
  }, [path]);

  const toggle = async () => {
    if (!loggedIn) {
      try {
        const evt = new CustomEvent('open-auth-modal', { detail: { mode: 'login' } });
        window.dispatchEvent(evt);
      } catch {
        alert('ブックマークはログイン後に利用できます。');
      }
      return;
    }
    setLoading(true);
    try {
      if (!active) {
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, title }),
        });
        const data = await res.json();
        if (data.success) setActive(true);
      } else {
        const res = await fetch('/api/bookmarks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path }),
        });
        const data = await res.json();
        if (data.success) setActive(false);
      }
    } catch { }
    finally { setLoading(false); }
  };

  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); toggle(); }}
      disabled={loading}
      title={active ? 'ブックマーク解除' : 'ブックマーク'}
      className={`absolute bottom-3 right-3 z-10 rounded-full border shadow p-2 bg-white/90 hover:bg-white ${active ? 'border-sky-300' : 'border-gray-300'}`}
      aria-label={active ? 'ブックマーク解除' : 'ブックマーク'}
    >
      <BookmarkIcon sx={{ fontSize: 22, color: active ? '#38bdf8' : '#9ca3af' }} />
    </button>
  );
}
