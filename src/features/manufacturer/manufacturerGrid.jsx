import styles from "./ManufacturerGrid.module.css";
import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import useInfiniteManufacturers from "./useInfiniteManufacturers";

function ManufacturerGrid({ containerRef }) {
    const { 
        isLoading, 
        manufacturers, 
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage 
    } = useInfiniteManufacturers();

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

    const renderManufacturerImage = (manufacturer) => {
        if (!manufacturer.logoUrl) {
            return (
                <div className={styles.fallbackImage}>
                    {manufacturer.name.charAt(0).toUpperCase()}
                </div>
            );
        }
        return (
            <img
                src={manufacturer.logoUrl}
                alt={manufacturer.name}
            />
        );
    };

    if (isLoading && manufacturers.length === 0) return <Spinner type="fullPage" />;
    if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>Error loading manufacturers.</p>;

    return (
        <div style={{ position: 'relative' }}>
            <div className={styles.areaGrid}>
                {manufacturers.map((manufacturer) => (
                    <div
                        className={styles.areaItem}
                        key={manufacturer.id}
                    >
                        <div className={styles.areaImageContainer}>
                            {renderManufacturerImage(manufacturer)}
                        </div>
                       
                        <div className={styles.areaContent}> 
                            <span className={styles.areaName}>{manufacturer.name}</span>
                            <span className={styles.agentName}>Country: {manufacturer.country || "Unknown"}</span>
                        </div>
                    </div>
                ))}
            </div>
            {isFetchingNextPage && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: 'transparent' }}>
                    <Spinner />
                </div>
            )}
            {!hasNextPage && manufacturers.length > 0 && (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#777' }}>No more manufacturers to load.</p>
            )}
            {manufacturers.length === 0 && !isLoading && (
                <p style={{ textAlign: 'center', padding: '3rem', color: '#777' }}>No manufacturers found.</p>
            )}
        </div>
    );
}

export default ManufacturerGrid;
