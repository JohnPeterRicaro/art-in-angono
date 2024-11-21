"use client";

import DraggableMenuComponent from "@/components/draggable-menu-component";
import angonoPolygonCoords, {
  getHardcodedMuseums,
} from "@/components/MapComponent/data";
import { Button } from "@/components/ui/button";
import useTrackingContainerStore from "@/hooks/useTrackingContainerStore";
import ManualMapping from "@/modules/ManualMapping";
import AutomatedMapping from "@/modules/SuggestiveSystem/AutomatedMapping";
import { fetchHardcodedMuseums } from "@/utils/fetchHardCodedMuseums";
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
  const [angonoMuseums, setAngonoMuseums] = useState<
    MuseumWithDistanceAndEta[]
  >([]);
  const [hasLoadedMuseums, setHasLoadedMuseums] = useState<boolean>(false);
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

  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(
    null
  );

  const isNavigationActive = !!(
    directionsRenderer.current && directionsRenderer.current.getMap()
  );

  const router = useRouter();
  const proximityThreshold = 0.05; // proximity threshold is 0.05

  useEffect(() => {
    if (museumsInRouteStore.length > 0) {
      setHasLoadedMuseums(true);
    }
  }, [museumsInRouteStore]);

  // Watch user's position and update location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          if (newLocation.lat === 38.883333 && newLocation.lng === -77) {
            setLocation({ lat: 14.599748, lng: 121.0100337 });
          } else {
            setLocation(newLocation);
          }
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

  // Initialize the map only once when the component mounts
  useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current && google) {
        mapInstance.current = new google.maps.Map(mapRef.current, {
          zoom: 16,
        });
        if (
          suggestiveSystem &&
          mapInstance.current &&
          !hasLocations &&
          location
        )
          fetchMuseumsWithEta(mapInstance.current, location);
        if (mapInstance) fetchMuseumsInAngonoRizal(mapInstance.current);
      }
    };

    if (google) {
      initializeMap();
    }
  }, [suggestiveSystem]);

  useEffect(() => {
    if (location && mapInstance.current) {
      mapInstance.current.panTo(location);

      if (suggestiveSystem && !hasLocations) {
        fetchMuseumsWithEta(mapInstance.current, location);
      }
      fetchMuseumsInAngonoRizal(mapInstance.current);
    }
  }, [location, suggestiveSystem, hasLocations]);

  useEffect(() => {
    if (mapInstance.current && location) {
      if (!markerInstance.current) {
        // Create marker only once
        markerInstance.current = new google.maps.Marker({
          position: location,
          map: mapInstance.current,
          draggable: true,
          title: "Drag me!",
        });

        // Add dragend listener to update location state
        markerInstance.current.addListener(
          "dragend",
          (event: google.maps.MapMouseEvent) => {
            if (event?.latLng) {
              const newLocation = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
              };
              setLocation(newLocation);
              localStorage.setItem("location", JSON.stringify(newLocation));
            }
          }
        );
      } else {
        // Update marker position if it already exists
        markerInstance.current.setPosition(location);
      }

      // Pan the map to the new location
      mapInstance.current.panTo(location);
    }
  }, [location]); // Trigger this effect only when `location` changes

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
      strokeOpacity: 0.1,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0,
    });

    angonoPolygon.setMap(map);

    const angonoLocation = { lat: 14.5454, lng: 121.1576 };
    const distanceToAngono = haversineDistance(userLocation, angonoLocation);
    const isNearbyAngono = distanceToAngono <= 5;

    const locationToSearch = isNearbyAngono ? angonoLocation : userLocation;

    const bounds = new google.maps.LatLngBounds();
    angonoPolygonCoords.forEach((coord) => {
      bounds.extend(coord);
    });

    service.nearbySearch(
      {
        location: locationToSearch,
        radius: 5000, // Adjust radius as needed
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

          // Ensure we have at least one museum before calculating ETA
          if (allMuseums.length > 0) {
            calculateMuseumEta(allMuseums, userLocation);
          } else {
            console.warn(
              "No museums found within the polygon or in hardcoded data."
            );
          }
        } else {
          console.warn("No results found or error fetching museums.");
        }
      }
    );

    // Add hardcoded museums as markers on the map
    const hardcodedMuseums = getHardcodedMuseums();
    hardcodedMuseums.forEach((museum) => {
      if (museum.geometry?.location) {
        new google.maps.Marker({
          position: museum.geometry.location,
          map,
          title: museum.name,
        });
      }
    });
  };

  const fetchMuseumsInAngonoRizal = async (map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);

    const angonoPolygon = new google.maps.Polygon({
      paths: angonoPolygonCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.1,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0,
    });

    angonoPolygon.setMap(map);

    const hardcodedMuseums = await fetchHardcodedMuseums(google, map);

    // Custom icon for markers
    const customIcon = {
      url: "/icons/museum-icon.png", // Replace with your custom icon URL
      scaledSize: new google.maps.Size(40, 40), // Adjust size
    };

    // Add hardcoded museums as markers on the map
    hardcodedMuseums.forEach((museum) => {
      if (museum.geometry?.location) {
        new google.maps.Marker({
          position: museum.geometry.location,
          map,
          title: museum.name,
          icon: customIcon, // Use the custom icon
        });
      }
    });

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

          museumsWithinPolygon.forEach((museum) => {
            if (museum.geometry?.location) {
              new google.maps.Marker({
                position: museum.geometry.location,
                map,
                title: museum.name,
                icon: customIcon,
              });
            }
          });

          setAngonoMuseums([
            ...museumsWithinPolygon,
            ...hardcodedMuseums,
          ] as MuseumWithDistanceAndEta[]);
        } else {
          console.warn("No results found or error fetching museums.");
        }
      }
    );
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

  // const startNavigation = () => {
  //   setIsNavigating(true);
  //   if (location && destination && mapRef.current) {
  //     const map = new google.maps.Map(mapRef.current, {
  //       center: location,
  //       zoom: 16,
  //     });
  //     const waypoints = museumsInRouteStore.map((museum) => ({
  //       location: {
  //         lat: museum.geometry?.location?.lat() ?? 0,
  //         lng: museum.geometry?.location?.lng() ?? 0,
  //       },
  //     }));

  //     drawRoute(map, location, destination, waypoints, setEta);
  //   }
  // };

  //this will start the navigation for multiple locations
  const startMultipleNavigation = () => {
    if (location && museumsInRouteStore.length > 0 && mapRef.current) {
      const map = mapInstance.current!;
      const directionsService = new google.maps.DirectionsService();

      // If there's already a DirectionsRenderer, clear the route
      if (!directionsRenderer.current) {
        directionsRenderer.current = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: false,
          draggable: false,
        });
      }

      const waypoints = museumsInRouteStore.slice(0, -1).map((museum) => ({
        location: {
          lat: museum.geometry?.location?.lat() ?? 0,
          lng: museum.geometry?.location?.lng() ?? 0,
        },
        stopover: true,
      }));

      const finalDestination =
        museumsInRouteStore[museumsInRouteStore.length - 1];
      const destinationLocation = finalDestination.geometry?.location;

      if (destinationLocation) {
        directionsService.route(
          {
            origin: location,
            destination: {
              lat: destinationLocation.lat(),
              lng: destinationLocation.lng(),
            },
            waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.current?.setDirections(result);
            } else {
              console.error("Error fetching directions:", status);
            }
          }
        );
      }
    }
  };

  //if we're on navigation mode, this will exit the navigation
  const exitNavigation = () => {
    if (directionsRenderer.current) {
      directionsRenderer.current.setMap(null); // Remove the directions from the map
      directionsRenderer.current = null; // Reset the reference
    }
    if (mapRef.current) {
      mapInstance.current?.setCenter(
        location || { lat: 14.599512, lng: 120.984222 }
      ); // Reset map center
      mapInstance.current?.setZoom(16);
    }
  };

  //once the tour is done, the suggestiveSystem should be turned off
  useEffect(() => {
    if (hasLoadedMuseums && museumsInRouteStore.length === 0) {
      setSuggestiveSystem(false);
    }
  }, [setSuggestiveSystem, hasLoadedMuseums, museumsInRouteStore]);

  return (
    <>
      <DraggableMenuComponent isOpen={isOpen} setIsOpen={setIsOpen}>
        {suggestiveSystem && museumsInRouteStore.length > 0 ? (
          <AutomatedMapping
            museumsInRoute={museumsInRouteStore}
            haversineDistance={() => haversineDistance}
            angonoMuseums={angonoMuseums}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            startMultipleNavigation={startMultipleNavigation}
          />
        ) : (
          <ManualMapping
            angonoMuseums={angonoMuseums}
            isOpen={isOpen}
            startMultipleNavigation={startMultipleNavigation}
          />
        )}
      </DraggableMenuComponent>
      {isNavigationActive && (
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
