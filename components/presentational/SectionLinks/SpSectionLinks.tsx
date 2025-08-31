"use client";

import Image from "next/image";
import Link from "next/link";

type CardProps = {
  href: string;
  src: string;
  alt: string;
  label: string;
  mode?: "work" | "personal";
  aspect?: string; // e.g., '2 / 1' or '1 / 1'
};

const Card = ({ href, src, alt, label, mode = "work", aspect = "1 / 1" }: CardProps) => {
  const bgOverlay = mode === "personal" ? "bg-black bg-opacity-40" : "bg-black bg-opacity-40";
  const textColor = mode === "personal" ? "text-white" : "text-white";

  return (
    <Link href={href} className="relative group block w-full overflow-hidden" style={{ aspectRatio: aspect }}>
      <Image
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className={`absolute inset-0 ${bgOverlay} flex items-center justify-center ${textColor} text-lg font-bold`}>
        {label}
      </div>
    </Link>
  );
};

const SpSectionLinks = () => {
  return (
    <div className="">
      <Card href="/food" src="/images/food/food_01.jpg" alt="Food" label="FOOD" mode="work" aspect="2 / 1" />
      <div className="grid grid-cols-2 gap-0">
        <Card href="/himeji" src="/images/himeji/scenery_01.JPG" alt="Himeji" label="HIMEJI" mode="personal" aspect="1 / 1" />
        <Card href="/tokyo-yokohama" src="/images/tokyo-yokohama/TY_01.jpg" alt="Tokyo and Yokohama" label="TOKYO / YOKOHAMA" mode="personal" aspect="1 / 1" />
      </div>
    </div>
  );
};

export default SpSectionLinks;
