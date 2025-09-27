import SectionTop from "./SectionTop";
import { useJsApiLoader } from "@react-google-maps/api";
import BootstrapTabs from "./BootstrapTabs";
import TabBar from "./TabBar";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from "react-router-dom";
import { getGoogleMapsApiKey } from "../config/googleMaps";

const MAP_VIEW_TAB = {
    id: "MAP_VIEW",
    label: "Map View",
    bgColor: "#f0f9ff", // Light sky blue
    fontColor: "#0369a1", // Dark blue
    path: "/admin/map"
};

const MapPage = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: getGoogleMapsApiKey(),
        libraries: ['places', 'geometry'],
        language: 'en',
        region: 'AE'
    });

    const navigate = useNavigate();
    const { id } = useParams();

    const handleTabClick = (tabId) => {
        if (tabId === "MAP_VIEW") {
            if (!id) {
                const newId = uuidv4();
                navigate(`/admin/map/${newId}`);
            }
        }
    };

    if (loadError) {
        console.error('Google Maps Load Error:', loadError);
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#dc2626' }}>
                <h3>Map Loading Error</h3>
                <p>Unable to load Google Maps. Please check your internet connection.</p>
                <p>Error: {loadError.message}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    style={{ 
                        padding: '10px 20px', 
                        background: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ 
                    display: 'inline-block',
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f4f6',
                    borderTop: '4px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '10px'
                }}></div>
                <p>Loading Google Maps...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop heading="MapView">
                <TabBar
                    tabs={[MAP_VIEW_TAB]}
                    activeTab={"MAP_VIEW"}
                    onTabClick={handleTabClick}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: MAP_VIEW_TAB.bgColor }}>
                <BootstrapTabs />
                {/* <PlotMap addresses={address} /> */}
            </section>
        </div>
    );
};

export default MapPage;
