"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const SpCarousel = () => {
  const isScrolling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRaf = useRef<number | null>(null);
  const sources = [
    "/images/home/home_01.jpg",
    "/images/home/home_02.jpg",
    "/images/home/home_03.jpg",
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const width = (container.firstElementChild?.firstElementChild as HTMLElement)?.clientWidth || 0;
      // @ts-ignore behavior: 'instant' is supported by browsers though not typed
      container.scrollTo({ left: width, behavior: "instant" });
    }
  }, []);

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

  // Preload and decode images early to avoid jank
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const preload = (src: string) => {
      const img = new window.Image();
      img.src = src;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (img as any).decode?.().catch(() => {});
    };
    sources.forEach(preload);
  }, []);

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
          <Image src="/images/home/home_01.jpg" alt="Home image 1" width={1050} height={450} priority fetchPriority="high" className="w-[85vw] sm:w-[600px] h-[45vw] sm:h-[300px] object-cover flex-shrink-0 snap-center" />
          <Image src="/images/home/home_02.jpg" alt="Home image 2" width={1050} height={450} loading="lazy" className="w-[85vw] sm:w-[600px] h-[45vw] sm:h-[300px] object-cover flex-shrink-0 snap-center" />
          <Image src="/images/home/home_03.jpg" alt="Home image 3" width={1050} height={450} loading="lazy" className="w-[85vw] sm:w-[600px] h-[45vw] sm:h-[300px] object-cover flex-shrink-0 snap-center" />
          <Image src="/images/home/home_01.jpg" alt="Home image 1 duplicate" width={1050} height={450} loading="lazy" className="w-[85vw] sm:w-[600px] h-[45vw] sm:h-[300px] object-cover flex-shrink-0 snap-center" />
          <Image src="/images/home/home_02.jpg" alt="Home image 2 duplicate" width={1050} height={450} loading="lazy" className="w-[85vw] sm:w-[600px] h-[45vw] sm:h-[300px] object-cover flex-shrink-0 snap-center" />
          <Image src="/images/home/home_03.jpg" alt="Home image 3 duplicate" width={1050} height={450} loading="lazy" className="w-[85vw] sm:w-[600px] h-[45vw] sm:h-[300px] object-cover flex-shrink-0 snap-center" />
        </div>
      </div>
      
    </div>
  );
};

export default SpCarousel;
