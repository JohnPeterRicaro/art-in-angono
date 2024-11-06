"use client";

import DraggableMenuComponent from "@/components/draggable-menu-component";
import angonoPolygonCoords, {
  getHardcodedMuseums,
} from "@/components/MapComponent/data";
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
  const proximityThreshold = 0.05; // proximity threshold is 0.05

  // Watch user's position and update location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation);
          localStorage.setItem("location", JSON.stringify(newLocation));

          if (mapInstance.current && markerInstance.current) {
            // Update the marker position and pan the map to the new location
            markerInstance.current.setPosition(newLocation);
            mapInstance.current.panTo(newLocation);
          }
        },
        (error) => {
          console.error("Error watching position:", error);
        }
      );
    }
  }, []); // Empty dependency array ensures the watcher is set up only once

  // Initialize the map
  useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current && google && location) {
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
    };

    if (location && google) {
      initializeMap();
    }
  }, [google, location, suggestiveSystem, hasLocations]);

  // Trigger when user is near the location
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

  // Haversine formula to calculate distance
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

  // Fetch museums with ETA within Angono boundaries
  const fetchMuseumsWithEta = (
    map: google.maps.Map,
    userLocation: { lat: number; lng: number }
  ) => {
    const service = new google.maps.places.PlacesService(map);

    const angonoPolygon = new google.maps.Polygon({
      paths: angonoPolygonCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.1,
    });

    angonoPolygon.setMap(map);

    const angonoLocation = { lat: 14.5454, lng: 121.1576 };
    const distanceToAngono = haversineDistance(userLocation, angonoLocation);
    const isNearbyAngono = distanceToAngono <= 5;

    const locationToSearch = isNearbyAngono ? angonoLocation : userLocation;

    // Search nearby using Google Places API
    service.nearbySearch(
      {
        location: locationToSearch,
        radius: 5000,
        type: "museum",
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // Filter results to include only those within the polygon
          const museumsWithinPolygon = results.filter((result) => {
            if (result.geometry?.location) {
              return google.maps.geometry.poly.containsLocation(
                result.geometry.location,
                angonoPolygon
              );
            }
            return false;
          });

          // Add hardcoded museums to the list
          const hardcodedMuseums = getHardcodedMuseums();
          const allMuseums = [...museumsWithinPolygon, ...hardcodedMuseums];

          // Calculate ETA for filtered museums
          calculateMuseumEta(allMuseums, userLocation);
        } else {
          console.warn("No results found or error fetching museums.");
        }
      }
    );

    // Add hardcoded museums as markers on the map
    const hardcodedMuseums = getHardcodedMuseums();
    hardcodedMuseums.forEach((museum) => {
      new google.maps.Marker({
        position: museum.geometry.location,
        map,
        title: museum.name,
      });
    });
  };

  const fetchMuseumsInAngonoRizal = (map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);

    const angonoPolygon = new google.maps.Polygon({
      paths: angonoPolygonCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.1,
    });

    angonoPolygon.setMap(map);

    // Search for museums within the Angono area
    service.nearbySearch(
      {
        location: angonoPolygonCoords[0],
        radius: 5000,
        type: "museum",
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const museumsWithinPolygon = results.filter((result) => {
            if (result.geometry?.location) {
              return google.maps.geometry.poly.containsLocation(
                result.geometry.location,
                angonoPolygon
              );
            }
            return false;
          });

          // Add hardcoded museums to the list
          const hardcodedMuseums = getHardcodedMuseums();
          const allMuseums = [...museumsWithinPolygon, ...hardcodedMuseums];

          setAngonoMuseums(allMuseums as MuseumWithDistanceAndEta[]);
          allMuseums.forEach((museum) => {
            if (museum.geometry?.location) {
              new google.maps.Marker({
                position: museum.geometry.location,
                map,
                title: museum.name,
              });
            }
          });
        } else {
          console.warn("No results found or error fetching museums.");
        }
      }
    );

    const hardcodedMuseums = getHardcodedMuseums();
    hardcodedMuseums.forEach((museum) => {
      new google.maps.Marker({
        position: museum.geometry.location,
        map,
        title: museum.name,
      });
    });
  };

  // Function to get hardcoded museums

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
