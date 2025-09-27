import { useRef } from 'react';
import { Eye, Download, Upload } from 'lucide-react';
import Modal from "../../ui/Modal";
import styles from './QrCodeSection.module.css';
import toast from 'react-hot-toast';

export function QRCodeModal({ qrCode }) {
    return (
        <div >
            <img 
                src={qrCode} 
                alt="QR Code" 
                style={{ 
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain'
                }} 
            />
        </div>
    );
}

function QrCodeSection({ userData, onQrCodeUpload, isUpdatingQrCode }) {
    const fileInputRef = useRef(null);

    const handleQrCodeUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.includes('image')) {
            toast.error('Please upload an image file');
            return;
        }

        onQrCodeUpload(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleDownloadQR = () => {
        if (!userData.qr_code) return;
        const link = document.createElement('a');
        link.href = userData.qr_code;
        link.download = 'qr-code.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <label>QR Code</label>
            <div className={styles.qrCodeUpload}>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleQrCodeUpload}
                    accept="image/*"
                />
                <div className={styles.qrCodeSection}>
                    {userData.qr_code && (
                        <div className={styles.qrCodePreview}>
                            <img 
                                src={userData.qr_code} 
                                alt="QR Code" 
                                style={{ 
                                    width: '100px', 
                                    height: '100px', 
                                    objectFit: 'contain',
                                    marginBottom: '10px'
                                }} 
                            />
                            <div className={styles.qrCodeActions}>
                                <Modal.Open openWindowName="qr-code-view">
                                    <button
                                        type="button"
                                        className={styles.iconButton}
                                        title="View QR Code"
                                    >
                                        <Eye size={18} />
                                        View
                                    </button>
                                </Modal.Open>
                                <button
                                    type="button"
                                    className={styles.iconButton}
                                    onClick={handleDownloadQR}
                                    title="Download QR Code"
                                >
                                    <Download size={18} />
                                    Download
                                </button>
                            </div>
                        </div>
                    )}
                    <button
                        type="button"
                        className={`${styles.qrCodeButton} ${isUpdatingQrCode ? styles.loading : ''}`}
                        onClick={triggerFileInput}
                        disabled={isUpdatingQrCode}
                    >
                        <Upload size={18} />
                        {isUpdatingQrCode ? 'Uploading QR Code...' : 'Upload New QR Code'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QrCodeSection; 