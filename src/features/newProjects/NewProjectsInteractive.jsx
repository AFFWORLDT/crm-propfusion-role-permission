import { useEffect, useState } from "react";
import styles from "../../styles/Listings.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import {
    bedroomString,
    dateToYMD,
    formatNum,
    getDaysFromCurrentDate,
    formatMonthYear,
} from "../../utils/utils";
import useCreateProject from "./useCreateProject";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Eye, Share2, Edit, Trash2, Download, Calendar, CreditCard, XCircle, Grab } from "lucide-react";
import useDeleteProject from "./useDeleteProject";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { POOL_TYPES } from "../../utils/constants";
import { useQueryClient } from "@tanstack/react-query";

function NewProjectsInteractive({ 
    isLoading, 
    data, 
    error,
    isFetchingNextPage,
    onResetFilters 
}) {
    const navigate = useNavigate();
    const { addProject, isPending } = useCreateProject();
    const { currentUser } = useAuth();
    const [searchParams] = useSearchParams();
    const projectStatus = searchParams.get("status");
    const { removeProject, isPending: isDeletingProject } = useDeleteProject();
    const [hoveredProject, setHoveredProject] = useState(null);
    const [disabledButtons, setDisabledButtons] = useState(new Set());
    const queryClient = useQueryClient();
    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    // function handleNavigate(id) {
    //     navigate(`/new-projects/list/${id}?status=POOL`);
    // }

    function handleClaim(data) {
        if(isPending || isLoading || disabledButtons.has(data.id)) return;
        
        // Temporarily disable this button
        setDisabledButtons(prev => new Set([...prev, data.id]));
        
        // Re-enable after 1.5 seconds
        setTimeout(() => {
            setDisabledButtons(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.id);
                return newSet;
            });
        }, 1500);

        data.projectStatus = "ACTIVE";
        addProject({ newProject: { ...data, agent_Id: currentUser.id }},{
            onSuccess: () => {
                toast.success("Project claimed successfully");
                // queryClient.invalidateQueries({ queryKey: ["projects"] });
            },
            onError: () => {
                toast.error("Failed to claim project");
            }   
        });
    }

    // function handleShare(project) {
    //     window.open(
    //         `/share-project/${project.id}?userId=${currentUser?.id}`,
    //         "_blank",
    //         "noopener,noreferrer"
    //     );
    // }

    // function handleEdit(project) {
    //     navigate(`/new-projects/edit/${project.id}`);
    // }

    // function handleDelete(project) {
    //     removeProject(project.id, {
    //         onSettled: () => navigate(-1),
    //     });
    // }

    if (isLoading || isPending) {
        return (
            <div>
                <Spinner type="fullPage" />
            </div>
        );
    }

    if (!isLoading && (!data || data.length === 0)) {
        return (
            <div className={styles.noResults}>
                <div className={styles.noResultsContent}>
                    <XCircle size={48} className={styles.noResultsIcon} />
                    <h3 className={styles.noResultsTitle}>No Results Found</h3>
                    <p className={styles.noResultsText}>
                        No projects match your current filters. Try adjusting your search criteria.
                    </p>
                    <button 
                        onClick={onResetFilters}
                        className={styles.resetFiltersButton}
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            <div className={styles.interactiveGrid}>
                {data.map((item) => {
                    // Find the pool type configuration based on item.pool_type
                    const poolTypeConfig = POOL_TYPES.find(
                        (type) => type.value === item.pool_type
                    );

                    return (
                    <motion.div
                        key={item.id}
                        className={styles.interactiveCard}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        onHoverStart={() => setHoveredProject(item.id)}
                        onHoverEnd={() => setHoveredProject(null)}
                        onClick={() => navigate(`/new-projects/list/${item.id}?status=POOL`)}
                    >
                        <div className={styles.interactiveImage}>
                            <img src={item?.photos?.[0]} alt={item?.name} />
                            <div className={styles.interactiveOverlay}>
                                <span className={styles.status}>
                                    {projectStatus === "POOL" ? "POOL" : item.projectStatus}
                                </span>
                                {poolTypeConfig && (
                                    <div
                                        style={{
                                            background: "rgba(255,255,255,0.92)",
                                            borderRadius: "8px",
                                            minWidth: "70px",
                                            height: "28px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            gap: "4px",
                                            fontSize: "13px",
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                            border: "1px solid #e5e7eb",
                                            padding: "0 8px",
                                            fontWeight: 500,
                                            marginLeft: "8px",
                                            position: "absolute",
                                            bottom: "10px",
                                            left: "10px"
                                        }}
                                        title={poolTypeConfig.label}
                                        aria-label={`Pool Type: ${poolTypeConfig.label}`}
                                    >
                                        <span style={{ 
                                            display: "flex", 
                                            alignItems: "center",
                                            transform: "scale(0.75)" 
                                        }}>
                                            {poolTypeConfig.icon}
                                        </span>
                                        <span style={{
                                            marginLeft: "3px",
                                            fontSize: "12px",
                                            color: "#444",
                                            fontWeight: 600,
                                            textTransform: "capitalize",
                                            letterSpacing: "0.01em"
                                        }}>
                                            {poolTypeConfig.label}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.interactiveContent}>
                            {projectStatus === "POOL" && (
                                <div className={styles.claimButtonContainer}>
                                    <button
                                        className={`${styles.claimButton} ${styles.claimButtonOutline}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClaim(item);
                                        }}
                                        disabled={isPending || disabledButtons.has(item.id)}
                                    >
                                        <span className={styles.claimButtonText}>Claim Project</span>
                                        <span className={styles.claimButtonIcon}>→</span>
                                    </button>
                                </div>
                            )}
                            <div className={styles.interactiveHeader}>
                                <h3>{item?.name}</h3>
                                {/* <div className={styles.interactiveActions}>
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
                                    {projectStatus !== "POOL" && (
                                        <>
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
                                                <Modal.Open openWindowName={`delete-${item.id}`}>
                                                    <button
                                                        className={styles.actionButton}
                                                        onClick={(e) => e.stopPropagation()}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </Modal.Open>
                                                <Modal.Window name={`delete-${item.id}`}>
                                                    <ConfirmDelete
                                                        resourceName={`Project ${item.name}`}
                                                        onConfirm={() => handleDelete(item)}
                                                        isDeleting={isDeletingProject}
                                                    />
                                                </Modal.Window>
                                            </Modal>
                                        </>
                                    )}
                                </div> */}
                            </div>
                            <p className={styles.price}>
                                {formatNum(item?.newParam?.price)} AED
                            </p>
                            <div className={styles.interactiveDetails}>
                                <span>{item?.area?.name || "N/A"}</span>
                                <span>{item?.developer?.name || "N/A"}</span>
                                <span>
                                    {`${bedroomString(item.newParam?.bedroomMin)} - ${bedroomString(item.newParam?.bedroomMax)}`}
                                </span>
                            </div>
                            <div className={styles.paymentPlan}>
                                <div className={styles.paymentPlanHeader}>
                                    <CreditCard size={16} />
                                    <span>Payment Plan</span>
                                    <span className={styles.handoverDate}>
                                        <Calendar size={16} />
                                        {  item?.newParam?.handoverTime ? formatMonthYear(item?.newParam?.handoverTime) : "N/A"}
                                    </span>
                                </div>
                                <div className={styles.paymentPlanDetails}>
                                    <div className={styles.paymentPlanItem}>
                                        <span>First</span>
                                        <span>{item?.payment_planParam?.first_installment || 0}%</span>
                                    </div>
                                    <div className={styles.paymentPlanItem}>
                                        <span>Under Constr.</span>
                                        <span>{item?.payment_planParam?.under_construction || 0}%</span>
                                    </div>
                                    <div className={styles.paymentPlanItem}>
                                        <span>Handover</span>
                                        <span>{item?.payment_planParam?.on_handover || 0}%</span>
                                    </div>
                                    <div className={styles.paymentPlanItem}>
                                        <span>Post</span>
                                        <span>{item?.payment_planParam?.post_handover || 0}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.interactiveFooter}>
                                {item?.createTime && (
                                    <span className={styles.date}>
                                        {`${getDaysFromCurrentDate(item.createTime)} days ago`}
                                    </span>
                                )}
                                {projectStatus === "POOL" && (
                                    <button
                                        className={styles.downloadButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClaim(item);
                                        }}
                                        disabled={isPending || disabledButtons.has(item.id)}
                                    >
                                        <Grab size={16} />
                                       Claim
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )})}
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
        </div>
    );
}

export default NewProjectsInteractive; 