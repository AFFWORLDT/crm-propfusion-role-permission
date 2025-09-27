import { useParams } from "react-router-dom";
import SectionTop from "../ui/SectionTop";
import useUploadDeveloperDocs from "../features/developers/useUploadDeveloperDocs";
import { useState } from "react";
import { toast } from "react-hot-toast";
import useGetDeveloperById from "../features/developers/useGetDeveloperById";
import styles from "./DeveloperDocuments.module.css";
import { 
    FileText, 
    Eye, 
    Trash2, 
    FileImage, 
    FileSpreadsheet, 
    FileCode, 
    FileArchive,
    File
} from "lucide-react";
import Spinner from "../ui/Spinner";
import useDeleteDeveloperDocs from "../features/admin/staff/useDeleteDeveloperDocs";
function DeveloperDocuments() {
    const { developerId } = useParams();
    const { addDocs, isPending, } = useUploadDeveloperDocs();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { data: developerData, isLoading,  } = useGetDeveloperById(developerId);

    const{deleteDocs,isPending:deletePending,error}=useDeleteDeveloperDocs()

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) {
            toast.error("Please select at least one file");
            return;
        }
        setSelectedFiles(files);
        addDocs({ developerId, docs: files });
    };

    const handleDelete = (docUrl) => {
        deleteDocs({ developerId, docUrls: [docUrl] });
    };

    const getFileName = (url) => {
        return url.split('/').pop();
    };

    const getFileType = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        return extension;
    };

    const isImageFile = (url) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        return imageExtensions.includes(getFileType(url));
    };

    const isPdfFile = (url) => {
        return getFileType(url) === 'pdf';
    };

    const getFileIcon = (url) => {
        const extension = getFileType(url);
        
        switch (extension) {
            case 'pdf':
                return <FileText className={styles.documentIcon} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'webp':
                return <FileImage className={styles.documentIcon} />;
            case 'xlsx':
            case 'xls':
            case 'csv':
                return <FileSpreadsheet className={styles.documentIcon} />;
            case 'zip':
            case 'rar':
            case '7z':
                return <FileArchive className={styles.documentIcon} />;
            case 'js':
            case 'jsx':
            case 'ts':
            case 'tsx':
            case 'html':
            case 'css':
                return <FileCode className={styles.documentIcon} />;
            case 'doc':
            case 'docx':
            case 'txt':
                return <FileText className={styles.documentIcon} />;
            default:
                return <File className={styles.documentIcon} />;
        }
    };

    const renderFilePreview = (url) => {
        if (isImageFile(url)) {
            return (
                <div className={styles.previewContainer}>
                    <img src={url} alt="Document preview" className={styles.previewImage} />
                </div>
            );
        }
        if (isPdfFile(url)) {
            return (
                <div className={styles.previewContainer}>
                    <iframe 
                        src={`${url}#toolbar=0&navpanes=0`}
                        className={styles.previewPdf}
                        title="PDF preview"
                        sandbox="allow-same-origin allow-scripts"
                        loading="lazy"
                    />
                </div>
            );
        }
        return getFileIcon(url);
    };

    if(isLoading){
        return (<>
        <Spinner type={"fullPage"}/>
        </>)
    }
    return (
        <div>
            <section className="sectionStyles">
                <div className="flex flex-col gap-4 p-4">
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        disabled={isPending}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                    {isPending && (
                        <p className="text-blue-600">Uploading documents...</p>
                    )}
                </div>

                <div className={styles.documentGrid}>
                    {developerData?.documents?.length > 0 ? (
                        developerData.documents.map((doc, index) => (
                            <div key={index} className={styles.documentCard}>
                                {renderFilePreview(doc)}
                                <div className={styles.documentTitle}>
                                    {getFileName(doc)}
                                </div>
                                <div className={styles.buttonGroup}>
                                    <a
                                        href={doc}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.button} ${styles.viewButton}`}
                                    >
                                        <Eye size={16} />
                                        View
                                    </a>
                                    <button
                                        onClick={() => {
                                            setDocToDelete(doc);
                                            setShowConfirmModal(true);
                                        }}
                                        className={`${styles.button} ${styles.deleteButton}`}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            No documents uploaded yet
                        </div>
                    )}
                </div>
            </section>
            {showConfirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this document?</p>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.confirmButton}
                                onClick={() => {
                                    handleDelete(docToDelete);
                                    setShowConfirmModal(false);
                                    setDocToDelete(null);
                                }}
                                disabled={deletePending}
                            >
                                {deletePending ? "Deleting..." : "Yes, Delete"}
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setDocToDelete(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeveloperDocuments;
