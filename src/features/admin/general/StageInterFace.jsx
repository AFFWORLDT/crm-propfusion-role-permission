import { useForm } from "react-hook-form";
import useStages from "../../stages/useStages";
import styles from "./CommonInterFace.module.css";
import useCreateStages from "../../stages/useCreateStages";
import useDeleteStages from "../../stages/useDeleteStages";
import useUpdateStages from "../../stages/useUpdateStages";
import { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function StageInterFace() {
    const { data, error, isLoading } = useStages('leads');
    const { removeStage } = useDeleteStages();
    const { changeStages } = useUpdateStages();
    const [editingStage, setEditingStage] = useState(null);
    const [stages, setStages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (data) {
            const sortedStages = [...data].sort((a, b) => a.position - b.position);
            setStages(sortedStages);
        }
    }, [data]);

    const handleDelete = async (stageId) => {
        try {
            await removeStage(stageId);
      
            const filteredStages = stages.filter(s => s.id !== stageId);
   
            const updatedStages = filteredStages.map((stage, index) => ({
                ...stage,
                position: index + 1
            }));
            

            await changeStages(updatedStages);
            
      
            setStages(updatedStages);
        } catch (error) {
            console.error('Error deleting stage:', error);
        }
    };

    const reorderStages = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        return result.map((item, index) => ({
            ...item,
            position: index + 1
        }));
    };

    const onDragStart = (start) => {
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grabbing';
        }
        
        const draggedItem = document.getElementById(`stage-${stages[start.source.index].id}`);
        if (draggedItem) {
            draggedItem.style.transform = `${draggedItem.style.transform} scale(1.02)`;
            draggedItem.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
            draggedItem.style.zIndex = 999;
        }
        
        setIsDragging(true);
        
        document.body.classList.add('dragging-active');
        document.body.style.userSelect = 'none';
    };

    const onDragEnd = async (result) => {
        setIsDragging(false);
        
        // Reset cursor
        if (containerRef.current) {
            containerRef.current.style.cursor = 'default';
        }
        
        // Remove classes from body
        document.body.classList.remove('dragging-active');
        document.body.style.userSelect = '';
        
        const { destination, source } = result;
        
        // If dropped outside droppable area or no movement
        if (!destination || destination.index === source.index) return;
    
        // Create new stage order with updated positions
        const updatedStages = reorderStages(stages, source.index, destination.index);
        
        // Update UI immediately for smooth experience
        setStages(updatedStages);
    
        try {
            // Send all stages with updated positions to server
            await changeStages(updatedStages);
        } catch (error) {
            console.error('Error updating positions:', error);
            // Revert to original order on error
            const originalOrder = [...stages].sort((a, b) => a.position - b.position);
            setStages(originalOrder);
        }
    };

    // Customize how draggable items look while dragging
    const getDraggableStyle = (isDragging, draggableStyle) => ({
        ...draggableStyle,
        transition: isDragging ? 'none' : 'all 0.25s cubic-bezier(0.2, 0, 0.2, 1)',
        transform: isDragging ? `${draggableStyle.transform} scale(1.02)` : draggableStyle.transform,
        boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.15)' : 'none',
        zIndex: isDragging ? 999 : 1,
        opacity: isDragging ? 0.9 : 1,
    });

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
            </div>
        </div>
    );

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div>
                    <h3 className={styles.headerTitle}>Stages</h3>
                    <p className={styles.stageInfo}>Drag items to reorder positions</p>
                </div>

                <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                    <Droppable 
                        droppableId="stages" 
                        direction="vertical" // Changed to vertical
                        // Add custom styles for hover state when dragging over a droppable area
                        renderClone={(provided, snapshot, rubric) => {
                            const stage = stages[rubric.source.index];
                            return (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`${styles.groupItem} ${styles.dragging}`}
                                    style={{
                                        ...provided.draggableProps.style,
                                        border: `1px solid ${stage.color_code}`,
                                        borderLeft: `5px solid ${stage.color_code}`,
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
                                        transform: `${provided.draggableProps.style.transform} scale(1.02)`,
                                        opacity: 0.9,
                                        width: '100%', // Ensure full width in vertical layout
                                    }}
                                >
                                    <span>{stage.name}</span>
                                    <div className={styles.positionBadge}>
                                        {stage.position}
                                    </div>
                                </div>
                            );
                        }}
                    >
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={(el) => {
                                    provided.innerRef(el);
                                    containerRef.current = el;
                                }}
                                className={`${styles.groupsContainer} ${styles.verticalList} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
                                style={{
                                    transition: 'background-color 0.2s ease',
                                    backgroundColor: snapshot.isDraggingOver ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                                    minHeight: '100px', // Ensures the container is always visible
                                }}
                            >
                                {stages.map((stage, index) => {
                                    const dragId = `stage-${stage.id}`;
                                    
                                    return (
                                        <Draggable
                                            key={dragId}
                                            draggableId={dragId}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    id={dragId}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`${styles.groupItem} ${styles.verticalItem} ${snapshot.isDragging ? styles.dragging : ''}`}
                                                    style={getDraggableStyle(snapshot.isDragging, {
                                                        ...provided.draggableProps.style,
                                                        border: `1px solid ${stage.color_code}`,
                                                        borderLeft: `5px solid ${stage.color_code}`,
                                                        width: '100%', // Ensure full width in vertical layout
                                                    })}
                                                >
                                                    {/* Drag handle on left */}
                                                    <div 
                                                        {...provided.dragHandleProps}
                                                        className={styles.dragHandle}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8 6H16M8 12H16M8 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                        </svg>
                                                    </div>
                                                    
                                                    <span>{stage.name}</span>
                                                 
                                                    
                                                    {/* Action buttons on right */}
                                                    <div className={styles.stageActions}>
                                                        <img
                                                            src="/icons/edit.svg"
                                                            alt="Edit"
                                                            className={styles.editIcon}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingStage(stage);
                                                            }}
                                                        />
                                                        <img
                                                            src="/icons/delete.svg"
                                                            alt="Delete"
                                                            className={styles.deleteIcon}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(stage.id);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <StageItemForm
                    totalStagesLength={stages?.length || 0}
                    editingStage={editingStage}
                    setEditingStage={setEditingStage}
                    stages={stages}
                    setStages={setStages}
                />
            </div>
        </div>
    );
}

const StageItemForm = ({ totalStagesLength, editingStage, setEditingStage, stages, setStages }) => {
    const { addStages, isPending } = useCreateStages();
    const { changeStages, isPending: isUpdating } = useUpdateStages();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            color_code: '#000',
            name: '',
            stage_type: 'leads',
        }
    });

    useEffect(() => {
        if (editingStage) {
            setValue('color_code', editingStage.color_code);
            setValue('name', editingStage.name);
            setValue('stage_type', editingStage.stage_type);
        } else {
            reset({
                color_code: '#000',
                name: '',
                stage_type: 'leads',
            });
        }
    }, [editingStage, setValue, reset]);

    const onSubmit = async (data) => {
        try {
            if (editingStage) {
                // Update existing stage
                const updatedStage = {
                    ...editingStage,
                    ...data
                };

                // Update on server
                await changeStages([updatedStage]);
                
                // Update in local state while preserving position
                const updatedStages = stages.map(stage => 
                    stage.id === editingStage.id ? updatedStage : stage
                );
                setStages(updatedStages);
                
                // Reset form
                reset();
                setEditingStage(null);
            } else {
                // Calculate next position
                const nextPosition = Number(totalStagesLength) + 1;
                
                // Create new stage
                const formData = {
                    ...data,
                    position: nextPosition,
                    stage_type: 'leads',
                }

                // Add to server
                const newStage = await addStages([formData]);
                
                // If server returns the new stage(s), add to local state
                if (newStage && newStage.length > 0) {
                    setStages([...stages, ...newStage]);
                }
                
                // Reset form
                reset();
            }
        } catch (error) {
            console.error('Error saving stage:', error);
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
                aria-label="Stage color picker"
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
                aria-label="Stage title input"
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}

            <button
                type="submit"
                className={styles.actionButton}
                aria-label={editingStage ? "Update stage" : "Add new stage"}
                disabled={isPending || isUpdating}
            >
                {editingStage ? 'Update Stage' : 'Add Stage'}
            </button>

            {editingStage && (
                <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => {
                        setEditingStage(null);
                        reset();
                    }}
                >
                    Cancel
                </button>
            )}
        </form>
    )
}

export default StageInterFace;