import  { useEffect, useState } from 'react'
import styles from "./../../styles/Audience.module.css";
import {
    UserPlus,
    Edit2,
    Mail,
    Plus,
    X,
    Save,
    CheckCircle,
    XCircle,
    Loader,
} from "lucide-react";
import useCreateAudience, { useCreateAudienceprivate } from './useCreateAudience';
import { useAudiencesById } from './useAudince';
import useUpdateAudience from './useUpdate';


function Modal({ handleCloseModal, isSimpleForm, id, setId }) {
    const editMode = id ? true : false;
    const [submitLoading, setSubmitLoading] = useState(false);
    const { addAudience, isPending } = useCreateAudience();
    const { updatedata } = useUpdateAudience();
    const { addAudiencep } = useCreateAudienceprivate();
    const { data } = useAudiencesById(id);
    const [currentEmail, setCurrentEmail] = useState('');
    
    const [formData, setFormData] = useState({
        affiliate_id: "",
        name: "String",
        emails: [],
        audience_type: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Email validation function
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    };

    // Process multiple emails
    const processEmails = (emailInput) => {
        const emailArray = emailInput
            .split(/[,;\n]/)
            .map(email => email.trim())
            .filter(email => email !== '');

        const validEmails = emailArray
            .filter(email => isValidEmail(email))
            .filter(email => !formData.emails.includes(email));

        if (validEmails.length > 0) {
            setFormData(prev => ({
                ...prev,
                emails: [...prev.emails, ...validEmails]
            }));
        }

        setCurrentEmail('');
    };

 
    const handleEmailKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            processEmails(currentEmail);
        }
    };

    const handleEmailInputChange = (e) => {
        setCurrentEmail(e.target.value);
    };
   
    

    const handleEmailBlur = () => {
        if (currentEmail.trim()) {
            processEmails(currentEmail);
        }
    };

    const removeEmail = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            emails: prev.emails.filter((_, index) => index !== indexToRemove)
        }));
    };

    useEffect(() => {
        if (editMode && data) {
            setFormData({
                name: data.name || "",
                emails: data.emails || [],
                audience_type: data.audience_type || "",
            });
        }
    }, [editMode, data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentEmail.trim()) {
            processEmails(currentEmail);
        }
        
        setSubmitLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (editMode) {
                updatedata({ id: id, payload: formData });
                setId(null);
            } else {
                if(isSimpleForm) {
                    addAudiencep(formData);
                } else {
                    addAudience(formData);
                }
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.headerWithIcon}>
                    {editMode ? (
                        <>
                            <Edit2 className={`${styles.icon} ${styles.iconMedium}`} />
                            Edit Audience
                        </>
                    ) : isSimpleForm ? (
                        <>
                            <Plus className={`${styles.icon} ${styles.iconMedium}`} />
                            Quick Create Audience
                        </>
                    ) : (
                        <>
                            <UserPlus className={`${styles.icon} ${styles.iconMedium}`} />
                            Create Audience
                        </>
                    )}
                </h2>
                <form onSubmit={handleSubmit}>
                    {!isSimpleForm && (
                        <div className={styles.formGroup}>
                            <label>Affiliate ID</label>
                            <input
                                type="text"
                                name="affiliate_id"
                                value={formData.affiliate_id}
                                onChange={handleInputChange}
                                required
                                disabled={submitLoading}
                            />
                        </div>
                    )}
                    {/* <div className={styles.formGroup}>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            disabled={submitLoading}
                        />
                    </div> */}
                    <div className={styles.formGroup}>
                        <label>Audience Type</label>
                        <input
                            type="text"
                            name="audience_type"
                            value={formData.audience_type}
                            onChange={handleInputChange}
                            required
                            disabled={submitLoading}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.labelWithIcon}>
                            <Mail className={styles.iconSmall} />
                            Emails
                        </label>
                        <p className={styles.helperText}>
                            Enter multiple emails separated by comma, semicolon, or new line
                        </p>
                        <div className={styles.emailInputWrapper}>
                            <textarea
                                value={currentEmail}
                                onChange={handleEmailInputChange}
                                onKeyDown={handleEmailKeyDown}
                                onBlur={handleEmailBlur}
                                placeholder="example1@email.com, example2@email.com"
                                className={styles.emailTextarea}
                                disabled={submitLoading}
                            />
                        </div>

                        <div className={styles.emailContainer}>
                            {formData.emails.length === 0 ? (
                                <p className={styles.emptyMessage}>
                                    No emails added yet
                                </p>
                            ) : (
                                <div className={styles.emailTags}>
                                    {formData.emails.map((email, index) => (
                                        <div key={index} className={styles.emailTag}>
                                            <span className={styles.emailText}>{email}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeEmail(index)}
                                                className={styles.removeButton}
                                                disabled={submitLoading}
                                                aria-label="Remove email"
                                            >
                                                <X className={styles.removeIcon} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className={styles.emailFooter}>
                            <span className={styles.emailCount}>
                                {formData.emails.length} email{formData.emails.length !== 1 ? 's' : ''} added
                            </span>
                            {formData.emails.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, emails: [] }))}
                                    className={styles.clearButton}
                                    disabled={submitLoading}
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.modalButtons}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isPending || submitLoading}
                        >
                            {submitLoading ? (
                                <>
                                    <Loader className={styles.spinner} size={16} />
                                    {editMode ? "Updating..." : "Creating..."}
                                </>
                            ) : editMode ? (
                                <>
                                    <Save size={16} />
                                    Update
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={16} />
                                    Create
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className={styles.cancelButton}
                            disabled={isPending || submitLoading}
                        >
                            <XCircle size={16} />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Modal;