import { useForm } from "react-hook-form";
import styles from "../../styles/FormGrid.module.css";
import { GENDER_OPTIONS } from "../../utils/constants";
import useUpdateStaffMember from "../admin/staff/useUpdateStaffMember";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStaff } from "../../services/apiStaff";
import toast from "react-hot-toast";
import FormInputCountries from "../../ui/FormInputCountries";
import useCountries from "../../hooks/useCountries";
import FormInputDataList from "../../ui/FormInputDataList";
import useLanguages from "../../hooks/useLaug";
// import { useMyPermissions } from "../../hooks/useHasPermission";
import useUpdateAgentQrCode from "../admin/staff/useUpdateAgentQrCode";
import Modal from "../../ui/Modal";
import QrCodeSection, { QRCodeModal } from "./QrCodeSection";
import { useState, useEffect } from "react";
import FormInputDeveloperSearch from "../../ui/FormInputDeveloperSearch";
import FormInputAsyncDataList from "../../ui/FormInputAsyncDataList";
import { getCommunities } from "../../services/apiProperties";
import { formatLocationsCommunityOptionsForProperties } from "../../utils/utils";

function ChangeInfoForm({ userData }) {
    const queryClient = useQueryClient();
    const { updateStaffMember, isPending } = useUpdateStaffMember();
    const { data: countriesData = [] } = useCountries();
    const { data: languagesData = [], isLoading: isLoadingLanguages } =
        useLanguages();
    // const { hasPermission } = useMyPermissions();
    const [specialities, setSpecialities] = useState(
        userData?.specialities || []
    );
    const [newSpeciality, setNewSpeciality] = useState("");
    const [socialMediaExpanded, setSocialMediaExpanded] = useState(false);
    const [socialMedia, setSocialMedia] = useState(
        userData?.social_media || {
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
            youtube: "",
            tiktok: "",
            whatsapp: "",
            telegram: "",
            website: "",
            other: [],
        }
    );
    const [newOtherPlatform, setNewOtherPlatform] = useState("");
    const [showLanguagesPopover, setShowLanguagesPopover] = useState(false);
    const [bankDetailsExpanded, setBankDetailsExpanded] = useState(false);
    const [bankDetails, setBankDetails] = useState(
        userData?.bank_details || []
    );
    const [editingBankIndex, setEditingBankIndex] = useState(null);
    const [newBankAccount, setNewBankAccount] = useState({
        bank_name: "",
        account_holder_name: "",
        account_number: "",
        routing_number: "",
        iban: "",
        swift_code: "",
        bank_address: "",
        is_verified: false,
    });
    const [showDevelopersPopover, setShowDevelopersPopover] = useState(false);
    const [showCommunitiesPopover, setShowCommunitiesPopover] = useState(false);

    // Map languages data for FormInputDataList
    const mappedLanguages =
        languagesData?.map((item) => ({
            value: `${item[0]}:${item[1]}`,
            label: item[1],
        })) || [];

    const { register, handleSubmit, setValue, reset, watch, control } = useForm(
        {
            defaultValues: {
                ...userData,
                whatsapp_notification: Boolean(userData.whatsapp_notification),
                email_notification: Boolean(userData.email_notification),
                dob: userData.dob
                    ? new Date(userData.dob).toISOString().split("T")[0]
                    : "",
                brn_number: userData?.brn_number || "",
                emirates_id: userData?.emirates_id || "",
                passport_no: userData?.passport_no || "",
                nationality: null, // We'll set this after loading countries
                specialities: userData?.specialities || [],
                languages: userData?.languages
                    ? userData?.languages.map((item) => ({
                          value: `${item}`,
                          label: `${item}`,
                      }))
                    : [],
                social_media: userData?.social_media || {
                    facebook: "",
                    instagram: "",
                    twitter: "",
                    linkedin: "",
                    youtube: "",
                    tiktok: "",
                    whatsapp: "",
                    telegram: "",
                    website: "",
                    other: [],
                },
                preferred_developers:
                    userData?.preferred_developers?.map((devId, index) => ({
                        value: devId,
                        label:
                            userData?.preferred_developer_names?.[index] ||
                            `Developer ${devId}`,
                    })) || [],
                preferred_communities:
                    userData?.preferred_communities?.map((comm) => ({
                        value: comm.id || comm,
                        label: comm.name || comm,
                    })) || [],
                experience_years: userData?.experience_years || 0,
            },
        }
    );

    // Set nationality with flag information once countries are loaded
    useEffect(() => {
        if (countriesData.length > 0 && userData?.nationality) {
            const country = countriesData.find(
                (c) => c.name.common === userData.nationality
            );
            if (country) {
                setValue("nationality", {
                    value: country.name.common,
                    label: country.name.common,
                    flag: country.flags.png,
                });
            }
        }
    }, [countriesData, userData?.nationality, setValue]);

    const whatsappNotification = watch("whatsapp_notification");
    const emailNotification = watch("email_notification");
    const { updateAgentQrCode, isPending: isUpdatingQrCode } =
        useUpdateAgentQrCode();

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
        mutate: updateEmailNotification,
        isPending: isUpdatingEmailNotification,
    } = useMutation({
        mutationFn: ({ id, email_notification }) =>
            updateStaff(id, { email_notification }),
        onSuccess: () => {
            toast.success("Email notification settings updated!");
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
        onError: (err) => toast.error(err.message),
    });

    const handleAddSpeciality = () => {
        if (newSpeciality.trim()) {
            const updatedSpecialities = [...specialities, newSpeciality.trim()];
            setSpecialities(updatedSpecialities);
            setValue("specialities", updatedSpecialities);
            setNewSpeciality("");
        }
    };

    const handleRemoveSpeciality = (index) => {
        const updatedSpecialities = specialities.filter((_, i) => i !== index);
        setSpecialities(updatedSpecialities);
        setValue("specialities", updatedSpecialities);
    };

    const handleSocialMediaChange = (platform, value) => {
        const updatedSocialMedia = {
            ...socialMedia,
            [platform]: value,
        };
        setSocialMedia(updatedSocialMedia);
        setValue("social_media", updatedSocialMedia);
    };

    const handleAddOtherPlatform = () => {
        if (newOtherPlatform.trim()) {
            const updatedOther = [
                ...socialMedia.other,
                newOtherPlatform.trim(),
            ];
            const updatedSocialMedia = {
                ...socialMedia,
                other: updatedOther,
            };
            setSocialMedia(updatedSocialMedia);
            setValue("social_media", updatedSocialMedia);
            setNewOtherPlatform("");
        }
    };

    const handleRemoveOtherPlatform = (index) => {
        const updatedOther = socialMedia.other.filter((_, i) => i !== index);
        const updatedSocialMedia = {
            ...socialMedia,
            other: updatedOther,
        };
        setSocialMedia(updatedSocialMedia);
        setValue("social_media", updatedSocialMedia);
    };

    // Bank Details CRUD Functions
    const handleAddBankAccount = () => {
        if (
            newBankAccount.bank_name.trim() &&
            newBankAccount.account_number.trim()
        ) {
            // Always create new accounts as unverified - only admin can verify
            const newAccount = { ...newBankAccount, is_verified: false };
            const updatedBankDetails = [...bankDetails, newAccount];
            setBankDetails(updatedBankDetails);
            setValue("bank_details", updatedBankDetails);
            setNewBankAccount({
                bank_name: "",
                account_holder_name: "",
                account_number: "",
                routing_number: "",
                iban: "",
                swift_code: "",
                bank_address: "",
                is_verified: false,
            });
        }
    };

    const handleEditBankAccount = (index) => {
        setEditingBankIndex(index);
        setNewBankAccount({ ...bankDetails[index] });
    };

    const handleUpdateBankAccount = () => {
        if (editingBankIndex !== null) {
            const updatedBankDetails = [...bankDetails];
            // Preserve the original verification status - users can't change it
            const originalVerificationStatus =
                bankDetails[editingBankIndex].is_verified;
            updatedBankDetails[editingBankIndex] = {
                ...newBankAccount,
                is_verified: originalVerificationStatus,
            };
            setBankDetails(updatedBankDetails);
            setValue("bank_details", updatedBankDetails);
            setEditingBankIndex(null);
            setNewBankAccount({
                bank_name: "",
                account_holder_name: "",
                account_number: "",
                routing_number: "",
                iban: "",
                swift_code: "",
                bank_address: "",
                is_verified: false,
            });
        }
    };

    const handleCancelBankEdit = () => {
        setEditingBankIndex(null);
        setNewBankAccount({
            bank_name: "",
            account_holder_name: "",
            account_number: "",
            routing_number: "",
            iban: "",
            swift_code: "",
            bank_address: "",
            is_verified: false,
        });
    };

    const handleRemoveBankAccount = (index) => {
        const updatedBankDetails = bankDetails.filter((_, i) => i !== index);
        setBankDetails(updatedBankDetails);
        setValue("bank_details", updatedBankDetails);
    };

    const handleBankInputChange = (field, value) => {
        // Prevent changing verification status - only admin can verify accounts
        if (field === "is_verified") return;

        setNewBankAccount((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    function onSubmit(data) {
        const formattedData = {
            ...data,
            whatsapp_notification: Boolean(data.whatsapp_notification),
            nationality: data.nationality?.value || data.nationality || "",
            specialities: specialities,
            social_media: socialMedia,
            bank_details: bankDetails,
            languages: data.languages?.map((lang) => lang.label || lang) || [],
            preferred_developers:
                data.preferred_developers?.map((dev) =>
                    typeof dev === "object" ? parseInt(dev.value) : dev
                ) || [],
            preferred_communities:
                data.preferred_communities?.map((comm) =>
                    typeof comm === "object" ? comm.label : comm
                ) || [],
        };
        updateStaffMember({
            id: userData.id,
            payload: formattedData,
        });
    }

    const handleReset = () => {
        reset({
            ...userData,
            whatsapp_notification: Boolean(userData.whatsapp_notification),
            email_notification: Boolean(userData.email_notification),
        });
        setSpecialities(userData?.specialities || []);
        setSocialMedia(
            userData?.social_media || {
                facebook: "",
                instagram: "",
                twitter: "",
                linkedin: "",
                youtube: "",
                tiktok: "",
                whatsapp: "",
                telegram: "",
                website: "",
                other: [],
            }
        );
        setBankDetails(userData?.bank_details || []);
        // Reset languages
        setValue(
            "languages",
            userData?.languages
                ? userData?.languages.map((item) => ({
                      value: `${item}`,
                      label: `${item}`,
                  }))
                : []
        );
        // Reset preferred developers
        setValue(
            "preferred_developers",
            userData?.preferred_developers?.map((devId, index) => ({
                value: devId,
                label:
                    userData?.preferred_developer_names?.[index] ||
                    `Developer ${devId}`,
            })) || []
        );
        // Reset preferred communities
        setValue(
            "preferred_communities",
            userData?.preferred_communities?.map((comm) => ({
                value: comm.id || comm,
                label: comm.name || comm,
            })) || []
        );
        // Reset experience years
        setValue("experience_years", userData?.experience_years || 0);
    };

    const handleWhatsAppToggle = (e) => {
        const newValue = e.target.checked;
        setValue("whatsapp_notification", newValue);
        updateWhatsAppNotification({
            id: userData.id,
            whatsapp_notification: newValue,
        });
    };

    const handleEmailToggle = (e) => {
        const newValue = e.target.checked;
        setValue("email_notification", newValue);
        updateEmailNotification({
            id: userData.id,
            email_notification: newValue,
        });
    };

    const handleQrCodeUpload = (file) => {
        updateAgentQrCode({ agentId: userData.id, qrCodeFile: file });
    };

    return (
        <>
            <style>
                {`
                    @keyframes slideDown {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                            max-height: 0;
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                            max-height: 1000px;
                        }
                    }
                    
                    .social-media-input:focus {
                        border-color: #667eea !important;
                        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
                        outline: none;
                    }
                    
                    .social-platform-tag {
                        transition: all 0.2s ease;
                    }
                    
                    .social-platform-tag:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                    
                    .accordion-header:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
                    }
                `}
            </style>
            <Modal>
                <form
                    className={styles.formGrid}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className={styles.formContainer}>
                        <div>
                            <label>Name</label>
                            <input type="text" required {...register("name")} />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                required
                                {...register("email")}
                            />
                        </div>
                        <div>
                            <label>Phone</label>
                            <div className="d-flex">
                                <PhoneInput
                                    country={"us"} // Default country code
                                    value={userData.phone} // Pre-fill with userData
                                    onChange={(phone, countryData) => {
                                        setValue("phone", phone); // Set phone value in form state
                                        setValue(
                                            "nationality",
                                            countryData.name
                                        ); // Set nationality based on countryData
                                    }}
                                    inputProps={{
                                        name: "phone",
                                        required: true,
                                    }}
                                    inputStyle={{
                                        width: "100%",
                                        height: "40px",
                                        backgroundColor: "whitesmoke",
                                        border: "none",
                                    }}
                                    buttonStyle={{
                                        height: "40px",
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label>Gender</label>
                            <select required {...register("gender")}>
                                {GENDER_OPTIONS.map((item) => (
                                    <option value={item.value} key={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                {...register("dob")}
                                style={{
                                    backgroundColor: "whitesmoke",
                                    border: "none",
                                    height: "40px",
                                    width: "100%",
                                    padding: "0 10px",
                                }}
                            />
                        </div>

                        <div>
                            <label>Nationality</label>
                            <FormInputCountries
                                control={control}
                                registerName="nationality"
                                placeholder="Select nationality"
                                isMulti={false}
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "15px",
                            }}
                        >
                            <label
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#333",
                                }}
                            >
                                WhatsApp Notifications
                            </label>
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
                                    checked={whatsappNotification}
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
                                        backgroundColor: whatsappNotification
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
                                            transform: whatsappNotification
                                                ? "translateX(26px)"
                                                : "translateX(0)",
                                        }}
                                    />
                                </span>
                            </label>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "1rem 0",
                                borderBottom: "1px solid #e2e8f0",
                            }}
                        >
                            <label
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#333",
                                }}
                            >
                                Email Notifications
                            </label>
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
                                    checked={emailNotification}
                                    onChange={handleEmailToggle}
                                    disabled={isUpdatingEmailNotification}
                                    style={{
                                        opacity: 0,
                                        width: 0,
                                        height: 0,
                                    }}
                                />
                                <span
                                    style={{
                                        position: "absolute",
                                        cursor: isUpdatingEmailNotification
                                            ? "not-allowed"
                                            : "pointer",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: emailNotification
                                            ? "#4CAF50"
                                            : "#ccc",
                                        transition: "0.3s",
                                        borderRadius: "24px",
                                        opacity: isUpdatingEmailNotification
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
                                            transform: emailNotification
                                                ? "translateX(26px)"
                                                : "translateX(0)",
                                        }}
                                    />
                                </span>
                            </label>
                        </div>

                        <div>
                            <label>BRN Number</label>
                            <input type="text" {...register("brn_number")} />
                        </div>
                        <div>
                            <label>Emirates ID</label>
                            <input type="text" {...register("emirates_id")} />
                        </div>
                        <div>
                            <label>Passport Number</label>
                            <input type="text" {...register("passport_no")} />
                        </div>
                        <div>
                            <label>Experience Years</label>
                            <input
                                type="number"
                                {...register("experience_years")}
                                placeholder="Enter years of experience"
                                min="0"
                                max="50"
                            />
                        </div>
                        <div
                            style={{
                                gridColumn: "1 / -1",
                            }}
                        >
                            <label>Languages</label>
                            <FormInputDataList
                                control={control}
                                registerName="languages"
                                placeholder="Select languages"
                                data={mappedLanguages}
                                isLoading={isLoadingLanguages}
                                isMulti
                            />
                            <div
                                style={{
                                    marginTop: "8px",
                                    position: "relative",
                                }}
                            >
                                <button
                                    type="button"
                                    onMouseEnter={() =>
                                        setShowLanguagesPopover(true)
                                    }
                                    onMouseLeave={() =>
                                        setShowLanguagesPopover(false)
                                    }
                                    style={{
                                        padding: "4px 8px",
                                        backgroundColor: "#f1f5f9",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        textTransform: "uppercase",
                                        fontWeight: "500",
                                        letterSpacing: "0.025em",
                                    }}
                                >
                                    See Languages (
                                    {watch("languages")?.length || 0})
                                </button>

                                {showLanguagesPopover && (
                                    <div
                                        onMouseEnter={() =>
                                            setShowLanguagesPopover(true)
                                        }
                                        onMouseLeave={() =>
                                            setShowLanguagesPopover(false)
                                        }
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            left: "0",
                                            marginTop: "8px",
                                            padding: "12px",
                                            backgroundColor: "white",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "6px",
                                            boxShadow:
                                                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                            zIndex: 1000,
                                            minWidth: "200px",
                                            maxHeight: "300px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {watch("languages")?.length > 0 ? (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "8px",
                                                }}
                                            >
                                                {watch("languages").map(
                                                    (lang, index) => (
                                                        <span
                                                            key={index}
                                                            style={{
                                                                padding:
                                                                    "4px 8px",
                                                                backgroundColor:
                                                                    "#f8fafc",
                                                                borderRadius:
                                                                    "4px",
                                                                fontSize:
                                                                    "14px",
                                                            }}
                                                        >
                                                            {lang.label}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <p
                                                style={{
                                                    color: "#64748b",
                                                    fontSize: "14px",
                                                    margin: 0,
                                                }}
                                            >
                                                No languages selected
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Preferred Developers */}
                        <div style={{ position: "relative" }}>
                            <FormInputDeveloperSearch
                                control={control}
                                registerName="preferred_developers"
                                placeholder="Search developers..."
                                isMulti={true}
                                label="Preferred Developers"
                                labelPosition="top"
                            />
                            {watch("preferred_developers")?.length > 0 && (
                                <button
                                    type="button"
                                    onMouseEnter={() =>
                                        setShowDevelopersPopover(true)
                                    }
                                    onMouseLeave={() =>
                                        setShowDevelopersPopover(false)
                                    }
                                    style={{
                                        padding: "4px 8px",
                                        backgroundColor: "#f1f5f9",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        textTransform: "uppercase",
                                        fontWeight: "500",
                                        letterSpacing: "0.025em",
                                        marginTop: "8px",
                                    }}
                                >
                                    See Developers (
                                    {watch("preferred_developers")?.length || 0}
                                    )
                                </button>
                            )}

                            {showDevelopersPopover && (
                                <div
                                    onMouseEnter={() =>
                                        setShowDevelopersPopover(true)
                                    }
                                    onMouseLeave={() =>
                                        setShowDevelopersPopover(false)
                                    }
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: "0",
                                        marginTop: "8px",
                                        padding: "12px",
                                        backgroundColor: "white",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "6px",
                                        boxShadow:
                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                        zIndex: 1000,
                                        minWidth: "200px",
                                        maxHeight: "300px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {watch("preferred_developers")?.length >
                                    0 ? (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "8px",
                                            }}
                                        >
                                            {watch("preferred_developers").map(
                                                (dev, index) => (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            padding: "4px 8px",
                                                            backgroundColor:
                                                                "#f8fafc",
                                                            borderRadius: "4px",
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        {dev.label}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p
                                            style={{
                                                color: "#64748b",
                                                fontSize: "14px",
                                                margin: 0,
                                            }}
                                        >
                                            No developers selected
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Preferred Communities */}
                        <div style={{ position: "relative" }}>
                            <label>Preferred Communities</label>
                            <FormInputAsyncDataList
                                control={control}
                                registerName="preferred_communities"
                                placeholder="Search communities..."
                                asyncFunc={getCommunities}
                                formatFunc={
                                    formatLocationsCommunityOptionsForProperties
                                }
                                isMulti={true}
                            />
                            {watch("preferred_communities")?.length > 0 && (
                                <button
                                    type="button"
                                    onMouseEnter={() =>
                                        setShowCommunitiesPopover(true)
                                    }
                                    onMouseLeave={() =>
                                        setShowCommunitiesPopover(false)
                                    }
                                    style={{
                                        padding: "4px 8px",
                                        backgroundColor: "#f1f5f9",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        textTransform: "uppercase",
                                        fontWeight: "500",
                                        letterSpacing: "0.025em",
                                        marginTop: "8px",
                                    }}
                                >
                                    See Communities (
                                    {watch("preferred_communities")?.length ||
                                        0}
                                    )
                                </button>
                            )}

                            {showCommunitiesPopover && (
                                <div
                                    onMouseEnter={() =>
                                        setShowCommunitiesPopover(true)
                                    }
                                    onMouseLeave={() =>
                                        setShowCommunitiesPopover(false)
                                    }
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: "0",
                                        marginTop: "8px",
                                        padding: "12px",
                                        backgroundColor: "white",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "6px",
                                        boxShadow:
                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                        zIndex: 1000,
                                        minWidth: "200px",
                                        maxHeight: "300px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {watch("preferred_communities")?.length >
                                    0 ? (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "8px",
                                            }}
                                        >
                                            {watch("preferred_communities").map(
                                                (comm, index) => (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            padding: "4px 8px",
                                                            backgroundColor:
                                                                "#f8fafc",
                                                            borderRadius: "4px",
                                                            fontSize: "14px",
                                                        }}
                                                    >
                                                        {comm.label}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p
                                            style={{
                                                color: "#64748b",
                                                fontSize: "14px",
                                                margin: 0,
                                            }}
                                        >
                                            No communities selected
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                gridColumn: "1 / -1",
                            }}
                        >
                            <label>About</label>
                            <textarea
                                {...register("remarks")}
                                rows="4"
                                style={{
                                    width: "100%",
                                    minHeight: "100px",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                    fontFamily: "inherit",
                                    resize: "vertical",
                                }}
                                placeholder="Add any additional remarks or notes..."
                            />
                        </div>

                        <QrCodeSection
                            userData={userData}
                            onQrCodeUpload={handleQrCodeUpload}
                            isUpdatingQrCode={isUpdatingQrCode}
                        />
                        <div
                            style={{
                                maxHeight: "180px",
                                overflowY: "auto",
                                padding: "10px",
                            }}
                        >
                            <label>Specialities</label>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <input
                                    type="text"
                                    value={newSpeciality}
                                    onChange={(e) =>
                                        setNewSpeciality(e.target.value)
                                    }
                                    placeholder="Enter speciality"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSpeciality}
                                    style={{
                                        fontSize: "4rem",
                                        backgroundColor: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "gray",
                                        marginBottom: "10px",
                                    }}
                                >
                                    +
                                </button>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "8px",
                                }}
                            >
                                {specialities?.map((speciality, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            backgroundColor: "#e0e0e0",
                                            padding: "4px 8px",
                                            borderRadius: "4px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <span>{speciality}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveSpeciality(index)
                                            }
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "#666",
                                                cursor: "pointer",
                                                padding: "0",
                                                fontSize: "1.7rem",
                                                hover: {
                                                    color: "red",
                                                },
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media Accordion Section */}
                        <div
                            style={{ gridColumn: "1 / -1", marginTop: "20px" }}
                        >
                            <div
                                onClick={() =>
                                    setSocialMediaExpanded(!socialMediaExpanded)
                                }
                                className="accordion-header"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "15px 20px",
                                    background:
                                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                    boxShadow:
                                        "0 4px 15px rgba(102, 126, 234, 0.3)",
                                    transition: "all 0.3s ease",
                                    marginBottom: socialMediaExpanded
                                        ? "15px"
                                        : "0",
                                }}
                            >
                                <span>Social Media Links</span>
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {socialMediaExpanded ? "−" : "+"}
                                </span>
                            </div>

                            {socialMediaExpanded && (
                                <div
                                    style={{
                                        background: "#f8fafc",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        border: "1px solid #e2e8f0",
                                        boxShadow:
                                            "0 2px 8px rgba(0, 0, 0, 0.05)",
                                        animation: "slideDown 0.3s ease-out",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(auto-fit, minmax(300px, 1fr))",
                                            gap: "15px",
                                        }}
                                    >
                                        {/* Main Social Media Platforms */}
                                        {[
                                            {
                                                key: "facebook",
                                                label: "Facebook",
                                                placeholder:
                                                    "https://facebook.com/yourprofile",
                                            },
                                            {
                                                key: "instagram",
                                                label: "Instagram",
                                                placeholder:
                                                    "https://instagram.com/yourprofile",
                                            },
                                            {
                                                key: "twitter",
                                                label: "Twitter/X",
                                                placeholder:
                                                    "https://twitter.com/yourprofile",
                                            },
                                            {
                                                key: "linkedin",
                                                label: "LinkedIn",
                                                placeholder:
                                                    "https://linkedin.com/in/yourprofile",
                                            },
                                            {
                                                key: "youtube",
                                                label: "YouTube",
                                                placeholder:
                                                    "https://youtube.com/@yourchannel",
                                            },
                                            {
                                                key: "tiktok",
                                                label: "TikTok",
                                                placeholder:
                                                    "https://tiktok.com/@yourprofile",
                                            },
                                            {
                                                key: "whatsapp",
                                                label: "WhatsApp",
                                                placeholder:
                                                    "https://wa.me/your-number",
                                            },
                                            {
                                                key: "telegram",
                                                label: "Telegram",
                                                placeholder:
                                                    "https://t.me/yourusername",
                                            },
                                            {
                                                key: "website",
                                                label: "Website",
                                                placeholder:
                                                    "https://yourwebsite.com",
                                            },
                                        ].map((platform) => (
                                            <div
                                                key={platform.key}
                                                style={{ marginBottom: "10px" }}
                                            >
                                                <label
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "5px",
                                                        fontWeight: "500",
                                                        color: "#374151",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    {platform.label}
                                                </label>
                                                <input
                                                    type="url"
                                                    value={
                                                        socialMedia[
                                                            platform.key
                                                        ]
                                                    }
                                                    onChange={(e) =>
                                                        handleSocialMediaChange(
                                                            platform.key,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={
                                                        platform.placeholder
                                                    }
                                                    className="social-media-input"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        transition:
                                                            "border-color 0.2s ease",
                                                        backgroundColor:
                                                            "white",
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Other Platforms Section */}
                                    <div
                                        style={{
                                            marginTop: "20px",
                                            paddingTop: "20px",
                                            borderTop: "1px solid #e2e8f0",
                                        }}
                                    >
                                        <label
                                            style={{
                                                display: "block",
                                                marginBottom: "10px",
                                                fontWeight: "600",
                                                color: "#374151",
                                                fontSize: "15px",
                                            }}
                                        >
                                            Other Platforms
                                        </label>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                alignItems: "center",
                                                marginBottom: "15px",
                                            }}
                                        >
                                            <input
                                                type="text"
                                                value={newOtherPlatform}
                                                onChange={(e) =>
                                                    setNewOtherPlatform(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Add other platform URL"
                                                style={{
                                                    flex: 1,
                                                    padding: "10px 12px",
                                                    border: "2px solid #e2e8f0",
                                                    borderRadius: "8px",
                                                    fontSize: "14px",
                                                    backgroundColor: "white",
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleAddOtherPlatform();
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddOtherPlatform}
                                                style={{
                                                    padding: "10px 15px",
                                                    background:
                                                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    transition:
                                                        "transform 0.2s ease",
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.transform =
                                                        "translateY(-2px)";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.transform =
                                                        "translateY(0)";
                                                }}
                                            >
                                                + Add
                                            </button>
                                        </div>

                                        {/* Display Other Platforms */}
                                        {socialMedia.other &&
                                            socialMedia.other.length > 0 && (
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    {socialMedia.other.map(
                                                        (platform, index) => (
                                                            <div
                                                                key={index}
                                                                className="social-platform-tag"
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    gap: "8px",
                                                                    padding:
                                                                        "8px 12px",
                                                                    backgroundColor:
                                                                        "#e0e7ff",
                                                                    borderRadius:
                                                                        "20px",
                                                                    border: "1px solid #c7d2fe",
                                                                    fontSize:
                                                                        "13px",
                                                                    color: "#3730a3",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        maxWidth:
                                                                            "200px",
                                                                        overflow:
                                                                            "hidden",
                                                                        textOverflow:
                                                                            "ellipsis",
                                                                        whiteSpace:
                                                                            "nowrap",
                                                                    }}
                                                                >
                                                                    {platform}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveOtherPlatform(
                                                                            index
                                                                        )
                                                                    }
                                                                    style={{
                                                                        background:
                                                                            "none",
                                                                        border: "none",
                                                                        color: "#dc2626",
                                                                        cursor: "pointer",
                                                                        padding:
                                                                            "0",
                                                                        fontSize:
                                                                            "16px",
                                                                        fontWeight:
                                                                            "bold",
                                                                        lineHeight: 1,
                                                                    }}
                                                                    title="Remove platform"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bank Details Accordion Section */}
                        <div
                            style={{ gridColumn: "1 / -1", marginTop: "20px" }}
                        >
                            <div
                                onClick={() =>
                                    setBankDetailsExpanded(!bankDetailsExpanded)
                                }
                                className="accordion-header"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "15px 20px",
                                    background:
                                        "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                                    borderRadius: "12px",
                                    cursor: "pointer",
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: "16px",
                                    boxShadow:
                                        "0 4px 15px rgba(5, 150, 105, 0.3)",
                                    transition: "all 0.3s ease",
                                    marginBottom: bankDetailsExpanded
                                        ? "15px"
                                        : "0",
                                }}
                            >
                                <span>
                                    {" "}
                                    Bank Account Details ({bankDetails.length})
                                </span>
                                <span
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {bankDetailsExpanded ? "−" : "+"}
                                </span>
                            </div>

                            {bankDetailsExpanded && (
                                <div
                                    style={{
                                        background: "#f8fafc",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        border: "1px solid #e2e8f0",
                                        boxShadow:
                                            "0 2px 8px rgba(0, 0, 0, 0.05)",
                                        animation: "slideDown 0.3s ease-out",
                                    }}
                                >
                                    {/* Add New Bank Account Form */}
                                    <div
                                        style={{
                                            background: "white",
                                            borderRadius: "12px",
                                            padding: "20px",
                                            marginBottom: "20px",
                                            border: "2px solid #e2e8f0",
                                            boxShadow:
                                                "0 2px 8px rgba(0, 0, 0, 0.05)",
                                        }}
                                    >
                                        <h4
                                            style={{
                                                margin: "0 0 15px 0",
                                                color: "#374151",
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                            }}
                                        >
                                            {editingBankIndex !== null
                                                ? "✏️ Edit Bank Account"
                                                : "➕ Add New Bank Account"}
                                        </h4>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(280px, 1fr))",
                                                gap: "15px",
                                                marginBottom: "15px",
                                            }}
                                        >
                                            <div>
                                                <label
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "5px",
                                                        fontWeight: "500",
                                                        color: "#374151",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    Bank Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        newBankAccount.bank_name
                                                    }
                                                    onChange={(e) =>
                                                        handleBankInputChange(
                                                            "bank_name",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter bank name"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        transition:
                                                            "border-color 0.2s ease",
                                                        backgroundColor:
                                                            "white",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor =
                                                            "#10b981";
                                                        e.target.style.boxShadow =
                                                            "0 0 0 3px rgba(16, 185, 129, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor =
                                                            "#e2e8f0";
                                                        e.target.style.boxShadow =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "5px",
                                                        fontWeight: "500",
                                                        color: "#374151",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    Account Holder Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        newBankAccount.account_holder_name
                                                    }
                                                    onChange={(e) =>
                                                        handleBankInputChange(
                                                            "account_holder_name",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter account holder name"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        transition:
                                                            "border-color 0.2s ease",
                                                        backgroundColor:
                                                            "white",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor =
                                                            "#10b981";
                                                        e.target.style.boxShadow =
                                                            "0 0 0 3px rgba(16, 185, 129, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor =
                                                            "#e2e8f0";
                                                        e.target.style.boxShadow =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "5px",
                                                        fontWeight: "500",
                                                        color: "#374151",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    Account Number *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        newBankAccount.account_number
                                                    }
                                                    onChange={(e) =>
                                                        handleBankInputChange(
                                                            "account_number",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter account number"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        transition:
                                                            "border-color 0.2s ease",
                                                        backgroundColor:
                                                            "white",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor =
                                                            "#10b981";
                                                        e.target.style.boxShadow =
                                                            "0 0 0 3px rgba(16, 185, 129, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor =
                                                            "#e2e8f0";
                                                        e.target.style.boxShadow =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "5px",
                                                        fontWeight: "500",
                                                        color: "#374151",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    Routing Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        newBankAccount.routing_number
                                                    }
                                                    onChange={(e) =>
                                                        handleBankInputChange(
                                                            "routing_number",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter routing number"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        transition:
                                                            "border-color 0.2s ease",
                                                        backgroundColor:
                                                            "white",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor =
                                                            "#10b981";
                                                        e.target.style.boxShadow =
                                                            "0 0 0 3px rgba(16, 185, 129, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor =
                                                            "#e2e8f0";
                                                        e.target.style.boxShadow =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "5px",
                                                        fontWeight: "500",
                                                        color: "#374151",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    IBAN
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newBankAccount.iban}
                                                    onChange={(e) =>
                                                        handleBankInputChange(
                                                            "iban",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter IBAN"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        transition:
                                                            "border-color 0.2s ease",
                                                        backgroundColor:
                                                            "white",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor =
                                                            "#10b981";
                                                        e.target.style.boxShadow =
                                                            "0 0 0 3px rgba(16, 185, 129, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor =
                                                            "#e2e8f0";
                                                        e.target.style.boxShadow =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    style={{
                                                        display: "block",
                                                        marginBottom: "5px",
                                                        fontWeight: "500",
                                                        color: "#374151",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    SWIFT Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        newBankAccount.swift_code
                                                    }
                                                    onChange={(e) =>
                                                        handleBankInputChange(
                                                            "swift_code",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter SWIFT code"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px 12px",
                                                        border: "2px solid #e2e8f0",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        transition:
                                                            "border-color 0.2s ease",
                                                        backgroundColor:
                                                            "white",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor =
                                                            "#10b981";
                                                        e.target.style.boxShadow =
                                                            "0 0 0 3px rgba(16, 185, 129, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor =
                                                            "#e2e8f0";
                                                        e.target.style.boxShadow =
                                                            "none";
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: "15px" }}>
                                            <label
                                                style={{
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontWeight: "500",
                                                    color: "#374151",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                Bank Address
                                            </label>
                                            <textarea
                                                value={
                                                    newBankAccount.bank_address
                                                }
                                                onChange={(e) =>
                                                    handleBankInputChange(
                                                        "bank_address",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter bank address"
                                                rows="3"
                                                style={{
                                                    width: "100%",
                                                    padding: "10px 12px",
                                                    border: "2px solid #e2e8f0",
                                                    borderRadius: "8px",
                                                    fontSize: "14px",
                                                    transition:
                                                        "border-color 0.2s ease",
                                                    backgroundColor: "white",
                                                    resize: "vertical",
                                                    fontFamily: "inherit",
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor =
                                                        "#10b981";
                                                    e.target.style.boxShadow =
                                                        "0 0 0 3px rgba(16, 185, 129, 0.1)";
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor =
                                                        "#e2e8f0";
                                                    e.target.style.boxShadow =
                                                        "none";
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                marginBottom: "15px",
                                                padding: "10px 12px",
                                                backgroundColor: "#f8fafc",
                                                borderRadius: "8px",
                                                border: "1px solid #e2e8f0",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: "500",
                                                    color: "#374151",
                                                }}
                                            >
                                                Verification Status:
                                            </span>
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    padding: "4px 8px",
                                                    borderRadius: "20px",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    backgroundColor:
                                                        newBankAccount.is_verified
                                                            ? "#dcfce7"
                                                            : "#fef3c7",
                                                    color: newBankAccount.is_verified
                                                        ? "#166534"
                                                        : "#92400e",
                                                    border: `1px solid ${newBankAccount.is_verified ? "#bbf7d0" : "#fde68a"}`,
                                                }}
                                            >
                                                {newBankAccount.is_verified
                                                    ? "✅ Verified"
                                                    : "⏳ Not Verified"}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#6b7280",
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                (Verification is handled by
                                                admin)
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                                justifyContent: "flex-end",
                                            }}
                                        >
                                            {editingBankIndex !== null && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleCancelBankEdit
                                                    }
                                                    style={{
                                                        padding: "10px 20px",
                                                        background: "#6b7280",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "8px",
                                                        cursor: "pointer",
                                                        fontWeight: "600",
                                                        fontSize: "14px",
                                                        transition:
                                                            "all 0.2s ease",
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.target.style.background =
                                                            "#4b5563";
                                                        e.target.style.transform =
                                                            "translateY(-2px)";
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.target.style.background =
                                                            "#6b7280";
                                                        e.target.style.transform =
                                                            "translateY(0)";
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={
                                                    editingBankIndex !== null
                                                        ? handleUpdateBankAccount
                                                        : handleAddBankAccount
                                                }
                                                style={{
                                                    padding: "10px 20px",
                                                    background:
                                                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    transition: "all 0.2s ease",
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.transform =
                                                        "translateY(-2px)";
                                                    e.target.style.boxShadow =
                                                        "0 4px 12px rgba(16, 185, 129, 0.4)";
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.transform =
                                                        "translateY(0)";
                                                    e.target.style.boxShadow =
                                                        "none";
                                                }}
                                            >
                                                {editingBankIndex !== null
                                                    ? "Update Account"
                                                    : "Add Account"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Display Existing Bank Accounts */}
                                    {bankDetails.length > 0 && (
                                        <div>
                                            <h4
                                                style={{
                                                    margin: "0 0 15px 0",
                                                    color: "#374151",
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                }}
                                            >
                                                💳 Your Bank Accounts (
                                                {bankDetails.length})
                                            </h4>
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gap: "15px",
                                                }}
                                            >
                                                {bankDetails.map(
                                                    (account, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                background:
                                                                    "white",
                                                                borderRadius:
                                                                    "12px",
                                                                padding: "20px",
                                                                border: account.is_verified
                                                                    ? "2px solid #10b981"
                                                                    : "2px solid #e2e8f0",
                                                                boxShadow:
                                                                    "0 2px 8px rgba(0, 0, 0, 0.05)",
                                                                position:
                                                                    "relative",
                                                                transition:
                                                                    "all 0.2s ease",
                                                            }}
                                                            onMouseOver={(
                                                                e
                                                            ) => {
                                                                e.currentTarget.style.transform =
                                                                    "translateY(-2px)";
                                                                e.currentTarget.style.boxShadow =
                                                                    "0 4px 15px rgba(0, 0, 0, 0.1)";
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.transform =
                                                                    "translateY(0)";
                                                                e.currentTarget.style.boxShadow =
                                                                    "0 2px 8px rgba(0, 0, 0, 0.05)";
                                                            }}
                                                        >
                                                            {account.is_verified && (
                                                                <div
                                                                    style={{
                                                                        position:
                                                                            "absolute",
                                                                        top: "10px",
                                                                        right: "10px",
                                                                        background:
                                                                            "#10b981",
                                                                        color: "white",
                                                                        padding:
                                                                            "4px 8px",
                                                                        borderRadius:
                                                                            "20px",
                                                                        fontSize:
                                                                            "12px",
                                                                        fontWeight:
                                                                            "600",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: "4px",
                                                                    }}
                                                                >
                                                                    ✅ Verified
                                                                </div>
                                                            )}
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "grid",
                                                                    gridTemplateColumns:
                                                                        "repeat(auto-fit, minmax(200px, 1fr))",
                                                                    gap: "15px",
                                                                    marginBottom:
                                                                        "15px",
                                                                }}
                                                            >
                                                                <div>
                                                                    <strong
                                                                        style={{
                                                                            color: "#374151",
                                                                            fontSize:
                                                                                "14px",
                                                                        }}
                                                                    >
                                                                        Bank
                                                                        Name:
                                                                    </strong>
                                                                    <p
                                                                        style={{
                                                                            margin: "5px 0",
                                                                            color: "#6b7280",
                                                                        }}
                                                                    >
                                                                        {account.bank_name ||
                                                                            "Not specified"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <strong
                                                                        style={{
                                                                            color: "#374151",
                                                                            fontSize:
                                                                                "14px",
                                                                        }}
                                                                    >
                                                                        Account
                                                                        Holder:
                                                                    </strong>
                                                                    <p
                                                                        style={{
                                                                            margin: "5px 0",
                                                                            color: "#6b7280",
                                                                        }}
                                                                    >
                                                                        {account.account_holder_name ||
                                                                            "Not specified"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <strong
                                                                        style={{
                                                                            color: "#374151",
                                                                            fontSize:
                                                                                "14px",
                                                                        }}
                                                                    >
                                                                        Account
                                                                        Number:
                                                                    </strong>
                                                                    <p
                                                                        style={{
                                                                            margin: "5px 0",
                                                                            color: "#6b7280",
                                                                            fontFamily:
                                                                                "monospace",
                                                                        }}
                                                                    >
                                                                        {account.account_number
                                                                            ? `****${account.account_number.slice(-4)}`
                                                                            : "Not specified"}
                                                                    </p>
                                                                </div>
                                                                {account.routing_number && (
                                                                    <div>
                                                                        <strong
                                                                            style={{
                                                                                color: "#374151",
                                                                                fontSize:
                                                                                    "14px",
                                                                            }}
                                                                        >
                                                                            Routing
                                                                            Number:
                                                                        </strong>
                                                                        <p
                                                                            style={{
                                                                                margin: "5px 0",
                                                                                color: "#6b7280",
                                                                                fontFamily:
                                                                                    "monospace",
                                                                            }}
                                                                        >
                                                                            {
                                                                                account.routing_number
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                {account.iban && (
                                                                    <div>
                                                                        <strong
                                                                            style={{
                                                                                color: "#374151",
                                                                                fontSize:
                                                                                    "14px",
                                                                            }}
                                                                        >
                                                                            IBAN:
                                                                        </strong>
                                                                        <p
                                                                            style={{
                                                                                margin: "5px 0",
                                                                                color: "#6b7280",
                                                                                fontFamily:
                                                                                    "monospace",
                                                                            }}
                                                                        >
                                                                            {
                                                                                account.iban
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                {account.swift_code && (
                                                                    <div>
                                                                        <strong
                                                                            style={{
                                                                                color: "#374151",
                                                                                fontSize:
                                                                                    "14px",
                                                                            }}
                                                                        >
                                                                            SWIFT
                                                                            Code:
                                                                        </strong>
                                                                        <p
                                                                            style={{
                                                                                margin: "5px 0",
                                                                                color: "#6b7280",
                                                                                fontFamily:
                                                                                    "monospace",
                                                                            }}
                                                                        >
                                                                            {
                                                                                account.swift_code
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {account.bank_address && (
                                                                <div
                                                                    style={{
                                                                        marginBottom:
                                                                            "15px",
                                                                    }}
                                                                >
                                                                    <strong
                                                                        style={{
                                                                            color: "#374151",
                                                                            fontSize:
                                                                                "14px",
                                                                        }}
                                                                    >
                                                                        Bank
                                                                        Address:
                                                                    </strong>
                                                                    <p
                                                                        style={{
                                                                            margin: "5px 0",
                                                                            color: "#6b7280",
                                                                            lineHeight:
                                                                                "1.5",
                                                                        }}
                                                                    >
                                                                        {
                                                                            account.bank_address
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    gap: "10px",
                                                                    justifyContent:
                                                                        "flex-end",
                                                                    paddingTop:
                                                                        "15px",
                                                                    borderTop:
                                                                        "1px solid #e2e8f0",
                                                                }}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleEditBankAccount(
                                                                            index
                                                                        )
                                                                    }
                                                                    style={{
                                                                        padding:
                                                                            "8px 16px",
                                                                        background:
                                                                            "#3b82f6",
                                                                        color: "white",
                                                                        border: "none",
                                                                        borderRadius:
                                                                            "6px",
                                                                        cursor: "pointer",
                                                                        fontWeight:
                                                                            "500",
                                                                        fontSize:
                                                                            "13px",
                                                                        transition:
                                                                            "all 0.2s ease",
                                                                    }}
                                                                    onMouseOver={(
                                                                        e
                                                                    ) => {
                                                                        e.target.style.background =
                                                                            "#2563eb";
                                                                        e.target.style.transform =
                                                                            "translateY(-1px)";
                                                                    }}
                                                                    onMouseOut={(
                                                                        e
                                                                    ) => {
                                                                        e.target.style.background =
                                                                            "#3b82f6";
                                                                        e.target.style.transform =
                                                                            "translateY(0)";
                                                                    }}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveBankAccount(
                                                                            index
                                                                        )
                                                                    }
                                                                    style={{
                                                                        padding:
                                                                            "8px 16px",
                                                                        background:
                                                                            "#ef4444",
                                                                        color: "white",
                                                                        border: "none",
                                                                        borderRadius:
                                                                            "6px",
                                                                        cursor: "pointer",
                                                                        fontWeight:
                                                                            "500",
                                                                        fontSize:
                                                                            "13px",
                                                                        transition:
                                                                            "all 0.2s ease",
                                                                    }}
                                                                    onMouseOver={(
                                                                        e
                                                                    ) => {
                                                                        e.target.style.background =
                                                                            "#dc2626";
                                                                        e.target.style.transform =
                                                                            "translateY(-1px)";
                                                                    }}
                                                                    onMouseOut={(
                                                                        e
                                                                    ) => {
                                                                        e.target.style.background =
                                                                            "#ef4444";
                                                                        e.target.style.transform =
                                                                            "translateY(0)";
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {bankDetails.length === 0 && (
                                        <div
                                            style={{
                                                textAlign: "center",
                                                padding: "40px 20px",
                                                color: "#6b7280",
                                                fontSize: "16px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "48px",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                🏦
                                            </div>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                No bank accounts added yet
                                            </p>
                                            <p
                                                style={{
                                                    margin: "5px 0 0 0",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                Add your first bank account
                                                using the form above
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="btnsContainer">
                            <button
                                onClick={handleReset}
                                className="btnFormNormal"
                                type="button"
                                disabled={isPending}
                            >
                                Cancel
                            </button>
                            <button
                                className="btnSubmit"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? "Processing..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </form>

                <Modal.Window name="qr-code-view">
                    <QRCodeModal qrCode={userData.qr_code} />
                </Modal.Window>
            </Modal>
        </>
    );
}

export default ChangeInfoForm;
