import { useState, useContext } from 'react';
import { socialMediaPlatforms, shareToSocialMedia, generateShareText, copyToClipboard } from '../utils/socialMediaSharing';
import toast from 'react-hot-toast';
import styles from './SocialMediaShare.module.css';

function SocialMediaShare({ property, onCloseModal }) {
    const [copied, setCopied] = useState(false);
    
    console.log('SocialMediaShare rendered with:', { property, onCloseModal });
    
    const shareUrl = property?.listingType 
        ? `${window.location.origin}/share-new-property/${property?.listingType?.toLowerCase()}/${property?.id}`
        : `${window.location.origin}/share-project/${property?.id}`;
    const shareText = generateShareText(property);

    const handleShare = (platform) => {
        shareToSocialMedia(platform, shareUrl, shareText);
        onCloseModal();
    };

    const handleCopyLink = async () => {
        const success = await copyToClipboard(shareUrl);
        if (success) {
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } else {
            toast.error('Failed to copy link');
        }
    };

    const handleCopyText = async () => {
        const success = await copyToClipboard(shareText + ' ' + shareUrl);
        if (success) {
            setCopied(true);
            toast.success('Text copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } else {
            toast.error('Failed to copy text');
        }
    };

    return (
        <div className={styles.socialShareModal}>
            <div className={styles.modalHeader}>
                <h3>Share to Social Media</h3>
                <button 
                    className={styles.closeButton}
                    onClick={onCloseModal}
                >
                    ×
                </button>
            </div>

            <div className={styles.propertyPreview}>
                <h4>{property?.name || property?.title || 'Property'}</h4>
                {(property?.price || property?.newParam?.price) && (
                    <p className={styles.price}>
                        AED {(property?.price || property?.newParam?.price)?.toLocaleString()}
                        {property?.newParam?.price && ' Starting'}
                    </p>
                )}
                {(property?.location?.community || property?.location?.sub_community || property?.location || property?.area) && (
                    <p className={styles.location}>
                        📍 {property?.location?.community || property?.location?.sub_community || property?.location || property?.area}
                    </p>
                )}
                {property?.developer?.name && (
                    <p className={styles.developer}>🏢 {property.developer.name}</p>
                )}
            </div>

            <div className={styles.socialPlatforms}>
                {Object.entries(socialMediaPlatforms).map(([key, platform]) => (
                    <button
                        key={key}
                        className={styles.platformButton}
                        onClick={() => handleShare(key)}
                        style={{ '--platform-color': platform.color }}
                    >
                        <img 
                            src={platform.icon} 
                            alt={platform.name}
                            className={styles.platformIcon}
                        />
                        <span>{platform.name}</span>
                    </button>
                ))}
            </div>

            <div className={styles.copySection}>
                <div className={styles.copyButtons}>
                    <button
                        className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                        onClick={handleCopyLink}
                    >
                        {copied ? '✓ Copied!' : 'Copy Link'}
                    </button>
                    <button
                        className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                        onClick={handleCopyText}
                    >
                        {copied ? '✓ Copied!' : 'Copy Text'}
                    </button>
                </div>
            </div>

            <div className={styles.previewSection}>
                <h5>Preview:</h5>
                <div className={styles.previewText}>
                    {shareText}
                </div>
            </div>
        </div>
    );
}

export default SocialMediaShare; 