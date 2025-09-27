import PageNotFound from "../../pages/PageNotFound";
import Spinner from "../../ui/Spinner";
import styles from "./RentalAgreementsReport.module.css";
import {
    Building2,
    Users,
    Calendar,
    CreditCard,
    FileText,
    CheckCircle2,
    Receipt,
    Upload,
    X,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    CalendarClock,
    Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUploadReceipt } from "../../features/rental-agreement/useUploadReceipt";
import toast from "react-hot-toast";
import { useChequePayments } from "./useChequePayments";
import { useDeleteImage } from "../Extra/useDeleteImage";
import { PropertyStatesCard } from "../../components/dashboard/DashboardCards";

function RentalAgreementsReport({
    isLoading,
    error,
    data,
    isFetchingNextPage,
}) {
    const navigate = useNavigate();
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [referenceNumber, setReferenceNumber] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [expandedMonths, setExpandedMonths] = useState({});
    const { upload, isUploading } = useUploadReceipt(
        "upload-rental-agreement-payment-receipt"
    );
    const { deleteImage } = useDeleteImage();
    const { updateChequePayments, isUpdatingPayments } = useChequePayments();
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

    const handleAgreementClick = (agreementId) => {
        navigate(`/rental-agreement/list/${agreementId}`);
    };

    const handlePropertyClick = (propertyId) => {
        window.open(`/for-rent/new-list/${propertyId}`, "_blank");
    };

    const handleReceiptUpload = (payment) => {
        setSelectedPayment({
            ...payment,
            id: payment.id, // Ensure we have the payment ID
        });
        setReferenceNumber(payment.reference_number || "");
        setPaymentStatus(
            payment.payment_status === "done" ? "paid" : "pending"
        );
        setShowReceiptModal(true);
    };

    const handleCloseModal = () => {
        setShowReceiptModal(false);
        setSelectedPayment(null);
        setReferenceNumber("");
        setPaymentStatus("pending");
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
            // Find the agreement containing the selected payment
            const agreement = data.find((agreement) =>
                agreement.cheque_payments.some(
                    (payment) =>
                        payment.due_date === selectedPayment.due_date &&
                        payment.amount === selectedPayment.amount &&
                        payment.payment_method ===
                            selectedPayment.payment_method &&
                        payment.payment_status ===
                            selectedPayment.payment_status
                )
            );

            if (!agreement) {
                toast.error("Could not find the agreement");
                return;
            }

            // Create a new array with only the selected payment updated
            const updatedPayments = agreement.cheque_payments.map((payment) => {
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
                        payment_status:
                            paymentStatus === "paid" ? "done" : "pending",
                        receipt_image: selectedPayment.receipt_image,
                    };
                }
                return payment; // Return unchanged for all other payments
            });

            // Call the API to update the payments
            updateChequePayments({
                rentalAgreementId: agreement.id,
                chequePayments: updatedPayments,
            });

            handleCloseModal();
        } catch (error) {
            toast.error("Failed to update payment");
            console.error(error);
        }
    };

    // Update the file upload handler to store the receipt URL
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            upload(file, {
                onSuccess: (data) => {
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

    // Handler to remove the uploaded receipt image
    const handleRemoveReceiptImage = () => {
        deleteImage(selectedPayment.receipt_image);
        setSelectedPayment((prev) => ({
            ...prev,
            receipt_image: undefined,
        }));
    };

  
    // Add this helper function to group payments by month
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

    // Add this helper function to format month-year
    const formatMonthYear = (monthYear) => {
        const [year, month] = monthYear.split('-');
        return new Date(year, month - 1).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long'
        });
    };

    // Add this function to toggle month expansion
    const toggleMonth = (monthYear) => {
        setExpandedMonths(prev => ({
            ...prev,
            [monthYear]: !prev[monthYear]
        }));
    };

      // --- Summary Card Calculations ---
    // Total Rental Buildings
    const totalBuildings = data ? new Set(data.map(ag => ag.property?.building?.building_name)).size : 0;
    // Overdue Payments
    const overduePayments = data ? data.reduce((acc, ag) => {
        if (!ag.cheque_payments) return acc;
        return acc + ag.cheque_payments.filter(p => p.payment_status !== 'done' && new Date(p.due_date) < new Date()).length;
    }, 0) : 0;
    // Due Within 30 Days
    const dueWithin30Days = data ? data.reduce((acc, ag) => {
        if (!ag.cheque_payments) return acc;
        const now = new Date();
        const in30 = new Date();
        in30.setDate(now.getDate() + 30);
        return acc + ag.cheque_payments.filter(p => p.payment_status !== 'done' && new Date(p.due_date) >= now && new Date(p.due_date) <= in30).length;
    }, 0) : 0;
    // Pending Payments (future months)
    const pendingPayments = data ? data.reduce((acc, ag) => {
        if (!ag.cheque_payments) return acc;
        const now = new Date();
        return acc + ag.cheque_payments.filter(p => p.payment_status !== 'done' && new Date(p.due_date) > now).length;
    }, 0) : 0;

    // --- End Summary Card Calculations ---
    return (
        <div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                
                <PropertyStatesCard
                    title="Due Within 30 Days"
                    value={dueWithin30Days}
                    description="Payments due in the next month"
                    icon={CalendarClock}
                    cardType="warning"
                />
                <PropertyStatesCard
                    title="Pending Payments"
                    value={pendingPayments}
                    description="Regular payments due in future months"
                    icon={Clock}
                />
            </div>
            <div className={styles.agreementList}>
                {data?.map((agreement) => (
                    <div
                        key={agreement?.id}
                        className={styles.agreementCard}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.headerLeft}>
                                <FileText className={styles.headerIcon} />
                                <div>
                                    <div className={styles.agreementTitle}>
                                        Agreement #{agreement?.id}
                                        <button
                                            className={styles.viewDetailsButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAgreementClick(agreement?.id);
                                            }}
                                        >
                                            <ExternalLink size={16} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.headerRight}>
                                <div className={styles.rentInfo}>
                                    <span className={styles.rentLabel}>
                                        {agreement?.payment_frequency} Rent
                                    </span>
                                    <span className={styles.rentAmount}>
                                        {formatCurrency(agreement?.rent_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardContent}>
                            <div className={styles.infoSection}>
                                {/* Property Information */}
                                {agreement?.property?.title && (
                                    <div className={styles.infoItem}>
                                        <Building2 />
                                        <div>
                                            <span className={styles.infoLabel}>
                                                Property
                                            </span>
                                            <span
                                                className={styles.infoValue}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePropertyClick(
                                                        agreement?.property?.id
                                                    );
                                                }}
                                            >
                                                {agreement?.property?.title}
                                            </span>
                                            {agreement?.property?.house_no && (
                                                <span
                                                    className={
                                                        styles.infoSubtext
                                                    }
                                                >
                                                    Unit Number:{" "}
                                                    {
                                                        agreement?.property
                                                            ?.house_no
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Location and Timing */}
                                {(agreement?.property?.location ||
                                    (agreement?.start_date &&
                                        agreement?.end_date)) && (
                                    <div className={styles.infoItem}>
                                        <Calendar />
                                        <div>
                                            <span className={styles.infoLabel}>
                                                Location & Duration
                                            </span>
                                            {agreement?.property?.location && (
                                                <span
                                                    className={styles.infoValue}
                                                >
                                                    {
                                                        agreement.property
                                                            .location
                                                    }
                                                </span>
                                            )}
                                            {agreement?.start_date &&
                                                agreement?.end_date && (
                                                    <span
                                                        className={
                                                            styles.infoSubtext
                                                        }
                                                    >
                                                        {formatDate(
                                                            agreement.start_date
                                                        )}{" "}
                                                        -{" "}
                                                        {formatDate(
                                                            agreement.end_date
                                                        )}
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                )}

                                {/* Building Information */}
                                {agreement?.property?.property_type && (
                                    <div className={styles.infoItem}>
                                        <Building2 />
                                        <div>
                                            <span className={styles.infoLabel}>
                                                Building Details
                                            </span>
                                            <span className={styles.infoValue}>
                                                {
                                                    agreement.property
                                                        .property_type
                                                }
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Tenant Information */}
                                {agreement?.tenant?.name && (
                                    <div className={styles.infoItem}>
                                        <Users />
                                        <div>
                                            <span className={styles.infoLabel}>
                                                Tenant
                                            </span>
                                            <span className={styles.infoValue}>
                                                {agreement.tenant.name}
                                            </span>
                                            {(agreement?.tenant?.phone ||
                                                agreement?.tenant?.email) && (
                                                <span
                                                    className={
                                                        styles.infoSubtext
                                                    }
                                                >
                                                    {[
                                                        agreement?.tenant
                                                            ?.phone,
                                                        agreement?.tenant
                                                            ?.email,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" • ")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Payment Information */}
                                {(agreement?.payment_frequency ||
                                    agreement?.security_deposit) && (
                                    <div className={styles.infoItem}>
                                        <CreditCard />
                                        <div>
                                            <span className={styles.infoLabel}>
                                                Payment Terms
                                            </span>
                                            {agreement?.payment_frequency && (
                                                <span
                                                    className={styles.infoValue}
                                                >
                                                    {
                                                        agreement.payment_frequency
                                                    }
                                                </span>
                                            )}
                                            {agreement?.security_deposit && (
                                                <span
                                                    className={
                                                        styles.infoSubtext
                                                    }
                                                >
                                                    Security Deposit:{" "}
                                                    {formatCurrency(
                                                        agreement.security_deposit
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Status */}
                                {agreement?.status && (
                                    <div className={styles.infoItem}>
                                        <CheckCircle2 />
                                        <div>
                                            <span className={styles.infoLabel}>
                                                Status
                                            </span>
                                            <span
                                                className={
                                                    styles.agreementStatus
                                                }
                                            >
                                                {agreement.status}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payments Section */}
                            {agreement?.cheque_payments?.length > 0 && (
                                <div className={styles.paymentsSection}>
                                    <h4 className={styles.sectionTitle}>
                                        <Receipt />
                                        Payment History
                                    </h4>
                                    {Object.entries(groupPaymentsByMonth(agreement.cheque_payments))
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
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleReceiptUpload(payment);
                                                                        }}
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
            {isFetchingNextPage && (
                <div className={styles.loadingMore}>
                    <Spinner type="small" />
                    <span>Loading more agreements...</span>
                </div>
            )}

            {/* Receipt Upload Modal */}
            {showReceiptModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3>Update Payment</h3>
                            <button
                                onClick={handleCloseModal}
                                className={styles.closeButton}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label htmlFor="referenceNumber">
                                    Reference Number*
                                </label>
                                <input
                                    type="text"
                                    id="referenceNumber"
                                    value={referenceNumber}
                                    onChange={(e) =>
                                        setReferenceNumber(e.target.value)
                                    }
                                    placeholder="Enter cheque number or transaction ID"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="paymentStatus">
                                    Payment Status*
                                </label>
                                <select
                                    id="paymentStatus"
                                    value={paymentStatus}
                                    onChange={(e) =>
                                        setPaymentStatus(e.target.value)
                                    }
                                    className={styles.statusSelect}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="receiptUpload">
                                    Receipt Image*
                                </label>
                                {selectedPayment?.receipt_image ? (
                                    <div
                                        className={styles.receiptPreview}
                                        style={{ position: "relative" }}
                                    >
                                        <img
                                            src={selectedPayment.receipt_image}
                                            alt="Receipt preview"
                                            className={styles.receiptImage}
                                        />
                                        <button
                                            type="button"
                                            className={styles.removeImageButton}
                                            onClick={handleRemoveReceiptImage}
                                            style={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                                background: "rgba(0,0,0,0.5)",
                                                border: "none",
                                                borderRadius: "50%",
                                                color: "#fff",
                                                width: 24,
                                                height: 24,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                            }}
                                            aria-label="Remove image"
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
                                            <div
                                                className={styles.uploadContent}
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
                                                    {isUploading
                                                        ? "Uploading..."
                                                        : "Upload Receipt"}
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
                                disabled={isUploading || isUpdatingPayments}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.submitButton}
                                onClick={handleSubmitReceipt}
                                disabled={
                                    isUploading ||
                                    isUpdatingPayments ||
                                    !selectedPayment?.receipt_image
                                }
                            >
                                {isUpdatingPayments
                                    ? "Updating..."
                                    : "Update Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RentalAgreementsReport;
