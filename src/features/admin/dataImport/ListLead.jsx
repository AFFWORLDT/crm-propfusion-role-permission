import { useDownloadLeadsTemplate } from "./useDownloadLeadsTemplate";
import useExportLeadsData from "./useExportLeadsData";
import { useUploadBulkLeads } from "./useUploadBulkLeads";
import styles from "./Listings.module.css";
import { useRef } from "react";
import SyncButtonForBeyutAndPropertyFinder from "../../../pages/leads/SyncButtonForBeyutAndPropertyFinder";

function ListLead() {
    const { download, isLoading } = useDownloadLeadsTemplate();
    const { mutate: exportLeads, isLoading: exportLoading } =
        useExportLeadsData();
    const { upload, isLoading: uploadLoading } = useUploadBulkLeads();

    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            upload(file);
        }
    };

    return (
        <>
            <div className={styles.listings}>
                <SyncButtonForBeyutAndPropertyFinder  title={"IMPORT LEADS FROM PORTALS"}/>

                <h3>Excel hub</h3>
                <button onClick={download} disabled={isLoading}>
                    <img src="/icons/download.svg" alt="Download" />
                    <span>
                        {isLoading ? "Downloading..." : "Download"} Excel Sample
                        Sheet
                    </span>
                </button>
                <button onClick={exportLeads} disabled={exportLoading}>
                    <img src="/icons/download.svg" alt="Download" />
                    <span>
                        {exportLoading ? "Downloading..." : "Download"} Excel
                        Sheet
                    </span>
                </button>

                {/* Upload Button */}
                <button onClick={handleUploadClick} disabled={uploadLoading}>
                    <img src="/icons/add.svg" alt="Upload" />
                    <span>
                        {uploadLoading ? "Uploading..." : "Upload"} Leads Excel
                        Sheet
                    </span>
                </button>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".xlsx, .xls"
                    style={{ display: "none" }}
                />
            </div>
        </>
    );
}

export default ListLead;
