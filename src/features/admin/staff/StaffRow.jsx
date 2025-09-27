import BtnToggle from "../../../ui/BtnToggle";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import ResetPassForm from "./ResetPassForm";
import StaffForm from "./StaffForm";
import styles from "./StaffRow.module.css";
import useDeleteStaffMember from "./useDeleteStaffMember";
import useUpdatePass from "./useUpdatePass";
import useUpdateStaffMember from "./useUpdateStaffMember";

function StaffRow({ staffData }) {
    const isActive = staffData.state === "active";
    const { deleteStaffMember, isPending: isDeleting } = useDeleteStaffMember();
    const { changePass, isPending: isUpdatingPass } = useUpdatePass();
    const { updateStaffMember, isPending: isUpdating } = useUpdateStaffMember();

    function handleToggle() {
        updateStaffMember({
            id: staffData.id,
            payload: { ...staffData, state: isActive ? "inactive" : "active" },
        });
    }

    return (
        <Table.Row>
            <img className={styles.staffAvatar} src={staffData.avatar} />
            <span>{staffData.name}</span>
            <span>{staffData.phone}</span>

            <BtnToggle
                isActive={isActive}
                onToggle={handleToggle}
                isDisabled={isUpdating}
            />

            <Modal>
                <div className="btnsTableRow">
                    <Modal.Open openWindowName="editStaff">
                        <button disabled={isUpdating}>
                            <img src="/icons/edit.svg" />
                            <span>Edit</span>
                        </button>
                    </Modal.Open>
                    <Modal.Open openWindowName="resetStaffPass">
                        <button disabled={isUpdating}>
                            <img src="/icons/edit.svg" />
                            <span>Reset Password</span>
                        </button>
                    </Modal.Open>
                    <Modal.Open openWindowName="deleteStaff">
                        <button className="btnDeleteRow" disabled={isUpdating}>
                            <img src="/icons/delete.svg" />
                            <span>Delete</span>
                        </button>
                    </Modal.Open>
                </div>

                <Modal.Window name="editStaff" overflow={true}>
                    <StaffForm staffToEdit={staffData} />
                </Modal.Window>
                <Modal.Window name="resetStaffPass">
                    <ResetPassForm
                        name={staffData.name}
                        id={staffData.id}
                        onConfirm={changePass}
                        isUpdatingPass={isUpdatingPass}
                    />
                </Modal.Window>
                <Modal.Window name="deleteStaff">
                    <ConfirmDelete
                        resourceName="staff"
                        resourceId={staffData.id}
                        onConfirm={() => deleteStaffMember(staffData.id)}
                        isDeleting={isDeleting}
                    />
                </Modal.Window>
            </Modal>
        </Table.Row>
    );
}

export default StaffRow;
