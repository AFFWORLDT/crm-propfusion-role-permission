import { useForm } from "react-hook-form";
import styles from "./CommonInterFace.module.css";
import { useState } from "react";
import { useEffect } from "react";
import useDeleteStatus from "../../status/useDeleteStatus";
import useStatus from "../../status/useStatus";
import useUpdateStatus from "../../status/useUpdateStatus";
import useCreateStatus from "../../status/useCreateStatus";

function StatusInterFace() {
    const { data, error, isLoading } = useStatus('leads')
    const { removeStatus } = useDeleteStatus()
    const { changeStatus } = useUpdateStatus()
    const [editingStatus, setEditingStatus] = useState(null);

    if (isLoading) return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div>
                    <h3 className={styles.headerTitle} style={{ background: '#333', width: '150px', height: '30px' }}></h3>
                </div>
                <div className={styles.groupsContainer}>
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className={styles.groupItem}
                            style={{ background: '#333', width: '100px', height: '20px' }}
                        ></div>
                    ))}
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.colorPicker} style={{ background: '#333' }}></div>
                    <div className={styles.textInput} style={{ background: '#333', height: '40px' }}></div>
                    <div className={styles.actionButton} style={{ background: '#333' }}></div>
                </div>
            </div>
        </div>
    )
    if (error) return <div>Error: {error.message}</div>

    const handleDelete = async (statusId) => {
        try {
            await Promise.all([
                removeStatus(statusId),
                changeStatus([...data]
                    .filter(s => s.id !== statusId)
                    .map((status, index) => ({
                        ...status,
                        position: index + 1
                    })))
            ]);
        } catch (error) {
            console.error('Error deleting status:', error);
        }
    };

    const statuses = data?.map(status => (
        <div
            key={status.id}
            style={{ border: `1px solid ${status.color_code}` }}
            className={styles.groupItem}
        >
            <span style={{ marginRight: '10px' }}>{status?.name}</span>
            <div>
                <img
                    src={'/icons/edit.svg'}
                    alt="Edit"
                    className={styles.editIcon}
                    onClick={() => setEditingStatus(status)}
                />
                <img
                    src={'/icons/delete.svg'}
                    alt="Delete"
                    className={styles.deleteIcon}
                    onClick={() => handleDelete(status.id)}
                />
            </div>
        </div>
    ));

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div>
                    <h3 className={styles.headerTitle}>Statues</h3>
                </div>

                <div className={styles.groupsContainer}>
                    {statuses}
                </div>

                <StatusItemForm
                    totalStatuesLength={data?.length || 0}
                    editingStatus={editingStatus}
                    setEditingStatus={setEditingStatus}
                />
            </div>
        </div>
    );
}

export default StatusInterFace;


const StatusItemForm = ({ totalStatuesLength, editingStatus, setEditingStatus }) => {
    const { addStatus, isPending } = useCreateStatus()
    const { changeStatus, isPending: isUpdating } = useUpdateStatus()


    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            color_code: '#000',
            name: '',
            status_type: 'leads',
        }
    })

    useEffect(() => {
        if (editingStatus) {
            setValue('color_code', editingStatus.color_code);
            setValue('name', editingStatus.name);
            setValue('status_type', editingStatus.status_type);
        }
    }, [editingStatus, setValue]);

    const onSubmit = (data) => {
        if (editingStatus) {
            const updatedData = {
                ...editingStatus,
                ...data
            };

            changeStatus([updatedData], {
                onSuccess: () => {
                    reset();
                    setEditingStatus(null);
                }
            });
        } else {
            const formData = {
                ...data,
                status_type: 'leads',
                position: Number(totalStatuesLength) + 1
            }

            addStatus([formData], {
                onSuccess: () => {
                    reset()
                }
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.headerActions}>
            <input
                {...register('color_code', {
                    required: 'Color is required'
                })}
                type="color"
                className={styles.colorPicker}
                aria-label="Status color picker"
            />
            <input
                {...register('name', {
                    required: 'Name is required',
                    minLength: {
                        value: 3,
                        message: 'Name must be at least 3 characters'
                    },
                    maxLength: {
                        value: 50,
                        message: 'Name must be less than 50 characters'
                    }
                })}
                type="text"
                placeholder="Title"
                className={styles.textInput}
                aria-label="Status title input"
            />

            <button
                type="submit"
                className={styles.actionButton}
                aria-label={editingStatus ? "Update status" : "Add new status"}
                disabled={isPending || isUpdating}
            >
                {editingStatus ? 'Update Status' : 'Add Status'}
            </button>

            {editingStatus && (
                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => {
                        setEditingStatus(null);
                        reset();
                    }}
                >
                    Cancel
                </button>
            )}
        </form>
    )
}