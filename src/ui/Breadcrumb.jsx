import styles from './Breadcrumb.module.css';

const Breadcrumb = ({ items, filter = () => true, color = 'hsl(221.2 83.2% 53.3%)', loading = false }) => {
    if (loading) {
        return <div className={styles.breadcrumb}>Loading...</div>;
    }

    return (
        <nav aria-label="breadcrumb" style={{ '--breadcrumb-color': color }}>
            <ul className={styles.breadcrumb}>
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={styles.breadcrumbItem}
                    >
                        <div 
                            className={`${styles.numberBox} ${
                                filter(item) ? styles.highlightBox : styles.grayBox
                            }`}
                        >
                            {index + 1}
                        </div>
                        <span 
                            className={filter(item) ? styles.highlight : styles.grayText}
                        >
                            {item.label}
                        </span>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Breadcrumb;
