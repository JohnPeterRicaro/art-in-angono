export const loadGoogleMaps = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!apiKey) {
      console.error("Google Maps API key is missing");
      reject(new Error("API key is missing"));
      return;
    }

    const existingScript = document.querySelector(
      `script[src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places"]`
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;

      script.onload = () => {
        console.log("Google Maps script loaded successfully");
        resolve();
      };

      script.onerror = () => {
        console.error("Error loading Google Maps script");
        reject(new Error("Error loading Google Maps script"));
      };

      document.head.appendChild(script);
    } else {
      console.log("Google Maps script already exists");
      resolve();
    }
  });
};
