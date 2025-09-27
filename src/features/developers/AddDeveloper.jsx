import styles from "../../styles/BtnAdd.module.css";
import Modal from "../../ui/Modal";
import DeveloperForm from "./DeveloperForm";

export default function AddDeveloper() {
    return (
        <Modal>
            <Modal.Open openWindowName="addStaff">
                <button className={styles.btnAdd}>
                    <img src="/icons/add.svg" />
                    <span>Add</span>
                </button>
            </Modal.Open>
            <Modal.Window name="addStaff" overflow={true}>
                <DeveloperForm />
            </Modal.Window>
        </Modal>
    );
}

