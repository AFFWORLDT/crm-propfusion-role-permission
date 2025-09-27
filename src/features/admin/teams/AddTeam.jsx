import { useState } from "react";
import styles from "../../../styles/BtnAdd.module.css";
import TeamForm from "./TeamForm";
import CustomModal from "./CustomModal";

function AddTeam() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <button className={styles.btnAdd} onClick={handleOpenModal}>
                <img src="/icons/add.svg" alt="add" />
                <span>Add</span>
            </button>

            <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
                <TeamForm setIsOpen={setIsModalOpen} />
            </CustomModal>
        </>
    );
}

export default AddTeam;
