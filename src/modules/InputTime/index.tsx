"use client";

import ContentContainer from "@/components/content-container";
import DynamicContent from "@/components/dynamic-content";
import angonoPolygonCoords from "@/components/MapComponent/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTrackingContainerStore from "@/hooks/useTrackingContainerStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

//initialize google maps api
const loadGoogleMapsAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve(window.google);
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = () => resolve(window.google);
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    }
  });
};

const InputTime = () => {
  const [time, setTime] = useState<number>(1);
  const [disabledDurations, setDisabledDurations] = useState<number[]>([]);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const router = useRouter();
  const { setAvailableTime } = useTrackingContainerStore();

  //load google maps api
  useEffect(() => {
    loadGoogleMapsAPI()
      .then(() => {
        setIsGoogleLoaded(true);
        calculateTravelTime();
      })
      .catch((error) => {
        console.error("Failed to load Google Maps API:", error);
      });
  }, []);

  const calculateTravelTime = () => {
    if (!window.google) {
      console.error("Google Maps API not loaded.");
      return;
    }

    //use the angono polygons to compare the travel distance from user's location
    const angonoCenter = angonoPolygonCoords.reduce(
      (acc, coord) => {
        acc.lat += coord.lat;
        acc.lng += coord.lng;
        return acc;
      },
      { lat: 0, lng: 0 }
    );
    angonoCenter.lat /= angonoPolygonCoords.length;
    angonoCenter.lng /= angonoPolygonCoords.length;

    const service = new window.google.maps.DistanceMatrixService();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        let newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        //this is a statement whenever we use maps sometimes it sets our coordinates on their headquarters
        //on new york
        if (newLocation.lat === 38.883333 && newLocation.lng === -77) {
          newLocation = { lat: 14.599748, lng: 121.0100337 };
        }

        const origin = new window.google.maps.LatLng(
          newLocation.lat,
          newLocation.lng
        );
        const destination = new window.google.maps.LatLng(
          angonoCenter.lat,
          angonoCenter.lng
        );

        //use DistanceMatrix to calculate travel time
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === window.google.maps.DistanceMatrixStatus.OK) {
              const durationInSeconds =
                response?.rows[0].elements[0]?.duration?.value;
              if (durationInSeconds) {
                const travelTimeInHours = Math.ceil(durationInSeconds / 3600);

                const disabledTimes = Array.from({ length: 9 }).reduce<
                  number[]
                >((acc, _, index) => {
                  if (travelTimeInHours >= index + 1) {
                    acc.push(index + 1);
                  }
                  return acc;
                }, []);

                setDisabledDurations(disabledTimes);
              }
            } else {
              console.error("Error fetching distance matrix:", status);
            }
          }
        );
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  };

  return (
    <ContentContainer>
      <DynamicContent
        size={199}
        smallSize={125}
        image={"/icons/clock-art.png"}
        imageFallback={"/icons/clock-art.png"}
        heading={"Input Available Time"}
        subheading={"Input Your Available Time (Max: 9 Hours)"}
        detailsComponent={
          isGoogleLoaded ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  className={twMerge(
                    "w-[280px] px-[24px] py-[22px] bg-[#D9D9D9] flex justify-center items-center",
                    "text-gray-800 font-semibold"
                  )}
                >
                  {time} HOUR{time !== 1 && "S"}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={
                  "w-[280px] h-auto p-1 flex flex-col justify-start items-start transition-all"
                }
              >
                {Array.from({ length: 9 }).map((_, index) => (
                  <button
                    key={index}
                    disabled={disabledDurations.includes(index + 1)}
                    type={"button"}
                    onClick={() => {
                      setTime(index + 1);
                      setAvailableTime(index + 1);
                    }}
                    className={twMerge(
                      "w-full py-[8px] px-[12px] text-gray-800 font-semibold text-[11.67px] leading-[11.67px] hover:bg-gray-100 cursor-default",
                      time === index + 1 && "bg-gray-100 opacity-50",
                      disabledDurations.includes(index + 1) &&
                        "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {index + 1} HOUR{index + 1 !== 1 && "S"}
                  </button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <p>Loading Google Maps API...</p>
          )
        }
      >
        <Button
          disabled={disabledDurations.includes(time)}
          onClick={() => router.push("/tracking/map")}
          type={"button"}
          variant={"default"}
          className={
            "w-full h-auto py-[18px] text-white text-[20px] font-semibold rounded-[33px]"
          }
        >
          Confirm
        </Button>
      </DynamicContent>
    </ContentContainer>
  );
};

export default InputTime;
