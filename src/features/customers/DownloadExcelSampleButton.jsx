import useExampleDownload from "./useExampleDownload";
import useAllDetails from "../all-details/useAllDetails";
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import DownloadingIcon from '@mui/icons-material/Downloading';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DescriptionIcon from '@mui/icons-material/Description';

function DownloadExcelSampleButton() {
    const { isDownloading, download } = useExampleDownload();
    const { data } = useAllDetails();
    const bgColor = data?.company_settings?.sidebar_color_code || "#020079";

    const buttonStyles = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "8px 16px",
        fontSize: "14px",
        borderRadius: "8px",
        transition: "all 0.2s ease",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        cursor: isDownloading ? "not-allowed" : "pointer",
        opacity: isDownloading ? 0.7 : 1,
    };

    const svgStyles = {
        width: "16px",
        height: "16px",
        animation: isDownloading ? "spin 1s linear infinite" : "none",
    };

    const textStyles = {
        whiteSpace: "nowrap",
        fontWeight: 500,
        color: bgColor,
    };

    return (
        <button
            onClick={download}
            disabled={isDownloading}
            type="button"
            className={`btnSubmit`}
            style={{
                backgroundColor: bgColor,
                border: `1px solid ${bgColor}`,
            }}
        >
            <Tooltip title="Download Excel Sample">
            <CloudDownloadIcon sx={{ fontSize: 20 }} style={{ marginRight: "10px" }} />

            <span style={{
                whiteSpace: "nowrap",
                fontWeight: 500,
            }} 
            >
                {isDownloading
                    ? <DownloadingIcon sx={{ fontSize: 20 }} style={{ marginRight: "10px" }} />
                    : <DescriptionIcon sx={{ fontSize: 20 }} style={{ marginRight: "10px" }} />}
            </span>
            </Tooltip>
        </button>
    );
}

export default DownloadExcelSampleButton;
