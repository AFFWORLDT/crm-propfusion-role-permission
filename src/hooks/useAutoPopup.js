import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing auto popup functionality
 * @param {number} interval - Interval in milliseconds (default: 15000)
 * @param {boolean} enabled - Whether popup is enabled (default: true)
 * @returns {object} Popup state and control functions
 */
export const useAutoPopup = (interval = 15000, enabled = true) => {
    const [isVisible, setIsVisible] = useState(false);
    const [popupCount, setPopupCount] = useState(0);
    const [isEnabled, setIsEnabled] = useState(enabled);
    const [lastPopupTime, setLastPopupTime] = useState(null);

    // Check if popup was previously disabled
    useEffect(() => {
        const isDisabled = localStorage.getItem('autoPopupDisabled');
        if (isDisabled === 'true') {
            setIsEnabled(false);
        }
    }, []);

    // Auto popup timer
    useEffect(() => {
        if (!isEnabled) return;

        const timer = setInterval(() => {
            setIsVisible(true);
            setPopupCount(prev => prev + 1);
            setLastPopupTime(new Date());
        }, interval);

        return () => clearInterval(timer);
    }, [isEnabled, interval]);

    // Close popup
    const closePopup = useCallback(() => {
        setIsVisible(false);
    }, []);

    // Disable popup permanently
    const disablePopup = useCallback(() => {
        setIsEnabled(false);
        setIsVisible(false);
        localStorage.setItem('autoPopupDisabled', 'true');
    }, []);

    // Enable popup
    const enablePopup = useCallback(() => {
        setIsEnabled(true);
        localStorage.removeItem('autoPopupDisabled');
    }, []);

    // Reset popup count
    const resetPopupCount = useCallback(() => {
        setPopupCount(0);
    }, []);

    // Get popup statistics
    const getPopupStats = useCallback(() => {
        return {
            totalPopups: popupCount,
            lastPopupTime,
            isEnabled,
            isVisible
        };
    }, [popupCount, lastPopupTime, isEnabled, isVisible]);

    return {
        isVisible,
        popupCount,
        isEnabled,
        lastPopupTime,
        closePopup,
        disablePopup,
        enablePopup,
        resetPopupCount,
        getPopupStats
    };
};

/**
 * Hook for managing popup messages
 * @param {Array} messages - Array of popup messages
 * @returns {object} Current message and navigation functions
 */
export const usePopupMessages = (messages = []) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const getCurrentMessage = useCallback(() => {
        if (messages.length === 0) return null;
        return messages[currentIndex % messages.length];
    }, [messages, currentIndex]);

    const nextMessage = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % messages.length);
    }, [messages.length]);

    const previousMessage = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + messages.length) % messages.length);
    }, [messages.length]);

    const goToMessage = useCallback((index) => {
        if (index >= 0 && index < messages.length) {
            setCurrentIndex(index);
        }
    }, [messages.length]);

    return {
        currentMessage: getCurrentMessage(),
        currentIndex,
        nextMessage,
        previousMessage,
        goToMessage,
        totalMessages: messages.length
    };
};

/**
 * Hook for popup analytics
 * @returns {object} Analytics functions
 */
export const usePopupAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        totalShown: 0,
        totalClosed: 0,
        totalActions: 0,
        averageShowTime: 0,
        mostClickedAction: null
    });

    const trackPopupShown = useCallback(() => {
        setAnalytics(prev => ({
            ...prev,
            totalShown: prev.totalShown + 1
        }));
    }, []);

    const trackPopupClosed = useCallback(() => {
        setAnalytics(prev => ({
            ...prev,
            totalClosed: prev.totalClosed + 1
        }));
    }, []);

    const trackAction = useCallback((actionType) => {
        setAnalytics(prev => ({
            ...prev,
            totalActions: prev.totalActions + 1,
            mostClickedAction: actionType
        }));
    }, []);

    const getAnalytics = useCallback(() => {
        return analytics;
    }, [analytics]);

    const resetAnalytics = useCallback(() => {
        setAnalytics({
            totalShown: 0,
            totalClosed: 0,
            totalActions: 0,
            averageShowTime: 0,
            mostClickedAction: null
        });
    }, []);

    return {
        trackPopupShown,
        trackPopupClosed,
        trackAction,
        getAnalytics,
        resetAnalytics
    };
};

export default useAutoPopup;
