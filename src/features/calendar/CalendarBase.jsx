import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "./Modal";
import { useMutation } from "@tanstack/react-query";
import { addCalendarTask } from "../../services/apiCalendar";
import toast from "react-hot-toast";
import styles from './Form.module.css'
import EditTaskForm from "./EditTaskForm";
import { useCalendarTask } from "./userGetTaskbyId";
import Spinner from "../../ui/Spinner";
import { useDeleteTask } from "./useDeleteTaskById";
import CustomToolbar from "./CustomToolbar";
import ScheduleView from "./ScheduleView";
const localizer = momentLocalizer(moment);

function CalendarBase({ data, isLoading }) { 
   
    const [events, setEvents] = useState([]); 
    const [open, setOpen] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [selectedDate, setSelectedDate] = useState(null); 
    const [description, setDescription] = useState("");
    const [taskType, setTaskType] = useState("meeting");
    const [selectedTasks, setSelectedTasks] = useState(null) 
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedView, setSelectedView] = useState("month"); 
    // FilterErd Event 
    const [filteredEvents, setFilteredEvents] = useState("");  
    // eslint-disable-next-line no-unused-vars
    const [currentRange, setCurrentRange] = useState(null)

    const { data: task, isError: isTaskError, isLoading: isTaskLoading } = useCalendarTask(selectedTasks?.id);  
    const handleRangeChange = (range) => {
     // Check the structure of the range
    
      if (Array.isArray(range)) {
        // If range is an array (for week and month views)
        setCurrentRange({
          start: range[0], // First date of the range
          end: range[range.length - 1], // Last date of the range
        });
      } else if (range.start && range.end) {
        // For day view, range is an object with 'start' and 'end' properties
        setCurrentRange({
          start: range.start,
          end: range.end,
        });
      }
      
      // You can also filter events based on this range if needed 
    
      setFilteredEvents(range);
    };

    // const handleNavigate = (newDate) => {
    //   filteredEvents(newDate); 
    // };

    useEffect(() => {
        if (data) {
            const mappedEvents = data.map(event => ({
                id: event._id,
                title: event.title,
                start: new Date(event.schedule_date),
                end: new Date(event.schedule_date),
            }));
          
            setEvents(mappedEvents);
        }
    }, [data]);
     
  // Filtered Event 
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Set the range for the default "month" view
    setFilteredEvents({
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    });
  }, []);

    const mutation = useMutation({
        mutationFn: addCalendarTask,
        onSuccess: () => {
            toast.success("Task added successfully");
        },
        onError: (error) => {
            toast.error("Error adding task", {
                duration: 5000,
            });
            console.log(error);

        },
    });

    const handleSelectSlot = (slotInfo) => {
       
        setSelectedDate(slotInfo); 
        setOpen(true);
    };

    const handleEventClick = (event) => {
       
        setSelectedTasks(event)
        setIsViewOpen(true)

    }

    const handleCloseEditDialog = () => {
        setIsViewOpen(false)
        setIsEditMode(false)
        setSelectedTasks(null)
    }

    const deleteTask = useDeleteTask() 

    const handleDeleteEvent = (id) => { 
        console.log("show id ",id) 
        const isConfirmed = window.confirm("Are you sure you want to delete this task?")

        if (isConfirmed) {
            deleteTask.mutate(id)
            setIsViewOpen(false)
            setIsEditMode(false)
            setSelectedTasks(null)
        } else {
            console.log("Task deletion was cancelled.")
        }
    }

    const handleAddEvent = (e) => {
        e.preventDefault();

        if (newEventTitle && selectedDate) {
            const newEvent = {
                title: newEventTitle,
                start: selectedDate.start, 
                end: selectedDate.end,
                allDay: selectedDate.slots.length === 1,
                backgroundColor:
                    taskType === "meeting"
                        ? "#FFA500"
                        : taskType === "call"
                            ? "#008000" // Green for calls
                            : taskType === "task"
                                ? "#FFD700" // Yellow for tasks
                                : "#D3D3D3", // Default color
            };

            const eventData = {
                title: newEventTitle,
                description: description,
                task_type: taskType,
                schedule_date: selectedDate.start.toISOString(),
                timestamp: new Date().toISOString(),
            };

            mutation.mutate(eventData, {
                onSuccess: () => {
                    setEvents([...events, newEvent]);
                    handleCloseDialog();
                },
            });
        }
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setNewEventTitle("");
    };
    const handleEditTask = (updatedTask) => {
        if (updatedTask) {
            setIsEditMode(false)  
            setIsViewOpen(false);
            setSelectedTasks(null);
        }

    }
    if (isLoading) return <div><Spinner type="fullPage" /></div>

    const handleViewChange = (e) => {
        setSelectedView(e.target.value);
    };

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                margin:"10px",
               
            }}>

                <select
                    value={selectedView}
                    onChange={handleViewChange} 
                    className={`${styles.selectContainer}`}
                >
                    <option value="month">Month</option>
                    <option value="week">Week</option> 
                    <option value="day">Day</option> 
                    <option value="schedule">Schedule</option> 
                    
                </select>

            </div> 

            {selectedView === "schedule" ? (
                <ScheduleView 
                events={events} currentCalendar={filteredEvents}
                /> // Render ScheduleView if selected
            ) : (
                <div className={styles.calendarWrapper}> {/* Wrapper for the calendar */}
              <Calendar
              localizer={localizer}
              events={events} 
              startAccessor="start"
              endAccessor="end"
              className={styles.calendarContainer}
              selectable={true}
              defaultDate={new Date()}
              view={selectedView}
              views={["month", "week", "day"]}
             onView={(view) => setSelectedView(view)} 
             onRangeChange={(range) => handleRangeChange(range)}
             onSelectSlot={handleSelectSlot}
            onSelectEvent={handleEventClick} 
           components={{
          toolbar: CustomToolbar,
        }}
    // eslint-disable-next-line no-unused-vars
    eventPropGetter={(event, start, end, isSelected) => {
    // eslint-disable-next-line no-unused-vars
    let newStyle = {
      backgroundColor: "transparent", // Remove default background
      border: "none", // Remove default border
      color: "black", // Default text color
    };

    // Apply custom classes or inline styles
    return {
      className: styles.Customevent, // Apply custom class
    //   style: newStyle, // Apply custom inline styles
    };
  }}
/>

              </div>
            )}

<>
      {open && (
        <Modal isOpen={open} onClose={handleCloseDialog} title="Create Task">
          <form className={styles.modalForm} onSubmit={handleAddEvent}>
            <div className={styles.modalTabs}>
              {['simple_task', 'call', 'meeting'].map((type) => (
                <button 
                  key={type} 
                  type="button"
                  className={`${styles.tab} ${taskType === type ? styles.active : ''}`}
                  onClick={() => setTaskType(type)}
                >
                  {type === 'simple_task' ? 'Task' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
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
                value={selectedDate ? moment(selectedDate.start).format('YYYY-MM-DDTHH:mm') : ''}
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

            <button type="submit" className={styles.submitButton}>
              Add
            </button>
          </form>
        </Modal>
      )}

      {isViewOpen && (
        <Modal isOpen={isViewOpen} onClose={handleCloseEditDialog} title={isEditMode ? 'Edit Task' : 'View Task'}>
          {isTaskLoading ? (
            <div className={styles.modalForm}>
              <Spinner type="70svh" />
            </div>
          ) : isTaskError ? (
            <div className={styles.modalForm}>
              <p>Error loading task details. Please try again.</p>
            </div>
          ) : (
            <div className={styles.modalForm}>
              {isEditMode ? (
                <EditTaskForm taskId={task._id} onEditTask={handleEditTask} />
              ) : (
                <>
                <div className={styles.taskDetails}>
                  <div className={styles.inputGroup}>
                    <h4 className={styles.input}>Title:</h4>
                    <p className={styles.taskTitle}>{task?.title}</p> {/* Use a paragraph for better semantics */}
                  </div>
              
                  <div className={styles.inputGroup}>
                    <h4 className={styles.input}>Description:</h4>
                    <p className={styles.taskDescription}>{task?.description}</p>
                  </div>
              
                  <div className={styles.inputGroup}>
                    <h4 className={styles.input}>Date:</h4>
                    <p className={styles.taskDate}>
                      {moment(task?.schedule_date).format('YYYY-MM-DD HH:mm')}
                    </p>
                  </div>
              
                  <div className={styles.inputGroup}>
                    <h4 className={styles.input}>Type:</h4>
                    <p className={styles.taskType}>
                      {task?.task_type === 'simple_task'
                        ? 'Task'
                        : task?.task_type === 'call'
                        ? 'Call'
                        : task?.task_type === 'meeting'
                        ? 'Meeting'
                        : ''}
                    </p>
                  </div>
                </div>
              
                <div className={styles.buttonGroup}>
                  <button onClick={() => setIsEditMode(true)} className={styles.editButton}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteEvent(task._id)} className={styles.deleteButton}>
                    Delete
                  </button>
                </div>
              </>
              
              )}
            </div>
          )}
        </Modal>
      )}
    </>




        </>
    );
}

export default CalendarBase;
