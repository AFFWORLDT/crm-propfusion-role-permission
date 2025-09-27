import styles from "./../../styles/NewPropertyInTable.module.css";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import {
    bedroomString,
    dateToYMD,
    formatNum,
    getDaysFromCurrentDate,
} from "../../utils/utils";
import useCreateProject from "./useCreateProject";
import { useAuth } from "../../context/AuthContext";
import { POOL_TYPES } from "../../utils/constants";

// Tooltip component styles
const tooltipStyles = {
    position: "fixed",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "14px",
    zIndex: 1000,
    pointerEvents: "none",
    maxWidth: "200px",
    whiteSpace: "nowrap",
};

// Icon container styles
const iconContainerStyles = {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    overflow: "hidden",
    cursor: "pointer",
};

// Agent icon component
function AgentIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

// Tooltip component
function Tooltip({ text, position }) {
    if (!position) return null;
    
    return (
        <div
            style={{
                ...tooltipStyles,
                left: position.x + 10,
                top: position.y + 10,
            }}
        >
            {text}
        </div>
    );
}

// ---------------- Context menu styles for "Open in new tab" ----------------
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
};

function NewProjectsInTable({ isLoading, data, error, isFetchingNextPage }) {
    const navigate = useNavigate();
    const { addProject } = useCreateProject();
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const projectStatus = searchParams.get("status");
    const [isClaimLoading, setIsClaimLoading] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState(new Set());
    const [tooltip, setTooltip] = useState(null);

    // Context menu state
    const [contextMenu, setContextMenu] = useState(null);

    const handleMouseMove = useCallback((e, text) => {
        setTooltip({
            text,
            x: e.pageX,
            y: e.pageY,
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTooltip(null);
    }, []);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    // Close context menu on outside click
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Helper to build URL of a project detail page
    const getProjectUrl = (id) => {
        return projectStatus === "POOL"
            ? `/new-projects/list/${id}?status=POOL`
            : `/new-projects/list/${id}`;
    };

    // Show custom context menu
    const handleContextMenu = (e, id) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, id });
    };

    // Open project in new browser tab
    const handleOpenInNewTab = (id) => {
        window.open(getProjectUrl(id), "_blank");
        setContextMenu(null);
    };

    // Open project in a separate browser window
    const handleOpenInNewWindow = (id) => {
        window.open(
            getProjectUrl(id),
            "_blank",
            "noopener,noreferrer,width=1200,height=800"
        );
        setContextMenu(null);
    };

    async function handleClaim(projectData, isMultiple = false) {
        try {
            setIsClaimLoading(true);
            if (isMultiple) {
                // Handle multiple projects
                const promises = Array.from(selectedProjects).map(
                    (projectId) => {
                        const project = data.find((p) => p.id === projectId);
                        if (!project) return null;
                        return addProject(
                            {
                                newProject: {
                                    ...project,
                                    projectStatus: "ACTIVE",
                                    agent_Id: currentUser.id,
                                },
                            },
                            {
                                onSuccess: () => {
                                    toast.success(
                                        "Selected projects claimed successfully"
                                    );
                                },
                            }
                        );
                    }
                );

                await Promise.all(promises);
                setSelectedProjects(new Set());
            } else {
                projectData.projectStatus = "ACTIVE";
                addProject(
                    {
                        newProject: {
                            ...projectData,
                            agent_Id: currentUser.id,
                        },
                    },
                    {
                        onSuccess: () => {
                            if (projectStatus === "POOL") {
                                navigate(
                                    `/new-projects/list/${projectData.id}`
                                );
                                toast.success("Project claimed successfully");
                            }
                        },
                        onError: (err) => {
                            toast.error(err.message);
                        },
                    }
                );
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsClaimLoading(false);
        }
    }

    function handleNavigate(id) {
        projectStatus === "POOL"
            ? navigate(`/new-projects/list/${id}?status=POOL`)
            : navigate(`/new-projects/list/${id}`);
    }

    function handleSelectAll(e) {
        if (e.target.checked) {
            setSelectedProjects(new Set(data.map((item) => item.id)));
        } else {
            setSelectedProjects(new Set());
        }
    }

    function handleSelectProject(projectId) {
        setSelectedProjects((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(projectId)) {
                newSet.delete(projectId);
            } else {
                newSet.add(projectId);
            }
            return newSet;
        });
    }

    return (
        <div style={{ position: "relative", height: "100%" }}>
            {/* Render tooltip */}
            <Tooltip text={tooltip?.text} position={tooltip} />
            
            {isLoading ? (
                <div>
                    <Spinner type="fullPage" />
                </div>
            ) : (
                <>
                    {projectStatus === "POOL" && selectedProjects.size > 0 && (
                        <div
                            style={{
                                padding: "1rem",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "1rem",
                                background: "#f8fafc",
                                borderBottom: "1px solid #e5e7eb",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    color: "#4b5563",
                                    fontSize: "1.5rem",
                                    fontWeight: "500",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "1.5rem",
                                        fontWeight: "600",
                                        color: "#3b82f6",
                                        
                                    }}
                                >
                                    {selectedProjects.size}
                                </span>{" "}
                                Projects selected
                            </span>
                            <button
                                className={`${styles.actionBtn}`}
                                onClick={() => handleClaim(null, true)}
                                disabled={isClaimLoading}
                                style={{
                                    minWidth: "120px",
                                    backgroundColor: "#3b82f6",
                                    border: "none",
                                    padding: "0.6rem 1.2rem",
                                    margin: 0,
                                    color: "#fff",
                                    fontSize: "1.2rem",
                                    fontWeight: "500",
                                    cursor: isClaimLoading
                                        ? "not-allowed"
                                        : "pointer",
                                    opacity: isClaimLoading ? 0.6 : 1,
                                    transition: "all 0.2s ease",
                                    borderRadius: "6px",
                                }}
                            >
                                {isClaimLoading ? (
                                    <Spinner type="inline" />
                                ) : (
                                    "Claim Selected"
                                )}
                            </button>
                        </div>
                    )}
                    <div className={styles.listingsTableContainer}>
                        <div className={styles.tableContainer}>
                            <table className={styles.listingsTable}>
                                <thead>
                                    <tr>
                                        {projectStatus === "POOL" && (
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={
                                                        selectedProjects.size ===
                                                        data.length
                                                    }
                                                />
                                            </th>
                                        )}
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Price</th>
                                        <th>Community</th>
                                        <th>Developer</th>
                                        <th>Handover</th>
                                        <th>Bedrooms</th>
                                        <th>Size</th>
                                        <th>Agent</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item) => {
                                        const poolTypeConfig = POOL_TYPES.find(
                                            (type) => type.value === item.pool_type
                                        );

                                        return (
                                            <tr
                                                key={item.id}
                                                className={styles.listingItem}
                                                onContextMenu={(e) =>
                                                    handleContextMenu(e, item.id)
                                                }
                                            >
                                                {projectStatus === "POOL" && (
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedProjects.has(
                                                                item.id
                                                            )}
                                                            onChange={() =>
                                                                handleSelectProject(
                                                                    item.id
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                )}
                                                <td>
                                                    <div
                                                        className={
                                                            styles.imgContainer
                                                        }
                                                        onClick={() =>
                                                            handleNavigate(item.id)
                                                        }
                                                        style={{
                                                            position: "relative",
                                                        }}
                                                    >
                                                        <img
                                                            src={item?.photos?.[0]}
                                                            alt={item.name}
                                                        />
                                                        {poolTypeConfig && (
                                                            <div
                                                                style={{
                                                                    position:
                                                                        "absolute",
                                                                    top: "6px",
                                                                    left: "6px",
                                                                    background:
                                                                        "rgba(255,255,255,0.9)",
                                                                    borderRadius:
                                                                        "6px",
                                                                    width: "18px",
                                                                    height: "18px",
                                                                    display: "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    fontSize:
                                                                        "12px",
                                                                    boxShadow:
                                                                        "0 1px 2px rgba(0,0,0,0.1)",
                                                                    zIndex: 5,
                                                                }}
                                                                title={
                                                                    poolTypeConfig.label
                                                                }
                                                            >
                                                                <span>
                                                                    {
                                                                        poolTypeConfig.icon
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <h3
                                                        onClick={() =>
                                                            handleNavigate(item.id)
                                                        }
                                                    >
                                                        {item.name}
                                                    </h3>
                                                    <span>{`${getDaysFromCurrentDate(item.createTime)} days ago`}</span>
                                                </td>
                                                <td>
                                                    <span
                                                        className={
                                                            styles.listingType
                                                        }
                                                    >
                                                        {item?.propertyTypes?.join(
                                                            " "
                                                        )}
                                                    </span>
                                                </td>
                                                <td>
                                                    <p
                                                        className={styles.price}
                                                        onClick={() =>
                                                            handleNavigate(item.id)
                                                        }
                                                    >
                                                        <span>
                                                            {formatNum(
                                                                item.newParam?.price
                                                            )}
                                                        </span>
                                                        <span>AED Starting</span>
                                                    </p>
                                                </td>
                                                <td>
                                                    <span>
                                                        {item?.location?.community || "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div
                                                        style={iconContainerStyles}
                                                        onMouseMove={(e) => handleMouseMove(e, item?.developer?.name || "N/A")}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        {item?.developer?.logoUrl ? (
                                                            <img
                                                                src={item?.developer?.logoUrl}
                                                                alt={item?.developer?.name}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "contain"
                                                                }}
                                                            />
                                                        ) : (
                                                            <span style={{ color: "#9ca3af", fontSize: "12px" }}>No Logo</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span>
                                                        {dateToYMD(
                                                            item.newParam
                                                                ?.handoverTime
                                                        ) || "N/A"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span>
                                                        {`${bedroomString(item.newParam?.bedroomMin)} - ${bedroomString(item.newParam?.bedroomMax)}`}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span>
                                                        {`${item?.newParam?.size_min || "N/A"} - ${item?.newParam?.size_max || "N/A"} sq.ft`}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div
                                                        style={iconContainerStyles}
                                                        onMouseMove={(e) => handleMouseMove(e, item?.agent?.name || "N/A")}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        {item?.agent?.avatar ? (
                                                            <img
                                                                src={item.agent.avatar}
                                                                alt={item.agent.name || "Agent"}
                                                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                                                            />
                                                        ) : (
                                                            <AgentIcon />
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    {projectStatus === "POOL" && (
                                                        <button
                                                            className={`${styles.actionBtn} btnNormal`}
                                                            onClick={() =>
                                                                handleClaim(item)
                                                            }
                                                            disabled={
                                                                isClaimLoading
                                                            }
                                                        >
                                                            {isClaimLoading ? (
                                                                <Spinner type="inline" />
                                                            ) : (
                                                                "Claim"
                                                            )}
                                                        </button>
                                                    )}
                                                    <button
                                                        className={`${styles.actionBtn} btnNormal`}
                                                        onClick={() =>
                                                            handleNavigate(item.id)
                                                        }
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
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
                    <div
                        style={menuItemStyles}
                        onClick={() => handleOpenInNewWindow(contextMenu.id)}
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
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <path d="M15 3h6v6" />
                            <path d="M10 14L21 3" />
                        </svg>
                        Open in new window
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewProjectsInTable;
