import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { List, Map, MapPin, Building2, CheckSquare, Loader2 } from "lucide-react";
import PlotMap from "../ui/PlotMap";
import { getApiUrl } from "../utils/getApiUrl";
import styles from "../styles/SubCommunityList.module.css";
import SectionTop from "../ui/SectionTop";

export default function SubCommunityList() {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");
  const community = searchParams.get("community");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [showAllProperties, setShowAllProperties] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${getApiUrl()}/locations/locations/list?location_type=sub_community&city=${encodeURIComponent(city)}&community=${encodeURIComponent(community)}&page=1&size=10000`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch sub-communities");
        const json = await res.json();
        setData(json.locations || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (city && community) fetchData();
  }, [city, community]);

  if (loading) return (
    <div className={styles.loading}>
      <Loader2 className={styles.loadingIcon} size={24} />
      Loading...
    </div>
  );
  if (error) return <div className={styles.error}>{error}</div>;

  function handleSubCommunityClick(item) {
    const viewParam = viewMode === 'map' ? '&view=map' : '';
    navigate(`/properties-in-subcommunity?city=${encodeURIComponent(item.city)}&community=${encodeURIComponent(item.community)}&sub_community=${encodeURIComponent(item.name)}${viewParam}`);
  }

  // Map center calculation (default to Dubai if no data)
  const mapCenter = data.length > 0
    ? [data[0].latitude || 25.276987, data[0].longitude || 55.296249]
    : [25.276987, 55.296249];

  // Prepare addresses for PlotMap
  const addresses = data
    .filter((d) => d.latitude && d.longitude)
    .map((d) => ({
      id: d.id || d.name,
      position: `${d.latitude},${d.longitude}`,
      name: d.name,
      description: `${d.community}, ${d.city}`,
      price: undefined,
      photo: undefined,
      agentIcon: null,
    }));

  return (
    <div className="sectionContainer">
    <SectionTop heading="Sub-Communities" />
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Building2 className={styles.titleIcon} size={24} />
          Sub-Communities in {community}, {city}
        </h2>
        <div className={styles.controls}>
          <div className={styles.viewButtons}>
            <button 
              onClick={() => setViewMode('list')} 
              className={styles.viewButton}
              data-active={viewMode === 'list'}
            >
              <List size={18} />
              List View
            </button>
            <button 
              onClick={() => setViewMode('map')} 
              className={styles.viewButton}
              data-active={viewMode === 'map'}
            >
              <Map size={18} />
              Map View
            </button>
          </div>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={showAllProperties}
              onChange={e => {
                setShowAllProperties(e.target.checked);
                if (e.target.checked) {
                  navigate(`/properties-in-subcommunity?city=${encodeURIComponent(city)}&community=${encodeURIComponent(community)}&view=${viewMode}`);
                }
              }}
            />
            <CheckSquare size={18} className={styles.checkIcon} />
            Show all properties in this community
          </label>
        </div>
      </div>
      {viewMode === 'list' ? (
        data.length === 0 ? (
          <div className={styles.emptyState}>No sub-communities found.</div>
        ) : (
          <div className={styles.grid}>
            {data.map((item) => (
              <div key={item.name} className={styles.card} onClick={() => handleSubCommunityClick(item)}>
                <MapPin className={styles.cardIcon} size={20} />
                <h3 className={styles.cardTitle}>{item.name}</h3>
                <div className={styles.cardLocation}>{item.community}, {item.city}</div>
                <div className={styles.cardCoordinates}>
                  Lat: {item.latitude}, Lng: {item.longitude}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="sectionStyles">
          <PlotMap
            listingType="sub"
            addresses={addresses}
            initialHeight={window.innerHeight - 110}
            center={{ lat: mapCenter[0], lng: mapCenter[1] }}
            onMarkerClick={(addr) => {
              const item = data.find((d) => d.name === addr.name);
              if (item) handleSubCommunityClick(item);
            }}
          />
        </div>
      )}
    </div>
  );
} 