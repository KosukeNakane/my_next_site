"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getHeaderOffset(): number {
  // Try actual header height first
  const header = document.querySelector('header');
  const h = header instanceof HTMLElement ? header.offsetHeight : 0;
  if (h > 0) return h + (Number((window as any).visualViewport?.offsetTop || 0));

  // Fallback to CSS variable --header-offset
  const cssVar = getComputedStyle(document.documentElement).getPropertyValue('--header-offset');
  const parsed = parseInt(cssVar, 10);
  return Number.isFinite(parsed) ? parsed : 56;
}

function getExtraGap(): number {
  const cssVar = getComputedStyle(document.documentElement).getPropertyValue('--anchor-gap');
  const parsed = parseInt(cssVar, 10);
  return Number.isFinite(parsed) ? parsed : 14;
}

function highlight(el: HTMLElement) {
  el.classList.add('highlight-target');
  setTimeout(() => el.classList.remove('highlight-target'), 2800);
}

function programmaticScrollToId(id: string, smooth: boolean = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = getHeaderOffset();
  const gap = getExtraGap();
  const rect = el.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;
  const targetY = Math.max(0, absoluteTop - offset - gap);
  const prev = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = smooth ? 'smooth' : 'auto';
  window.scrollTo({ top: targetY, left: 0, behavior: smooth ? 'smooth' : 'auto' });
  setTimeout(() => { document.documentElement.style.scrollBehavior = prev || ''; }, 0);
  highlight(el);
}

function adjustToHash() {
  if (!location.hash) return;
  const id = decodeURIComponent(location.hash.replace(/^#/, ""));
  if (!id) return;
  // Strip hash to avoid native jump and keep URL clean
  try {
    history.replaceState({}, '', location.pathname + location.search);
  } catch {}
  // Let layout settle (fonts, images, hydration), then smooth scroll and highlight
  const doScroll = () => programmaticScrollToId(id, true);
  requestAnimationFrame(() => {
    doScroll();
    setTimeout(doScroll, 120);
  });
}

export default function AnchorScrollFix() {
  const pathname = usePathname();
  useEffect(() => {
    // Adjust on initial mount when opened with a hash
    const t = setTimeout(() => {
      // Support sessionStorage-passed target (e.g., from MyPage)
      let pending: string | null = null;
      try { pending = sessionStorage.getItem('pendingTarget'); sessionStorage.removeItem('pendingTarget'); } catch {}
      if (pending) {
        requestAnimationFrame(() => {
          programmaticScrollToId(pending!, true);
          setTimeout(() => programmaticScrollToId(pending!, true), 120);
        });
      } else {
        adjustToHash();
      }
    }, 100);

    // Adjust on hash changes (within the same page)
    const onHash = () => adjustToHash();
    window.addEventListener('hashchange', onHash);

    return () => {
      clearTimeout(t);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  // Adjust after route changes (SPA navigation), when pathname changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = setTimeout(() => {
      let pending: string | null = null;
      try { pending = sessionStorage.getItem('pendingTarget'); sessionStorage.removeItem('pendingTarget'); } catch {}
      if (pending) {
        programmaticScrollToId(pending, true);
        setTimeout(() => programmaticScrollToId(pending!, true), 120);
      } else {
        adjustToHash();
      }
    }, 120);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
