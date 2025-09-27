/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import styles from "../../../styles/RequestCard.module.css";
import { useUpdatePortalRequest } from "./useUpdatePortalRequest";
import Spinner from "../../../ui/Spinner";
import { useNavigate } from "react-router-dom";
import useNewProperty from "../../properties/useNewProperty";

const RequestCard = ({ data: requests, isPending: loading, error, isFetchingNextPage, totalSize, onLoadMore, hasNextPage }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const scrollRemaining = scrollHeight - scrollTop - clientHeight;

            if (scrollRemaining < 200 && hasNextPage && !isFetchingNextPage) {
                console.log('Fetching next page...'); // Debug log
                onLoadMore();
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [hasNextPage, isFetchingNextPage, onLoadMore]);

    if (loading) return <div><Spinner type="fullPage" /></div>

    return (
        <div 
            ref={containerRef}
            style={{
                height: "calc(100vh - 200px)", // Adjust based on your header and filter heights
                overflowY: "auto",
                position: "relative",
                padding: "20px"
            }}
        >
            <div className={styles.container}>
                {requests.map((request, i) => (
                    <div key={request?.propertyId || i} className={styles.card} style={{
                        border: `${request?.status === "approved" ? " #bafac1" : request?.status === "disapproved" ? " #ffb5b5e8" : " #eabb04"} 1px solid`
                    }}>
                        {/* Property Image */}
                        <div className={styles.cardContent}>
                            <div style={{
                                flex: 1
                            }}>
                                <PropertyCard id={request?.property_id} agent={request?.agent} time={request?.timestamp} status={request?.status} />
                            </div>

                            <div className={styles.footer}>
                                <div className={styles.images}>
                                    {request.requested_field.propertyFinder === "ENABLE" && (
                                        <ImageComponent portal="property-finder.png" />
                                    )}
                                    {request.requested_field.dubizzle === "ENABLE" && (
                                        <ImageComponent portal="dubizzle.png" />
                                    )}
                                    {request.requested_field.bayut === "ENABLE" && (
                                        <ImageComponent portal="bayut.png" />
                                    )}
                                    {request.requested_field.customPortal === "ENABLE" && (
                                        <ImageComponent portal="customePortal.png" />
                                    )}
                                    {request.requested_field.ownPortal === "ENABLE" && (
                                        <ImageComponent portal="ownPortal.png" />
                                    )}
                                    {request.requested_field.propfusionPortal === "ENABLE" && (
                                        <ImageComponent portal="PROPFUSION_LOGO.png" />
                                    )}
                                </div>

                                <div>
                                    <ToggleButton currentStatus={request.status} id={request.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Bottom loader and no more data message */}
            <div style={{ 
                textAlign: 'center', 
                padding: '20px',
                color: '#666'
            }}>
                {isFetchingNextPage ? (
                    <Spinner />
                ) : requests.length >= totalSize ? (
                    <p>No more requests to load</p>
                ) : null}
            </div>
        </div>
    );
};
const ImageComponent = ({ portal }) => (
    <div className={styles.imageContainer}>
        <img
            src={`/icons/${portal}`} // Ensure your image filenames match this format
            alt={portal}
            className={styles.portalImage}
        />
    </div>
);
const ToggleButton = ({ currentStatus, id }) => {
    const [status, setStatus] = useState(currentStatus);

    const { updateRequest } = useUpdatePortalRequest();

    const handleToggle = (newStatus) => {
        setStatus(newStatus);
        updateRequest({ id, action: newStatus });
    };

    return (
        <div className={styles.toggleButtonsContainer}>
            {/* Show "Approve" and "Reject" buttons when the status is "pending" */}
            {status === "pending" && (
                <>
                    <button
                        className={`${styles.toggleButton} ${styles.approved}`}
                        onClick={() => handleToggle("approve")}
                    >
                        Approve
                    </button>
                    <button
                        className={`${styles.toggleButton} ${styles.disapproved}`}
                        onClick={() => handleToggle("disapprove")}
                    >
                        Reject
                    </button>
                </>
            )}

            {/* Show only the "Reject" button when the status is "approved" */}
            {status === "approve" && (
                <div className={styles.toggleButtonsContainer}>
                    <button
                        className={`${styles.toggleButton} ${styles.disapproved}`}
                        onClick={() => handleToggle("disapprove")}
                    >
                        Reject
                    </button>
                    <button
                        className={`${styles.toggleButton} ${styles.pending}`}
                        onClick={() => handleToggle("pending")}
                    >
                        Mark as Pending
                    </button>
                </div>
            )}

            {/* Show only the "Approve" button when the status is "disapproved" */}
            {status === "disapprove" && (
                <div className={styles.toggleButtonsContainer}>
                    <button
                        className={`${styles.toggleButton} ${styles.approved}`}
                        onClick={() => handleToggle("approve")}
                    >
                        Approve
                    </button>
                    <button
                        className={`${styles.toggleButton} ${styles.pending}`}
                        onClick={() => handleToggle("pending")}
                    >
                        Mark as Pending
                    </button>
                </div>
            )}
        </div>
    );
};


const PropertyCard = ({ id, agent, time, status }) => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useNewProperty(id);

    if (isLoading) {
        return <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}><Spinner /></div>
    }

    if (error) {
        return <div className={styles.propertyCard__error}>Error loading property</div>;
    }

    const property = Array.isArray(data) && data?.length > 0
        ? data[0]
        : null;
    if (!property) return;
    const agents = [
        { label: "Own Portal Agent", agent: property?.ownPortal_agent },
        { label: "Property Finder Agent", agent: property?.propertyFinder_agent },
        { label: "Propfusion Portal Agent", agent: property?.propfusionPortal_agent },
        { label: "Bayut Dubizzle Agent", agent: property?.bayut_dubizzle_agent },
    ];

    return (
        <div className={styles.propertyCard} style={{

            borderRadius: 10
        }}>
            <img
                src={property?.photos && property.photos.length > 0
                    ? property.photos[0]
                    : "/images/property-placeholder.png"}
                alt="Property"
                className={styles.propertyCard__image}
            />
            <div className={styles.cardContent}>
                <div className={styles.propertyCard__details}>
                    <div>
                        <div className={styles?.propertyCard__title}><img src={agent?.avatar} alt={agent?.name} style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            marginRight: 8,
                        }} /> <span>{agent?.name} | </span> <span style={{ color: status === "approve" ? "green" : status === "disapproved" ? "#ff7c72" : "orange" }}>{status === "approve" ? "APPROVED" : status.toUpperCase() ?? "N/A"}</span></div>
                        <div className={styles.propertyCard__info}>
                            <div style={{ cursor: "pointer", color: "#000", textDecoration: "underline" }} className={styles.propertyCard__field} onClick={() => navigate(`/for-${property?.listingType}/new-list/${property?.id}`)}>Name: {property?.title ?? "N/A"}</div>
                            <div className={styles.propertyCard__field}>Price: {property?.price ?? "N/A"}</div>
                            <div className={styles.propertyCard__field}>Size: {property?.size}</div>
                            <div className={styles.propertyCard__field}>Listing Type: {property?.listingType ?? "N/A"}</div>
                            <div className={styles.propertyCard__field}>Community: {property?.community ?? "N/A"}</div>
                            <div className={styles.propertyCard__field}>Property Type: {property?.property_type ?? "N/A"}</div>
                            <div className={styles.propertyCard__field}>Plot Size: {property?.plotSize ?? "N/A"}</div>
                            <div className={styles.propertyCard__field}>Time : <span> {time ? new Date(time).toLocaleString() : "N/A"}</span></div>
                        </div>
                    </div>

                    <div>
                        <div className={styles.propertyCard__title} style={{ marginTop: "20px" }}>
                            Agents Information
                        </div>
                        <div className={styles.agentsContainer}>
                            {agents.map(({ label, agent }, index) =>
                                agent ? (
                                    <div key={index} className={styles.agentCard}>
                                        {/* Agent Avatar */}
                                        <img
                                            src={agent.avatar}
                                            alt={`${label} Avatar`}
                                            className={styles.agentCard__avatar}
                                        />
                                        {/* Agent Details */}
                                        <div className={styles.agentDetails}>
                                            <div className={styles.agentDetails__label}>{label}</div>
                                            <div className={styles.agentDetails__info}>
                                                Name: {agent.name ?? "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={index} className={styles.propertyCard__field}>
                                        <strong>{label}</strong>: No agent information available
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default RequestCard;
