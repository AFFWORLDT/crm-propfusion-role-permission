import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionTop from "../../ui/SectionTop";
import useStaff from "../../features/admin/staff/useStaff";
import useTeam from "../../features/admin/teams/useTeam";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import styles from "./StaffDetails.module.css";
import useUploadDocs from "../../features/admin/staff/useUploadDocs";
import useDeleteDocs from "../../features/admin/staff/useDeleteDocs";
import { Upload, FileText, Trash2, Edit3, Save, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStaff } from "../../services/apiStaff";
import axiosInstance from "../../utils/axiosInstance";

function StaffDetails() {
    const { staffId } = useParams();
    const queryClient = useQueryClient();
    
    // State for edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        job_type: '',
        payment_type: '',
        commission_percentage: '',
        salary: '',
        designation: '',
        staff_level: ''
    });
    const {
        addDocs,
        isPending: isUploading,
        error: uploadError,
    } = useUploadDocs();
    const {
        deleteDocs,
        isPending: isDeleting,
        error: deleteError,
    } = useDeleteDocs();

    const { data: staffData, isLoading, error } = useStaff(staffId);
    const { data: teamData } = useTeam(staffData?.team);

    const {
        mutate: updateWhatsAppNotification,
        isPending: isUpdatingNotification,
    } = useMutation({
        mutationFn: ({ id, whatsapp_notification }) =>
            updateStaff(id, { whatsapp_notification }),
        onSuccess: () => {
            toast.success("WhatsApp notification settings updated!");
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
        onError: (err) => toast.error(err.message),
    });

    const {
        mutate: updateStaffData,
        isPending: isUpdatingStaff,
    } = useMutation({
        mutationFn: ({ id, data }) => updateStaff(id, data),
        onSuccess: () => {
            toast.success("Staff information updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            setIsEditing(false);
        },
        onError: (err) => toast.error(err.message),
    });

    const {
        mutate: updateKycVerification,
        isPending: isUpdatingKyc,
    } = useMutation({
        mutationFn: ({ id, kyc_verification }) =>
            updateStaff(id, { kyc_verification }),
        onSuccess: () => {
            toast.success("KYC verification status updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
        onError: (err) => toast.error(err.message),
    });

    const handleWhatsAppToggle = (e) => {
        const newValue = e.target.checked;
        updateWhatsAppNotification({
            id: staffId,
            whatsapp_notification: newValue,
        });
    };

    const handleKycToggle = () => {
        const newValue = !staffData.kyc_verification;
        updateKycVerification({
            id: staffId,
            kyc_verification: newValue,
        });
    };

    const handleEditClick = () => {
        setEditData({
            job_type: staffData.job_type || '',
            payment_type: staffData.payment_type || '',
            commission_percentage: staffData.commission_percentage || '0',
            salary: staffData.salary || '0',
            designation: staffData.designation || '',
            staff_level: staffData.staff_level || ''
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditData({
            job_type: '',
            payment_type: '',
            commission_percentage: '',
            salary: '',
            designation: '',
            staff_level: ''
        });
    };

    const handleSaveEdit = () => {
        // Prepare base payload
        const payload = {
            designation: editData.designation,
            staff_level: editData.staff_level
        };

        // Only include job_type if it's selected
        if (editData.job_type) {
            payload.job_type = editData.job_type;
        }

        // Only include payment details if payment_type is selected and has valid values
        if (editData.payment_type) {
            payload.payment_type = editData.payment_type;

            // Only include salary/commission based on payment type and if they have meaningful values
            if (editData.payment_type === 'salary' && editData.salary && editData.salary !== '0') {
                payload.salary = editData.salary;
            } else if (editData.payment_type === 'commission' && editData.commission_percentage && editData.commission_percentage !== '0') {
                payload.commission_percentage = editData.commission_percentage;
            } else if (editData.payment_type === 'hybrid') {
                // For hybrid, only include fields that have meaningful values
                if (editData.salary && editData.salary !== '0') {
                    payload.salary = editData.salary;
                }
                if (editData.commission_percentage && editData.commission_percentage !== '0') {
                    payload.commission_percentage = editData.commission_percentage;
                }
            }
        }

        updateStaffData({
            id: staffId,
            data: payload
        });
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => {
            const newData = { ...prev, [field]: value };
            
            // Handle payment type logic
            if (field === 'payment_type') {
                switch (value) {
                    case 'salary':
                        newData.commission_percentage = '0';
                        newData.salary = prev.salary || '0';
                        break;
                    case 'commission':
                        newData.salary = '0';
                        newData.commission_percentage = prev.commission_percentage || '0';
                        break;
                    case 'hybrid':
                        newData.salary = prev.salary || '0';
                        newData.commission_percentage = prev.commission_percentage || '0';
                        break;
                    default:
                        newData.salary = '0';
                        newData.commission_percentage = '0';
                }
            }
            
            return newData;
        });
    };

    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            addDocs({ agentId: staffId, docs: files });
        }
    };
    const handleVideoUpload = async (e) => {
        try {
            const files = e.target.files;
            if (files.length > 0) {
                const formData = new FormData();
                formData.append("video", files[0]);
                const res = await axiosInstance.post(
                    `/agent/${staffId}/upload_video`,
                    formData
                );
                if (res?.status === 200) {
                    toast.success(
                        res?.data.message || "Video uploaded successfully"
                    );
                    queryClient.invalidateQueries({ queryKey: ["staff"] });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteDoc = (docUrl) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
            deleteDocs({ agentId: staffId, docUrls: [docUrl] });
        }
    };
    const handleDeleteVideo = async() => {
        try {
            if (window.confirm("Are you sure you want to delete this Video?")) {
                const res = await axiosInstance.delete(
                    `/agent/${staffId}/delete_video`
                );
                if (res?.status === 200) {
                    toast.success(
                        res?.data.message || "Video deleted successfully"
                    );
                    queryClient.invalidateQueries({ queryKey: ["staff"] });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    useEffect(() => {
        if (uploadError) toast.error(uploadError.message);
    }, [uploadError]);

    useEffect(() => {
        if (deleteError) toast.error(deleteError.message);
    }, [deleteError]);

    if (isLoading) return <Spinner type="fullPage" />;
    if (!staffData) return null;

    let nationality = null;
    if (staffData.nationality) {
        try {
            if (
                typeof staffData.nationality === "string" &&
                (staffData.nationality.startsWith("{") ||
                    staffData.nationality.startsWith("["))
            ) {
                nationality = JSON.parse(staffData.nationality);
            } else if (typeof staffData.nationality === "object") {
                nationality = staffData.nationality;
            } else {
                nationality = {
                    label: staffData.nationality,
                    flag: null,
                };
            }
        } catch (e) {
            console.error("Error parsing nationality:", e);
            nationality = {
                label: staffData.nationality,
                flag: null,
            };
        }
    }

    const formattedDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="sectionContainer">
            <SectionTop heading="Staff Details" />

            <section className="sectionStyles">
                <div className={styles.profileSection}>
                    <img
                        src={staffData.avatar}
                        alt={staffData.name}
                        className={styles.avatar}
                    />
                    <h2>{staffData.name}</h2>
                    <p className={styles.role}>
                        {staffData.role === "super_admin"
                            ? "Super Admin"
                            : staffData.role
                              ? staffData.role.charAt(0).toUpperCase() +
                                staffData.role.slice(1)
                              : staffData.role_name || "Staff"}
                    </p>
                    <div className={styles.statusIndicator}>
                        <span
                            className={`${styles.status} ${staffData.state === "active" ? styles.active : styles.inactive}`}
                        >
                            {staffData.state === "active"
                                ? "Active"
                                : "Inactive"}
                        </span>
                    </div>
                </div>

                <div className={styles.detailsGrid}>
                    <div className={styles.detailCard}>
                        <h3>Personal Information</h3>
                        <div className={styles.detailCardContent}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>
                                    Gender
                                </span>
                                <span className={styles.detailValue}>
                                    {staffData.gender}
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>
                                    Date of Birth
                                </span>
                                <span className={styles.dateValue}>
                                    {formattedDate(staffData.dob)}
                                </span>
                            </div>
                            {nationality && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>
                                        Nationality
                                    </span>
                                    <div className={styles.nationalityInfo}>
                                        {nationality.flag && (
                                            <img
                                                src={nationality.flag}
                                                alt={nationality.label}
                                                className={
                                                    styles.nationalityFlag
                                                }
                                            />
                                        )}
                                        <span className={styles.detailValue}>
                                            {nationality.label}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.detailCard}>
                        <h3>Contact Information</h3>
                        <div className={styles.detailCardContent}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>
                                    Email
                                </span>
                                <span className={styles.detailValue}>
                                    {staffData.email}
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>
                                    Phone
                                </span>
                                <span className={styles.detailValue}>
                                    {staffData.phone}
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Team</span>
                                <span className={styles.detailValue}>
                                    {teamData?.name || "Not Assigned"}
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>
                                    WhatsApp Notifications
                                </span>
                                <div className={styles.notificationToggle}>
                                    <label
                                        style={{
                                            position: "relative",
                                            display: "inline-block",
                                            width: "50px",
                                            height: "24px",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                staffData.whatsapp_notification
                                            }
                                            onChange={handleWhatsAppToggle}
                                            disabled={isUpdatingNotification}
                                            style={{
                                                opacity: 0,
                                                width: 0,
                                                height: 0,
                                            }}
                                        />
                                        <span
                                            style={{
                                                position: "absolute",
                                                cursor: isUpdatingNotification
                                                    ? "not-allowed"
                                                    : "pointer",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor:
                                                    staffData.whatsapp_notification
                                                        ? "#4CAF50"
                                                        : "#ccc",
                                                transition: "0.3s",
                                                borderRadius: "24px",
                                                opacity: isUpdatingNotification
                                                    ? 0.7
                                                    : 1,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    content: '""',
                                                    height: "18px",
                                                    width: "18px",
                                                    left: "3px",
                                                    bottom: "3px",
                                                    backgroundColor: "white",
                                                    transition: "0.3s",
                                                    borderRadius: "50%",
                                                    transform:
                                                        staffData.whatsapp_notification
                                                            ? "translateX(26px)"
                                                            : "translateX(0)",
                                                }}
                                            />
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.detailCard}>
                        <h3>Identification</h3>
                        <div className={styles.detailCardContent}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>
                                    BRN Number
                                </span>
                                <span className={styles.detailValue}>
                                    {staffData.brn_number || "Not Provided"}
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>
                                    KYC Verification
                                </span>
                                <div className={styles.kycToggleContainer}>
                                    <div
                                        className={`${styles.kycToggle} ${
                                            staffData.kyc_verification
                                                ? styles.verified
                                                : styles.unverified
                                        } ${isUpdatingKyc ? styles.loading : ""}`}
                                        onClick={
                                            !isUpdatingKyc ? handleKycToggle : undefined
                                        }
                                    >
                                        <div className={styles.toggleTrack}>
                                            <div className={styles.toggleThumb} />
                                            {isUpdatingKyc && (
                                                <div
                                                    className={styles.loadingSpinner}
                                                />
                                            )}
                                        </div>
                                        <div className={styles.toggleStatus}>
                                            <span className={styles.toggleLabel}>
                                                {isUpdatingKyc
                                                    ? "Updating..."
                                                    : staffData.kyc_verification
                                                      ? "Verified"
                                                      : "Unverified"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.detailCard}>
                        <h3>Languages</h3>
                        <div className={styles.detailCardContent}>
                            {staffData.languages &&
                            staffData.languages.length > 0 ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "0.5rem",
                                    }}
                                >
                                    {staffData.languages.map((lang, index) => (
                                        <span
                                            key={index}
                                            className={styles.languageBadge}
                                        >
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    No languages specified
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.detailCard} style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)', border: '1px solid #e3f2fd', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <h3 style={{ 
                            background: 'linear-gradient(135deg, #1976d2, #42a5f5)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent',
                            fontSize: '1.4rem',
                            fontWeight: '700',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ 
                                background: 'linear-gradient(135deg, #1976d2, #42a5f5)', 
                                borderRadius: '50%', 
                                width: '8px', 
                                height: '8px',
                                display: 'inline-block'
                            }}></span>
                            Specialities & Designation
                        </h3>
                        <div className={styles.detailCardContent}>
                            {/* Designation Field */}
                            <div style={{ 
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem',
                                border: '1px solid #e1f5fe',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #1976d2, #42a5f5, #66bb6a)'
                                }}></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                    <span style={{ 
                                        fontSize: '1.1rem', 
                                        fontWeight: '600', 
                                        color: '#1976d2',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span style={{ 
                                            background: '#1976d2', 
                                            borderRadius: '50%', 
                                            width: '6px', 
                                            height: '6px',
                                            display: 'inline-block'
                                        }}></span>
                                        Designation
                                    </span>
                                </div>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className={styles.editInput}
                                        value={editData.designation}
                                        onChange={(e) => handleInputChange('designation', e.target.value)}
                                        placeholder="Enter designation"
                                        disabled={isUpdatingStaff}
                                        style={{ 
                                            width: '100%', 
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: '2px solid #e3f2fd',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            background: '#ffffff'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#1976d2';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e3f2fd';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                ) : (
                                    <div style={{ 
                                        fontSize: '1.2rem', 
                                        fontWeight: '700', 
                                        color: '#1976d2',
                                        background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        padding: '0.5rem 0',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {staffData.designation || 'Not Specified'}
                                    </div>
                                )}
                            </div>

                            {/* Staff Level Field */}
                            <div style={{ 
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                marginBottom: '1.5rem',
                                border: '1px solid #e1f5fe',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #f57c00, #ffb74d, #ffcc02)'
                                }}></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                    <span style={{ 
                                        fontSize: '1.1rem', 
                                        fontWeight: '600', 
                                        color: '#f57c00',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span style={{ 
                                            background: '#f57c00', 
                                            borderRadius: '50%', 
                                            width: '6px', 
                                            height: '6px',
                                            display: 'inline-block'
                                        }}></span>
                                        Staff Level
                                    </span>
                                </div>
                                {isEditing ? (
                                    <select
                                        className={styles.editInput}
                                        value={editData.staff_level}
                                        onChange={(e) => handleInputChange('staff_level', e.target.value)}
                                        disabled={isUpdatingStaff}
                                        style={{ 
                                            width: '100%', 
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            border: '2px solid #e3f2fd',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            background: '#ffffff',
                                            cursor: 'pointer'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#f57c00';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(245, 124, 0, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e3f2fd';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        <option value="">Select Staff Level</option>
                                        <option value="Essential">Essential</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Exclusive">Exclusive</option>
                                    </select>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {staffData.staff_level ? (
                                            <span 
                                                style={{ 
                                                    background: staffData.staff_level === 'Exclusive' ? 'linear-gradient(135deg, #e3f2fd, #bbdefb)' : 
                                                               staffData.staff_level === 'Premium' ? 'linear-gradient(135deg, #fff3e0, #ffcc80)' : 
                                                               'linear-gradient(135deg, #f3e5f5, #e1bee7)',
                                                    color: staffData.staff_level === 'Exclusive' ? '#1976d2' : 
                                                           staffData.staff_level === 'Premium' ? '#f57c00' : '#7b1fa2',
                                                    border: staffData.staff_level === 'Exclusive' ? '2px solid #1976d2' : 
                                                            staffData.staff_level === 'Premium' ? '2px solid #f57c00' : '2px solid #7b1fa2',
                                                    padding: '0.75rem 1.5rem',
                                                    borderRadius: '25px',
                                                    fontWeight: '700',
                                                    fontSize: '1rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <span style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '2px',
                                                    background: staffData.staff_level === 'Exclusive' ? 'linear-gradient(90deg, #1976d2, #42a5f5)' : 
                                                               staffData.staff_level === 'Premium' ? 'linear-gradient(90deg, #f57c00, #ffb74d)' : 
                                                               'linear-gradient(90deg, #7b1fa2, #ba68c8)'
                                                }}></span>
                                                {staffData.staff_level}
                                            </span>
                                        ) : (
                                            <span style={{ 
                                                color: '#9e9e9e', 
                                                fontStyle: 'italic',
                                                fontSize: '1rem'
                                            }}>
                                                Not Specified
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Specialities */}
                            <div style={{ 
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                border: '1px solid #e1f5fe',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #66bb6a, #81c784, #a5d6a7)'
                                }}></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <span style={{ 
                                        fontSize: '1.1rem', 
                                        fontWeight: '600', 
                                        color: '#66bb6a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span style={{ 
                                            background: '#66bb6a', 
                                            borderRadius: '50%', 
                                            width: '6px', 
                                            height: '6px',
                                            display: 'inline-block'
                                        }}></span>
                                        Specialities
                                    </span>
                                </div>
                                {staffData.specialities &&
                                staffData.specialities.length > 0 ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "0.75rem",
                                        }}
                                    >
                                        {staffData.specialities.map(
                                            (speciality, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #e8f5e8, #f1f8e9)',
                                                        color: '#2e7d32',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '600',
                                                        border: '1px solid #c8e6c9',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                        transition: 'all 0.3s ease',
                                                        cursor: 'default'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = 'translateY(-2px)';
                                                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                                    }}
                                                >
                                                    {speciality}
                                                </span>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ 
                                        color: '#9e9e9e', 
                                        fontStyle: 'italic',
                                        textAlign: 'center',
                                        padding: '1rem',
                                        background: '#fafafa',
                                        borderRadius: '8px',
                                        border: '1px dashed #e0e0e0'
                                    }}>
                                        No specialities specified
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.detailCard}>
                        <div className={styles.detailCardHeader}>
                            <h3>Additional Information</h3>
                            {!isEditing && (
                                <button
                                    className={styles.editButton}
                                    onClick={handleEditClick}
                                    disabled={isUpdatingStaff}
                                >
                                    <Edit3 size={16} />
                                    Edit
                                </button>
                            )}
                            {isEditing && (
                                <div className={styles.editActions}>
                                    <button
                                        className={styles.saveButton}
                                        onClick={handleSaveEdit}
                                        disabled={isUpdatingStaff}
                                    >
                                        <Save size={16} />
                                        Save
                                    </button>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={handleCancelEdit}
                                        disabled={isUpdatingStaff}
                                    >
                                        <X size={16} />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className={styles.detailCardContent}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>
                                    Created At
                                </span>
                                <span className={styles.dateValue}>
                                    {formattedDate(staffData.created_at)}
                                </span>
                            </div>
                            
                            {/* Job Type Field */}
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>
                                    Job Type
                                </span>
                                {isEditing ? (
                                    <select
                                        className={styles.editInput}
                                        value={editData.job_type}
                                        onChange={(e) => handleInputChange('job_type', e.target.value)}
                                        disabled={isUpdatingStaff}
                                    >
                                        <option value="">Select Job Type</option>
                                        <option value="full_time">Full Time</option>
                                        <option value="part_time">Part Time</option>
                                        <option value="affiliate">Affiliate</option>
                                    </select>
                                ) : (
                                    <span className={styles.detailValue}>
                                        {staffData.job_type ? 
                                            staffData.job_type.charAt(0).toUpperCase() + 
                                            staffData.job_type.slice(1).replace('_', ' ') 
                                            : 'Not Specified'
                                        }
                                    </span>
                                )}
                            </div>

                            {/* Payment Type Field */}
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>
                                    Payment Type
                                </span>
                                {isEditing ? (
                                    <select
                                        className={styles.editInput}
                                        value={editData.payment_type}
                                        onChange={(e) => handleInputChange('payment_type', e.target.value)}
                                        disabled={isUpdatingStaff}
                                    >
                                        <option value="">Select Payment Type</option>
                                        <option value="salary">Salary</option>
                                        <option value="commission">Commission</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                ) : (
                                    <span className={styles.detailValue}>
                                        {staffData.payment_type ? 
                                            staffData.payment_type.charAt(0).toUpperCase() + 
                                            staffData.payment_type.slice(1) 
                                            : 'Not Specified'
                                        }
                                    </span>
                                )}
                            </div>

                            {/* Salary Field - Show only for Salary or Hybrid */}
                            {(staffData.payment_type === 'salary' || staffData.payment_type === 'hybrid' || 
                              (isEditing && (editData.payment_type === 'salary' || editData.payment_type === 'hybrid'))) && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>
                                        Salary (AED)
                                    </span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className={styles.editInput}
                                            value={editData.salary}
                                            onChange={(e) => handleInputChange('salary', e.target.value)}
                                            placeholder="Enter salary amount"
                                            disabled={isUpdatingStaff}
                                        />
                                    ) : (
                                        <span className={styles.detailValue}>
                                            {staffData.salary && staffData.salary !== '0' ? `AED ${staffData.salary}` : 'AED 0'}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Commission Percentage Field - Show only for Commission or Hybrid */}
                            {(staffData.payment_type === 'commission' || staffData.payment_type === 'hybrid' || 
                              (isEditing && (editData.payment_type === 'commission' || editData.payment_type === 'hybrid'))) && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>
                                        Commission (%)
                                    </span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className={styles.editInput}
                                            value={editData.commission_percentage}
                                            onChange={(e) => handleInputChange('commission_percentage', e.target.value)}
                                            placeholder="Enter commission percentage"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            disabled={isUpdatingStaff}
                                        />
                                    ) : (
                                        <span className={styles.detailValue}>
                                            {staffData.commission_percentage && staffData.commission_percentage !== '0' ? `${staffData.commission_percentage}%` : '0%'}
                                        </span>
                                    )}
                                </div>
                            )}


                            {staffData.remarks && (
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>
                                        Remarks
                                    </span>
                                    <span className={styles.detailValue}>
                                        {staffData.remarks}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className={`${styles.detailCard} ${styles.fullWidthCard}`}
                    >
                        <div className={styles.documentHeader}>
                            <h3>Documents</h3>
                            <label
                                className={`${styles.uploadButton} ${isUploading ? styles.uploading : ""}`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={handleFileUpload}
                                    style={{ display: "none" }}
                                    disabled={isUploading || isDeleting}
                                />
                                <Upload size={16} />
                                <span>
                                    {isUploading
                                        ? "Uploading..."
                                        : "Upload Document"}
                                </span>
                            </label>
                        </div>
                        <div className={styles.detailCardContent}>
                            {staffData.documents &&
                            staffData.documents.length > 0 ? (
                                <div className={styles.documentsContainer}>
                                    {staffData.documents.map((doc, index) => {
                                        const isImage = doc.match(
                                            /\.(jpg|jpeg|png|gif|webp)$/i
                                        );
                                        return (
                                            <div
                                                key={index}
                                                className={styles.documentItem}
                                            >
                                                {isImage ? (
                                                    <div
                                                        className={
                                                            styles.imageContainer
                                                        }
                                                    >
                                                        <img
                                                            src={doc}
                                                            alt={`Document ${index + 1}`}
                                                            className={
                                                                styles.documentImage
                                                            }
                                                        />
                                                        <a
                                                            href={doc}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={
                                                                styles.viewFullButton
                                                            }
                                                        >
                                                            View Full
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <a
                                                        href={doc}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={
                                                            styles.documentLink
                                                        }
                                                    >
                                                        <FileText size={16} />
                                                        <span>
                                                            Document {index + 1}
                                                        </span>
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handleDeleteDoc(doc)
                                                    }
                                                    className={
                                                        styles.deleteButton
                                                    }
                                                    disabled={isDeleting}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    No documents available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Video Upload */}
                    <div
                        className={`${styles.detailCard} ${styles.fullWidthCard}`}
                    >
                        <div className={styles.documentHeader}>
                            <h3>Videos</h3>
                            <label
                                className={`${styles.uploadButton} ${isUploading ? styles.uploading : ""}`}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="video/*"
                                    onChange={handleVideoUpload}
                                    style={{ display: "none" }}
                                />
                                <Upload size={16} />
                                <span>Upload Video</span>
                            </label>
                        </div>
                        <div className={styles.videoCard}>
                            {staffData.videoLink && (
                                <div className={styles.videoWrapper}>
                                    <div className={styles.videoContainer}>
                                        <div className={styles.videoHolder}>
                                            <video
                                                src={staffData.videoLink}
                                                className={styles.videoPlayer}
                                                controls
                                            />
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleDeleteVideo(
                                                    staffData.videoLink
                                                )
                                            }
                                            className={styles.removeButton}
                                            disabled={isDeleting}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default StaffDetails;
