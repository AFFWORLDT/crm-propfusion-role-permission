import { useParams, useNavigate } from "react-router-dom";
import SectionTop from "../../ui/SectionTop";
import useGetRentalAgreementById from "../../features/rental-agreement/useGetRentalAgreementById";
import Spinner from "../../ui/Spinner";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import styles from "./RentalAgreementDetails.module.css";
import {
    Building2,
    User,
    DollarSign,
    Calendar,
    UserCircle,
    FileText,
    FileCheck,
    Clock,
    AlertCircle,
    Upload,
    FileImage,
    Trash2,
    Printer,
    Edit,
    PlusCircle,
    CreditCard,
    X,
    Save,
} from "lucide-react";
import { useUploadRentalAgreementDocs } from "../../features/rental-agreement/useUploadRentalAgreementDocs";
import { useDeleteRentalAgreementDocs } from "../../features/rental-agreement/useDeleteRentalAgreementDocs";
import { useUpdateRentalAgreement } from "../../features/rental-agreement/useUpdateRentalAgreement";
import { useChequePayments } from "../../features/rental-agreement/useChequePayments";
// import AddRentalAgreeMent from "../../features/rental-agreement/AddRentalAgreeMent";
import EditRentalAgreeMent from "../../features/rental-agreement/EditRentalAgreeMent";
import { useUploadReceipt } from "../../features/rental-agreement/useUploadReceipt";

function RentalAgreementDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { rentalAgreement, isLoading, error } = useGetRentalAgreementById(id);
    const { uploadDocs, isPending } = useUploadRentalAgreementDocs();
    const { deleteDocs, isPending: isDeleting } =
        useDeleteRentalAgreementDocs();
    const { updateStatus, isPending: isUpdatingStatus } =
        useUpdateRentalAgreement();
    const { upload, isUploading } = useUploadReceipt(
        "upload-rental-agreement-payment-receipt"
    );

    const {
        addChequePayment,
        deleteChequePayment,
        updateChequePayments,
        isAddingPayment,
        isDeletingPayment,
        isUpdatingPayments,
    } = useChequePayments();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);

    // State for cheque payments
    const [chequePayments, setChequePayments] = useState([]);
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [newPayment, setNewPayment] = useState({
        due_date: "",
        amount: "",
        payment_method: "cheque",
        payment_status: "pending",
        reference_number: "",
        receipt_image: "",
    });

    // State for editing payments
    const [editingPaymentIndex, setEditingPaymentIndex] = useState(null);
    const [editedPayment, setEditedPayment] = useState(null);

    // State for scroll detection
    const [isTableScrolledRight, setIsTableScrolledRight] = useState(false);
    const paymentsTableRef = useRef(null);

    // Format currency for AED
    const formatCurrency = (amount) => {
        return `AED ${Number(amount).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    // Initialize cheque payments from rental agreement data
    useEffect(() => {
        if (rentalAgreement?.cheque_payments) {
            setChequePayments(rentalAgreement.cheque_payments);
        }
    }, [rentalAgreement]);

    if (isLoading)
        return (
            <div className={styles.loaderContainer}>
                <Spinner type={"fullPage"} />
            </div>
        );

    if (error)
        return (
            <div className={styles.error}>
                <AlertCircle className={styles.errorIcon} />
                {error.message}
            </div>
        );

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            uploadDocs({ rentalAgreementId: id, files });
        }
    };

    const getFileType = (url) => {
        if (!url) return { isImage: false, isPDF: false };
        const extension = url.split(".").pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png", "gif"].includes(extension);
        const isPDF = extension === "pdf";
        return { isImage, isPDF };
    };

    const handleDeleteClick = (docUrl) => {
        setDocumentToDelete(docUrl);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (documentToDelete) {
            deleteDocs({
                rentalAgreementId: id,
                documentUrl: documentToDelete,
            });
            setShowDeleteModal(false);
            setDocumentToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDocumentToDelete(null);
    };

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        updateStatus({ id, payload: { status: newStatus } });
    };

    const handlePrint = () => {
        alert("Print functionality will be implemented here");
        // window.print() functionality can be added here
    };

    // Handle adding a new payment
    const handleAddPayment = () => {
        if (!newPayment.due_date || !newPayment.amount) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Create a valid payment object with ISO date format
        const paymentToAdd = {
            ...newPayment,
            // Ensure date is properly formatted as ISO string
            due_date: new Date(newPayment.due_date).toISOString(),
            amount: Number(newPayment.amount),
            // Ensure payment_status is a valid enum value
            payment_status:
                newPayment.payment_status === "paid" ? "done" : "pending",
        };

        const updatedPayments = [...chequePayments, paymentToAdd];

        // Update local state
        setChequePayments(updatedPayments);

        // Send to backend
        addChequePayment({
            rentalAgreementId: id,
            chequePayments: updatedPayments,
        });

        // Reset form
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
        const updatedPayments = chequePayments.filter((_, i) => i !== index);

        // Update local state
        setChequePayments(updatedPayments);

        // Send to backend
        deleteChequePayment({
            rentalAgreementId: id,
            chequePayments: updatedPayments,
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
            // Convert ISO date string to YYYY-MM-DD for input field
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

        // Format the payment data
        const updatedPayment = {
            ...editedPayment,
            due_date: new Date(editedPayment.due_date).toISOString(),
            amount: Number(editedPayment.amount),
            payment_status: editedPayment.payment_status === "paid" ? "done" : "pending",
        };

        // Create a new array with the updated payment
        const updatedPayments = chequePayments.map((payment, index) => 
            index === editingPaymentIndex ? updatedPayment : payment
        );

        // Update state and backend
        setChequePayments(updatedPayments);
        updateChequePayments({
            rentalAgreementId: id,
            chequePayments: updatedPayments,
        });

        // Reset editing state
        setEditingPaymentIndex(null);
        setEditedPayment(null);
    };

    // Handle scroll event for payments table
    const handleTableScroll = (e) => {
        if (!paymentsTableRef.current) return;

        const table = paymentsTableRef.current;
        const isScrolledToEnd =
            table.scrollLeft + table.clientWidth >= table.scrollWidth - 10;

        setIsTableScrolledRight(isScrolledToEnd);
    };

    const handleBuildingClick = (buildingId) => {
        if (buildingId) {
            navigate(`/new-building/list/${buildingId}`);
        }
    };

    const handleTenantClick = (tenantId) => {
        if (tenantId) {
            navigate(`/for-tenants/details/${tenantId}`);
        }
    };

    const handlePropertyClick = (propertyId) => {
        if (propertyId) {
            navigate(`/for-rent/new-list/${propertyId}`);
        }
    };

    return (
        <div className={"sectionContainer"}>
            <SectionTop heading="Rental Agreement Details" />
            <section className={"sectionStyles"}>
                <div className={styles.header}>
                    <div>
                        <h1>
                            Rental Agreement #{id} - Unit Number #
                            {rentalAgreement?.property?.house_no} -
                            {rentalAgreement?.property?.building?.building_name}
                        </h1>
                        <div className={styles.metaInfo}>
                            <p className={styles.subtitle}>
                                <Clock
                                    className={styles.iconWrapper}
                                    size={16}
                                />
                                Created on{" "}
                                {new Date(
                                    rentalAgreement?.created_at
                                ).toLocaleDateString()}
                            </p>
                            <p className={styles.subtitle}>
                                <Clock
                                    className={styles.iconWrapper}
                                    size={16}
                                />
                                Last updated:{" "}
                                {new Date(
                                    rentalAgreement?.updated_at
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className={styles.actionsContainer}>
                        <button
                            className={styles.actionButton}
                            onClick={handlePrint}
                            title="Print agreement"
                        >
                            <Printer size={20} />
                        </button>
                        <EditRentalAgreeMent defaultValues={rentalAgreement}>
                            <button
                                className={styles.actionButton}
                                title="Edit agreement"
                            >
                                <Edit size={20} />
                            </button>
                        </EditRentalAgreeMent>
                        <div className={styles.statusContainer}>
                            <select
                                value={rentalAgreement?.status}
                                onChange={handleStatusChange}
                                disabled={isUpdatingStatus}
                                className={`${styles.statusSelect} ${styles[rentalAgreement?.status?.toLowerCase()]}`}
                            >
                                <option value="DRAFT">DRAFT</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.agreementInfo}>
                    <div className={styles.propertyCard}>
                        <div className={styles.propertyHeader}>
                            <div>
                                <h3>
                                    <Building2
                                        className={styles.iconWrapper}
                                        size={16}
                                    />
                                    Property Details
                                </h3>
                                <p>{rentalAgreement?.property?.location}</p>
                            </div>
                        </div>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>
                                    Property ID
                                </span>
                                <span
                                    className={`${styles.infoValue} ${styles.clickable}`}
                                    onClick={() =>
                                        handlePropertyClick(
                                            rentalAgreement?.property?.id
                                        )
                                    }
                                    style={{
                                        cursor: "pointer",
                                        color: "#2563eb",
                                    }}
                                >
                                    {rentalAgreement?.property_id}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>
                                    Property Title
                                </span>
                                <span
                                    className={`${styles.infoValue} ${styles.clickable}`}
                                    onClick={() =>
                                        handlePropertyClick(
                                            rentalAgreement?.property?.id
                                        )
                                    }
                                    style={{
                                        cursor: "pointer",
                                        color: "#2563eb",
                                    }}
                                >
                                    {rentalAgreement?.property?.title}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>
                                    Property Type
                                </span>
                                <span className={styles.infoValue}>
                                    {rentalAgreement?.property?.property_type}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>
                                    Building Name
                                </span>
                                <span
                                    className={`${styles.infoValue} ${styles.clickable}`}
                                    onClick={() =>
                                        handleBuildingClick(
                                            rentalAgreement?.property?.building
                                                ?.id
                                        )
                                    }
                                    style={{
                                        cursor: "pointer",
                                        color: "#2563eb",
                                    }}
                                >
                                    {rentalAgreement?.property?.building
                                        ?.building_name || "N/A"}
                                </span>
                            </div>

                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>
                                    Unit Number
                                </span>
                                <span
                                    className={`${styles.infoValue} ${styles.clickable}`}
                                    onClick={() =>
                                        handlePropertyClick(
                                            rentalAgreement?.property?.id
                                        )
                                    }
                                    style={{
                                        cursor: "pointer",
                                        color: "#2563eb",
                                    }}
                                >
                                    {rentalAgreement?.property?.house_no ||
                                        "N/A"}
                                </span>
                            </div>
                            {/* <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>
                                    Building Number
                                </span>
                                <span className={styles.infoValue}>
                                    {rentalAgreement?.property?.building
                                        ?.building_no || "N/A"}
                                </span>
                            </div> */}
                        </div>
                    </div>

                    <div className={styles.tenantCard}>
                        <div className={styles.tenantHeader}>
                            {rentalAgreement?.tenant?.profile_pic ? (
                                <img
                                    src={rentalAgreement?.tenant?.profile_pic}
                                    alt={rentalAgreement?.tenant?.name}
                                    className={styles.tenantAvatar}
                                />
                            ) : (
                                <div className={styles.tenantAvatar}>
                                    {rentalAgreement?.tenant?.name?.[0]?.toUpperCase()}
                                </div>
                            )}
                            <div className={styles.tenantInfo}>
                                <h3
                                    className={`${styles.clickable}`}
                                    onClick={() =>
                                        handleTenantClick(
                                            rentalAgreement?.tenant?.id
                                        )
                                    }
                                    style={{
                                        cursor: "pointer",
                                        color: "#2563eb",
                                    }}
                                >
                                    <User
                                        className={styles.iconWrapper}
                                        size={16}
                                    />
                                    {rentalAgreement?.tenant?.name}
                                </h3>
                                <p>{rentalAgreement?.tenant?.email}</p>
                            </div>
                        </div>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>
                                    Tenant ID
                                </span>
                                <span
                                    className={`${styles.infoValue} ${styles.clickable}`}
                                    onClick={() =>
                                        handleTenantClick(
                                            rentalAgreement?.tenant?.id
                                        )
                                    }
                                    style={{
                                        cursor: "pointer",
                                        color: "#2563eb",
                                    }}
                                >
                                    {rentalAgreement?.tenant_id}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Phone</span>
                                <span className={styles.infoValue}>
                                    {rentalAgreement?.tenant?.phone || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <h3>
                            <DollarSign
                                className={styles.iconWrapper}
                                size={16}
                            />
                            Financial Details
                        </h3>
                        <div className={styles.financialDetails}>
                            <div className={styles.financialItem}>
                                <span className={styles.financialLabel}>
                                    Rent Amount
                                </span>
                                <span className={styles.financialValue}>
                                    {formatCurrency(
                                        rentalAgreement?.rent_amount
                                    )}
                                </span>
                            </div>
                            <div className={styles.financialItem}>
                                <span className={styles.financialLabel}>
                                    Security Deposit
                                </span>
                                <span className={styles.financialValue}>
                                    {formatCurrency(
                                        rentalAgreement?.security_deposit
                                    )}
                                </span>
                            </div>
                            <div className={styles.financialItem}>
                                <span className={styles.financialLabel}>
                                    Payment Frequency
                                </span>
                                <span className={styles.financialValue}>
                                    {rentalAgreement?.payment_frequency}
                                </span>
                            </div>
                            <div className={styles.financialItem}>
                                <span className={styles.financialLabel}>
                                    Number of Cheques
                                </span>
                                <span className={styles.financialValue}>
                                    {rentalAgreement?.number_of_cheques}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <h3>
                            <Calendar
                                className={styles.iconWrapper}
                                size={16}
                            />
                            Agreement Period
                        </h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>
                                    Start Date
                                </span>
                                <span className={styles.infoValue}>
                                    {new Date(
                                        rentalAgreement?.start_date
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>
                                    End Date
                                </span>
                                <span className={styles.infoValue}>
                                    {new Date(
                                        rentalAgreement?.end_date
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.agentCard}>
                        <div className={styles.agentHeader}>
                            <img
                                src={rentalAgreement?.agent?.avatar}
                                alt={rentalAgreement?.agent?.name}
                                className={styles.agentAvatar}
                            />
                            <div className={styles.agentInfo}>
                                <h3>
                                    <UserCircle
                                        className={styles.iconWrapper}
                                        size={16}
                                    />
                                    {rentalAgreement?.agent?.name}
                                </h3>
                                <p>{rentalAgreement?.agent?.email}</p>
                            </div>
                        </div>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>
                                    Agent ID
                                </span>
                                <span className={styles.infoValue}>
                                    {rentalAgreement?.agent?.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.termsCard}>
                        <h3>
                            <FileText
                                className={styles.iconWrapper}
                                size={16}
                            />
                            Terms and Conditions
                        </h3>
                        <div className={styles.termsContent}>
                            {rentalAgreement?.terms_and_conditions ||
                                "No terms and conditions specified"}
                        </div>
                    </div>
                </div>

                {/* Cheque Payments Section */}
                <div
                    className={styles.paymentsCard}
                    style={{ marginTop: "20px" }}
                >
                    <div className={styles.paymentsHeader}>
                        <div>
                            <h3>
                                <CreditCard
                                    className={styles.iconWrapper}
                                    size={16}
                                />
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
                                    <label htmlFor="amount">
                                        Amount (AED)*
                                    </label>
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
                                    <label htmlFor="payment_method">
                                        Payment Method
                                    </label>
                                    <select
                                        id="payment_method"
                                        name="payment_method"
                                        value={newPayment.payment_method}
                                        onChange={handlePaymentChange}
                                    >
                                        <option value="cheque">Cheque</option>
                                        <option value="cash">Cash</option>
                                        <option value="bank_deposit">
                                            Bank Deposit
                                        </option>
                                        <option value="credit_card">
                                            Credit Card
                                        </option>
                                        <option value="bank_transfer">
                                            Bank Transfer
                                        </option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="payment_status">
                                        Payment Status
                                    </label>
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
                                    <label htmlFor="reference_number">
                                        Reference Number
                                    </label>
                                    <input
                                        type="text"
                                        id="reference_number"
                                        name="reference_number"
                                        value={newPayment.reference_number}
                                        onChange={handlePaymentChange}
                                        placeholder="Cheque number, transaction ID, etc."
                                    />
                                </div>
                                { (
                                    <div className={styles.formGroup}>
                                        <label htmlFor="receipt_upload">
                                            Receipt
                                        </label>
                                        <div className={styles.uploadContainer}>
                                            <input
                                                type="file"
                                                id="receipt_upload"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files[0];
                                                    if (file) {
                                                        try {
                                                            const [url] =
                                                                upload(file, {
                                                                    onSuccess: (
                                                                        data
                                                                    ) => {
                                                                        
                                                                        setNewPayment(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                receipt_image:
                                                                                    data.url,
                                                                            })
                                                                        );
                                                                    },
                                                                });
                                                            setNewPayment(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    receipt_image:
                                                                        url,
                                                                })
                                                            );
                                                        } catch (error) {
                                                            console.log(error);
                                                        }
                                                    }
                                                }}
                                                className={styles.fileInput}
                                                disabled={isUploading}
                                            />
                                            <label
                                                htmlFor="receipt_upload"
                                                className={`${styles.uploadButton} ${isUploading ? styles.uploading : ""}`}
                                            >
                                                <div
                                                    className={
                                                        styles.uploadContent
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.uploadIcon
                                                        }
                                                    >
                                                        <Upload size={18} />
                                                    </div>
                                                    <span
                                                        className={
                                                            styles.uploadText
                                                        }
                                                    >
                                                        {isUploading ? (
                                                            <>
                                                                <span
                                                                    className={
                                                                        styles.uploadingText
                                                                    }
                                                                >
                                                                    Uploading...
                                                                </span>
                                                                <div
                                                                    className={
                                                                        styles.uploadProgress
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            styles.progressBar
                                                                        }
                                                                    ></div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>
                                                                    Upload
                                                                    Receipt
                                                                </span>
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                        {newPayment.receipt_image && (
                                            <div
                                                className={
                                                    styles.receiptPreview
                                                }
                                            >
                                                <img
                                                    src={
                                                        newPayment.receipt_image
                                                    }
                                                    alt="Receipt preview"
                                                    className={
                                                        styles.receiptImage
                                                    }
                                                />
                                                <button
                                                    className={
                                                        styles.deleteReceiptButton
                                                    }
                                                    onClick={() =>
                                                        setNewPayment(
                                                            (prev) => ({
                                                                ...prev,
                                                                receipt_image:
                                                                    "",
                                                            })
                                                        )
                                                    }
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className={styles.formActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => setShowAddPayment(false)}
                                    disabled={isAddingPayment}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.saveButton}
                                    onClick={handleAddPayment}
                                    disabled={isAddingPayment}
                                >
                                    {isAddingPayment
                                        ? "Saving..."
                                        : "Save Payment"}
                                </button>
                            </div>
                        </div>
                    )}

                    {chequePayments && chequePayments.length > 0 ? (
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
                                <div className={styles.tableCell}>
                                    Reference
                                </div>
                                <div className={styles.tableCell}>Receipt</div>
                                <div className={styles.tableCell}>Actions</div>
                            </div>
                            {chequePayments.map((payment, index) => (
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
                                                    value={
                                                        editedPayment.due_date
                                                    }
                                                    onChange={
                                                        handleEditPaymentChange
                                                    }
                                                    className={styles.editInput}
                                                />
                                            </div>
                                            <div className={styles.tableCell}>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={editedPayment.amount}
                                                    onChange={
                                                        handleEditPaymentChange
                                                    }
                                                    className={styles.editInput}
                                                />
                                            </div>
                                            <div className={styles.tableCell}>
                                                <select
                                                    name="payment_method"
                                                    value={
                                                        editedPayment.payment_method
                                                    }
                                                    onChange={
                                                        handleEditPaymentChange
                                                    }
                                                    className={
                                                        styles.editSelect
                                                    }
                                                >
                                                    <option value="cheque">
                                                        Cheque
                                                    </option>
                                                    <option value="cash">
                                                        Cash
                                                    </option>
                                                    <option value="bank_deposit">
                                                        Bank Deposit
                                                    </option>
                                                    <option value="credit_card">
                                                        Credit Card
                                                    </option>
                                                    <option value="bank_transfer">
                                                        Bank Transfer
                                                    </option>
                                                </select>
                                            </div>
                                            <div className={styles.tableCell}>
                                                <select
                                                    name="payment_status"
                                                    value={
                                                        editedPayment.payment_status ===
                                                        "done"
                                                            ? "paid"
                                                            : "pending"
                                                    }
                                                    onChange={
                                                        handleEditPaymentChange
                                                    }
                                                    className={
                                                        styles.editSelect
                                                    }
                                                >
                                                    <option value="pending">
                                                        Pending
                                                    </option>
                                                    <option value="paid">
                                                        Paid
                                                    </option>
                                                </select>
                                            </div>
                                            <div className={styles.tableCell}>
                                                <input
                                                    type="text"
                                                    name="reference_number"
                                                    value={
                                                        editedPayment.reference_number
                                                    }
                                                    onChange={
                                                        handleEditPaymentChange
                                                    }
                                                    placeholder="Reference number"
                                                    className={styles.editInput}
                                                />
                                            </div>
                                            <div className={styles.tableCell}>
                                                <div
                                                    className={
                                                        styles.uploadContainer
                                                    }
                                                >
                                                    <input
                                                        type="file"
                                                        id={`receipt_upload_${index}`}
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file =
                                                                e.target
                                                                    .files[0];
                                                            if (file) {
                                                                try {
                                                                    upload(file, {
                                                                        onSuccess: (data) => {
                                                                            setEditedPayment((prev) => ({
                                                                                ...prev,
                                                                                receipt_image: data.url,
                                                                            }));
                                                                        },
                                                                        onError: (error) => {
                                                                            console.error("Upload error:", error);
                                                                        }
                                                                    });
                                                                } catch (error) {
                                                                    console.error("Upload error:", error);
                                                                }
                                                            }
                                                        }}
                                                        className={
                                                            styles.fileInput
                                                        }
                                                        disabled={isUploading}
                                                    />
                                                    <label
                                                        htmlFor={`receipt_upload_${index}`}
                                                        className={`${styles.uploadButton} ${isUploading ? styles.uploading : ""}`}
                                                    >
                                                        <div
                                                            className={
                                                                styles.uploadContent
                                                            }
                                                        >
                                                            <div
                                                                className={
                                                                    styles.uploadIcon
                                                                }
                                                            >
                                                                <Upload
                                                                    size={18}
                                                                />
                                                            </div>
                                                            <span
                                                                className={
                                                                    styles.uploadText
                                                                }
                                                            >
                                                                {isUploading ? (
                                                                    <>
                                                                        <span
                                                                            className={
                                                                                styles.uploadingText
                                                                            }
                                                                        >
                                                                            Uploading...
                                                                        </span>
                                                                        <div
                                                                            className={
                                                                                styles.uploadProgress
                                                                            }
                                                                        >
                                                                            <div
                                                                                className={
                                                                                    styles.progressBar
                                                                                }
                                                                            ></div>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>
                                                                            Upload
                                                                            Receipt
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </label>
                                                </div>
                                                {editedPayment.receipt_image && (
                                                    <div
                                                        className={
                                                            styles.receiptPreview
                                                        }
                                                    >
                                                        <img
                                                            src={
                                                                editedPayment.receipt_image
                                                            }
                                                            alt="Receipt preview"
                                                            className={
                                                                styles.receiptImage
                                                            }
                                                        />
                                                        <button
                                                            className={
                                                                styles.deleteReceiptButton
                                                            }
                                                            onClick={() =>
                                                                setEditedPayment(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        receipt_image:
                                                                            "",
                                                                    })
                                                                )
                                                            }
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.tableCell}>
                                                <div
                                                    className={
                                                        styles.actionButtons
                                                    }
                                                >
                                                    <button
                                                        className={
                                                            styles.saveButton
                                                        }
                                                        onClick={
                                                            handleSavePayment
                                                        }
                                                        disabled={
                                                            isUpdatingPayments
                                                        }
                                                        title="Save changes"
                                                    >
                                                        <Save size={16} />
                                                    </button>
                                                    <button
                                                        className={
                                                            styles.cancelButton
                                                        }
                                                        onClick={
                                                            handleCancelEdit
                                                        }
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
                                                {new Date(
                                                    payment.due_date
                                                ).toLocaleDateString()}
                                            </div>
                                            <div className={styles.tableCell}>
                                                {formatCurrency(payment.amount)}
                                            </div>
                                            <div className={styles.tableCell}>
                                                {displayPaymentMethod(
                                                    payment.payment_method
                                                )}
                                            </div>
                                            <div className={styles.tableCell}>
                                                <span
                                                    className={`${styles.statusBadge} ${getStatusBadgeClass(payment.payment_status)}`}
                                                >
                                                    {displayPaymentStatus(
                                                        payment.payment_status
                                                    )}
                                                </span>
                                            </div>
                                            <div className={styles.tableCell}>
                                                {payment.reference_number ||
                                                    "N/A"}
                                            </div>
                                            <div className={styles.tableCell}>
                                                {payment.receipt_image ? (
                                                    <div
                                                        className={
                                                            styles.receiptPreview
                                                        }
                                                    >
                                                        <img
                                                            src={
                                                                payment.receipt_image
                                                            }
                                                            alt="Receipt"
                                                            className={
                                                                styles.receiptImage
                                                            }
                                                        />
                                                    </div>
                                                ) : (
                                                    "No receipt"
                                                )}
                                            </div>
                                            <div className={styles.tableCell}>
                                                <div
                                                    className={
                                                        styles.actionButtons
                                                    }
                                                >
                                                    <button
                                                        className={
                                                            styles.editPaymentButton
                                                        }
                                                        onClick={() =>
                                                            handleEditPayment(
                                                                payment,
                                                                index
                                                            )
                                                        }
                                                        title="Edit payment"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className={
                                                            styles.deletePaymentButton
                                                        }
                                                        onClick={() =>
                                                            handleDeletePayment(
                                                                index
                                                            )
                                                        }
                                                        title="Delete payment"
                                                        disabled={
                                                            isDeletingPayment
                                                        }
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

                <div className={styles.documentsCard} style={{ marginTop: "20px" }}>
                    <div className={styles.documentsHeader}>
                        <div>
                            <h3>
                                <FileCheck className={styles.iconWrapper} size={16} />
                                Documents
                            </h3>
                            <p className={styles.subtitle}>Upload and manage documents</p>
                        </div>
                        <label htmlFor="document-upload" className={`${styles.uploadButton} ${isPending ? styles.uploading : ""}`}>
                            <input
                                type="file"
                                id="document-upload"
                                multiple
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={handleFileUpload}
                                className={styles.fileInput}
                                disabled={isPending}
                            />
                            <Upload size={18} />
                            <span>{isPending ? "Uploading..." : "Upload Documents"}</span>
                        </label>
                    </div>

                    {rentalAgreement?.documents?.length > 0 ? (
                        <div className={styles.documentList}>
                            {rentalAgreement.documents.map((docUrl, index) => {
                                const fileType = getFileType(docUrl);
                                const fileName = docUrl.split("/").pop();
                                
                                return (
                                    <div key={index} className={styles.documentItem}>
                                        <div className={styles.documentPreview}>
                                            {fileType.isImage ? (
                                                <img src={docUrl} alt={fileName} />
                                            ) : (
                                                <FileText size={32} />
                                            )}
                                        </div>
                                        <div className={styles.documentInfo}>
                                            <span className={styles.documentName}>{fileName}</span>
                                            <span className={styles.documentType}>
                                                {fileType.isImage ? 'Image' : fileType.isPDF ? 'PDF' : 'Document'}
                                            </span>
                                        </div>
                                        <div className={styles.documentActions}>
                                            <a
                                                href={docUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.viewLink}
                                                title="View document"
                                            >
                                                <FileImage size={18} />
                                            </a>
                                            <button
                                                onClick={() => handleDeleteClick(docUrl)}
                                                className={styles.deleteBtn}
                                                disabled={isDeleting}
                                                title="Delete document"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.emptyDocuments}>
                            <FileText size={48} />
                            <p>No documents uploaded yet</p>
                            <p className={styles.emptySubtitle}>
                                Upload documents to get started
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Delete Document</h3>
                        <p>
                            Are you sure you want to delete this document? This
                            action cannot be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.modalButtonCancel}
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.modalButtonDelete}
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RentalAgreementDetails;
