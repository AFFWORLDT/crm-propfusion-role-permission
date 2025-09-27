import styles from "../../styles/NewListType.module.css";
import { useEffect, useState } from "react";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import {
    bedroomString,
    formatNum,
    getDaysFromCurrentDate,
} from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import NewPropertyItemTag from "./NewPropertyItemTag";
import { useSelectedProperties } from "../../context/SelectedPropertiesContext";
import { Ruler, Bed, Bath, Layers } from "lucide-react";
import useAllDetails from "../all-details/useAllDetails";
import QualityScoreModal from "./QualityScoreModal";
import { Star as StarIcon } from "@mui/icons-material";
import PropertyQualityScore from "./PropertyQualityScore";

const contextMenuStyles = {
    position: "fixed",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "8px 0",
    zIndex: 1000,
    minWidth: "200px",
};


const menuItemStyles = {
    padding: "8px 16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#333",
    ":hover": {
        backgroundColor: "#f5f5f5",
    },
};

// Add table column width styles
const tableColumnWidths = {
    imageColumn: "180px",
    detailsColumn: "250px",
    priceColumn: "150px",
    locationColumn: "200px",
    featuresColumn: "180px",
    contactColumn: "80px",
    actionsColumn: "100px",
};

const ListingTypeBadge = ({ type }) => {
    const badgeStyles = {
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: "600",
        textTransform: "uppercase",
        display: "inline-flex",
        alignItems: "center",
        marginRight: "8px",
        ...getListingTypeStyles(type)
    };
    return <span style={badgeStyles}>{type}</span>;
};

const getListingTypeStyles = (type) => {
    switch (type?.toUpperCase()) {
        case "RENT":
            return {
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
                border: "1px solid #bbdefb"
            };
        case "SALE":
            return {
                backgroundColor: "#f3e5f5",
                color: "#7b1fa2",
                border: "1px solid #e1bee7"
            };
        default:
            return {
                backgroundColor: "#f5f5f5",
                color: "#616161",
                border: "1px solid #e0e0e0"
            };
    }
};

const getStatusBadgeStyles = (status) => {
    const baseStyles = {
        position: "absolute",
        top: "6px",
        left: "6px",
        padding: "0.08rem 0.32rem",
        fontWeight: "700",
        borderRadius: "2px",
        fontSize: "0.60rem",
        textTransform: "uppercase",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        zIndex: 1,
        letterSpacing: "0.04em",
        lineHeight: "1.1",
    };

    switch (status?.toLowerCase()) {
        case "completed":
        case "completed_primary":
            return {
                ...baseStyles,
                backgroundColor: "#e8f5e9", // Light green
                color: "#2e7d32",
                border: "1px solid #c8e6c9"
            };
        case "off_plan":
        case "off_plan_primary":
            return {
                ...baseStyles,
                backgroundColor: "#ffebee", // Light red
                color: "#c62828",
                border: "1px solid #ffcdd2"
            };
        case "under_construction":
            return {
                ...baseStyles,
                backgroundColor: "#fff3e0", // Light orange
                color: "#ef6c00",
                border: "1px solid #ffe0b2"
            };
        default:
            return {
                ...baseStyles,
                backgroundColor: "#ffffff", // Light gray
                color: "#616161",
                border: "1px solid #eeeeee"
            };
    }
};

const PropertyStatusBadge = ({ status }) => {
    const displayText = status?.toLowerCase().includes("completed")
        ? "Completed"
        : status?.toLowerCase().includes("off_plan")
            ? "Off Plan"
            : status?.toLowerCase().includes("under_construction")
                ? "Under Construction"
                : status || "";

    return <span style={getStatusBadgeStyles(status)}>{displayText}</span>;
};

function NewPropertyInTable({
    listingType,
    isLoading,
    data,
    error,
    totalSize,
    showCheckboxes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

}) {
    const navigate = useNavigate();
    const { selectedIds, toggleSelection } = useSelectedProperties();
    const [loadingStates, setLoadingStates] = useState({});
    const { data: allData } = useAllDetails();
    const [contextMenu, setContextMenu] = useState(null);
    const [qualityScoreModal, setQualityScoreModal] = useState({
        open: false,
        data: null,
        propertyTitle: ""
    });

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const getPropertyUrl = (id,type) => {
        return `/for-${type.toLowerCase()}/new-list/${id}`;
    };

    const handleNavigate = (id,type) => {
        navigate(getPropertyUrl(id,type));
    };

    const handleContextMenu = (e, id) => {
        e.preventDefault();
        setContextMenu({
            x: e.pageX,
            y: e.pageY,
            id: id,
        });
    };

    const handleOpenInNewTab = (id) => {
        window.open(getPropertyUrl(id,listingType), "_blank");
        setContextMenu(null);
    };

    const handleQualityScoreClick = (e, qualityScoreDetails, propertyTitle) => {
        e.stopPropagation();
        setQualityScoreModal({
            open: true,
            data: qualityScoreDetails,
            propertyTitle: propertyTitle
        });
    };

    const handleCloseQualityScoreModal = () => {
        setQualityScoreModal({
            open: false,
            data: null,
            propertyTitle: ""
        });
    };

    return (
        <div style={{ position: "relative", height: "100%" }}>
            {isLoading ? (
                <div
                   
                >
                    <Spinner type="fullPage" />
                </div>
            ) : (
                <>
                    <div className={styles.tableContainer}>
                        <table className={styles.propertyTable}>
                            <thead>
                                <tr>
                                    {showCheckboxes && (
                                        <th
                                            className={styles.checkboxHeader}
                                            style={{ width: "40px" }}
                                        ></th>
                                    )}
                                    <th className={styles.imageHeader} style={{ width: tableColumnWidths.imageColumn }}>
                                        Property
                                    </th>
                                    <th style={{ width: tableColumnWidths.detailsColumn }}>Details</th>
                                    <th style={{ width: tableColumnWidths.priceColumn }}>Price</th>
                                    <th style={{ width: tableColumnWidths.locationColumn }}>Location</th>
                                    <th style={{ width: tableColumnWidths.featuresColumn }}>Features</th>
                                    <th style={{ width: tableColumnWidths.contactColumn }}>Contact</th>
                                    <th style={{ width: tableColumnWidths.actionsColumn }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={styles.tableRow}
                                        onContextMenu={(e) =>
                                            handleContextMenu(e, item.id)
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        {showCheckboxes && (
                                            <td className={styles.checkboxCell}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(
                                                        item?.id
                                                    )}
                                                    onChange={() =>
                                                        toggleSelection(
                                                            item?.id
                                                        )
                                                    }
                                                />
                                            </td>
                                        )}
                                        <td className={styles.imageCell}>
                                            <div
                                                className={
                                                    styles.propertyImageWrapper
                                                }
                                                style={{ position: "relative" }}
                                            >
                                                <PropertyStatusBadge status={item.completionStatus} />
                                                <img
                                                    src={item.photos?.[0]}
                                                    alt={item.title}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        borderRadius: "10px",
                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                                    }}
                                                />
                                                {item.propertyFinder && (
                                                    <img
                                                        src="/icons/property-finder.png"
                                                        className={`${styles.propertyFinderIcon} ${item?.propertyFinder ===
                                                                "REQ_ENABLE"
                                                                ? "image-adjuster-2"
                                                                : ""
                                                            }`}
                                                        alt="Property Finder"
                                                    />
                                                )}
                                                {item?.bayut && (
                                                    <>
                                                        <img
                                                            src="/icons/bayut.png"
                                                            className={`${styles.bayutPortal} ${item?.bayut === "REQ_ENABLE" ? "image-adjuster-2" : ""}`}
                                                        />
                                                    </>
                                                )}
                                                {item?.dubizzle && (
                                                    <>
                                                        <img
                                                            src="/icons/dubizzle.png"
                                                            className={`${styles.dubizzlePortal} ${item?.dubizzle === "REQ_ENABLE" ? "image-adjuster-2" : ""}`}
                                                        />
                                                    </>
                                                )}
                                                {item.propfusionPortal && (
                                                    <img
                                                        src="/icons/PROPFUSION_LOGO.png"
                                                        className={`${styles.propfusionPortal} ${item?.propfusionPortal ===
                                                                "REQ_ENABLE"
                                                                ? "image-adjuster-2"
                                                                : ""
                                                            }`}
                                                        alt="Property Finder"
                                                    />
                                                )}
                                                {item?.customPortal && (
                                                    <>
                                                        <img
                                                            src="/icons/customePortal.png"
                                                            className={`${styles.customPortal} ${item?.customPortal === "REQ_ENABLE" ? "image-adjuster-2" : ""}`}
                                                        />
                                                    </>
                                                )}
                                                {item?.ownPortal && (
                                                    <>
                                                        <img
                                                            src={
                                                                allData
                                                                    ?.company_settings
                                                                    ?.company_logo_url
                                                            }
                                                            className={`${styles.ownPortal} ${item?.ownPortal === "REQ_ENABLE" ? "image-adjuster-2" : ""}`}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className={styles.detailsCell}>
                                            <div className={styles.propertyDetails} style={{ padding: "10px" }}>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: "8px",
                                                    gap: "8px"
                                                }}>
                                                    {/* <ListingTypeBadge type={listingType} /> */}
                                                    <h3 style={{
                                                        fontSize: "14px",
                                                        fontWeight: "600",
                                                        color: "#2c3e50",
                                                        margin: 0
                                                    }}>{item.title}</h3>
                                                </div>
                                                <div className={styles.tags} style={{ marginBottom: "8px" }}>
                                                    <NewPropertyItemTag propertyData={item} />
                                                    <span className={styles.propertyType}>
                                                        {item.property_type}
                                                    </span>
                                                </div>
                                                <span className={styles.listedTime} style={{ fontSize: "12px", color: "#666" }}>
                                                    Listed {getDaysFromCurrentDate(item.createTime)} days ago
                                                </span>
                                            </div>
                                        </td>
                                        <td className={styles.priceCell}>
                                            <div
                                                className={styles.priceWrapper}
                                            >
                                                <span
                                                    className={
                                                        styles.priceAmount
                                                    }
                                                >
                                                    {formatNum(item.price)}
                                                </span>
                                                <span
                                                    className={styles.priceUnit}
                                                >
                                                    AED
                                                    {item?.listingType === "RENT"
                                                        ? `/${item?.priceType || "Year"}`
                                                        : ""}
                                                </span>
                                            </div>
                                        </td>
                                        <td >
                                            <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                                <p className={styles.community}>
                                                    {item.location?.sub_community || "N/A"}
                                                </p>
                                                <p className={styles.community}>
                                                    {item.location?.community || "N/A"}
                                                </p>
                                                {/* <p className={styles.area}>
                                                    {item.location?.city || "N/A"}
                                                </p> */}
                                                <p style={{ fontSize: "12px", color: "black", fontWeight: "600" }}>
                                                    By{" "}
                                                    {item.developer?.name ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className={styles.featuresCell}>
                                            <div className={styles.featuresList} style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: "8px",
                                                padding: "8px"
                                            }}>
                                                <div className={styles.feature} style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    fontSize: "13px"
                                                }}>
                                                    <span className={styles.featureLabel}>
                                                        <Ruler size={14} />
                                                    </span>
                                                    <span>{item.size || "N/A"} sq.ft</span>
                                                </div>
                                                <div className={styles.feature} style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    fontSize: "13px"
                                                }}>
                                                    <span className={styles.featureLabel}>
                                                        <Bed size={14} />
                                                    </span>
                                                    <span>{bedroomString(item.bedRooms)}</span>
                                                </div>
                                                <div className={styles.feature} style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    fontSize: "13px"
                                                }}>
                                                    <span className={styles.featureLabel}>
                                                        <Bath size={14} />
                                                    </span>
                                                    <span>{item?.washRoom || item?.bathrooms || "N/A"}</span>
                                                </div>
                                                <div className={styles.feature} style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    fontSize: "13px"
                                                }}>
                                                    <span className={styles.featureLabel}>
                                                        <Layers size={14} />
                                                    </span>
                                                    <span>{item?.floor || "N/A"}/{item?.totalFloor || "N/A"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.agentCell}>
                                            <div className={styles.agentInfo}>
                                                <span
                                                    className={styles.agentName}
                                                >
                                                    <img
                                                        src={item?.agent?.avatar || "/default-avatar.png"}
                                                        alt="Agent Avatar"
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            borderRadius: "50%",
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                </span>
                                            </div>
                                        </td>
                                        <td className={styles.actionsCell}>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>

                                                <PropertyQualityScore qualityScoreDetails={item?.quality_score} propertyTitle={item.title} propertyId={item.id} />
                                                <button
                                                    className={`${styles.viewButton} ${loadingStates[item.id] ? styles.loading : ""}`}
                                                    onClick={() =>
                                                        handleNavigate(item.id,item?.listingType)
                                                    }
                                                    disabled={
                                                        loadingStates[item.id]
                                                    }
                                                >
                                                    {!loadingStates[item.id] && (
                                                        <>
                                                            View
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                                className={
                                                                    styles.buttonIcon
                                                                }
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {isFetchingNextPage && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "1rem",
                                backgroundColor: "transparent",
                            }}
                        >
                            <Spinner />
                        </div>
                    )}
                </>
            )}
            {contextMenu && (
                <div
                    style={{
                        ...contextMenuStyles,
                        left: contextMenu.x,
                        top: contextMenu.y,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        style={menuItemStyles}
                        onClick={() => handleOpenInNewTab(contextMenu.id)}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Open in new tab
                    </div>
                </div>
            )}

            {/* Quality Score Modal */}
            <QualityScoreModal
                open={qualityScoreModal.open}
                onClose={handleCloseQualityScoreModal}
                qualityScoreDetails={qualityScoreModal.data}
                propertyTitle={qualityScoreModal.propertyTitle}
            />
        </div>
    );
}

export default NewPropertyInTable;
