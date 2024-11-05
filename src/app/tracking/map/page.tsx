"use client";

import ContentContainer from "@/components/content-container";
import GoogleMapsWrapper from "@/components/GoogleMapsWrapper";
import MapComponent from "@/components/MapComponent";

const Page = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <ContentContainer>
      <GoogleMapsWrapper
        apiKey={apiKey || ""}
        googleApi={(google) => <MapComponent google={google} />}
      />
    </ContentContainer>
  );
};

export default Page;
