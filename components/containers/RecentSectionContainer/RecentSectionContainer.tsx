"use client";

import useIsMobile from "../../../hooks/useIsMobile";
import DesktopRecentSection from "../../presentational/RecentSection/RecentSection";
import SpRecentSection from "../../presentational/RecentSection/SpRecentSection";

const RecentSectionContainer = () => {
  const isMobile = useIsMobile(768);
  return isMobile ? <SpRecentSection /> : <DesktopRecentSection />;
};

export default RecentSectionContainer;

