import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import FormInputSelect from "../../ui/FormInputSelect";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import styles from "./JobForm.module.css";

function JobForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(id ? true : false);
    const isEditMode = !!id;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        mode: "onChange",
    });

    // Form options
    const statusOptions = [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "closed", label: "Closed" },
        { value: "archived", label: "Archived" },
    ];

    const categoryOptions = [
        { value: "sales", label: "Sales" },
        { value: "marketing", label: "Marketing" },
        { value: "development", label: "Development" },
        { value: "design", label: "Design" },
        { value: "administration", label: "Administration" },
        { value: "customer_service", label: "Customer Service" },
        { value: "finance", label: "Finance" },
        { value: "human_resources", label: "Human Resource" },
        { value: "operation", label: "Operation" },
        { value: "other", label: "Other" },
    ];

    const experienceLevelOptions = [
        { value: "entry", label: "Entry Level" },
        { value: "junior", label: "Junior" },
        { value: "mid", label: "Mid Level" },
        { value: "senior", label: "Senior" },
        { value: "executive", label: "Executive" },
    ];

    const jobTypeOptions = [
        { value: "full_time", label: "Full Time" },
        { value: "part_time", label: "Part Time" },
        { value: "contract", label: "Contract" },
        { value: "internship", label: "Internship" },
        { value: "freelance", label: "Freelance" },
    ];

    // Fetch job data for editing
    useEffect(() => {
        if (isEditMode) {
            fetchJobData();
        }
    }, [id]);

    const fetchJobData = async () => {
        try {
            setInitialLoading(true);
            const response = await axiosInstance.get(`/jobs/${id}`);
            const jobData = response.data;

            // Set form values
            Object.keys(jobData).forEach((key) => {
                setValue(key, jobData[key]);
            });
        } catch (error) {
            console.error("Error fetching job:", error);
            toast.error("Failed to fetch job data");
            navigate("/jobs");
        } finally {
            setInitialLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // Convert data to URL-encoded format
            const formData = new URLSearchParams();
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });
            
            console.log("Sending job data:", formData.toString());
            
            if (isEditMode) {
                await axiosInstance.put(`/jobs/${id}`, formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                toast.success("Job updated successfully");
            } else {
                await axiosInstance.post("/jobs", formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                toast.success("Job created successfully");
            }

            navigate("/jobs");
        } catch (error) {
            console.error("Error saving job:", error);
            toast.error(
                isEditMode ? "Failed to update job" : "Failed to create job"
            );
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading job data...</p>
            </div>
        );
    }

    return (
        <section>
            <SectionTop heading={isEditMode ? "Edit Job" : "Add New Job"}>
                <TabBar
                    tabs={[
                        {
                            id: "jobs",
                            label: "Jobs",
                            bgColor: "#f0f7ff",
                            fontColor: "#4d94ff",
                            path: "/jobs",
                        },
                    ]}
                    activeTab="jobs"
                    navigateTo={() => `/jobs`}
                />
            </SectionTop>

            <div className={styles.container}>
                <div className={styles.header}>
                    <button
                        onClick={() => navigate("/jobs")}
                        className={styles.backButton}
                    >
                        <ArrowLeft size={16} />
                        Back to Jobs
                    </button>
                    <h2>{isEditMode ? "Edit Job" : "Add New Job"}</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formGrid}>
                        {/* Title */}
                        <div className={styles.formGroup}>
                            <label htmlFor="title">Job Title *</label>
                            <input
                                type="text"
                                id="title"
                                {...register("title", {
                                    required: "Job title is required",
                                    minLength: {
                                        value: 3,
                                        message:
                                            "Title must be at least 3 characters",
                                    },
                                })}
                                placeholder="Enter job title"
                                className={errors.title ? styles.error : ""}
                            />
                            {errors.title && (
                                <span className={styles.errorMessage}>
                                    {errors.title.message}
                                </span>
                            )}
                        </div>

                        {/* Category */}
                        <div className={styles.formGroup}>
                            <label htmlFor="category">Category *</label>
                            <FormInputSelect
                                register={register}
                                registerName="category"
                                options={categoryOptions}
                                required={true}
                            />
                            {errors.category && (
                                <span className={styles.errorMessage}>
                                    {errors.category.message}
                                </span>
                            )}
                        </div>

                        {/* Experience Level */}
                        <div className={styles.formGroup}>
                            <label htmlFor="experience_level">
                                Experience Level *
                            </label>
                            <FormInputSelect
                                register={register}
                                registerName="experience_level"
                                options={experienceLevelOptions}
                                required={true}
                            />
                            {errors.experience_level && (
                                <span className={styles.errorMessage}>
                                    {errors.experience_level.message}
                                </span>
                            )}
                        </div>

                        {/* Job Type */}
                        <div className={styles.formGroup}>
                            <label htmlFor="job_type">Job Type *</label>
                            <FormInputSelect
                                register={register}
                                registerName="job_type"
                                options={jobTypeOptions}
                                required={true}
                            />
                            {errors.job_type && (
                                <span className={styles.errorMessage}>
                                    {errors.job_type.message}
                                </span>
                            )}
                        </div>

                        {/* Location */}
                        <div className={styles.formGroup}>
                            <label htmlFor="location">Location *</label>
                            <input
                                type="text"
                                id="location"
                                {...register("location", {
                                    required: "Location is required",
                                })}
                                placeholder="Enter job location"
                                className={errors.location ? styles.error : ""}
                            />
                            {errors.location && (
                                <span className={styles.errorMessage}>
                                    {errors.location.message}
                                </span>
                            )}
                        </div>

                        {/* Status */}
                        <div className={styles.formGroup}>
                            <label htmlFor="status">Status *</label>
                            <FormInputSelect
                                register={register}
                                registerName="status"
                                options={statusOptions}
                                required={true}
                            />
                            {errors.status && (
                                <span className={styles.errorMessage}>
                                    {errors.status.message}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className={styles.formGroup}>
                            <label htmlFor="description">Job Description *</label>
                            <textarea
                                id="description"
                                rows={4}
                                {...register("description", {
                                    required: "Job description is required",
                                    minLength: {
                                        value: 10,
                                        message:
                                            "Description must be at least 10 characters",
                                    },
                                })}
                                placeholder="Enter detailed job description"
                                className={errors.description ? styles.error : ""}
                            />
                            {errors.description && (
                                <span className={styles.errorMessage}>
                                    {errors.description.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={() => navigate("/jobs")}
                            className={styles.cancelButton}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditMode
                                  ? "Update Job"
                                  : "Create Job"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default JobForm;
