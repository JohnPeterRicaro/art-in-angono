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
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [museumsWithEta, setMuseumsWithEta] = useState<
    MuseumWithDistanceAndEta[]
  >([]);
  const [museumsInRoute, setMuseumsInRoute] = useState<
    MuseumWithDistanceAndEta[]
  >([]);
  const [eta, setEta] = useState<string | null>(null);
  const [destination, setDestination] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [angonoMuseums, setAngonoMuseums] = useState<
    MuseumWithDistanceAndEta[]
  >([]);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [hasLoadedMuseums, setHasLoadedMuseums] = useState<boolean>(false);
  const {
    suggestiveSystem,
    availableTime,
    museumsInRoute: museumsInRouteStore,
    setMuseumsInRoute: setMuseumsInRouteStore,
    setSuggestiveSystem,
  } = useTrackingContainerStore();
  const router = useRouter();

  const proximityThreshold = 0.5;

  useEffect(() => {
    setHasLoadedMuseums(true);
    setMuseumsInRoute(
      museumsInRoute.filter((museum) =>
        museumsInRouteStore.some(
          (storeMuseum) => storeMuseum.place_id === museum.place_id
        )
      )
    );
  }, [museumsInRouteStore]);

  useEffect(() => {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      const newLocation = { lat: latitude, lng: longitude };
      setLocation(newLocation);
      localStorage.setItem("location", JSON.stringify(newLocation));
    });
  }, []);

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
        setLocation({ lat: 14.5253395, lng: 121.1493303 });
      } else {
        setLocation(parsedSavedLocation);
      }
    }
  }, [localStorage.getItem("location")]);

  useEffect(() => {
    if (mapRef.current && google && location) {
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 16,
      });

      const marker = new google.maps.Marker({
        position: location,
        map,
        draggable: true,
        title: "Drag me!",
      });

      marker.addListener("dragend", (event: google.maps.MapMouseEvent) => {
        const newLocation = {
          lat: event?.latLng?.lat() ?? location?.lat ?? 0,
          lng: event?.latLng?.lng() ?? location?.lng ?? 0,
        };
        setLocation(newLocation);
        localStorage.setItem("location", JSON.stringify(newLocation));

        if (suggestiveSystem) {
          fetchMuseumsWithEta(map, newLocation);
        } else {
          fetchMuseumsInAngonoRizal(map);
        }
      });

      // Initial map setup based on suggestiveSystem
      if (suggestiveSystem) {
        fetchMuseumsWithEta(map, location);
      } else {
        fetchMuseumsInAngonoRizal(map); // Ensure markers display
      }
    }
  }, [google, location, suggestiveSystem]);

  useEffect(() => {
    if (location && museumsInRoute.length > 0) {
      const nextMuseum = museumsInRoute[0];
      const nextDestination = {
        lat: nextMuseum.geometry?.location?.lat() ?? 0,
        lng: nextMuseum.geometry?.location?.lng() ?? 0,
      };

      const distanceToNext = haversineDistance(location, nextDestination);

      if (distanceToNext <= proximityThreshold) {
        router.push("/tracking/timer");
      }
    }
  }, [location, museumsInRoute]);

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

  const fetchMuseumsInAngonoRizal = (map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);
    const angonoLocation = { lat: 14.5275, lng: 121.1711 }; // angono rizal

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

  const calculateMuseumEta = (
    museums: google.maps.places.PlaceResult[],
    origin: { lat: number; lng: number }
  ) => {
    const directionsService = new google.maps.DirectionsService();
    const etaMuseums: MuseumWithDistanceAndEta[] = [];
    let accumulatedTime = 0;

    const totalEta = museums.reduce((total, museum) => {
      const destination = museum.geometry?.location;
      if (!destination) return total;
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
            const duration = result.routes[0].legs[0].duration?.value ?? 0;
            total += duration / 60;
          }
        }
      );
      return total;
    }, 0);

    const availableTourTime = Math.max(0, availableTime * 60 - totalEta);
    const dividedTourTime =
      museums.length > 1
        ? availableTourTime / museums.length
        : availableTourTime;

    museums.forEach((museum, index) => {
      const destination = museum.geometry?.location;
      if (destination) {
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
              const etaInMinutes =
                result.routes[0].legs[0].duration?.value ?? 0 / 60;

              const tourTime =
                museums.length === 1 ? availableTourTime : dividedTourTime;

              const totalMuseumTime = etaInMinutes + tourTime;

              if (accumulatedTime + totalMuseumTime <= availableTime * 60) {
                accumulatedTime += totalMuseumTime;

                etaMuseums.push({
                  ...museum,
                  distance,
                  tour_eta: { eta: etaInMinutes, tour_time: tourTime },
                });
              }

              if (index === museums.length - 1) {
                setMuseumsWithEta(
                  etaMuseums.sort(
                    (a, b) => (a.distance ?? 0) - (b.distance ?? 0)
                  )
                );
                setMuseumsInRouteStore(etaMuseums);
                setMuseumsInRoute(etaMuseums);
              }
            }
          }
        );
      }
    });
  };

  const startNavigation = () => {
    setIsNavigating(true);
    if (location && destination && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 16,
      });
      const waypoints = museumsInRoute.map((museum) => ({
        location: {
          lat: museum.geometry?.location?.lat() ?? 0,
          lng: museum.geometry?.location?.lng() ?? 0,
        },
      }));

      drawRoute(map, location, destination, waypoints, setEta);
    }
  };

  const startMultipleNavigation = () => {
    setIsNavigating(true);
    if (location && museumsInRoute.length > 0 && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 14,
      });

      const waypoints = museumsInRoute.slice(0, -1).map((museum) => ({
        location: {
          lat: museum.geometry?.location?.lat() ?? 0,
          lng: museum.geometry?.location?.lng() ?? 0,
        },
      }));

      const finalDestination = museumsInRoute[museumsInRoute.length - 1];
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

  useEffect(() => {
    if (
      !isNavigating &&
      hasLoadedMuseums &&
      museumsInRouteStore.length === 0 &&
      museumsInRoute.length === 0
    ) {
      setSuggestiveSystem(false);
    }
  }, [isNavigating, museumsInRoute, setSuggestiveSystem, hasLoadedMuseums]);

  return (
    <>
      <DraggableMenuComponent isOpen={isOpen} setIsOpen={setIsOpen}>
        {suggestiveSystem ? (
          <AutomatedMapping
            museumsInRoute={museumsInRoute}
            startNavigation={startNavigation}
            haversineDistance={() => haversineDistance}
            eta={eta}
            museums={museumsWithEta}
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
