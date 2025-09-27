import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    Calendar,
    CreditCard,
    Upload,
    X,
    ExternalLink,
    MapPin,
    User,
    AlertCircle,
    CalendarClock,
    Clock,
} from "lucide-react";
import Table from "../../ui/Table";
import styles from "./BuildingReports.module.css";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../PageNotFound";
import { useUploadReceipt } from "../../features/rental-agreement/useUploadReceipt";
import { useDeleteImage } from "../../features/Extra/useDeleteImage";
import toast from "react-hot-toast";
import { useBuildingChequePayments } from "../../features/buildings/useBuildingChequePayments";
import { PropertyStatesCard } from "../../components/dashboard/DashboardCards";

function getContractYears(start, end) {
    if (!start || !end) return '';
    const startDate = new Date(start);
    const endDate = new Date(end);
    let years = endDate.getFullYear() - startDate.getFullYear();
    const m = endDate.getMonth() - startDate.getMonth();
    if (m < 0 || (m === 0 && endDate.getDate() < startDate.getDate())) {
        years--;
    }
    if (years < 1) {
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        return `Months: ${months}`;
    }
    return `Years: ${years}`;
}

function BuildingReportsTable({ isLoading, error, data }) {
    const navigate = useNavigate();
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [referenceNumber, setReferenceNumber] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("pending");
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
            const building = data?.find((building) =>
                building?.cheque_payments?.some(
                    (payment) =>
                        payment?.due_date === selectedPayment.due_date &&
                        payment?.amount === selectedPayment.amount &&
                        payment?.payment_method === selectedPayment.payment_method &&
                        payment?.payment_status === selectedPayment.payment_status
                )
            );

            if (!building) {
                toast.error("Could not find the building");
                return;
            }

            if (!building.cheque_payments) {
                toast.error("No payment records found for this building");
                return;
            }

            const updatedPayments = building.cheque_payments.map((payment) => {
                if (
                    payment?.due_date === selectedPayment.due_date &&
                    payment?.amount === selectedPayment.amount &&
                    payment?.payment_method === selectedPayment.payment_method &&
                    payment?.payment_status === selectedPayment.payment_status
                ) {
                    return {
                        ...payment,
                        reference_number: referenceNumber,
                        payment_status: paymentStatus === "paid" ? "done" : "pending",
                        receipt_image: selectedPayment.receipt_image,
                    };
                }
                return payment;
            });

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

    return (
        <div>
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
          

            {/* --- Payments Table (shadcn/ui style) --- */}
            <div style={{ marginTop: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Payments Overview</h2>
                <div style={{
                    overflowX: 'auto',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    boxShadow: '0 1px 2px rgba(16,30,54,0.04)',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                        <thead style={{ background: '#f9fafb' }}>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 500, fontSize: '1rem', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Building</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 500, fontSize: '1rem', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 500, fontSize: '1rem', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Due Date</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 500, fontSize: '1rem', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: 500, fontSize: '1rem', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.length > 0 && data.flatMap((building) =>
                                (building.cheque_payments || []).map((payment, idx) => {
                                    // Status calculation
                                    const now = new Date();
                                    const due = new Date(payment.due_date);
                                    let statusLabel = '';
                                    let statusColor = '';
                                    if (payment.payment_status === 'done') {
                                        statusLabel = 'Paid';
                                        statusColor = '#22c55e';
                                    } else if (due < now) {
                                        const days = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
                                        statusLabel = `Overdue by ${days} day${days > 1 ? 's' : ''}`;
                                        statusColor = '#ef4444';
                                    } else {
                                        const days = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
                                        statusLabel = `Due in ${days} day${days > 1 ? 's' : ''}`;
                                        statusColor = '#f59e42';
                                    }
                                    return (
                                        <tr key={`${building.id}-${payment.id || idx}`} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}>
                                            <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                                                <div style={{ fontWeight: 500 }}>{building.building_name}</div>
                                                <div style={{ fontSize: '0.95em', color: '#6b7280' }}>{building.address || building.area?.name}</div>
                                            </td>
                                            <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>{formatCurrency(payment.amount)}</td>
                                            <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>{formatDate(payment.due_date)}</td>
                                            <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                                                <span style={{
                                                    background: statusColor + '22',
                                                    color: statusColor,
                                                    borderRadius: '0.375rem',
                                                    padding: '0.25em 0.75em',
                                                    fontWeight: 500,
                                                    fontSize: '0.98em',
                                                }}>{statusLabel}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem', verticalAlign: 'top' }}>
                                                <button
                                                    style={{
                                                        background: '#f3f4f6',
                                                        border: 'none',
                                                        borderRadius: '0.375rem',
                                                        padding: '0.4em 1em',
                                                        fontWeight: 500,
                                                        color: '#374151',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.2s',
                                                    }}
                                                    onClick={() => handleReceiptUpload(payment)}
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            {(!data || data.length === 0) && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                        No payments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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

export default BuildingReportsTable;
