import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import styles from './ScrollToTop.module.css';

function ScrollToTop({ containerRef }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const toggleVisibility = () => {
            if (container.scrollTop > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        container.addEventListener('scroll', toggleVisibility);
        
        return () => {
            container.removeEventListener('scroll', toggleVisibility);
        };
    }, [containerRef]);

    const scrollToTop = () => {
        if (!containerRef.current) return;
        
        containerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;

    return (
        <button 
            className={styles.scrollToTop} 
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <ArrowUp size={28} strokeWidth={2.5} />
        </button>
    );
}

export default ScrollToTop; 