"use client";

import useIsMobile from "../../../hooks/useIsMobile";
import Carousel from "../../presentational/Carousel/Carousel";
import SpCarousel from "../../presentational/Carousel/SpCarousel";

const CarouselContainer = () => {
  const isMobile = useIsMobile(768);
  return isMobile ? <SpCarousel /> : <Carousel />;
};

export default CarouselContainer;

