import Modal from "../../../ui/Modal";
import styles from "../../../styles/BtnAdd.module.css";
import ChangeStaffForm from "./ChangeStaffForm";

function ChangeStaff() {

    return (
        <Modal>
            <Modal.Open openWindowName="changeStaff" >
                <button className={styles.btnAdd}>
                    <img src="/icons/add.svg" />
                    <span>Change</span>
                </button>
            </Modal.Open>
            <Modal.Window name="changeStaff" overflow={true}  >
                <ChangeStaffForm closeModal={close} />
            </Modal.Window>
        </Modal>
    );
}

export default ChangeStaff;
