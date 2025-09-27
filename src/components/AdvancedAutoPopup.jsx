import { useState, useEffect, useCallback } from 'react';
import { X, Bell, AlertCircle, Info, CheckCircle, Settings, BarChart3 } from 'lucide-react';
import { useAutoPopup, usePopupMessages, usePopupAnalytics } from '../hooks/useAutoPopup';
import styles from './AutoPopup.module.css';

const AdvancedAutoPopup = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [customInterval, setCustomInterval] = useState(15000);
    const [customMessages, setCustomMessages] = useState([]);
    
    // Use the custom hooks
    const {
        isVisible,
        popupCount,
        isEnabled,
        closePopup,
        disablePopup,
        enablePopup,
        getPopupStats
    } = useAutoPopup(customInterval, true);

    const {
        trackPopupShown,
        trackPopupClosed,
        trackAction,
        getAnalytics
    } = usePopupAnalytics();

    // Default popup messages
    const defaultMessages = [
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

    const messages = customMessages.length > 0 ? customMessages : defaultMessages;
    const { currentMessage } = usePopupMessages(messages);

    // Track popup shown
    useEffect(() => {
        if (isVisible) {
            trackPopupShown();
        }
    }, [isVisible, trackPopupShown]);

    const handleClose = useCallback(() => {
        closePopup();
        trackPopupClosed();
    }, [closePopup, trackPopupClosed]);

    const handleAction = useCallback((actionUrl, actionType) => {
        trackAction(actionType);
        window.location.href = actionUrl;
        closePopup();
    }, [trackAction, closePopup]);

    const handleDisable = useCallback(() => {
        disablePopup();
        trackPopupClosed();
    }, [disablePopup, trackPopupClosed]);

    const handleEnable = useCallback(() => {
        enablePopup();
    }, [enablePopup]);

    const handleIntervalChange = useCallback((newInterval) => {
        setCustomInterval(newInterval);
        localStorage.setItem('autoPopupInterval', newInterval.toString());
    }, []);

    const handleAddCustomMessage = useCallback(() => {
        const newMessage = {
            id: Date.now(),
            type: 'info',
            title: 'Custom Message',
            message: 'This is a custom popup message.',
            icon: Info,
            actionText: 'OK',
            actionUrl: '#'
        };
        setCustomMessages(prev => [...prev, newMessage]);
    }, []);

    const handleRemoveCustomMessage = useCallback((messageId) => {
        setCustomMessages(prev => prev.filter(msg => msg.id !== messageId));
    }, []);

    // Load saved settings
    useEffect(() => {
        const savedInterval = localStorage.getItem('autoPopupInterval');
        if (savedInterval) {
            setCustomInterval(parseInt(savedInterval));
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
                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={styles.settingsButton}
                    title="Popup Settings"
                >
                    <Settings size={16} />
                </button>
            </div>
        );
    }

    if (!currentMessage) return null;

    const IconComponent = currentMessage.icon;
    const analytics = getAnalytics();

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
                    
                    {/* Analytics Display */}
                    <div className={styles.analyticsDisplay}>
                        <small className={styles.analyticsText}>
                            Popup #{popupCount} | Total Shown: {analytics.totalShown}
                        </small>
                    </div>
                </div>
                
                <div className={styles.popupFooter}>
                    <button 
                        onClick={() => handleAction(currentMessage.actionUrl, currentMessage.actionText)}
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
                        Don't show again
                    </button>
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={styles.settingsButton}
                        title="Settings"
                    >
                        <Settings size={14} />
                    </button>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className={styles.settingsPanel}>
                    <div className={styles.settingsHeader}>
                        <h3>Popup Settings</h3>
                        <button 
                            onClick={() => setShowSettings(false)}
                            className={styles.closeButton}
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className={styles.settingsContent}>
                        <div className={styles.settingGroup}>
                            <label>Interval (seconds):</label>
                            <input
                                type="number"
                                value={customInterval / 1000}
                                onChange={(e) => handleIntervalChange(parseInt(e.target.value) * 1000)}
                                min="5"
                                max="300"
                            />
                        </div>
                        
                        <div className={styles.settingGroup}>
                            <label>Analytics:</label>
                            <div className={styles.analyticsInfo}>
                                <p>Total Shown: {analytics.totalShown}</p>
                                <p>Total Closed: {analytics.totalClosed}</p>
                                <p>Total Actions: {analytics.totalActions}</p>
                            </div>
                        </div>
                        
                        <div className={styles.settingGroup}>
                            <label>Custom Messages:</label>
                            <button 
                                onClick={handleAddCustomMessage}
                                className={styles.addButton}
                            >
                                Add Custom Message
                            </button>
                            
                            {customMessages.map((message) => (
                                <div key={message.id} className={styles.customMessage}>
                                    <span>{message.title}</span>
                                    <button 
                                        onClick={() => handleRemoveCustomMessage(message.id)}
                                        className={styles.removeButton}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedAutoPopup;
