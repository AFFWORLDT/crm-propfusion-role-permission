import { toast } from "react-toastify";
import { useCreateRole } from "./useCreateRole";
import Modal from "../../../ui/Modal";
import styles from "./AddRole.module.css";
import { useState } from "react";

function AddRole({ roles = [] , onResetRoles}) {
    const { create, isPending } = useCreateRole();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        permissions: [],
    });

    if (roles.length === 0) {
        toast.error("Please select at least one role");
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            permissions: roles,
        };
        create(payload, {
            onSuccess: () => {
                toast.success("Role added successfully");
                onResetRoles();
                setFormData({
                    name: "",
                    description: "",
                    permissions: [],
                });
            },
            onError: (error) => {
                toast.error(error.message || "Failed to add role");
            },
        });
    };

    return (
        <Modal>
            <div>
                <Modal.Open openWindowName="role-form">
                    <button className={"btnSubmit"} type="button">
                        Add Role
                    </button>
                </Modal.Open>

                <Modal.Window name="role-form">
                    <div className={styles.formContainer}>
                        <h2 className={styles.formTitle}>Add New Role</h2>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Role Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter role name"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter role description"
                                    required
                                />
                            </div>
                            <div className={styles.formActions}>
                               
                                <button
                                    type="submit"
                                    className={"btnSubmit"}
                                    disabled={isPending}
                                >
                                    {isPending ? "Adding..." : "Add Role"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal.Window>
            </div>
        </Modal>
    );
}

export default AddRole;
