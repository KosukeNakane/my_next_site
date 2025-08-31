"use client";

import Image from "next/image";
import Link from "next/link";

type CardProps = {
  href: string;
  src: string;
  alt: string;
  label: string;
  mode?: "work" | "personal";
};

const Card = ({ href, src, alt, label, mode = "work" }: CardProps) => {
  const bgOverlay = mode === "personal" ? "bg-black bg-opacity-40" : "bg-black bg-opacity-40";
  const textColor = mode === "personal" ? "text-white" : "text-white";

  return (
    <Link href={href} className="relative group block h-[60vh] md:h-[80vh] overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className={`absolute inset-0 ${bgOverlay} flex items-center justify-center ${textColor} text-2xl md:text-4xl font-bold`}>
        {label}
      </div>
    </Link>
  );
};

const SectionLinks = () => {
  return (
    <div className="">
      <Card href="/food" src="/images/food/food_01.jpg" alt="Food" label="FOOD" mode="work" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <Card href="/himeji" src="/images/himeji/scenery_01.JPG" alt="Himeji" label="HIMEJI" mode="personal" />
        <Card href="/tokyo-yokohama" src="/images/tokyo-yokohama/TY_01.jpg" alt="Tokyo and Yokohama" label="TOKYO / YOKOHAMA" mode="personal" />
      </div>
    </div>
  );
};

export default SectionLinks;

