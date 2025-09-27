import PlotMap from "../../ui/PlotMap";
import { useEffect, useMemo, useState } from "react";

// Helper to convert GeoJSON coords (lng,lat) to {lat,lng}
const toLatLng = (ring) => ring.map(([lng, lat]) => ({ lat, lng }));

export default function SellListingsMapView({ properties = [] }) {
  // Filter properties with valid lat/lng
  const mapProperties = (properties || []).filter(
    (p) => p.location && p.location.latitude && p.location.longitude
  );
console.log(mapProperties)
  // Convert to PlotMap address format
  const addresses = mapProperties.map((p) => ({
    ...p,
    position: `${p.location.latitude},${p.location.longitude}`,
    name: p.title || p.location?.community ,
    description: `${p.location.city || ""}${p.location.community ? ", " + p.location.community : ""}`,
    price: p.price,
    photo: p.photos?.[0],
    agentIcon: p.developer?.logoUrl || null,
  }));

  const [polygons, setPolygons] = useState([]);

  // Load UAE geojson once
  useEffect(() => {
    fetch("/ae.json")
      .then((res) => res.json())
      .then((geo) => {
        const palette = [
          "#ff6b6b",
          "#feca57",
          "#1dd1a1",
          "#54a0ff",
          "#5f27cd",
          "#48dbfb",
          "#ff9ff3",
        ];
        const polys = [];
        geo.features.forEach((feature, idx) => {
          const { geometry } = feature;
          const color = palette[idx % palette.length];

          const addPoly = (coords) => {
            polys.push({ paths: toLatLng(coords), fillColor: color });
          };

          if (geometry.type === "Polygon") {
            addPoly(geometry.coordinates[0]);
          } else if (geometry.type === "MultiPolygon") {
            geometry.coordinates.forEach((poly) => addPoly(poly[0]));
          }
        });
        setPolygons(polys);
      })
      .catch((err) => console.error("Failed to load ae.json", err));
  }, []);

  const lType = properties?.[0]?.listing_type?.toLowerCase() || "sell";

  return (
    <PlotMap
      listingType={lType}
      addresses={addresses}
      initialHeight={1000}
      center={{ lat: 25.276987, lng: 55.296249 }}
      polygons={polygons}
    />
  );
} 
