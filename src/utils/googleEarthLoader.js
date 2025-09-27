// Google Earth API Loader Utility
import { GOOGLE_MAPS_API_KEY } from "../config/googleMaps";

let isLoaded = false;
let isLoading = false;
let loadPromise = null;

export const loadGoogleEarthAPI = () => {
  if (isLoaded) {
    return Promise.resolve();
  }

  if (isLoading) {
    return loadPromise;
  }

  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    // Check if Google Earth API is already available
    if (window.google && window.google.earth) {
      isLoaded = true;
      isLoading = false;
      resolve();
      return;
    }

    // Load Google Earth API script
    const script = document.createElement('script');
    script.src = `https://www.google.com/jsapi?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Load Google Earth API
      window.google.load('earth', '1', {
        callback: () => {
          isLoaded = true;
          isLoading = false;
          resolve();
        },
        other_params: 'sensor=false'
      });
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load Google Earth API'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

export const isGoogleEarthLoaded = () => {
  return isLoaded && window.google && window.google.earth;
};

export const getGoogleEarthAPI = () => {
  if (!isGoogleEarthLoaded()) {
    throw new Error('Google Earth API is not loaded');
  }
  return window.google.earth;
}; 