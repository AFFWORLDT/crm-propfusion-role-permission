import { PlusIcon } from "lucide-react";
import useCreateLead from "../leads/useCreateLead";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import useStaff from "../admin/staff/useStaff";
import FormInputDataList from "../../ui/FormInputDataList";
import { useForm } from "react-hook-form";

function AddLead({ data }) {
    const { addLead, isPending } = useCreateLead();
    const [showModal, setShowModal] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const { currentUser } = useAuth();
    const { data: staffData, isLoading: staffLoading } = useStaff();
    const { control } = useForm();

    const staffDataOptions = staffData?.map((item) => ({
        label: item?.name,
        value: item?.id,
    }));

    // Automatically set current user as selected staff
    useEffect(() => {
        if (currentUser && staffData && staffData.length > 0) {
            const currentUserStaff = staffData.find(staff => staff.id === currentUser.id);
            if (currentUserStaff) {
                control.setValue("staff", {
                    value: currentUserStaff.id,
                    label: currentUserStaff.name
                });
            }
        }
    }, [currentUser, staffData, control]);

    const commonButtonStyles = {
        padding: "6px 12px",
        borderRadius: "8px",
        backgroundColor: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "14px",
        fontWeight: "800",
        transition: "all 0.2s ease",
    };

    const modalStyles = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '30px 40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        minWidth: '400px',
    };

    const overlayStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 999,
    };

    const modalHeaderStyles = {
        textAlign: 'center',
        marginBottom: '25px',
        color: '#2c3e50',
        fontSize: '20px',
        fontWeight: '600',
        borderBottom: '2px solid #eee',
        paddingBottom: '15px',
    };

    const buttonGroupStyles = {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
    };

    const getClientTypeButtonStyles = (type) => ({
        padding: '12px 30px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '15px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '120px',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: type === 'RENT' 
            ? hoveredButton === 'RENT' ? '#2ecc71' : '#27ae60'
            : hoveredButton === 'SELL' ? '#3498db' : '#2980b9',
        color: 'white',
        boxShadow: hoveredButton === type 
            ? '0 6px 12px rgba(0, 0, 0, 0.2)' 
            : '0 4px 8px rgba(0, 0, 0, 0.1)',
        transform: hoveredButton === type ? 'translateY(-2px)' : 'translateY(0)',
    });

    const iconStyles = {
        width: '18px',
        height: '18px',
        transition: 'transform 0.3s ease',
        transform: 'translateY(1px)',
    };

    function handleAddLead(clientType) {
        const payload = {};
        
        if (data?.OwnerNAME && data.OwnerNAME !== "N/A") {
            payload.name = data.OwnerNAME;
        }
        
        if (data?.["Contact number"] && data["Contact number"] !== "N/A") {
            payload.phone = String(data["Contact number"]);
        }
        
        if (data?.Email && data.Email !== "N/A") {
            payload.email = data.Email;
        }
        
        if (data?.Nationality && data.Nationality !== "N/A") {
            payload.nationality = data.Nationality;
        }
        
        payload.clientSource = "Company Website";
        payload.status = "ACTIVE";
        payload.isClaim = "NO";
        payload.clientType = clientType;
        payload.agent_Id = currentUser?.id;
        
        addLead(payload);
        setShowModal(false);
    }

    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                disabled={isPending}
                style={{
                    ...commonButtonStyles,
                    border: "0.1px dashed #db0a0a",
                    color: "#db0a0a",
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#fce1e1";
                    e.target.style.color = "#db0a0a";
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#db0a0a";
                }}
            >
                <PlusIcon size={20} />
            </button>

            {showModal && (
                <>
                    <div style={overlayStyles} onClick={() => setShowModal(false)} />
                    <div style={modalStyles}>
                        <h3 style={modalHeaderStyles}>Select Client Type</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <FormInputDataList
                                control={control}
                                registerName="staff"
                                data={staffDataOptions}
                                placeholder="Select Staff Member"
                                isLoading={staffLoading}
                                required={true}
                                isDisabled={true}
                            />
                        </div>
                        <div style={buttonGroupStyles}>
                            <button
                                onClick={() => handleAddLead('RENT')}
                                onMouseEnter={() => setHoveredButton('RENT')}
                                onMouseLeave={() => setHoveredButton(null)}
                                style={getClientTypeButtonStyles('RENT')}
                            >
                                <svg 
                                    style={iconStyles}
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                >
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                RENT
                            </button>
                            <button
                                onClick={() => handleAddLead('SELL')}
                                onMouseEnter={() => setHoveredButton('SELL')}
                                onMouseLeave={() => setHoveredButton(null)}
                                style={getClientTypeButtonStyles('SELL')}
                            >
                                <svg 
                                    style={iconStyles}
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                >
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                                SELL
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default AddLead;
