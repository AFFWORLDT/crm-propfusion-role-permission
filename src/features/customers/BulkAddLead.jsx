import { useState, useEffect } from "react";
import useCreateLead from "../leads/useCreateLead";
import { useAuth } from "../../context/AuthContext";
import useStaff from "../admin/staff/useStaff";
import { useForm } from "react-hook-form";
import FormInputDataList from "../../ui/FormInputDataList";
import styles from "./BulkAddLead.module.css";

function BulkAddLead({ selectedCustomerIds, allCustomers, onAdd }) {
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { addLead } = useCreateLead();
    const { currentUser } = useAuth();
    const { data:staffData, isLoading:staffLoading } = useStaff();
    const { control } = useForm({
        defaultValues: {
            staff: null
        }
    });

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setShowModal(false);
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    const staffDataOptions = staffData?.map(item => ({
        label: item?.name,
        value: item?.id
    })) || [];

    const handleBulkAdd = async () => {
        setIsProcessing(true);
        for (const id of selectedCustomerIds) {
            const customer = allCustomers.find(c => c.customer_id === id);
            if (!customer) continue;
            const payload = {};
            if (customer.OwnerNAME && customer.OwnerNAME !== "N/A") payload.name = customer.OwnerNAME;
            if (customer.Mobile && customer.Mobile !== "N/A") payload.phone = String(customer.Mobile);
            if (customer.Email && customer.Email !== "N/A") payload.email = customer.Email;
            if (customer.Nationality && customer.Nationality !== "N/A") payload.nationality = customer.Nationality;
            payload.clientSource = "Company Website";
            payload.status = "ACTIVE";
            payload.isClaim = "NO";
            payload.clientType = mode;
            payload.agent_Id = control._formValues.staff?.value || currentUser?.id;
            await new Promise(resolve => addLead(payload, { onSettled: resolve }));
        }
        setIsProcessing(false);
        setShowModal(false);
        setMode(null);
        onAdd?.();
    };

    if (!selectedCustomerIds.length) return null;

    return (
        <>
            <button
                className={styles.addButton}
                onClick={() => setShowModal(true)}
            >
                Add Lead to Selected
            </button>

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalBody}>
                            <h3 className={styles.modalTitle}>Select Lead Mode</h3>
                            <div className={styles.buttonGroup}>
                                <FormInputDataList
                                    control={control}
                                    registerName="staff"
                                    data={staffDataOptions}
                                    placeholder="Select Staff"
                                    isLoading={staffLoading}
                                />
                                <button
                                    onClick={() => setMode("SELL")}
                                    className={mode === "SELL" ? styles.sellButtonActive : styles.sellButton}
                                >
                                    Sell
                                </button>
                                <button
                                    onClick={() => setMode("RENT")}
                                    className={mode === "RENT" ? styles.rentButtonActive : styles.rentButton}
                                >
                                    Rent
                                </button>
                            </div>
                            <button
                                onClick={handleBulkAdd}
                                disabled={!mode || isProcessing}
                                className={mode && !isProcessing ? styles.submitButtonActive : styles.submitButtonDisabled}
                            >
                                {isProcessing ? "Adding..." : `Add Lead to ${selectedCustomerIds.length} Customers`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default BulkAddLead; 