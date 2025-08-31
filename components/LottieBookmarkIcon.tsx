"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  size?: number; // px
  frame?: 'start' | 'end';
  className?: string;
  title?: string;
};

const LOTTIE_JSON_SRC = '/lottifiles/Animation Bookmark.json';

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

async function ensureLottie(): Promise<LottieApi | null> {
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
}

export default function LottieBookmarkIcon({ size = 22, frame = 'end', className = '', title }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<LottieAnimation | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    (async () => {
      const lottie = await ensureLottie();
      if (!lottie || disposed) return;
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';
      const host = document.createElement('div');
      host.style.width = `${size}px`;
      host.style.height = `${size}px`;
      containerRef.current.appendChild(host);
      const anim = lottie.loadAnimation({
        container: host,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: LOTTIE_JSON_SRC,
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
      });
      anim.addEventListener?.('DOMLoaded', () => { if (!disposed) setReady(true); });
      anim.addEventListener?.('data_ready', () => { if (!disposed) setReady(true); });
      animRef.current = anim;
    })();
    return () => {
      disposed = true;
      try { animRef.current?.destroy?.(); } catch {}
      animRef.current = null;
    };
  }, [size]);

  useEffect(() => {
    const a = animRef.current;
    if (!a || !ready) return;
    try {
      const end = (a.totalFrames ?? 60) - 1;
      if (frame === 'end') a.goToAndStop?.(end, true);
      else a.goToAndStop?.(0, true);
    } catch {}
  }, [ready, frame]);

  return (
    <span className={className} title={title} aria-hidden={!title}>
      <div ref={containerRef} style={{ width: size, height: size }} />
    </span>
  );
}
