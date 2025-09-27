import { useState, useEffect, useRef } from "react";
import styles from "./BuildingDetail.module.css";
import useInfiniteBuilding from "../../features/building/useGetBuildUrl";
import { useParams, useNavigate } from "react-router-dom";
import SectionTop from "../../ui/SectionTop";
import {
    Edit2,
    Trash2,
    AlertTriangle,
    Loader2,
    Building,
    FileText,
    Download,
    Eye,
    Image,
    X,
    PlusCircle,
    CreditCard,
    Save,
    Upload,
    Edit,
} from "lucide-react";
import { useDeleteBuilding } from "../../features/building/useDeleteBuilding";
import { usePropertiesBasics } from "../../features/properties/usePropertiesBasics";
import Modal from "../../ui/Modal";
import FormInputDataList from "../../ui/FormInputDataList";
import { useForm } from "react-hook-form";
import useUpdateProperty from "../../features/properties/useUpdateProperty";
import useUpdateBuilding from "../../features/building/useUpdateBuilding";
import { useUploadReceipt } from "../../features/rental-agreement/useUploadReceipt";
import { toast } from "react-hot-toast";

const getDocumentIcon = (docType) => {
    switch (docType) {
        case "building_drawing":
            return "📐";
        case "title_deed":
            return "📜";
        case "management_contract":
            return "📋";
        case "tenancy_lease_contract":
            return "📄";
        case "affection_plan":
            return "🗺️";
        case "poa_noc":
            return "⚖️";
        case "handover_documents":
            return "🔑";
        case "other_documents":
            return "📎";
        default:
            return "📄";
    }
};

const BuildingDetail = () => {
    const [activeTab, setActiveTab] = useState("details");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPropertyModal, setShowPropertyModal] = useState(false);
    const [editStates, setEditStates] = useState([]);
    const { properties, isLoading: isPropertiesLoading } =
        usePropertiesBasics(true);
    const { control, handleSubmit, reset, watch } = useForm();
    const selectedProperties = watch("property_id") || [];
    const propertyOptions = properties.map((property) => ({
        label: property.title,
        value: property.id,
    }));
    const { changeProperty, isPending } = useUpdateProperty();

    const { id } = useParams();
    const navigate = useNavigate();
    const {
        projects: buildingData,
        isLoading,
        error,
    } = useInfiniteBuilding(id);
    const { deleteBuildingMutation, isDeleting } = useDeleteBuilding();
    const { updateBuildingMutation, isPending: isUpdating } =
        useUpdateBuilding();
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [newPayment, setNewPayment] = useState({
        due_date: "",
        amount: "",
        payment_method: "cheque",
        payment_status: "pending",
        reference_number: "",
        receipt_image: "",
    });
    const [editingPaymentIndex, setEditingPaymentIndex] = useState(null);
    const [editedPayment, setEditedPayment] = useState(null);
    const [isTableScrolledRight, setIsTableScrolledRight] = useState(false);
    const paymentsTableRef = useRef(null);
    const { upload, isUploading } = useUploadReceipt("upload-building-payment-receipt");

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleEdit = () => {
        navigate(`/new-building/edit/${id}`);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        deleteBuildingMutation(id);
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

 
 



    // Initialize edit states when cheque payments change
    useEffect(() => {
        if (buildingData[0]?.cheque_payments) {
            setEditStates(
                new Array(buildingData[0].cheque_payments.length).fill(null)
            );
        }
    }, [buildingData[0]?.cheque_payments]);

    // Format currency for AED
    const formatCurrency = (amount) => {
        return `AED ${Number(amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    // Handle adding a new payment
    const handleAddPayment = () => {
        if (!newPayment.due_date || !newPayment.amount) {
            toast.error("Please fill in all required fields");
            return;
        }

        const paymentToAdd = {
            ...newPayment,
            due_date: new Date(newPayment.due_date).toISOString(),
            amount: Number(newPayment.amount),
            payment_status: newPayment.payment_status === "paid" ? "done" : "pending",
        };

        const updatedPayments = [...buildingData[0].cheque_payments, paymentToAdd];

        updateBuildingMutation({
            buildingId: id,
            updatedBuilding: {
                cheque_payments: updatedPayments,
            },
        });

        setNewPayment({
            due_date: "",
            amount: "",
            payment_method: "cheque",
            payment_status: "pending",
            reference_number: "",
            receipt_image: "",
        });
        setShowAddPayment(false);
    };

    // Handle deleting a payment
    const handleDeletePayment = (index) => {
        const updatedPayments = buildingData[0].cheque_payments.filter((_, i) => i !== index);

        updateBuildingMutation({
            buildingId: id,
            updatedBuilding: {
                cheque_payments: updatedPayments,
            },
        });
    };

    // Handle payment input changes
    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setNewPayment((prev) => ({ ...prev, [name]: value }));
    };

    // Function to display user-friendly payment status
    const displayPaymentStatus = (status) => {
        return status === "done" ? "Paid" : "Pending";
    };

    // Function to get status badge class
    const getStatusBadgeClass = (status) => {
        return status === "done" ? styles.paid : styles.pending;
    };

    // Format payment method for display
    const displayPaymentMethod = (method) => {
        switch (method) {
            case "cheque":
                return "Cheque";
            case "cash":
                return "Cash";
            case "bank_deposit":
                return "Bank Deposit";
            case "credit_card":
                return "Credit Card";
            case "bank_transfer":
                return "Bank Transfer";
            default:
                return method;
        }
    };

    // Start editing a payment
    const handleEditPayment = (payment, index) => {
        setEditingPaymentIndex(index);
        setEditedPayment({
            ...payment,
            due_date: payment.due_date.split("T")[0],
        });
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingPaymentIndex(null);
        setEditedPayment(null);
    };

    // Handle edited payment input changes
    const handleEditPaymentChange = (e) => {
        const { name, value } = e.target;
        setEditedPayment((prev) => ({ ...prev, [name]: value }));
    };

    // Save edited payment
    const handleSavePayment = () => {
        if (!editedPayment || editingPaymentIndex === null) return;

        const updatedPayment = {
            ...editedPayment,
            due_date: new Date(editedPayment.due_date).toISOString(),
            amount: Number(editedPayment.amount),
            payment_status: editedPayment.payment_status === "paid" ? "done" : "pending",
        };

        const updatedPayments = [...buildingData[0].cheque_payments];
        updatedPayments[editingPaymentIndex] = updatedPayment;

        updateBuildingMutation({
            buildingId: id,
            updatedBuilding: {
                cheque_payments: updatedPayments,
            },
        });

        setEditingPaymentIndex(null);
        setEditedPayment(null);
    };

    // Handle scroll event for payments table
    const handleTableScroll = () => {
        if (!paymentsTableRef.current) return;

        const table = paymentsTableRef.current;
        const isScrolledToEnd = table.scrollLeft + table.clientWidth >= table.scrollWidth - 10;

        setIsTableScrolledRight(isScrolledToEnd);
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading building details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div>
                    <h3>Error Loading Data</h3>
                    <p>{error.message || "Failed to fetch building details"}</p>
                </div>
            </div>
        );
    }

    if (!buildingData || buildingData.length === 0) {
        return (
            <div className={styles.errorContainer}>
                <div>
                    <h3>No Data Available</h3>
                    <p>No building data was found for this ID</p>
                </div>
            </div>
        );
    }

    // Extract the first building data item
    const building = buildingData[0];

    // Group data into logical sections
    const basicInfo = {
        "Building Name": building?.building_name || "N/A",
        "Building Status": building?.building_status || "N/A",
        "Area Name": building?.area?.name || "N/A",
        "Plot No.": building?.plot_no || "N/A",
        "Makani No.": building?.makani_no || "N/A",
        "Main Dewa No.": building?.main_dewa_no || "N/A",
        "DM No.": building?.dm_no || "N/A",
        "Total Properties": building?.total_properties || "0",
        "Units Type": building?.property_type_counts 
            ? Object.entries(building.property_type_counts)
                .map(([type, count]) => `${type} (${count})`)
                .join(", ")
            : "N/A",
        Location:
            typeof building?.location === "object"
                ? `${building?.location?.city || ""} ${building?.location?.community || ""}`.trim() ||
                  "N/A"
                : building?.location || "N/A",
    };

    const contractInfo = {
        "Contract Start Date": formatDate(building?.contract_start_date),
        "Contract End Date": formatDate(building?.contract_end_date),
        "Annual Rent": `${building?.annual_rent} ${building?.payment_type}` ,
        "No. of Leasing Years": building?.no_of_leasing_years || "N/A",
        "No. of Cheques": building?.no_of_cheques || "N/A",
        "Payment Type": building?.payment_type || "N/A",
        "Security Amount": building?.security_amount_payment_method
            ? `AED ${building?.security_amount_payment_method.toLocaleString()}`
            : "N/A",
        "Security Payment Condition":
            building?.security_amount_payment_condition || "N/A",
        "Commission Amount": building?.commission_amount
            ? `AED ${building?.commission_amount.toLocaleString()}`
            : "N/A",
        "Commission Payment Method":
            building?.commission_payment_method || "N/A",
    };

    const watchmanInfo = building?.watchman_info || {
        name: null,
        email: null,
        contact_no: null,
    };

    const creatorInfo = building?.created_by_agent || {
        name: "N/A",
        email: "N/A",
        phone: "N/A",
    };

    const getStatusClass = (status) => {
        if (!status) return "";
        const statusLower = status.toLowerCase();
        if (statusLower.includes("active")) return "active";
        if (statusLower.includes("inactive")) return "inactive";
        if (statusLower.includes("pending")) return "pending";
        if (statusLower.includes("draft")) return "draft";
        return "";
    };

    return (
        <div className={"sectionContainer"}>
            <Modal>
                <SectionTop heading="Building Details" />

                <section className={styles.buildingDetails}>
                    <div className={styles.container}>
                        <header className={styles.header}>
                            <div className={styles.titleWrapper}>
                                <h1 className={styles.title}>
                                    {building?.building_name ||
                                        "Building Details"}
                                </h1>
                                <div className={styles.headerActions}>
                                    <div
                                        className={
                                            styles.statusDropdownContainer
                                        }
                                    >
                                        <select
                                            className={`${styles.statusDropdown} ${styles[getStatusClass(building?.building_status)]}`}
                                            value={
                                                building?.building_status ||
                                                "DRAFT"
                                            }
                                            onChange={(e) => {
                                                updateBuildingMutation({
                                                    buildingId: id,
                                                    updatedBuilding: {
                                                        building_status:
                                                            e.target.value,
                                                    },
                                                });
                                            }}
                                            disabled={isUpdating}
                                        >
                                            <option value="ACTIVE">
                                                ACTIVE
                                            </option>
                                            <option value="INACTIVE">
                                                INACTIVE
                                            </option>
                                            <option value="DRAFT">DRAFT</option>
                                        </select>
                                    </div>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.iconButton}
                                            onClick={handleEdit}
                                            title="Edit Building"
                                        >
                                            <Edit2 size={20} color="#ffff" />
                                        </button>
                                        <button
                                            className={styles.iconButton}
                                            onClick={handleDelete}
                                            title="Delete Building"
                                            disabled={isDeleting}
                                        >
                                            <Trash2 size={20} color="#ffff" />
                                        </button>
                                        <button
                                            className={styles.iconButton}
                                            onClick={() =>
                                                setShowPropertyModal(true)
                                            }
                                            disabled={isPending}
                                        >
                                            <Building size={20} color="#ffff" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.metaInfo}>
                                <p>
                                    Created: {formatDate(building?.created_at)}
                                </p>
                                <p>
                                    Last Updated:{" "}
                                    {formatDate(building?.last_updated)}
                                </p>
                            </div>
                        </header>

                        <nav className={styles.tabsNav}>
                            <button
                                className={`${styles.tabButton} ${activeTab === "details" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("details")}
                            >
                                Basic Details
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === "contract" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("contract")}
                            >
                                Contract Information
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === "docs" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("docs")}
                            >
                                Documents & Photos
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === "contacts" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("contacts")}
                            >
                                Contacts
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === "properties" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("properties")}
                            >
                                Properties
                            </button>
                            <button
                                className={`${styles.tabButton} ${activeTab === "cheque_payments" ? styles.activeTab : ""}`}
                                onClick={() => setActiveTab("cheque_payments")}
                            >
                             Payments
                            </button>
                        </nav>

                        <div className={styles.content}>
                            {/* Basic Details Tab */}
                            {activeTab === "details" && (
                                <div className={styles.detailsSection}>
                                    <h2 className={styles.sectionTitle}>
                                        Basic Information
                                    </h2>
                                    <div className={styles.infoGrid}>
                                        {Object.entries(basicInfo).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className={styles.infoItem}
                                                >
                                                    <span
                                                        className={
                                                            styles.infoLabel
                                                        }
                                                    >
                                                        {key}
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.infoValue
                                                        }
                                                    >
                                                        {value}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* Owner Information Section */}
                                    {building?.owner && (
                                        <div
                                            className={styles.sectionContainer}
                                        >
                                            <h3 className={styles.sectionTitle}>
                                                Owner Information
                                            </h3>
                                            <div className={styles.infoGrid}>
                                                {Object.entries(
                                                    building.owner
                                                ).map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className={
                                                            styles.infoItem
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                styles.infoLabel
                                                            }
                                                        >
                                                            {key
                                                                .split("_")
                                                                .map(
                                                                    (word) =>
                                                                        word
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase() +
                                                                        word.slice(
                                                                            1
                                                                        )
                                                                )
                                                                .join(" ")}
                                                        </span>
                                                        <span
                                                            className={
                                                                styles.infoValue
                                                            }
                                                        >
                                                            {value || "N/A"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Created By Agent Section */}
                                    {building?.created_by_agent && (
                                        <div
                                            className={styles.sectionContainer}
                                        >
                                            <h3 className={styles.sectionTitle}>
                                                Created By
                                            </h3>
                                            <div className={styles.agentCard}>
                                                {building.created_by_agent
                                                    .avatar && (
                                                    <img
                                                        src={
                                                            building
                                                                .created_by_agent
                                                                .avatar
                                                        }
                                                        alt="Agent Avatar"
                                                        className={
                                                            styles.agentAvatar
                                                        }
                                                    />
                                                )}
                                                <div
                                                    className={styles.agentInfo}
                                                >
                                                    <p
                                                        className={
                                                            styles.agentName
                                                        }
                                                    >
                                                        {
                                                            building
                                                                .created_by_agent
                                                                .name
                                                        }
                                                    </p>
                                                    <p
                                                        className={
                                                            styles.agentEmail
                                                        }
                                                    >
                                                        {
                                                            building
                                                                .created_by_agent
                                                                .email
                                                        }
                                                    </p>
                                                    <p
                                                        className={
                                                            styles.agentPhone
                                                        }
                                                    >
                                                        {building
                                                            .created_by_agent
                                                            .phone || "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Assigned Agent Section */}
                                    {building?.agent && (
                                        <div
                                            className={styles.sectionContainer}
                                        >
                                            <h3 className={styles.sectionTitle}>
                                                Assigned Agent
                                            </h3>
                                            <div className={styles.agentCard}>
                                                {building.agent.avatar && (
                                                    <img
                                                        src={
                                                            building.agent
                                                                .avatar
                                                        }
                                                        alt="Agent Avatar"
                                                        className={
                                                            styles.agentAvatar
                                                        }
                                                    />
                                                )}
                                                <div
                                                    className={styles.agentInfo}
                                                >
                                                    <p
                                                        className={
                                                            styles.agentName
                                                        }
                                                    >
                                                        {building.agent.name}
                                                    </p>
                                                    <p
                                                        className={
                                                            styles.agentEmail
                                                        }
                                                    >
                                                        {building.agent.email}
                                                    </p>
                                                    <p
                                                        className={
                                                            styles.agentPhone
                                                        }
                                                    >
                                                        {building.agent.phone ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.commentsSection}>
                                        <h3>Comments</h3>
                                        <p className={styles.commentText}>
                                            {building?.comments ||
                                                "No comments available."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Contract Information Tab */}
                            {activeTab === "contract" && (
                                <div className={styles.detailsSection}>
                                    <h2 className={styles.sectionTitle}>
                                        Contract Information
                                    </h2>
                                    <div className={styles.infoGrid}>
                                        {Object.entries(contractInfo).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className={styles.infoItem}
                                                >
                                                    <span
                                                        className={
                                                            styles.infoLabel
                                                        }
                                                    >
                                                        {key}
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.infoValue
                                                        }
                                                    >
                                                        {value}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>

                                  
                                </div>
                            )}

                            {/* Documents & Photos Tab */}
                            {activeTab === "docs" && (
                                <div className={styles.detailsSection}>
                                    <h2 className={styles.sectionTitle}>
                                        Documents & Photos
                                    </h2>

                                    {/* Building Photos Section */}
                                    <div className={styles.docSection}>
                                        <h3>
                                            <Image
                                                size={18}
                                                className={styles.sectionIcon}
                                            />
                                            Building Photos
                                        </h3>
                                        <div className={styles.photoGrid}>
                                            {building?.photos &&
                                            building?.photos.length > 0 ? (
                                                building.photos.map(
                                                    (photo, index) => (
                                                        <div
                                                            key={index}
                                                            className={
                                                                styles.photoItem
                                                            }
                                                        >
                                                            <img
                                                                src={photo}
                                                                alt={`Building ${index + 1}`}
                                                                className={
                                                                    styles.photoImage
                                                                }
                                                            />
                                                            <a
                                                                href={photo}
                                                                download
                                                                className={
                                                                    styles.downloadButton
                                                                }
                                                            >
                                                                <Download
                                                                    size={16}
                                                                />
                                                                Download
                                                            </a>
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <p
                                                    className={
                                                        styles.emptyMessage
                                                    }
                                                >
                                                    No photos available
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Document Sections */}
                                    {[
                                        {
                                            key: "building_drawing",
                                            title: "Building Drawings",
                                        },
                                        {
                                            key: "management_contract",
                                            title: "Management Contract",
                                        },
                                        {
                                            key: "tenancy_lease_contract",
                                            title: "Tenancy Lease Contract",
                                        },
                                        {
                                            key: "title_deed",
                                            title: "Title Deed",
                                        },
                                        {
                                            key: "affection_plan",
                                            title: "Affection Plan",
                                        },
                                        {
                                            key: "poa_noc",
                                            title: "POA/NOC",
                                        },
                                        {
                                            key: "handover_documents",
                                            title: "Handover Documents",
                                        },
                                        {
                                            key: "other_documents",
                                            title: "Other Documents",
                                        },
                                    ].map(({ key, title }) => (
                                        <div
                                            key={key}
                                            className={styles.docSection}
                                        >
                                            <h3>
                                                <span
                                                    className={styles.docIcon}
                                                >
                                                    {getDocumentIcon(key)}
                                                </span>
                                                {title}
                                            </h3>
                                            <div
                                                className={styles.documentsList}
                                            >
                                                {building?.[key] &&
                                                building[key].length > 0 ? (
                                                    building[key].map(
                                                        (doc, index) => (
                                                            <div
                                                                key={index}
                                                                className={
                                                                    styles.documentItem
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        styles.documentInfo
                                                                    }
                                                                >
                                                                    <FileText
                                                                        size={
                                                                            20
                                                                        }
                                                                        className={
                                                                            styles.docIcon
                                                                        }
                                                                    />
                                                                    <span>
                                                                        {title}{" "}
                                                                        {index +
                                                                            1}
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles.documentActions
                                                                    }
                                                                >
                                                                    <a
                                                                        href={
                                                                            doc
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={
                                                                            styles.viewButton
                                                                        }
                                                                    >
                                                                        <Eye
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                        View
                                                                    </a>
                                                                    <a
                                                                        href={
                                                                            doc
                                                                        }
                                                                        download
                                                                        className={
                                                                            styles.downloadButton
                                                                        }
                                                                    >
                                                                        <Download
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                        Download
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <p
                                                        className={
                                                            styles.emptyMessage
                                                        }
                                                    >
                                                        No {title.toLowerCase()}{" "}
                                                        available
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Contacts Tab */}
                            {activeTab === "contacts" && (
                                <div className={styles.detailsSection}>
                                    <h2 className={styles.sectionTitle}>
                                        Contact Information
                                    </h2>

                                    <div className={styles.contactSection}>
                                        <h3>Watchman Information</h3>
                                        <div className={styles.contactCard}>
                                            <div
                                                className={styles.contactAvatar}
                                            >
                                                <span>👤</span>
                                            </div>
                                            <div
                                                className={
                                                    styles.contactDetails
                                                }
                                            >
                                                <p
                                                    className={
                                                        styles.contactName
                                                    }
                                                >
                                                    {watchmanInfo.name ||
                                                        "No Name Available"}
                                                </p>
                                                <p
                                                    className={
                                                        styles.contactEmail
                                                    }
                                                >
                                                    {watchmanInfo.email ||
                                                        "No Email Available"}
                                                </p>
                                                <p
                                                    className={
                                                        styles.contactPhone
                                                    }
                                                >
                                                    {watchmanInfo.contact_no ||
                                                        "No Contact Number Available"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.contactSection}>
                                        <h3>Created By</h3>
                                        <div className={styles.contactCard}>
                                            <div
                                                className={styles.contactAvatar}
                                            >
                                                <span>👤</span>
                                            </div>
                                            <div
                                                className={
                                                    styles.contactDetails
                                                }
                                            >
                                                <p
                                                    className={
                                                        styles.contactName
                                                    }
                                                >
                                                    {creatorInfo.name}
                                                </p>
                                                <p
                                                    className={
                                                        styles.contactEmail
                                                    }
                                                >
                                                    {creatorInfo.email}
                                                </p>
                                                <p
                                                    className={
                                                        styles.contactPhone
                                                    }
                                                >
                                                    {creatorInfo.phone}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Properties Tab */}
                            {activeTab === "properties" && (
                                <div className={styles.detailsSection}>
                                    <h2 className={styles.sectionTitle}>
                                        Associated Properties
                                    </h2>
                                    {building?.properties &&
                                    building.properties.length > 0 ? (
                                        <div className={styles.propertiesGrid}>
                                            {building.properties.map(
                                                (property) => (
                                                    <div
                                                        key={property.id}
                                                        className={
                                                            styles.propertyCard
                                                        }
                                                        onClick={() => {
                                                            const baseUrl =
                                                                property.listingType.toLowerCase() ===
                                                                "sell"
                                                                    ? "/for-sell/new-list/"
                                                                    : "/for-rent/new-list/";
                                                            navigate(
                                                                `${baseUrl}${property.id}`
                                                            );
                                                        }}
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <div
                                                            className={
                                                                styles.propertyHeader
                                                            }
                                                        >
                                                            <h3
                                                                className={
                                                                    styles.propertyTitle
                                                                }
                                                            >
                                                                {property.title}
                                                            </h3>
                                                            <div className={styles.propertyStatusContainer}>
                                                                <span
                                                                    className={`${styles.listingType} ${styles[property.listingType?.toLowerCase() || 'draft']}`}
                                                                >
                                                                    {property.listingType || 'N/A'}
                                                                </span>
                                                                <span
                                                                    className={`${styles.propertyStatus} ${styles[property.status?.toLowerCase() || 'draft']}`}
                                                                >
                                                                    {property.status || 'DRAFT'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.propertyDetails
                                                            }
                                                        >
                                                            <p
                                                                className={
                                                                    styles.propertyId
                                                                }
                                                            >
                                                                Unit Number :{" "}
                                                                {property?.houseNo ||
                                                                    "N/A"}
                                                            </p>
                                                            <p
                                                                className={
                                                                    styles.propertyId
                                                                }
                                                            >
                                                                ID:{" "}
                                                                {
                                                                    property.propertyId
                                                                }
                                                            </p>
                                                            <p
                                                                className={
                                                                    styles.propertyId
                                                                }
                                                            >
                                                                Internal ID:{" "}
                                                                {property.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className={styles.noProperties}>
                                            No properties associated with this
                                            building.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Add Cheque Payments Section */}
                            {
                                activeTab === "cheque_payments" && 
                                 <div className={styles.paymentsCard}>
                                <div className={styles.paymentsHeader}>
                                    <div>
                                        <h3>
                                            <CreditCard className={styles.iconWrapper} size={16} />
                                            Cheque Payments
                                        </h3>
                                        <p className={styles.subtitle}>
                                            Manage payment schedule and details
                                        </p>
                                    </div>
                                    <button
                                        className={styles.addPaymentButton}
                                        onClick={() => setShowAddPayment(true)}
                                    >
                                        <PlusCircle size={18} />
                                        Add Payment
                                    </button>
                                </div>

                                {showAddPayment && (
                                    <div className={styles.addPaymentForm}>
                                        <div className={styles.formHeader}>
                                            <h4>Add New Payment</h4>
                                            <button
                                                className={styles.closeButton}
                                                onClick={() => setShowAddPayment(false)}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                        <div className={styles.formGrid}>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="due_date">Due Date*</label>
                                                <input
                                                    type="date"
                                                    id="due_date"
                                                    name="due_date"
                                                    value={newPayment.due_date}
                                                    onChange={handlePaymentChange}
                                                    required
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="amount">Amount (AED)*</label>
                                                <input
                                                    type="number"
                                                    id="amount"
                                                    name="amount"
                                                    value={newPayment.amount}
                                                    onChange={handlePaymentChange}
                                                    required
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="payment_method">Payment Method</label>
                                                <select
                                                    id="payment_method"
                                                    name="payment_method"
                                                    value={newPayment.payment_method}
                                                    onChange={handlePaymentChange}
                                                >
                                                    <option value="cheque">Cheque</option>
                                                    <option value="cash">Cash</option>
                                                    <option value="bank_deposit">Bank Deposit</option>
                                                    <option value="credit_card">Credit Card</option>
                                                    <option value="bank_transfer">Bank Transfer</option>
                                                </select>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="payment_status">Payment Status</label>
                                                <select
                                                    id="payment_status"
                                                    name="payment_status"
                                                    value={newPayment.payment_status}
                                                    onChange={handlePaymentChange}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                </select>
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="reference_number">Reference Number</label>
                                                <input
                                                    type="text"
                                                    id="reference_number"
                                                    name="reference_number"
                                                    value={newPayment.reference_number}
                                                    onChange={handlePaymentChange}
                                                    placeholder="Cheque number, transaction ID, etc."
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label htmlFor="receipt_upload">Receipt</label>
                                                <div className={styles.uploadContainer}>
                                                    <input
                                                        type="file"
                                                        id="receipt_upload"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                upload(file, {
                                                                    onSuccess: (data) => {
                                                                        setNewPayment((prev) => ({
                                                                            ...prev,
                                                                            receipt_image: data.url,
                                                                        }));
                                                                    },
                                                                });
                                                            }
                                                        }}
                                                        className={styles.fileInput}
                                                        disabled={isUploading}
                                                    />
                                                    <label
                                                        htmlFor="receipt_upload"
                                                        className={`${styles.uploadButton} ${isUploading ? styles.uploading : ""}`}
                                                    >
                                                        <div className={styles.uploadContent}>
                                                            <div className={styles.uploadIcon}>
                                                                <Upload size={18} />
                                                            </div>
                                                            <span className={styles.uploadText}>
                                                                {isUploading ? (
                                                                    <>
                                                                        <span className={styles.uploadingText}>
                                                                            Uploading...
                                                                        </span>
                                                                        <div className={styles.uploadProgress}>
                                                                            <div className={styles.progressBar}></div>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <span>Upload Receipt</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </label>
                                                </div>
                                                {newPayment.receipt_image && (
                                                    <div className={styles.receiptPreview}>
                                                        <img
                                                            src={newPayment.receipt_image}
                                                            alt="Receipt preview"
                                                            className={styles.receiptImage}
                                                        />
                                                        <button
                                                            className={styles.deleteReceiptButton}
                                                            onClick={() =>
                                                                setNewPayment((prev) => ({
                                                                    ...prev,
                                                                    receipt_image: "",
                                                                }))
                                                            }
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.formActions}>
                                            <button
                                                className={styles.cancelButton}
                                                onClick={() => setShowAddPayment(false)}
                                                disabled={isUpdating}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className={styles.saveButton}
                                                onClick={handleAddPayment}
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? "Saving..." : "Save Payment"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {building?.cheque_payments && building.cheque_payments.length > 0 ? (
                                    <div
                                        ref={paymentsTableRef}
                                        onScroll={handleTableScroll}
                                        className={`${styles.paymentsTable} ${isTableScrolledRight ? styles.scrolledRight : ""}`}
                                    >
                                        <div className={styles.tableHeader}>
                                            <div className={styles.tableCell}>Due Date</div>
                                            <div className={styles.tableCell}>Amount</div>
                                            <div className={styles.tableCell}>Method</div>
                                            <div className={styles.tableCell}>Status</div>
                                            <div className={styles.tableCell}>Reference</div>
                                            <div className={styles.tableCell}>Receipt</div>
                                            <div className={styles.tableCell}>Actions</div>
                                        </div>
                                        {building.cheque_payments.map((payment, index) => (
                                            <div
                                                key={index}
                                                className={`${styles.tableRow} ${editingPaymentIndex === index ? styles.editMode : ""}`}
                                            >
                                                {editingPaymentIndex === index ? (
                                                    // Edit mode - show form fields
                                                    <>
                                                        <div className={styles.tableCell}>
                                                            <input
                                                                type="date"
                                                                name="due_date"
                                                                value={editedPayment.due_date}
                                                                onChange={handleEditPaymentChange}
                                                                className={styles.editInput}
                                                            />
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            <input
                                                                type="number"
                                                                name="amount"
                                                                value={editedPayment.amount}
                                                                onChange={handleEditPaymentChange}
                                                                className={styles.editInput}
                                                            />
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            <select
                                                                name="payment_method"
                                                                value={editedPayment.payment_method}
                                                                onChange={handleEditPaymentChange}
                                                                className={styles.editSelect}
                                                            >
                                                                <option value="cheque">Cheque</option>
                                                                <option value="cash">Cash</option>
                                                                <option value="bank_deposit">Bank Deposit</option>
                                                                <option value="credit_card">Credit Card</option>
                                                                <option value="bank_transfer">Bank Transfer</option>
                                                            </select>
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            <select
                                                                name="payment_status"
                                                                value={editedPayment.payment_status === "done" ? "paid" : "pending"}
                                                                onChange={handleEditPaymentChange}
                                                                className={styles.editSelect}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="paid">Paid</option>
                                                            </select>
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            <input
                                                                type="text"
                                                                name="reference_number"
                                                                value={editedPayment.reference_number}
                                                                onChange={handleEditPaymentChange}
                                                                placeholder="Reference number"
                                                                className={styles.editInput}
                                                            />
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            <div className={styles.uploadContainer}>
                                                                <input
                                                                    type="file"
                                                                    id={`receipt_upload_${index}`}
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            upload(file, {
                                                                                onSuccess: (data) => {
                                                                                    setEditedPayment((prev) => ({
                                                                                        ...prev,
                                                                                        receipt_image: data.url,
                                                                                    }));
                                                                                },
                                                                            });
                                                                        }
                                                                    }}
                                                                    className={styles.fileInput}
                                                                    disabled={isUploading}
                                                                />
                                                                <label
                                                                    htmlFor={`receipt_upload_${index}`}
                                                                    className={`${styles.uploadButton} ${isUploading ? styles.uploading : ""}`}
                                                                >
                                                                    <div className={styles.uploadContent}>
                                                                        <div className={styles.uploadIcon}>
                                                                            <Upload size={18} />
                                                                        </div>
                                                                        <span className={styles.uploadText}>
                                                                            {isUploading ? (
                                                                                <>
                                                                                    <span className={styles.uploadingText}>
                                                                                        Uploading...
                                                                                    </span>
                                                                                    <div className={styles.uploadProgress}>
                                                                                        <div className={styles.progressBar}></div>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <span>Upload Receipt</span>
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                            {editedPayment.receipt_image && (
                                                                <div className={styles.receiptPreview}>
                                                                    <img
                                                                        src={editedPayment.receipt_image}
                                                                        alt="Receipt preview"
                                                                        className={styles.receiptImage}
                                                                    />
                                                                    <button
                                                                        className={styles.deleteReceiptButton}
                                                                        onClick={() =>
                                                                            setEditedPayment((prev) => ({
                                                                                ...prev,
                                                                                receipt_image: "",
                                                                            }))
                                                                        }
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            <div className={styles.actionButtons}>
                                                                <button
                                                                    className={styles.saveButton}
                                                                    onClick={handleSavePayment}
                                                                    disabled={isUpdating}
                                                                    title="Save changes"
                                                                >
                                                                    <Save size={16} />
                                                                </button>
                                                                <button
                                                                    className={styles.cancelButton}
                                                                    onClick={handleCancelEdit}
                                                                    title="Cancel editing"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    // View mode - show payment data
                                                    <>
                                                        <div className={styles.tableCell}>
                                                            {new Date(payment.due_date).toLocaleDateString()}
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            {formatCurrency(payment.amount)}
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            {displayPaymentMethod(payment.payment_method)}
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            <span
                                                                className={`${styles.statusBadge} ${getStatusBadgeClass(payment.payment_status)}`}
                                                            >
                                                                {displayPaymentStatus(payment.payment_status)}
                                                            </span>
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            {payment.reference_number || "N/A"}
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            {payment.receipt_image ? (
                                                                <div className={styles.receiptPreview}>
                                                                    <img
                                                                        src={payment.receipt_image}
                                                                        alt="Receipt"
                                                                        className={styles.receiptImage}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                "No receipt"
                                                            )}
                                                        </div>
                                                        <div className={styles.tableCell}>
                                                            <div className={styles.actionButtons}>
                                                                <button
                                                                    className={styles.editPaymentButton}
                                                                    onClick={() => handleEditPayment(payment, index)}
                                                                    title="Edit payment"
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button
                                                                    className={styles.deletePaymentButton}
                                                                    onClick={() => handleDeletePayment(index)}
                                                                    title="Delete payment"
                                                                    disabled={isUpdating}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyPayments}>
                                        <CreditCard size={48} />
                                        <p>No payments added yet</p>
                                        <p className={styles.emptySubtitle}>
                                            Add payment details to get started
                                        </p>
                                    </div>
                                )}
                            </div>
                            }
                           
                        </div>

                        {showDeleteModal && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalContent}>
                                    <div className={styles.modalHeader}>
                                        <AlertTriangle
                                            className={styles.warningIcon}
                                        />
                                        <h2 className={styles.modalTitle}>
                                            Confirm Delete
                                        </h2>
                                    </div>
                                    <p className={styles.modalMessage}>
                                        Are you sure you want to delete this
                                        building? This action cannot be undone.
                                    </p>
                                    <div className={styles.modalActions}>
                                        <button
                                            onClick={handleCancelDelete}
                                            className={styles.cancelButton}
                                            disabled={isDeleting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmDelete}
                                            className={styles.deleteButton}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <Loader2
                                                        size={16}
                                                        className={
                                                            styles.spinner
                                                        }
                                                    />
                                                    Deleting...
                                                </>
                                            ) : (
                                                "Delete"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showPropertyModal && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalContent}>
                                    <div className={styles.modalHeader}>
                                        <Building
                                            className={styles.buildingIcon}
                                        />
                                        <h2 className={styles.modalTitle}>
                                            Select Property
                                        </h2>
                                    </div>
                                    <div className={styles.modalBody}>
                                        <FormInputDataList
                                            control={control}
                                            data={propertyOptions}
                                            isDisabled={isPropertiesLoading}
                                            isLoading={isPropertiesLoading}
                                            registerName={"property_id"}
                                            label={"Property"}
                                            isMulti={true}
                                        />
                                        {selectedProperties.length > 0 && (
                                            <div
                                                className={
                                                    styles.selectedPropertiesContainer
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.badgeContainer
                                                    }
                                                >
                                                    {selectedProperties.map(
                                                        (property) => (
                                                            <span
                                                                key={
                                                                    property.value
                                                                }
                                                                className={
                                                                    styles.propertyBadge
                                                                }
                                                            >
                                                                {property.label}
                                                                <button
                                                                    className={
                                                                        styles.badgeRemove
                                                                    }
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        const filteredProperties =
                                                                            selectedProperties.filter(
                                                                                (
                                                                                    p
                                                                                ) =>
                                                                                    p.value !==
                                                                                    property.value
                                                                            );
                                                                        reset({
                                                                            ...watch(),
                                                                            property_id:
                                                                                filteredProperties,
                                                                        });
                                                                    }}
                                                                >
                                                                    ×
                                                                </button>
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.modalActions}>
                                        <button
                                            onClick={() =>
                                                setShowPropertyModal(false)
                                            }
                                            className={styles.cancelButton}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmit(() => {
                                                selectedProperties.map(
                                                    (item) => {
                                                        changeProperty(
                                                            {
                                                                id: item?.value,
                                                                updatedProperty:
                                                                    {
                                                                        building_id:
                                                                            id,
                                                                    },
                                                            },
                                                            {
                                                                onSuccess:
                                                                    () => {
                                                                        reset();
                                                                        setShowPropertyModal(
                                                                            false
                                                                        );
                                                                    },
                                                            }
                                                        );
                                                    }
                                                );
                                            })}
                                            disabled={isPending}
                                            className={styles.submitButton}
                                        >
                                            {isPending ? (
                                                <>
                                                    <Loader2
                                                        size={16}
                                                        className={
                                                            styles.spinner
                                                        }
                                                    />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Submit"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </Modal>
        </div>
    );
};

export default BuildingDetail;
