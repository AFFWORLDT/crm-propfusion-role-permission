import { useForm } from "react-hook-form";
import styles from "./CommonInterFace.module.css";
import { useState } from "react";
import { useEffect } from "react";
import useRating from "../../rating/useRating";
import useDeleteTag from "../../rating/useDeleteRating";
import useUpdateRating from "../../rating/useUpdateRatting";
import useCreateRatings from "../../rating/useCreateRating";

function RatingInterface() {
    const { data, error, isLoading } = useRating('leads')
    const { removeRating } = useDeleteTag()
    const { changeRating } = useUpdateRating()
    const [editingRating, setEditingRating] = useState(null);

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

    const handleDelete = async (ratingId) => {
        try {
            await Promise.all([
                removeRating(ratingId),
                changeRating([...data]
                    .filter(r => r.id !== ratingId)
                    .map((rating, index) => ({
                        ...rating,
                        position: index + 1
                    })))
            ]);
        } catch (error) {
            console.error('Error deleting rating:', error);
        }
    };

    const ratings = data?.map(rating => (
        <div
            key={rating.id}
            style={{ border: `1px solid ${rating.color_code}` }}
            className={styles.groupItem}
        >
            <span style={{ marginRight: '10px' }}>{rating?.name}</span>
            <div>
                <img
                    src={'/icons/edit.svg'}
                    alt="Edit"
                    className={styles.editIcon}
                    onClick={() => setEditingRating(rating)}
                />
                <img
                    src={'/icons/delete.svg'}
                    alt="Delete"
                    className={styles.deleteIcon}
                    onClick={() => handleDelete(rating.id)}
                />
            </div>
        </div>
    ));

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div>
                    <h3 className={styles.headerTitle}>Ratings</h3>
                </div>

                <div className={styles.groupsContainer}>
                    {ratings}
                </div>

                <RatingItemForm
                    totalRatingsLength={data?.length || 0}
                    editingRating={editingRating}
                    setEditingRating={setEditingRating}
                />
            </div>
        </div>
    );
}

export default RatingInterface;


const RatingItemForm = ({ totalRatingsLength, editingRating, setEditingRating }) => {
    const { addRatings, isPending } = useCreateRatings()
    const { changeRating, isPending: isUpdating } = useUpdateRating()


    const { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            color_code: '#000',
            name: '',
            rating_type: 'leads',
        }
    })

    useEffect(() => {
        if (editingRating) {
            setValue('color_code', editingRating.color_code);
            setValue('name', editingRating.name);
            setValue('rating_type', editingRating.rating_type);
        }
    }, [editingRating, setValue]);

    const onSubmit = (data) => {
        if (editingRating) {
            const updatedData = {
                ...editingRating,
                ...data
            };

            changeRating([updatedData], {
                onSuccess: () => {
                    reset();
                    setEditingRating(null);
                }
            });
        } else {
            const formData = {
                ...data,
                rating_type: 'leads',
                position: Number(totalRatingsLength) + 1
            }

            addRatings([formData], {
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
                aria-label="Rating color picker"
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
                aria-label="Rating title input"
            />

            <button
                type="submit"
                className={styles.actionButton}
                aria-label={editingRating ? "Update rating" : "Add new rating"}
                disabled={isPending || isUpdating}
            >
                {editingRating ? 'Update Rating' : 'Add Rating'}
            </button>

            {editingRating && (
                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => {
                        setEditingRating(null);
                        reset();
                    }}
                >
                    Cancel
                </button>
            )}
        </form>
    )
}