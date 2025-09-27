import { useEffect, useState, useCallback } from "react";
import styles from "../../styles/Listings.module.css"; // Reusing styles, might need specific ones later
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import { motion } from "framer-motion";
import { Eye, MapPin } from "lucide-react"; // Using appropriate icons
import useInfiniteAreas from "./useInfiniteAreas"; // Hook to fetch areas

function AreaInteractive({ containerRef }) {
    const { 
        isLoading, 
        areas, 
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage 
    } = useInfiniteAreas();
    
    const navigate = useNavigate();
    const [hoveredArea, setHoveredArea] = useState(null);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

     // Infinite scroll logic (same as AreaGrid)
     const handleScroll = useCallback(() => {
        if (!containerRef?.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        
        // Trigger fetch when user is near the bottom (e.g., 80% scrolled)
        if (
            scrollHeight - (scrollTop + clientHeight) < scrollHeight * 0.2 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, isFetchingNextPage, containerRef]);

    useEffect(() => {
        const container = containerRef?.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);
        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll, containerRef]);


    function handleNavigateToAreaProperties(areaId, type) {
        if (type === 'sell') {
            navigate(`/for-sell/new-list?community=${areaId}`);
        } else if (type === 'rent') {
            navigate(`/for-rent/new-list?community=${areaId}`);
        } else if (type === 'project') {
            navigate(`/new-projects/list?community=${areaId}`);
        } else if (type === 'pool_projects') {
            navigate(`/new-projects/list?status=POOL&community=${areaId}`);
        } else {
            // Maybe navigate to a general area detail page if one exists
             console.warn("Navigation type not specified for area card");
        }
    }

    return (
        <div style={{ position: 'relative', minHeight: '300px' }}> {/* Added minHeight */}
            {isLoading && areas.length === 0 ? ( // Show spinner only on initial load
                <div style={{ paddingTop: '5rem' }}> {/* Add padding to center spinner */}
                    <Spinner type="fullPage" />
                </div>
            ) : error ? (
                 <p style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>Error loading areas.</p>
            ) : (
                <>
                    <div className={styles.interactiveGrid}> {/* Using same grid style */}
                        {areas.map((item) => (
                            <motion.div
                                key={item.id}
                                className={styles.interactiveCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                onHoverStart={() => setHoveredArea(item.id)}
                                onHoverEnd={() => setHoveredArea(null)}
                            >
                                <div className={styles.interactiveImage}>
                                    <img 
                                        src={item?.imgUrl || '/placeholder-area.jpg'} // Add a placeholder image
                                        alt={item?.name} 
                                    />
                                     {/* Add overlay if needed, e.g., for status */}
                                    {/* <div className={styles.interactiveOverlay}>
                                         Optional: Add status or other info here
                                    </div> */}
                                </div>
                                <div className={styles.interactiveContent}>
                                    <div className={styles.interactiveHeader}>
                                        <h3>{item?.name}</h3>
                                         {/* Add Action buttons if needed */}
                                        <div className={styles.interactiveActions}>
                                           {/* Example: View details button */}
                                           {/* <button 
                                                className={styles.actionButton} 
                                                title="View Area Details" 
                                                onClick={(e) => { e.stopPropagation(); console.log('View details for', item.id); }}>
                                                <Eye size={18} />
                                            </button> */}
                                        </div>
                                    </div>
                                    
                                     {/* Agent Info */}
                                     <p className={styles.agentInfo} style={{fontSize: '0.9rem', color: '#555', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                                         <MapPin size={14}/> 
                                         Agent: {item?.agent_name || "N/A"}
                                     </p>

                                     {/* Property Counts */}
                                    <div className={styles.propertyCounts} style={{ display: 'flex', justifyContent: 'space-around', gap: '0.5rem', padding: '0.75rem 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', margin: '1rem 0' }}>
                                        <button 
                                            className={styles.countButton} 
                                            onClick={() => handleNavigateToAreaProperties(item.id, 'sell')}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: '#333', fontSize: '0.8rem' }}
                                            title={`View Sell listings in ${item.name}`}
                                            >
                                            <span style={{ display: 'block', fontWeight: '600', fontSize: '1rem', color: '#2563eb' }}>{item.property_counts?.sell || 0}</span>
                                            Sell
                                        </button>
                                         <button 
                                            className={styles.countButton} 
                                            onClick={() => handleNavigateToAreaProperties(item.id, 'rent')}
                                             style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: '#333', fontSize: '0.8rem' }}
                                             title={`View Rent listings in ${item.name}`}
                                            >
                                            <span style={{ display: 'block', fontWeight: '600', fontSize: '1rem', color: '#2563eb' }}>{item.property_counts?.rent || 0}</span>
                                             Rent
                                        </button>
                                         <button 
                                            className={styles.countButton} 
                                            onClick={() => handleNavigateToAreaProperties(item.id, 'project')}
                                             style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: '#333', fontSize: '0.8rem' }}
                                             title={`View Projects in ${item.name}`}
                                            >
                                            <span style={{ display: 'block', fontWeight: '600', fontSize: '1rem', color: '#2563eb' }}>{item.property_counts?.project ?? 0}</span>
                                             Project
                                        </button>
                                        <button 
                                            className={styles.countButton} 
                                            onClick={() => handleNavigateToAreaProperties(item.id, 'pool_projects')}
                                             style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: '#333', fontSize: '0.8rem' }}
                                             title={`View Pool Projects in ${item.name}`}
                                            >
                                            <span style={{ display: 'block', fontWeight: '600', fontSize: '1rem', color: '#2563eb' }}>{item.property_counts?.pool_projects_count ?? 0}</span>
                                            Pool Projects
                                        </button>
                                    </div>
                                    
                                    {/* Optional Footer */}
                                    {/* <div className={styles.interactiveFooter}>
                                        Add date or other info if available
                                    </div> */}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {isFetchingNextPage && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: 'transparent' }}>
                            <Spinner />
                        </div>
                    )}
                     {!hasNextPage && areas.length > 0 && (
                         <p style={{ textAlign: 'center', padding: '2rem', color: '#777' }}>No more areas to load.</p>
                     )}
                     {areas.length === 0 && !isLoading && (
                         <p style={{ textAlign: 'center', padding: '3rem', color: '#777' }}>No areas found matching your criteria.</p>
                     )}
                </>
            )}
        </div>
    );
}

export default AreaInteractive; 