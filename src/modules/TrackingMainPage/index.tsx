"use client";

import ContentContainer from "@/components/content-container";
import TrackingBackgroundContainer from "@/modules/TrackingMainPage/components/TrackingBackgroundContainer";
import TrackignMainSection from "@/modules/TrackingMainPage/components/TrackingMainSection";

const TrackingMainPage = () => {
  return (
    <ContentContainer>
      <TrackingBackgroundContainer />
      <TrackignMainSection />
    </ContentContainer>
  );
};

export default TrackingMainPage;
