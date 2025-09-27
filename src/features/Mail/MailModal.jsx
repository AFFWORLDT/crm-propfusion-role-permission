// Modal.jsx
import  { useState } from 'react';
import styles from './Modal.module.css';
import useSmtp from '../SmtpSetting/useSptm';
import { SmtpConfigSelector } from '../../ui/SelectOptionSmtp';
import useCampinMail from './useCampinmail';

const Modal = ({isOpen,setIsOpen,id,setid}) => {
  const [selectedOption, setSelectedOption] = useState('');

const {data,isLoading}=useSmtp()
const {sendmail}=useCampinMail()
const handleSubmit = () => {
    const data = {
        campaign_id:id,
        smtp_config_id:selectedOption
    }
    sendmail(data)
    setIsOpen(false)
    setid(null)
    setSelectedOption("")
  };
  
  const handleClose = () => {
    setIsOpen(false)
    setid(null)
    setSelectedOption("")
  };

  

  return (
    <div>
     
      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Select an Option</h2>
            <label htmlFor="smtp_config">SMTP Configuration:</label>
            <SmtpConfigSelector
                            value={selectedOption}
                            onChange={setSelectedOption}
                            options={data}
                            placeholder="Choose SMTP Server"
                            isLoading={isLoading}
                            displayField={"username"}
                        />
            <div className={styles.buttonContainer}>
              <button 
                className={styles.cancelButton}
                onClick={handleClose}
              >
                Cancel
              </button>
              <button 
                className={styles.submitButton}
                onClick={()=>{handleSubmit()}}
                disabled={!selectedOption}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;