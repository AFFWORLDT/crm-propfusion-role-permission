import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./AddNewOwner.module.css";
import { Building2, User, FileText, Mail, Phone, IdCard, Upload, X, Calendar } from "lucide-react";
import useCreateOwner from "../../features/Owner/useCreateOwner";
import FormInputCountries from "../../ui/FormInputCountries";
import useAllDetails from "../all-details/useAllDetails";

const AddNewOwner = ({ ownerId, onClose, heading, onCloseModal }) => {
    const {data}=useAllDetails()
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        defaultValues: {
            owner_type: "",
            owner_name: "",
            owner_info: "",
            lessor_name: "",
            lessor_emirates_id: "",
            license_no: "",
            lessor_email: "",
            lessor_phone: "",
            nationality: " ",
            secondryPhone: "",
            transaction_type: "",
            dob: "",
        },
    });

    const { addOwner, updateOwner, ownerData, isLoading, isError, error, isAddingOwner } =
        useCreateOwner(ownerId);

    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
   
    useEffect(() => {
        if (ownerData) {
            // Convert ISO timestamp to YYYY-MM-DD format for date input
            let formattedDob = "";
            if (ownerData.dob) {
                const dobDate = new Date(ownerData.dob);
                formattedDob = dobDate.toISOString().split('T')[0];
            }

            reset({
                owner_type: ownerData.owner_type || "",
                owner_name: ownerData.owner_name || "",
                owner_info: ownerData.owner_info || "",
                lessor_name: ownerData.lessor_name || "",
                lessor_emirates_id: ownerData.lessor_emirates_id || "",
                license_no: ownerData.license_no || "",
                lessor_email: ownerData.lessor_email || "",
                lessor_phone: ownerData.lessor_phone || "",
                nationality: ownerData.nationality || "",
                secondryPhone: ownerData.secondryPhone || "",
                transaction_type: ownerData.transaction_type || "",
                dob: formattedDob,
            });
            if (ownerData.profile_pic) {
                setPreviewUrl(ownerData?.profile_pic);
            }
        }
    }, [ownerData, reset]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setAvatarFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const onSubmit = async (data) => {
        if (!ownerId && !onClose) {
            onCloseModal();
        }
        
        // Format DOB to ISO timestamp format if provided
        let formattedDob = data.dob;
        if (data.dob) {
            const dobDate = new Date(data.dob);
            formattedDob = dobDate.toISOString();
        }
        
        const formattedData = Object.entries({
            ...data,
            nationality: data.nationality.value,
            dob: formattedDob,
        }).reduce((acc, [key, value]) => {
            if (value !== "") {
                acc[key] = value;
            }
            return acc;
        }, {});

        if (ownerId) {
            updateOwner({
                id: ownerId,
                data: formattedData,
                avatarFile: avatarFile
            }, {
                onSuccess: () => {
                    reset();
                }
            });
        } else {
            addOwner({
                data: formattedData,
                avatarFile: avatarFile
            }, {
                onSettled: () => {
                    reset();
                }
            });
        }
        onCloseModal();
    };

    if (ownerId && isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading owner details...</p>
            </div>
        );
    }

    if (ownerId && isError) {
        return (
            <div className={styles.errorContainer}>
                <p>Error: {error?.message || "Failed to load owner data"}</p>
            </div>
        );
    }

    return (
        <div className={styles.formWrapper}>
            <div className={styles.modalHeading}>
                <h2>{heading}</h2>
                {onClose && (
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={24} />
                    </button>
                )}
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.profileImageContainer}>
                    <div className={styles.profileImageWrapper}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Profile" className={styles.profileImage} />
                        ) : (
                            <div className={styles.profileImagePlaceholder}>
                                <User size={50} />
                            </div>
                        )}
                        <label className={styles.fileInputLabel}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className={styles.fileInput}
                            />
                            <Upload size={16} />
                            <span>Upload</span>
                        </label>
                    </div>
                </div>

                <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                        <label>
                            <Building2 size={16} />
                            Transaction Type
                        </label>
                        <select
                            {...register("transaction_type", { required: "Transaction type is required" })}
                            disabled={isLoading || isAddingOwner}
                        >
                            <option value="">Select Type</option>
                            <option value="Buyer">Buyer</option>
                            <option value="Seller">Seller</option>
                        </select>
                        {errors.transaction_type && (
                            <span className={styles.error}>{errors.transaction_type.message}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <Building2 size={16} />
                            Owner Type
                        </label>
                        <select
                            {...register("owner_type", { required: "Owner type is required" })}
                            disabled={isLoading || isAddingOwner}
                        >
                            <option value="">Select Type</option>
                            <option value="Individual">Individual</option>
                            <option value="Company">Company</option>
                        </select>
                        {errors.owner_type && (
                            <span className={styles.error}>{errors.owner_type.message}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <User size={16} />
                            Owner Name
                        </label>
                        <input
                            type="text"
                            {...register("owner_name", { required: "Owner name is required" })}
                            placeholder="Enter owner name"
                            disabled={isLoading || isAddingOwner}
                        />
                        {errors.owner_name && (
                            <span className={styles.error}>{errors.owner_name.message}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <User size={16} />
                            Lessor Name
                        </label>
                        <input
                            type="text"
                            {...register("lessor_name", { required: "Lessor name is required" })}
                            placeholder="Enter lessor name"
                            disabled={isLoading || isAddingOwner}
                        />
                        {errors.lessor_name && (
                            <span className={styles.error}>{errors.lessor_name.message}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <IdCard size={16} />
                            Emirates ID
                        </label>
                        <input
                            type="text"
                            {...register("lessor_emirates_id")}
                            placeholder="Enter Emirates ID"
                            disabled={isLoading || isAddingOwner}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <Calendar size={16} />
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            {...register("dob")}
                            disabled={isLoading || isAddingOwner}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <FileText size={16} />
                            License Number
                        </label>
                        <input
                            type="text"
                            {...register("license_no")}
                            placeholder="Enter license number"
                            disabled={isLoading || isAddingOwner}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <Mail size={16} />
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("lessor_email", {
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            placeholder="Enter email address"
                            disabled={isLoading || isAddingOwner}
                        />
                        {errors.lessor_email && (
                            <span className={styles.error}>{errors.lessor_email.message}</span>
                        )}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <Phone size={16} />
                            Phone
                        </label>
                        <input
                            type="tel"
                            {...register("lessor_phone")}
                            placeholder="Enter phone number"
                            disabled={isLoading || isAddingOwner}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <Phone size={16} />
                            Secondary Phone
                        </label>
                        <input
                            type="tel"
                            {...register("secondryPhone")}
                            placeholder="Enter secondary phone number"
                            disabled={isLoading || isAddingOwner}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <FileText size={16} />
                            Nationality {
                                ownerId && <span style={{color:"red"}}> - {ownerData?.nationality}</span>
                            }
                        </label>
                        <FormInputCountries
                            control={control}
                            registerName="nationality"
                            placeholder="Select a country"
                            isDisabled={isLoading || isAddingOwner}

                        />
                    </div>

                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                        <label>
                            <FileText size={16} />
                            Owner Info
                        </label>
                        <textarea
                            {...register("owner_info")}
                            placeholder="Enter owner information"
                            rows="3"
                            disabled={isLoading || isAddingOwner}
                        />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={onCloseModal}
                        className={`${styles.submitButton} ${styles.cancelButton}`}
                        disabled={isLoading || isAddingOwner}
                        style={{
                            border: `1px solid ${data?.company_settings?.sidebar_color_code || "#020079"}`,
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || isAddingOwner}
                        className={styles.submitButton}
                        style={{
                            backgroundColor: data?.company_settings?.sidebar_color_code || "#020079",
                        }}
                    >
                        {(isLoading || isAddingOwner) ? "Processing..." : (ownerId ? "Update Owner" : "Add Owner")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNewOwner;
