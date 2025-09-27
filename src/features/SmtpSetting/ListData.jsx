import { 
  Shield, 
  Edit2, 
  Trash2, 
  AlertCircle,
  Check,
  X
} from "lucide-react";
import { useState } from "react";
import styles from "./../../pages/general/SmtpSetting.module.css";
import useSmtp from "./useSptm";
import useUpdateSmtp from "./useUpdateSmpt";

function ListData({ handleDelete, handleEdit }) {
  const { isLoading, data, error } = useSmtp(); 
  const {updatedata}=useUpdateSmtp()
  const [updatingId, setUpdatingId] = useState(null);
  
  const handleToggleDefault = async (obj, currentValue) => {
    console.log(obj);
    
    try {
      setUpdatingId(obj.id); 

      
      const newDefaultValue = !currentValue;
const data={
  ...obj,
  is_default: newDefaultValue
}
updatedata({ id: obj.id, payload: data });
      setUpdatingId(null); 
    } catch (error) {
      console.error("Failed to update default status:", error);
    } finally {
      setUpdatingId(null); 
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.error}>
        <span className={styles.errorIcon}>
          <AlertCircle size={20} />
        </span>
        Failed to load SMTP settings: {error?.message}
      </div>
    );
  }
  
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Server</th>
            <th>Port</th>
            <th>Username</th>
            <th>TLS Status</th>
            <th>Default</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((setting) => (
            <tr key={setting?.id}>
              <td>{setting?.name}</td>
              <td>{setting?.server}</td>
              <td>{setting?.port}</td>
              <td>{setting?.username}</td>
              <td>
                <span
                  className={`${styles.statusBadge} ${
                    setting?.use_tls ? styles.enabled : styles.disabled
                  }`}
                >
                  <Shield size={14} />
                  {setting?.use_tls ? "Enabled" : "Disabled"}
                </span>
              </td>
              <td>
                <div className={styles.toggleContainer}>
                  <input
                    type="checkbox"
                    id={`default-toggle-${setting.id}`}
                    className={styles.toggleInput}
                    checked={setting?.is_default}
                    onChange={() => handleToggleDefault(setting, setting?.is_default)}
                    disabled={updatingId === setting?.id}
                  />
                  <label 
                    htmlFor={`default-toggle-${setting.id}`}
                    className={styles.toggleLabel}
                  >
                    <span className={styles.toggleSwitch}></span>
                  </label>
                  <span className={styles.toggleText}>
                    {setting?.is_default ? "Default" : "Set as default"}
                  </span>
                </div>
              </td>
              <td>
                <div className={styles.actions}>
                  <button 
                    className={`${styles.actionButton} ${styles.edit}`} 
                    onClick={() => handleEdit?.(setting?.id)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.delete}`}
                    onClick={() => handleDelete?.(setting?.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListData;