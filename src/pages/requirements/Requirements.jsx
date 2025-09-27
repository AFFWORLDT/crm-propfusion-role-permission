import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import styles from "./Requirements.module.css";
import {
    getPropertyRequirements,
    deletePropertyRequirement,
} from "../../services/apiRequirements";
import SectionTop from "../../ui/SectionTop";

function Requirements() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({
        is_active: "",
        page: 1,
        limit: 10,
    });

    // Fetch requirements
    const {
        data: requirementsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["property-requirements", filters],
        queryFn: () => getPropertyRequirements(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deletePropertyRequirement,
        onSuccess: () => {
            toast.success("Requirement deleted successfully!");
            queryClient.invalidateQueries(["property-requirements"]);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete requirement");
        },
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            is_active: "",
            page: 1,
            limit: 10,
        });
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    const handleDelete = (requirementId) => {
        if (
            window.confirm("Are you sure you want to delete this requirement?")
        ) {
            deleteMutation.mutate(requirementId);
        }
    };

    const formatPrice = (price) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "AED",
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className={styles.requirementsContainer}>
                <div className={styles.loading}>Loading requirements...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.requirementsContainer}>
                <div className={styles.error}>
                    Error loading requirements: {error.message}
                </div>
            </div>
        );
    }

    const requirements =
        requirementsData?.requirements || requirementsData || [];

    return (
        <div className="sectionContainer">
            <SectionTop heading="Requirements" />
            <section className="sectionStyles">
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}></h1>
                    <button
                        className={styles.addButton}
                        onClick={() => navigate("/requirements/add")}
                    >
                        <span>+</span>
                        Add Requirement
                    </button>
                </div>

                {/* Filters */}
                <div className={styles.filtersSection}>
                    <div className={styles.filtersGrid}>
                        <div className={styles.filterGroup}>
                            <label className={styles.filterLabel}>Status</label>
                            <select
                                className={styles.filterInput}
                                value={filters.is_active}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "is_active",
                                        e.target.value
                                    )
                                }
                            >
                                <option value="">All Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                    {filters.is_active && (
                        <div className={styles.filterActions}>
                            <button
                                className={`${styles.filterButton} ${styles.clearButton}`}
                                onClick={handleClearFilters}
                            >
                                Clear Filter
                            </button>
                        </div>
                    )}
                </div>

                {/* Requirements List */}
                <div className={styles.requirementsList}>
                    {requirements.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📋</div>
                            <h2 className={styles.emptyTitle}>
                                No Requirements Found
                            </h2>
                            <p className={styles.emptyDescription}>
                                Create your first property requirement to get
                                started.
                            </p>
                            <button
                                className={styles.addButton}
                                onClick={() => navigate("/requirements/add")}
                            >
                                <span>+</span>
                                Add First Requirement
                            </button>
                        </div>
                    ) : (
                        requirements.map((requirement) => (
                            <div
                                key={requirement.id}
                                className={styles.requirementCard}
                            >
                                <div className={styles.cardHeader}>
                                    <div>
                                        <h3 className={styles.cardTitle}>
                                            {requirement.title}
                                        </h3>
                                        <p className={styles.cardDescription}>
                                            {requirement.description ||
                                                "No description provided"}
                                        </p>
                                    </div>
                                    <span
                                        className={`${styles.statusBadge} ${
                                            requirement.is_active
                                                ? styles.statusActive
                                                : styles.statusInactive
                                        }`}
                                    >
                                        {requirement.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>

                                <div className={styles.cardContent}>
                                    <div className={styles.infoGroup}>
                                        <span className={styles.infoLabel}>
                                            Property Types
                                        </span>
                                        <div className={styles.propertyTypes}>
                                            {requirement.property_types
                                                ?.length > 0 ? (
                                                requirement.property_types.map(
                                                    (type, index) => (
                                                        <span
                                                            key={index}
                                                            className={
                                                                styles.propertyTypeTag
                                                            }
                                                        >
                                                            {type}
                                                        </span>
                                                    )
                                                )
                                            ) : (
                                                <span
                                                    className={styles.infoValue}
                                                >
                                                    - Type
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.infoGroup}>
                                        <span className={styles.infoLabel}>
                                            Locations
                                        </span>
                                        <div className={styles.locations}>
                                            {requirement.locations?.length >
                                            0 ? (
                                                requirement.locations
                                                    .slice(0, 3)
                                                    .map((location, index) => (
                                                        <div
                                                            key={index}
                                                            className={
                                                                styles.locationItem
                                                            }
                                                        >
                                                            {[
                                                                location.city,
                                                                location.community,
                                                                location.sub_community,
                                                                location.property_name,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(", ") ||
                                                                "Location details"}
                                                        </div>
                                                    ))
                                            ) : (
                                                <span
                                                    className={styles.infoValue}
                                                >
                                                    - Location
                                                </span>
                                            )}
                                            {requirement.locations?.length >
                                                3 && (
                                                <div
                                                    className={
                                                        styles.locationItem
                                                    }
                                                >
                                                    +
                                                    {requirement.locations
                                                        .length - 3}{" "}
                                                    more...
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.infoGroup}>
                                        <span className={styles.infoLabel}>
                                            Bedrooms
                                        </span>
                                        <span className={styles.infoValue}>
                                            {requirement.min_bedrooms || 0} -{" "}
                                            {requirement.max_bedrooms || "-"}
                                        </span>
                                    </div>
                                    <div className={styles.infoGroup}>
                                        <span className={styles.infoLabel}>
                                            Agent
                                        </span>
                                        <span className={styles.infoValue}>
                                            {requirement.agent_details?.name || "-"}
                                        </span>
                                    </div>

                                    <div className={styles.infoGroup}>
                                        <span className={styles.infoLabel}>
                                            Price Range
                                        </span>
                                        <span className={styles.infoValue}>
                                            {formatPrice(requirement.min_price)}{" "}
                                            -{" "}
                                            {formatPrice(requirement.max_price)}
                                        </span>
                                    </div>

                                    <div className={styles.infoGroup}>
                                        <span className={styles.infoLabel}>
                                            Listing Type
                                        </span>
                                        <span className={styles.infoValue}>
                                            {requirement.listing_type || "-"}
                                        </span>
                                    </div>

                                    <div className={styles.infoGroup}>
                                        <span className={styles.infoLabel}>
                                            Size (sqft)
                                        </span>
                                        <span className={styles.infoValue}>
                                            {requirement.min_size || 0} -{" "}
                                            {requirement.max_size || "-"}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.cardActions}>
                                    <button
                                        className={`${styles.actionButton} ${styles.viewButton}`}
                                        onClick={() =>
                                            navigate(
                                                `/requirements/${requirement.id}`
                                            )
                                        }
                                    >
                                        View
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.editButton}`}
                                        onClick={() =>
                                            navigate(
                                                `/requirements/${requirement.id}/edit`
                                            )
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() =>
                                            handleDelete(requirement.id)
                                        }
                                        disabled={deleteMutation.isLoading}
                                    >
                                        {deleteMutation.isLoading
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {requirements.length > 0 && (
                    <div className={styles.pagination}>
                        <div className={styles.paginationInfo}>
                            Showing {(filters.page - 1) * filters.limit + 1} to{" "}
                            {Math.min(
                                filters.page * filters.limit,
                                requirementsData?.total || requirements.length
                            )}{" "}
                            of {requirementsData?.total || requirements.length}{" "}
                            requirements
                        </div>
                        <div className={styles.paginationControls}>
                            <button
                                className={`${styles.paginationButton} ${filters.page === 1 ? styles.disabled : ""}`}
                                onClick={() =>
                                    handlePageChange(filters.page - 1)
                                }
                                disabled={filters.page === 1}
                            >
                                Previous
                            </button>

                            {/* Page Numbers */}
                            {Array.from(
                                {
                                    length: Math.ceil(
                                        (requirementsData?.total ||
                                            requirements.length) / filters.limit
                                    ),
                                },
                                (_, i) => i + 1
                            )
                                .filter((page) => {
                                    const totalPages = Math.ceil(
                                        (requirementsData?.total ||
                                            requirements.length) / filters.limit
                                    );
                                    if (totalPages <= 7) return true;
                                    if (page === 1 || page === totalPages)
                                        return true;
                                    if (
                                        page >= filters.page - 2 &&
                                        page <= filters.page + 2
                                    )
                                        return true;
                                    return false;
                                })
                                .map((page, index, array) => {
                                    const showEllipsis =
                                        index > 0 &&
                                        page - array[index - 1] > 1;
                                    return (
                                        <div
                                            key={page}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            {showEllipsis && (
                                                <span
                                                    className={styles.ellipsis}
                                                >
                                                    ...
                                                </span>
                                            )}
                                            <button
                                                className={`${styles.paginationButton} ${filters.page === page ? styles.active : ""}`}
                                                onClick={() =>
                                                    handlePageChange(page)
                                                }
                                            >
                                                {page}
                                            </button>
                                        </div>
                                    );
                                })}

                            <button
                                className={`${styles.paginationButton} ${filters.page >= Math.ceil((requirementsData?.total || requirements.length) / filters.limit) ? styles.disabled : ""}`}
                                onClick={() =>
                                    handlePageChange(filters.page + 1)
                                }
                                disabled={
                                    filters.page >=
                                    Math.ceil(
                                        (requirementsData?.total ||
                                            requirements.length) / filters.limit
                                    )
                                }
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Requirements;
