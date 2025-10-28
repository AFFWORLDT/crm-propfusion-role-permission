import SectionTop from "../../ui/SectionTop";
import AddStaff from "../../features/admin/staff/AddStaff";
import CardGrid from "../../features/admin/staff/CardGrid";
import StaffTable from "../../features/admin/staff/StaffTable";
import ChangeStaff from "../../features/admin/staff/ChangeStaff";
import TabBar from "../../ui/TabBar";
import ViewToggle from "../../features/admin/staff/ViewToggle";
import { useState, useMemo } from "react";
import { useMyPermissions } from "../../hooks/useHasPermission";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { X, Check, Download, Search, Filter, SortAsc, SortDesc, Package } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import QRCode from "qrcode";
import useStaff from "../../features/admin/staff/useStaff";

function Staff() {
    const [activeView, setActiveView] = useState("grid");
    const { hasPermission } = useMyPermissions();
    const { currentUser } = useAuth();

    // Search functionality
    const [searchTerm, setSearchTerm] = useState("");
    
    // Filter states
    const [sortBy, setSortBy] = useState("newest"); // newest, oldest
    const [packageFilter, setPackageFilter] = useState("all"); // all, Essential, Premium, Exclusive
    const [showFilters, setShowFilters] = useState(false);

    // Fetch staff data
    const { isLoading, data: allStaffData, error } = useStaff();

    // Filter and sort staff data
    const filteredStaffData = useMemo(() => {
        if (!allStaffData) {
            return [];
        }

        let filtered = [...allStaffData];

        // Apply search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((staff) => {
                const name = staff.name?.toLowerCase() || "";
                const email = staff.email?.toLowerCase() || "";
                const phone = staff.phone?.toLowerCase() || "";

                return (
                    name.includes(searchLower) ||
                    email.includes(searchLower) ||
                    phone.includes(searchLower)
                );
            });
        }

        // Apply package filter
        if (packageFilter !== "all") {
            filtered = filtered.filter((staff) => 
                staff.staff_level === packageFilter
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.created_at || a.updated_at || 0);
            const dateB = new Date(b.created_at || b.updated_at || 0);
            
            if (sortBy === "newest") {
                return dateB - dateA; // Newest first
            } else {
                return dateA - dateB; // Oldest first
            }
        });

        return filtered;
    }, [allStaffData, searchTerm, sortBy, packageFilter]);

    // Role selection modal state
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loadingRoles, setLoadingRoles] = useState(false);

    // Fetch roles from API
    const fetchRoles = async () => {
        setLoadingRoles(true);
        try {
            const response = await axiosInstance.get("/roles?size=1000");
            setRoles(response.data.roles || []);
        } catch (error) {
            console.error("Error fetching roles:", error);
            toast.error("Failed to fetch roles");
        } finally {
            setLoadingRoles(false);
        }
    };

    // Open role selection modal
    const handleInvitationLinkClick = () => {
        setShowRoleModal(true);
        if (roles.length === 0) {
            fetchRoles();
        }
    };

    // Handle role selection and copy link
    const handleRoleSelectAndCopy = async () => {
        if (!selectedRole) {
            toast.error("Please select a role first");
            return;
        }

        try {
            const url =
                window.location.origin +
                `/agent-registration?affiliate_id=${currentUser?.id}&roleid=${selectedRole.role_id}`;
            await navigator.clipboard.writeText(url);
            toast.success(
                `Invitation link copied to clipboard for ${selectedRole.name} role!`
            );
            setShowRoleModal(false);
            setSelectedRole(null);
        } catch (err) {
            console.error("Failed to copy: ", err);
            toast.error("Failed to copy link");
        }
    };

    // Close modal
    const handleCloseModal = () => {
        setShowRoleModal(false);
        setSelectedRole(null);
    };

    // Handle QR code download
    const handleQRCodeDownload = async () => {
        if (!selectedRole) {
            toast.error("Please select a role first");
            return;
        }

        try {
            const url =
                window.location.origin +
                `/agent-registration?affiliate_id=${currentUser?.id}&roleid=${selectedRole.role_id}`;

            // Generate QR code as data URL
            const qrCodeDataURL = await QRCode.toDataURL(url, {
                width: 300,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#FFFFFF",
                },
            });

            // Create download link
            const link = document.createElement("a");
            link.download = `qr-code-${selectedRole.name.toLowerCase().replace(/\s+/g, "-")}.png`;
            link.href = qrCodeDataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(`QR code downloaded for ${selectedRole.name} role!`);
        } catch (error) {
            console.error("Error generating QR code:", error);
            toast.error("Failed to generate QR code");
        }
    };

    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="STAFF"
                    tabs={[
                        {
                            id: "STAFF",
                            label: "Staff",
                            bgColor: "#f5f4fa",
                            fontColor: "#341b80",
                            path: "/admin/staff",
                        },
                    ]}
                />
            </SectionTop>

            <section
                className="sectionStyles"
                style={{
                    paddingTop: "5rem",
                    paddingLeft: "3rem",
                    backgroundColor: "#f5f4fa",
                }}
            >
                <div style={{ backgroundColor: "#f5f4fa", boxShadow: "none" }}>
                    {/* Search and Filters Section */}
                    <div
                        style={{
                            marginTop: "2rem",
                            marginBottom: "1rem",
                        }}
                    >
                        {/* Search Bar */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "1rem",
                            }}
                        >
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    maxWidth: "500px",
                                }}
                            >
                                <Search
                                    size={20}
                                    style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6b7280",
                                        zIndex: 1,
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 12px 12px 44px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        backgroundColor: "white",
                                        outline: "none",
                                        transition: "border-color 0.2s ease",
                                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#3b82f6";
                                        e.target.style.boxShadow =
                                            "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#d1d5db";
                                        e.target.style.boxShadow =
                                            "0 1px 3px rgba(0, 0, 0, 0.1)";
                                    }}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        style={{
                                            position: "absolute",
                                            right: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#6b7280",
                                            padding: "4px",
                                            borderRadius: "4px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                                "#f3f4f6";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor =
                                                "transparent";
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Controls */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "1rem",
                                flexWrap: "wrap",
                                marginBottom: "1rem",
                            }}
                        >
                            {/* Filter Toggle Button */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    padding: "8px 16px",
                                    backgroundColor: showFilters ? "#3b82f6" : "white",
                                    color: showFilters ? "white" : "#374151",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                }}
                                onMouseEnter={(e) => {
                                    if (!showFilters) {
                                        e.target.style.backgroundColor = "#f9fafb";
                                        e.target.style.borderColor = "#9ca3af";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!showFilters) {
                                        e.target.style.backgroundColor = "white";
                                        e.target.style.borderColor = "#d1d5db";
                                    }
                                }}
                            >
                                <Filter size={16} />
                                Filters
                                {(sortBy !== "newest" || packageFilter !== "all") && (
                                    <div
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            backgroundColor: "#ef4444",
                                            borderRadius: "50%",
                                            marginLeft: "4px",
                                        }}
                                    />
                                )}
                            </button>

                            {/* Quick Sort Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                }}
                            >
                                <button
                                    onClick={() => setSortBy("newest")}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        padding: "8px 12px",
                                        backgroundColor: sortBy === "newest" ? "#10b981" : "white",
                                        color: sortBy === "newest" ? "white" : "#374151",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                                    }}
                                >
                                    <SortDesc size={14} />
                                    Newest
                                </button>
                                <button
                                    onClick={() => setSortBy("oldest")}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        padding: "8px 12px",
                                        backgroundColor: sortBy === "oldest" ? "#10b981" : "white",
                                        color: sortBy === "oldest" ? "white" : "#374151",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        fontSize: "13px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                                    }}
                                >
                                    <SortAsc size={14} />
                                    Oldest
                                </button>
                            </div>

                            {/* Results Count */}
                            <div
                                style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    fontWeight: "500",
                                }}
                            >
                                {filteredStaffData.length} staff member{filteredStaffData.length !== 1 ? 's' : ''}
                            </div>
                        </div>

                        {/* Advanced Filters Panel */}
                        {showFilters && (
                            <div
                                style={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    padding: "1.5rem",
                                    marginBottom: "1rem",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        marginBottom: "1rem",
                                    }}
                                >
                                    <Package size={18} color="#6b7280" />
                                    <h3
                                        style={{
                                            margin: 0,
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#374151",
                                        }}
                                    >
                                        Filter by Package Level
                                    </h3>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "0.75rem",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {[
                                        { value: "all", label: "All Packages", color: "#6b7280" },
                                        { value: "Essential", label: "Essential", color: "#7b1fa2" },
                                        { value: "Premium", label: "Premium", color: "#f57c00" },
                                        { value: "Exclusive", label: "Exclusive", color: "#1976d2" },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setPackageFilter(option.value)}
                                            style={{
                                                padding: "8px 16px",
                                                backgroundColor: packageFilter === option.value ? option.color : "white",
                                                color: packageFilter === option.value ? "white" : option.color,
                                                border: `2px solid ${option.color}`,
                                                borderRadius: "20px",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (packageFilter !== option.value) {
                                                    e.target.style.backgroundColor = option.color;
                                                    e.target.style.color = "white";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (packageFilter !== option.value) {
                                                    e.target.style.backgroundColor = "white";
                                                    e.target.style.color = option.color;
                                                }
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Clear Filters */}
                                {(sortBy !== "newest" || packageFilter !== "all") && (
                                    <div
                                        style={{
                                            marginTop: "1rem",
                                            paddingTop: "1rem",
                                            borderTop: "1px solid #e5e7eb",
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                setSortBy("newest");
                                                setPackageFilter("all");
                                            }}
                                            style={{
                                                padding: "6px 12px",
                                                backgroundColor: "transparent",
                                                color: "#6b7280",
                                                border: "1px solid #d1d5db",
                                                borderRadius: "6px",
                                                fontSize: "13px",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = "#f9fafb";
                                                e.target.style.borderColor = "#9ca3af";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = "transparent";
                                                e.target.style.borderColor = "#d1d5db";
                                            }}
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            justifyContent: "end",
                            marginTop: "2rem",
                            alignItems: "center",
                        }}
                    >
                        <ViewToggle
                            activeView={activeView}
                            onViewChange={setActiveView}
                        />

                        {/* Invitation Link Icon */}
                        <button
                            style={{
                                backgroundColor: "transparent",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                padding: "8px 12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                color: "#3b82f6",
                                fontSize: "14px",
                                fontWeight: "500",
                            }}
                            onClick={handleInvitationLinkClick}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#f8fafc";
                                e.currentTarget.style.borderColor = "#3b82f6";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "transparent";
                                e.currentTarget.style.borderColor = "#e2e8f0";
                            }}
                            title="Copy invitation link"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                            Invitation Link
                        </button>

                        {hasPermission("create_areas") && <AddStaff />}
                        <ChangeStaff />
                    </div>
                    {activeView === "grid" ? (
                        <CardGrid
                            data={filteredStaffData}
                            isLoading={isLoading}
                            error={error}
                        />
                    ) : (
                        <StaffTable
                            data={filteredStaffData}
                            isLoading={isLoading}
                            error={error}
                        />
                    )}
                </div>
            </section>

            {/* Role Selection Modal */}
            {showRoleModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            padding: "24px",
                            maxWidth: "500px",
                            width: "90%",
                            maxHeight: "80vh",
                            overflow: "auto",
                            boxShadow:
                                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }}
                    >
                        {/* Modal Header */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px",
                                paddingBottom: "16px",
                                borderBottom: "1px solid #e5e7eb",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#111827",
                                }}
                            >
                                Select Role for Invitation
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px",
                                    borderRadius: "4px",
                                    color: "#6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "#f3f4f6";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "transparent";
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div style={{ marginBottom: "24px" }}>
                            <p
                                style={{
                                    margin: "0 0 16px 0",
                                    color: "#6b7280",
                                    fontSize: "14px",
                                }}
                            >
                                Choose a role for the new staff member. The
                                invitation link will include this role
                                assignment.
                            </p>

                            {/* Loading State */}
                            {loadingRoles && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "40px",
                                        color: "#6b7280",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            border: "2px solid #e5e7eb",
                                            borderTop: "2px solid #3b82f6",
                                            borderRadius: "50%",
                                            animation:
                                                "spin 1s linear infinite",
                                            marginRight: "8px",
                                        }}
                                    ></div>
                                    Loading roles...
                                </div>
                            )}

                            {/* Roles List */}
                            {!loadingRoles && roles.length > 0 && (
                                <div
                                    style={{
                                        maxHeight: "400px",
                                        overflowY: "auto",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "12px",
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    {roles.map((role) => (
                                        <div
                                            key={role.role_id}
                                            onClick={() =>
                                                setSelectedRole(role)
                                            }
                                            style={{
                                                padding: "16px 20px",
                                                cursor: "pointer",
                                                borderBottom:
                                                    "1px solid #f3f4f6",
                                                backgroundColor:
                                                    selectedRole?.role_id ===
                                                    role.role_id
                                                        ? "#eff6ff"
                                                        : "transparent",
                                                borderLeft:
                                                    selectedRole?.role_id ===
                                                    role.role_id
                                                        ? "4px solid #3b82f6"
                                                        : "4px solid transparent",
                                                transition: "all 0.3s ease",
                                                position: "relative",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (
                                                    selectedRole?.role_id !==
                                                    role.role_id
                                                ) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "#f8fafc";
                                                    e.currentTarget.style.transform =
                                                        "translateX(2px)";
                                                    e.currentTarget.style.boxShadow =
                                                        "0 2px 8px rgba(0, 0, 0, 0.1)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (
                                                    selectedRole?.role_id !==
                                                    role.role_id
                                                ) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "transparent";
                                                    e.currentTarget.style.transform =
                                                        "translateX(0)";
                                                    e.currentTarget.style.boxShadow =
                                                        "none";
                                                }
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "flex-start",
                                                    gap: "12px",
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    {/* Role Name */}
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "8px",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontWeight:
                                                                    "600",
                                                                color: "#111827",
                                                                fontSize:
                                                                    "16px",
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                        >
                                                            {role.name}
                                                        </div>
                                                        {role.is_system_role && (
                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        "#fef3c7",
                                                                    color: "#92400e",
                                                                    padding:
                                                                        "2px 8px",
                                                                    borderRadius:
                                                                        "12px",
                                                                    fontSize:
                                                                        "10px",
                                                                    fontWeight:
                                                                        "500",
                                                                    textTransform:
                                                                        "uppercase",
                                                                    letterSpacing:
                                                                        "0.5px",
                                                                }}
                                                            >
                                                                System
                                                            </span>
                                                        )}
                                                        {!role.is_active && (
                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        "#fee2e2",
                                                                    color: "#dc2626",
                                                                    padding:
                                                                        "2px 8px",
                                                                    borderRadius:
                                                                        "12px",
                                                                    fontSize:
                                                                        "10px",
                                                                    fontWeight:
                                                                        "500",
                                                                    textTransform:
                                                                        "uppercase",
                                                                    letterSpacing:
                                                                        "0.5px",
                                                                }}
                                                            >
                                                                Inactive
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Role Description */}
                                                    {role.description && (
                                                        <div
                                                            style={{
                                                                color: "#6b7280",
                                                                fontSize:
                                                                    "13px",
                                                                marginBottom:
                                                                    "8px",
                                                                lineHeight:
                                                                    "1.4",
                                                            }}
                                                        >
                                                            {role.description}
                                                        </div>
                                                    )}

                                                    {/* Permissions Count */}
                                                    {role.permissions &&
                                                        role.permissions
                                                            .length > 0 && (
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    gap: "6px",
                                                                    marginBottom:
                                                                        "4px",
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: "6px",
                                                                        height: "6px",
                                                                        backgroundColor:
                                                                            "#10b981",
                                                                        borderRadius:
                                                                            "50%",
                                                                    }}
                                                                ></div>
                                                                <span
                                                                    style={{
                                                                        color: "#059669",
                                                                        fontSize:
                                                                            "12px",
                                                                        fontWeight:
                                                                            "500",
                                                                    }}
                                                                >
                                                                    {
                                                                        role
                                                                            .permissions
                                                                            .length
                                                                    }{" "}
                                                                    permission
                                                                    {role
                                                                        .permissions
                                                                        .length !==
                                                                    1
                                                                        ? "s"
                                                                        : ""}
                                                                </span>
                                                            </div>
                                                        )}

                                                    {/* Created Date */}
                                                    <div
                                                        style={{
                                                            color: "#9ca3af",
                                                            fontSize: "11px",
                                                            marginTop: "4px",
                                                        }}
                                                    >
                                                        Created:{" "}
                                                        {new Date(
                                                            role.created_at
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Selection Indicator */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        width: "24px",
                                                        height: "24px",
                                                        borderRadius: "50%",
                                                        border:
                                                            selectedRole?.role_id ===
                                                            role.role_id
                                                                ? "2px solid #3b82f6"
                                                                : "2px solid #d1d5db",
                                                        backgroundColor:
                                                            selectedRole?.role_id ===
                                                            role.role_id
                                                                ? "#3b82f6"
                                                                : "transparent",
                                                        transition:
                                                            "all 0.2s ease",
                                                    }}
                                                >
                                                    {selectedRole?.role_id ===
                                                        role.role_id && (
                                                        <Check
                                                            size={14}
                                                            color="white"
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Permissions Preview */}
                                            {role.permissions &&
                                                role.permissions.length > 0 &&
                                                selectedRole?.role_id ===
                                                    role.role_id && (
                                                    <div
                                                        style={{
                                                            marginTop: "12px",
                                                            padding: "8px 12px",
                                                            backgroundColor:
                                                                "#f0f9ff",
                                                            borderRadius: "6px",
                                                            border: "1px solid #bae6fd",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "11px",
                                                                fontWeight:
                                                                    "500",
                                                                color: "#0369a1",
                                                                marginBottom:
                                                                    "4px",
                                                            }}
                                                        >
                                                            Key Permissions:
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexWrap:
                                                                    "wrap",
                                                                gap: "4px",
                                                            }}
                                                        >
                                                            {role.permissions
                                                                .slice(0, 3)
                                                                .map(
                                                                    (
                                                                        permission,
                                                                        index
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                index
                                                                            }
                                                                            style={{
                                                                                backgroundColor:
                                                                                    "#dbeafe",
                                                                                color: "#1e40af",
                                                                                padding:
                                                                                    "2px 6px",
                                                                                borderRadius:
                                                                                    "4px",
                                                                                fontSize:
                                                                                    "10px",
                                                                                fontWeight:
                                                                                    "500",
                                                                                textTransform:
                                                                                    "capitalize",
                                                                            }}
                                                                        >
                                                                            {permission.replace(
                                                                                /_/g,
                                                                                " "
                                                                            )}
                                                                        </span>
                                                                    )
                                                                )}
                                                            {role.permissions
                                                                .length > 3 && (
                                                                <span
                                                                    style={{
                                                                        backgroundColor:
                                                                            "#e5e7eb",
                                                                        color: "#6b7280",
                                                                        padding:
                                                                            "2px 6px",
                                                                        borderRadius:
                                                                            "4px",
                                                                        fontSize:
                                                                            "10px",
                                                                        fontWeight:
                                                                            "500",
                                                                    }}
                                                                >
                                                                    +
                                                                    {role
                                                                        .permissions
                                                                        .length -
                                                                        3}{" "}
                                                                    more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* No Roles State */}
                            {!loadingRoles && roles.length === 0 && (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "40px",
                                        color: "#6b7280",
                                    }}
                                >
                                    No roles available
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "12px",
                                paddingTop: "16px",
                                borderTop: "1px solid #e5e7eb",
                            }}
                        >
                            <button
                                onClick={handleCloseModal}
                                style={{
                                    padding: "8px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "6px",
                                    backgroundColor: "white",
                                    color: "#374151",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "#f9fafb";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "white";
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleQRCodeDownload}
                                disabled={!selectedRole}
                                style={{
                                    padding: "8px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "6px",
                                    backgroundColor: selectedRole
                                        ? "white"
                                        : "#f9fafb",
                                    color: selectedRole ? "#374151" : "#9ca3af",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: selectedRole
                                        ? "pointer"
                                        : "not-allowed",
                                    transition: "all 0.2s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedRole) {
                                        e.currentTarget.style.backgroundColor =
                                            "#f3f4f6";
                                        e.currentTarget.style.borderColor =
                                            "#9ca3af";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedRole) {
                                        e.currentTarget.style.backgroundColor =
                                            "white";
                                        e.currentTarget.style.borderColor =
                                            "#d1d5db";
                                    }
                                }}
                            >
                                <Download size={16} />
                                Download QR
                            </button>
                            <button
                                onClick={handleRoleSelectAndCopy}
                                disabled={!selectedRole}
                                style={{
                                    padding: "8px 16px",
                                    border: "none",
                                    borderRadius: "6px",
                                    backgroundColor: selectedRole
                                        ? "#3b82f6"
                                        : "#d1d5db",
                                    color: selectedRole ? "white" : "#9ca3af",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    cursor: selectedRole
                                        ? "pointer"
                                        : "not-allowed",
                                    transition: "all 0.2s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedRole) {
                                        e.currentTarget.style.backgroundColor =
                                            "#2563eb";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedRole) {
                                        e.currentTarget.style.backgroundColor =
                                            "#3b82f6";
                                    }
                                }}
                            >
                                <Check size={16} />
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS for spinner animation */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default Staff;
