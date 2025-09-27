import { useState } from 'react';
import styles from './ViewToggle.module.css';

function ViewToggle({ activeView, onViewChange }) {
    return (
        <div className={styles.viewToggle}>
            <button 
                className={`${styles.toggleBtn} ${activeView === 'grid' ? styles.active : ''}`}
                onClick={() => onViewChange('grid')}
                title="Grid View"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            </button>
            <button 
                className={`${styles.toggleBtn} ${activeView === 'table' ? styles.active : ''}`}
                onClick={() => onViewChange('table')}
                title="Table View"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        </div>
    );
}

export default ViewToggle; 