import styles from "./DeveloperGrid.module.css";
import useInfiniteDevelopers from "./useInfiniteDevelopers";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";

function DeveloperGrid({ containerRef }) {
    const { 
        isLoading, 
        developers, 
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage 
    } = useInfiniteDevelopers();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

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
            path = `/new-projects/list?status=POOL&page=1&developer_id=${devId}`;
        }
        if(path) navigate(path);
    }

    if (isLoading && developers.length === 0) return <Spinner type="fullPage" />;
    if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>Error loading developers.</p>;

    return (
        <div style={{ position: 'relative' }}>
            <div className={styles.developerGrid}>
                {developers?.map((item) => {
                    const totalCount = (item?.property_counts?.sell || 0) + 
                                       (item?.property_counts?.rent || 0) + 
                                       (item?.property_counts?.project ?? 0) +
                                       (item?.property_counts?.pool_project ?? 0);
                    const isActive = totalCount > 0;

                    return (
                        <motion.div 
                            className={styles.developerItem} 
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => navigate(`/developers/${item.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={styles.developerLogoContainer}>
                                <img src={item.logoUrl || '/placeholder-logo.png'} alt={item.name} />
                                <div 
                                    className={`${styles.statusIndicator} ${isActive ? styles.active : styles.inactive}`}
                                    title={isActive ? 'Has Listings' : 'No Listings'}
                                />
                            </div>
                            
                            <button 
                                className={styles.uploadButton}
                                onClick={e => { e.stopPropagation(); navigate(`/developers/${item.id}/documents`); }}
                                title="Upload Documents"
                            >
                                <FaUpload />
                            </button>

                            <div className={styles.developerContent}>
                                <span className={styles.developerName}>{item.name}</span>
                                <span className={styles.agentName}>Agent: {item?.agent_name || "N/A"}</span>

                                <div className={styles.propertyCounts}>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleNavigateToListings(item.id, 'sell'); }}
                                        title={`View Sell listings for ${item.name}`}
                                    >
                                         <span>{item.property_counts?.sell || 0}</span>
                                         Sell
                                    </button>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleNavigateToListings(item.id, 'rent'); }}
                                        title={`View Rent listings for ${item.name}`}
                                    >
                                        <span>{item.property_counts?.rent || 0}</span>
                                        Rent
                                    </button>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleNavigateToListings(item.id, 'project'); }}
                                        title={`View Projects by ${item.name}`}
                                    >
                                         <span>{item.property_counts?.project ?? 0}</span>
                                         Project
                                    </button>
                                    <button
                                        onClick={e => { e.stopPropagation(); handleNavigateToListings(item.id, 'pool_project'); }}
                                        title={`View Pool Projects by ${item.name}`}
                                    >
                                         <span>{item.property_counts?.pool_project ?? 0}</span>
                                         Pool Project
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
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
        </div>
    );
}

export default DeveloperGrid;
