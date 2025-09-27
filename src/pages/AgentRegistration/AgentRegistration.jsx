import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    User,
    Mail,
    Lock,
    Phone,
    Building,
    Briefcase,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./AgentRegistration.module.css";
import { registerAgent } from "../../services/apiAgentRegistration";
import axios from "axios";
import { getApiUrl } from "../../utils/getApiUrl";

const AgentRegistration = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("affiliate_id");
    const roleid = searchParams.get("roleid");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [profile, setProfile] = useState(null);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        trigger,
    } = useForm({
        mode: "onChange",
    });

    // const password = watch('password');

    // Form validation rules
    const validationRules = {
        name: {
            required: "Name is required",
            minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
            },
        },
        email: {
            required: "Email is required",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
            },
        },
        password: {
            required: "Password is required",
            minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
            },
            pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
            },
        },

        phone: {
            required: "Phone number is required",
            pattern: {
                value: /^[+]?[\d\s\-()]+$/,
                message: "Invalid phone number",
            },
        },

        experience_years: {
            required: "Experience years is required",
            min: { value: 0, message: "Experience cannot be negative" },
            max: { value: 50, message: "Experience cannot exceed 50 years" },
        },
    };

    // Handle form submission
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            // Prepare agent data according to correct API structure
            const agentData = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: "agent", // Default role for new registrations
                team: 0, // Default team
                gender: data.gender || "",
                phone: data.phone,
                // nationality and emirates_id removed for simplicity
                passport_no: data.passport_no || null,
                // documents removed for simplicity
                avatar: formData.avatar || null, // Profile picture
                kyc_verification: false,
                // created_at removed - backend handles automatically
                // state: "pending", // New registrations start as pending
                // dob removed for simplicity
                // remarks, languages, brn_number, job_type removed for simplicity
                experience_years: data.experience_years || null,
                specialities: data.specialities
                    ? data.specialities.split(",").map((spec) => spec.trim())
                    : [],
                property_default_view: data.property_default_view || null,
                leads_default_view: data.leads_default_view || null,
                whatsapp_notification: false,
                // joining_date removed for simplicity
                telCode: data.telCode || "",
            };

            // Make API call using our service
            const res = await registerAgent(agentData, id, roleid);

            if (res && profile) {
                const formData = new FormData();
                if (profile) {
                    formData.append("file", profile);
                }
                await axios.post(
                    `${getApiUrl()}/agent/${res?.id}/upload_avatar`,
                    formData
                );
            }

            toast.success(
                "Registration successful! Your account is pending approval."
            );

            // Reset form
            setFormData({});
            setStep(1);

            // Redirect to login or show success message
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(
                error.message || "Registration failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Next step validation
    const nextStep = async () => {
        const fieldsToValidate = getFieldsForStep(step);
        const isValid = await trigger(fieldsToValidate);

        if (isValid) {
            // Save current step data
            const currentData = watch(fieldsToValidate);
            setFormData((prev) => ({ ...prev, ...currentData }));

            if (step < 3) {
                setStep(step + 1);
            }
        }
    };

    // Previous step
    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Get fields to validate for each step
    const getFieldsForStep = (currentStep) => {
        switch (currentStep) {
            case 1:
                return ["name", "email", "password"];
            case 2:
                return ["phone"];
            case 3:
                return ["experience_years", "specialities"];
            default:
                return [];
        }
    };

    // Load saved data when changing steps
    useEffect(() => {
        if (formData) {
            Object.keys(formData).forEach((key) => {
                setValue(key, formData[key]);
            });
        }
    }, [step, formData, setValue]);
    console.log(profile);
    return (
        <div className={styles.container}>
            <div className={styles.registrationCard}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Building size={32} />
                        <h1>Agent Registration</h1>
                    </div>
                    <p className={styles.subtitle}>
                        Join our real estate platform and start your journey
                    </p>
                </div>

                {/* Progress Steps */}
                <div className={styles.progressSteps}>
                    {[1, 2, 3].map((stepNumber) => (
                        <div
                            key={stepNumber}
                            className={`${styles.step} ${step >= stepNumber ? styles.active : ""} ${step === stepNumber ? styles.current : ""}`}
                        >
                            <div className={styles.stepNumber}>
                                {stepNumber}
                            </div>
                            <span className={styles.stepLabel}>
                                {stepNumber === 1
                                    ? "Account"
                                    : stepNumber === 2
                                      ? "Personal"
                                      : "Professional"}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {/* Step 1: Account Information */}
                    {step === 1 && (
                        <div className={styles.stepContent}>
                            <h2>Account Information</h2>

                            <div className={styles.formGroup}>
                                <label htmlFor="name">
                                    <User size={16} />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name", validationRules.name)}
                                    placeholder="Enter your full name"
                                    className={errors.name ? styles.error : ""}
                                />
                                {errors.name && (
                                    <span className={styles.errorMessage}>
                                        <AlertCircle size={14} />
                                        {errors.name.message}
                                    </span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">
                                    <Mail size={16} />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register(
                                        "email",
                                        validationRules.email
                                    )}
                                    placeholder="Enter your email address"
                                    className={errors.email ? styles.error : ""}
                                />
                                {errors.email && (
                                    <span className={styles.errorMessage}>
                                        <AlertCircle size={14} />
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password">
                                    <Lock size={16} />
                                    Password *
                                </label>
                                <div className={styles.passwordInput}>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        {...register(
                                            "password",
                                            validationRules.password
                                        )}
                                        placeholder="Create a strong password"
                                        className={
                                            errors.password ? styles.error : ""
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className={styles.passwordToggle}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className={styles.errorMessage}>
                                        <AlertCircle size={14} />
                                        {errors.password.message}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Personal Information */}
                    {step === 2 && (
                        <div className={styles.stepContent}>
                            <h2>Personal Information</h2>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone">
                                    <Phone size={16} />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    {...register(
                                        "phone",
                                        validationRules.phone
                                    )}
                                    placeholder="Enter your phone number"
                                    className={errors.phone ? styles.error : ""}
                                />
                                {errors.phone && (
                                    <span className={styles.errorMessage}>
                                        <AlertCircle size={14} />
                                        {errors.phone.message}
                                    </span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="gender">
                                    <User size={16} />
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    {...register("gender")}
                                    className={styles.selectInput}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Professional Information */}
                    {step === 3 && (
                        <div className={styles.stepContent}>
                            <h2>Professional Information</h2>

                            <div className={styles.formGroup}>
                                <label htmlFor="experience_years">
                                    <Briefcase size={16} />
                                    Years of Experience *
                                </label>
                                <input
                                    type="number"
                                    id="experience_years"
                                    {...register(
                                        "experience_years",
                                        validationRules.experience_years
                                    )}
                                    placeholder="Enter years of experience"
                                    min="0"
                                    max="50"
                                    className={
                                        errors.experience_years
                                            ? styles.error
                                            : ""
                                    }
                                />
                                {errors.experience_years && (
                                    <span className={styles.errorMessage}>
                                        <AlertCircle size={14} />
                                        {errors.experience_years.message}
                                    </span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="specialities">
                                    <Building size={16} />
                                    Specialities
                                </label>
                                <textarea
                                    id="specialities"
                                    {...register("specialities")}
                                    placeholder="Enter your specialities (e.g., Residential, Commercial, Off-plan)"
                                    rows="3"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="avatar">
                                    <User size={16} />
                                    Profile Picture
                                </label>
                                <div className={styles.fileUpload}>
                                    <input
                                        type="file"
                                        id="avatar"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                if (
                                                    file.size <=
                                                    5 * 1024 * 1024
                                                ) {
                                                    // 5MB limit
                                                    setProfile(file);
                                                } else {
                                                    toast.error(
                                                        "Profile picture should be less than 5MB"
                                                    );
                                                }
                                            }
                                        }}
                                        className={styles.fileInput}
                                    />
                                    <label
                                        htmlFor="avatar"
                                        className={styles.fileLabel}
                                    >
                                        <User size={20} />
                                        <span>Choose profile picture</span>
                                        <small>Max 5MB (JPG, PNG)</small>
                                    </label>
                                </div>

                                {/* Profile picture preview */}
                                {profile && (
                                    <div className={styles.avatarPreview}>
                                        <img
                                            src={URL.createObjectURL(profile)}
                                            alt="Profile Preview"
                                            className={styles.avatarImage}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setProfile(null)}
                                            className={styles.removeAvatar}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className={styles.navigation}>
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className={styles.prevBtn}
                                disabled={isSubmitting}
                            >
                                Previous
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className={styles.nextBtn}
                                disabled={isSubmitting}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className={styles.footer}>
                    <p>
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className={styles.linkButton}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AgentRegistration;
