import styles from "../../pages/Dashboard.module.css";

export function DashboardCard({
    icon: Icon,
    label,
    value,
    className = "",
    isImage = false,
}) {
    return (
        <div className={`${styles.infoContainer} ${className}`}>
            <div className={styles.infoIcon}>
                {isImage ? (
                    <img src={"/icons/whatsapp-icon.svg"} alt="" />
                ) : (
                    <Icon size={24} strokeWidth={2} />
                )}
            </div>
            <div className={styles.infoContent}>
                <span>{label}</span>
                <span>{value}</span>
            </div>
        </div>
    );
}

export function DashboardChartCard({ children, title }) {
    return (
        <div className={styles.chartContainer}>
            {title ? <h3 className={styles.chartTitle}>{title}</h3> : null}
            {children}
        </div>
    );
}

export function PropertyStatesCard({ title, value, description, icon: Icon }) {
    return (
        <div className={styles.propertyStatesCard}>
            <div className={styles.propertyStateTop}>
                <h3>{title}</h3>
                <Icon size={24} strokeWidth={2} />
            </div>
            <div className={styles.propertyStateBottom}>
                <span>{value}</span>
                <p>{description}</p>
            </div>
        </div>
    );
} 