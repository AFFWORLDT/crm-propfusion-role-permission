// ToggleButton/index.js
import  { useState, createContext, useContext, useEffect } from 'react';
import styles from './ToggleButton.module.css';

const ToggleButtonContext = createContext();

const ToggleButton = ({ children, mobileModal = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const toggle = () => setIsOpen(!isOpen);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <ToggleButtonContext.Provider value={{ isOpen, toggle, isMobile, mobileModal }}>
      <div className={styles.toggleBtn__container}>
        {children}
      </div>
    </ToggleButtonContext.Provider>
  );
};

const Button = ({ label, style, icon }) => {
  const { toggle, isOpen } = useContext(ToggleButtonContext);

  return (
    <button
      className={`${styles.toggleBtn__trigger} ${isOpen ? styles['toggleBtn__trigger--active'] : ''}`}
      style={style}
      onClick={toggle}
      aria-expanded={isOpen}
    >
      <div className={styles.toggleBtn__triggerContent}>
        {icon && <span className={styles.toggleBtn__icon}>{icon}</span>}
        {label}
      </div>
    </button>
  );
};

const Content = ({ children }) => {
  const { isOpen, isMobile, mobileModal, toggle } = useContext(ToggleButtonContext);
  
  // If mobile modal is enabled and we're on mobile, use modal behavior
  if (mobileModal && isMobile) {
    return (
      <>
        {/* Overlay */}
        <div 
          className={`${styles.toggleBtn__overlay} ${isOpen ? styles['toggleBtn__overlay--visible'] : ''}`}
          onClick={toggle}
        />
        {/* Modal Content */}
        <div className={`
          ${styles.toggleBtn__content} 
          ${isOpen ? styles['toggleBtn__content--visible'] : styles['toggleBtn__content--hidden']}
          ${styles['toggleBtn__content--mobile-modal']}
        `}>   
          {typeof children === 'function' ? children({ toggle, isMobile }) : children}
        </div>
      </>
    );
  }
  
  // Default inline behavior for desktop or when mobileModal is false
  return (
    <div className={`
      ${styles.toggleBtn__content} 
      ${isOpen ? styles['toggleBtn__content--visible'] : styles['toggleBtn__content--hidden']}
      ${styles['toggleBtn__content--inline']} btnSubmit
    `}>   
      {typeof children === 'function' ? children({ toggle, isMobile }) : children}
    </div>
  );
};

ToggleButton.Button = Button;
ToggleButton.Content = Content;

export default ToggleButton;