import Modal from "../../../ui/Modal";
import styles from "../../../styles/BtnAdd.module.css";
import StaffForm from "./StaffForm";

function AddStaff() {
    return (
        <Modal>
            <Modal.Open openWindowName="addStaff">
                <button className={styles.btnAdd}>
                    <img src="/icons/add.svg" />
                    <span>Add</span>
                </button>
            </Modal.Open>
            <Modal.Window name="addStaff" overflow={true}>
                <StaffForm />
            </Modal.Window>
        </Modal>
    );
}

export default AddStaff;
