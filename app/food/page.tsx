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
    <div
      id={id}
      className="relative w-full overflow-hidden border-4 border-gray-900 group cursor-pointer"
      style={{ aspectRatio: '1 / 1' }}
    >
      <Image
        src={imageSrc}
        alt={altText}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition duration-300 ease-in-out group-hover:scale-105"
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
        <div className="p-4 md:p-5 text-white bg-black/50 w-full">
          <h3 className="font-fotTsukuaoldminPr6n text-2xl md:text-4xl font-medium tracking-tight mb-1">{title}</h3>
        </div>
      </div>
    </div>
  );
};

const FOOD = () => {

  return (
    <>
      <section className="relative min-h-screen py-4 md:py-16 overflow-hidden w-full overflow-x-hidden">
        <div
          className="fixed inset-0 w-full h-full bg-repeat bg-cover bg-center z-[-2]"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-screen-xl px-4">
          <div className="mx-auto mb-4 md:mb-20 max-w-screen-md text-center">
            <h1 className="font-futuraPt text-3xl md:text-7xl text-black mb-3 md:mb-4">FOOD</h1>
            <p className="font-futuraPt text-sm md:text-lg text-black">Japanese MoguMogu Time</p>
            <div
              className="fixed inset-0 z-[-1]"
              aria-hidden="true"
            />
          </div>
          <div className="flex justify-center animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-[1200px] w-full mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <PicCard
                  imageSrc="/images/food/food_01.jpg"
                  altText="ヒエヒエ冷麺"
                  hoverText="コチュジャンがきくぅ〜"
                  title="ヒエヒエ冷麺"
                  id="food-1"

                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <PicCard
                  imageSrc="/images/food/food_02.jpg"
                  altText="あちあち麻婆豆腐"
                  hoverText="豆腐がとろけぇ〜る"
                  title="あちあち麻婆豆腐"
                  id="food-2"

                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
              >
                <PicCard
                  imageSrc="/images/food/food_03.jpg"
                  altText="野菜たっぷりハンバーグ"
                  hoverText="食物繊維感じる"
                  title="野菜たっぷりハンバーグ"
                  id="food-3"

                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <PicCard
                  imageSrc="/images/food/food_04.jpg"
                  altText="濃厚チョコマフィン"
                  hoverText="アイスもついてるの嬉しい"
                  title="濃厚チョコマフィン"
                  id="food-4"

                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
              >
                <PicCard
                  imageSrc="/images/food/food_05.jpg"
                  altText="もちふわホットサンド"
                  hoverText="本当はプリンを頼むつもりだった"
                  title="もちふわホットサンド"
                  id="food-5"

                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
              >
                <PicCard
                  imageSrc="/images/food/food_06.jpg"
                  altText="ちゃーしゅーみっそー"
                  hoverText="味噌のコクがたまらん"
                  title="ちゃーしゅーみっそー"
                  id="food-6"

                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
              >
                <PicCard
                  imageSrc="/images/food/food_07.jpg"
                  altText="アフタヌゥーン"
                  hoverText="紅茶と一緒にどうぞ"
                  title="アフタヌゥーン"
                  id="food-7"

                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
              >
                <PicCard
                  imageSrc="/images/food/food_08.jpg"
                  altText="クソデカキンメダイ"
                  hoverText="正月かな？"
                  title="クソデカキンメダイ"
                  id="food-8"

                />
              </motion.div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FOOD;
