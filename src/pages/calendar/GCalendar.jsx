/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from "./GCalendar.module.css";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    addCalendarEvent,
    deleteCalendarEvent,
    updateCalendarEvent,
} from "../../services/apiCalendar";
import toast from "react-hot-toast";
import useStaff from "../../features/admin/staff/useStaff";
// import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { useGetallGCalendarEvent } from "../../features/gcalendar/useGetallGCalendarEvent";
import { useSearchParams } from "react-router-dom";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useMyPermissions } from "../../hooks/useHasPermission";

const EVENT_COLORS = {
    meeting: "#4285f4",
    reminder: "#fbbc04",
    task: "#34a853",
    call: "#ea4335",
    check_in: "#00bcd4",
    check_out: "#9c27b0",
    leave: "#ff9800",
};

const LEAVE_TYPE_COLORS = {
    annual: "#ff9800",
    sick: "#f44336",
    unpaid: "#9e9e9e",
};

const GCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [viewType, setViewType] = useState("month");
    const [searchTerm, setSearchTerm] = useState("");
    const [showAgentSelector, setShowAgentSelector] = useState(false);
    const { data: agentData } = useStaff();
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        data: gCalendarEvents,
        isLoading,
        error,
    } = useGetallGCalendarEvent(true);
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => {
            return updateCalendarEvent(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries("events");
            toast.success("Event updated successfully");
            setShowEventForm(false);
            setEditingEvent(null);
            reset();
        },
        onError: (error) => {
            console.error("Error updating event:", error);
            toast.error(
                error?.response?.data?.detail || "Failed to update event"
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => {
            return deleteCalendarEvent(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries("events");
            toast.success("Event deleted successfully");
        },
        onError: (error) => {
            console.error("Error deleting event:", error);
            toast.error(
                error?.response?.data?.detail || "Failed to delete event"
            );
        },
    });

    // Update URL params when date changes
    useEffect(() => {
        const startDate = format(startOfMonth(currentDate), "yyyy-MM-dd");
        const endDate = format(endOfMonth(currentDate), "yyyy-MM-dd");
        setSearchParams({
            schedule_date_from: startDate,
            schedule_date_to: endDate,
        });
    }, [currentDate, setSearchParams]);

    // Update events when gCalendarEvents changes
    useEffect(() => {
        if (gCalendarEvents) {
            const formattedEvents = gCalendarEvents.map((event) => ({
                ...event,
                schedule_date: new Date(event.schedule_date),
                end_date: event.end_date ? new Date(event.end_date) : null,
            }));
            setEvents(formattedEvents);
        }
    }, [gCalendarEvents]);

    const filteredAgents = agentData.filter((agent) =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const { control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            title: "",
            description: "",
            event_type: "meeting",
            leave_type: "annual",
            schedule_date: "",
            end_date: "",
            location: "",
            agent_ids: [],
            recurring: "none",
            color: "",
            reminder: "15", // minutes before
        },
    });
    const mutation = useMutation({
        mutationFn: addCalendarEvent,
        onSuccess: () => {
            toast.success("Task added successfully");
            setShowEventForm(false);
            queryClient.invalidateQueries("events");
            reset();
        },
        onError: (error) => {
            toast.error("Error adding task", {
                duration: 5000,
            });
            console.log(error);
        },
    });

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        const daysArray = [];
        for (let i = 0; i < firstDay; i++) {
            daysArray.push(null);
        }

        for (let i = 1; i <= days; i++) {
            daysArray.push(new Date(year, month, i));
        }

        return daysArray;
    };

    const goToPreviousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
        );
    };

    const goToNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
        );
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };
    const handleDateClick = (date) => {
        setSelectedDate(date);

        let formattedDateTime;
        if (viewType === "month") {
            // For month view, set time to 9:00 AM
            const defaultDate = new Date(date);
            defaultDate.setHours(9, 0, 0);
            formattedDateTime = defaultDate.toISOString().slice(0, 16);
        } else {
            // For week/day view, preserve the exact clicked hour and minute
            const clickedHour = Math.floor(date.getHours());
            const clickedMinute = Math.floor(date.getMinutes() / 15) * 15; // Round to nearest 15 minutes

            const exactDate = new Date(date);
            exactDate.setHours(clickedHour, clickedMinute, 0);
            formattedDateTime = exactDate.toISOString().slice(0, 16);
        }

        // Set the datetime value
        setValue("schedule_date", formattedDateTime);

        // Get and set location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude.toFixed(6);
                    const longitude = position.coords.longitude.toFixed(6);
                    const locationString = `${latitude}, ${longitude}`;
                    setValue("location", locationString);

                    // Optional: Reverse geocoding to get address
                    fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            const address = data.display_name;
                            setValue(
                                "location",
                                `${address} (${locationString})`
                            );
                        })
                        .catch((err) => console.log("Geocoding error:", err));
                },
                (error) => console.log("Geolocation error:", error)
            );
        }

        setShowEventForm(true);
    };

    const onSubmit = (data) => {
        const event = {
            ...data,
            agent_ids: data?.agent_ids.join(","),
            schedule_date: data.schedule_date,
            end_date: data.end_date ? data.end_date : null,
            creator: {
                name: "Current User",
                id: 9880,
                avatar: "",
            },
            agents: data.agent_ids.map((id) => ({
                id: parseInt(id),
                name:
                    agentData.find((agent) => agent.id.toString() === id)
                        ?.name || "",
                avatar:
                    agentData.find((agent) => agent.id.toString() === id)
                        ?.avatar || "",
            })),
        };

        if (editingEvent) {
            updateMutation.mutate({
                id: editingEvent.id,
                data: event,
            });
        } else {
            mutation.mutate(event);
        }
    };

    const deleteEvent = (eventId) => {
        if (!eventId) {
            toast.error("Invalid event ID");
            return;
        }
        deleteMutation.mutate(eventId);
    };

    const startEditingEvent = (event) => {
        setEditingEvent(event);
        setValue("title", event?.title);
        setValue("description", event?.description);
        setValue("event_type", event?.event_type);
        // Format the date for datetime-local input
        const eventDate = new Date(event?.schedule_date);
        const formattedDate = eventDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
        setValue("schedule_date", formattedDate);
        setValue("location", event.location);
        // Set the agent_ids from the agents array
        const agentIds =
            event.agents?.map((agent) => agent.id.toString()) || [];
        setValue("agent_ids", agentIds);
        setShowEventForm(true);
    };

    const calculateNewDate = (droppableId) => {
        const [year, month, day] = droppableId.split("-").map(Number);
        return new Date(year, month, day);
    };

    const renderCalendar = () => {
        const days = getDaysInMonth(currentDate);

        return (
            <div className={styles.calendar}>
                <div className={styles.weekdays}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                            <div key={day} className={styles.weekday}>
                                {day}
                            </div>
                        )
                    )}
                </div>

                <div className={styles.days}>
                    {days.map((date, index) => (
                        <div
                            key={index}
                            className={`${styles.day} ${
                                date &&
                                date.toDateString() ===
                                    new Date().toDateString()
                                    ? styles.today
                                    : ""
                            }`}
                            onClick={() => date && handleDateClick(date)}
                        >
                            {date && (
                                <>
                                    <span className={styles.dayNumber}>
                                        {date.getDate()}
                                    </span>
                                    <div className={styles.eventDots}>
                                        {events
                                            .filter((event) => {
                                                const eventDate = new Date(
                                                    event.schedule_date
                                                );
                                                return (
                                                    eventDate.toDateString() ===
                                                    date.toDateString()
                                                );
                                            })
                                            .map((event) => (
                                                <div
                                                    key={event._id}
                                                    className={styles.eventDot}
                                                    style={{
                                                        backgroundColor:
                                                            event.event_type ===
                                                            "leave"
                                                                ? LEAVE_TYPE_COLORS[
                                                                      event
                                                                          .leave_type
                                                                  ] || "#ff9800"
                                                                : EVENT_COLORS[
                                                                      event
                                                                          .event_type
                                                                  ] ||
                                                                  "#4285f4",
                                                    }}
                                                    title={`${event.title} (${event.event_type})`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startEditingEvent(
                                                            event
                                                        );
                                                    }}
                                                />
                                            ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        const timeSlots = Array.from({ length: 24 }, (_, i) => i);
        const days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });

        return (
            <div className={styles.weekView}>
                <div className={styles.weekHeader}>
                    <div className={styles.timeGutter}></div>
                    {days.map((date, index) => (
                        <div
                            key={`day-${index}-${date.toISOString()}`}
                            className={styles.dayColumn}
                        >
                            <div className={styles.dayLabel}>
                                <div className={styles.dayName}>
                                    {date.toLocaleDateString("en-US", {
                                        weekday: "short",
                                    })}
                                </div>
                                <div
                                    className={`${styles.dayNumber} ${
                                        date.toDateString() ===
                                        new Date().toDateString()
                                            ? styles.today
                                            : ""
                                    }`}
                                >
                                    {date.getDate()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.weekGrid}>
                    <div className={styles.timeGutter}>
                        {timeSlots.map((hour) => (
                            <div
                                key={`time-${hour}`}
                                className={styles.timeSlot}
                            >
                                {`${hour}:00`}
                            </div>
                        ))}
                    </div>

                    {days.map((date, dayIndex) => (
                        <div
                            key={`day-${dayIndex}-${date.toISOString()}`}
                            className={styles.dayColumn}
                        >
                            {timeSlots.map((hour) => (
                                <div
                                    key={`cell-${hour}`}
                                    className={styles.timeCell}
                                    onClick={() => {
                                        const newDate = new Date(date);
                                        newDate.setHours(hour);
                                        handleDateClick(newDate);
                                    }}
                                />
                            ))}
                            {events
                                .filter((event) => {
                                    const eventDate = new Date(
                                        event.schedule_date
                                    );
                                    return (
                                        eventDate.toDateString() ===
                                        date.toDateString()
                                    );
                                })
                                .map((event) => (
                                    <div
                                        key={event._id}
                                        className={styles.weekEvent}
                                        style={{
                                            top: `${new Date(event.schedule_date).getHours() * 60 + new Date(event.schedule_date).getMinutes()}px`,
                                            height: "60px",
                                            backgroundColor:
                                                event.event_type === "leave"
                                                    ? LEAVE_TYPE_COLORS[
                                                          event.leave_type
                                                      ] || "#ff9800"
                                                    : EVENT_COLORS[
                                                          event.event_type
                                                      ] || "#4285f4",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startEditingEvent(event);
                                        }}
                                    >
                                        <div className={styles.eventContent}>
                                            <div className={styles.eventTime}>
                                                {new Date(
                                                    event.schedule_date
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                            <div className={styles.eventTitle}>
                                                {event.title}
                                            </div>
                                            <div className={styles.eventType}>
                                                {event.event_type}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        const timeSlots = Array.from({ length: 24 }, (_, i) => i);

        return (
            <div className={styles.dayView}>
                <div className={styles.dayViewHeader}>
                    {currentDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>

                <div className={styles.dayGrid}>
                    <div className={styles.timeGutter}>
                        {timeSlots.map((hour) => (
                            <div
                                key={`time-${hour}`}
                                className={styles.timeSlot}
                            >
                                {`${hour}:00`}
                            </div>
                        ))}
                    </div>

                    <div className={styles.dayContent}>
                        {timeSlots.map((hour) => (
                            <div
                                key={`cell-${hour}`}
                                className={styles.timeCell}
                                onClick={() => {
                                    const newDate = new Date(currentDate);
                                    newDate.setHours(hour);
                                    handleDateClick(newDate);
                                }}
                            />
                        ))}

                        {events
                            .filter((event) => {
                                const eventDate = new Date(event.schedule_date);
                                return (
                                    eventDate.toDateString() ===
                                    currentDate.toDateString()
                                );
                            })
                            .map((event) => (
                                <div
                                    key={event._id}
                                    className={styles.dayEvent}
                                    style={{
                                        top: `${new Date(event.schedule_date).getHours() * 60 + new Date(event.schedule_date).getMinutes()}px`,
                                        height: "60px",
                                        backgroundColor:
                                            event.event_type === "leave"
                                                ? LEAVE_TYPE_COLORS[
                                                      event.leave_type
                                                  ] || "#ff9800"
                                                : EVENT_COLORS[
                                                      event.event_type
                                                  ] || "#4285f4",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startEditingEvent(event);
                                    }}
                                >
                                    <div className={styles.eventContent}>
                                        <div className={styles.eventTime}>
                                            {new Date(
                                                event.schedule_date
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                        <div className={styles.eventTitle}>
                                            {event.title}
                                        </div>
                                        <div className={styles.eventType}>
                                            {event.event_type}
                                        </div>
                                        <div className={styles.eventAgents}>
                                            {event.agents?.map((agent) => (
                                                <div
                                                    key={agent.id}
                                                    className={
                                                        styles.agentAvatar
                                                    }
                                                >
                                                    {agent.avatar ? (
                                                        <img
                                                            src={agent.avatar}
                                                            alt={agent.name}
                                                        />
                                                    ) : (
                                                        agent.name
                                                            .charAt(0)
                                                            .toUpperCase()
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderEventForm = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            placeholder="Event Title"
                            required
                        />
                    )}
                />
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <textarea {...field} placeholder="Description" />
                    )}
                />
                <Controller
                    name="event_type"
                    control={control}
                    render={({ field }) => (
                        <select {...field}>
                            <option value="meeting">Meeting</option>
                            <option value="reminder">Reminder</option>
                            <option value="task">Task</option>
                            <option value="call">Call</option>
                        </select>
                    )}
                />
                {watch("event_type") === "leave" && (
                    <Controller
                        name="leave_type"
                        control={control}
                        render={({ field }) => (
                            <select {...field}>
                                <option value="annual">Annual Leave</option>
                                <option value="sick">Sick Leave</option>
                                <option value="unpaid">Unpaid Leave</option>
                            </select>
                        )}
                    />
                )}
                <Controller
                    name="schedule_date"
                    control={control}
                    render={({ field }) => (
                        <input {...field} type="datetime-local" required />
                    )}
                />
                {watch("event_type") === "leave" && (
                    <Controller
                        name="end_date"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="datetime-local"
                                placeholder="End Date"
                            />
                        )}
                    />
                )}
                <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                        <div className={styles.locationField}>
                            <input
                                {...field}
                                type="text"
                                placeholder="Location (lat, long)"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(
                                            (position) => {
                                                const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
                                                field.onChange(coords);
                                            },
                                            (error) => {
                                                console.log(
                                                    "Geolocation error:",
                                                    error
                                                );
                                            }
                                        );
                                    }
                                }}
                            >
                                Get Current Location
                            </button>
                        </div>
                    )}
                />

                <Controller
                    name="agent_ids"
                    control={control}
                    render={({ field }) => (
                        <div className={styles.agentSelectorWrapper}>
                            <button
                                type="button"
                                className={styles.agentSelectorButton}
                                onClick={() => setShowAgentSelector(true)}
                            >
                                <span className={styles.buttonIcon}>👥</span>
                                Select Agents ({field.value.length} selected)
                            </button>

                            {showAgentSelector && (
                                <div className={styles.agentSelectorModal}>
                                    <div
                                        className={styles.agentSelectorContent}
                                    >
                                        <div className={styles.modalHeader}>
                                            <h3>Select Agents</h3>
                                            <input
                                                type="text"
                                                placeholder="🔍 Search agents..."
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                                className={styles.searchInput}
                                            />
                                        </div>

                                        <div className={styles.agentList}>
                                            {filteredAgents.map((agent) => (
                                                <div
                                                    key={agent.id}
                                                    className={`${styles.agentCard} ${
                                                        field.value.includes(
                                                            agent.id.toString()
                                                        )
                                                            ? styles.selected
                                                            : ""
                                                    }`}
                                                    onClick={() => {
                                                        const newValue =
                                                            field.value.includes(
                                                                agent.id.toString()
                                                            )
                                                                ? field.value.filter(
                                                                      (id) =>
                                                                          id !==
                                                                          agent.id.toString()
                                                                  )
                                                                : [
                                                                      ...field.value,
                                                                      agent.id.toString(),
                                                                  ];
                                                        field.onChange(
                                                            newValue
                                                        );
                                                    }}
                                                >
                                                    <div
                                                        className={
                                                            styles.agentAvatar
                                                        }
                                                    >
                                                        {agent?.avatar !==
                                                        "" ? (
                                                            <img
                                                                src={
                                                                    agent?.avatar
                                                                }
                                                            />
                                                        ) : (
                                                            agent.name
                                                                .charAt(0)
                                                                .toUpperCase()
                                                        )}
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.agentInfo
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                styles.agentName
                                                            }
                                                        >
                                                            {agent.name}
                                                        </span>
                                                    </div>
                                                    {field.value.includes(
                                                        agent.id.toString()
                                                    ) && (
                                                        <span
                                                            className={
                                                                styles.checkmark
                                                            }
                                                        >
                                                            ✓
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className={styles.modalFooter}>
                                            <button
                                                type="button"
                                                className={styles.doneButton}
                                                onClick={() =>
                                                    setShowAgentSelector(false)
                                                }
                                            >
                                                Done ({field.value.length}{" "}
                                                selected)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                />
                <div className={styles.modalButtons}>
                    <button type="submit">
                        {editingEvent ? "Update Event" : "Create Event"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowEventForm(false);
                            setEditingEvent(null);
                            reset();
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        );
    };
    const { hasPermission } = useMyPermissions();

    return (
        <div className="sectionContainer">
            <SectionTop heading="Calendar">
                <TabBar
                    tabs={[
                        {
                            id: "CALENDAR",
                            label: "Calendar",
                            bgColor: "#f0f7ff",
                            fontColor: "#4d94ff",
                            path: "/calendar",
                        },
                    ]}
                    activeTab={"CALENDAR"}
                    navigateTo={() => `/calendar`}
                />
            </SectionTop>

            <section className="sectionStyles">
                {isLoading && (
                    <div className={styles.loadingContainer}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading calendar events...</p>
                    </div>
                )}

                {error && (
                    <div className={styles.errorContainer}>
                        <p className={styles.errorMessage}>
                            Error loading calendar:{" "}
                            {error.message || "Failed to load calendar events"}
                        </p>
                        <button
                            onClick={() =>
                                queryClient.invalidateQueries("events")
                            }
                            className={styles.retryButton}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!isLoading && !error && (
                    <div className={styles.calendarContainer}>
                        <div className={styles.calendarHeader}>
                            <div className={styles.calendarControls}>
                                <button onClick={goToPreviousMonth}>
                                    &lt;
                                </button>
                                <h2>
                                    {currentDate.toLocaleString("default", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </h2>
                                <button onClick={goToNextMonth}>&gt;</button>
                            </div>
                            <div className={styles.viewControls}>
                                <select
                                    value={viewType}
                                    onChange={(e) =>
                                        setViewType(e.target.value)
                                    }
                                    className={styles.viewSelect}
                                >
                                    <option value="month">Month</option>
                                    <option value="week">Week</option>
                                    <option value="day">Day</option>
                                </select>
                                <button
                                    onClick={goToToday}
                                    className={styles.todayButton}
                                >
                                    Today
                                </button>
                            </div>
                        </div>

                        {viewType === "month" && renderCalendar()}
                        {viewType === "week" && renderWeekView()}
                        {viewType === "day" && renderDayView()}

                        {showEventForm &&
                            (hasPermission("create_events") ||
                                hasPermission("update_events")) && (
                                <div className={styles.modal}>
                                    <div className={styles.modalContent}>
                                        <h3>
                                            {editingEvent
                                                ? "Edit Event"
                                                : "New Event"}
                                        </h3>
                                        {renderEventForm()}
                                    </div>
                                </div>
                            )}

                        <div
                            className={styles.eventList}
                            style={{ maxHeight: "400px", overflowY: "auto" }}
                        >
                            <h3>Upcoming Events</h3>
                            {events
                                .filter(
                                    (event) =>
                                        !["leave"].includes(event.event_type)
                                )
                                .sort(
                                    (a, b) =>
                                        new Date(a.schedule_date) -
                                        new Date(b.schedule_date)
                                )
                                .map((event) => (
                                    <div
                                        key={event._id}
                                        className={styles.eventItem}
                                    >
                                        <div className={styles.eventInfo}>
                                            <h4>{event.title}</h4>
                                            <p>
                                                {new Date(
                                                    event?.schedule_date
                                                ).toLocaleString()}
                                            </p>
                                            <p
                                                className={`${styles.eventType} ${
                                                    event.event_type ===
                                                    "check_in"
                                                        ? styles.checkInType
                                                        : event.event_type ===
                                                            "check_out"
                                                          ? styles.checkOutType
                                                          : ""
                                                }`}
                                            >
                                                {event.event_type === "check_in"
                                                    ? "🟢 Check In"
                                                    : event.event_type ===
                                                        "check_out"
                                                      ? "🔴 Check Out"
                                                      : `Type: ${event.event_type}`}
                                            </p>
                                            {event.location && (
                                                <p>
                                                    Location: {event.location}
                                                </p>
                                            )}
                                            <div className={styles.eventAgents}>
                                                <div
                                                    className={
                                                        styles.agentAvatars
                                                    }
                                                >
                                                    {event.agents?.map(
                                                        (agent) => (
                                                            <div
                                                                key={agent.id}
                                                                className={
                                                                    styles.agentAvatarWrapper
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        styles.agentAvatar
                                                                    }
                                                                >
                                                                    {agent.avatar ? (
                                                                        <img
                                                                            src={
                                                                                agent.avatar
                                                                            }
                                                                            alt={
                                                                                agent.name
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        agent.name
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()
                                                                    )}
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles.agentTooltip
                                                                    }
                                                                >
                                                                    {agent.name}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.eventActions}>
                                            <button
                                                onClick={() =>
                                                    startEditingEvent(event)
                                                }
                                            >
                                                Edit
                                            </button>

                                            {hasPermission("delete_events") && (
                                                <button
                                                    onClick={() =>
                                                        deleteEvent(event.id)
                                                    }
                                                    disabled={
                                                        deleteMutation.isPending ||
                                                        !hasPermission(
                                                            "delete_events"
                                                        )
                                                    }
                                                >
                                                    {"Delete"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default GCalendar;
