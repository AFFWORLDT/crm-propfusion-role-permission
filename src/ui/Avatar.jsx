import styles from './Avatar.module.css';

function Avatar({ src, alt, size = "medium" }) {
    return (
        <div className={`${styles.avatar} ${styles[size]}`}>
            {src ? (
                <img src={src} alt={alt} />
            ) : (
                <div className={styles.placeholder}>
                    {alt?.charAt(0).toUpperCase() || 'U'}
                </div>
            )}
        </div>
    );
}

export default Avatar; 