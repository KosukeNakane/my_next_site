"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Candidate = { src: string; base: string; id: string; alt?: string };
const CANDIDATES: Candidate[] = [
  { src: "/images/food/food_01.jpg", base: "/food", id: "food-1", alt: "FOOD 1" },
  { src: "/images/food/food_02.jpg", base: "/food", id: "food-2", alt: "FOOD 2" },
  { src: "/images/food/food_03.jpg", base: "/food", id: "food-3", alt: "FOOD 3" },
  { src: "/images/food/food_04.jpg", base: "/food", id: "food-4", alt: "FOOD 4" },
  { src: "/images/food/food_05.jpg", base: "/food", id: "food-5", alt: "FOOD 5" },
  { src: "/images/food/food_06.jpg", base: "/food", id: "food-6", alt: "FOOD 6" },
  { src: "/images/food/food_07.jpg", base: "/food", id: "food-7", alt: "FOOD 7" },
  { src: "/images/food/food_08.jpg", base: "/food", id: "food-8", alt: "FOOD 8" },
  { src: "/images/himeji/scenery_01.JPG", base: "/himeji", id: "himeji-1", alt: "HIMEJI 1" },
  { src: "/images/himeji/scenery_02.JPG", base: "/himeji", id: "himeji-2", alt: "HIMEJI 2" },
  { src: "/images/himeji/scenery_03.JPG", base: "/himeji", id: "himeji-3", alt: "HIMEJI 3" },
  { src: "/images/himeji/scenery_04.JPG", base: "/himeji", id: "himeji-4", alt: "HIMEJI 4" },
  { src: "/images/himeji/scenery_05.JPG", base: "/himeji", id: "himeji-5", alt: "HIMEJI 5" },
  { src: "/images/tokyo-yokohama/TY_01.jpg", base: "/tokyo-yokohama", id: "ty-1", alt: "TOKYO/YOKOHAMA 1" },
  { src: "/images/tokyo-yokohama/TY_02.jpg", base: "/tokyo-yokohama", id: "ty-2", alt: "TOKYO/YOKOHAMA 2" },
  { src: "/images/tokyo-yokohama/TY_03.jpg", base: "/tokyo-yokohama", id: "ty-3", alt: "TOKYO/YOKOHAMA 3" },
  { src: "/images/tokyo-yokohama/TY_04.jpg", base: "/tokyo-yokohama", id: "ty-4", alt: "TOKYO/YOKOHAMA 4" },
  { src: "/images/home/home_02.jpg", base: "/tokyo-yokohama", id: "ty-5", alt: "TOKYO/YOKOHAMA 5" },
  { src: "/images/home/home_03.jpg", base: "/tokyo-yokohama", id: "ty-6", alt: "TOKYO/YOKOHAMA 6" },
];

const SpCarousel = () => {
  const router = useRouter();
  const isScrolling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRaf = useRef<number | null>(null);
  const [items, setItems] = useState<Candidate[]>([]);

  useEffect(() => {
    const shuffled = [...CANDIDATES].sort(() => Math.random() - 0.5);
    setItems(shuffled.slice(0, 3));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const width = (container.firstElementChild?.firstElementChild as HTMLElement)?.clientWidth || 0;
      if (width > 0) container.scrollLeft = width;
    }
  }, [items.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isScrolling.current) return;
      isScrolling.current = true;
      const container = containerRef.current;
      const track = container?.firstElementChild as HTMLElement | null;
      const first = track?.firstElementChild as HTMLElement | null;

      if (container && track && first) {
        const scrollAmount = first.clientWidth + 16;
        const originalScrollLeft = container.scrollLeft;
        container.scrollTo({ left: originalScrollLeft + scrollAmount, behavior: "smooth" });
        setTimeout(() => {
          // Avoid reverse animation: disable snap + smooth via inline style during reset
          const prevSnap = container.style.scrollSnapType;
          const prevBehavior = container.style.scrollBehavior as string;
          container.style.scrollSnapType = 'none';
          container.style.scrollBehavior = 'auto';

          track.appendChild(first);
          container.scrollLeft = originalScrollLeft;

          // Force reflow
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          container.offsetHeight;

          // Restore
          container.style.scrollSnapType = prevSnap || '';
          container.style.scrollBehavior = prevBehavior || '';

          isScrolling.current = false;
        }, 800);
      } else {
        isScrolling.current = false;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Preload and decode selected images early to avoid jank
  useEffect(() => {
    if (typeof window === 'undefined') return;
    items.forEach(it => {
      const img = new window.Image();
      img.src = it.src;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (img as any).decode?.().catch(() => {});
    });
  }, [items]);

  const onScrollLoop = () => {
    if (isScrolling.current) return;
    if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    scrollRaf.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      const track = container?.firstElementChild as HTMLElement | null;
      if (!container || !track) return;
      const first = track.firstElementChild as HTMLElement | null;
      const last = track.lastElementChild as HTMLElement | null;
      const slideWidth = first ? first.clientWidth + 16 : 0;

      if (container.scrollLeft <= 2 && last && first) {
        track.insertBefore(last, first);
        container.scrollLeft += slideWidth;
      }
      const nearRight = container.scrollLeft + container.clientWidth >= container.scrollWidth - 2;
      if (nearRight && first) {
        track.appendChild(first);
        container.scrollLeft -= slideWidth;
      }
    });
  };

  return (
    <div className="relative w-full mb-0">
      <div
        id="carousel"
        ref={containerRef}
        onScroll={onScrollLoop}
        className="overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth snap-x snap-mandatory"
      >
        <div className="inline-flex gap-4 px-4 sm:px-8">
          {items.concat(items).map((it, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                try {
                  const evt = new CustomEvent('app:navigate', { detail: { href: it.base, pendingTarget: it.id } });
                  window.dispatchEvent(evt);
                } catch {
                  try { sessionStorage.setItem('pendingTarget', it.id); } catch {}
                  router.push(it.base);
                }
              }}
              className="relative w-[85vw] sm:w-[600px] h-[45vw] sm:h-[300px] flex-shrink-0 snap-center"
              aria-label="carousel image"
            >
              <Image
                src={it.src}
                alt={it.alt || 'carousel'}
                fill
                sizes="(max-width: 640px) 85vw, 600px"
                className="object-cover"
                priority={idx === 0}
              />
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default SpCarousel;
