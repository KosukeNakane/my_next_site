"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Preload targets for smoother rotations
const SOURCES = [
  "/images/home/home_01.jpg",
  "/images/home/home_02.jpg",
  "/images/home/home_03.jpg",
];

const Carousel = () => {
  const isScrolling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRaf = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const width = (container.firstElementChild?.firstElementChild as HTMLElement)?.clientWidth || 0;
      container.scrollLeft = width;
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
          // Avoid reverse animation on reset: disable snap + smooth via inline style
          const prevSnap = container.style.scrollSnapType;
          const prevBehavior = container.style.scrollBehavior as string;
          container.style.scrollSnapType = 'none';
          container.style.scrollBehavior = 'auto';

          track.appendChild(first);
          container.scrollLeft = originalScrollLeft;

          // Force reflow to ensure instant position applied
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          container.offsetHeight;

          // Restore styles so classes take over again
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

  // Preload and decode images early to avoid jank when rotating items
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const preload = (src: string) => {
      const img = new window.Image();
      img.src = src;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (img as any).decode?.().catch(() => {});
    };
    SOURCES.forEach(preload);
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

      // Near left edge: rotate last -> first and keep position
      if (container.scrollLeft <= 2 && last && first) {
        track.insertBefore(last, first);
        container.scrollLeft += slideWidth;
      }
      // Near right edge: rotate first -> last and keep position
      const nearRight = container.scrollLeft + container.clientWidth >= container.scrollWidth - 2;
      if (nearRight && first) {
        track.appendChild(first);
        container.scrollLeft -= slideWidth;
      }
    });
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => {
          if (isScrolling.current) return;
          isScrolling.current = true;
          const container = containerRef.current;
          const track = container?.firstElementChild as HTMLElement | null;
          const last = track?.lastElementChild as HTMLElement | null;
          const first = track?.firstElementChild as HTMLElement | null;
          if (container && track && last && first) {
            track.insertBefore(last, first);
            container.scrollLeft += last.clientWidth + 16;
            requestAnimationFrame(() => {
              container.scrollTo({ left: container.scrollLeft - (last.clientWidth + 16), behavior: "smooth" });
            });
          }
          setTimeout(() => { isScrolling.current = false; }, 800);
        }}
        className="absolute left-0 top-0 h-full w-12 md:w-20 z-10 bg-white bg-opacity-10 hover:bg-opacity-30 transition flex items-center justify-center"
      >
        <ChevronLeftIcon sx={{ fontSize: 28 }} />
      </button>
      <div
        id="carousel"
        ref={containerRef}
        onScroll={onScrollLoop}
        className="overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth snap-x snap-mandatory"
      >
        <div className="inline-flex gap-4 px-4 sm:px-8 md:px-16">
          <Image src="/images/home/home_01.jpg" alt="Home image 1" width={1050} height={450} priority fetchPriority="high" className="w-[85vw] sm:w-[600px] md:w-[900px] lg:w-[1050px] h-[45vw] sm:h-[300px] md:h-[400px] lg:h-[450px] object-cover flex-shrink-0 snap-center" />
          <Image src="/images/home/home_02.jpg" alt="Home image 2" width={1050} height={450} loading="lazy" className="w-[85vw] sm:w-[600px] md:w-[900px] lg:w-[1050px] h-[45vw] sm:h-[300px] md:h-[400px] lg:h-[450px] object-cover flex-shrink-0 snap-center" />
          <Image src="/images/home/home_03.jpg" alt="Home image 3" width={1050} height={450} loading="lazy" className="w-[85vw] sm:w-[600px] md:w-[900px] lg:w-[1050px] h-[45vw] sm:h-[300px] md:h-[400px] lg:h-[450px] object-cover flex-shrink-0 snap-center" />
          <Image src="/images/home/home_01.jpg" alt="Home image 1 duplicate" width={1050} height={450} loading="lazy" className="w-[85vw] sm:w-[600px] md:w-[900px] lg:w-[1050px] h-[45vw] sm:h-[300px] md:h-[400px] lg:h-[450px] object-cover flex-shrink-0 snap-center" />
          <Image src="/images/home/home_02.jpg" alt="Home image 2 duplicate" width={1050} height={450} loading="lazy" className="w-[85vw] sm:w-[600px] md:w-[900px] lg:w-[1050px] h-[45vw] sm:h-[300px] md:h-[400px] lg:h-[450px] object-cover flex-shrink-0 snap-center" />
          <Image src="/images/home/home_03.jpg" alt="Home image 3 duplicate" width={1050} height={450} loading="lazy" className="w-[85vw] sm:w-[600px] md:w-[900px] lg:w-[1050px] h-[45vw] sm:h-[300px] md:h-[400px] lg:h-[450px] object-cover flex-shrink-0 snap-center" />
        </div>
      </div>
      <button
        onClick={() => {
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
              track.appendChild(first);
              container.scrollLeft = originalScrollLeft;
              isScrolling.current = false;
            }, 800);
          } else {
            isScrolling.current = false;
          }
        }}
        className="absolute right-0 top-0 h-full w-12 md:w-20 z-10 bg-white bg-opacity-0 hover:bg-opacity-30 transition flex items-center justify-center"
      >
        <ChevronRightIcon sx={{ fontSize: 28 }} />
      </button>
    </div>
  );
};

export default Carousel;
