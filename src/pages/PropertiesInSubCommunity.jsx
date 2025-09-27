import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { List, Map, MapPin, Building2, Loader2 } from "lucide-react";
import PlotMap from "../ui/PlotMap";
import { getApiUrl } from "../utils/getApiUrl";
import styles from "../styles/PropertiesInSubCommunity.module.css";
import SectionTop from "../ui/SectionTop";

export default function PropertiesInSubCommunity() {
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city");
  const community = searchParams.get("community");
  const sub_community = searchParams.get("sub_community");
  const initialView = searchParams.get("view") === 'map' ? 'map' : 'list';
  const [viewMode, setViewMode] = useState(initialView);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10000;
  const [allData, setAllData] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const listEndRef = useRef(null);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || isFetchingMore) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      if (allData.length < total) {
        setIsFetchingMore(true);
        setPage((prev) => prev + 1);
      }
    }
  }, [loading, isFetchingMore, allData.length, total]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    async function fetchData() {
      if (page === 1) setLoading(true);
      setError(null);
      try {
        let url = `${getApiUrl()}/locations/locations/list?location_type=property&city=${encodeURIComponent(city)}&community=${encodeURIComponent(community)}`;
        if (sub_community) {
          url += `&sub_community=${encodeURIComponent(sub_community)}`;
        }
        url += `&page=${page}&size=${pageSize}`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch properties");
        const json = await res.json();
        setTotal(json.total || 0);
        if (page === 1) {
          setAllData(json.locations || []);
        } else {
          setAllData((prev) => [...prev, ...(json.locations || [])]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    }
    if (city && community) fetchData();
  }, [city, community, sub_community, page]);

  if (loading) return (
    <div className={styles.loading}>
      <Loader2 className={styles.loadingIcon} size={24} />
      Loading...
    </div>
  );
  if (error) return <div className={styles.error}>{error}</div>;

  // Map center calculation (default to Dubai if no data)
  const mapCenter = allData.length > 0
    ? [allData[0].latitude || 25.276987, allData[0].longitude || 55.296249]
    : [25.276987, 55.296249];

  // Prepare addresses for PlotMap
  const addresses = allData
    .filter((d) => d.latitude && d.longitude)
    .map((d) => ({
      id: d.id || d.name,
      position: `${d.latitude},${d.longitude}`,
      name: d.name,
      description: `${d.sub_community ? d.sub_community + ', ' : ''}${d.community}, ${d.city}`,
      price: undefined,
      photo: undefined,
      agentIcon: null,
    }));

  return (
    <div className="sectionContainer">
      <SectionTop heading="Properties" />
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Building2 className={styles.titleIcon} size={24} />
          Properties in {sub_community ? `${sub_community}, ` : ''}{community}, {city}
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
        </div>
      </div>
      {viewMode === 'list' ? (
        allData.length === 0 ? (
          <div className={styles.emptyState}>No properties found.</div>
        ) : (
          <>
            <div className={styles.grid}>
              {allData.map((item) => (
                <div key={item.name} className={styles.card}>
                  <MapPin className={styles.cardIcon} size={20} />
                  <h3 className={styles.cardTitle}>{item.name}</h3>
                  <div className={styles.cardLocation}>
                    {item.sub_community ? `${item.sub_community}, ` : ''}{item.community}, {item.city}
                  </div>
                  <div className={styles.cardCoordinates}>
                    Lat: {item.latitude}, Lng: {item.longitude}
                  </div>
                </div>
              ))}
            </div>
            <div ref={listEndRef}></div>
            {(loading || isFetchingMore) && <div className={styles.loadMore}>Loading...</div>}
            {allData.length >= total && total > 0 && <div className={styles.allLoaded}>All properties loaded ({total})</div>}
          </>
        )
      ) : (
        <div className="sectionStyles">
          <PlotMap
            listingType="property"
            addresses={addresses}
            initialHeight={window.innerHeight - 110}
            center={{ lat: mapCenter[0], lng: mapCenter[1] }}
          />
        </div>
      )}
    </div>
  );
} 