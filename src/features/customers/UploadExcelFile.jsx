import { useForm } from "react-hook-form";
import Modal from "../../ui/Modal";
import useStaff from "../admin/staff/useStaff";
import useAreas from "../areas/useAreas";
import styles from "./UploadExcelForm.module.css";
import FormInputDataList from "../../ui/FormInputDataList";
import { useRef, useState } from "react";
import DownloadExcelSampleButton from "./DownloadExcelSampleButton";
import useFileUploadCustomerExcel from "./useFileUploadCustomerExcel";
import toast from "react-hot-toast";
import useInfiniteDatabasesNames from "../database/useInfinteDatabasesNames";
import useAllDetails from "../all-details/useAllDetails";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import Tooltip from '@mui/material/Tooltip';

function UploadExcelFile() {
    const { data: staffData, isLoading: staffLoading } = useStaff();
    const { data: areaData, isLoading: areaLoading } = useAreas();
    const { databases, isLoading: databaseLoading } =
        useInfiniteDatabasesNames();
    const { data } = useAllDetails();
    const bgColor = data?.company_settings?.sidebar_color_code || "#020079";
    const databaseOptions = databases?.map((item) => {
        return { value: item?._id, label: item?.name };
    });
    const staffOptions = staffData?.map((item) => {
        return { value: item.id, label: item.name };
    });

    const areaOptions = areaData?.map((item) => {
        return { value: item.id, label: item.name };
    });

    return (
        <Modal>
            <Modal.Open openWindowName="upload-excel-file">
                <button
                    className="btnSubmit"
                    style={{
                        backgroundColor: bgColor,
                        border: `1px solid ${bgColor}`,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <CloudUploadIcon sx={{ fontSize: 20 }} style={{ marginRight: "10px" }} />
                    <span className={styles.buttonText}>Upload Excel </span>
                </button>
            </Modal.Open>

            <Modal.Window name="upload-excel-file">
                <UploadExcelForm
                    staffOptions={staffOptions}
                    areaOptions={areaOptions}
                    isLoadingStaff={staffLoading}
                    isLoadingArea={areaLoading}
                    databaseOptions={databaseOptions}
                    isLoadingDatabase={databaseLoading}
                />
            </Modal.Window>
        </Modal>
    );
}

export default UploadExcelFile;

export function UploadExcelForm({
    onCloseModal,
    staffOptions,
    areaOptions,
    isLoadingStaff,
    isLoadingArea,
    databaseOptions,
    isLoadingDatabase,
}) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
    } = useForm();
    const { upload  , isPending } = useFileUploadCustomerExcel();
    const { data } = useAllDetails();
    const bgColor = data?.company_settings?.sidebar_color_code || "#020079";
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    const onSubmit = (data) => {
        upload(
            {
                file: data.file,
                agent_id: data.agent_id ? data.agent_id?.value : null,
                area_id: data.area_id ? data.area_id?.value : null,
                database_name_id: data?.database_name_id ? data?.database_name_id?.value : null,
            },
            {
                onSettled: () => {
                    reset();
                    onCloseModal();
                },
                onSuccess: () => {
                    toast.success("Excel file uploaded successfully");
                },
            }
        );
    };

    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFileName(selectedFile.name);
            setValue("file", selectedFile);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-2xl font-bold mb-4">Upload Excel File</h1>
            <div className={styles.formContainer}>
                <div>
                    <label>Agent</label>
                    <FormInputDataList
                        control={control}
                        registerName={"agent_id"}
                        data={staffOptions}
                        isLoading={isLoadingStaff}
                        required={true}
                        placeholder="Select Agent"
                    />
                    {errors.agent_id && (
                        <span className={styles.errorText}>
                            This field is required
                        </span>
                    )}
                </div>
                {/* <div>
                    <label>Area</label>
                    <FormInputDataList
                        control={control}
                        registerName={"area_id"}
                        data={areaOptions}
                        isLoading={isLoadingArea}
                        required={true}
                        placeholder="Select Area"
                    />
                    {errors.area_id && (
                        <span className={styles.errorText}>
                            This field is required
                        </span>
                    )}
                </div> */}

                <div>
                    <label>Database Name</label>
                    <FormInputDataList
                        control={control}
                        registerName={"database_name_id"}
                        data={databaseOptions}
                        isLoading={isLoadingDatabase}
                        required={true}
                        placeholder="Select Database Name"
                    />
                    {errors.database_name && (
                        <span className={styles.errorText}>
                            This field is required
                        </span>
                    )}
                </div>
                <div>
                    <label htmlFor="file">File</label>
                    <div
                        className={styles.fileUploadBox}
                        onClick={handleFileClick}
                    >
                        <svg
                            style={{ width: "40px", height: "40px" }}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 10l5-5 5 5M12 4v12"
                            />
                        </svg>
                        <p>{fileName ? fileName : "Click to select a file"}</p>
                    </div>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        {...register("file", { required: "File is required" })}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    {errors.file && (
                        <span className={styles.errorText}>
                            {errors.file.message}
                        </span>
                    )}
                </div>

                <div className={styles.buttonContainer}>
                    <DownloadExcelSampleButton />
                    <button className={`btnSubmit`} style={{
                        backgroundColor: bgColor,
                        border: `1px solid ${bgColor}`,
                    }}>
                    <Tooltip title="Upload Excel File" placement="top">

                        <CloudUploadIcon sx={{ fontSize: 20 }} style={{ marginRight: "10px" }} />
                        <span>
                            {isPending ? "Uploading..." : <DocumentScannerIcon sx={{ fontSize: 20 }} style={{ marginRight: "10px" }} />}
                        </span>
                    </Tooltip>
                    </button>
                </div>
            </div>
        </form>
    );
}
