import styles from "../../styles/MultiStepForm.module.css";
import checkboxStyles from "../../styles/StepMediaCheckbox.module.css";
import DisplayImages from "../../ui/DisplayImages";
import DisplayImagesOnAdd from "../../ui/DisplayImagesOnAdd";
import MultiStepForm from "../../ui/MultiStepForm";
import useStaff from "../admin/staff/useStaff";
import { useState } from "react";
// import { useDeleteImage } from "../Extra/useDeleteImage";
import useDeletePropertyImage from "./useDeletePropertyImage";
import { X } from "lucide-react";
import { deleteQrcode } from "../../services/apiProperties";
import { useQueryClient } from "@tanstack/react-query";

function StepMedia({ isEditSession = false, propertyData }) {
    const queryClient = useQueryClient();
    const [showAgentQR, setShowAgentQR] = useState(false);
    const { removePropertyImage, isPending: isDeletingImage } =
        useDeletePropertyImage();
    const { data: staffData, isLoading: isStaffLoading } = useStaff();
    const staffOptions = staffData?.map((item) => {
        return {
            value: item.id,
            label: item.name,
        };
    });

    function handleRemoveImage(imageUrl) {
        return () =>
            removePropertyImage({
                propertyId: propertyData?.id,
                imageUrl: [imageUrl],
            });
    }
    const handleDeleteQr = async () => {
        try {
            await deleteQrcode(propertyData?.id);
            queryClient.invalidateQueries({ queryKey: ["newProperty"] });
            queryClient.invalidateQueries({ queryKey: ["newProperties"] });
            queryClient.invalidateQueries({ queryKey: ["building"] });
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
                <div className={checkboxStyles.checkboxWrapper}>
                    <label className={checkboxStyles.checkboxLabel}>
                        <input
                            type="checkbox"
                            className={checkboxStyles.checkbox}
                            checked={showAgentQR}
                            onChange={(e) => setShowAgentQR(e.target.checked)}
                        />
                        <span className={checkboxStyles.checkboxText}>
                            Agent QR Code
                        </span>
                    </label>
                </div>

                {showAgentQR && (
                    <MultiStepForm.InputDataList
                        registerName="staff_qr_code_id"
                        label="Staff QR Code"
                        data={staffOptions}
                        placeholder="Select Staff"
                        isLoading={isStaffLoading}
                        isDisabled={isStaffLoading}
                    />
                )}

                <div>
                    <MultiStepForm.InputFile
                        registerName="photos"
                        label="Images"
                        accept="image/*"
                        multiple={true}
                    />
                    <DisplayImagesOnAdd
                        imagesData={[]}
                        // onAction={handleRemoveImageWhileAdding}
                        // isDoingAction={isDeleting}
                        iconAction="/icons/delete.svg"
                    />

                    {/* {isEditSession && (
                        <DisplayImages
                            imagesData={propertyData?.photos}
                            onAction={handleRemoveImage}
                            isDoingAction={isDeletingImage}
                            iconAction="/icons/delete.svg"
                        />
                    )} */}
                </div>
                <MultiStepForm.Input
                    registerName="videoLink"
                    placeholder="Enter Link for video"
                    label="Video Link"
                />

                <MultiStepForm.InputFile
                    registerName="video"
                    label="Video"
                    accept="video/*"
                    multiple={false}
                />
                <MultiStepForm.Input
                    registerName="view360"
                    placeholder="Enter Link for View 360"
                    label="View 360"
                />
                <div>
                    <MultiStepForm.InputFileLocal
                        registerName="ownerDocs"
                        label="Owner Docs"
                        multiple={true}
                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                    />
                    {isEditSession && (
                        <DisplayImages
                            imagesData={propertyData?.ownerDocs}
                            onAction={handleRemoveImage}
                            isDoingAction={isDeletingImage}
                            iconAction="/icons/delete.svg"
                        />
                    )}
                </div>
                <div>
                    {!propertyData?.permitQRCode && (
                        <MultiStepForm.InputFile
                            registerName="permit_qr_code"
                            label="Permit Qr Code"
                            accept="image/*"
                            multiple={false}
                            qr={true}
                        />
                    )}

                    {isEditSession && propertyData?.permitQRCode && (
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
                                        src={propertyData.permitQRCode}
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
    );
}

export default StepMedia;
