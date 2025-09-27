import { useState } from "react";
import useRoles from "../teams/useRoles";
import styles from "./RoleList.module.css";
import { format } from "date-fns";
import { Trash2, Plus, Edit, UserPlus } from "lucide-react";
import { useDeleteRole } from "./useDeleteRole";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import AssignRoleButton from "./AssignRoleButton";

function RoleCard({ role, selectedRole, setSelectedRole }) {
    const [isOpen, setIsOpen] = useState(false);
    const { deleteRoleMutation, isDeleting } = useDeleteRole();

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch (error) {
            return dateString;
        }
    };

    const handleDelete = () => {
        deleteRoleMutation(role?.role_id);
    };

    return (
        <Modal>
            <div className={styles?.card}>
                <div className={styles?.cardHeader}>
                    <h3 className={styles?.cardTitle}>{role?.name}</h3>
                    <div className={styles?.cardActions}>
                        <span
                            className={`${styles?.badge} ${role?.is_active ? styles?.badgeSuccess : styles?.badgeInactive}`}
                        >
                            {role?.is_active ? "Active" : "Inactive"}
                        </span>
                        <AssignRoleButton role={role} />
                        <button
                            className={styles?.deleteButton}
                            title="Edit role"
                            onClick={() => setSelectedRole(role)}
                        >
                            <Edit size={18} />
                        </button>
                        <Modal.Open
                            openWindowName={`delete-role-${role?.role_id}`}
                        >
                            <button
                                onClick={handleDelete}
                                className={styles?.deleteButton}
                                title="Delete role"
                            >
                                <Trash2 size={18} />
                            </button>
                        </Modal.Open>
                    </div>
                </div>

                <p className={styles?.cardDescription}>
                    {role?.description || "No description provided"}
                </p>

                <div className={styles?.cardMeta}>
                    <span>Created: {formatDate(role?.created_at)}</span>
                    {role?.is_system_role && <span>System Role</span>}
                </div>

                <div className={styles?.accordion}>
                    <div
                        className={styles?.accordionHeader}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span>Permissions ({role?.permissions?.length})</span>
                        <svg
                            className={`${styles?.chevron} ${isOpen ? styles?.chevronOpen : ""}`}
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2.5 4.5L6 8L9.5 4.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {isOpen && (
                        <div className={styles?.accordionContent}>
                            <div className={styles?.permissions}>
                                {role?.permissions?.map((permission, index) => (
                                    <span
                                        key={index}
                                        className={styles?.permissionTag}
                                    >
                                        {permission}
                                    </span>
                                ))}
                                {role?.permissions?.length === 0 && (
                                    <span className={styles?.permissionTag}>
                                        No permissions
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Modal.Window name={`delete-role-${role?.role_id}`}>
                <ConfirmDelete
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                    resourceName={role?.name}
                />
            </Modal.Window>
        </Modal>
    );
}

function RoleList({ selectedRole, setSelectedRole }) {
    const { data: rolesData } = useRoles();
    const roleData = rolesData?.roles ?? [];

    return (
        <div className={styles?.container}>
            <h1 className={styles?.heading}>Role List</h1>
            <div className={styles?.cardGrid}>
                {roleData?.map((role) => (
                    <RoleCard
                        key={role?.role_id}
                        role={role}
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                    />
                ))}
            </div>
        </div>
    );
}

export default RoleList;
