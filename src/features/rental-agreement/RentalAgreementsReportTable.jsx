import PageNotFound from "../../pages/PageNotFound";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import styles from "./RentalAgreementsReportTable.module.css";
import { CalendarClock, Clock, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PropertyStatesCard } from "../../components/dashboard/DashboardCards";
import { useState } from "react";
import { useUploadReceipt } from "./useUploadReceipt";
import { useDeleteImage } from "../Extra/useDeleteImage";
import toast from "react-hot-toast";
import { useChequePayments } from "./useChequePayments";

function RentalAgreementsReportTable({
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
    const { upload, isUploading } = useUploadReceipt(
        "upload-rental-agreement-payment-receipt"
    );
    const { updateChequePayments, isUpdatingPayments } = useChequePayments();

    const { deleteImage } = useDeleteImage();

    if (isLoading) return <Spinner type="fullPage" />;
    if (error) return <PageNotFound error={error} />;

    // --- Summary Card Calculations ---
    // Total Rental Buildings
    // const totalBuildings = data ? new Set(data.map(ag => ag.property?.building?.building_name)).size : 0;
    // // Overdue Payments
    // const overduePayments = data ? data.reduce((acc, ag) => {
    //     if (!ag.cheque_payments) return acc;
    //     return acc + ag.cheque_payments.filter(p => p.payment_status !== 'done' && new Date(p.due_date) < new Date()).length;
    // }, 0) : 0;
    // Due Within 30 Days
    const dueWithin30Days = data
        ? data.reduce((acc, ag) => {
              if (!ag.cheque_payments) return acc;
              const now = new Date();
              const in30 = new Date();
              in30.setDate(now.getDate() + 30);
              return (
                  acc +
                  ag.cheque_payments.filter(
                      (p) =>
                          p.payment_status !== "done" &&
                          new Date(p.due_date) >= now &&
                          new Date(p.due_date) <= in30
                  ).length
              );
          }, 0)
        : 0;
    // Pending Payments (future months)
    const pendingPayments = data
        ? data.reduce((acc, ag) => {
              if (!ag.cheque_payments) return acc;
              const now = new Date();
              return (
                  acc +
                  ag.cheque_payments.filter(
                      (p) =>
                          p.payment_status !== "done" &&
                          new Date(p.due_date) > now
                  ).length
              );
          }, 0)
        : 0;

    // --- End Summary Card Calculations ---

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // const getCurrentMonthPayment = (payments) => {
    //     if (!payments || !Array.isArray(payments)) return null;

    //     const currentDate = new Date();
    //     const currentMonth = currentDate.getMonth();
    //     const currentYear = currentDate.getFullYear();

    //     return payments.find(payment => {
    //         const paymentDate = new Date(payment.due_date);
    //         return paymentDate.getMonth() === currentMonth &&
    //                paymentDate.getFullYear() === currentYear;
    //     });
    // };

    const handleAgreementClick = (agreementId) => {
        navigate(`/rental-agreement/list/${agreementId}`);
    };

    const handlePropertyClick = (propertyId, e) => {
        e.stopPropagation();
        window.open(`/for-rent/new-list/${propertyId}`, "_blank");
    };

    // Helper to get the next due payment (overdue or next upcoming)
    const getNextDuePayment = (payments) => {
        if (!payments || !Array.isArray(payments)) return null;
        // const now = new Date();
        // Find the earliest payment that is not done
        return (
            payments
                .filter((p) => p.payment_status !== "done")
                .sort(
                    (a, b) => new Date(a.due_date) - new Date(b.due_date)
                )[0] || null
        );
    };

    // Helper to get payment status
    const getPaymentStatus = (payment) => {
        if (!payment) return { label: "No Due", color: "default" };
        const now = new Date();
        const dueDate = new Date(payment.due_date);
        if (payment.payment_status === "done")
            return { label: "Paid", color: "success" };
        if (dueDate < now) {
            const days = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
            return { label: `Overdue by ${days} days`, color: "danger" };
        }
        const days = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        if (days <= 30)
            return { label: `Due in ${days} days`, color: "warning" };
        return { label: "Pending", color: "muted" };
    };

    const columns = {
        desktop: "2fr 1fr 1fr 1fr 1fr 1fr",
        mobile: "1fr",
    };

    // Receipt handling functions
    const handleReceiptUpload = (payment) => {
        setSelectedPayment(payment);
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

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please upload a valid image file (JPEG, PNG, or GIF)");
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("Image size should not exceed 5MB");
            return;
        }

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
    };

    const handleRemoveReceiptImage = () => {
        if (selectedPayment?.receipt_image) {
            deleteImage(selectedPayment?.receipt_image, {
                onSuccess: () => {
                    setSelectedPayment((prev) => ({
                        ...prev,
                        receipt_image: undefined,
                    }));
                    toast.dismiss();
                    toast.success("Receipt image removed");
                },
                onError: (error) => {
                    console.error("Error removing image:", error);
                    toast.dismiss();
                    toast.error("Failed to remove image");
                },
            });
        }
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

        if (!data || !Array.isArray(data)) {
            toast.error("No agreement data available");
            return;
        }

        try {
            // Find the agreement containing the selected payment
            const agreement = data.find((agreement) =>
                agreement?.cheque_payments?.some(
                    (payment) =>
                        payment.due_date === selectedPayment.due_date &&
                        payment.amount === selectedPayment.amount &&
                        payment.payment_method === selectedPayment.payment_method &&
                        payment.payment_status === selectedPayment.payment_status
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
            updateChequePayments(
                {
                    rentalAgreementId: agreement.id,
                    chequePayments: updatedPayments,
                },
                {
                    onSuccess: () => {
                        handleCloseModal();
                    },
                    onError: (error) => {
                        toast.error("Failed to update payment");
                        console.error(error);
                    },
                }
            );
        } catch (error) {
            toast.error("Failed to update payment");
            console.error(error);
        }
    };

    return (
        <>
            {/* Summary Cards Section */}
            <div className={styles.summaryCardsContainer}>
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
            {/* End Summary Cards Section */}
            <div className={styles.tableContainer}>
                <div className={styles.responsiveWrapper}>
                    <Table
                        columns={
                            window.innerWidth > 768
                                ? columns.desktop
                                : columns.mobile
                        }
                        rowWidth={window.innerWidth > 768 ? "80rem" : "100%"}
                        hasShadow
                        hasBorder
                    >
                        <Table.Header className={styles.tableHeader}>
                            <div>Building</div>
                            <div className={styles.hideOnMobile}>
                                Tenant Name
                            </div>
                            <div className={styles.hideOnMobile}>Amount</div>
                            <div className={styles.hideOnMobile}>Due Date</div>
                            <div className={styles.hideOnMobile}>Status</div>
                            <div>Actions</div>
                        </Table.Header>
                        <Table.Body
                            data={data}
                            render={(agreement) => {
                                const nextPayment = getNextDuePayment(
                                    agreement?.cheque_payments
                                );
                                const status = getPaymentStatus(nextPayment);
                                return (
                                    <Table.Row
                                        key={agreement?.id}
                                        className={styles.tableRow}
                                    >
                                        {/* Building */}
                                        <div
                                            style={{
                                                fontWeight: 600,
                                                color: "#1e293b",
                                            }}
                                        >
                                            {agreement?.property?.building
                                                ?.building_name || "N/A"}
                                            <div
                                                style={{
                                                    fontSize: "0.95em",
                                                    color: "#64748b",
                                                }}
                                            >
                                                {agreement?.property?.title}
                                            </div>

                                            {/* Mobile-only content */}
                                            <div
                                                className={
                                                    styles.mobileOnlyContent
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.mobileInfoRow
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.mobileLabel
                                                        }
                                                    >
                                                        Tenant:
                                                    </span>
                                                    <span>
                                                        {agreement?.tenant
                                                            ?.name || "N/A"}
                                                    </span>
                                                </div>
                                                <div
                                                    className={
                                                        styles.mobileInfoRow
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.mobileLabel
                                                        }
                                                    >
                                                        Amount:
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontWeight: 600,
                                                            color: "#059669",
                                                        }}
                                                    >
                                                        {nextPayment
                                                            ? `AED ${nextPayment.amount?.toLocaleString()}`
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                                <div
                                                    className={
                                                        styles.mobileInfoRow
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.mobileLabel
                                                        }
                                                    >
                                                        Due Date:
                                                    </span>
                                                    <span>
                                                        {nextPayment
                                                            ? formatDate(
                                                                  nextPayment.due_date
                                                              )
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                                <div
                                                    className={
                                                        styles.mobileInfoRow
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            styles.mobileLabel
                                                        }
                                                    >
                                                        Status:
                                                    </span>
                                                    <span
                                                        style={{
                                                            padding:
                                                                "0.35em 0.8em",
                                                            borderRadius:
                                                                "999px",
                                                            fontWeight: 500,
                                                            fontSize: "0.95em",
                                                            background:
                                                                status.color ===
                                                                "success"
                                                                    ? "#e6f4ea"
                                                                    : status.color ===
                                                                        "danger"
                                                                      ? "#fee2e2"
                                                                      : status.color ===
                                                                          "warning"
                                                                        ? "#fef9c3"
                                                                        : "#f3f4f6",
                                                            color:
                                                                status.color ===
                                                                "success"
                                                                    ? "#15803d"
                                                                    : status.color ===
                                                                        "danger"
                                                                      ? "#b91c1c"
                                                                      : status.color ===
                                                                          "warning"
                                                                        ? "#b45309"
                                                                        : "#64748b",
                                                        }}
                                                    >
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tenant Name - visible on desktop */}
                                        <div className={styles.hideOnMobile}>
                                            {agreement?.tenant?.name || "N/A"}
                                        </div>

                                        {/* Amount - visible on desktop */}
                                        <div
                                            className={styles.hideOnMobile}
                                            style={{
                                                fontWeight: 600,
                                                color: "#059669",
                                            }}
                                        >
                                            {nextPayment
                                                ? `AED ${nextPayment.amount?.toLocaleString()}`
                                                : "N/A"}
                                        </div>

                                        {/* Due Date - visible on desktop */}
                                        <div
                                            className={styles.hideOnMobile}
                                            style={{ color: "#334155" }}
                                        >
                                            {nextPayment
                                                ? formatDate(
                                                      nextPayment.due_date
                                                  )
                                                : "N/A"}
                                        </div>

                                        {/* Status - visible on desktop */}
                                        <div className={styles.hideOnMobile}>
                                            <span
                                                style={{
                                                    padding: "0.35em 0.8em",
                                                    borderRadius: "999px",
                                                    fontWeight: 500,
                                                    fontSize: "0.95em",
                                                    background:
                                                        status.color ===
                                                        "success"
                                                            ? "#e6f4ea"
                                                            : status.color ===
                                                                "danger"
                                                              ? "#fee2e2"
                                                              : status.color ===
                                                                  "warning"
                                                                ? "#fef9c3"
                                                                : "#f3f4f6",
                                                    color:
                                                        status.color ===
                                                        "success"
                                                            ? "#15803d"
                                                            : status.color ===
                                                                "danger"
                                                              ? "#b91c1c"
                                                              : status.color ===
                                                                  "warning"
                                                                ? "#b45309"
                                                                : "#64748b",
                                                }}
                                            >
                                                {status.label}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.viewButton}
                                                onClick={() =>
                                                    handleAgreementClick(
                                                        agreement?.id
                                                    )
                                                }
                                            >
                                                View Details
                                            </button>
                                            <button
                                                className={
                                                    styles.propertyButton
                                                }
                                                onClick={(e) =>
                                                    handlePropertyClick(
                                                        agreement?.property?.id,
                                                        e
                                                    )
                                                }
                                            >
                                                View Property
                                            </button>
                                            {nextPayment &&
                                                nextPayment.payment_status !==
                                                    "done" && (
                                                    <button
                                                        className={
                                                            styles.receiptButton
                                                        }
                                                        onClick={() =>
                                                            handleReceiptUpload(
                                                                nextPayment
                                                            )
                                                        }
                                                    >
                                                        <Upload size={14} />
                                                        Add Receipt
                                                    </button>
                                                )}
                                        </div>
                                    </Table.Row>
                                );
                            }}
                        />
                    </Table>
                </div>
                {isFetchingNextPage && (
                    <div className={styles.loadingMore}>
                        <Spinner type="small" />
                        <span>Loading more agreements...</span>
                    </div>
                )}
            </div>

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
                                    <div className={styles.receiptPreview}>
                                        <img
                                            src={selectedPayment.receipt_image}
                                            alt="Receipt"
                                            className={styles.receiptImage}
                                            loading="lazy"
                                        />
                                        <button
                                            type="button"
                                            className={styles.removeImageButton}
                                            onClick={handleRemoveReceiptImage}
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
                                {isUploading
                                    ? "Uploading..."
                                    : isUpdatingPayments
                                      ? "Updating..."
                                      : "Update Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default RentalAgreementsReportTable;
