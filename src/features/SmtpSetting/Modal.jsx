import { 
    Mail, 
    Server, 
    Hash, 
    Shield, 
    AlertCircle,
    EyeOff,
    Lock,
    Eye,
    Loader,
    User
  } from 'lucide-react';
  import styles from "./../../pages/general/SmtpSetting.module.css"
import { useEffect, useState } from 'react';
import useCreateSmtp from "./useCreateSmtp"
import useSmtpById from './useGetSmtpid';
import useUpdateSmtp from './useUpdateSmpt';
const Modal = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
  
    return (
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{title}</h2>
          </div>
          {children}
        </div>
      </div>
    );
  };

  export const Field = ({isOpen,setIsOpen,Id,setId})=>{
    const isEdit = Id ? true: false
    const [formData, setFormData] = useState({
      server: "",
      name:"",
      port: "",
      username: "",
      password: "",
      use_tls: true,
  });
const { isLoading, data } = useSmtpById(Id);
const [errors, setErrors] = useState({})
const [showPassword, setShowPassword] = useState(false);
const {addSmtp,isPending}=useCreateSmtp()
const {updatedata,isPendings}=useUpdateSmtp()
const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
  }));
};

const validateForm = () => {
  const newErrors = {};
  if (!formData.server) newErrors.server = "Server is required";
  if (!formData.port) newErrors.port = "Port is required";
  if (!formData.username) newErrors.username = "Username is required";
  if (!formData.password && !isEdit) {
    newErrors.password = "Password is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

useEffect(() => {
  if (isEdit && data) {
      setFormData({
          server: data.server || "",
          name: data.name || "",
          port: data.port || "",
          username: data.username || "",
          password: data.password || "",
          use_tls: data.use_tls ?? true,
      });
  }
}, [isEdit, data]);

const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {    
      if (isEdit) {
          updatedata({ id: Id, payload: formData });
      } else {
          addSmtp(formData);
      }
      
      setFormData({
          server: "",
          name: "",
          port: "",
          username: "",
          password: "",
          use_tls: true,
      });
      setIsOpen(false);
      if (isEdit) {
          setId(null);
      }
  }
};
const handleClose = () => {
  setIsOpen(false);
  setErrors({});
  if (isEdit) {
      setId(null);
  }
  setFormData({
      server: "",
      name: "",
      port: "",
      username: "",
      password: "",
      use_tls: true,
  });
};
const isSubmitting = isEdit ? isPendings : isPending;
if (isLoading) {
  return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Edit SMTP Server">
          <div className={styles.loader}>
              <Loader className={styles.spinner} />
              <p>Loading SMTP settings...</p>
          </div>
      </Modal>
  );
}

   return( 
   <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={isEdit ? "Edit SMTP Server" : "Add New SMTP Server"}>
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Server Address</label>
        <div className={`${styles.inputWrapper} ${errors.server ? styles.errorInput : ''}`}>
          <div className={styles.iconWrapper}>
            <Server size={20} />
          </div>
          <input
            name="server"
            placeholder="e.g. smtp.gmail.com"
            value={formData.server}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
        {errors.server && (
          <span className={styles.error}>
            <AlertCircle size={14} />
            {errors.server}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Name</label>
        <div className={`${styles.inputWrapper} ${errors.server ? styles.errorInput : ''}`}>
          <div className={styles.iconWrapper}>
            <User size={20} />
          </div>
          <input
            name="name"
            placeholder="e.g. Name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
        {errors.server && (
          <span className={styles.error}>
            <AlertCircle size={14} />
            {errors.server}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Port Number</label>
        <div className={`${styles.inputWrapper} ${errors.port ? styles.errorInput : ''}`}>
          <div className={styles.iconWrapper}>
            <Hash size={20} />
          </div>
          <input
            name="port"
            placeholder="e.g. 587"
            type="text"
            value={formData.port}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
        {errors.port && (
          <span className={styles.error}>
            <AlertCircle size={14}/>
            {errors.port}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>Username</label>
        <div className={`${styles.inputWrapper} ${errors.username ? styles.errorInput : ''}`}>
          <div className={styles.iconWrapper}>
            <Mail size={20} />
          </div>
          <input
            name="username"
            placeholder="e.g. user@example.com"
            value={formData.username}
            onChange={handleInputChange}
            className={styles.input}
          />
        </div>
        {errors.username && (
          <span className={styles.error}>
            <AlertCircle size={14} />
            {errors.username}
          </span>
        )}
      </div>
      {!isEdit && (

      <div className={styles.formGroup}>
      <label className={styles.inputLabel}>Password</label>
      <div className={`${styles.inputWrapper} ${errors.password ? styles.errorInput : ''}`}>
        <div className={styles.iconWrapper}>
          <Lock size={20} />
        </div>
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={formData.password}
          onChange={handleInputChange}
          className={styles.input}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={styles.passwordToggle}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {errors.password && (
        <span className={styles.error}>
          <AlertCircle size={14} />
          {errors.password}
        </span>
      )}
    </div>
      )}

      <div className={styles.formGroup}>
        <div className={styles.switchWrapper}>
          <div className={styles.switchLabel}>
            <Shield size={20} />
            Use TLS Security
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              name="use_tls"
              checked={formData.use_tls}
              onChange={handleInputChange}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.buttonOutline}
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit"  className={isSubmitting ? `${styles.loader} ${styles.spinner}` : styles.button}
                        disabled={isSubmitting}>
        {isSubmitting ? <Loader /> : (isEdit ? "Update Setting" : "Save Setting")}
        </button>
      </div>
    </form>
  </Modal>
   );
  }