import { useState, useEffect } from 'react';
import styles from "./../../styles/Audience.module.css";
import { Mail, X } from 'lucide-react';

const EmailPopup = ({ emails, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animation handling
  useEffect(() => {
    setIsVisible(true);
    
    // Handle escape key press
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth closing animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Match animation duration
  };

  // Click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Copy email to clipboard
  const handleCopyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div 
      className={`${styles.overlay} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-labelledby="email-list-title"
      aria-modal="true"
    >
      <div 
        className={`${styles.popup} ${isVisible ? 'scale-100' : 'scale-95'}`}
        role="document"
      >
        <div className={styles.headers}>
          <h3 className={styles.title} id="email-list-title">
            Email List
          </h3>
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.emailList}>
            {emails.map((email, index) => (
              <div 
                key={index}
                className={styles.emailItem}
                onClick={() => handleCopyEmail(email)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCopyEmail(email);
                  }
                }}
                title="Click to copy email"
              >
                <span className={styles.emailIcon}>
                  <Mail className="w-5 h-5" />
                </span>
                <span className={styles.emailAddress}>
                  {email}
                </span>
              </div>
            ))}
          </div>
          
       
        </div>
        <div className={styles.summary}>
            {emails.length === 0 ? (
              <p>No emails found</p>
            ) : (
              <p>Total Emails: {emails.length}</p>
            )}
          </div>
      </div>
    </div>
  );
};

export default EmailPopup;