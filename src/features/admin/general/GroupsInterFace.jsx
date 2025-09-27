import { useForm } from "react-hook-form";
import useGroups from "../../groups/useGroups";
import styles from "./CommonInterFace.module.css";
import useCreateGroups from "../../groups/useCreateGroups";
import useDeleteGroups from "../../groups/useDeleteGroups";
import useUpdateGroups from "../../groups/useUpdateGroups";
import { useState } from "react";
import { useEffect } from "react";

function GroupsInterFace() {
    const { data, error, isLoading } = useGroups('leads')
    const { removeGroup } = useDeleteGroups()
    const { changeGroups } = useUpdateGroups()
    const [editingGroup, setEditingGroup] = useState(null);

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

    const handleDelete = async (groupId) => {
        try {
            await Promise.all([
                removeGroup(groupId),
                changeGroups([...data]
                    .filter(g => g.id !== groupId)
                    .map((group, index) => ({
                        ...group,
                        position: index + 1
                    })))
            ]);
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    const groups = data?.map(group => (
        <div
            key={group.id}
            style={{ border: `1px solid ${group.color_code}` }}
            className={styles.groupItem}
        >
            <span style={{ marginRight: '10px' }}>{group?.name}</span>
            <div>
                <img
                    src={'/icons/edit.svg'}
                    alt="Edit"
                    className={styles.editIcon}
                    onClick={() => setEditingGroup(group)}
                />
                <img
                    src={'/icons/delete.svg'}
                    alt="Delete"
                    className={styles.deleteIcon}
                    onClick={() => handleDelete(group.id)}
                />
            </div>
        </div>
    ));

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div>
                    <h3 className={styles.headerTitle}>Groups</h3>
                </div>

                <div className={styles.groupsContainer}>
                    {groups}
                </div>

                <GroupItemForm
                    totalGroupsLength={data?.length || 0}
                    editingGroup={editingGroup}
                    setEditingGroup={setEditingGroup}
                />
            </div>
        </div>
    );
}

export default GroupsInterFace;


const GroupItemForm = ({ totalGroupsLength, editingGroup, setEditingGroup }) => {
    const { addGroups, isPending } = useCreateGroups()
    const { changeGroups, isPending: isUpdating } = useUpdateGroups()
    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            color_code: '#000',
            name: '',
            group_type: 'leads',
        }
    })

    useEffect(() => {
        if (editingGroup) {
            setValue('color_code', editingGroup.color_code);
            setValue('name', editingGroup.name);
            setValue('group_type', editingGroup.group_type);
        }
    }, [editingGroup, setValue]);

    const onSubmit = (data) => {
        if (editingGroup) {
            const updatedData = {
                ...editingGroup,
                ...data
            };

            changeGroups([updatedData], {
                onSuccess: () => {
                    reset();
                    setEditingGroup(null);
                }
            });
        } else {
            const formData = {
                ...data,
                position: Number(totalGroupsLength) + 1
            }

            addGroups([formData], {
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
                aria-label="Group color picker"
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
                aria-label="Group title input"
            />

            <button
                type="submit"
                className={styles.actionButton}
                aria-label={editingGroup ? "Update group" : "Add new group"}
                disabled={isPending || isUpdating}
            >
                {editingGroup ? 'Update Group' : 'Add Group'}
            </button>

            {editingGroup && (
                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => {
                        setEditingGroup(null);
                        reset();
                    }}
                >
                    Cancel
                </button>
            )}
        </form>
    )
}
