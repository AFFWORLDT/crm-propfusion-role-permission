import { useEffect, useState } from "react";
import styles from "../../styles/Listings.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import {
    bedroomString,
    formatNum,
    getDaysFromCurrentDate,
} from "../../utils/utils";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Share2, Edit, Trash2, Download, Building, Home, Tag, DollarSign, Calendar, User, Mail, Phone } from "lucide-react";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import useDeleteProperty from "./useDeleteProperty";

function RentPropertyInteractive({ 
    isLoading, 
    data, 
    error,
    isFetchingNextPage 
}) {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const propertyStatus = searchParams.get("status");
    const { removeProperty, isPending: isDeletingProperty } = useDeleteProperty();
    const [hoveredProperty, setHoveredProperty] = useState(null);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    function handleNavigate(id) {
        navigate(`/for-rent/new-list/${id}`);
    }

    function handleShare(property) {
        window.open(
            `/share-new-property/rent/${property.id}?userId=${currentUser?.id}`,
            "_blank",
            "noopener,noreferrer"
        );
    }

    function handleEdit(property) {
        navigate(`/for-rent/edit/${property.id}`);
    }

    function handleDelete(propertyId) {
        removeProperty(propertyId, {
            onSettled: () => navigate(-1),
        });
    }

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            {isLoading ? (
                <div>
                    <Spinner type="fullPage" />
                </div>
            ) : data.length === 0 ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "3rem",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        boxShadow:
                            "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                        width: "100%",
                        minHeight: "400px",
                        textAlign: "center",
                        border: "2px dashed #e5e7eb",
                        marginTop: "2rem",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#f3f4f6",
                            padding: "2rem",
                            borderRadius: "50%",
                            marginBottom: "2rem",
                        }}
                    >
                        <Building size={100} color="#6b7280" />
                    </div>
                    <h2
                        style={{
                            color: "#374151",
                            fontSize: "1.875rem",
                            fontWeight: "700",
                            letterSpacing: "-0.025em",
                            marginBottom: "1rem",
                        }}
                    >
                        No Rental Properties Found
                    </h2>
                    <p
                        style={{
                            color: "#6b7280",
                            fontSize: "1.4rem",
                            maxWidth: "500px",
                            lineHeight: "1.625",
                            marginBottom: "1.5rem",
                        }}
                    >
                        Try broadening your search by adjusting price range or
                        location
                    </p>
                </div>
            ) : (
                <>
                    <div className={styles.interactiveGrid}>
                        {data.map((item) => (
                            <motion.div
                                key={item.id}
                                className={styles.interactiveCard}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                onHoverStart={() => setHoveredProperty(item.id)}
                                onHoverEnd={() => setHoveredProperty(null)}
                                onClick={() => handleNavigate(item.id)}
                            >
                                <div className={styles.interactiveImage}>
                                    <img src={item?.photos?.[0]} alt={item?.title} />
                                    
                                    {/* Portal Icons */}
                                    {(item.dubizzle === "ENABLE" || 
                                      item.bayut === "ENABLE" || 
                                      item.propertyFinder === "ENABLE" || 
                                      item.propfusionPortal === "ENABLE" || 
                                      item.customPortal === "ENABLE" || 
                                      item.ownPortal === "ENABLE") && (
                                        <div className={styles.portalIcons}>
                                            {item.dubizzle === "ENABLE" && (
                                                <div className={styles.portalIconWrapper} title="Listed on Dubizzle">
                                                    <img 
                                                        src="/icons/dubizzle.png" 
                                                        alt="Dubizzle" 
                                                        className={styles.portalIcon} 
                                                    />
                                                </div>
                                            )}
                                            {item.bayut === "ENABLE" && (
                                                <div className={styles.portalIconWrapper} title="Listed on Bayut">
                                                    <img 
                                                        src="/icons/bayut.png" 
                                                        alt="Bayut" 
                                                        className={styles.portalIcon} 
                                                    />
                                                </div>
                                            )}
                                            {item.propertyFinder === "ENABLE" && (
                                                <div className={styles.portalIconWrapper} title="Listed on Property Finder">
                                                    <img 
                                                        src="/icons/property-finder.png" 
                                                        alt="Property Finder" 
                                                        className={styles.portalIcon} 
                                                    />
                                                </div>
                                            )}
                                            {item.propfusionPortal === "ENABLE" && (
                                                <div className={styles.portalIconWrapper} title="Listed on PropFusion Portal">
                                                    <img 
                                                        src="/icons/PROPFUSION_LOGO.png" 
                                                        alt="PropFusion Portal" 
                                                        className={styles.portalIcon} 
                                                    />
                                                </div>
                                            )}
                                            {item.customPortal === "ENABLE" && (
                                                <div className={styles.portalIconWrapper} title="Listed on Custom Portal">
                                                    <img 
                                                        src="/icons/customePortal.png" 
                                                        alt="Custom Portal" 
                                                        className={styles.portalIcon} 
                                                    />
                                                </div>
                                            )}
                                            {item.ownPortal === "ENABLE" && (
                                                <div className={styles.portalIconWrapper} title="Listed on Own Portal">
                                                    <img 
                                                        src="/icons/ownPortal.png" 
                                                        alt="Own Portal" 
                                                        className={styles.portalIcon} 
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    <span className={styles.status}>
                                        {item.status || "ACTIVE"}
                                    </span>
                                    
                                    {item.furnishingStatus && (
                                        <span 
                                            className={`${styles.furnishingStatus} ${
                                                item.furnishingStatus === 'furnished' 
                                                ? styles.furnished 
                                                : styles.unfurnished
                                            }`}
                                        >
                                            {item.furnishingStatus === 'furnished' 
                                                ? 'Furnished' 
                                                : 'Unfurnished'}
                                        </span>
                                    )}
                                    
                                    <div className={styles.interactiveOverlay}></div>
                                    
                                    {/* Hover Action Buttons */}
                                    <AnimatePresence>
                                        {hoveredProperty === item.id && (
                                            <motion.div 
                                                className={styles.hoverActions}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleNavigate(item.id);
                                                    }}
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShare(item);
                                                    }}
                                                    title="Share"
                                                >
                                                    <Share2 size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(item);
                                                    }}
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <Modal>
                                                    <Modal.Open openWindowName={`delete-${item.id}`}>
                                                        <button
                                                            onClick={(e) => e.stopPropagation()}
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </Modal.Open>
                                                    <Modal.Window name={`delete-${item.id}`}>
                                                        <ConfirmDelete
                                                            resourceName={`Property ${item.title}`}
                                                            onConfirm={() => handleDelete(item.id)}
                                                            isDeleting={isDeletingProperty}
                                                        />
                                                    </Modal.Window>
                                                </Modal>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className={styles.interactiveContent}>
                                    <div className={styles.interactiveHeader}>
                                        <h3 title={item?.title}>{item?.title}</h3>
                                        <div className={styles.interactiveActions}>
                                            <button
                                                className={styles.actionButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNavigate(item.id);
                                                }}
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className={styles.actionButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare(item);
                                                }}
                                                title="Share"
                                            >
                                                <Share2 size={18} />
                                            </button>
                                            <button
                                                className={styles.actionButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(item);
                                                }}
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <Modal>
                                                <Modal.Open openWindowName={`delete-mobile-${item.id}`}>
                                                    <button
                                                        className={styles.actionButton}
                                                        onClick={(e) => e.stopPropagation()}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </Modal.Open>
                                                <Modal.Window name={`delete-mobile-${item.id}`}>
                                                    <ConfirmDelete
                                                        resourceName={`Property ${item.title}`}
                                                        onConfirm={() => handleDelete(item.id)}
                                                        isDeleting={isDeletingProperty}
                                                    />
                                                </Modal.Window>
                                            </Modal>
                                        </div>
                                    </div>
                                    <p className={styles.price}>
                                        {formatNum(item?.price)} AED / {item?.rentFrequency || "year"}
                                    </p>
                                    <div className={styles.interactiveDetails}>
                                        <span>
                                            <Building size={14} style={{marginRight: '5px'}} />
                                            {item?.property_type || "N/A"}
                                        </span>
                                        <span>
                                            <Home size={14} style={{marginRight: '5px'}} />
                                            {item?.area?.name || "N/A"}
                                        </span>
                                        <span>
                                            <Calendar size={14} style={{marginRight: '5px'}} />
                                            {item?.rentFrequency || "Yearly"}
                                        </span>
                                    </div>
                                    <div className={styles.propertySpecs}>
                                        <div className={styles.propertySpecsRow}>
                                            <div className={styles.propertySpecItem}>
                                                <span>Bedrooms</span>
                                                <span>{bedroomString(item.bedRooms)}</span>
                                            </div>
                                            <div className={styles.propertySpecItem}>
                                                <span>Bathrooms</span>
                                                <span>{item.bathrooms || "N/A"}</span>
                                            </div>
                                            <div className={styles.propertySpecItem}>
                                                <span>Size</span>
                                                <span>{item.size} sq.ft</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Agent Information */}
                                    {item.agent && (
                                        <div className={styles.agentInfo}>
                                            <div className={styles.agentHeader}>
                                                <div className={styles.agentAvatar}>
                                                    {item.agent.avatar ? (
                                                        <img src={item.agent.avatar} alt={item.agent.name} />
                                                    ) : (
                                                        <User size={24} />
                                                    )}
                                                </div>
                                                <div className={styles.agentDetails}>
                                                    <h4>{item.agent.name || "N/A"}</h4>
                                                    <div className={styles.agentContact}>
                                                        <span>
                                                            <Mail size={12} style={{ marginRight: "5px" }} />
                                                            {item.agent.email || "N/A"}
                                                        </span>
                                                        <span>
                                                            <Phone size={12} style={{ marginRight: "5px" }} />
                                                            {item.agent.phone || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className={styles.interactiveFooter}>
                                        <span className={styles.date}>
                                            {`${getDaysFromCurrentDate(item?.createTime)} days ago`}
                                        </span>
                                        <button
                                            className={styles.downloadButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(
                                                    `/share-new-property/rent/${item.id}?pdf=1&userId=${currentUser?.id}`,
                                                    "_blank",
                                                    "noopener,noreferrer"
                                                );
                                            }}
                                        >
                                            <Download size={16} />
                                            PDF
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {isFetchingNextPage && (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            padding: '1rem',
                            backgroundColor: 'transparent' 
                        }}>
                            <Spinner />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default RentPropertyInteractive; 