"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  path: string;
  title: string;
  inline?: boolean; // when true, render inline (no absolute positioning)
};

// JSON animation under public/lottifiles
const LOTTIE_JSON_SRC = '/lottifiles/Animation Bookmark.json';

export default function BookmarkButton({ path, title, inline = false }: Props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  type LottieAnimation = {
    stop?: () => void;
    play?: () => void;
    setDirection?: (dir: number) => void;
    goToAndStop?: (value: number, isFrame: boolean) => void;
    addEventListener?: (name: string, cb: (...args: unknown[]) => void, options?: unknown) => void;
    removeEventListener?: (name: string, cb: (...args: unknown[]) => void) => void;
    totalFrames?: number;
    destroy?: () => void;
  };
  type LottieApi = {
    loadAnimation: (params: {
      container: HTMLElement;
      renderer: 'svg' | 'canvas' | 'html';
      loop?: boolean;
      autoplay?: boolean;
      path?: string;
      animationData?: unknown;
      rendererSettings?: Record<string, unknown>;
    }) => LottieAnimation;
  };

  const animRef = useRef<LottieAnimation | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [animReady, setAnimReady] = useState(false);

  const ensureLottie = async (): Promise<LottieApi | null> => {
    if (typeof window === 'undefined') return null;
    if ((window as Window & { lottie?: unknown }).lottie) return (window as Window & { lottie?: unknown }).lottie as LottieApi;
    await new Promise<void>((resolve) => {
      const existing = document.querySelector('script[data-lottie-cdn]') as HTMLScriptElement | null;
      if (existing) {
        if ((window as Window & { lottie?: unknown }).lottie) return resolve();
        existing.addEventListener('load', () => resolve(), { once: true } as AddEventListenerOptions);
        setTimeout(() => resolve(), 50);
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js';
      s.async = true;
      s.setAttribute('data-lottie-cdn', 'true');
      s.addEventListener('load', () => resolve(), { once: true } as AddEventListenerOptions);
      document.head.appendChild(s);
    });
    return ((window as Window & { lottie?: unknown }).lottie as LottieApi) || null;
  };

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

  // Initialize lottie-web with JSON (once)
  useEffect(() => {
    let disposed = false;
    (async () => {
      const lottie = await ensureLottie();
      if (!lottie || disposed) return;
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';
      const host = document.createElement('div');
      host.style.width = '30px';
      host.style.height = '30px';
      containerRef.current.appendChild(host);
      const anim = lottie.loadAnimation({
        container: host,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: LOTTIE_JSON_SRC,
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
      });
      anim.addEventListener?.('DOMLoaded', () => { if (!disposed) setAnimReady(true); });
      anim.addEventListener?.('data_ready', () => { if (!disposed) setAnimReady(true); });
      animRef.current = anim;
    })();
    return () => {
      disposed = true;
      try { animRef.current?.destroy?.(); } catch { }
      animRef.current = null;
    };
  }, []);

  // Sync static frame to current active state when ready or state changes
  useEffect(() => {
    const a = animRef.current;
    if (!a || !animReady) return;
    // If currently animating, don't override frames
    if (playing) return;
    try {
      const end = (a.totalFrames ?? 60) - 1;
      if (active) a.goToAndStop?.(end, true);
      else a.goToAndStop?.(0, true);
    } catch { }
  }, [animReady, active, playing]);

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
        if (data.success) {
          setActive(true);
          // Play animation only when adding bookmark
          try {
            const a = animRef.current; if (a) {
              const onComplete = () => { setPlaying(false); };
              const start = () => {
                setPlaying(true);
                a.removeEventListener?.('complete', onComplete);
                a.stop?.();
                a.setDirection?.(1);
                a.play?.();
                a.addEventListener?.('complete', onComplete, { once: true });
              };
              if (animReady) start(); else a.addEventListener?.('data_ready', start, { once: true });
            }
          } catch { }
        }
      } else {
        const res = await fetch('/api/bookmarks', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path }),
        });
        const data = await res.json();
        if (data.success) {
          setActive(false);
          // Do not animate when removing bookmark; ensure overlay hidden and frame to start
          setPlaying(false);
          try { const a = animRef.current; a?.stop?.(); a?.goToAndStop?.(0, true); } catch { }
        }
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
      className={`${inline ? '' : 'absolute bottom-3 right-3 z-10'} rounded-full border shadow p-2 bg-white/90 hover:bg-white ${active ? 'border-sky-300' : 'border-gray-300'} relative`}
      aria-label={active ? 'ブックマーク解除' : 'ブックマーク'}
    >
      {/* Lottie-web host as the only icon (always centered); scale up slightly while animating */}
      <div
        ref={containerRef}
        className={`pointer-events-none flex items-center justify-center`}
        style={{ width: 30, height: 30 }}
      />
    </button>
  );
}
