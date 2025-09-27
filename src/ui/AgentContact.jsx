import useStaff from "../features/admin/staff/useStaff";
import AgentChangeModal from "./AgentChangeModal";
import styles from "./AgentContact.module.css";
import Modal from "./Modal";
import { Wand2 } from 'lucide-react';
import { getCompanySettings } from "../services/apiCompany";
import { useState, useEffect } from "react";

function AgentContact({
    onChangeAgent,
    isChangingAgent,
    agentAvatar,
    agentName,
    agentPhone,
    agentMail,
    projectId,
}) {
    const { data, isLoading } = useStaff();
    const [companyDetails, setCompanyDetails] = useState(null);

    const getCompanyDetails = async () => {
        const  companyDetails = await getCompanySettings();
        setCompanyDetails(companyDetails);
    }

    useEffect(() => {
        getCompanyDetails();
    }, []);

    return (
        <div>
            <div className={styles.agentContent}>
                <div className={styles.agentAvatar}>
                    <img src={agentAvatar} />
                </div>
                <span className={styles.agentName}>{agentName}</span>
                <Modal>
                    <Modal.Open openWindowName="chooseAgent">
                        <button
                            className={styles.btnChooseAgent}
                            disabled={isLoading}
                        >
                            <img src="/icons/chevron-down.svg" />
                        </button>
                    </Modal.Open>
                    <Modal.Window name="chooseAgent">
                        <AgentChangeModal
                            staffData={data}
                            onChangeAgent={onChangeAgent}
                            isChangingAgent={isChangingAgent}
                        />
                    </Modal.Window>
                </Modal>
            </div>

            <div className={styles.itemContact}>
                <a href={`tel:${agentPhone}`} target="_blank" rel="noopener noreferrer">
                    <img src="/icons/call.svg" style={{ filter: 'brightness(0)' }} width="22" height="22" />
                </a>
                <a href={`mailto:${agentMail}`} target="_blank" rel="noopener noreferrer">
                    <img src="/icons/mail.svg" style={{ filter: 'brightness(0)' }} width="22" height="22" />
                </a>
                <a href={`https://wa.me/${agentPhone?.replace(/\s+/g, '')?.replace(/^\+/, '')}`} target="_blank" rel="noopener noreferrer">
                    <img src="/icons/whatsapp.svg" style={{ filter: 'brightness(0)' }} width="22" height="22" />
                </a>
                <button
                    type="button"
                    title="Generate Website with AI"
                    style={{ background: '#f1f3f6', border: 'none', borderRadius: '1rem', padding: '1.4rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    onClick={() => {
                        if (projectId) {
                            window.open(`${companyDetails?.off_plan_super_url}?id=${projectId}`, '_blank');
                        } else {
                            alert('Project ID not found');
                        }
                    }}
                >
                    <Wand2 size={20} color="#2563eb" />
                </button>
            </div>
        </div>
    );
}

export default AgentContact;
