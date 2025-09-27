import MultiStepForm from "../../ui/MultiStepForm";
import styles from "../../styles/MultiStepForm.module.css";
import { CAR_CONDITION_OPTIONS } from "../../utils/constants";
import { useState } from "react";
import { useDeleteImage } from "../Extra/useDeleteImage";
import { useSingleImageStore } from "../../store/imagesStore";

function StepOBDInspection() {
    const { imageUrl, clearImage } = useSingleImageStore();
    const [obdReportUrl, setObdReportUrl] = useState(imageUrl);
    const { deleteImage } = useDeleteImage();


    const removeOBDReport = () => {
        clearImage();
        setObdReportUrl("");
        if (imageUrl) {
            deleteImage(imageUrl);
        }
    };

    const containerStyles = {
        marginTop: "20px",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#f9fafb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e5e7eb",
    };

    const headingStyles = {
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "12px",
        color: "#374151",
        display: "flex",
        alignItems: "center",
        gap: "6px",
    };

    const pdfContainerStyles = {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
    };

    const imageContainerStyles = {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
    };

    const linkStyles = {
        color: "#4f46e5",
        textDecoration: "none",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "5px",
    };

    const deleteButtonStyles = {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "5px 10px",
        backgroundColor: "#fee2e2",
        border: "1px solid #fecaca",
        borderRadius: "4px",
        color: "#b91c1c",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        marginTop: "10px",
    };

    const imageStyles = {
        maxWidth: "100%",
        maxHeight: "200px",
        objectFit: "contain",
        borderRadius: "4px",
        border: "1px solid #e5e7eb",
    };

    return (
        <div className={`sectionDiv ${styles.multiStepFormGrid}`}>
            <h3>
                <img src="/icons/star.svg" />
                <span>OBD Inspection</span>
            </h3>
            <div className={styles.formContainer}>
                <MultiStepForm.InputDataList
                    registerName="diagnostic_report"
                    label="Diagnostic Report"
                    data={CAR_CONDITION_OPTIONS}
                    placeholder="Select Diagnostic Report Status"
                    defaultValue="Perfect"
                />
                <MultiStepForm.InputFileObd
                    registerName="Obd_report_file"
                    label="OBD report file"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                    folderName="vehicles"
                    onFileUploaded={setObdReportUrl}
                />

                <div></div>

                <div>
                    {obdReportUrl && (
                        <div style={containerStyles}>
                            <h4 style={headingStyles}>Uploaded OBD Report</h4>
                            {obdReportUrl.toLowerCase().endsWith(".pdf") ? (
                                <div style={pdfContainerStyles}>
                                    <img
                                        src="/icons/document.svg"
                                        alt="PDF Document"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    />
                                    <div>
                                        <p
                                            style={{
                                                margin: "0 0 5px 0",
                                                fontWeight: "500",
                                            }}
                                        >
                                            OBD Diagnostic Report
                                        </p>
                                        <a
                                            href={obdReportUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={linkStyles}
                                        >
                                            View Report
                                            <img
                                                src="/icons/external-link.svg"
                                                alt=""
                                                style={{
                                                    width: "14px",
                                                    height: "14px",
                                                }}
                                            />
                                        </a>
                                        <button
                                            onClick={removeOBDReport}
                                            style={deleteButtonStyles}
                                        >
                                            <img
                                                src="/icons/delete.svg"
                                                alt="Delete"
                                                style={{
                                                    width: "16px",
                                                    height: "16px",
                                                }}
                                            />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={imageContainerStyles}>
                                    <img
                                        src={obdReportUrl}
                                        alt="OBD Report"
                                        style={imageStyles}
                                    />
                                    <a
                                        href={obdReportUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={linkStyles}
                                    >
                                        View Full Size
                                        <img
                                            src="/icons/external-link.svg"
                                            alt=""
                                            style={{
                                                width: "14px",
                                                height: "14px",
                                            }}
                                        />
                                    </a>
                                    <button
                                        onClick={removeOBDReport}
                                        style={deleteButtonStyles}
                                    >
                                        <img
                                            src="/icons/trash.svg"
                                            alt="Delete"
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                            }}
                                        />
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StepOBDInspection;
