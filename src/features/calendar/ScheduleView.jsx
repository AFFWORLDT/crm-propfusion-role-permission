import  { useState } from 'react';
// import { Table, Button,} from 'react-bootstrap';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "./Modal";
import EditTaskForm from './EditTaskForm';
import { useDeleteTask } from './useDeleteTaskById';

const ScheduleView = ({ events,currentCalendar }) => {
 
  const deleteTask = useDeleteTask();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // State for filtering
  const [startDate,] = useState(moment(currentCalendar.start).format('YYYY-MM-DD'));
  const [endDate,] = useState(moment(currentCalendar.end).format('YYYY-MM-DD'));  

  // Handle date change for filters
 

  // Filter the events based on selected date range
  const filteredEvents = events.filter((event) => {
    const eventStart = moment(event.start).format('YYYY-MM-DD');
   
    const isWithinRange = 
      (!startDate || eventStart >= startDate) && 
      (!endDate || eventStart <= endDate);
    return isWithinRange;
  });

  


  const handleCloseEditDialog = () => {
    setIsViewOpen(false);
    setIsEditMode(false);
    setSelectedTask(null);
  };

  const handleEditTask = (updatedTask) => {
    if (updatedTask) {
      setIsEditMode(false);
      setIsViewOpen(false);
      setSelectedTask(null);
    }
  };

  const handleDeleteEvent = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
    if (isConfirmed) {
      deleteTask.mutate(id);
      setIsViewOpen(false);
      setIsEditMode(false);
      setSelectedTask(null);
    } else {
      console.log("Task deletion was cancelled.");
    }
  };

  return (
    <>
      <div>
        <h2>Scheduled Tasks</h2>

        {/* Date range filter form */}
        {/* <Form className="mb-3">
          <Form.Group controlId="startDate" className="mr-2">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
            />
          </Form.Group>
          <Form.Group controlId="endDate" className="mr-2">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
            />
          </Form.Group>
        </Form> */}

        {/* Task table */}
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{moment(event.start).format('YYYY-MM-DD HH:mm')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{moment(event.end).format('YYYY-MM-DD HH:mm')}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                        onClick={() => (setSelectedTask(event), setIsViewOpen(true), setIsEditMode(true))}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center px-6 py-4">No tasks found for the selected date range.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for editing tasks */}
      {isViewOpen && (
        <Modal isOpen={isViewOpen} onClose={handleCloseEditDialog} title={isEditMode ? "Edit Task" : "View Task"}>
          {isEditMode && (
            <EditTaskForm taskId={selectedTask.id} onEditTask={handleEditTask} />
          )}
        </Modal>
      )}
    </>
  );
};

export default ScheduleView;
