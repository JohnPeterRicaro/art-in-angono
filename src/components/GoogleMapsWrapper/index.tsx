import { GoogleAPI } from "google-maps-react";
import React, { ReactNode, useEffect, useState } from "react";

interface GoogleMapsWrapperProps {
  apiKey: string;
  googleApi: (google: GoogleAPI) => ReactNode;
}

const GoogleMapsWrapper: React.FC<GoogleMapsWrapperProps> = ({
  apiKey,
  googleApi,
}) => {
  const [google, setGoogle] = useState<GoogleAPI | null>(null);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = () => {
        setGoogle((window as any).google);
      };
      script.onerror = () => {
        console.error("Error loading Google Maps script");
      };
      document.head.appendChild(script);
    };

    if (!(window as any).google) {
      loadScript();
    } else {
      setGoogle((window as any).google);
    }
  }, [apiKey]);

  if (!google)
    return (
      <div className={"w-full h-full flex justify-center items-center"}>
        Loading Google Maps...
      </div>
    );

  return <>{googleApi(google)}</>;
};

export default GoogleMapsWrapper;
