import styles from "./AreaGrid.module.css";
import { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import useInfiniteAreas from "./useInfiniteAreas";
import { useNavigate } from "react-router-dom";

function AreaGrid({ containerRef }) {
    const {
        isLoading,
        areas,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteAreas();
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

    function handleNavigateToListings(areaId, type) {
        let path = "";
        if (type === "sell") {
            path = `/for-sell/new-list?community=${areaId}`;
        } else if (type === "rent") {
            path = `/for-rent/new-list?community=${areaId}`;
        } else if (type === "project") {
            path = `/new-projects/list?community=${areaId}`;
        } else if (type === "pool_projects") {
            path = `/new-projects/list?status=POOL&community=${areaId}`;
        }
        if (path) navigate(path);
    }

    function handleAreaClick(area) {
        navigate(
            `/sub-communities?city=${encodeURIComponent(area.city)}&community=${encodeURIComponent(area.name)}`
        );
    }

    if (isLoading && areas.length === 0) return <Spinner type="fullPage" />;
    if (error)
        return (
            <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>
                Error loading areas.
            </p>
        );

    return (
        <div style={{ position: "relative" }}>
            <div className={styles.areaGrid}>
                {areas.map((item) => {
                    const totalCount =
                        (item.property_counts?.sell || 0) +
                        (item.property_counts?.rent || 0) +
                        (item.property_counts?.project ?? 0);
                    const isActive = totalCount > 0;

                    return (
                        <div
                            className={styles.areaItem}
                            key={item.id}
                            onClick={() => handleAreaClick(item)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className={styles.areaImageContainer}>
                                <img
                                    src={item.imgUrl || "/placeholder-area.jpg"}
                                    alt={item.name}
                                />
                                <div
                                    className={`${styles.statusIndicator} ${isActive ? styles.active : styles.inactive}`}
                                    title={
                                        isActive
                                            ? "Has Listings"
                                            : "No Listings"
                                    }
                                />
                            </div>

                            <div className={styles.areaContent}>
                                <span className={styles.areaName}>
                                    {item?.name}
                                </span>
                                <span className={styles.agentName}>
                                    Agent: {item?.agent_name || "N/A"}
                                </span>

                                <div className={styles.propertyCounts}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNavigateToListings(
                                                item.id,
                                                "sell"
                                            );
                                        }}
                                        title={`View Sell listings in ${item.name}`}
                                    >
                                        <span>
                                            {item.property_counts?.sell || 0}
                                        </span>
                                        Sell
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNavigateToListings(
                                                item.id,
                                                "rent"
                                            );
                                        }}
                                        title={`View Rent listings in ${item.name}`}
                                    >
                                        <span>
                                            {item.property_counts?.rent || 0}
                                        </span>
                                        Rent
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNavigateToListings(
                                                item.id,
                                                "project"
                                            );
                                        }}
                                        title={`View Projects in ${item.name}`}
                                    >
                                        <span>
                                            {item?.property_counts?.project ??
                                                0}
                                        </span>
                                        Project
                                    </button>
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        style={{ cursor: "default" }}
                                        title={`Pool Projects in ${item.name}`}
                                        onClick={
                                            (e) => {
                                                e.stopPropagation();
                                                handleNavigateToListings(
                                                    item.id,
                                                    "pool_projects"
                                                );
                                            }
                                        }

                                    >
                                        <span>
                                            {item?.property_counts?.pool_projects_count || 0}
                                        </span>
                                        Pool Projects
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {isFetchingNextPage && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "2rem",
                        backgroundColor: "transparent",
                    }}
                >
                    <Spinner />
                </div>
            )}
            {!hasNextPage && areas.length > 0 && (
                <p
                    style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#777",
                    }}
                >
                    No more areas to load.
                </p>
            )}
            {areas.length === 0 && !isLoading && (
                <p
                    style={{
                        textAlign: "center",
                        padding: "3rem",
                        color: "#777",
                    }}
                >
                    No areas found matching your criteria.
                </p>
            )}
        </div>
    );
}

export default AreaGrid;
