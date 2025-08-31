'use client';

import RecentSectionContainer from "../components/containers/RecentSectionContainer/RecentSectionContainer";
import CarouselContainer from "../components/containers/CarouselContainer/CarouselContainer";
import SectionLinksContainer from "../components/containers/SectionLinksContainer/SectionLinksContainer";

const Home = () => {
  return (
    <section className="relative min-h-screen pt-2 md:pt-14 bg-white text-black overflow-hidden">
      <CarouselContainer />
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mx-auto text-center max-w-screen-md">

        </div>
      </div>
      <RecentSectionContainer />
      <SectionLinksContainer />
    </section>
  );
};

export default Home;
