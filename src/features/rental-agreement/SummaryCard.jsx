import styles from './SummaryCard.module.css';
import { 
  FileText, 
  Building2, 
  Wallet, 
  CircleDollarSign,
  Clock,
  AlertCircle
} from 'lucide-react';

function SummaryCard({ summary }) {
  return (
    <div className={styles.summaryContainer}>
      <div className={`${styles.card} ${styles.agreements}`}>
        <div className={styles.iconWrapper}>
          <FileText className={styles.icon} />
        </div>
        <h3 className={styles.label}>Total Agreements</h3>
        <p className={styles.value}>
          {summary.total_agreements || 0}
        </p>
      </div>
      
      <div className={`${styles.card} ${styles.properties}`}>
        <div className={styles.iconWrapper}>
          <Building2 className={styles.icon} />
        </div>
        <h3 className={styles.label}>Total Properties</h3>
        <p className={styles.value}>
          {summary.total_properties || 0}
        </p>
      </div>

      <div className={`${styles.card} ${styles.revenue}`}>
        <div className={styles.iconWrapper}>
          <Wallet className={styles.icon} />
        </div>
        <h3 className={styles.label}>Total Revenue</h3>
        <p className={styles.value}>
          {summary.total_revenue || 0}
          <span className={styles.currency}>AED</span>
        </p>
      </div>

      <div className={`${styles.card} ${styles.collected}`}>
        <div className={styles.iconWrapper}>
          <CircleDollarSign className={styles.icon} />
        </div>
        <h3 className={styles.label}>Total Collected</h3>
        <p className={styles.value}>
          {summary.total_collected || 0}
          <span className={styles.currency}>AED</span>
        </p>
      </div>

      <div className={`${styles.card} ${styles.pending}`}>
        <div className={styles.iconWrapper}>
          <Clock className={styles.icon} />
        </div>
        <h3 className={styles.label}>Total Pending</h3>
        <p className={styles.value}>
          {summary.total_pending || 0}
          <span className={styles.currency}>AED</span>
        </p>
      </div>

      <div className={`${styles.card} ${styles.overdue}`}>
        <div className={styles.iconWrapper}>
          <AlertCircle className={styles.icon} />
        </div>
        <h3 className={styles.label}>Total Overdue</h3>
        <p className={styles.value}>
          {summary.total_overdue || 0}
          <span className={styles.currency}>AED</span>
        </p>
      </div>
    </div>
  );
}

export default SummaryCard; 