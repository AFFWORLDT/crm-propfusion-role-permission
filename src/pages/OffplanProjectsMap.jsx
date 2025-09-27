import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  InfoWindow,
  MarkerClusterer,
  useLoadScript,
} from "@react-google-maps/api";
import SectionTop from "../ui/SectionTop";
import { GOOGLE_MAPS_API_KEY } from "../config/googleMaps";
import axiosInstance from "../utils/axiosInstance";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

// Google Maps container dimensions
const containerStyle = { width: "100%", height: "75vh" };

// Fallback centre (Dubai)
const defaultCenter = { lat: 25.2048, lng: 55.2708 };

// Fetcher function
const fetchOffplanProjects = async () => {
  // Fetch first 500 projects ordered by date desc
  const { data } = await axiosInstance.get(
    "/properties/pool_projects",
    {
      params: { sort_by_date: "DESC", page: 1, size: 2000 },
    }
  );
  return data.projects || [];
};

const parseLatLng = (project) => {
  // 1) Try explicit location object
  if (project.location && project.location.latitude && project.location.longitude) {
    return {
      lat: Number(project.location.latitude),
      lng: Number(project.location.longitude),
    };
  }
  // 2) Fallback to area.position string "lat,lng"
  if (project.area?.position) {
    const [lat, lng] = project.area.position.split(",").map(Number);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  return null;
};

function OffplanProjectsMap() {
  const mapRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Load Google Maps JS
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Fetch projects via React-Query
  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError,
  } = useQuery({ queryKey: ["offplan-projects"], queryFn: fetchOffplanProjects });

  // Memoize markers data with valid lat/lng only
  const markersData = useMemo(() => {
    return projects
      .map((p) => ({ ...p, position: parseLatLng(p) }))
      .filter((p) => p.position);
  }, [projects]);

  // Fit bounds once map + markers ready
  useEffect(() => {
    if (!mapRef.current || markersData.length === 0) return;
    const bounds = new window.google.maps.LatLngBounds();
    markersData.forEach((p) => bounds.extend(p.position));
    mapRef.current.fitBounds(bounds, 60);
  }, [markersData, isLoaded]);

  const handleMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // *************** Render ***************
  if (loadError)
    return (
      <Box p={3}>
        <Typography color="error">Error loading Google Maps</Typography>
      </Box>
    );

  return (
    <Box px={2} pb={4}>
      <SectionTop title="Off-plan Projects Map" />

      {projectsLoading || !isLoaded ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={6}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Typography color="error" align="center">
          Unable to load projects.
        </Typography>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={8}
          onLoad={handleMapLoad}
          options={{
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControl: true,
          }}
          onClick={() => setSelectedProject(null)}
        >
          <MarkerClusterer>
            {(clusterer) =>
              markersData.map((project) => (
                <MarkerF
                  key={project.id}
                  position={project.position}
                  clusterer={clusterer}
                  icon={{
                    url: project.developer?.logoUrl || undefined,
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  onClick={() => setSelectedProject(project)}
                />
              ))
            }
          </MarkerClusterer>

          {selectedProject && (
            <InfoWindow
              position={selectedProject.position}
              onCloseClick={() => setSelectedProject(null)}
            >
              <Box maxWidth={220}>
                <Box
                  component="img"
                  src={selectedProject.photos?.[0]}
                  alt={selectedProject.name}
                  sx={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 1, mb: 1 }}
                />
                <Typography variant="subtitle1" fontWeight="600">
                  {selectedProject.name}
                </Typography>
                {selectedProject.newParam?.price && (
                  <Typography variant="body2" color="text.secondary">
                    Starting AED {Number(selectedProject.newParam.price).toLocaleString()}
                  </Typography>
                )}
                {selectedProject.developer?.name && (
                  <Typography variant="caption" color="text.secondary">
                    by {selectedProject.developer.name}
                  </Typography>
                )}
              </Box>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </Box>
  );
}

export default OffplanProjectsMap; 