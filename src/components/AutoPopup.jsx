import { useState, useEffect } from 'react';
import { X, Bell, AlertCircle, Info, CheckCircle } from 'lucide-react';
import styles from './AutoPopup.module.css';

const AutoPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [popupCount, setPopupCount] = useState(0);
    const [isEnabled, setIsEnabled] = useState(true);

    // Popup messages array - आप इसे customize कर सकते हैं
    const popupMessages = [
        {
            id: 1,
            type: 'info',
            title: 'New Lead Alert!',
            message: 'You have 3 new leads waiting for your attention.',
            icon: Bell,
            actionText: 'View Leads',
            actionUrl: '/leads'
        },
        {
            id: 2,
            type: 'success',
            title: 'Property Updated',
            message: 'Your property listing has been successfully updated.',
            icon: CheckCircle,
            actionText: 'View Properties',
            actionUrl: '/for-sell/new-list'
        },
        {
            id: 3,
            type: 'warning',
            title: 'Follow-up Reminder',
            message: 'You have 2 pending follow-ups scheduled for today.',
            icon: AlertCircle,
            actionText: 'View Calendar',
            actionUrl: '/calendar'
        },
        {
            id: 4,
            type: 'info',
            title: 'System Update',
            message: 'New features have been added to your CRM system.',
            icon: Info,
            actionText: 'Learn More',
            actionUrl: '/user-manual'
        }
    ];

    useEffect(() => {
        if (!isEnabled) return;

        const interval = setInterval(() => {
            setIsVisible(true);
            setPopupCount(prev => prev + 1);
        }, 15000); // 15 seconds

        return () => clearInterval(interval);
    }, [isEnabled]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleAction = (actionUrl) => {
        // Navigate to the action URL
        window.location.href = actionUrl;
        setIsVisible(false);
    };

    const handleDisable = () => {
        setIsEnabled(false);
        setIsVisible(false);
        // Store preference in localStorage
        localStorage.setItem('autoPopupDisabled', 'true');
    };

    const handleEnable = () => {
        setIsEnabled(true);
        localStorage.removeItem('autoPopupDisabled');
    };

    // Check if popup was previously disabled
    useEffect(() => {
        const isDisabled = localStorage.getItem('autoPopupDisabled');
        if (isDisabled === 'true') {
            setIsEnabled(false);
        }
    }, []);

    if (!isVisible || !isEnabled) {
        return (
            <div className={styles.controlPanel}>
                <button 
                    onClick={handleEnable}
                    className={styles.enableButton}
                    title="Enable Auto Popup"
                >
                    <Bell size={16} />
                    Enable Popup
                </button>
            </div>
        );
    }

    const currentMessage = popupMessages[popupCount % popupMessages.length];
    const IconComponent = currentMessage.icon;

    return (
        <div className={styles.popupOverlay}>
            <div className={`${styles.popup} ${styles[`popup--${currentMessage.type}`]}`}>
                <div className={styles.popupHeader}>
                    <div className={styles.popupIcon}>
                        <IconComponent size={24} />
                    </div>
                    <div className={styles.popupTitle}>
                        {currentMessage.title}
                    </div>
                    <button 
                        onClick={handleClose}
                        className={styles.closeButton}
                        aria-label="Close popup"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className={styles.popupContent}>
                    <p className={styles.popupMessage}>
                        {currentMessage.message}
                    </p>
                </div>
                
                <div className={styles.popupFooter}>
                    <button 
                        onClick={() => handleAction(currentMessage.actionUrl)}
                        className={`${styles.actionButton} ${styles[`actionButton--${currentMessage.type}`]}`}
                    >
                        {currentMessage.actionText}
                    </button>
                    <button 
                        onClick={handleClose}
                        className={styles.cancelButton}
                    >
                        Dismiss
                    </button>
                </div>
                
                <div className={styles.popupControls}>
                    <button 
                        onClick={handleDisable}
                        className={styles.disableButton}
                        title="Disable auto popup"
                    >
                        Don&apos;t show again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AutoPopup;