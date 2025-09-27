import { useEffect, useState, useCallback } from "react";
import styles from "../../styles/Listings.module.css"; // Reusing styles
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import { motion } from "framer-motion";
import { User, Building, Upload } from "lucide-react"; // Relevant icons and added Upload icon
import useInfiniteDevelopers from "./useInfiniteDevelopers"; // Hook for developers

function DeveloperInteractive({ containerRef }) {
    const { 
        isLoading, 
        developers, 
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage 
    } = useInfiniteDevelopers();
    
    const navigate = useNavigate();
    const [hoveredDev, setHoveredDev] = useState(null);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

     // Infinite scroll logic
     const handleScroll = useCallback(() => {
        if (!containerRef?.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
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

    function handleNavigateToListings(devId, type) {
        let path = '';
        if (type === 'sell') {
            path = `/for-sell/new-list?developer_id=${devId}`;
        } else if (type === 'rent') {
            path = `/for-rent/new-list?developer_id=${devId}`;
        } else if (type === 'project') {
            path = `/new-projects/list?developer_id=${devId}`;
        } else if (type === 'pool_project') {
            path = `/new-projects/list?developer_id=${devId}&status=POOL`;
        }
        if(path) navigate(path);
    }

    return (
        <div style={{ position: 'relative', minHeight: '300px' }}>
            {isLoading && developers.length === 0 ? (
                <div style={{ paddingTop: '5rem' }}>
                    <Spinner type="fullPage" />
                </div>
            ) : error ? (
                 <p style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>Error loading developers.</p>
            ) : (
                <>
                    <div className={styles.interactiveGrid}>
                        {developers.map((item) => (
                            <motion.div
                                key={item.id}
                                className={styles.interactiveCard}
                                style={{ position: 'relative' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                onHoverStart={() => setHoveredDev(item.id)}
                                onHoverEnd={() => setHoveredDev(null)}
                            >
                                {/* Documents Upload Button */}
                                <button
                                    onClick={() => navigate(`/developers/${item.id}/documents`)}
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        width: '32px',
                                        height: '32px',
                                        padding: '0.4rem',
                                        backgroundColor: '#f3f4f6',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '0.375rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        zIndex: 1
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    title="Upload Documents"
                                >
                                    <Upload size={16} />
                                </button>
                                <div className={styles.interactiveImage} style={{ height: '150px', backgroundColor: '#eee' }}> {/* Adjust height/style */}
                                    <img 
                                        src={item?.logoUrl || '/placeholder-logo.png'} 
                                        alt={item?.name} 
                                        style={{ objectFit: 'contain', padding: '1rem' }} // Contain logo
                                    />
                                </div>
                                <div className={styles.interactiveContent}>
                                    <div className={styles.interactiveHeader}>
                                        <h3>{item?.name}</h3>
                                         {/* Optional Action buttons */}
                                         {/* <div className={styles.interactiveActions}> ... </div> */}
                                    </div>
                                    
                                     {/* Agent Info */}
                                     <p className={styles.agentInfo} style={{fontSize: '0.9rem', color: '#555', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                                         <User size={14}/> 
                                         Agent: {item?.agent_name || "N/A"}
                                     </p>

                                     {/* Property Counts */}
                                    <div className={styles.propertyCounts} style={{ display: 'flex', justifyContent: 'space-around', gap: '0.5rem', padding: '0.75rem 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', margin: '1rem 0' }}>
                                        <button 
                                            className={styles.countButton} 
                                            onClick={() => handleNavigateToListings(item.id, 'sell')}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: '#333', fontSize: '0.8rem' }}
                                            title={`View Sell listings for ${item.name}`}
                                            >
                                            <span style={{ display: 'block', fontWeight: '600', fontSize: '1rem', color: '#2563eb' }}>{item.property_counts?.sell || 0}</span>
                                            Sell
                                        </button>
                                         <button 
                                            className={styles.countButton} 
                                            onClick={() => handleNavigateToListings(item.id, 'rent')}
                                             style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: '#333', fontSize: '0.8rem' }}
                                             title={`View Rent listings for ${item.name}`}
                                            >
                                            <span style={{ display: 'block', fontWeight: '600', fontSize: '1rem', color: '#2563eb' }}>{item.property_counts?.rent || 0}</span>
                                             Rent
                                        </button>
                                         <button 
                                            className={styles.countButton} 
                                            onClick={() => handleNavigateToListings(item.id, 'project')}
                                             style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: '#333', fontSize: '0.8rem' }}
                                             title={`View Projects by ${item.name}`}
                                            >
                                             <Building size={12} style={{marginBottom: '2px'}}/> {/* Project Icon */}
                                            <span style={{ display: 'block', fontWeight: '600', fontSize: '1rem', color: '#2563eb' }}>{item.property_counts?.project ?? 0}</span>
                                             Project
                                        </button>

                                        <button 
                                            className={styles.countButton} 
                                            onClick={() => handleNavigateToListings(item.id, 'project')}
                                             style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', color: '#333', fontSize: '0.8rem' }}
                                             title={`View Projects by ${item.name}`}
                                            >
                                             <Building size={12} style={{marginBottom: '2px'}}/> {/* Project Icon */}
                                            <span style={{ display: 'block', fontWeight: '600', fontSize: '1rem', color: '#2563eb' }}>{item.property_counts?.pool_project ?? 0}</span>
                                             Pool Project
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {isFetchingNextPage && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: 'transparent' }}>
                            <Spinner />
                        </div>
                    )}
                     {!hasNextPage && developers.length > 0 && (
                         <p style={{ textAlign: 'center', padding: '2rem', color: '#777' }}>No more developers to load.</p>
                     )}
                     {developers.length === 0 && !isLoading && (
                         <p style={{ textAlign: 'center', padding: '3rem', color: '#777' }}>No developers found matching your criteria.</p>
                     )}
                </>
            )}
        </div>
    );
}

export default DeveloperInteractive; 