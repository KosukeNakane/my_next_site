"use client";

import useIsMobile from "../../../hooks/useIsMobile";
import SectionLinks from "../../presentational/SectionLinks/SectionLinks";
import SpSectionLinks from "../../presentational/SectionLinks/SpSectionLinks";

const SectionLinksContainer = () => {
  const isMobile = useIsMobile(768);
  return isMobile ? <SpSectionLinks /> : <SectionLinks />;
};

export default SectionLinksContainer;

