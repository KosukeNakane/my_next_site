"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

function isModifiedEvent(e: MouseEvent) {
  return e.metaKey || e.altKey || e.ctrlKey || e.shiftKey;
}

function findAnchor(el: Element | null): HTMLAnchorElement | null {
  while (el) {
    if (el instanceof HTMLAnchorElement) return el;
    el = el.parentElement;
  }
  return null;
}

export default function RouteTransition() {
  const [entering, setEntering] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const leavingTimer = useRef<number | null>(null);
  const FADE_MS = 160; // fade duration before navigating (slightly shorter)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (isModifiedEvent(e) || e.defaultPrevented) return;
      const a = findAnchor(e.target as Element);
      if (!a) return;
      if (a.target && a.target !== "_self") return;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const url = new URL(href, location.origin);
      if (url.origin !== location.origin) return;
      if (a.hasAttribute('data-no-transition')) return;

      const destPath = url.pathname + url.search;
      const currPath = location.pathname + location.search;
      // If navigating to the exact same path (likely hash-only or noop), skip overlay
      if (destPath === currPath) return;

      e.preventDefault();

      // Store pending target if hash exists
      const id = url.hash.replace(/^#/, '');
      try { if (id) sessionStorage.setItem('pendingTarget', id); } catch {}

      setLeaving(true);
      // Navigate after overlay fully covers
      window.setTimeout(() => router.push(destPath + url.hash), FADE_MS);
    };

    const onAppNavigate = (evt: Event) => {
      const ce = evt as CustomEvent<{ href: string; pendingTarget?: string }>;
      const href = ce?.detail?.href;
      if (!href) return;
      try { if (ce.detail?.pendingTarget) sessionStorage.setItem('pendingTarget', ce.detail.pendingTarget); } catch {}
      setLeaving(true);
      window.setTimeout(() => router.push(href), FADE_MS);
    };

    // Enter animation on mount
    const t = setTimeout(() => setEntering(false), 200);
    document.addEventListener('click', onClick, { capture: true });
    window.addEventListener('app:navigate', onAppNavigate as EventListener);

    return () => {
      clearTimeout(t);
      document.removeEventListener('click', onClick, { capture: true } as any);
      window.removeEventListener('app:navigate', onAppNavigate as EventListener);
    };
  }, [router]);

  // When the route (pathname) changes, run enter animation and clear leaving
  useEffect(() => {
    // On first mount pathname is defined; treat as entry end handled by initial effect
    setLeaving(false);
    setEntering(true);
    const t = setTimeout(() => setEntering(false), 200);
    return () => clearTimeout(t);
  }, [pathname]);

  // Safety: if leaving stays true without route change, auto-clear after timeout
  useEffect(() => {
    if (leaving) {
      if (leavingTimer.current) window.clearTimeout(leavingTimer.current);
      leavingTimer.current = window.setTimeout(() => setLeaving(false), 1200) as unknown as number;
      return () => { if (leavingTimer.current) window.clearTimeout(leavingTimer.current); };
    }
  }, [leaving]);

  const show = entering || leaving;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-0 z-[200] bg-white transition-opacity duration-200 ${show ? 'opacity-100' : 'opacity-0'} pointer-events-none`}
    />
  );
}
