import { useState } from 'react';
import Pagination from '../Audience/Pagination';
import styles from './../../pages/FusionMails.module.css';
import useFusionmail from './useFusiomMail';
import Modal from '../Mail/MailModal';

function MailList({  onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { isLoading, data, error } = useFusionmail(currentPage, pageSize);
  const totalPages =  data.pages || 1; 
  const [mailmodal,setMailmodal]=useState(false)
  const [campinId,setCampinId]=useState(null)


  const sendMail = (id)=>{
    setCampinId(id)
     setMailmodal(true)

  }
  if (isLoading) {
    return (
        <div className={styles.dotsLoader}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </div>
    );
}

if (error) {
    return <p style={{ color: "red" }}>Error: {error.message}</p>;
}

    return (
      <div>
      <div className={styles.mailList}>
       { (
        data?.items?.length>0 ?(
          data?.items?.map(mail => (
            <div key={mail.id} className={styles.mailCard}>
              <div className={styles.mailContent}>
                <div className={styles.headerWithIcon}>
                  <i className={`${styles.icon} ${styles.iconMail}`}></i>
                  <h3>{mail.name}</h3>
                </div>
                <p className={styles.subject}>{mail.subject}</p>
                <p className={styles.body}>{mail.body}</p>
                <div className={styles.mailMeta}>
                  <span>Audience: {mail.audience_type}</span>
                  <span>Scheduled: {new Date(mail.scheduled_time).toLocaleString()}</span>
                </div>
              </div>
              <div className={styles.mailActions}>
              <div className={styles.buttonGroup}>
              <button onClick={() => onEdit(mail)} className={styles.editButton}>
                  Edit
                </button>
                <button onClick={() => onDelete(mail)} className={styles.deleteButton}>
                  Delete
                </button>
              </div>
               <div>
               <button className={styles.editButton} onClick={()=>{sendMail(mail.id)}}>
                 Send Email
                  </button>
               </div>
              </div>
              
            </div>
          ))
        ): <p>No Data Found</p>
       )}

      </div>
      <Modal
       isOpen={mailmodal}
       setIsOpen={setMailmodal}
       id={campinId}
       setid={setCampinId}
      />
      <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      pageSizeOptions={[5, 10, 20, 50]} // Optional
  />
  </div>
    );
  }
export default MailList  