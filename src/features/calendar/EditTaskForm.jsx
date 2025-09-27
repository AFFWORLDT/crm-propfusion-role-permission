import { useEffect, useState } from 'react';
import { useCalendarTask } from './userGetTaskbyId';
import styles from './Form.module.css';
import Spinner from '../../ui/Spinner';
import moment from 'moment';
import { useUpdateTask } from './useUpdateTask';

function EditTaskForm({ taskId, onEditTask }) {
    const [newEventTitle, setNewEventTitle] = useState(""); 
    const [selectedDate, setSelectedDate] = useState(null);
    const [description, setDescription] = useState("");
    const [taskType, setTaskType] = useState("meeting");   

    const { data, isError, isLoading } = useCalendarTask(taskId);

    useEffect(() => { 
        if (data) {
            setNewEventTitle(data?.title || ""); 
            setSelectedDate({ start: new Date(data?.schedule_date) }); 
            setDescription(data?.description || "");
            setTaskType(data?.task_type || "meeting");
        }
    }, [data]);

    const mutation = useUpdateTask(onEditTask);

    if (isLoading) return <div className={styles.modalForm}><Spinner type="70svh" /></div>;

    if (isError) {
        return <div>Error loading task data</div>;
    }

    const handleEditEvent = (e) => {
        e.preventDefault();
        const updatedTask = {
            title: newEventTitle,
            description,
            task_type: taskType,
            schedule_date: selectedDate?.start.toISOString(),
        };
        mutation.mutate({ taskId, updatedTask });
    };

    return (
        <div>
            <form className={styles.modalForm} onSubmit={handleEditEvent}>
                <div className={styles.modalTabs}>
                    <button
                        type="button"
                        className={`${styles.tab} ${taskType === 'simple_task' && styles.active}`}
                        onClick={() => setTaskType('simple_task')}
                    >
                        Task
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${taskType === 'call' && styles.active}`}
                        onClick={() => setTaskType('call')}
                    >
                        Calling
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${taskType === 'meeting' && styles.active}`}
                        onClick={() => setTaskType('meeting')}
                    >
                        Meeting
                    </button>
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Title"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="datetime-local"
                        className={styles.input}
                        value={selectedDate ? moment(selectedDate.start).format("YYYY-MM-DDTHH:mm") : ""}
                        onChange={(e) => setSelectedDate({ ...selectedDate, start: new Date(e.target.value) })}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <textarea
                        className={styles.textarea}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                <button type="submit" className={styles.submitButton} disabled={mutation.isLoading}>Edit Task</button>
            </form>
        </div>
    );
}

export default EditTaskForm;
