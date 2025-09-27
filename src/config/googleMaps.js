// Google Maps API Key Configuration
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCuk4slyXMzBAh1XocahaRnpkp_2sueWas";

// Fallback API key for production
const FALLBACK_API_KEY = "AIzaSyCuk4slyXMzBAh1XocahaRnpkp_2sueWas";

export const getGoogleMapsApiKey = () => {
  // Check if we're in production
  const isProduction = import.meta.env.PROD;
  
  if (isProduction) {
    // In production, use environment variable or fallback
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || FALLBACK_API_KEY;
  }
  
  // In development, use the hardcoded key
  return GOOGLE_MAPS_API_KEY;
};

export { GOOGLE_MAPS_API_KEY }; 