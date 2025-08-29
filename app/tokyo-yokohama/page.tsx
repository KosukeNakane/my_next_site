'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import BookmarkButton from "../../components/BookmarkButton";

const PicCard = ({
  imageSrc,
  altText,
  hoverText,
  title,
  id,
}: {
  imageSrc: string;
  altText: string;
  hoverText: string;
  title: string;
  id: string;
}) => {
  const pathname = usePathname();
  return (
    <div id={id} className="w-full overflow-hidden border-4 border-gray-900">
      <div className="relative group cursor-pointer">
        <Image
          src={imageSrc}
          alt={altText}
          width={800}
          height={600}
          className="w-full h-[600px] object-cover transition duration-300 ease-in-out group-hover:scale-105"
          priority={false}
        />
        <BookmarkButton path={`${pathname}#${id}`} title={title} />
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="bg-black/80 px-4 py-2">
            <p className="text-white text-sm font-fotTsukuaoldminPr6n">{hoverText}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="p-5 text-white bg-black/50 w-full">
            <h3 className="font-fotTsukuaoldminPr6n text-4xl font-medium tracking-tight mb-1">{title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

const TOKYO_YOKOHAMA = () => {
  return (
    <>
      <section className="relative min-h-screen py-16 overflow-hidden w-full overflow-x-hidden">
        <div className="fixed inset-0 w-full h-full bg-repeat bg-cover bg-center z-[-2]" aria-hidden="true" />

        <div className="mx-auto max-w-screen-xl px-4">
          <div className="mx-auto mb-20 max-w-screen-md text-center">
            <h1 className="font-futuraPt text-4xl md:text-7xl text-black mb-4">TOKYO / YOKOHAMA</h1>
            <p className="font-futuraPt md:text-lg text-black">DaiTokai</p>
            <div className="fixed inset-0 z-[-1]" aria-hidden="true" />
          </div>
          <div className="flex justify-center animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[1200px] w-full mx-auto">
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                <PicCard
                  imageSrc="/images/tokyo-yokohama/TY_01.jpg"
                  altText="nyanyanya"
                  hoverText="いや、こえーよ"
                  title="nyanyanya"
                  id="ty-1"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}>
                <PicCard
                  imageSrc="/images/tokyo-yokohama/TY_02.jpg"
                  altText="あかれんが"
                  hoverText="光の反射がびゅーてぃふぉー"
                  title="あかれんが"
                  id="ty-2"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                <PicCard
                  imageSrc="/images/tokyo-yokohama/TY_03.jpg"
                  altText="あ！"
                  hoverText="あ！"
                  title="あ！"
                  id="ty-3"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}>
                <PicCard
                  imageSrc="/images/tokyo-yokohama/TY_04.jpg"
                  altText="歩行者天国"
                  hoverText="田舎では常に成立する"
                  title="歩行者天国"
                  id="ty-4"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                <PicCard
                  imageSrc="/images/home/home_02.jpg"
                  altText="ちゃーはんおいしー"
                  hoverText="ぱらぱらがすき"
                  title="ちゃーはんおいしー"
                  id="ty-5"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}>
                <PicCard
                  imageSrc="/images/home/home_03.jpg"
                  altText="ぼてじん"
                  hoverText="なつかしい"
                  title="ぼてじん"
                  id="ty-6"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TOKYO_YOKOHAMA;
