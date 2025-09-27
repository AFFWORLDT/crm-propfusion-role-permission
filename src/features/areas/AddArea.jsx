import styles from "../../styles/BtnAdd.module.css";
import Modal from "../../ui/Modal";
import AreaForm from "./AreaForm";

export default function AddArea() {
    return (
        <Modal>
            <Modal.Open openWindowName="addStaff">
                <button className={styles.btnAdd}>
                    <img src="/icons/add.svg" />
                    <span>Add</span>
                </button>
            </Modal.Open>
            <Modal.Window name="addStaff" overflow={true}>
                <AreaForm />
            </Modal.Window>
        </Modal>
    );
}

