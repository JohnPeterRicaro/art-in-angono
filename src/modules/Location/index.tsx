"use client";

import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Location = () => {
  const router = useRouter();
  const [showPrompt, setShowPrompt] = useState(false);
  const [geoLocation, setGeoLocation] = useState({
    loaded: false,
    coordinates: {
      lat: 0,
      lng: 0,
    },
    locale: "",
    countryCode: "",
    error: {},
  });

  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((locationPermission) => {
          if (locationPermission.state === "granted") {
            fetchLocation();
            router.push("/tracking/suggestive-system");
          } else if (locationPermission.state === "prompt") {
            setShowPrompt(true);
          } else if (locationPermission.state === "denied") {
            alert(
              "Location access is denied. Please enable it in your browser settings."
            );
            router.push("/tracking");
          }

          locationPermission.onchange = () => {
            if (locationPermission.state === "granted") {
              fetchLocation();
            } else if (locationPermission.state === "denied") {
              alert(
                "Location access has been denied. Please enable it in your browser settings."
              );
            }
            router.push("/tracking/suggestive-system");
          };
        });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        localStorage.setItem("location", JSON.stringify(position));
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Error fetching location. Please try again.");
      }
    );
    router.push("/tracking/suggestive-system");
  };

  return (
    <ContentContainer>
      <DynamicContent
        heading={"Enable Location Access"}
        subheading={
          "This lets us show you which museums in Rizal are currently near you."
        }
        image={"/icons/location-art.png"}
        imageFallback={"/icons/location-art.png"}
      >
        {showPrompt && (
          <div className="mb-4 text-red-500">
            <p>
              Location access is required to show nearby museums. Would you like
              to enable it?
            </p>
            <Button
              onClick={() => {
                setShowPrompt(false);
                fetchLocation();
              }}
              type={"button"}
              variant={"default"}
              className={
                "w-full h-auto py-[18px] text-white text-[20px] font-semibold rounded-[33px] mt-2"
              }
            >
              Enable Location
            </Button>
          </div>
        )}
        <Button
          onClick={handleEnableLocation}
          type={"button"}
          variant={"default"}
          className={
            "w-full h-auto py-[18px] text-white text-[20px] font-semibold rounded-[33px]"
          }
        >
          Enable Location
        </Button>
        <Button
          type={"button"}
          onClick={() => router.push("/tracking")}
          variant={"outline"}
          className={
            "w-full h-auto py-[18px] text-[20px] font-semibold rounded-[33px]"
          }
        >
          Skip for now
        </Button>
      </DynamicContent>
    </ContentContainer>
  );
};

export default Location;
