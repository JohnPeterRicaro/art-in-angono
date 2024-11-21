import { hardcodedMuseumNames } from "@/components/MapComponent/data";

export const fetchHardcodedMuseums = async (
  googleInstance: typeof window.google,
  map: google.maps.Map
) => {
  const service = new googleInstance.maps.places.PlacesService(map);

  // Iterate through each museum name and fetch from Google Places
  const fetchPromises = hardcodedMuseumNames.map(
    (name) =>
      new Promise<google.maps.places.PlaceResult | null>((resolve) => {
        service.textSearch(
          {
            query: name,
            location: { lat: 14.5454, lng: 121.1576 }, // Use Angono as the central point
            radius: 5000, // Search radius
          },
          (results, status) => {
            if (
              status === googleInstance.maps.places.PlacesServiceStatus.OK &&
              results?.length
            ) {
              resolve(results[0]); // Use the first result
            } else {
              console.warn(`No result found for ${name}`);
              resolve(null); // If no result, return null
            }
          }
        );
      })
  );

  // Wait for all promises to complete
  const results = await Promise.all(fetchPromises);

  // Filter out null values and return valid results
  return results.filter(
    (result): result is google.maps.places.PlaceResult => result !== null
  );
};
