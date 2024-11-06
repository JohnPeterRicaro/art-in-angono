"use client";

import DraggableMenuComponent from "@/components/draggable-menu-component";
import { Button } from "@/components/ui/button";
import useTrackingContainerStore from "@/hooks/useTrackingContainerStore";
import ManualMapping from "@/modules/ManualMapping";
import AutomatedMapping from "@/modules/SuggestiveSystem/AutomatedMapping";
import { drawRoute } from "@/utils/drawRoute";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface MapComponentProps {
  google: typeof google;
}

export interface MuseumWithDistanceAndEta
  extends google.maps.places.PlaceResult {
  distance?: number;
  tour_eta?: {
    eta: number;
    tour_time: number;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({ google }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance = useRef<google.maps.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null); // Ref to store watchId

  // State variables - start
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [eta, setEta] = useState<string | null>(null);
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [angonoMuseums, setAngonoMuseums] = useState<
    MuseumWithDistanceAndEta[]
  >([]);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const {
    suggestiveSystem,
    availableTime,
    museumsInRoute: museumsInRouteStore,
    setMuseumsInRoute: setMuseumsInRouteStore,
    setSuggestiveSystem,
    hasLocations,
    setHasLocations,
  } = useTrackingContainerStore();
  // State variables - end

  const router = useRouter();
  const proximityThreshold = 0.05; // Proximity threshold is 0.05

  // Only initialize the map once when the component is mounted
  useEffect(() => {
    if (google && mapRef.current && location) {
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 16,
      });

      markerInstance.current = new google.maps.Marker({
        position: location,
        map: mapInstance.current,
        draggable: true,
        title: "Drag me!",
      });

      markerInstance.current.addListener(
        "dragend",
        (event: google.maps.MapMouseEvent) => {
          const newLocation = {
            lat: event?.latLng?.lat() ?? location.lat,
            lng: event?.latLng?.lng() ?? location.lng,
          };
          setLocation(newLocation);
          localStorage.setItem("location", JSON.stringify(newLocation));

          if (suggestiveSystem && !hasLocations) {
            fetchMuseumsWithEta(mapInstance.current!, newLocation);
          }
          fetchMuseumsInAngonoRizal(mapInstance.current!);
        }
      );

      if (suggestiveSystem && !hasLocations) {
        fetchMuseumsWithEta(mapInstance.current, location);
      }
      fetchMuseumsInAngonoRizal(mapInstance.current);
    }
  }, [google, location]);

  // Watch user's position and update location without re-initializing the map
  useEffect(() => {
    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation);
          localStorage.setItem("location", JSON.stringify(newLocation));

          if (mapInstance.current && markerInstance.current) {
            // Update the marker position and recenter the map
            markerInstance.current.setPosition(newLocation);
            mapInstance.current.panTo(newLocation);
          }
        },
        (error) => {
          console.error("Error watching position:", error);
        }
      );
    }

    // return () => {
    //   if (watchIdRef.current !== null) {
    //     navigator.geolocation.clearWatch(watchIdRef.current);
    //   }
    // };
  }, []);

  // When enabling location, get the saved location from local storage
  useEffect(() => {
    const savedLocation =
      localStorage.getItem("location") && localStorage.getItem("location");
    if (savedLocation) {
      const parsedSavedLocation: { lat: number; lng: number } =
        JSON.parse(savedLocation);
      if (
        parsedSavedLocation.lat === 38.883333 &&
        parsedSavedLocation.lng === -77
      ) {
        setLocation({ lat: 14.5253306, lng: 121.1493354 });
      } else {
        setLocation(parsedSavedLocation);
      }
    }
  }, []);

  //this will trigger when the user is near the location
  useEffect(() => {
    if (location && museumsInRouteStore.length > 0) {
      const nextMuseum = museumsInRouteStore[0];
      const nextDestination = {
        lat: nextMuseum.geometry?.location?.lat() ?? 0,
        lng: nextMuseum.geometry?.location?.lng() ?? 0,
      };

      const distanceToNext = haversineDistance(location, nextDestination);

      if (distanceToNext <= proximityThreshold) {
        router.push("/tracking/timer");
      }
    }
  }, [location, museumsInRouteStore, router]);

  //haversine formula: https://en.wikipedia.org/wiki/Haversine_formula
  //this will calculate the location's path.
  const haversineDistance = (
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number }
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(loc2.lat - loc1.lat);
    const dLng = toRad(loc2.lng - loc1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(loc1.lat)) *
        Math.cos(toRad(loc2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  //this will fetch museums with ETA, this code is used for
  //suggestive system.
  const fetchMuseumsWithEta = (
    map: google.maps.Map,
    userLocation: { lat: number; lng: number }
  ) => {
    const service = new google.maps.places.PlacesService(map);

    const angonoLocation = { lat: 14.5275, lng: 121.1711 };
    const distanceToAngono = haversineDistance(userLocation, angonoLocation);

    const isNearbyAngono = distanceToAngono <= 5;

    const locationToSearch = isNearbyAngono ? angonoLocation : userLocation;

    service.nearbySearch(
      {
        location: locationToSearch,
        radius: 5000,
        type: "museum",
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          calculateMuseumEta(results, userLocation);
        }
      }
    );
  };

  //this will fetch every museum near in a 5km radius in angono rizal,
  //this location is set by me.
  const fetchMuseumsInAngonoRizal = (map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);
    const angonoLocation = { lat: 14.5275, lng: 121.1711 }; // angono rizal, random location

    service.nearbySearch(
      {
        location: angonoLocation,
        radius: 5000,
        type: "museum",
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setAngonoMuseums(results as MuseumWithDistanceAndEta[]);
          results.forEach((result) => {
            if (result.geometry?.location) {
              new google.maps.Marker({
                position: result.geometry.location,
                map,
                title: result.name,
              });
            }
          });
        } else {
          console.warn("No results found or error fetching museums.");
        }
      }
    );
  };

  //this will calculate the museums' ETAs, this will allow the system to
  //map the locations inside of google map.
  //We set up a minimum amout of tourTime otherwise the tourTime can be 3 minutes or less.
  //This code considers the amount of available time we have.
  //If the travel time takes so long, the museum that's been found will be excluded on the list
  //of museums that we will possibly travel to.
  const calculateMuseumEta = (
    museums: google.maps.places.PlaceResult[],
    origin: { lat: number; lng: number }
  ) => {
    const directionsService = new google.maps.DirectionsService();
    const minTourTime = 20;
    const maxTourTime = 60; //change the maximum time to your liking
    let remainingAvailableTime = availableTime * 60;
    const etaMuseums: MuseumWithDistanceAndEta[] = [];

    //sort the museums from nearest to furthest
    const sortedMuseums = museums.sort((a, b) => {
      const aLat = a.geometry?.location?.lat() ?? 0;
      const aLng = a.geometry?.location?.lng() ?? 0;
      const bLat = b.geometry?.location?.lat() ?? 0;
      const bLng = b.geometry?.location?.lng() ?? 0;

      const distanceA = Math.hypot(origin.lat - aLat, origin.lng - aLng);
      const distanceB = Math.hypot(origin.lat - bLat, origin.lng - bLng);

      return distanceA - distanceB;
    });

    //map the museums with travel time
    //assign a tour time for each museums
    //maximum of 1hr tour time
    const etaPromises = sortedMuseums.map((museum) => {
      const destination = museum.geometry?.location;
      if (!destination) return Promise.resolve(null);

      if (
        museum.business_status?.toString().toUpperCase() ===
        "CLOSED_TEMPORARILY" // Skip this museum
      ) {
        return Promise.resolve(null);
      }

      return new Promise<MuseumWithDistanceAndEta | null>((resolve) => {
        directionsService.route(
          {
            origin: new google.maps.LatLng(origin.lat, origin.lng),
            destination: new google.maps.LatLng(
              destination.lat(),
              destination.lng()
            ),
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              const distance = result.routes[0].legs[0].distance?.value ?? 0;
              const travelTime =
                (result.routes[0].legs[0].duration?.value ?? 0) / 60;

              if (travelTime + minTourTime <= remainingAvailableTime) {
                const tourTime = Math.min(
                  maxTourTime,
                  Math.max(minTourTime, remainingAvailableTime - travelTime)
                );
                const totalMuseumTime = travelTime + tourTime;

                remainingAvailableTime -= totalMuseumTime;

                etaMuseums.push({
                  ...museum,
                  distance,
                  tour_eta: { eta: travelTime, tour_time: tourTime },
                });
                resolve({
                  ...museum,
                  distance,
                  tour_eta: { eta: travelTime, tour_time: tourTime },
                });
              } else {
                resolve(null);
              }
            } else {
              resolve(null);
            }
          }
        );
      });
    });

    Promise.all(etaPromises).then(() => {
      const validMuseums = etaMuseums.filter(
        (museum) => museum !== null
      ) as MuseumWithDistanceAndEta[];

      setHasLocations(true);
      setMuseumsInRouteStore(validMuseums);
    });
  };

  const startNavigation = () => {
    setIsNavigating(true);
    if (location && destination && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 16,
      });
      const waypoints = museumsInRouteStore.map((museum) => ({
        location: {
          lat: museum.geometry?.location?.lat() ?? 0,
          lng: museum.geometry?.location?.lng() ?? 0,
        },
      }));

      drawRoute(map, location, destination, waypoints, setEta);
    }
  };

  //this will start the navigation for multiple locations
  const startMultipleNavigation = () => {
    setIsNavigating(true);
    if (location && museumsInRouteStore.length > 0 && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 14,
      });

      const waypoints = museumsInRouteStore.slice(0, -1).map((museum) => ({
        location: {
          lat: museum.geometry?.location?.lat() ?? 0,
          lng: museum.geometry?.location?.lng() ?? 0,
        },
      }));

      const finalDestination =
        museumsInRouteStore[museumsInRouteStore.length - 1];
      const destinationLocation = finalDestination.geometry?.location;

      if (destinationLocation) {
        drawRoute(
          map,
          location,
          {
            lat: destinationLocation.lat(),
            lng: destinationLocation.lng(),
          },
          waypoints,
          setEta
        );
      }
    }
  };

  //if we're on navigation mode, this will exit the navigation
  const exitNavigation = () => {
    setIsNavigating(false);
    setEta(null);
    if (mapRef.current) {
      new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 16,
      });
    }
  };

  //once the tour is done, the suggestiveSystem should be turned off
  useEffect(() => {
    if (museumsInRouteStore.length === 0) {
      setSuggestiveSystem(false);
    }
  }, [setSuggestiveSystem, museumsInRouteStore]);

  return (
    <>
      <DraggableMenuComponent isOpen={isOpen} setIsOpen={setIsOpen}>
        {suggestiveSystem && museumsInRouteStore.length > 0 ? (
          <AutomatedMapping
            museumsInRoute={museumsInRouteStore}
            startNavigation={startNavigation}
            haversineDistance={() => haversineDistance}
            eta={eta}
            museums={angonoMuseums}
            setDestination={setDestination}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            startMultipleNavigation={startMultipleNavigation}
          />
        ) : (
          <ManualMapping
            eta={eta}
            museums={angonoMuseums}
            setDestination={setDestination}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            startNavigation={startNavigation}
          />
        )}
      </DraggableMenuComponent>
      {isNavigating && (
        <Button
          type={"button"}
          variant={"destructive"}
          className={"absolute top-[15px] right-[15px]"}
          onClick={exitNavigation}
        >
          Exit Navigation
        </Button>
      )}
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }}></div>
    </>
  );
};

export default MapComponent;
