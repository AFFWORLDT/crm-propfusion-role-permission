
import { Plus } from "lucide-react";
import styles from "../../styles/Owner.module.css";

const OwnerActions = ({ 
  onAddOwner 
}) => {
  return (
    <div className={styles.actionsContainer}>
      <div className={styles.leftActions}>
        {/* Left side content if needed */}
      </div>
      <div className={styles.rightActions}>
        <button onClick={onAddOwner} className={styles.addButton}>
          <Plus size={20} strokeWidth={2.5} />
          <span>Add Owner</span>
        </button>
      </div>
    </div>
  );
};

export default OwnerActions;