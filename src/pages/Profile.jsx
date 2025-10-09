import { useEffect, useState, useRef } from "react";
import styles from "./Profile.module.css";
import SectionTop from "../ui/SectionTop";
import { useAuth } from "../context/AuthContext";
import useStaff from "../features/admin/staff/useStaff";
import toast from "react-hot-toast";
import useTeam from "../features/admin/teams/useTeam";
import Spinner from "../ui/Spinner";
import ChangeInfoForm from "../features/profile/ChangeInfoForm";
import ChangePassForm from "../features/profile/ChangePassForm";
import TabBar from "../ui/TabBar";
import { MENU_TABS } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { Upload, Trash2 } from "lucide-react";
import { uploadStaffAvatar } from "../services/apiStaff";
import { useQueryClient } from "@tanstack/react-query";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import axiosInstance from "../utils/axiosInstance";
import DummyPerson from "./../assets/dummy-person.png";
import useAllDetails from "../features/all-details/useAllDetails";
import ProfileBusinessCardGenerator from "../components/ProfileBusinessCardGenerator";

function Profile() {
    const navigate = useNavigate();
    const [activeProfileTab, setActiveProfileTab] = useState("info");
    const { data } = useAllDetails();
    const colorCode = data?.company_settings?.sidebar_color_code || "#020079";

    const { currentUser } = useAuth();
    const { data: userData, isLoading, error } = useStaff(currentUser?.id);
    const { data: teamData } = useTeam(userData?.team);
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const imgRef = useRef(null);
    const queryClient = useQueryClient();

    const [showCropModal, setShowCropModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [crop, setCrop] = useState({
        unit: "%",
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        aspect: 1,
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    // Auto-select whole image when crop modal opens
    useEffect(() => {
        if (showCropModal && previewUrl) {
            // Reset crop to cover whole image
            setCrop({
                unit: "%",
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                aspect: 1,
            });
            // Set completed crop immediately so save button is enabled
            setCompletedCrop({
                unit: "%",
                width: 100,
                height: 100,
                x: 0,
                y: 0,
                aspect: 1,
            });
        }
    }, [showCropModal, previewUrl]);

    const handleGeneratePortfolio = () => {
        const agentId = currentUser?.id;
        if (agentId) {
            navigate(`/portfolio/${agentId}`);
        } else {
            toast.error("Could not generate portfolio. User not found.");
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!currentUser?.id) {
            toast.error("User ID not found. Please try logging in again.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File size should be less than 5MB");
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);
        setSelectedFile(file);
        setShowCropModal(true);
    };

    const getCroppedImg = (image, crop) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    resolve(blob);
                },
                "image/jpeg",
                0.9
            );
        });
    };

    const handleCropComplete = async () => {
        if (!imgRef.current || !completedCrop) return;

        try {
            const croppedBlob = await getCroppedImg(
                imgRef.current,
                completedCrop
            );
            const croppedFile = new File([croppedBlob], selectedFile.name, {
                type: "image/jpeg",
            });

            await toast.promise(
                uploadStaffAvatar(currentUser.id, croppedFile),
                {
                    loading: "Uploading avatar...",
                    success: () => {
                        queryClient.invalidateQueries({ queryKey: ["staff"] });
                        queryClient.invalidateQueries({
                            queryKey: ["all-details"],
                        });
                        queryClient.invalidateQueries({ queryKey: ["team"] });
                        setShowCropModal(false);
                        setPreviewUrl(null);
                        setSelectedFile(null);
                        setCompletedCrop(null);
                        return "Avatar updated successfully!";
                    },
                    error: (err) => {
                        console.error("Upload error:", err);
                        return err.message || "Failed to update avatar";
                    },
                }
            );
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error("Failed to upload avatar. Please try again.");
        }
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setPreviewUrl(null);
        setSelectedFile(null);
        setCompletedCrop(null);
        setCrop({
            unit: "%",
            width: 100,
            height: 100,
            x: 0,
            y: 0,
            aspect: 1,
        });
    };

    const handleVideoUpload = async (e) => {
        try {
            const files = e.target.files;
            if (files.length > 0) {
                const file = files[0];

                // Validate file size (max 50MB)
                const maxSize = 50 * 1024 * 1024;
                if (file.size > maxSize) {
                    toast.error("Video file size should be less than 50MB");
                    return;
                }

                const formData = new FormData();
                formData.append("video", file);

                await toast.promise(
                    axiosInstance.post(
                        `/agent/${currentUser?.id}/upload_video`,
                        formData
                    ),
                    {
                        loading: "Uploading video...",
                        success: (res) => {
                            queryClient.invalidateQueries({
                                queryKey: ["staff"],
                            });
                            return (
                                res?.data.message ||
                                "Video uploaded successfully"
                            );
                        },
                        error: (err) => {
                            console.error("Video upload error:", err);
                            return err.message || "Failed to upload video";
                        },
                    }
                );
            }
        } catch (error) {
            console.error("Error uploading video:", error);
            toast.error("Failed to upload video. Please try again.");
        }
    };

    const handleDeleteVideo = async () => {
        try {
            if (window.confirm("Are you sure you want to delete this video?")) {
                await toast.promise(
                    axiosInstance.delete(
                        `/agent/${currentUser?.id}/delete_video`
                    ),
                    {
                        loading: "Deleting video...",
                        success: (res) => {
                            queryClient.invalidateQueries({
                                queryKey: ["staff"],
                            });
                            return (
                                res?.data.message ||
                                "Video deleted successfully"
                            );
                        },
                        error: (err) => {
                            console.error("Video delete error:", err);
                            return err.message || "Failed to delete video";
                        },
                    }
                );
            }
        } catch (error) {
            console.error("Error deleting video:", error);
            toast.error("Failed to delete video. Please try again.");
        }
    };

    const handleVideoClick = () => {
        videoInputRef.current?.click();
    };

    const handleWallet = () => {
        navigate("/wallet");
    };

    return (
        <div className="sectionContainer">
            <SectionTop heading="Profile">
                {/* <TabBar
                    tabs={MENU_TABS}
                    activeTab={"PROFILE"}
                    navigateTo={(id) =>
                        MENU_TABS.find((tab) => tab.id === id)?.path ||
                        "/profile"
                    }
                /> */}
            </SectionTop>
            <section
                className="sectionStyles"
                // style={{ backgroundColor: MENU_TABS[0].bgColor }}
            >
                {isLoading ? (
                    <Spinner type="fullPage" />
                ) : (
                    <>
                        <div className={styles.profile}>
                            <div
                                className={`sectionDiv ${styles.profileContainer}`}
                            >
                                <div className={styles.profileTabs}>
                                    <button
                                        style={{
                                            background:
                                                activeProfileTab === "info"
                                                    ? colorCode
                                                    : "",
                                        }}
                                        className={
                                            activeProfileTab === "info"
                                                ? styles.activeProfileTab
                                                : ""
                                        }
                                        onClick={() =>
                                            setActiveProfileTab("info")
                                        }
                                    >
                                        General Information
                                    </button>
                                    <button
                                        style={{
                                            background:
                                                activeProfileTab === "pass"
                                                    ? colorCode
                                                    : "",
                                        }}
                                        className={
                                            activeProfileTab === "pass"
                                                ? styles.activeProfileTab
                                                : ""
                                        }
                                        onClick={() =>
                                            setActiveProfileTab("pass")
                                        }
                                    >
                                        Change Password
                                    </button>
                                </div>
                                {activeProfileTab === "info" && (
                                    <ChangeInfoForm
                                        userData={userData}
                                        colorCode={colorCode}
                                    />
                                )}
                                {activeProfileTab === "pass" && (
                                    <ChangePassForm id={userData.id} />
                                )}
                            </div>

                            <div
                                className={`sectionDiv ${styles.profileDetails}`}
                            >
                                <div className={styles.avatarContainer}>
                                    <img
                                        className={styles.avatar}
                                        src={userData.avatar || DummyPerson}
                                        alt="Profile avatar"
                                        onError={(e) => {
                                            e.target.src = DummyPerson;
                                        }}
                                    />
                                    <button
                                        className={styles.uploadButton}
                                        onClick={handleImageClick}
                                        type="button"
                                    >
                                        <Upload size={16} />
                                    </button>
                                    {/* Verification Badge on Avatar */}
                                    <div
                                        className={`${styles.avatarBadge} ${userData?.kyc_verification ? styles.verified : styles.unverified}`}
                                    >
                                        {userData?.kyc_verification ? (
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="white"
                                            >
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="white"
                                            >
                                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    style={{ display: "none" }}
                                />
                                <h3
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        justifyContent: "center",
                                        marginBottom: "0.2rem",
                                    }}
                                >
                                    {userData.name}
                                    {userData?.kyc_verification ? (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            className={`${styles.verificationBadge} ${styles.verified}`}
                                            title="Verified Account"
                                        >
                                            <path
                                                d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                                                fill="#1DA1F2"
                                                stroke="#ffffff"
                                                strokeWidth="0.5"
                                            />
                                            <path
                                                d="M9 12L11 14L15 10"
                                                stroke="white"
                                                strokeWidth="2"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            className={`${styles.verificationBadge} ${styles.unverified}`}
                                            title="Unverified Account"
                                        >
                                            <path
                                                d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                                                fill="#ef4444"
                                                stroke="#ffffff"
                                                strokeWidth="0.5"
                                            />
                                            <path
                                                d="M8 8L16 16M16 8L8 16"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </h3>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    {userData?.staff_level ? (
                                        <span
                                            style={{
                                                background:
                                                    userData.staff_level ===
                                                    "Diamond"
                                                        ? "linear-gradient(135deg, #e3f2fd, #bbdefb)"
                                                        : userData.staff_level ===
                                                            "Gold"
                                                          ? "linear-gradient(135deg, #fff3e0, #ffcc80)"
                                                          : "linear-gradient(135deg, #f3e5f5, #e1bee7)",
                                                color:
                                                    userData.staff_level ===
                                                    "Diamond"
                                                        ? "#1976d2"
                                                        : userData.staff_level ===
                                                            "Gold"
                                                          ? "#f57c00"
                                                          : "#7b1fa2",
                                                border:
                                                    userData.staff_level ===
                                                    "Diamond"
                                                        ? "2px solid #1976d2"
                                                        : userData.staff_level ===
                                                            "Gold"
                                                          ? "2px solid #f57c00"
                                                          : "2px solid #7b1fa2",
                                                padding: "0.3rem 0.8rem",
                                                borderRadius: "20px",
                                                fontWeight: "700",
                                                fontSize: "0.9rem",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                                boxShadow:
                                                    "0 2px 8px rgba(0,0,0,0.1)",
                                                display: "inline-block",
                                            }}
                                        >
                                            {userData.staff_level}
                                        </span>
                                    ) : (
                                        <span
                                            style={{
                                                color: "#9e9e9e",
                                                fontStyle: "italic",
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Not Specified
                                        </span>
                                    )}
                                </div>
                                <ul>
                                    <li>
                                        <p>
                                            <img src="/icons/call.svg" />
                                            <span>Phone</span>
                                        </p>
                                        <span>{userData.phone}</span>
                                    </li>
                                    <li>
                                        <p>
                                            <img src="/icons/mail.svg" />
                                            <span>Email</span>
                                        </p>
                                        <span>{userData.email}</span>
                                    </li>
                                    <li>
                                        <p>
                                            <img src="/icons/info.svg" />
                                            <span>Team</span>
                                        </p>
                                        <span>{teamData?.name}</span>
                                    </li>
                                    <li>
                                        <p>
                                            <img src="/icons/person.svg" />
                                            <span>Role</span>
                                        </p>
                                        <span>
                                            {userData?.role_name || "N/A"}
                                        </span>
                                    </li>
                                    <li>
                                        <p>
                                            <img src="/icons/time.svg" />
                                            <span>Created At</span>
                                        </p>
                                        <span>
                                            {new Date(
                                                userData.created_at
                                            ).toLocaleString()}
                                        </span>
                                    </li>
                                    <li>
                                        <p>
                                            <img src="/icons/time.svg" />
                                            <span>Exprience In Year</span>
                                        </p>
                                        <span>
                                            {userData?.experience_years ??
                                                "N/A"}
                                        </span>
                                    </li>
                                    <li>
                                        <p>
                                            <img src="/icons/person.svg" />
                                            <span>Designation</span>
                                        </p>
                                        <span
                                            style={{
                                                fontWeight: "600",
                                                color: "#1976d2",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            {userData?.designation ||
                                                "Not Specified"}
                                        </span>
                                    </li>
                                </ul>

                                <div className={styles.profileActions}>
                                    <button
                                        style={{
                                            background: colorCode,
                                        }}
                                        className={styles.portfolioButton}
                                        onClick={handleGeneratePortfolio}
                                    >
                                        Generate My Portfolio Website
                                    </button>
                                </div>

                                <div className={styles.profileActions}>
                                    <button
                                        style={{
                                            background: colorCode,
                                        }}
                                        className={styles.portfolioButton}
                                        onClick={handleWallet}
                                    >
                                        Ledger
                                    </button>
                                </div>

                                {/* Generate Business Card Button */}
                                <ProfileBusinessCardGenerator
                                    currentUser={currentUser}
                                    colorCode={colorCode}
                                />

                                {/* Video Section */}
                                <div className={styles.videoSection}>
                                    <div className={styles.videoHeader}>
                                        <h4>My Video</h4>
                                        <button
                                            style={{
                                                background: colorCode,
                                            }}
                                            className={styles.uploadVideoButton}
                                            onClick={handleVideoClick}
                                            type="button"
                                        >
                                            <Upload size={16} />
                                            Upload Video
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        ref={videoInputRef}
                                        onChange={handleVideoUpload}
                                        accept="video/*"
                                        style={{ display: "none" }}
                                    />

                                    {userData?.videoLink ? (
                                        <div className={styles.videoContainer}>
                                            <video
                                                src={userData.videoLink}
                                                className={styles.videoPlayer}
                                                controls
                                                style={{
                                                    width: "100%",
                                                    maxHeight: "200px",
                                                    borderRadius: "8px",
                                                    backgroundColor: "#000",
                                                }}
                                            />
                                            <button
                                                onClick={handleDeleteVideo}
                                                className={
                                                    styles.deleteVideoButton
                                                }
                                                title="Delete Video"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.noVideoState}>
                                            <p>No video uploaded yet</p>
                                            <small>
                                                Click Upload Video to add your
                                                introduction video
                                            </small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Beautiful Crop Modal */}
                        {showCropModal && (
                            <div
                                className={styles.modalOverlay}
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 9999,
                                    backdropFilter: "blur(4px)",
                                }}
                                onClick={handleCropCancel}
                            >
                                <div
                                    className={styles.cropModal}
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                                        borderRadius: "20px",
                                        padding: "2rem",
                                        maxWidth: "90vw",
                                        maxHeight: "90vh",
                                        width: "600px",
                                        boxShadow:
                                            "0 20px 60px rgba(0, 0, 0, 0.3)",
                                        border: "1px solid rgba(255, 255, 255, 0.2)",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Crop Area */}
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            marginBottom: "1.5rem",
                                            background: "#f8f9fa",
                                            borderRadius: "12px",
                                            padding: "1rem",
                                            border: "2px dashed #e3f2fd",
                                        }}
                                    >
                                        <ReactCrop
                                            crop={crop}
                                            onChange={(c) => setCrop(c)}
                                            onComplete={(c) =>
                                                setCompletedCrop(c)
                                            }
                                            aspect={1}
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "400px",
                                            }}
                                        >
                                            <img
                                                ref={imgRef}
                                                src={previewUrl}
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "400px",
                                                    borderRadius: "8px",
                                                    boxShadow:
                                                        "0 4px 12px rgba(0,0,0,0.1)",
                                                }}
                                                alt="Crop preview"
                                            />
                                        </ReactCrop>
                                    </div>

                                    {/* Action Buttons */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "1rem",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <button
                                            onClick={handleCropCancel}
                                            style={{
                                                padding: "0.75rem 1.5rem",
                                                borderRadius: "25px",
                                                border: "2px solid #e0e0e0",
                                                background:
                                                    "linear-gradient(135deg, #f5f5f5, #ffffff)",
                                                color: "#666",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                fontSize: "0.9rem",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.borderColor =
                                                    "#999";
                                                e.target.style.color = "#333";
                                                e.target.style.transform =
                                                    "translateY(-2px)";
                                                e.target.style.boxShadow =
                                                    "0 4px 12px rgba(0,0,0,0.15)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.borderColor =
                                                    "#e0e0e0";
                                                e.target.style.color = "#666";
                                                e.target.style.transform =
                                                    "translateY(0)";
                                                e.target.style.boxShadow =
                                                    "none";
                                            }}
                                        >
                                            <span>↶</span>
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCropComplete}
                                            disabled={!completedCrop}
                                            style={{
                                                padding: "0.75rem 1.5rem",
                                                borderRadius: "25px",
                                                border: "none",
                                                background: completedCrop
                                                    ? "linear-gradient(135deg, #1976d2, #42a5f5)"
                                                    : "linear-gradient(135deg, #ccc, #ddd)",
                                                color: "white",
                                                fontWeight: "700",
                                                cursor: completedCrop
                                                    ? "pointer"
                                                    : "not-allowed",
                                                transition: "all 0.3s ease",
                                                fontSize: "0.9rem",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                opacity: completedCrop
                                                    ? 1
                                                    : 0.6,
                                            }}
                                            onMouseEnter={(e) => {
                                                if (completedCrop) {
                                                    e.target.style.transform =
                                                        "translateY(-2px)";
                                                    e.target.style.boxShadow =
                                                        "0 6px 20px rgba(25, 118, 210, 0.4)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (completedCrop) {
                                                    e.target.style.transform =
                                                        "translateY(0)";
                                                    e.target.style.boxShadow =
                                                        "none";
                                                }
                                            }}
                                        >
                                            <span>✓</span>
                                            Save Avatar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

export default Profile;
