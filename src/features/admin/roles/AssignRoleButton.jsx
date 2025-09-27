import { UserPlus } from "lucide-react";
import { useState } from "react";
import styles from "./RoleList.module.css";
import { Modal, Box } from "@mui/material";
import { useAssignRole } from "./useAssignRole";
import useStaff from "../staff/useStaff";

function AssignRoleButton({ role }) {
    const { data: staffData } = useStaff();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);

    const { assignRoleToUser, isAssigning } = useAssignRole();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleAssignRole = async () => {
        if (!selectedUser) return;

        try {
             assignRoleToUser({
                userId: selectedUser,
                roleId: role?.role_id,
            });
            setSelectedUser(null);
            handleClose();
        } catch (error) {
            console.error("Error assigning role:", error);
        }
    };

    const filteredStaff =
        staffData?.filter(
            (staff) =>
                (staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    staff.email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) &&
                staff.role_id !== role?.role_id
        ) || [];

    const handleUserSelect = (userId) => {
        setSelectedUser(userId === selectedUser ? null : userId);
    };

    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        maxWidth: "90%",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 2,
        borderRadius: 2,
        maxHeight: "90vh",
        overflow: "auto",
    };

    return (
        <>
            <button
                className={styles?.deleteButton}
                title="Assign role"
                disabled={isAssigning}
                onClick={handleOpen}
            >
                <UserPlus size={18} />
            </button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="assign-role-modal"
                aria-describedby="modal-to-assign-role-to-users"
            >
                <Box sx={modalStyle}>
                    <h2 className={styles.modalTitle}>
                        Assign Role :{" "}
                        <span
                            style={{
                                fontWeight: "bold",
                                color: "var(--primary-color)",
                            }}
                        >
                            {role?.name}
                        </span>
                    </h2>

                    <div className={styles.modalBody}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search staff..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        {filteredStaff.length === 0 && (
                            <div className={styles.noResults}>
                                {searchQuery
                                    ? "No matching staff found"
                                    : "All staff members already have this role"}
                            </div>
                        )}

                        <div className={styles.staffList}>
                            {filteredStaff.map((staff) => (
                                <div
                                    key={staff.id}
                                    className={`${styles.staffItem} ${
                                        selectedUser === staff.id
                                            ? styles.selected
                                            : ""
                                    }`}
                                    onClick={() => handleUserSelect(staff.id)}
                                >
                                    <div className={styles.staffAvatar}>
                                        {staff.avatar ? (
                                            <img
                                                src={staff.avatar}
                                                alt={staff.name}
                                            />
                                        ) : (
                                            <div
                                                className={
                                                    styles.avatarPlaceholder
                                                }
                                            >
                                                {staff.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.staffInfo}>
                                        <div className={styles.staffName}>
                                            {staff.name}
                                        </div>
                                        <div className={styles.staffEmail}>
                                            {staff.email}
                                        </div>
                                        <div className={styles.staffRole}>
                                            {staff.role_name || "No role"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            className="btnSubmit"
                            onClick={handleAssignRole}
                            disabled={isAssigning || !selectedUser}
                        >
                            {isAssigning
                                ? "Assigning..."
                                : selectedUser
                                  ? "Assign Role"
                                  : "Select a user"}
                        </button>
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default AssignRoleButton;
