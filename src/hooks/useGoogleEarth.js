import { useState, useEffect } from 'react';
import { loadGoogleEarthAPI, isGoogleEarthLoaded } from '../utils/googleEarthLoader';

export const useGoogleEarth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already loaded
    if (isGoogleEarthLoaded()) {
      setIsLoaded(true);
      return;
    }

    // Load Google Earth API
    const loadAPI = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await loadGoogleEarthAPI();
        setIsLoaded(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAPI();
  }, []);

  const reload = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await loadGoogleEarthAPI();
      setIsLoaded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isLoaded,
    error,
    reload
  };
}; 