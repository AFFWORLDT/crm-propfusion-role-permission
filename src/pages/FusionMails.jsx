import { useState } from 'react';
import styles from './FusionMails.module.css';
import SectionTop from '../ui/SectionTop';
import MailForm from '../features/FusionMail/MailForm';
import DeleteModal from '../features/FusionMail/DeleteModal';
import MailList from '../features/FusionMail/MailList';
import useDeleteMail from '../features/FusionMail/useDelete';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TabBar from '../ui/TabBar';
import { FUSION_MAIL_TABS } from '../utils/constants';

function FusionMails() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  const [editingMail, setEditingMail] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mailToDelete, setMailToDelete] = useState(null);
  const { deleteing } = useDeleteMail();

  const handleDeleteMail = (id) => {
    deleteing(id);
    setShowDeleteModal(false);
  };

  return (
    <div className="sectionContainer">
      <SectionTop heading="FusionMail">
        <TabBar
          tabs={FUSION_MAIL_TABS}
          activeTab={"FUSION_MAIL"}
          navigateTo={(id) => FUSION_MAIL_TABS.find(tab => tab.id === id)?.path || '/admin/fusionmails'}
        />
      </SectionTop>
      <section className="sectionStyles" style={{ backgroundColor: FUSION_MAIL_TABS[0].bgColor }}>
        <div className={styles.header}>
          <header className={""}>
            <h1 className={styles.headerTitle}>Mail Management</h1>
          </header>
          <div className={styles.buttonGroup}>
            <button
              className={styles.createButton}
              onClick={() => setIsFormOpen(true)}
            >
              Create New Mail
            </button>

            <button
              className={styles.createButton}
              onClick={() => { navigate("/admin/audience") }}
            >
              <User size={24} />
              Audience
            </button>
            <button
              className={styles.createButton}
              onClick={() => setIsFormOpen(true)}
            >
              Send Bulk Mail
            </button>
          </div>
        </div>
        <MailList
          onEdit={(mail) => {
            setEditingMail(mail);
            setIsFormOpen(true);
          }}
          onDelete={(mail) => {
            setMailToDelete(mail);
            setShowDeleteModal(true);
          }}
        />

        {isFormOpen && (
          <MailForm
            id={editingMail ? editingMail.id : undefined}
            onClose={() => {
              setIsFormOpen(false);
              setEditingMail(null);
            }}
          />
        )}

        {showDeleteModal && (
          <DeleteModal
            mail={mailToDelete}
            onConfirm={() => handleDeleteMail(mailToDelete.id)}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </section>
    </div>
  );
}

export default FusionMails;



