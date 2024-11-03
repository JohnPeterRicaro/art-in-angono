import { Dispatch, SetStateAction } from "react";

export const drawRoute = (
  map: google.maps.Map,
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  waypoints: { location: { lat: number; lng: number } }[],
  setEta: Dispatch<SetStateAction<string | null>>
) => {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({ map });

  directionsService.route(
    {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      waypoints: waypoints.map((wp) => ({
        location: new google.maps.LatLng(wp.location.lat, wp.location.lng),
        stopover: true,
      })),
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.setDirections(result);
        const totalDuration = result.routes[0].legs.reduce(
          (total, leg) => total + (leg.duration?.value || 0),
          0
        );
        setEta(`${Math.round(totalDuration / 60)} mins`);
      } else {
        console.error(`Error fetching directions: ${result}`);
        setEta("Unavailable");
      }
    }
  );
};
