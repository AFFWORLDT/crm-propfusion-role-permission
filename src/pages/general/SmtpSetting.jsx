import  { useState } from "react";
import {
    Plus,
    Settings,
} from "lucide-react";
import styles from "./SmtpSetting.module.css";
import { Field } from "../../features/SmtpSetting/Modal";
import { DeleteModal } from "../../features/SmtpSetting/DeleteModal";
import ListData from "../../features/SmtpSetting/ListData";
import useDeleteSmtp from "../../features/SmtpSetting/useDeleteSmtp";
import SectionTop from "../../ui/SectionTop";
import { EmailModal } from "../../features/FusionMail/EmailModal";
import TabBar from "../../ui/TabBar";
import { SMTP_SETTINGS_TABS } from "../../utils/constants";



const SmtpSetting = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {deleteing}= useDeleteSmtp()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [Id, setId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
   const handleEdit =(id)=>{
      setId(id)
      setIsOpen(true)
   }
  
   
    const handleDelete = (id) => {
        setId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        deleteing(Id)
        setDeleteModalOpen(false);
        setId(null);
    };
    return (
        <div className="sectionContainer">
            <SectionTop heading="SMTP Settings">
                <TabBar
                    tabs={SMTP_SETTINGS_TABS}
                    activeTab={"SMTP_SETTINGS"}
                    navigateTo={(id) => SMTP_SETTINGS_TABS.find(tab => tab.id === id)?.path || '/admin/general/smtp-setting'}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: SMTP_SETTINGS_TABS[0].bgColor }}>
                <div  style={{
                    backgroundColor:"none",
                    height : "100vh"
                }}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            <Settings className={styles.titleIcon} size={28} />
                            SMTP Settings
                        </h1>
                        <div className={styles.buttonGr}>
                        <button
                            className={styles.button}
                            onClick={() => setIsOpen(true)}
                        >
                            <Plus size={20} />
                            Add SMTP Server
                        </button>
                        <button 
                  className={styles.button}
                  onClick={() => setIsModalOpen(true)}
                >

                  Send Mail
                </button>
                </div>
                    </div>
                     
                     <ListData  handleDelete={handleDelete} handleEdit={handleEdit}/>

                      
                    <Field
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        Id={Id}
                        setId={setId}

                    />
                    <DeleteModal
                        isOpen={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleConfirmDelete}
                        title={"SMTP Server"}
                    />
                     <EmailModal
                isOpen={isModalOpen}
                setIsopen={setIsModalOpen}
              />
                </div>
            </section>
        </div>
    );
};

export default SmtpSetting;
