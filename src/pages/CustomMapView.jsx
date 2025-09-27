import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { GoogleMap, Polygon, useLoadScript, InfoWindow, MarkerF, MarkerClusterer } from '@react-google-maps/api';
import SectionTop from "../ui/SectionTop";
import axiosInstance from "../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { GOOGLE_MAPS_API_KEY } from "../config/googleMaps";

// Map container dimensions
const containerStyle = {
  width: '100%',
  height: '80vh',
};

// Approximate geographical centre of the UAE
const mapCenter = { lat: 24.4667, lng: 54.3667 };

// Base polygon style (can be overridden per–polygon)
const basePolygonOptions = {
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillOpacity: 0.4,
  clickable: true,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1,
};

// Helper to choose a consistent colour for each polygon based on index
const palette = [
  '#ff6b6b', // Red-ish
  '#feca57', // Amber
  '#1dd1a1', // Green-teal
  '#54a0ff', // Blue
  '#5f27cd', // Purple
  '#48dbfb', // Light-blue
  '#ff9ff3', // Pink
];
const pickColor = (index) => palette[index % palette.length];

const CustomMapView = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [features, setFeatures] = useState([]);
  const [selectedPoly, setSelectedPoly] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(7);
  const mapRef = useRef(null);

  // ---------------- Fetch Off-plan Projects -----------------
  const fetchProjects = async () => {
    const { data } = await axiosInstance.get(
      "/properties/pool_projects",
      { params: { sort_by_date: "DESC", page: 1, size: 2000 } }
    );
    return data.projects || [];
  };

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["offplan-projects"],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch UAE GeoJSON once on mount
  useEffect(() => {
    fetch('/ae.json')
      .then((res) => res.json())
      .then((geo) => setFeatures(geo.features || []))
      .catch((err) => console.error('Failed to load ae.json:', err));
  }, []);

  // Convert GeoJSON coordinates (lng,lat) → Google Maps LatLng literals (lat,lng)
  const polygons = useMemo(() => {
    return features.flatMap((feature) => {
      const { geometry, properties } = feature;
      if (!geometry) return [];

      const toLatLng = (ring) => ring.map(([lng, lat]) => ({ lat, lng }));

      // Handle Polygon and MultiPolygon
      if (geometry.type === 'Polygon') {
        return [
          {
            paths: toLatLng(geometry.coordinates[0]),
            name: properties?.name,
          },
        ];
      }
      if (geometry.type === 'MultiPolygon') {
        return geometry.coordinates.map((poly) => ({
          paths: toLatLng(poly[0]),
          name: properties?.name,
        }));
      }
      return [];
    });
  }, [features]);

  // Helper to get LatLng from project
  const parseLatLng = useCallback((proj) => {
    if (proj.location && proj.location.latitude && proj.location.longitude)
      return {
        lat: Number(proj.location.latitude),
        lng: Number(proj.location.longitude),
      };
    if (proj.area?.position) {
      const [lat, lng] = proj.area.position.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
    return null;
  }, []);

  const markersData = useMemo(() => {
    return projects
      .map((p) => ({ ...p, position: parseLatLng(p) }))
      .filter((p) => p.position);
  }, [projects, parseLatLng]);

  // After polygons fetched and map loaded, fit bounds
  useEffect(() => {
    if (!mapRef.current) return;
    const bounds = new window.google.maps.LatLngBounds();
    polygons.forEach((p) => {
      p.paths.forEach((pt) => bounds.extend(pt));
    });
    if (!bounds.isEmpty()) mapRef.current.fitBounds(bounds, 40);
  }, [polygons, isLoaded]);

  if (loadError)
    return (
      <Box p={4} textAlign="center">
        <Typography color="error">Google Maps लोड करने में त्रुटि: {loadError.message}</Typography>
      </Box>
    );

  if (!isLoaded)
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );

  return (
    <div className="sectionContainer">
      <SectionTop heading="UAE Map" />
      <section className="sectionStyles">
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={7}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            onZoomChanged={() => {
              if (mapRef.current) {
                setZoomLevel(mapRef.current.getZoom());
              }
            }}
            options={{ mapTypeControl: false, fullscreenControl: false }}
            onClick={() => {
              setSelectedPoly(null);
              setSelectedProject(null);
            }}
          >
            {polygons.map((poly, idx) => (
              <Polygon
                key={idx}
                paths={poly.paths}
                options={{
                  ...basePolygonOptions,
                  fillColor: pickColor(idx),
                  strokeColor: pickColor(idx),
                }}
                onClick={() =>
                  setSelectedPoly({ name: poly.name, position: poly.paths[0] })
                }
              />
            ))}

            {/* Off-plan Project Markers */}
            {!projectsLoading && zoomLevel >= 8 && (
              <MarkerClusterer>
                {(clusterer) =>
                  markersData.map((proj) => (
                    <MarkerF
                      key={proj.id}
                      position={proj.position}
                      clusterer={clusterer}
                      icon={{
                        url: proj.developer?.logoUrl || undefined,
                        scaledSize: new window.google.maps.Size(40, 40),
                      }}
                      onClick={() => {
                        setSelectedProject(proj);
                        setSelectedPoly(null);
                      }}
                    />
                  ))
                }
              </MarkerClusterer>
            )}

            {selectedPoly && (
              <InfoWindow
                position={selectedPoly.position}
                onCloseClick={() => setSelectedPoly(null)}
              >
                <Typography variant="subtitle2">{selectedPoly.name}</Typography>
              </InfoWindow>
            )}

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
                    sx={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 1, mb: 1 }}
                  />
                  <Typography variant="subtitle2" fontWeight={600}>{selectedProject.name}</Typography>
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
        </Paper>
      </section>
    </div>
  );
};

export default CustomMapView; 