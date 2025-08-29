'use client';

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import RecentSection from "../components/RecentSection";

const SectionLink = ({
  href,
  src,
  alt,
  label,
  mode = "work",
}: {
  href: string;
  src: string;
  alt: string;
  label: string;
  mode?: "work" | "personal";
}) => {
  const bgOverlay =
    mode === "personal"
      ? "bg-black bg-opacity-40"
      : "bg-black bg-opacity-40";

  const textColor =
    mode === "personal"
      ? "text-white"
      : "text-white";

  return (
    <Link href={href} className="relative group block h-[80vh] overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className={`absolute inset-0 ${bgOverlay} flex items-center justify-center ${textColor} text-4xl font-bold`}>
        {label}
      </div>
    </Link>
  );
};

const Home = () => {
  const isScrolling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const width = (container.firstElementChild?.firstElementChild as HTMLElement)?.clientWidth || 0;
      container.scrollTo({ left: width, behavior: "instant" });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isScrolling.current) return;
      isScrolling.current = true;
      const container = containerRef.current;
      const track = container?.firstElementChild;
      const first = track?.firstElementChild;

      if (container && track && first) {
        const scrollAmount = first.clientWidth + 16;
        const originalScrollLeft = container.scrollLeft;

        // Animate scroll first
        container.scrollTo({ left: originalScrollLeft + scrollAmount, behavior: "smooth" });

        // After animation duration, rearrange DOM
        setTimeout(() => {
          track.appendChild(first);
          container.scrollLeft = originalScrollLeft;
          isScrolling.current = false;
        }, 800);
      } else {
        isScrolling.current = false;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative min-h-screen py-16 bg-white text-black overflow-hidden">
      <div className="relative w-full mb-12">
        <button
          onClick={() => {
            if (isScrolling.current) return;
            isScrolling.current = true;
            const container = containerRef.current;
            const track = container?.firstElementChild;
            const last = track?.lastElementChild;
            const first = track?.firstElementChild;

            if (container && track && last && first) {
              track.insertBefore(last, first);
              container.scrollLeft += last.clientWidth + 16;
              requestAnimationFrame(() => {
                container.scrollTo({ left: container.scrollLeft - (last.clientWidth + 16), behavior: "smooth" });
              });
            }
            setTimeout(() => {
              isScrolling.current = false;
            }, 800);
          }}
          className="absolute left-0 top-0 h-full w-20 z-10 bg-white bg-opacity-10 hover:bg-opacity-30 transition flex items-center justify-center"
        >
          ◀
        </button>
        <div
          id="carousel"
          ref={containerRef}
          className="overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth snap-x snap-mandatory"
        >
          <div className="inline-flex gap-4 px-4 sm:px-8 md:px-16">
            <Image
              src="/images/home/home_01.jpg"
              alt="Home image 1"
              width={1050}
              height={450}
              loading="lazy"
              className="w-[1050px] h-[450px] object-cover  flex-shrink-0 snap-center"
            />
            <Image
              src="/images/home/home_02.jpg"
              alt="Home image 2"
              width={1050}
              height={450}
              loading="lazy"
              className="w-[1050px] h-[450px] object-cover  flex-shrink-0 snap-center"
            />
            <Image
              src="/images/home/home_03.jpg"
              alt="Home image 3"
              width={1050}
              height={450}
              loading="lazy"
              className="w-[1050px] h-[450px] object-cover  flex-shrink-0 snap-center"
            />
            <Image
              src="/images/home/home_01.jpg"
              alt="Home image 1 duplicate"
              width={1050}
              height={450}
              loading="lazy"
              className="w-[1050px] h-[450px] object-cover  flex-shrink-0 snap-center"
            />
            <Image
              src="/images/home/home_02.jpg"
              alt="Home image 2 duplicate"
              width={1050}
              height={450}
              loading="lazy"
              className="w-[1050px] h-[450px] object-cover  flex-shrink-0 snap-center"
            />
            <Image
              src="/images/home/home_03.jpg"
              alt="Home image 3 duplicate"
              width={1050}
              height={450}
              loading="lazy"
              className="w-[1050px] h-[450px] object-cover  flex-shrink-0 snap-center"
            />



          </div>
        </div>
        <button
          onClick={() => {
            if (isScrolling.current) return;
            isScrolling.current = true;
            const container = containerRef.current;
            const track = container?.firstElementChild;
            const first = track?.firstElementChild;

            if (container && track && first) {
              const scrollAmount = first.clientWidth + 16;
              const originalScrollLeft = container.scrollLeft;

              // Animate scroll first
              container.scrollTo({ left: originalScrollLeft + scrollAmount, behavior: "smooth" });

              // After animation duration, rearrange DOM
              setTimeout(() => {
                track.appendChild(first);
                container.scrollLeft = originalScrollLeft;
                isScrolling.current = false;
              }, 800);
            } else {
              isScrolling.current = false;
            }
          }}
          className="absolute right-0 top-0 h-full w-20 z-10 bg-white bg-opacity-0 hover:bg-opacity-30 transition flex items-center justify-center"
        >
          ▶
        </button>
      </div>
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mx-auto text-center max-w-screen-md">

        </div>
      </div>
      <RecentSection />
      <div className="">
        <SectionLink
          href="/food"
          src="/images/food/food_01.jpg"
          alt="Food"
          label="FOOD"
          mode="work"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <SectionLink
            href="/himeji"
            src="/images/himeji/scenery_01.JPG"
            alt="Himeji"
            label="HIMEJI"
            mode="personal"
          />
          <SectionLink
            href="/tokyo-yokohama"
            src="/images/tokyo-yokohama/TY_01.jpg"
            alt="Tokyo and Yokohama"
            label="TOKYO / YOKOHAMA"
            mode="personal"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
