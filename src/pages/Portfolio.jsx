import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { getStaff } from "../services/apiStaff";
import styles from '../styles/Portfolio.module.css';
import CompanyFooter from '../components/CompanyFooter';
import { GoogleMap, MarkerF, MarkerClusterer, useLoadScript } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from "../config/googleMaps";

const PropertyCard = ({ property, viewMode }) => {
    if (viewMode === 'grid') {
        return (
            <div className={styles.propertyCard}>
                <div className={styles.propertyImage} style={{ backgroundImage: `url(${property.photos?.[0] || 'https://via.placeholder.com/400x250.png?text=No+Image'})` }}>
                    <span className={styles.propertyType}>{property.property_type?.replace(/_/g, ' ') || 'N/A'}</span>
                </div>
                <div className={styles.propertyContent}>
                    <h3 className={styles.propertyTitle}>{property.title}</h3>
                    <div className={styles.propertyLocation}>
                        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                        </svg>
                        <span>{[property.location?.community, property.location?.city].filter(Boolean).join(', ')}</span>
                    </div>
                    <div className={styles.propertyStats}>
                        <div className={styles.statItem}>
                            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 9h-1V7c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2v2H8c-1.1 0-2 .9-2 2v10h16V11c0-1.1-.9-2-2-2zm-9-2h6v2h-6V7z" fill="currentColor"/>
                            </svg>
                            {property.bedRooms} Beds
                        </div>
                        <div className={styles.statItem}>
                            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 7h10v3h-10z M4 20h16v-2H4v2z M4 15h16v-2H4v2z" fill="currentColor"/>
                            </svg>
                            {property.bathrooms} Baths
                        </div>
                        <div className={styles.statItem}>
                            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 15h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2zm-4 12h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2zm-4 12h2v2H9zm0-4h2v2H9zm0-4h2v2H9zm0-4h2v2H9zm-4 12h2v2H5zm0-4h2v2H5zm0-4h2v2H5zm0-4h2v2H5z" fill="currentColor"/>
                            </svg>
                            {property.size?.toLocaleString()} sqft
                        </div>
                    </div>
                    <div className={styles.propertyPrice}>
                        AED {property.price?.toLocaleString()}
                    </div>
                </div>
            </div>
        );
    }

    const images = property.photos?.length > 0
        ? property.photos.map(p => ({ original: p, thumbnail: p }))
        : [{ original: 'https://via.placeholder.com/800x600.png?text=No+Image', thumbnail: 'https://via.placeholder.com/100x80.png?text=No+Image' }];

    return (
        <div className={`${styles.propertyCard} ${styles.listPropertyCard}`}>
            <div className={styles.listImageContainer}>
                <ImageGallery items={images} showPlayButton={false} showFullscreenButton={false} thumbnailPosition="left"/>
            </div>
            <div className={styles.propertyContent}>
                <h3 className={styles.propertyTitle}>{property.title}</h3>
                <div className={styles.propertyLocation}>
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                    </svg>
                    <span>{[property.location?.community, property.location?.city].filter(Boolean).join(', ')}</span>
                </div>
                <div className={styles.propertyStats}>
                    <div className={styles.statItem}>
                        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 9h-1V7c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2v2H8c-1.1 0-2 .9-2 2v10h16V11c0-1.1-.9-2-2-2zm-9-2h6v2h-6V7z" fill="currentColor"/>
                        </svg>
                        {property.bedRooms} Beds
                    </div>
                    <div className={styles.statItem}>
                        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 7h10v3h-10z M4 20h16v-2H4v2z M4 15h16v-2H4v2z" fill="currentColor"/>
                        </svg>
                        {property.bathrooms} Baths
                    </div>
                    <div className={styles.statItem}>
                        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 15h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2zm-4 12h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2zm0-4h2v2h-2zm-4 12h2v2H9zm0-4h2v2H9zm0-4h2v2H9zm0-4h2v2H9zm-4 12h2v2H5zm0-4h2v2H5zm0-4h2v2H5zm0-4h2v2H5z" fill="currentColor"/>
                        </svg>
                        {property.size?.toLocaleString()} sqft
                    </div>
                </div>
                <div className={styles.propertyPrice}>
                    AED {property.price?.toLocaleString()}
                </div>
            </div>
        </div>
    );
};

const GoogleMapView = ({ properties }) => {
    const validProps = properties.filter(p => p.location?.latitude && p.location?.longitude);
    const defaultCenter = validProps.length ? {
        lat: Number(validProps[0].location.latitude),
        lng: Number(validProps[0].location.longitude),
    } : { lat: 25.276987, lng: 55.296249 };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    if (loadError) return <div className={styles.error}>Error loading map</div>;
    if (!isLoaded) return <div className={styles.loading}>Loading map...</div>;

    return (
        <div className={styles.mapContainer}>
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={defaultCenter}
                zoom={10}
                options={{ streetViewControl: false, fullscreenControl: false }}
            >
                <MarkerClusterer>
                    {(clusterer) =>
                        validProps.map((property) => (
                            <MarkerF
                                key={property.id}
                                position={{
                                    lat: Number(property.location.latitude),
                                    lng: Number(property.location.longitude),
                                }}
                                clusterer={clusterer}
                                onClick={() => window.open(`/properties/${property.id}`, "_blank")}
                            />
                        ))
                    }
                </MarkerClusterer>
            </GoogleMap>
        </div>
    );
};

const Portfolio = () => {
    const { agentId } = useParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agent, setAgent] = useState(null);
    const [companyData, setCompanyData] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
    const [bedroomsFilter, setBedroomsFilter] = useState('');
    const [sortBy, setSortBy] = useState('date_desc');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propertiesResponse, agentResponse, allDataResponse] = await Promise.all([
                    axiosInstance.get(
                        `/properties/get_new_properties?listing_type=SELL&sort=CREATE_TIME&sortType=DESC&status=ACTIVE&size=1000&agent_id=${agentId}`
                    ),
                    getStaff(agentId),
                    axiosInstance.get('/properties/all-data')
                ]);

                setProperties(propertiesResponse.data.properties || []);
                setAgent(agentResponse);
                setCompanyData(allDataResponse.data.company_settings);
            } catch (err) {
                setError("Failed to fetch portfolio data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (agentId) {
            fetchData();
        }
    }, [agentId]);

    const filteredAndSortedProperties = useMemo(() => {
        let filtered = properties
            .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => propertyTypeFilter ? p.property_type === propertyTypeFilter : true)
            .filter(p => bedroomsFilter ? p.bedRooms === bedroomsFilter : true);

        switch (sortBy) {
            case 'price_asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'date_asc':
                filtered.sort((a, b) => new Date(a.createTime) - new Date(b.createTime));
                break;
            default:
                filtered.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
                break;
        }

        return filtered;
    }, [properties, searchTerm, propertyTypeFilter, bedroomsFilter, sortBy]);

    const propertyTypes = useMemo(() => [...new Set(properties.map(p => p.property_type).filter(Boolean))], [properties]);
    const bedroomOptions = useMemo(() => [...new Set(properties.map(p => p.bedRooms).filter(Boolean))].sort((a, b) => a - b), [properties]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setPropertyTypeFilter('');
        setBedroomsFilter('');
        setSortBy('date_desc');
    };

    const handleViewChange = (newViewMode) => {
        setViewMode(newViewMode);
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            {agent && (
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <img src={agent.avatar} alt={agent.name} className={styles.agentAvatar} />
                        <div className={styles.agentInfo}>
                            <h1 className={styles.agentName}>{agent.name}</h1>
                            {agent.remarks && (
                                <p className={styles.agentRemarks}>{agent.remarks}</p>
                            )}
                            <div className={styles.agentContacts}>
                                <span className={styles.chip}>{agent.email}</span>
                                <span className={styles.chip}>{agent.phone}</span>
                                {agent.brn_number && <span className={styles.chip}>BRN: {agent.brn_number}</span>}
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <main className={styles.main}>
                <div className={styles.contentWrapper}>
                    <h2 className={styles.sectionTitle}>
                        {agent?.name}&apos;s Exclusive Listings ({properties.length})
                    </h2>

                    <div className={styles.filterContainer}>
                        <input
                            type="text"
                            placeholder="Search by title"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                        
                        <select
                            value={propertyTypeFilter}
                            onChange={(e) => setPropertyTypeFilter(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">All Property Types</option>
                            {propertyTypes.map(type => (
                                <option key={type} value={type}>
                                    {type.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>

                        <select
                            value={bedroomsFilter}
                            onChange={(e) => setBedroomsFilter(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">All Bedrooms</option>
                            {bedroomOptions.map(beds => (
                                <option key={beds} value={beds}>
                                    {beds} Bedrooms
                                </option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={styles.select}
                        >
                            <option value="date_desc">Newest First</option>
                            <option value="date_asc">Oldest First</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="price_asc">Price: Low to High</option>
                        </select>

                        <button onClick={handleResetFilters} className={styles.resetButton}>
                            Reset Filters
                        </button>
                    </div>

                    <div className={styles.viewToggle}>
                        <button
                            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                            onClick={() => handleViewChange('list')}
                        >
                            List
                        </button>
                        <button
                            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                            onClick={() => handleViewChange('grid')}
                        >
                            Grid
                        </button>
                        <button
                            className={`${styles.viewButton} ${viewMode === 'map' ? styles.active : ''}`}
                            onClick={() => handleViewChange('map')}
                        >
                            Map
                        </button>
                    </div>

                    {viewMode === 'map' ? (
                        <GoogleMapView properties={filteredAndSortedProperties} />
                    ) : (
                        <div className={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
                            {filteredAndSortedProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} viewMode={viewMode} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            
            {companyData && <CompanyFooter companyData={companyData} />}
        </div>
    );
};

export default Portfolio; 