import styles from "../../styles/MultiStepForm.module.css";
import DisplayImages from "../../ui/DisplayImages";
import DisplayImagesOnAdd from "../../ui/DisplayImagesOnAdd";
import MultiStepForm from "../../ui/MultiStepForm";
import { useDeleteMasterPlans } from "./useDeleteMasterPlans";
import useDeleteProjectBrochure from "./useDeleteProjectBrochure";
import { useState, useEffect } from "react";
import { FileText, Download, Trash2, X } from "lucide-react";
import { deleteQrcode } from "../../services/apiNewProjects";
import { useQueryClient } from "@tanstack/react-query";

function StepPhotos({ projectData, isEditSession }) {
    const queryClient = useQueryClient()
    const { removeProjectBrochure, isPending: isDeletingBrochure } =
        useDeleteProjectBrochure();
    const { deleteMasterPlan, isDeleting: isDeletingMasterPlan } =
        useDeleteMasterPlans();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function handleRemoveBrochure(id) {
        return () => removeProjectBrochure(id);
    }
    const handleDeleteQr = async () => {
        try {
            await deleteQrcode(projectData?.id);
            queryClient.invalidateQueries({ queryKey: ["project"] });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <div
                style={{ gridTemplateColumns: "1fr" }}
                className={styles.formContainer}
            >
                <div>
                    <div
                        style={{
                            marginBottom: "1rem",
                        }}
                    >
                        <MultiStepForm.InputFile
                            registerName="photos"
                            label="Images"
                            accept="image/*"
                            multiple={true}
                        />

                        {/* {isEditSession && (
                        <DisplayImages
                            imagesData={projectData?.photos}
                            onAction={handleRemoveImage}
                            isDoingAction={isDeletingImage}
                            iconAction="/icons/delete.svg"
                            />
                            )} */}

                        <DisplayImagesOnAdd
                            imagesData={[]}
                            // onAction={handleRemoveImageWhileAdding}
                            // isDoingAction={isDeleting}
                            iconAction="/icons/delete.svg"
                        />
                    </div>
                    <div
                        style={{
                            marginBottom: "1rem",
                        }}
                    >
                        <MultiStepForm.InputFileLocal
                            registerName="brochure"
                            label={
                                <span>
                                    <img
                                        src="/icons/file.svg"
                                        alt=""
                                        style={{
                                            width: 20,
                                            marginRight: 8,
                                            verticalAlign: "middle",
                                        }}
                                    />
                                    Brochure Document
                                </span>
                            }
                            accept=".pdf, .doc, .docx"
                        />

                        {isEditSession && projectData?.brochureUrl && (
                            <DisplayImages
                                imagesData={[projectData?.brochureUrl]}
                                onAction={() =>
                                    handleRemoveBrochure(projectData?.id)
                                }
                                isDoingAction={isDeletingBrochure}
                                iconAction="/icons/delete.svg"
                                iShowMultiSelect={false}
                            />
                        )}
                    </div>
                    <div
                        style={{
                            marginBottom: "1rem",
                        }}
                    >
                        <MultiStepForm.InputFileLocal
                            registerName="masterPlans"
                            label={
                                <span>
                                    <img
                                        src="/icons/map.svg"
                                        alt=""
                                        style={{
                                            width: 20,
                                            marginRight: 8,
                                            verticalAlign: "middle",
                                        }}
                                    />
                                    Master Plans
                                </span>
                            }
                            accept="image/*, .pdf"
                            multiple={true}
                        />

                        {isEditSession && projectData?.masterPlans && (
                            <div
                                className="master-plans-grid"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: isMobile
                                        ? "repeat(auto-fill, minmax(100px, 1fr))"
                                        : "repeat(auto-fill, minmax(150px, 1fr))",
                                    gap: isMobile ? "0.5rem" : "1rem",
                                    marginTop: "1rem",
                                    padding: "0 0 0 17rem",
                                    width: "100%",
                                }}
                            >
                                {projectData.masterPlans.map((plan, index) => {
                                    const isPDF = plan
                                        .toLowerCase()
                                        .endsWith(".pdf");
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                position: "relative",
                                                aspectRatio: "1",
                                                borderRadius: "8px",
                                                overflow: "hidden",
                                                border: "1px solid #ddd",
                                                maxWidth: "100%",
                                                margin: isMobile
                                                    ? "0 auto"
                                                    : "0",
                                                background: isPDF
                                                    ? "#f5f5f5"
                                                    : "white",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    background:
                                                        "rgba(255, 255, 255, 0.1)",
                                                    backdropFilter: "blur(0px)",
                                                    transition: "all 0.3s ease",
                                                    opacity: 0,
                                                    zIndex: 1,
                                                }}
                                                className="hover-glass"
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backdropFilter =
                                                        "blur(4px)";
                                                    e.currentTarget.style.opacity =
                                                        "1";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backdropFilter =
                                                        "blur(0px)";
                                                    e.currentTarget.style.opacity =
                                                        "0";
                                                }}
                                            />
                                            {isPDF ? (
                                                <FileText
                                                    size={isMobile ? 32 : 48}
                                                    color="#666"
                                                    style={{
                                                        position: "relative",
                                                        zIndex: 2,
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={plan}
                                                    alt={`Master plan ${index + 1}`}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            )}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: isMobile
                                                        ? "4px"
                                                        : "8px",
                                                    right: isMobile
                                                        ? "4px"
                                                        : "8px",
                                                    display: "flex",
                                                    gap: "8px",
                                                    zIndex: 2,
                                                }}
                                            >
                                                <a
                                                    href={plan}
                                                    download
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        background:
                                                            "rgba(255, 255, 255, 0.7)",
                                                        border: "none",
                                                        borderRadius: "50%",
                                                        width: isMobile
                                                            ? "20px"
                                                            : "24px",
                                                        height: isMobile
                                                            ? "20px"
                                                            : "24px",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        padding: "0",
                                                        backdropFilter:
                                                            "blur(4px)",
                                                        transition:
                                                            "all 0.3s ease",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform =
                                                            "scale(1.1)";
                                                        e.currentTarget.style.background =
                                                            "rgba(255, 255, 255, 0.9)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform =
                                                            "scale(1)";
                                                        e.currentTarget.style.background =
                                                            "rgba(255, 255, 255, 0.7)";
                                                    }}
                                                >
                                                    <Download
                                                        size={
                                                            isMobile ? 12 : 14
                                                        }
                                                        color="#666"
                                                    />
                                                </a>
                                                <button
                                                    onClick={() =>
                                                        deleteMasterPlan({
                                                            id: projectData?.id,
                                                            url: plan,
                                                        })
                                                    }
                                                    disabled={
                                                        isDeletingMasterPlan
                                                    }
                                                    style={{
                                                        background:
                                                            "rgba(255, 255, 255, 0.7)",
                                                        border: "none",
                                                        borderRadius: "50%",
                                                        width: isMobile
                                                            ? "20px"
                                                            : "24px",
                                                        height: isMobile
                                                            ? "20px"
                                                            : "24px",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        padding: "0",
                                                        backdropFilter:
                                                            "blur(4px)",
                                                        transition:
                                                            "all 0.3s ease",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform =
                                                            "scale(1.1)";
                                                        e.currentTarget.style.background =
                                                            "rgba(255, 255, 255, 0.9)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform =
                                                            "scale(1)";
                                                        e.currentTarget.style.background =
                                                            "rgba(255, 255, 255, 0.7)";
                                                    }}
                                                >
                                                    <Trash2
                                                        size={
                                                            isMobile ? 12 : 14
                                                        }
                                                        color="#666"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div>
                        <MultiStepForm.InputFile
                            registerName="video"
                            label="Video"
                            accept="video/*"
                            multiple={true}
                        />
                    </div>
                    <div>
                        {!projectData?.newParam?.permitQRCode && (
                            <MultiStepForm.InputFile
                                registerName="permit_qr_code"
                                label="Permit Qr Code"
                                accept="image/*"
                                multiple={false}
                                qr={true}
                            />
                        )}

                        {isEditSession &&
                            projectData?.newParam?.permitQRCode && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "35px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <label
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#333",
                                            minWidth: "120px",
                                            margin: "30px 0",
                                        }}
                                    >
                                        Permit QR Code
                                    </label>

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "20px",
                                            padding: "12px",
                                            borderRadius: "12px",
                                            width: "fit-content",
                                            position: "relative",
                                        }}
                                    >
                                        <div style={{ position: "relative" }}>
                                            <img
                                                src={
                                                    projectData?.newParam
                                                        ?.permitQRCode
                                                }
                                                alt="QR Code"
                                                height={200}
                                                width={200}
                                                style={{
                                                    borderRadius: "8px",
                                                    display: "block",
                                                }}
                                            />

                                            <X
                                                style={{
                                                    color: "white",
                                                    backgroundColor: "red",
                                                    borderRadius: "50%",
                                                    padding: "4px",
                                                    width: "20px",
                                                    height: "20px",
                                                    cursor: "pointer",
                                                    position: "absolute",
                                                    top: "8px",
                                                    right: "8px",
                                                }}
                                                onClick={handleDeleteQr}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StepPhotos;
