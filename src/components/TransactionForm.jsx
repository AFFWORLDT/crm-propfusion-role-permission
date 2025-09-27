import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    FaBuilding, 
    FaMoneyBillWave, 
    FaUser, 
    FaFileAlt, 
    FaCalendar,
    FaPercentage,
    FaUpload,
    FaTrash,
    FaChevronDown,
    FaChevronRight
} from 'react-icons/fa';
import { 
    TransactionType, 
    InternalTransactionType, 
    PropertyTransactionPurpose,
    SalaryType,
    PenaltyType,
    RevenueType,
    ExpenseType,
} from "../services/apiTransactions";
import styles from "./TransactionForm.module.css";
import Modal from "../ui/Modal";
import AgentChangeModal from "../ui/AgentChangeModal";
import useStaff from "../features/admin/staff/useStaff";

const TransactionForm = ({ 
    formData, 
    setFormData, 
    isEdit = false, 
    onSubmit, 
    onCancel,
    isSubmitting = false 
}) => {
    const [activeTab, setActiveTab] = useState("basic");
    const [uploadedFiles, setUploadedFiles] = useState({
        buyer_documents: [],
        seller_documents: [],
        tenant_documents: [],
        landlord_documents: [],
        property_documents: [],
        contract_documents: []
    });
    const { isLoading: isLoadingStaff, data: staffData } = useStaff();
    const [isChangingAgent, setIsChangingAgent] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState({
        buyer: true,
        seller: true,
        tenant: true,
        landlord: true,
        other: true
    });

    // Prepare agent options for FormInputDataList
    const agentOptions = staffData?.map((agent) => ({
        value: agent.id,
        label: agent.name
    })) || [];

    const handleFormChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const toggleSection = (sectionName) => {
        setCollapsedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    };

    const handleFileUpload = (documentType, files) => {
        const fileArray = Array.from(files);
        setUploadedFiles(prev => ({
            ...prev,
            [documentType]: [...prev[documentType], ...fileArray]
        }));
    };

    const removeFile = (documentType, index) => {
        const newFiles = uploadedFiles[documentType].filter((_, i) => i !== index);
        setUploadedFiles(prev => ({
            ...prev,
            [documentType]: newFiles
        }));
    };

    const calculateCommission = () => {
        const pt = formData.property_transaction;
        const dealPrice = pt.deal_price || 0;
        const commissionType = pt.commission_type;
        
        if (commissionType === 'percentage') {
        const commissionPercentage = pt.total_commission_percentage || 0;
        const calculatedCommission = (dealPrice * commissionPercentage) / 100;
        handleFormChange('property_transaction', 'total_commission', calculatedCommission);
        } else if (commissionType === 'fixed') {
            // For fixed amount, the total_commission is set directly by the user
            // No calculation needed here
        }
    };

    // Cascading commission calculation functions
    const getAvailableCommissionForCompany = () => {
        const totalCommission = formData.property_transaction.total_commission || 0;
        const a2aCommission = formData.property_transaction.A2A_commission || 0;
        return Math.max(0, totalCommission - a2aCommission);
    };

    const getAvailableCommissionForAgents = () => {
        const totalCommission = formData.property_transaction.total_commission || 0;
        const a2aCommission = formData.property_transaction.A2A_commission || 0;
        const companyCommission = formData.property_transaction.company_total_commission || 0;
        return Math.max(0, totalCommission - a2aCommission - companyCommission);
    };

    const calculateTotalCommissionSum = () => {
        const pt = formData.property_transaction;
        const sum = 
            (pt.A2A_commission || 0) +
            (pt.company_total_commission || 0) +
            (pt.agent_commissions?.reduce((total, agent) => total + (agent.commission_amount || 0), 0) || 0);
        return sum;
    };

    const getRemainingCommission = () => {
        const totalCommission = formData.property_transaction.total_commission || 0;
        const usedCommission = calculateTotalCommissionSum();
        return totalCommission - usedCommission;
    };

    const isCommissionValid = (newValue, currentSum) => {
        const totalCommission = formData.property_transaction.total_commission || 0;
        const remainingCommission = totalCommission - (currentSum - newValue);
        return remainingCommission >= 0;
    };

    const calculateCommissionFromPercentage = (percentage, fieldName) => {
        // For A2A Commission, use total commission as base
        if (fieldName === 'A2A_commission') {
            const totalCommission = formData.property_transaction.total_commission || 0;
            return (totalCommission * percentage) / 100;
        }
        
        // For Company Commission, use available commission after A2A as base
        if (fieldName === 'company_total_commission') {
            const availableForCompany = getAvailableCommissionForCompany();
            return (availableForCompany * percentage) / 100;
        }
        
        // For Agent Commissions, use available commission after A2A and Company as base
        if (fieldName === 'agent_commission') {
            const availableForAgents = getAvailableCommissionForAgents();
            return (availableForAgents * percentage) / 100;
        }
        
        // Fallback to deal price for other cases
        const dealPrice = formData.property_transaction.deal_price || 0;
        return (dealPrice * percentage) / 100;
    };

    const calculatePercentageFromCommission = (commissionAmount, fieldName) => {
        // For A2A Commission, use total commission as base
        if (fieldName === 'A2A_commission') {
            const totalCommission = formData.property_transaction.total_commission || 0;
            if (totalCommission === 0) return 0;
            return (commissionAmount / totalCommission) * 100;
        }
        
        // For Company Commission, use available commission after A2A as base
        if (fieldName === 'company_total_commission') {
            const availableForCompany = getAvailableCommissionForCompany();
            if (availableForCompany === 0) return 0;
            return (commissionAmount / availableForCompany) * 100;
        }
        
        // For Agent Commissions, use available commission after A2A and Company as base
        if (fieldName === 'agent_commission') {
            const availableForAgents = getAvailableCommissionForAgents();
            if (availableForAgents === 0) return 0;
            return (commissionAmount / availableForAgents) * 100;
        }
        
        // Fallback to deal price for other cases
        const dealPrice = formData.property_transaction.deal_price || 0;
        if (dealPrice === 0) return 0;
        return (commissionAmount / dealPrice) * 100;
    };

    useEffect(() => {
        if (formData.property_transaction.deal_price && formData.property_transaction.commission_type === 'percentage' && formData.property_transaction.total_commission_percentage) {
            calculateCommission();
        }
    }, [formData.property_transaction.deal_price, formData.property_transaction.total_commission_percentage, formData.property_transaction.commission_type]);

    const tabs = formData.transaction_type === TransactionType.PROPERTY_TRANSACTION
        ? [
        { id: "basic", label: "Basic Info", icon: FaBuilding },
        { id: "commission", label: "Commission", icon: FaPercentage },
        { id: "documents", label: "Documents", icon: FaFileAlt }
        ]
        : [
            { id: "basic", label: "Basic Info", icon: FaBuilding }
        ];

    useEffect(() => {
        if (activeTab !== "basic" && formData.transaction_type === TransactionType.INTERNAL_TRANSACTION) {
            setActiveTab("basic");
        }
    }, [formData.transaction_type]);

    function handleSelectAgent(agentId, onCloseModal) {
        setIsChangingAgent(true);
        const agent = (staffData || []).find((a) => a.id === agentId);
        setFormData((prev) => ({
            ...prev,
            agent_salary: {
                ...prev.agent_salary,
                agent_id: agentId,
                agent_name: agent?.name || "",
            },
        }));
        setIsChangingAgent(false);
        if (onCloseModal) onCloseModal();
    }

    return (
        <div className={styles.formContainer}>
            {/* Tab Navigation */}
            <div className={styles.tabNavigation}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                    >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Form Content */}
            <div className={styles.formContent}>
                {/* Basic Info Tab */}
                {activeTab === "basic" && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={styles.tabContent}
                    >
                        {/* Transaction Date - First */}
                        <div className={styles.formSection}>
                            <h4><FaCalendar /> Transaction Date</h4>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={formData.date || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                        className={styles.formInput}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <h4><FaBuilding /> Transaction Type</h4>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Transaction Type</label>
                                    <select
                                        value={formData.transaction_type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, transaction_type: e.target.value }))}
                                        className={styles.formInput}
                                    >
                                        <option value={TransactionType.PROPERTY_TRANSACTION}>Property Transaction</option>
                                        <option value={TransactionType.INTERNAL_TRANSACTION}>Internal Transaction</option>
                                    </select>
                                </div>
                                
                                {formData.transaction_type === TransactionType.INTERNAL_TRANSACTION && (
                                    <div className={styles.formGroup}>
                                        <label>Internal Transaction Type</label>
                                        <select
                                            value={formData.internal_transaction}
                                            onChange={(e) => setFormData(prev => ({ ...prev, internal_transaction: e.target.value }))}
                                            className={styles.formInput}
                                        >
                                            <option value="">Select Type</option>
                                            <option value={InternalTransactionType.AGENT_SALARY}>Agent Salary</option>
                                            <option value={InternalTransactionType.AGENT_PENALTY}>Agent Penalty</option>
                                            <option value={InternalTransactionType.COMPANY_INCOME}>Company Income</option>
                                            <option value={InternalTransactionType.COMPANY_EXPENSE}>Company Expense</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes removed from here; moved to the end to always be last */}

                        {formData.transaction_type === TransactionType.PROPERTY_TRANSACTION && (
                            <>
                                <div className={styles.formSection}>
                                    <h4><FaBuilding /> Property Information</h4>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Transaction Purpose</label>
                                            <select
                                                value={formData.property_transaction.property_transaction_purpose}
                                                onChange={(e) => handleFormChange('property_transaction', 'property_transaction_purpose', e.target.value)}
                                                className={styles.formInput}
                                            >
                                                <option value={PropertyTransactionPurpose.OFFPLAN_PRIMARY}>Offplan Primary</option>
                                                <option value={PropertyTransactionPurpose.SECONDARY}>Secondary</option>
                                                <option value={PropertyTransactionPurpose.RENT}>Rent</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Lead ID</label>
                                            <input
                                                type="text"
                                                value={formData.property_transaction.lead_id}
                                                onChange={(e) => handleFormChange('property_transaction', 'lead_id', e.target.value)}
                                                className={styles.formInput}
                                                placeholder="Enter Lead ID"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Property ID</label>
                                            <input
                                                type="text"
                                                value={formData.property_transaction.property_id}
                                                onChange={(e) => handleFormChange('property_transaction', 'property_id', e.target.value)}
                                                className={styles.formInput}
                                                placeholder="Enter Property ID"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Unit Number</label>
                                            <input
                                                type="text"
                                                value={formData.property_transaction.unit_number}
                                                onChange={(e) => handleFormChange('property_transaction', 'unit_number', e.target.value)}
                                                className={styles.formInput}
                                                placeholder="Enter Unit Number"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Property Name</label>
                                            <input
                                                type="text"
                                                value={formData.property_transaction.property_name}
                                                onChange={(e) => handleFormChange('property_transaction', 'property_name', e.target.value)}
                                                className={styles.formInput}
                                                placeholder="Enter Property Name"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Property Address</label>
                                            <input
                                                type="text"
                                                value={formData.property_transaction.property_address}
                                                onChange={(e) => handleFormChange('property_transaction', 'property_address', e.target.value)}
                                                className={styles.formInput}
                                                placeholder="Enter Property Address"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {formData.property_transaction.property_transaction_purpose === PropertyTransactionPurpose.RENT && (
                                <div className={styles.formSection}>
                                        <h4><FaCalendar /> Contract Period</h4>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                                <label>Date From</label>
                                            <input
                                                type="date"
                                                    value={formData.date_from || ""}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, date_from: e.target.value }))}
                                                className={styles.formInput}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                                <label>Date To</label>
                                            <input
                                                type="date"
                                                    value={formData.date_to || ""}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, date_to: e.target.value }))}
                                                className={styles.formInput}
                                            />
                                        </div>
                                    </div>
                                    </div>
                                )}

                                {/* Payment Details - Commented out
                                <div className={styles.formSection}>
                                    <h4><FaCalendar /> Payment Details</h4>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Payment Method</label>
                                            <select
                                                value={formData.property_transaction.payment_method}
                                                onChange={(e) => handleFormChange('property_transaction', 'payment_method', e.target.value)}
                                                className={styles.formInput}
                                            >
                                                <option value="">Select Payment Method</option>
                                                <option value="cash">Cash</option>
                                                <option value="bank_transfer">Bank Transfer</option>
                                                <option value="check">Check</option>
                                                <option value="credit_card">Credit Card</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Deposit Amount</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.deposit_amount}
                                                onChange={(e) => handleFormChange('property_transaction', 'deposit_amount', parseFloat(e.target.value) || 0)}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>
                                */}
                            </>
                        )}

                        {/* Deal Information - Only for Property Transactions */}
                        {formData.transaction_type === TransactionType.PROPERTY_TRANSACTION && (
                            <div className={styles.formSection}>
                                <h4><FaMoneyBillWave /> Deal Information</h4>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Deal Price (AED)</label>
                                        <input
                                            type="number"
                                            value={formData.property_transaction.deal_price}
                                            onChange={(e) => handleFormChange('property_transaction', 'deal_price', parseFloat(e.target.value) || 0)}
                                            className={styles.formInput}
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Commission Type</label>
                                        <select
                                            value={formData.property_transaction.commission_type}
                                            onChange={(e) => handleFormChange('property_transaction', 'commission_type', e.target.value)}
                                            className={styles.formInput}
                                        >
                                            <option value="">Select Commission Type</option>
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    {formData.property_transaction.commission_type === 'percentage' && (
                                        <div className={styles.formGroup}>
                                            <label>Commission Percentage (%)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.total_commission_percentage || ""}
                                                onChange={(e) => handleFormChange('property_transaction', 'total_commission_percentage', parseFloat(e.target.value) || 0)}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    )}
                                    <div className={styles.formGroup}>
                                        <label>Total Commission Amount (AED)</label>
                                        <input
                                            type="number"
                                            value={formData.property_transaction.total_commission || ""}
                                            onChange={(e) => handleFormChange('property_transaction', 'total_commission', parseFloat(e.target.value) || 0)}
                                            className={styles.formInput}
                                            placeholder="0.00"
                                            step="0.01"
                                            readOnly={formData.property_transaction.commission_type === 'percentage'}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Financial Details Tab */}
                {activeTab === "financial" && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={styles.tabContent}
                    >
                        {formData.transaction_type === TransactionType.PROPERTY_TRANSACTION ? (
                            <>
                        <div className={styles.formSection}>
                            <h4><FaMoneyBillWave /> Deal Information</h4>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                            <label>Deal Price (AED)</label>
                                    <input
                                        type="number"
                                        value={formData.property_transaction.deal_price}
                                        onChange={(e) => handleFormChange('property_transaction', 'deal_price', parseFloat(e.target.value) || 0)}
                                        className={styles.formInput}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Commission Type</label>
                                    <select
                                        value={formData.property_transaction.commission_type}
                                        onChange={(e) => handleFormChange('property_transaction', 'commission_type', e.target.value)}
                                        className={styles.formInput}
                                    >
                                        <option value="">Select Commission Type</option>
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>
                            </div>
                                    <div className={styles.formRow}>
                                        {formData.property_transaction.commission_type === 'percentage' && (
                                            <div className={styles.formGroup}>
                                                <label>Commission Percentage (%)</label>
                                                <input
                                                    type="number"
                                                    value={formData.property_transaction.total_commission_percentage || ""}
                                                    onChange={(e) => handleFormChange('property_transaction', 'total_commission_percentage', parseFloat(e.target.value) || 0)}
                                                    className={styles.formInput}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                />
                                            </div>
                                        )}
                                        <div className={styles.formGroup}>
                                            <label>Total Commission Amount (AED)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.total_commission || ""}
                                                onChange={(e) => handleFormChange('property_transaction', 'total_commission', parseFloat(e.target.value) || 0)}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                                readOnly={formData.property_transaction.commission_type === 'percentage'}
                                            />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <h4><FaUser /> A2A Commission</h4>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>A2A Commission Receiver</label>
                                    <input
                                        type="text"
                                        value={formData.property_transaction.A2A_commission_reciver_name}
                                        onChange={(e) => handleFormChange('property_transaction', 'A2A_commission_reciver_name', e.target.value)}
                                        className={styles.formInput}
                                        placeholder="Enter Receiver Name"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>A2A Commission</label>
                                    <input
                                        type="number"
                                        value={formData.property_transaction.A2A_commission}
                                        onChange={(e) => handleFormChange('property_transaction', 'A2A_commission', parseFloat(e.target.value) || 0)}
                                        className={styles.formInput}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>A2A VAT</label>
                                    <input
                                        type="number"
                                        value={formData.property_transaction.A2A_vat}
                                        onChange={(e) => handleFormChange('property_transaction', 'A2A_vat', parseFloat(e.target.value) || 0)}
                                        className={styles.formInput}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                            </>
                        ) : (
                            <>
                                {/* Common for internal transactions */}
                                <div className={styles.formSection}>
                                    <h4><FaCalendar /> Period</h4>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Period - Date From</label>
                                            <input
                                                type="date"
                                                value={formData.date_from || ""}
                                                onChange={(e) => setFormData(prev => ({ ...prev, date_from: e.target.value }))}
                                                className={styles.formInput}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Period - Date To</label>
                                            <input
                                                type="date"
                                                value={formData.date_to || ""}
                                                onChange={(e) => setFormData(prev => ({ ...prev, date_to: e.target.value }))}
                                                className={styles.formInput}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Agent Salary */}
                                {formData.internal_transaction === InternalTransactionType.AGENT_SALARY && (
                                <div className={styles.formSection}>
                                    <h4><FaMoneyBillWave /> Agent Salary Details</h4>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Agent</label>
                                            <Modal>
                                                <Modal.Open openWindowName="chooseAgent">
                                                    <button
                                                        type="button"
                                                        className={styles.formInput}
                                                        style={{ cursor: "pointer", textAlign: "left" }}
                                                        disabled={isLoadingStaff}
                                                    >
                                                        {isLoadingStaff
                                                            ? "Loading agents..."
                                                            : (formData.agent_salary.agent_name || "Select Agent")}
                                                    </button>
                                                </Modal.Open>
                                                <Modal.Window name="chooseAgent" overflow>
                                                    <AgentChangeModal
                                                        staffData={staffData}
                                                        onChangeAgent={handleSelectAgent}
                                                        isChangingAgent={isChangingAgent}
                                                    />
                                                </Modal.Window>
                                            </Modal>
                                            {!formData.agent_salary.agent_id && (
                                                <div style={{ marginTop: "8px" }}>
                                                    <input
                                                        type="text"
                                                        value={formData.agent_salary.agent_name}
                                                        onChange={(e) => handleFormChange('agent_salary', 'agent_name', e.target.value)}
                                                        className={styles.formInput}
                                                        placeholder="Or type agent name if not listed"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Salary Amount</label>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <input
                                                    type="number"
                                                    value={formData.agent_salary.salary_amount}
                                                    onChange={(e) => handleFormChange('agent_salary', 'salary_amount', parseFloat(e.target.value) || 0)}
                                                    className={styles.formInput}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                />
                                                <span style={{ whiteSpace: "nowrap" }}>AED</span>
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Salary Type</label>
                                            <select
                                                value={formData.agent_salary.salary_type}
                                                onChange={(e) => handleFormChange('agent_salary', 'salary_type', e.target.value)}
                                                className={styles.formInput}
                                            >
                                                <option value="">Select Type</option>
                                                <option value={SalaryType.FIXED}>Fixed</option>
                                                <option value={SalaryType.COMMISSION_BASED}>Commission Based</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                )}

                                {/* Agent Penalty */}
                                {formData.internal_transaction === InternalTransactionType.AGENT_PENALTY && (
                                <div className={styles.formSection}>
                                    <h4><FaMoneyBillWave /> Agent Penalty Details</h4>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Agent</label>
                                            <Modal>
                                                <Modal.Open openWindowName="chooseAgentPenalty">
                                                    <button
                                                        type="button"
                                                        className={styles.formInput}
                                                        style={{ cursor: "pointer", textAlign: "left" }}
                                                        disabled={isLoadingStaff}
                                                    >
                                                        {isLoadingStaff
                                                            ? "Loading agents..."
                                                            : (formData.agent_penalty.agent_name || "Select Agent")}
                                                    </button>
                                                </Modal.Open>
                                                <Modal.Window name="chooseAgentPenalty" overflow>
                                                    <AgentChangeModal
                                                        staffData={staffData}
                                                        onChangeAgent={(agentId, close) => {
                                                            const agent = (staffData || []).find((a) => a.id === agentId);
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                agent_penalty: {
                                                                    ...prev.agent_penalty,
                                                                    agent_id: agentId,
                                                                    agent_name: agent?.name || "",
                                                                }
                                                            }));
                                                            if (close) close();
                                                        }}
                                                        isChangingAgent={isChangingAgent}
                                                    />
                                                </Modal.Window>
                                            </Modal>
                                            {!formData.agent_penalty.agent_id && (
                                                <div style={{ marginTop: "8px" }}>
                                                    <input
                                                        type="text"
                                                        value={formData.agent_penalty.agent_name}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, agent_penalty: { ...prev.agent_penalty, agent_name: e.target.value } }))}
                                                        className={styles.formInput}
                                                        placeholder="Or type agent name if not listed"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Penalty Amount</label>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <input
                                                    type="number"
                                                    value={formData.agent_penalty.penalty_amount}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, agent_penalty: { ...prev.agent_penalty, penalty_amount: parseFloat(e.target.value) || 0 } }))}
                                                    className={styles.formInput}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                />
                                                <span style={{ whiteSpace: "nowrap" }}>AED</span>
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Penalty Type</label>
                                            <select
                                                value={formData.agent_penalty.penalty_type}
                                                onChange={(e) => setFormData(prev => ({ ...prev, agent_penalty: { ...prev.agent_penalty, penalty_type: e.target.value } }))}
                                                className={styles.formInput}
                                            >
                                                <option value="">Select Type</option>
                                                <option value={PenaltyType.LATE_SUBMISSION}>Late Submission</option>
                                                <option value={PenaltyType.ABSENCE}>Absence</option>
                                                <option value={PenaltyType.MISCONDUCT}>Misconduct</option>
                                                <option value={PenaltyType.OTHER}>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                )}

                                {/* Company Income */}
                                {formData.internal_transaction === InternalTransactionType.COMPANY_INCOME && (
                        <div className={styles.formSection}>
                                    <h4><FaMoneyBillWave /> Company Income Details</h4>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                            <label>Revenue Amount</label>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <input
                                        type="number"
                                                    value={formData.company_revenue.revenue_amount}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, company_revenue: { ...prev.company_revenue, revenue_amount: parseFloat(e.target.value) || 0 } }))}
                                        className={styles.formInput}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                                <span style={{ whiteSpace: "nowrap" }}>AED</span>
                                            </div>
                                </div>
                                <div className={styles.formGroup}>
                                            <label>Revenue Type</label>
                                            <select
                                                value={formData.company_revenue.revenue_type}
                                                onChange={(e) => setFormData(prev => ({ ...prev, company_revenue: { ...prev.company_revenue, revenue_type: e.target.value } }))}
                                                className={styles.formInput}
                                            >
                                                <option value="">Select Type</option>
                                                <option value={RevenueType.SERVICE_FEE}>Service Fee</option>
                                                <option value={RevenueType.COMMISSION}>Commission</option>
                                                <option value={RevenueType.ADVERTISING}>Advertising</option>
                                                <option value={RevenueType.INTEREST}>Interest</option>
                                                <option value={RevenueType.OTHER}>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                )}

                                {/* Company Expense */}
                                {formData.internal_transaction === InternalTransactionType.COMPANY_EXPENSE && (
                                <div className={styles.formSection}>
                                    <h4><FaMoneyBillWave /> Company Expense Details</h4>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Expense Amount</label>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <input
                                        type="number"
                                                    value={formData.company_expense.expense_amount}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, company_expense: { ...prev.company_expense, expense_amount: parseFloat(e.target.value) || 0 } }))}
                                        className={styles.formInput}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                                <span style={{ whiteSpace: "nowrap" }}>AED</span>
                                </div>
                            </div>
                                        <div className={styles.formGroup}>
                                            <label>Expense Type</label>
                                            <select
                                                value={formData.company_expense.expense_type}
                                                onChange={(e) => setFormData(prev => ({ ...prev, company_expense: { ...prev.company_expense, expense_type: e.target.value } }))}
                                                className={styles.formInput}
                                            >
                                                <option value="">Select Type</option>
                                                <option value={ExpenseType.RENT}>Rent</option>
                                                <option value={ExpenseType.UTILITIES}>Utilities</option>
                                                <option value={ExpenseType.MARKETING}>Marketing</option>
                                                <option value={ExpenseType.SALARIES}>Salaries</option>
                                                <option value={ExpenseType.OFFICE_SUPPLIES}>Office Supplies</option>
                                                <option value={ExpenseType.OTHER}>Other</option>
                                            </select>
                        </div>
                                    </div>
                                </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}

                {/* Commission Tab */}
                {activeTab === "commission" && formData.transaction_type === TransactionType.PROPERTY_TRANSACTION && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={styles.tabContent}
                    >
                        {/* Commission Summary */}
                        <div className={styles.formSection} style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h4 style={{ margin: 0, color: '#495057' }}>Commission Summary</h4>
                                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                                    Total Available: <strong>{formData.property_transaction.total_commission || 0} AED</strong>
                                </div>
                            </div>
                            
                            {/* Cascading Commission Breakdown */}
                            <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ color: '#6c757d' }}>A2A Commission:</span>
                                    <span><strong>{formData.property_transaction.A2A_commission || 0} AED</strong></span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ color: '#6c757d' }}>Available for Company:</span>
                                    <span style={{ color: getAvailableCommissionForCompany() > 0 ? '#28a745' : '#dc3545' }}>
                                        <strong>{getAvailableCommissionForCompany()} AED</strong>
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ color: '#6c757d' }}>Company Commission:</span>
                                    <span><strong>{formData.property_transaction.company_total_commission || 0} AED</strong></span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ color: '#6c757d' }}>Available for Agents:</span>
                                    <span style={{ color: getAvailableCommissionForAgents() > 0 ? '#28a745' : '#dc3545' }}>
                                        <strong>{getAvailableCommissionForAgents()} AED</strong>
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ color: '#6c757d' }}>Agent Commissions:</span>
                                    <span><strong>{(formData.property_transaction.agent_commissions || []).reduce((sum, agent) => sum + (agent.commission_amount || 0), 0)} AED</strong></span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #dee2e6', paddingTop: '0.5rem' }}>
                                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                                    Total Used: <strong>{calculateTotalCommissionSum()} AED</strong>
                                </div>
                                <div style={{ 
                                    fontSize: '0.9rem', 
                                    color: getRemainingCommission() >= 0 ? '#28a745' : '#dc3545',
                                    fontWeight: 'bold'
                                }}>
                                    Remaining: <strong>{getRemainingCommission()} AED</strong>
                                </div>
                            </div>
                            {getRemainingCommission() < 0 && (
                                <div style={{ 
                                    marginTop: '0.5rem', 
                                    padding: '0.5rem', 
                                    backgroundColor: '#f8d7da', 
                                    color: '#721c24', 
                                    borderRadius: '4px',
                                    fontSize: '0.85rem'
                                }}>
                                    ⚠️ Commission total exceeds available amount by {Math.abs(getRemainingCommission())} AED
                                </div>
                            )}
                        </div>

                        {/* A2A Commission */}
                        <div className={styles.formSection}>
                            <h4><FaUser /> A2A Commission</h4>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>A2A Commission Receiver</label>
                                    <input
                                        type="text"
                                        value={formData.property_transaction.A2A_commission_reciver_name}
                                        onChange={(e) => handleFormChange('property_transaction', 'A2A_commission_reciver_name', e.target.value)}
                                        className={styles.formInput}
                                        placeholder="Enter Receiver Name"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>A2A Commission (AED)</label>
                                    <input
                                        type="number"
                                        value={formData.property_transaction.A2A_commission}
                                        onChange={(e) => {
                                            const newValue = parseFloat(e.target.value) || 0;
                                            const totalCommission = formData.property_transaction.total_commission || 0;
                                            
                                            // A2A Commission can use up to the total commission
                                            if (newValue <= totalCommission) {
                                                // Update amount
                                                handleFormChange('property_transaction', 'A2A_commission', newValue);
                                                
                                                // Update percentage
                                                const calculatedPercentage = calculatePercentageFromCommission(newValue, 'A2A_commission');
                                                handleFormChange('property_transaction', 'A2A_commission_percentage', calculatedPercentage);
                                            }
                                        }}
                                        className={styles.formInput}
                                        placeholder="0.00"
                                        step="0.01"
                                        max={formData.property_transaction.total_commission || 0}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>A2A Commission Percentage (%)</label>
                                    <input
                                        type="number"
                                        value={formData.property_transaction.A2A_commission_percentage || ""}
                                        onChange={(e) => {
                                            const newPercentage = parseFloat(e.target.value) || 0;
                                            const calculatedAmount = calculateCommissionFromPercentage(newPercentage, 'A2A_commission');
                                            const totalCommission = formData.property_transaction.total_commission || 0;
                                            
                                            // Update percentage
                                            handleFormChange('property_transaction', 'A2A_commission_percentage', newPercentage);
                                            
                                            // Update amount if it doesn't exceed total commission
                                            if (calculatedAmount <= totalCommission) {
                                                handleFormChange('property_transaction', 'A2A_commission', calculatedAmount);
                                            }
                                        }}
                                        className={styles.formInput}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>A2A VAT (AED)</label>
                                    <input
                                        type="number"
                                        value={formData.property_transaction.A2A_vat}
                                        onChange={(e) => handleFormChange('property_transaction', 'A2A_vat', parseFloat(e.target.value) || 0)}
                                        className={styles.formInput}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Buyer Commission - Commented out
                        <div className={styles.formSection}>
                            <div 
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: collapsedSections.buyer ? '0' : '1rem' }}
                                onClick={() => toggleSection('buyer')}
                            >
                                {collapsedSections.buyer ? <FaChevronRight size={16} /> : <FaChevronDown size={16} />}
                                <h4 style={{ margin: '0 0 0 8px' }}><FaUser /> Buyer Commission</h4>
                            </div>
                            {!collapsedSections.buyer && (
                                <>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Buyer Commission Amount (AED)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.buyer_commission_amount || ""}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value) || 0;
                                                    const currentSum = calculateTotalCommissionSum();
                                                    const currentBuyer = formData.property_transaction.buyer_commission_amount || 0;
                                                    const sumWithoutBuyer = currentSum - currentBuyer;
                                                    
                                                    if (isCommissionValid(newValue, sumWithoutBuyer + newValue)) {
                                                        // Update amount
                                                        handleFormChange('property_transaction', 'buyer_commission_amount', newValue);
                                                        
                                                        // Update percentage
                                                        const calculatedPercentage = calculatePercentageFromCommission(newValue);
                                                        handleFormChange('property_transaction', 'buyer_commission_percentage', calculatedPercentage);
                                                    }
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                                max={getRemainingCommission() + (formData.property_transaction.buyer_commission_amount || 0)}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Buyer Commission Percentage (%)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.buyer_commission_percentage || ""}
                                                onChange={(e) => {
                                                    const newPercentage = parseFloat(e.target.value) || 0;
                                                    const calculatedAmount = calculateCommissionFromPercentage(newPercentage);
                                                    
                                                    // Update percentage
                                                    handleFormChange('property_transaction', 'buyer_commission_percentage', newPercentage);
                                                    
                                                    // Update amount if validation passes
                                                    const currentSum = calculateTotalCommissionSum();
                                                    const currentBuyer = formData.property_transaction.buyer_commission_amount || 0;
                                                    const sumWithoutBuyer = currentSum - currentBuyer;
                                                    
                                                    if (isCommissionValid(calculatedAmount, sumWithoutBuyer + calculatedAmount)) {
                                                        handleFormChange('property_transaction', 'buyer_commission_amount', calculatedAmount);
                                                    }
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Buyer VAT (AED)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.buyer_vat || ""}
                                                onChange={(e) => handleFormChange('property_transaction', 'buyer_vat', parseFloat(e.target.value) || 0)}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        */}

                        {/* Seller Commission - Commented out
                        <div className={styles.formSection}>
                            <div 
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: collapsedSections.seller ? '0' : '1rem' }}
                                onClick={() => toggleSection('seller')}
                            >
                                {collapsedSections.seller ? <FaChevronRight size={16} /> : <FaChevronDown size={16} />}
                                <h4 style={{ margin: '0 0 0 8px' }}><FaUser /> Seller Commission</h4>
                            </div>
                            {!collapsedSections.seller && (
                                <>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Seller Commission Amount (AED)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.seller_commission || ""}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value) || 0;
                                                    const currentSum = calculateTotalCommissionSum();
                                                    const currentSeller = formData.property_transaction.seller_commission || 0;
                                                    const sumWithoutSeller = currentSum - currentSeller;
                                                    
                                                    if (isCommissionValid(newValue, sumWithoutSeller + newValue)) {
                                                        // Update amount
                                                        handleFormChange('property_transaction', 'seller_commission', newValue);
                                                        
                                                        // Update percentage
                                                        const calculatedPercentage = calculatePercentageFromCommission(newValue);
                                                        handleFormChange('property_transaction', 'seller_commission_percentage', calculatedPercentage);
                                                    }
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                                max={getRemainingCommission() + (formData.property_transaction.seller_commission || 0)}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Seller Commission Percentage (%)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.seller_commission_percentage || ""}
                                                onChange={(e) => {
                                                    const newPercentage = parseFloat(e.target.value) || 0;
                                                    const calculatedAmount = calculateCommissionFromPercentage(newPercentage);
                                                    
                                                    // Update percentage
                                                    handleFormChange('property_transaction', 'seller_commission_percentage', newPercentage);
                                                    
                                                    // Update amount if validation passes
                                                    const currentSum = calculateTotalCommissionSum();
                                                    const currentSeller = formData.property_transaction.seller_commission || 0;
                                                    const sumWithoutSeller = currentSum - currentSeller;
                                                    
                                                    if (isCommissionValid(calculatedAmount, sumWithoutSeller + calculatedAmount)) {
                                                        handleFormChange('property_transaction', 'seller_commission', calculatedAmount);
                                                    }
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Seller VAT (AED)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.sellers_vat || ""}
                                                onChange={(e) => handleFormChange('property_transaction', 'sellers_vat', parseFloat(e.target.value) || 0)}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        */}

                        {/* Tenant Commission - Commented out
                        <div className={styles.formSection}>
                            <div 
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: collapsedSections.tenant ? '0' : '1rem' }}
                                onClick={() => toggleSection('tenant')}
                            >
                                {collapsedSections.tenant ? <FaChevronRight size={16} /> : <FaChevronDown size={16} />}
                                <h4 style={{ margin: '0 0 0 8px' }}><FaUser /> Tenant Commission</h4>
                            </div>
                            {!collapsedSections.tenant && (
                                <>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Tenant Commission Amount (AED)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.tenant_commission || ""}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value) || 0;
                                                    const currentSum = calculateTotalCommissionSum();
                                                    const currentTenant = formData.property_transaction.tenant_commission || 0;
                                                    const sumWithoutTenant = currentSum - currentTenant;
                                                    
                                                    if (isCommissionValid(newValue, sumWithoutTenant + newValue)) {
                                                        // Update amount
                                                        handleFormChange('property_transaction', 'tenant_commission', newValue);
                                                        
                                                        // Update percentage
                                                        const calculatedPercentage = calculatePercentageFromCommission(newValue);
                                                        handleFormChange('property_transaction', 'tenant_commission_percentage', calculatedPercentage);
                                                    }
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                                max={getRemainingCommission() + (formData.property_transaction.tenant_commission || 0)}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Tenant Commission Percentage (%)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.tenant_commission_percentage || ""}
                                                onChange={(e) => {
                                                    const newPercentage = parseFloat(e.target.value) || 0;
                                                    const calculatedAmount = calculateCommissionFromPercentage(newPercentage);
                                                    
                                                    // Update percentage
                                                    handleFormChange('property_transaction', 'tenant_commission_percentage', newPercentage);
                                                    
                                                    // Update amount if validation passes
                                                    const currentSum = calculateTotalCommissionSum();
                                                    const currentTenant = formData.property_transaction.tenant_commission || 0;
                                                    const sumWithoutTenant = currentSum - currentTenant;
                                                    
                                                    if (isCommissionValid(calculatedAmount, sumWithoutTenant + calculatedAmount)) {
                                                        handleFormChange('property_transaction', 'tenant_commission', calculatedAmount);
                                                    }
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Tenant VAT (AED)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.tenant_vat || ""}
                                                onChange={(e) => handleFormChange('property_transaction', 'tenant_vat', parseFloat(e.target.value) || 0)}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        */}

                        {/* Landlord Commission - Commented out
                        <div className={styles.formSection}>
                            <div 
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: collapsedSections.landlord ? '0' : '1rem' }}
                                onClick={() => toggleSection('landlord')}
                            >
                                {collapsedSections.landlord ? <FaChevronRight size={16} /> : <FaChevronDown size={16} />}
                                <h4 style={{ margin: '0 0 0 8px' }}><FaUser /> Landlord Commission</h4>
                            </div>
                            {!collapsedSections.landlord && (
                                <>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Landlord Commission Amount (AED)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.landlord_commission || ""}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value) || 0;
                                                    const currentSum = calculateTotalCommissionSum();
                                                    const currentLandlord = formData.property_transaction.landlord_commission || 0;
                                                    const sumWithoutLandlord = currentSum - currentLandlord;
                                                    
                                                    if (isCommissionValid(newValue, sumWithoutLandlord + newValue)) {
                                                        // Update amount
                                                        handleFormChange('property_transaction', 'landlord_commission', newValue);
                                                        
                                                        // Update percentage
                                                        const calculatedPercentage = calculatePercentageFromCommission(newValue);
                                                        handleFormChange('property_transaction', 'landlord_commission_percentage', calculatedPercentage);
                                                    }
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                                max={getRemainingCommission() + (formData.property_transaction.landlord_commission || 0)}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Landlord Commission Percentage (%)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.landlord_commission_percentage || ""}
                                                onChange={(e) => {
                                                    const newPercentage = parseFloat(e.target.value) || 0;
                                                    const calculatedAmount = calculateCommissionFromPercentage(newPercentage);
                                                    
                                                    // Update percentage
                                                    handleFormChange('property_transaction', 'landlord_commission_percentage', newPercentage);
                                                    
                                                    // Update amount if validation passes
                                                    const currentSum = calculateTotalCommissionSum();
                                                    const currentLandlord = formData.property_transaction.landlord_commission || 0;
                                                    const sumWithoutLandlord = currentSum - currentLandlord;
                                                    
                                                    if (isCommissionValid(calculatedAmount, sumWithoutLandlord + calculatedAmount)) {
                                                        handleFormChange('property_transaction', 'landlord_commission', calculatedAmount);
                                                    }
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Landlord VAT (AED)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.landlord_vat || ""}
                                                onChange={(e) => handleFormChange('property_transaction', 'landlord_vat', parseFloat(e.target.value) || 0)}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        */}

                        {/* Other Commission - Commented out
                        <div className={styles.formSection}>
                            <div 
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: collapsedSections.other ? '0' : '1rem' }}
                                onClick={() => toggleSection('other')}
                            >
                                {collapsedSections.other ? <FaChevronRight size={16} /> : <FaChevronDown size={16} />}
                                <h4 style={{ margin: '0 0 0 8px' }}><FaUser /> Other Commission</h4>
                            </div>
                            {!collapsedSections.other && (
                                <>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Other Commission Amount (AED)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.other_commission || ""}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value) || 0;
                                                    const currentSum = calculateTotalCommissionSum();
                                                    const currentOther = formData.property_transaction.other_commission || 0;
                                                    const sumWithoutOther = currentSum - currentOther;
                                                    
                                                    if (isCommissionValid(newValue, sumWithoutOther + newValue)) {
                                                        // Update amount
                                                        handleFormChange('property_transaction', 'other_commission', newValue);
                                                        
                                                        // Update percentage
                                                        const calculatedPercentage = calculatePercentageFromCommission(newValue);
                                                        handleFormChange('property_transaction', 'other_commission_percentage', calculatedPercentage);
                                                    }
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                                max={getRemainingCommission() + (formData.property_transaction.other_commission || 0)}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Other Commission Percentage (%)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.other_commission_percentage || ""}
                                                onChange={(e) => {
                                                    const newPercentage = parseFloat(e.target.value) || 0;
                                                    const calculatedAmount = calculateCommissionFromPercentage(newPercentage);
                                                    
                                                    // Update percentage
                                                    handleFormChange('property_transaction', 'other_commission_percentage', newPercentage);
                                                    
                                                    // Update amount if validation passes
                                                    const currentSum = calculateTotalCommissionSum();
                                                    const currentOther = formData.property_transaction.other_commission || 0;
                                                    const sumWithoutOther = currentSum - currentOther;
                                                    
                                                    if (isCommissionValid(calculatedAmount, sumWithoutOther + calculatedAmount)) {
                                                        handleFormChange('property_transaction', 'other_commission', calculatedAmount);
                                                    }
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Other VAT (AED)</label>
                                            <input
                                                type="number"
                                                value={formData.property_transaction.other_vat || ""}
                                                onChange={(e) => handleFormChange('property_transaction', 'other_vat', parseFloat(e.target.value) || 0)}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        */}

                        {/* Company Commission */}
                        <div className={styles.formSection}>
                            <h4><FaBuilding /> Company Commission</h4>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Company Total Commission (AED)</label>
                                    <input
                                        type="number"
                                        value={formData.property_transaction.company_total_commission || ""}
                                        onChange={(e) => {
                                            const newValue = parseFloat(e.target.value) || 0;
                                            const availableForCompany = getAvailableCommissionForCompany();
                                            
                                            // Company Commission can use what's left after A2A
                                            if (newValue <= availableForCompany) {
                                                // Update amount
                                                handleFormChange('property_transaction', 'company_total_commission', newValue);
                                                
                                                // Update percentage
                                                const calculatedPercentage = calculatePercentageFromCommission(newValue, 'company_total_commission');
                                                handleFormChange('property_transaction', 'company_total_commission_percentage', calculatedPercentage);
                                            }
                                        }}
                                        className={styles.formInput}
                                        placeholder="0.00"
                                        step="0.01"
                                        max={getAvailableCommissionForCompany()}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Company Commission Percentage (%)</label>
                                    <input
                                        type="number"
                                        value={formData.property_transaction.company_total_commission_percentage || ""}
                                        onChange={(e) => {
                                            const newPercentage = parseFloat(e.target.value) || 0;
                                            const calculatedAmount = calculateCommissionFromPercentage(newPercentage, 'company_total_commission');
                                            const availableForCompany = getAvailableCommissionForCompany();
                                            
                                            // Update percentage
                                            handleFormChange('property_transaction', 'company_total_commission_percentage', newPercentage);
                                            
                                            // Update amount if it doesn't exceed available commission
                                            if (calculatedAmount <= availableForCompany) {
                                                handleFormChange('property_transaction', 'company_total_commission', calculatedAmount);
                                            }
                                        }}
                                        className={styles.formInput}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Agent Commissions */}
                        <div className={styles.formSection}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4><FaUser /> Agent Commissions</h4>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newAgentCommission = {
                                            agent_id: null,
                                            agent_name: "",
                                            commission_amount: 0,
                                            commission_percentage: 0,
                                            commission_type: "primary",
                                            notes: ""
                                        };
                                        setFormData(prev => ({
                                            ...prev,
                                            property_transaction: {
                                                ...prev.property_transaction,
                                                agent_commissions: [...(prev.property_transaction.agent_commissions || []), newAgentCommission]
                                            }
                                        }));
                                    }}
                                    className={styles.addButton}
                                >
                                    + Add Agent Commission
                                </button>
                            </div>

                            {formData.property_transaction.agent_commissions?.map((agentCommission, index) => (
                                <div key={index} className={styles.agentCommissionCard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h5>Agent Commission #{index + 1}</h5>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    property_transaction: {
                                                        ...prev.property_transaction,
                                                        agent_commissions: prev.property_transaction.agent_commissions.filter((_, i) => i !== index)
                                                    }
                                                }));
                                            }}
                                            className={styles.removeButton}
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Agent</label>
                                            <select
                                                value={agentCommission.agent_id || ""}
                                                onChange={(e) => {
                                                    const selectedAgentId = e.target.value;
                                                    const selectedAgent = staffData?.find(agent => agent.id === parseInt(selectedAgentId));
                                                    
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        property_transaction: {
                                                            ...prev.property_transaction,
                                                            agent_commissions: prev.property_transaction.agent_commissions.map((ac, i) => 
                                                                i === index ? { 
                                                                    ...ac, 
                                                                    agent_id: selectedAgentId ? parseInt(selectedAgentId) : null, 
                                                                    agent_name: selectedAgent?.name || "" 
                                                                } : ac
                                                            )
                                                        }
                                                    }));
                                                }}
                                                className={styles.formInput}
                                                disabled={isLoadingStaff}
                                            >
                                                <option value="">Select Agent</option>
                                                {agentOptions.map((agent) => (
                                                    <option key={agent.value} value={agent.value}>
                                                        {agent.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Commission Type</label>
                                            <select
                                                value={agentCommission.commission_type || "primary"}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        property_transaction: {
                                                            ...prev.property_transaction,
                                                            agent_commissions: prev.property_transaction.agent_commissions.map((ac, i) => 
                                                                i === index ? { ...ac, commission_type: e.target.value } : ac
                                                            )
                                                        }
                                                    }));
                                                }}
                                                className={styles.formInput}
                                            >
                                                <option value="primary">Primary</option>
                                                <option value="secondary">Secondary</option>
                                                <option value="referral">Referral</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label>Commission Amount (AED)</label>
                                            <input
                                                type="number"
                                                value={agentCommission.commission_amount || ""}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value) || 0;
                                                    const availableForAgents = getAvailableCommissionForAgents();
                                                    
                                                    // Agent Commission can use what's left after A2A and Company
                                                    if (newValue <= availableForAgents) {
                                                        // Update amount
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            property_transaction: {
                                                                ...prev.property_transaction,
                                                                agent_commissions: prev.property_transaction.agent_commissions.map((ac, i) => 
                                                                    i === index ? { ...ac, commission_amount: newValue } : ac
                                                                )
                                                            }
                                                        }));
                                                        
                                                        // Update percentage
                                                        const calculatedPercentage = calculatePercentageFromCommission(newValue, 'agent_commission');
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            property_transaction: {
                                                                ...prev.property_transaction,
                                                                agent_commissions: prev.property_transaction.agent_commissions.map((ac, i) => 
                                                                    i === index ? { ...ac, commission_percentage: calculatedPercentage } : ac
                                                                )
                                                            }
                                                        }));
                                                    }
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                                max={getAvailableCommissionForAgents()}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Commission Percentage (%)</label>
                                            <input
                                                type="number"
                                                value={agentCommission.commission_percentage || ""}
                                                onChange={(e) => {
                                            const newPercentage = parseFloat(e.target.value) || 0;
                                            const calculatedAmount = calculateCommissionFromPercentage(newPercentage, 'agent_commission');
                                            
                                            // Update percentage
                                            setFormData(prev => ({
                                                ...prev,
                                                property_transaction: {
                                                    ...prev.property_transaction,
                                                    agent_commissions: prev.property_transaction.agent_commissions.map((ac, i) => 
                                                        i === index ? { ...ac, commission_percentage: newPercentage } : ac
                                                    )
                                                }
                                            }));
                                            
                                            // Update amount if it doesn't exceed available commission
                                            const availableForAgents = getAvailableCommissionForAgents();
                                            
                                            if (calculatedAmount <= availableForAgents) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    property_transaction: {
                                                        ...prev.property_transaction,
                                                        agent_commissions: prev.property_transaction.agent_commissions.map((ac, i) => 
                                                            i === index ? { ...ac, commission_amount: calculatedAmount } : ac
                                                        )
                                                    }
                                                }));
                                            }
                                        }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formRow}>
                                        {/* Commission Received Amount - Commented out
                                        <div className={styles.formGroup}>
                                            <label>Commission Received Amount (AED)</label>
                                            <input
                                                type="number"
                                                value={agentCommission.commission_received_amount || ""}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        property_transaction: {
                                                            ...prev.property_transaction,
                                                            agent_commissions: prev.property_transaction.agent_commissions.map((ac, i) => 
                                                                i === index ? { ...ac, commission_received_amount: parseFloat(e.target.value) || 0 } : ac
                                                            )
                                                        }
                                                    }));
                                                }}
                                                className={styles.formInput}
                                                placeholder="0.00"
                                                step="0.01"
                                            />
                                        </div>
                                        */}
                                        <div className={styles.formGroup}>
                                            <label>Notes</label>
                                            <input
                                                type="text"
                                                value={agentCommission.notes || ""}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        property_transaction: {
                                                            ...prev.property_transaction,
                                                            agent_commissions: prev.property_transaction.agent_commissions.map((ac, i) => 
                                                                i === index ? { ...ac, notes: e.target.value } : ac
                                                            )
                                                        }
                                                    }));
                                                }}
                                                className={styles.formInput}
                                                placeholder="Add notes for this agent commission"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Documents Tab */}
                {activeTab === "documents" && formData.transaction_type === TransactionType.PROPERTY_TRANSACTION && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={styles.tabContent}
                    >
                        <div className={styles.formSection}>
                            <h4><FaFileAlt /> Document Upload</h4>
                            
                            {Object.entries(uploadedFiles).map(([docType, files]) => (
                                <div key={docType} className={styles.documentSection}>
                                    <h5>{docType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h5>
                                    <div className={styles.fileUploadArea}>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => handleFileUpload(docType, e.target.files)}
                                            className={styles.fileInput}
                                            id={`file-${docType}`}
                                        />
                                        <label htmlFor={`file-${docType}`} className={styles.fileUploadLabel}>
                                            <FaUpload size={20} />
                                            <span>Click to upload files</span>
                                        </label>
                                    </div>
                                    
                                    {files.length > 0 && (
                                        <div className={styles.fileList}>
                                            {files.map((file, index) => (
                                                <div key={index} className={styles.fileItem}>
                                                    <FaFileAlt size={16} />
                                                    <span>{file.name}</span>
                                                    <button
                                                        onClick={() => removeFile(docType, index)}
                                                        className={styles.removeFileButton}
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Global Notes - always last */}
            <div className={styles.formSection}>
                <h4><FaFileAlt /> Notes</h4>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Notes</label>
                        <input
                            type="text"
                            value={formData.notes || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            className={styles.formInput}
                            placeholder="Add any notes"
                        />
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
                <button
                    type="button"
                    onClick={onCancel}
                    className={styles.cancelButton}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className={styles.submitButton}
                >
                    {isSubmitting ? "Saving..." : (isEdit ? "Update Transaction" : "Create Transaction")}
                </button>
            </div>
        </div>
    );
};

export default TransactionForm;
