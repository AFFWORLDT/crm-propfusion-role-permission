import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import Table from "../../ui/Table";
import ConfirmDelete from "../../ui/ConfirmDelete";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import styles from "./Jobs.module.css";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Fetch jobs on component mount
    useEffect(() => {
        fetchJobs();
    }, []);

    // Handle job_id parameter from URL
    useEffect(() => {
        const jobId = searchParams.get('job_id');
        if (jobId) {
            // If there's a job_id in the URL, we could highlight or filter the specific job
            console.log('Job ID from URL:', jobId);
        }
    }, [searchParams]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/jobs");
            setJobs(response.data || []);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        try {
            await axiosInstance.delete(`/jobs/${jobId}`);
            toast.success("Job deleted successfully");
            fetchJobs(); // Refresh the list
            setShowDeleteModal(false);
            setSelectedJob(null);
        } catch (error) {
            console.error("Error deleting job:", error);
            toast.error("Failed to delete job");
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
                <p>Loading jobs...</p>
            </div>
        );
    }

    return (
        <section className="sectionContainer">
            <SectionTop heading="Jobs Management">
                <TabBar
                    tabs={[
                        {
                            id: "jobs",
                            label: "Jobs",
                            bgColor: "#f0f7ff",
                            fontColor: "#4d94ff",
                            path: "/carrier",
                        },
                        {
                            id: "applications",
                            label: "Applications",
                            bgColor: "#f0f7ff",
                            fontColor: "#4d94ff",
                            path: "/carrier/applications",
                        },
                    ]}
                    activeTab="jobs"
                    navigateTo={(tabId) => {
                        if (tabId === "jobs") {
                            navigate("/carrier");
                        } else if (tabId === "applications") {
                            // Preserve any existing job_id when going to applications
                            const currentJobId = new URLSearchParams(window.location.search).get('job_id');
                            if (currentJobId) {
                                navigate(`/carrier/applications?job_id=${currentJobId}`);
                            } else {
                                navigate("/carrier/applications");
                            }
                        }
                    }}
                />
            </SectionTop>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>All Jobs</h2>
                    <div className={styles.headerActions}>
                        <button 
                            onClick={() => navigate("/carrier/applications")}
                            className={styles.applicationsButton}
                        >
                            View Applications
                        </button>
                        <button 
                            onClick={() => navigate("/jobs/add")}
                            className={styles.addButton}
                        >
                            <Plus size={16} />
                            Add New Job
                        </button>
                    </div>
                </div>

                <Table columns="1fr 1fr 1fr 1fr 1fr 1fr 120px" hasShadow={true}>
                    <Table.Header>
                        <div>Title</div>
                        <div>Category</div>
                        <div>Experience Level</div>
                        <div>Job Type</div>
                        <div>Location</div>
                        <div>Status</div>
                        <div>Actions</div>
                    </Table.Header>
                    <Table.Body 
                        data={jobs?.jobs} 
                        render={(job) => (
                            <Table.Row key={job._id}>
                                <div className={styles.titleCell}>
                                    <h4>{job.title}</h4>
                                    <p>{job.description?.substring(0, 50)}...</p>
                                </div>
                                <div>{getCategoryBadge(job.category)}</div>
                                <div>{getExperienceLevelBadge(job.experience_level)}</div>
                                <div>{getJobTypeBadge(job.job_type)}</div>
                                <div>{job.location}</div>
                                <div>{getStatusBadge(job.status)}</div>
                                <div className={styles.actions}>
                                    <button
                                        onClick={() => navigate(`/jobs/view/${job._id}`)}
                                        className={styles.actionButton}
                                        title="View"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => navigate(`/jobs/edit/${job._id}`)}
                                        className={styles.actionButton}
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedJob(job);
                                            setShowDeleteModal(true);
                                        }}
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </Table.Row>
                        )}
                    />
                </Table>

                {jobs?.jobs?.length === 0 && !loading && (
                    <div className={styles.emptyState}>
                        <p>No jobs found. Create your first job posting!</p>
                        <button 
                            onClick={() => navigate("/jobs/add")}
                            className={styles.addButton}
                        >
                            <Plus size={16} />
                            Add New Job
                        </button>
                    </div>
                )}
            </div>

            {showDeleteModal && selectedJob && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <ConfirmDelete
                            resourceName="Job"
                            onConfirm={() => handleDelete(selectedJob._id)}
                            onCloseModal={() => {
                                setShowDeleteModal(false);
                                setSelectedJob(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

export default Jobs;
