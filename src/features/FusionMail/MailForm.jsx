import { useEffect, useState } from "react";
import styles from "./../../pages/FusionMails.module.css";
import useCreateFusionMail from "./useCreateFusionMail";
import { useFusionMailById } from "./useFusiomMail";
import useUpdateFusionMail from "./useUpdateFussionMail";
import useAudiences from "../Audience/useAudince";

function MailForm({ onClose, id }) {
  const editMode = Boolean(id);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    body: "",
    audience_type: "",
    scheduled_time: "",
  });

  const { data: audienceData } = useAudiences(1, 10);
  const { addMail } = useCreateFusionMail();
  const { updatedata } = useUpdateFusionMail();
  const { data: mailData, isLoading } = useFusionMailById(id);

  // Filter unique audience types
  const uniqueAudienceTypes = Array.from(
    new Set(audienceData?.items?.map((option) => option.audience_type))
  );

  // Populate form data in edit mode
  useEffect(() => {
    if (editMode && mailData) {
      setFormData({
        name: mailData.name || "",
        subject: mailData.subject || "",
        body: mailData.body || "",
        audience_type: mailData.audience_type || "",
        scheduled_time: mailData.scheduled_time || "",
      });
    }
  }, [editMode, mailData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      updatedata({ id, payload: formData });
    } else {
      addMail(formData);
    }
    onClose();
  };

  if (isLoading) {
    return (
      <div className={styles.dotsLoader}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h2>{editMode ? "Edit Mail" : "Create New Mail"}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <i className={`${styles.icon} ${styles.iconClose}`}></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Body</label>
            <textarea
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.selectGroup}>
            <label htmlFor="audienceType" className={styles.label}>
              Select Audience Type:
            </label>
            <select
              id="audienceType"
              className={styles.select}
              value={formData.audience_type}
              onChange={(e) =>
                setFormData({ ...formData, audience_type: e.target.value })
              }
            >
              <option value="">All</option>
              {uniqueAudienceTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Scheduled Time</label>
            <input
              type="datetime-local"
              value={formData.scheduled_time}
              onChange={(e) =>
                setFormData({ ...formData, scheduled_time: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              {editMode ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MailForm;
