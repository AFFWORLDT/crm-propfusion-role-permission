import Spinner from "../../../ui/Spinner";
import styles from '../LeadsBase.module.css';

function Leads({ data, isLoading }) {
    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <div className={styles.leadsContainer}>
            {data.map((lead, index) => (
                <div key={index} className={styles.card}>
                    <div className={styles.propertyInfo}>
                        <h3 className={styles.title}> ID: {lead?.property_id}</h3>
                        <p className={styles.content}><strong>Lead ID:</strong> {lead?.lead_id}</p>
                        <p className={styles.content}><strong>Property Reference:</strong> {lead?.property_reference}</p>
                        <p className={styles.content}><strong>Type:</strong> {lead?.current_type}</p>
                        <p className={styles.content}><strong>Date:</strong> {lead?.date_time}</p>
                    </div>
                    <div className={styles?.clientInfo}>
                        <p className={styles.content}><strong>Message:</strong> {lead?.message}</p>
                        <p className={styles.content}><strong>Client Name:</strong> {lead.client_name}</p>
                        <p className={styles.content}><strong>Email:</strong> {lead?.client_email}</p>
                        <p className={styles.content}><strong>Phone:</strong> {lead?.client_phone}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Leads;
