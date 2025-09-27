import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./AddOwner.module.css";
import { Building2, User, FileText, Mail, Phone, IdCard } from "lucide-react";
import useCreateOwner from "../../features/Owner/useCreateOwner";
import FormInputCountries from "../../ui/FormInputCountries";

const AddOwner = ({ ownerId, onClose, heading, onCloseModal }) => {
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
        },
    });

    const { addOwner, updateOwner, ownerData, isLoading, isError, error, isAddingOwner } =
        useCreateOwner(ownerId);

    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
   
    useEffect(() => {
        if (ownerData) {
            reset({
                owner_type: ownerData.owner_type || "",
                owner_name: ownerData.owner_name || "",
                owner_info: ownerData.owner_info || "",
                lessor_name: ownerData.lessor_name || "",
                lessor_emirates_id: ownerData.lessor_emirates_id || "",
                license_no: ownerData.license_no || "",
                lessor_email: ownerData.lessor_email || "example@example.com",
                lessor_phone: ownerData.lessor_phone || "",
                nationality: ownerData.nationality || "",
                secondryPhone: ownerData.secondryPhone || "",
            });
            if (ownerData.profile_pic) {
                console.log(ownerData?.profile_pic);
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
        const formattedData = Object.entries({
            ...data,
            nationality: data.nationality.value,
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
        onClose();
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
        <div className={styles.modalFormContainer}>
            <h2 className={styles.modalHeading}>{heading}</h2>
            <div className={styles.formWrapper}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.profileImageContainer}>
                        <div className={styles.profileImageWrapper}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile" className={styles.profileImage} />
                            ) : (
                                <div className={styles.profileImagePlaceholder}>
                                    <User size={40} />
                                </div>
                            )}
                            <label className={styles.fileInputLabel}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className={styles.fileInput}
                                />
                                <span className={styles.uploadText}>Upload Photo</span>
                            </label>
                        </div>
                    </div>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>
                                <Building2 size={18} />
                                Owner Type
                            </label>
                            <select
                                {...register("owner_type", { required: true })}
                                disabled={isLoading || isAddingOwner}
                            >
                                <option value="">Select Type</option>
                                <option value="Individual">Individual</option>
                                <option value="Company">Company</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>
                                <User size={18} />
                                Owner Name
                            </label>
                            <input
                                type="text"
                                {...register("owner_name", { required: true })}
                                placeholder="Enter owner name"
                                disabled={isLoading || isAddingOwner}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>
                                <User size={18} />
                                Lessor Name
                            </label>
                            <input
                                type="text"
                                {...register("lessor_name", { required: true })}
                                placeholder="Enter lessor name"
                                disabled={isLoading || isAddingOwner}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>
                                <IdCard size={18} />
                                Emirates ID
                            </label>
                            <input
                                type="text"
                                {...register("lessor_emirates_id", {})}
                                placeholder="Enter Emirates ID"
                                disabled={isLoading || isAddingOwner}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>
                                <FileText size={18} />
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
                                <Mail size={18} />
                                Email
                            </label>
                            <input
                                type="email"
                                {...register("lessor_email", {
                                    required: true,
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                placeholder="Enter email address"
                                disabled={isLoading || isAddingOwner}
                            />
                            {errors.lessor_email && errors.lessor_email.required && <span className={styles.error}>{errors.lessor_email.message}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label>
                                <Phone size={18} />
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
                                <Phone size={18} />
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
                                <FileText size={18} />
                                Nationality
                            </label>
                            <FormInputCountries
                                control={control}
                                registerName="nationality"
                                placeholder="Select a country"
                                isDisabled={isLoading || isAddingOwner}
                            />
                        </div>

                        <div
                            className={`${styles.inputGroup} ${styles.fullWidth}`}
                        >
                            <label>
                                <FileText size={18} />
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
                            disabled={isLoading || isAddingOwner}
                            onClick={handleSubmit(onSubmit)}
                            className={styles.submitButton}
                        >
                            {(isLoading || isAddingOwner) ? "Processing..." : (ownerId ? "Update Owner" : "Add Owner")}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default AddOwner;
