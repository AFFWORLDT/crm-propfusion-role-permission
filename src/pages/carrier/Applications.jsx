import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    ArrowLeft,
    Filter,
    Eye,
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Briefcase,
    Download,
} from "lucide-react";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import styles from "./Applications.module.css";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(
        searchParams.get("job_id") || ""
    );
    const [jobs, setJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch applications and jobs on component mount
    useEffect(() => {
        fetchApplications();
        fetchJobs();
    }, []);

    // Filter applications when job_id changes
    useEffect(() => {
        if (selectedJobId) {
            fetchApplications(selectedJobId);
            setSearchParams({ job_id: selectedJobId });
        } else {
            fetchApplications();
            setSearchParams({});
        }
    }, [selectedJobId]);

    const fetchApplications = async (jobId = null) => {
        try {
            setLoading(true);
            let url = "/applications";
            if (jobId) {
                url += `?job_id=${jobId}`;
            }
            const response = await axiosInstance.get(url);

            const data = response.data?.applications || [];
            // Ensure data is always an array
            const applicationsArray = Array.isArray(data) ? data : [];
            setApplications(applicationsArray);
            setFilteredApplications(applicationsArray);
        } catch (error) {
            console.error("Error fetching applications:", error);
            toast.error("Failed to fetch applications");
            // Set empty arrays on error
            setApplications([]);
            setFilteredApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobs = async () => {
        try {
            setJobsLoading(true);
            const response = await axiosInstance.get("/jobs");
            const data = response.data?.jobs || response.data || [];
            const jobsArray = Array.isArray(data) ? data : [];
            setJobs(jobsArray);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to fetch jobs");
            setJobs([]);
        } finally {
            setJobsLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: "#6b7280", bg: "#f3f4f6" },
            reviewed: { color: "#374151", bg: "#e5e7eb" },
            shortlisted: { color: "#1f2937", bg: "#d1d5db" },
            rejected: { color: "#6b7280", bg: "#f3f4f6" },
            hired: { color: "#374151", bg: "#e5e7eb" },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <span
                className={styles.statusBadge}
                style={{
                    backgroundColor: config.bg,
                    color: config.color,
                }}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getExperienceLevelBadge = (level) => {
        const levelConfig = {
            entry: { color: "#6b7280", bg: "#f3f4f6" },
            junior: { color: "#374151", bg: "#e5e7eb" },
            mid: { color: "#1f2937", bg: "#d1d5db" },
            senior: { color: "#6b7280", bg: "#f3f4f6" },
            executive: { color: "#374151", bg: "#e5e7eb" },
        };

        const config = levelConfig[level] || levelConfig.entry;

        return (
            <span
                className={styles.statusBadge}
                style={{
                    backgroundColor: config.bg,
                    color: config.color,
                }}
            >
                {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
        );
    };

    const handleJobFilterChange = (jobId) => {
        setSelectedJobId(jobId);
    };

    const clearFilters = () => {
        setSelectedJobId("");
        setFilteredApplications(applications);
    };

    const handleResumeDownload = async (resumeUrl) => {
        try {
            // Create a temporary anchor element
            const link = document.createElement("a");
            link.href = resumeUrl;
            link.download = "resume.pdf"; // Default filename
            link.target = "_blank";

            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading resume:", error);
            toast.error("Failed to download resume");
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading applications...</p>
            </div>
        );
    }

    return (
        <section className="sectionContainer">
            <SectionTop heading="Job Applications">
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
                    activeTab="applications"
                    navigateTo={(tabId) => {
                        if (tabId === "jobs") {
                            // Preserve job_id when going to jobs page
                            const currentJobId = searchParams.get("job_id");
                            if (currentJobId) {
                                navigate(`/carrier?job_id=${currentJobId}`);
                            } else {
                                navigate("/carrier");
                            }
                        } else if (tabId === "applications") {
                            navigate("/carrier/applications");
                        }
                    }}
                />
            </SectionTop>

            <div className={styles.container}>
                <div className={styles.header}>
                    <button
                        onClick={() => navigate("/carrier")}
                        className={styles.backButton}
                    >
                        <ArrowLeft size={20} />
                        Back to Jobs
                    </button>
                    <h2>Job Applications</h2>
                </div>

                {/* Filters */}
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="jobFilter">
                            <Filter size={18} />
                            Filter by Job
                            {jobsLoading && (
                                <span className={styles.loadingIndicator}>
                                    {" "}
                                    (Loading...)
                                </span>
                            )}
                        </label>
                        <select
                            id="jobFilter"
                            value={selectedJobId}
                            onChange={(e) =>
                                handleJobFilterChange(e.target.value)
                            }
                            className={styles.filterSelect}
                            disabled={jobsLoading}
                        >
                            <option value="">All Jobs</option>
                            {jobsLoading ? (
                                <option value="" disabled>
                                    Loading jobs...
                                </option>
                            ) : (
                                Array.isArray(jobs) &&
                                jobs.length > 0 &&
                                jobs.map((job) => (
                                    <option key={job._id} value={job._id}>
                                        {job.title} (ID: {job._id})
                                    </option>
                                ))
                            )}
                        </select>
                        {selectedJobId && (
                            <button
                                onClick={clearFilters}
                                className={styles.clearFilter}
                            >
                                Clear Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* Applications List */}
                <div className={styles.applicationsList}>
                    {!Array.isArray(filteredApplications) ||
                    filteredApplications.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No applications found.</p>
                            {selectedJobId && (
                                <button
                                    onClick={clearFilters}
                                    className={styles.clearFilter}
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredApplications.map((application) => (
                            <div
                                key={application._id}
                                className={styles.applicationCard}
                            >
                                <div className={styles.applicationHeader}>
                                    <div className={styles.applicantInfo}>
                                        <div className={styles.avatar}>
                                            <User size={24} />
                                        </div>
                                        <div
                                            className={styles.applicantDetails}
                                        >
                                            <h3>
                                                {application.applicant_name ||
                                                    "Anonymous"}
                                            </h3>
                                            <p className={styles.jobId}>
                                                Job ID: {application.job_id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.statusSection}>
                                        {getStatusBadge(application.status)}
                                    </div>
                                </div>

                                <div className={styles.applicationBody}>
                                    <div className={styles.contactInfo}>
                                        <div className={styles.contactItem}>
                                            <Mail size={16} />
                                            <span>
                                                {application.applicant_email ||
                                                    "No email provided"}
                                            </span>
                                        </div>
                                        <div className={styles.contactItem}>
                                            <Phone size={16} />
                                            <span>
                                                {application.applicant_phone ||
                                                    "No phone provided"}
                                            </span>
                                        </div>
                                        <div className={styles.contactItem}>
                                            <Calendar size={16} />
                                            <span>
                                                Source:{" "}
                                                {application.source ||
                                                    "Unknown"}
                                            </span>
                                        </div>
                                    </div>

                                    {application.cover_letter && (
                                        <div className={styles.coverLetter}>
                                            <h4>Cover Letter</h4>
                                            <p>{application.cover_letter}</p>
                                        </div>
                                    )}

                                    {application?.resume_url &&(
                                        <div className={styles.resumeSection}>
                                            <h4>Resume</h4>
                                            <div
                                                className={
                                                    styles.downloadButtons
                                                }
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleResumeDownload(
                                                            application?.resume_url
                                                        )
                                                    }
                                                    className={
                                                        styles.downloadButton
                                                    }
                                                >
                                                    <Download size={16} />
                                                    Download PDF
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        window.open(
                                                            application?.resume_url,
                                                            "_blank"
                                                        )
                                                    }
                                                    className={
                                                        styles.viewButton
                                                    }
                                                >
                                                    <Eye size={16} />
                                                    View Online
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.applicationFooter}>
                                    <div className={styles.applicationDate}>
                                        <Calendar size={16} />
                                        <span>
                                            Applied on{" "}
                                            {new Date(
                                                application.created_at ||
                                                    Date.now()
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Summary */}
                <div className={styles.summary}>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>
                            Total Applications:
                        </span>
                        <span className={styles.summaryValue}>
                            {applications.length}
                        </span>
                    </div>
                    {selectedJobId && (
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryLabel}>
                                Filtered Applications:
                            </span>
                            <span className={styles.summaryValue}>
                                {filteredApplications.length}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Applications;
