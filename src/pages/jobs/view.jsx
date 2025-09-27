import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, MapPin, Briefcase, Users, Calendar } from "lucide-react";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import styles from "./JobView.module.css";

function ViewJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobData();
    }, [id]);

    const fetchJobData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/jobs/${id}`);
            setJob(response.data);
        } catch (error) {
            console.error("Error fetching job:", error);
            toast.error("Failed to fetch job data");
            navigate("/jobs");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { color: "#6b7280", bg: "#f3f4f6" },
            published: { color: "#059669", bg: "#d1fae5" },
            closed: { color: "#dc2626", bg: "#fee2e2" },
            archived: { color: "#7c3aed", bg: "#ede9fe" }
        };
        
        const config = statusConfig[status] || statusConfig.draft;
        
        return (
            <span 
                className={styles.statusBadge}
                style={{ 
                    backgroundColor: config.bg, 
                    color: config.color 
                }}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getCategoryBadge = (category) => {
        const categoryConfig = {
            sales: { color: "#059669", bg: "#d1fae5" },
            marketing: { color: "#dc2626", bg: "#fee2e2" },
            development: { color: "#2563eb", bg: "#dbeafe" },
            design: { color: "#7c3aed", bg: "#ede9fe" },
            administration: { color: "#ea580c", bg: "#fed7aa" },
            customer_service: { color: "#0891b2", bg: "#cffafe" },
            finance: { color: "#059669", bg: "#d1fae5" },
            human_resource: { color: "#7c3aed", bg: "#ede9fe" },
            operation: { color: "#dc2626", bg: "#fee2e2" },
            other: { color: "#6b7280", bg: "#f3f4f6" }
        };
        
        const config = categoryConfig[category] || categoryConfig.other;
        
        return (
            <span 
                className={styles.categoryBadge}
                style={{ 
                    backgroundColor: config.bg, 
                    color: config.color 
                }}
            >
                {category.replace('_', ' ').split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
            </span>
        );
    };

    const getExperienceLevelBadge = (level) => {
        const levelConfig = {
            entry: { color: "#059669", bg: "#d1fae5" },
            junior: { color: "#2563eb", bg: "#dbeafe" },
            mid: { color: "#ea580c", bg: "#fed7aa" },
            senior: { color: "#7c3aed", bg: "#ede9fe" },
            executive: { color: "#dc2626", bg: "#fee2e2" }
        };
        
        const config = levelConfig[level] || levelConfig.entry;
        
        return (
            <span 
                className={styles.levelBadge}
                style={{ 
                    backgroundColor: config.bg, 
                    color: config.color 
                }}
            >
                {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
        );
    };

    const getJobTypeBadge = (type) => {
        const typeConfig = {
            full_time: { color: "#059669", bg: "#d1fae5" },
            part_time: { color: "#2563eb", bg: "#dbeafe" },
            contract: { color: "#ea580c", bg: "#fed7aa" },
            internship: { color: "#7c3aed", bg: "#ede9fe" },
            freelance: { color: "#dc2626", bg: "#fee2e2" }
        };
        
        const config = typeConfig[type] || typeConfig.full_time;
        
        return (
            <span 
                className={styles.typeBadge}
                style={{ 
                    backgroundColor: config.bg, 
                    color: config.color 
                }}
            >
                {type.replace('_', ' ').split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
            </span>
        );
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading job details...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className={styles.error}>
                <p>Job not found</p>
                <button onClick={() => navigate("/jobs")} className={styles.backButton}>
                    Back to Jobs
                </button>
            </div>
        );
    }

    return (
        <section>
            <SectionTop heading="Job Details">
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
                    <button
                        onClick={() => navigate(`/jobs/edit/${id}`)}
                        className={styles.editButton}
                    >
                        <Edit size={16} />
                        Edit Job
                    </button>
                </div>

                <div className={styles.jobCard}>
                    <div className={styles.jobHeader}>
                        <div className={styles.titleSection}>
                            <h1>{job.title}</h1>
                            <div className={styles.badges}>
                                {getStatusBadge(job.status)}
                                {getCategoryBadge(job.category)}
                            </div>
                        </div>
                    </div>

                    <div className={styles.jobInfo}>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <MapPin size={16} />
                                <span>{job.location}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <Briefcase size={16} />
                                <span>{getJobTypeBadge(job.job_type)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <Users size={16} />
                                <span>{getExperienceLevelBadge(job.experience_level)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <Calendar size={16} />
                                <span>Posted on {new Date(job.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.description}>
                        <h3>Job Description</h3>
                        <p>{job.description}</p>
                    </div>

                    <div className={styles.metadata}>
                        <div className={styles.metaItem}>
                            <strong>Job ID:</strong> {job._id}
                        </div>
                        {job.updatedAt && (
                            <div className={styles.metaItem}>
                                <strong>Last Updated:</strong> {new Date(job.updatedAt).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ViewJob;
