import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    Calendar,
    CreditCard,
    Receipt,
    Upload,
    X,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    MapPin,
    User,
    FileCheck,
    AlertCircle,
    Clock,
    CalendarClock,
} from "lucide-react";
import styles from "./BuildingReports.module.css";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../PageNotFound";
import { useUploadReceipt } from "../../features/rental-agreement/useUploadReceipt";
import { useDeleteImage } from "../../features/Extra/useDeleteImage";
import toast from "react-hot-toast";
import { useBuildingChequePayments } from "../../features/buildings/useBuildingChequePayments";
import { PropertyStatesCard } from "../../components/dashboard/DashboardCards";

function BuildingReports({ isLoading, error, data }) {
    const navigate = useNavigate();
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [referenceNumber, setReferenceNumber] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [expandedMonths, setExpandedMonths] = useState({});
    const { upload, isUploading } = useUploadReceipt("upload-building-payment-receipt");
    const { deleteImage } = useDeleteImage();
    const { updateChequePayments, isUpdatingPayments } = useBuildingChequePayments();
    
    // --- Summary Card Calculations ---
    // Total Buildings
    const totalBuildings = data?.length || 0;

    // Overdue Payments
    const overduePayments = data?.reduce((acc, building) => {
        if (!building.cheque_payments) return acc;
        return acc + building.cheque_payments.filter(p => 
            p.payment_status !== 'done' && new Date(p.due_date) < new Date()
        ).length;
    }, 0) || 0;

    // Due Within 30 Days
    const dueWithin30Days = data?.reduce((acc, building) => {
        if (!building.cheque_payments) return acc;
        const now = new Date();
        const in30 = new Date();
        in30.setDate(now.getDate() + 30);
        return acc + building.cheque_payments.filter(p => 
            p.payment_status !== 'done' && 
            new Date(p.due_date) >= now && 
            new Date(p.due_date) <= in30
        ).length;
    }, 0) || 0;

    // Pending Payments (future months)
    const pendingPayments = data?.reduce((acc, building) => {
        if (!building.cheque_payments) return acc;
        const now = new Date();
        return acc + building.cheque_payments.filter(p => 
            p.payment_status !== 'done' && new Date(p.due_date) > now
        ).length;
    }, 0) || 0;

    if (isLoading) return <Spinner type="fullPage" />;
    if (error) return <PageNotFound error={error} />;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return "N/A";
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "AED",
        }).format(amount);
    };

    const handleBuildingClick = (buildingId) => {
        navigate(`/new-building/list/${buildingId}`);
    };

    const handleReceiptUpload = (payment) => {
        setSelectedPayment({
            ...payment,
            id: payment.id,
        });
        setReferenceNumber(payment.reference_number || "");
        setPaymentStatus(payment.payment_status === "done" ? "paid" : "pending");
        setShowReceiptModal(true);
    };

    const handleCloseModal = () => {
        setShowReceiptModal(false);
        setSelectedPayment(null);
        setReferenceNumber("");
        setPaymentStatus("pending");
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            upload(file, {
                onSuccess: (data) => {
                    toast.success("Receipt uploaded successfully");
                    setSelectedPayment((prev) => ({
                        ...prev,
                        receipt_image: data.url,
                    }));
                },
                onError: (error) => {
                    toast.error("Failed to upload receipt");
                    console.error(error);
                },
            });
        }
    };

    const handleRemoveReceiptImage = () => {
        deleteImage(selectedPayment.receipt_image);
        setSelectedPayment((prev) => ({
            ...prev,
            receipt_image: undefined,
        }));
    };

    const handleSubmitReceipt = async () => {
        if (!referenceNumber) {
            toast.error("Please enter a reference number");
            return;
        }

        if (!selectedPayment) {
            toast.error("No payment selected");
            return;
        }

        try {
            // Find the building containing the selected payment
            const building = data.find((building) =>
                building.cheque_payments.some(
                    (payment) =>
                        payment.due_date === selectedPayment.due_date &&
                        payment.amount === selectedPayment.amount &&
                        payment.payment_method === selectedPayment.payment_method &&
                        payment.payment_status === selectedPayment.payment_status
                )
            );

            if (!building) {
                toast.error("Could not find the building");
                return;
            }

            // Create a new array with only the selected payment updated
            const updatedPayments = building.cheque_payments.map((payment) => {
                // Only update the payment that matches all criteria
                if (
                    payment.due_date === selectedPayment.due_date &&
                    payment.amount === selectedPayment.amount &&
                    payment.payment_method === selectedPayment.payment_method &&
                    payment.payment_status === selectedPayment.payment_status
                ) {
                    return {
                        ...payment,
                        reference_number: referenceNumber,
                        payment_status: paymentStatus === "paid" ? "done" : "pending",
                        receipt_image: selectedPayment.receipt_image,
                    };
                }
                return payment; // Return unchanged for all other payments
            });

            // Call the API to update the payments
            updateChequePayments({
                buildingId: building.id,
                chequePayments: updatedPayments,
            });

            handleCloseModal();
        } catch (error) {
            toast.error("Failed to update payment");
            console.error(error);
        }
    };

    const groupPaymentsByMonth = (payments) => {
        return payments.reduce((acc, payment) => {
            const date = new Date(payment.due_date);
            const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(payment);
            return acc;
        }, {});
    };

    const formatMonthYear = (monthYear) => {
        const [year, month] = monthYear.split('-');
        return new Date(year, month - 1).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long'
        });
    };

    const toggleMonth = (monthYear) => {
        setExpandedMonths(prev => ({
            ...prev,
            [monthYear]: !prev[monthYear]
        }));
    };

    return (
        <div>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <PropertyStatesCard
                    title="Total Buildings"
                    value={totalBuildings}
                    description="Total buildings in the system"
                    icon={Building2}
                />
                <PropertyStatesCard
                    title="Overdue Payments"
                    value={overduePayments}
                    description="Payments past their due date"
                    icon={AlertCircle}
                />
                <PropertyStatesCard
                    title="Due Within 30 Days"
                    value={dueWithin30Days}
                    description="Payments due in the next month"
                    icon={CalendarClock}
                />
                <PropertyStatesCard
                    title="Pending Payments"
                    value={pendingPayments}
                    description="Regular payments due in future months"
                    icon={Clock}
                />
            </div>

            <div className={styles.agreementList}>
                {data?.map((building) => (
                    <div key={building?.id} className={styles.agreementCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.headerLeft}>
                                <Building2 className={styles.headerIcon} />
                                <div>
                                    <div className={styles.agreementTitle}>
                                        Building #{building?.id}
                                        <button
                                            className={styles.viewDetailsButton}
                                            onClick={() => handleBuildingClick(building?.id)}
                                        >
                                            <ExternalLink size={16} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.headerRight}>
                                <div className={styles.rentInfo}>
                                    <span className={styles.rentLabel}>Building Status</span>
                                    <span className={styles.rentAmount}>{building?.building_status}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardContent}>
                            <div className={styles.infoSection}>
                                {/* Building Information */}
                                <div className={styles.infoItem}>
                                    <Building2 />
                                    <div>
                                        <span className={styles.infoLabel}>Building Details</span>
                                        <span className={styles.infoValue}>{building?.building_name}</span>
                                        {building?.units_type && (
                                            <span className={styles.infoSubtext}>
                                                Units Type: {building.units_type}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Location Information */}
                                {building?.area && (
                                    <div className={styles.infoItem}>
                                        <MapPin />
                                        <div>
                                            <span className={styles.infoLabel}>Location</span>
                                            <span className={styles.infoValue}>{building.area.name}</span>
                                            {building?.makani_no && (
                                                <span className={styles.infoSubtext}>
                                                    Makani No: {building.makani_no}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Developer Information */}
                                {building?.developer && (
                                    <div className={styles.infoItem}>
                                        <User />
                                        <div>
                                            <span className={styles.infoLabel}>Developer</span>
                                            <span className={styles.infoValue}>{building.developer.name}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Contract Information */}
                                {(building?.contract_start_date || building?.contract_end_date) && (
                                    <div className={styles.infoItem}>
                                        <Calendar />
                                        <div>
                                            <span className={styles.infoLabel}>Contract Period</span>
                                            {building?.contract_start_date && building?.contract_end_date && (
                                                <span className={styles.infoValue}>
                                                    {formatDate(building.contract_start_date)} - {formatDate(building.contract_end_date)}
                                                </span>
                                            )}
                                            {building?.no_of_leasing_years && (
                                                <span className={styles.infoSubtext}>
                                                    Leasing Years: {building.no_of_leasing_years}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Payment Information */}
                                {(building?.annual_rent || building?.security_amount) && (
                                    <div className={styles.infoItem}>
                                        <CreditCard />
                                        <div>
                                            <span className={styles.infoLabel}>Financial Details</span>
                                            {building?.annual_rent && (
                                                <span className={styles.infoValue}>
                                                    Annual Rent: {formatCurrency(building.annual_rent)}
                                                </span>
                                            )}
                                            {building?.security_amount && (
                                                <span className={styles.infoSubtext}>
                                                    Security Deposit: {formatCurrency(building.security_amount)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Documents */}
                                <div className={styles.infoItem}>
                                    <FileCheck />
                                    <div>
                                        <span className={styles.infoLabel}>Documents</span>
                                        <span className={styles.infoValue}>
                                            {[
                                                building?.management_contract?.length > 0 && "Management Contract",
                                                building?.tenancy_lease_contract?.length > 0 && "Tenancy Lease",
                                                building?.title_deed?.length > 0 && "Title Deed",
                                                building?.affection_plan?.length > 0 && "Affection Plan",
                                                building?.poa_noc?.length > 0 && "POA/NOC",
                                                building?.building_drawing?.length > 0 && "Building Drawing",
                                                building?.handover_documents?.length > 0 && "Handover Documents",
                                                building?.other_documents?.length > 0 && "Other Documents"
                                            ].filter(Boolean).join(", ")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payments Section */}
                            {building?.cheque_payments?.length > 0 && (
                                <div className={styles.paymentsSection}>
                                    <h4 className={styles.sectionTitle}>
                                        <Receipt />
                                        Payment History
                                    </h4>
                                    {Object.entries(groupPaymentsByMonth(building.cheque_payments))
                                        .sort(([a], [b]) => new Date(b) - new Date(a))
                                        .map(([monthYear, payments]) => (
                                            <div key={monthYear} className={styles.monthGroup}>
                                                <div 
                                                    className={styles.monthHeader}
                                                    onClick={() => toggleMonth(monthYear)}
                                                >
                                                    <span className={styles.monthTitle}>
                                                        {formatMonthYear(monthYear)}
                                                    </span>
                                                    <span className={styles.monthToggle}>
                                                        {expandedMonths[monthYear] ? (
                                                            <ChevronUp size={16} />
                                                        ) : (
                                                            <ChevronDown size={16} />
                                                        )}
                                                    </span>
                                                </div>
                                                {expandedMonths[monthYear] && (
                                                    <div className={styles.paymentList}>
                                                        {payments.map((payment, index) => (
                                                            <div key={index} className={styles.paymentItem}>
                                                                <div className={styles.paymentInfo}>
                                                                    <span className={styles.paymentDate}>
                                                                        {formatDate(payment.due_date)}
                                                                    </span>
                                                                    <span className={styles.paymentAmount}>
                                                                        {formatCurrency(payment.amount)}
                                                                    </span>
                                                                    <span className={styles.paymentMethod}>
                                                                        {payment.payment_method}
                                                                    </span>
                                                                    {payment.reference_number && (
                                                                        <span className={styles.paymentReference}>
                                                                            Reference: {payment.reference_number}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className={`${styles.paymentStatus} ${
                                                                    payment.payment_status === "done" ? styles.statusDone : styles.statusPending
                                                                }`}>
                                                                    {payment.payment_status === "done" ? "PAID" : "PENDING"}
                                                                </span>
                                                                {payment.payment_status !== "done" && (
                                                                    <button
                                                                        className={styles.uploadReceiptButton}
                                                                        onClick={() => handleReceiptUpload(payment)}
                                                                    >
                                                                        <Upload size={16} />
                                                                        Add Receipt
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Receipt Upload Modal */}
            {showReceiptModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>Update Payment</h3>
                            <button onClick={handleCloseModal} className={styles.closeButton}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label htmlFor="referenceNumber">Reference Number*</label>
                                <input
                                    type="text"
                                    id="referenceNumber"
                                    value={referenceNumber}
                                    onChange={(e) => setReferenceNumber(e.target.value)}
                                    placeholder="Enter cheque number or transaction ID"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="paymentStatus">Payment Status*</label>
                                <select
                                    id="paymentStatus"
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    className={styles.statusSelect}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="receiptUpload">Receipt Image*</label>
                                {selectedPayment?.receipt_image ? (
                                    <div className={styles.receiptPreview}>
                                        <img
                                            src={selectedPayment.receipt_image}
                                            alt="Receipt preview"
                                            className={styles.receiptImage}
                                        />
                                        <button
                                            type="button"
                                            className={styles.removeImageButton}
                                            onClick={handleRemoveReceiptImage}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.uploadContainer}>
                                        <input
                                            type="file"
                                            id="receiptUpload"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className={styles.fileInput}
                                            disabled={isUploading}
                                        />
                                        <label
                                            htmlFor="receiptUpload"
                                            className={`${styles.uploadButton} ${isUploading ? styles.uploading : ""}`}
                                        >
                                            <div className={styles.uploadContent}>
                                                <div className={styles.uploadIcon}>
                                                    <Upload size={18} />
                                                </div>
                                                <span className={styles.uploadText}>
                                                    {isUploading ? "Uploading..." : "Upload Receipt"}
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCloseModal}
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.submitButton}
                                onClick={handleSubmitReceipt}
                                disabled={isUploading || isUpdatingPayments || !selectedPayment?.receipt_image}
                            >
                                {isUpdatingPayments ? "Updating..." : "Update Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuildingReports;
