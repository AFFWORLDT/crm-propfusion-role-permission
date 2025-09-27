import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
} from "../../services/apiCalendar";
import { useCalendarEvent } from "../../features/calendar/useCalanderEvent";
import Cookies from "universal-cookie";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
    parseISO,
    startOfDay,
    endOfDay,
} from "date-fns";
import { useForm, Controller } from "react-hook-form";
import styles from "./CheckInCalendar.module.css";
import { LEAVE_TYPE_OPTIONS } from "../../utils/constants";
import {
    Check,
    Clock,
    Trash2,
    X,
    Calendar,
    Plus,
    RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useMyPermissions } from "../../hooks/useHasPermission";
import PageNotFound from "../PageNotFound";

const cookies = new Cookies();

const ViewTypes = {
    MONTH: "month",
    WEEK: "week",
    DAY: "day",
};

const formatDateToYYYYMMDD = (date) => {
    return format(date, "yyyy-MM-dd");
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent} style={{ maxWidth: "400px" }}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className={styles.modalButtons}>
                    <button
                        onClick={onConfirm}
                        className={styles.submitButton}
                        style={{ backgroundColor: "#f44336" }}
                    >
                        Delete
                    </button>
                    <button onClick={onClose} className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const EventForm = ({
    showEventForm,
    setShowEventForm,
    onSubmit,
    control,
    reset,
    handleSubmit,
    isEditing,
    setIsEditing,
    watch,
}) => {
    const eventType = watch("event_type");
    const { hasPermission } = useMyPermissions();
    // const { currentUser } = useAuth();

    // if (currentUser && !roles.includes(currentUser.role))
    //     return <PageNotFound />;

    return (
        <>
            {showEventForm && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>{isEditing ? "Edit Event" : "New Event"}</h3>
                        <form
                            onSubmit={handleSubmit((data) => {
                                // Filter out empty values before submitting
                                const filteredData = Object.fromEntries(
                                    Object.entries(data).filter(
                                        ([key, value]) => {
                                            // Keep end_date only for leave events
                                            if (key === "end_date") {
                                                return (
                                                    data.event_type ===
                                                        "leave" &&
                                                    value !== "" &&
                                                    value !== null &&
                                                    value !== undefined
                                                );
                                            }
                                            return (
                                                value !== "" &&
                                                value !== null &&
                                                value !== undefined
                                            );
                                        }
                                    )
                                );
                                onSubmit(filteredData);
                            })}
                        >
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        placeholder="Event Title"
                                        required
                                        className={styles.formInput}
                                    />
                                )}
                            />
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="Description"
                                        className={styles.formTextarea}
                                    />
                                )}
                            />
                            <Controller
                                name="event_type"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className={styles.formSelect}
                                    >
                                        <option value="leave">Leave</option>
                                        <option value="request">Request</option>
                                        <option value="report">Report</option>
                                    </select>
                                )}
                            />

                            {eventType === "leave" && (
                                <>
                                    <Controller
                                        name="leave_type"
                                        control={control}
                                        rules={{
                                            required: "Leave type is required",
                                        }}
                                        render={({
                                            field: leaveField,
                                            fieldState: { error },
                                        }) => (
                                            <div>
                                                <select
                                                    {...leaveField}
                                                    className={
                                                        styles.formSelect
                                                    }
                                                >
                                                    <option value="">
                                                        Select Leave Type
                                                    </option>
                                                    {LEAVE_TYPE_OPTIONS.map(
                                                        (option) => (
                                                            <option
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                {error && (
                                                    <div
                                                        style={{
                                                            color: "red",
                                                            fontSize: "11px",
                                                            marginTop: "5px",
                                                            marginLeft: "4px",
                                                        }}
                                                    >
                                                        {error.message}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    />
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "14px",
                                                marginBottom: "4px",
                                                color: "#666",
                                            }}
                                        >
                                            Start Date *
                                        </label>
                                        <Controller
                                            name="schedule_date"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="date"
                                                    required
                                                    className={styles.formInput}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            style={{
                                                display: "block",
                                                fontSize: "14px",
                                                marginBottom: "4px",
                                                color: "#666",
                                            }}
                                        >
                                            End Date
                                        </label>
                                        <Controller
                                            name="end_date"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="datetime-local"
                                                    className={styles.formInput}
                                                />
                                            )}
                                        />
                                    </div>
                                </>
                            )}

                            {eventType !== "leave" && (
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: "14px",
                                            marginBottom: "4px",
                                            color: "#666",
                                        }}
                                    >
                                        Date *
                                    </label>
                                    <Controller
                                        name="schedule_date"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="datetime-local"
                                                required
                                                className={styles.formInput}
                                            />
                                        )}
                                    />
                                </div>
                            )}

                            {(hasPermission("create_events") ||
                                hasPermission("update_events")) && (
                                <div className={styles.modalButtons}>
                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                    >
                                        {isEditing
                                            ? "Update Event"
                                            : "Create Event"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEventForm(false);
                                            setIsEditing(false);
                                            reset();
                                        }}
                                        className={styles.cancelButton}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

const LoadingOverlay = ({ isSubmitting }) => {
    if (!isSubmitting) return null;

    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}>
                <Loader size={40} className={styles.spinnerIcon} />
                <p>Processing...</p>
            </div>
        </div>
    );
};

const getLeaveTypeLabel = (value) => {
    const option = LEAVE_TYPE_OPTIONS.find((opt) => opt.value === value);
    return option ? option.label : value;
};

const EventSidePanel = ({
    selectedDate,
    events,
    isAdmin,
    handleApproveEvent,
    handleEventDeleteClick,
    handleDateClick,
    handleResetSelection,
}) => {
    return (
        <div className={styles.sidePanel}>
            <div className={styles.sidePanelHeader}>
                <div className={styles.headerContent}>
                    <div>
                        {selectedDate ? (
                            <>
                                <h3>{format(selectedDate, "MMMM d, yyyy")}</h3>
                                <span className={styles.eventCount}>
                                    {events.length}{" "}
                                    {events.length === 1 ? "event" : "events"}
                                </span>
                            </>
                        ) : (
                            <>
                                <h3>
                                    Events for {format(new Date(), "MMMM yyyy")}
                                </h3>
                                <span className={styles.eventCount}>
                                    {events.length}{" "}
                                    {events.length === 1 ? "event" : "events"}{" "}
                                    this month
                                </span>
                            </>
                        )}
                    </div>
                    <div className={styles.headerButtons}>
                        {selectedDate && (
                            <button
                                className={styles.resetViewBtn}
                                onClick={handleResetSelection}
                                title="Show all events"
                            >
                                <RefreshCw size={16} />
                            </button>
                        )}
                        {selectedDate && (
                            <button
                                className={styles.addEventBtn}
                                onClick={() => handleDateClick(selectedDate)}
                            >
                                <Plus size={16} />
                                Event
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.sidePanelEvents}>
                {events?.length === 0 ? (
                    <div className={styles.noEvents}>
                        {selectedDate
                            ? "No events for this date"
                            : "No events for this month"}
                    </div>
                ) : (
                    events?.map((event, index) => (
                        <div key={index} className={styles.sidePanelEvent}>
                            <div className={styles.eventHeader}>
                                <div className={styles.eventTitleRow}>
                                    <span className={styles.eventTitle}>
                                        {event.title}
                                    </span>
                                    <span className={styles.eventTime}>
                                        {format(
                                            parseISO(event.schedule_date),
                                            "MMM d, HH:mm"
                                        )}
                                        {event.end_date &&
                                            ` - ${format(parseISO(event.end_date), "MMM d, HH:mm")}`}
                                    </span>
                                </div>

                                <div className={styles.eventTypeContainer}>
                                    {event.event_type === "leave" && (
                                        <>
                                            <span
                                                className={`${styles.eventTypeBadge} ${styles.leaveTypeBadge}`}
                                            >
                                                <Calendar size={12} />
                                                Leave
                                            </span>
                                            <span
                                                className={`${styles.eventTypeBadge} ${styles[`${event.leave_type}Badge`]}`}
                                            >
                                                {getLeaveTypeLabel(
                                                    event.leave_type
                                                )}
                                            </span>
                                        </>
                                    )}

                                    {event.event_type === "leave" && (
                                        <span
                                            className={`${styles.statusBadge} ${
                                                event.approval === null
                                                    ? styles.pendingStatus
                                                    : event.approval === true
                                                      ? styles.approvedStatus
                                                      : styles.rejectedStatus
                                            }`}
                                        >
                                            {event.approval === null && (
                                                <>
                                                    <Clock size={12} />
                                                    Pending
                                                </>
                                            )}
                                            {event.approval === true && (
                                                <>
                                                    <Check size={12} />
                                                    Approved
                                                </>
                                            )}
                                            {event.approval === false && (
                                                <>
                                                    <X size={12} />
                                                    Rejected
                                                </>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {event.description && (
                                <p className={styles.eventDescription}>
                                    {event.description}
                                </p>
                            )}

                            {isAdmin && event?.creator && (
                                <div className={styles.creatorInfo}>
                                    <div className={styles.creatorHeader}>
                                        Created by :
                                    </div>
                                    <div className={styles.creatorDetails}>
                                        {event?.creator?.avatar && (
                                            <img
                                                src={event?.creator?.avatar}
                                                alt={event?.creator?.name}
                                                className={styles.creatorAvatar}
                                            />
                                        )}
                                        <span className={styles.creatorName}>
                                            {event?.creator?.name}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className={styles.eventActions}>
                                {isAdmin && event.event_type === "leave" && (
                                    <div className={styles.approvalButtons}>
                                        <button
                                            className={`${styles.eventActionBtn} ${styles.approveBtn}`}
                                            style={{
                                                backgroundColor:
                                                    event.approval === true
                                                        ? "#e0f2f1"
                                                        : undefined,
                                            }}
                                            onClick={(e) =>
                                                handleApproveEvent(
                                                    event,
                                                    true,
                                                    e
                                                )
                                            }
                                            title="Approve"
                                        >
                                            <Check size={14} />
                                        </button>
                                        <button
                                            className={`${styles.eventActionBtn} ${styles.rejectBtn}`}
                                            style={{
                                                backgroundColor:
                                                    event.approval === false
                                                        ? "#ffebee"
                                                        : undefined,
                                            }}
                                            onClick={(e) =>
                                                handleApproveEvent(
                                                    event,
                                                    false,
                                                    e
                                                )
                                            }
                                            title="Reject"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                                {event.event_type !== "check_in" &&
                                    event.event_type !== "check_out" &&
                                    (event.approval !== true || isAdmin) && (
                                        <button
                                            className={styles.eventDeleteBtn}
                                            onClick={(e) =>
                                                handleEventDeleteClick(event, e)
                                            }
                                            title="Delete event"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const HrCalendar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentDate, setCurrentDate] = useState(() => {
        const fromParam = searchParams.get("schedule_date_from");
        return fromParam ? new Date(fromParam) : new Date();
    });
    const [viewType, setViewType] = useState(ViewTypes.MONTH);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEventId, setCurrentEventId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const queryClient = useQueryClient();

    const { control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            title: "",
            description: "",
            event_type: "leave",
            leave_type: "",
            schedule_date: "",
            end_date: "",
            location: "",
            agent_ids: [],
        },
    });

    const { data: events = [], isLoading } = useCalendarEvent();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const createMutation = useMutation({
        mutationFn: addCalendarEvent,
        onMutate: () => {
            setIsSubmitting(true);
        },
        onSuccess: () => {
            setIsSubmitting(false);
            queryClient.invalidateQueries("events");
        },
        onError: (error) => {
            setIsSubmitting(false);
            console.error("Error creating event:", error);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data, event_type }) => {
            return updateCalendarEvent(id, data, event_type, {
                onSuccess: () => {
                    queryClient.invalidateQueries("events");
                    toast.success("Event updated successfully");
                },
                onError: (error) => {
                    toast.error(
                        error?.response?.data?.detail ||
                            "Failed to update event"
                    );
                },
            });
        },
        onMutate: () => {
            setIsSubmitting(true);
        },
        onSuccess: () => {
            setIsSubmitting(false);
            queryClient.invalidateQueries("events");
        },
        onError: (error) => {
            setIsSubmitting(false);
            console.error("Error updating event:", error);
            toast.error(
                error?.response?.data?.detail || "Failed to update event"
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCalendarEvent,
        onMutate: () => {
            setIsSubmitting(true);
        },
        onSuccess: () => {
            setIsSubmitting(false);
            queryClient.invalidateQueries("events");
        },
        onError: (error) => {
            setIsSubmitting(false);
            console.error("Error deleting event:", error);
            toast.error(
                error?.response?.data?.detail || "Failed to delete event"
            );
        },
    });

    useEffect(() => {
        const lastCheckin = events?.events
            ?.filter((event) => event.event_type === "check_in")
            ?.sort(
                (a, b) => parseISO(b.schedule_date) - parseISO(a.schedule_date)
            )[0];

        const lastCheckout = events?.events
            ?.filter((event) => event.event_type === "check_out")
            ?.sort(
                (a, b) => parseISO(b.schedule_date) - parseISO(a.schedule_date)
            )[0];

        setHasCheckedIn(
            lastCheckin &&
                (!lastCheckout ||
                    parseISO(lastCheckin.schedule_date) >
                        parseISO(lastCheckout.schedule_date))
        );
    }, [events]);

    useEffect(() => {
        const startDate = startOfMonth(currentDate);
        const endDate = endOfMonth(currentDate);

        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set(
                "schedule_date_from",
                formatDateToYYYYMMDD(startDate)
            );
            newParams.set("schedule_date_to", formatDateToYYYYMMDD(endDate));
            return newParams;
        });
    }, [currentDate, setSearchParams]);

    const onSubmit = (data) => {
        // Filter out empty values and handle end_date
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
                // Keep end_date only for leave events
                if (key === "end_date") {
                    return (
                        data.event_type === "leave" &&
                        value !== "" &&
                        value !== null &&
                        value !== undefined
                    );
                }
                return value !== "" && value !== null && value !== undefined;
            })
        );

        const event = {
            ...filteredData,
            agent_ids: String(cookies.get("USER").id),
            schedule_date: filteredData.schedule_date,
        };

        if (isEditing && currentEventId) {
            const existingEvent = events?.events?.find(
                (e) => e._id === currentEventId
            );
            const isMultiDayLeave =
                event.event_type === "leave" && event.end_date;

            // Special handling for multi-day leave events
            if (isMultiDayLeave && existingEvent?.common_event_id) {
                // Get all events with the same common_event_id
                const relatedEvents = events?.events?.filter(
                    (e) => e.common_event_id === existingEvent.common_event_id
                );

                // First, delete all existing related events
                Promise.all(
                    relatedEvents.map((e) => deleteMutation.mutateAsync(e._id))
                )
                    .then(() => {
                        // Then create new events spanning the date range
                        createMultiDayLeaveEvents(event);
                    })
                    .catch((error) => {
                        console.error(
                            "Error updating multi-day events:",
                            error
                        );
                        toast.error("Failed to update multi-day events");
                    });
            } else {
                // Regular single event update
                updateMutation.mutate(
                    {
                        id: currentEventId,
                        data: event,
                        event_type: event.event_type,
                    },
                    {
                        onSuccess: () => {
                            queryClient.invalidateQueries("events");
                            toast.success("Event updated successfully");
                        },
                        onError: (error) => {
                            toast.error(
                                error?.response?.data?.detail ||
                                    "Failed to update event"
                            );
                        },
                    }
                );
            }
        } else {
            // For new events, check if it's a multi-day leave
            if (event.event_type === "leave" && event.end_date) {
                createMultiDayLeaveEvents(event);
            } else {
                // Regular single event creation
                createMutation.mutate(event, {
                    onSuccess: () => {
                        queryClient.invalidateQueries("events");
                        toast.success("Event created successfully");
                    },
                    onError: (error) => {
                        toast.error(
                            error?.response?.data?.detail ||
                                "Failed to create event"
                        );
                    },
                });
            }
        }

        setShowEventForm(false);
        setIsEditing(false);
        setCurrentEventId(null);
        reset();
    };

    // Helper function to create events for each day in a date range
    const createMultiDayLeaveEvents = (event) => {
        const startDate = new Date(event.schedule_date);
        const endDate = new Date(event.end_date);

        // Generate a common ID for all related events
        const commonEventId = Date.now();

        // Show loading state
        setIsSubmitting(true);

        // Create a single event with date range information
        const eventData = {
            ...event,
            common_event_id: commonEventId,
            start_date: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
            end_date: format(endDate, "yyyy-MM-dd'T'HH:mm:ss"),
        };

        // Make a single API call
        createMutation.mutate(eventData, {
            onSuccess: () => {
                setIsSubmitting(false);
                queryClient.invalidateQueries("events");
                toast.success("Leave request created successfully");
            },
            onError: (error) => {
                setIsSubmitting(false);
                console.error("Error creating leave request:", error);
                toast.error(
                    error?.response?.data?.detail ||
                        "Failed to create leave request"
                );
            },
        });
    };

    const handleAction = async (type) => {
        // Create a proper date object with the current datetime
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        // Format the date in the same format that the API uses for recent entries
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        const event = {
            title: type === "check_in" ? "Check-in" : "Check-out",
            description: `Daily ${type}`,
            event_type: type,
            schedule_date: formattedDate,
            agent_ids: String(cookies.get("USER").id),
        };

        try {
            await createMutation.mutateAsync(event);
            setHasCheckedIn(type === "check_in");
            queryClient.invalidateQueries("events");
            toast.success(
                `${type === "check_in" ? "Check-in" : "Check-out"} successful at ${hours}:${minutes}`
            );
        } catch (error) {
            console.error(`${type} failed:`, error);
            toast.error(
                `Failed to ${type === "check_in" ? "check in" : "check out"}`
            );
        }
    };

    const getDaysForView = () => {
        switch (viewType) {
            case ViewTypes.MONTH:
                return eachDayOfInterval({
                    start: startOfMonth(currentDate),
                    end: endOfMonth(currentDate),
                });
            case ViewTypes.WEEK:
                return eachDayOfInterval({
                    start: startOfWeek(currentDate),
                    end: endOfWeek(currentDate),
                });
            case ViewTypes.DAY:
                return [currentDate];
            default:
                return [];
        }
    };

    const getEventsForDay = (day) => {
        const allowedEventTypes = [
            "check_in",
            "check_out",
            "leave",
            "report",
            "request",
        ];

        const dayEvents = [];
        const processedCommonIds = new Set();

        // Get single-day events for this day
        const singleDayEvents =
            events?.events?.filter((event) => {
                try {
                    const eventDate = new Date(event.schedule_date);
                    return (
                        isSameDay(eventDate, day) &&
                        allowedEventTypes.includes(event.event_type) &&
                        (event.event_type !== "leave" ||
                            !event.common_event_id ||
                            !event.end_date)
                    );
                } catch (error) {
                    console.error("Error parsing event date:", error, event);
                    return false;
                }
            }) || [];

        // Add single-day events
        dayEvents.push(...singleDayEvents);

        // Now handle multi-day events
        const multiDayEvents =
            events?.events?.filter((event) => {
                try {
                    return (
                        event.event_type === "leave" &&
                        event.common_event_id &&
                        event.end_date &&
                        !processedCommonIds.has(event.common_event_id)
                    );
                } catch (error) {
                    return false;
                }
            }) || [];

        // Group multi-day events by common_event_id
        multiDayEvents.forEach((event) => {
            if (processedCommonIds.has(event.common_event_id)) return;

            // Find all events with the same common_event_id
            const relatedEvents =
                events?.events?.filter(
                    (e) => e.common_event_id === event.common_event_id
                ) || [];

            // Find the start and end dates of the entire event span
            let startDate, endDate;

            if (event.start_date && event.end_date) {
                // If the event already has start_date and end_date defined directly
                startDate = parseISO(event.start_date);
                endDate = parseISO(event.end_date);
            } else {
                // Otherwise, find the first and last events in the sequence
                relatedEvents.sort(
                    (a, b) =>
                        new Date(a.schedule_date) - new Date(b.schedule_date)
                );
                startDate = parseISO(relatedEvents[0].schedule_date);
                endDate =
                    relatedEvents.length > 1
                        ? parseISO(
                              relatedEvents[relatedEvents.length - 1]
                                  .schedule_date
                          )
                        : parseISO(event.end_date || event.schedule_date);
            }

            // Check if current day is within the date range (inclusive)
            const dayStart = startOfDay(day);
            const dayEnd = endOfDay(day);

            if (
                (dayStart >= startDate && dayStart <= endDate) ||
                (dayEnd >= startDate && dayEnd <= endDate) ||
                (startDate >= dayStart && startDate <= dayEnd) ||
                (endDate >= dayStart && endDate <= dayEnd)
            ) {
                // This day is within the event's range, add it with proper first/middle/last styling
                const eventForThisDay = {
                    ...event,
                    isFirstDay: isSameDay(startDate, day),
                    isLastDay: isSameDay(endDate, day),
                    isMiddleDay:
                        !isSameDay(startDate, day) && !isSameDay(endDate, day),
                };

                dayEvents.push(eventForThisDay);
            }

            processedCommonIds.add(event.common_event_id);
        });

        return dayEvents;
    };

    const getAllEventsInDateRange = () => {
        const startDate = startOfMonth(currentDate);
        const endDate = endOfMonth(currentDate);
        const allowedEventTypes = [
            "check_in",
            "check_out",
            "leave",
            "report",
            "request",
        ];

        // Get all events in the date range
        const allEvents =
            events?.events?.filter((event) => {
                const eventDate = parseISO(event.schedule_date);
                return (
                    eventDate >= startDate &&
                    eventDate <= endDate &&
                    allowedEventTypes.includes(event.event_type)
                );
            }) || [];

        // Group leave events by common_event_id
        const groupedEvents = [];
        const processedCommonIds = new Set();

        // First add all non-leave events
        allEvents.forEach((event) => {
            if (event.event_type !== "leave" || !event.common_event_id) {
                groupedEvents.push(event);
            } else if (
                event.common_event_id &&
                !processedCommonIds.has(event.common_event_id)
            ) {
                // Find all events with this common_event_id
                const relatedEvents = allEvents.filter(
                    (e) => e.common_event_id === event.common_event_id
                );

                // Sort by date to find first and last
                relatedEvents.sort(
                    (a, b) =>
                        new Date(a.schedule_date) - new Date(b.schedule_date)
                );

                // Use the first event as the base
                const firstEvent = relatedEvents[0];
                const lastEvent = relatedEvents[relatedEvents.length - 1];

                // Create a merged event with date range information
                const mergedEvent = {
                    ...firstEvent,
                    end_date: lastEvent.end_date,
                    _relatedEvents: relatedEvents, // Keep reference to all related events
                    dateRange: `${format(parseISO(firstEvent.schedule_date), "MMM d")} - ${format(parseISO(lastEvent.end_date), "MMM d, yyyy")}`,
                };

                groupedEvents.push(mergedEvent);
                processedCommonIds.add(event.common_event_id);
            }
        });

        return groupedEvents;
    };

    const getTodayCheckInTime = () => {
        // First, find all check-in events for today
        const todayCheckins =
            events?.events?.filter(
                (e) =>
                    e.event_type === "check_in" &&
                    isSameDay(parseISO(e.schedule_date), new Date())
            ) || [];

        if (todayCheckins.length === 0) return "No check-in";

        try {
            // Sort by timestamp to get the latest check-in
            todayCheckins.sort((a, b) => {
                const dateA = new Date(a.schedule_date);
                const dateB = new Date(b.schedule_date);
                return dateB - dateA; // Descending order (latest first)
            });

            // Get the latest check-in
            const latestCheckin = todayCheckins[0];

            // Parse the date string (handle both formats with and without milliseconds)
            const eventDate = new Date(latestCheckin.schedule_date);

            // Format to show hours, minutes and seconds
            const hours = String(eventDate.getHours()).padStart(2, "0");
            const minutes = String(eventDate.getMinutes()).padStart(2, "0");
            const seconds = String(eventDate.getSeconds()).padStart(2, "0");

            return `${hours}:${minutes}:${seconds}`;
        } catch (error) {
            console.error("Error parsing check-in time:", error);
            return "Invalid time";
        }
    };
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setIsEditing(false);
        setCurrentEventId(null);
    };

    const handleAddEvent = (date) => {
        // Create date object and adjust for IST
        const selectedDate = new Date(date);
        const now = new Date();

        // Set current time to selected date
        selectedDate.setHours(now.getHours(), now.getMinutes());

        // Format with timezone offset preservation
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const hours = String(selectedDate.getHours()).padStart(2, "0");
        const minutes = String(selectedDate.getMinutes()).padStart(2, "0");

        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

        // Reset form
        reset({
            title: "",
            description: "",
            event_type: "leave",
            leave_type: "",
            schedule_date: formattedDateTime,
            end_date: "",
            location: "",
            agent_ids: String(cookies.get("USER").id),
        });

        setShowEventForm(true);
    };

    const handleEventClick = (event, e) => {
        e.stopPropagation(); // Prevent triggering the day click handler

        // Skip opening the edit form for check-in and check-out events
        if (
            event.event_type === "check_in" ||
            event.event_type === "check_out"
        ) {
            return; // Don't do anything for these event types
        }

        // Prevent non-admins from editing approved events
        if (event.approval === true || event.approval === false) {
            return; // Don't allow editing for approved events unless admin
        }

        setSelectedDate(parseISO(event.schedule_date));
        setIsEditing(true);
        setCurrentEventId(event._id);

        // Format the date for the form
        const eventDate = parseISO(event.schedule_date);
        const year = eventDate.getFullYear();
        const month = String(eventDate.getMonth() + 1).padStart(2, "0");
        const day = String(eventDate.getDate()).padStart(2, "0");
        const hours = String(eventDate.getHours()).padStart(2, "0");
        const minutes = String(eventDate.getMinutes()).padStart(2, "0");

        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

        // Format end date if present (for multi-day events)
        let formattedEndDate = "";
        if (event.end_date) {
            const endDate = parseISO(event.end_date);
            const endYear = endDate.getFullYear();
            const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
            const endDay = String(endDate.getDate()).padStart(2, "0");
            const endHours = String(endDate.getHours()).padStart(2, "0");
            const endMinutes = String(endDate.getMinutes()).padStart(2, "0");

            formattedEndDate = `${endYear}-${endMonth}-${endDay}T${endHours}:${endMinutes}`;
        }

        // Set form values
        reset({
            title: event.title || "",
            description: event.description || "",
            event_type: event.event_type || "leave",
            leave_type: event.leave_type || "",
            schedule_date: formattedDateTime,
            end_date: formattedEndDate,
            location: event.location || "",
            agent_ids: String(event.agent_ids || ""),
            common_event_id: event.common_event_id || null,
        });

        setShowEventForm(true);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (currentEventId) {
            // Get the current event
            const event = events?.events?.find((e) => e._id === currentEventId);

            // If this is part of a multi-day event with common_event_id
            if (event?.common_event_id) {
                const relatedEvents = events?.events?.filter(
                    (e) => e.common_event_id === event.common_event_id
                );

                // Show loading state
                setIsSubmitting(true);

                // Track unique error messages to avoid duplicates
                const errorMessages = new Set();
                let unauthorizedCount = 0;
                let successCount = 0;

                // Delete all related events one by one
                Promise.all(
                    relatedEvents.map((e) =>
                        deleteMutation
                            .mutateAsync(e._id)
                            .then(() => {
                                successCount++;
                                return { success: true };
                            })
                            .catch((error) => {
                                // Check if it's an authorization error
                                const errorDetail =
                                    error?.response?.data?.detail ||
                                    error.message ||
                                    "Failed to delete event";

                                if (
                                    errorDetail.includes("authorized") ||
                                    errorDetail.includes("permission")
                                ) {
                                    unauthorizedCount++;
                                } else {
                                    // Add non-auth errors to our set of unique messages
                                    errorMessages.add(errorDetail);
                                }

                                // Return a resolved promise with error info to continue with other deletions
                                return Promise.resolve({
                                    success: false,
                                    error: errorDetail,
                                });
                            })
                    )
                )
                    .then(() => {
                        setIsSubmitting(false);
                        queryClient.invalidateQueries("events");

                        // Show success message if any succeeded
                        if (successCount > 0) {
                            toast.success(
                                `Successfully deleted ${successCount} of ${relatedEvents.length} events`
                            );
                        }

                        // Show authorization error only once if present
                        if (unauthorizedCount > 0) {
                            toast.error(
                                `Not authorized to delete ${unauthorizedCount} ${unauthorizedCount === 1 ? "event" : "events"}`
                            );
                        }

                        // Show other errors (but only once per unique message)
                        errorMessages.forEach((message) => {
                            toast.error(message);
                        });
                    })
                    .catch((error) => {
                        setIsSubmitting(false);
                        console.error(
                            "Error in batch delete operation:",
                            error
                        );
                        toast.error("Failed to delete events");
                    });
            } else {
                // Delete single event
                setIsSubmitting(true);
                deleteMutation.mutate(currentEventId, {
                    onSuccess: () => {
                        setIsSubmitting(false);
                        queryClient.invalidateQueries("events");
                        toast.success("Event deleted successfully");
                    },
                    onError: (error) => {
                        setIsSubmitting(false);
                        const errorDetail =
                            error?.response?.data?.detail ||
                            error.message ||
                            "Failed to delete event";
                        toast.error(errorDetail);
                    },
                });
            }

            setShowDeleteConfirm(false);
            setShowEventForm(false);
            setIsEditing(false);
            setCurrentEventId(null);
            reset();
        }
    };

    const handleApproveEvent = (event, isApproved, e) => {
        e.stopPropagation();
        setCurrentEventId(event._id);
        setIsSubmitting(true);

        const updatedEvent = {
            approval: isApproved === true ? true : false,
        };

        updateMutation.mutate(
            {
                id: event._id,
                data: updatedEvent,
                event_type: event.event_type,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries("events");
                    toast.success("Event updated successfully");
                },
                onError: (error) => {
                    toast.error(
                        error?.response?.data?.detail ||
                            "Failed to update event"
                    );
                },
            }
        );
    };

    const handleResetSelection = () => {
        setSelectedDate(null);
    };

    const renderDay = (day) => {
        const dayEvents = getEventsForDay(day);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        // Group events by common_event_id for consistent display
        const processedEvents = [];
        const processedCommonIds = new Set();

        dayEvents.forEach((event) => {
            if (event.event_type !== "leave" || !event.common_event_id) {
                processedEvents.push(event);
            } else if (!processedCommonIds.has(event.common_event_id)) {
                // For leave events with common_event_id, get all related events
                const allEvents = events?.events || [];
                const relatedEvents = allEvents.filter(
                    (e) => e.common_event_id === event.common_event_id
                );

                // Sort by date
                relatedEvents.sort(
                    (a, b) =>
                        new Date(a.schedule_date) - new Date(b.schedule_date)
                );

                // Find position of this day in the sequence
                const firstDay = parseISO(relatedEvents[0].schedule_date);
                const lastDay = parseISO(
                    relatedEvents[relatedEvents.length - 1].schedule_date
                );

                // For multi-day events, we need to determine if this is the first, middle, or last day
                const isFirstDay = isSameDay(firstDay, day);
                const isLastDay = isSameDay(lastDay, day);
                const isMiddleDay = !isFirstDay && !isLastDay;

                // Add position info to help with styling
                processedEvents.push({
                    ...event,
                    isFirstDay,
                    isLastDay,
                    isMiddleDay,
                    totalDays: relatedEvents.length,
                    // Only show approval status on the first day
                    showApprovalStatus: isFirstDay,
                });

                processedCommonIds.add(event.common_event_id);
            }
        });

        return (
            <div
                className={`
                    ${styles.dayCell}
                    ${isToday ? styles.today : ""}
                    ${!isCurrentMonth ? styles.otherMonth : ""}
                    ${isSelected ? styles.selected : ""}
                `}
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
            >
                <span className={styles.dayNumber}>{format(day, "d")}</span>
                <div className={styles.eventContainer}>
                    {processedEvents.length > 3 ? (
                        <>
                            {processedEvents.slice(0, 2).map((event, index) => (
                                <EventItem
                                    key={index}
                                    event={event}
                                    handleEventClick={handleEventClick}
                                />
                            ))}
                            <div className={styles.moreEvents}>
                                +{processedEvents.length - 2} more
                            </div>
                        </>
                    ) : (
                        processedEvents.map((event, index) => (
                            <EventItem
                                key={index}
                                event={event}
                                handleEventClick={handleEventClick}
                            />
                        ))
                    )}
                </div>
                <button
                    className={styles.addEventDayButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddEvent(day);
                    }}
                    title="Add event"
                >
                    <Plus size={14} />
                </button>
            </div>
        );
    };

    // New component for rendering individual event items
    const EventItem = ({ event, handleEventClick }) => {
        const eventColor = getEventColor(event.leave_type);

        // Calculate styles based on event properties
        const baseStyles = {
            ...(event.event_type === "leave" && {
                backgroundColor: event.leave_type
                    ? getEventColor(event.leave_type)
                    : "#4285f4",
            }),
        };

        // Add special styles for multi-day events
        if (event.isMiddleDay || event.isLastDay) {
            baseStyles.borderLeft = "none";
        }

        if (event.isMiddleDay || event.isLastDay) {
            baseStyles.backgroundColor = "transparent";
        }

        return (
            <div
                className={`
                    ${styles.event} 
                    ${styles[event.event_type + "Event"]}
                    ${event.event_type === "leave" ? styles.leaveEventWrapper : ""}
                    ${event.event_type === "leave" && event.approval === null ? styles.pendingApproval : ""}
                    ${event.isFirstDay ? styles.firstDayEvent : ""}
                    ${event.isMiddleDay ? styles.middleDayEvent : ""}
                    ${event.isLastDay ? styles.lastDayEvent : ""}
                `}
                title={`${format(parseISO(event.schedule_date), "HH:mm")} ${event.end_date ? `- ${format(parseISO(event.end_date), "HH:mm")}` : ""} - ${event.title}`}
                data-leave-type={event.leave_type || "default"}
                style={baseStyles}
            >
                {(event.isMiddleDay || event.isLastDay) && (
                    <div
                        className={styles.continuationLine}
                        style={{ backgroundColor: eventColor }}
                    />
                )}

                <div
                    className={styles.eventContent}
                    onClick={(e) =>
                        event.event_type !== "check_in" &&
                        event.event_type !== "check_out"
                            ? handleEventClick(event, e)
                            : e.stopPropagation()
                    }
                    style={{
                        cursor:
                            event.event_type === "check_in" ||
                            event.event_type === "check_out"
                                ? "default"
                                : "pointer",
                    }}
                >
                    {event.event_type === "leave" ? (
                        event.isFirstDay ? (
                            <>
                                <span className={styles.leaveTitle}>
                                    {event.title}
                                </span>
                                <div className={styles.leaveTypeContainer}>
                                    <span className={styles.leaveType}>
                                        {getLeaveTypeLabel(event.leave_type)}
                                    </span>
                                    {event.approval === null && (
                                        <div
                                            className={styles.pendingBadge}
                                            style={{
                                                backgroundColor: "#ff9800",
                                            }}
                                            title="Pending Approval"
                                        >
                                            <Clock size={12} />
                                        </div>
                                    )}
                                    {event.approval === true && (
                                        <div
                                            className={styles.pendingBadge}
                                            style={{
                                                backgroundColor: "#4caf50",
                                            }}
                                            title="Approved"
                                        >
                                            <Check size={12} />
                                        </div>
                                    )}
                                    {event.approval === false && (
                                        <div
                                            className={styles.pendingBadge}
                                            style={{
                                                backgroundColor: "#f44336",
                                            }}
                                            title="Rejected"
                                        >
                                            <X size={12} />
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : null // For middle and last days, just show the background continuation
                    ) : (
                        <div className={styles.eventContent}>
                            {event?.title}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderCalendarGrid = () => {
        const days = getDaysForView();

        return (
            <div
                className={`
                    ${styles.calendarGrid}
                    ${viewType === ViewTypes.WEEK ? styles.weekView : ""}
                    ${viewType === ViewTypes.DAY ? styles.dayView : ""}
                `}
            >
                {days.map((day) => renderDay(day))}
            </div>
        );
    };

    const handleDateChange = (direction) => {
        const newDate =
            direction === "next"
                ? addMonths(currentDate, 1)
                : subMonths(currentDate, 1);

        setCurrentDate(newDate);
    };

    const renderDateControls = () => (
        <div className={styles.dateControls}>
            <button
                onClick={() => handleDateChange("prev")}
                className={styles.navButton}
                aria-label="Previous month"
            >
                <span>←</span>
            </button>
            <h2 className={styles.currentDate}>
                {format(currentDate, "MMMM yyyy")}
            </h2>
            <button
                onClick={() => handleDateChange("next")}
                className={styles.navButton}
                aria-label="Next month"
            >
                <span>→</span>
            </button>
        </div>
    );

    const getEventColor = (leaveType) => {
        switch (leaveType) {
            case "annual":
                return "#0d9488"; // teal
            case "sick":
                return "#dc2626"; // red
            case "unpaid":
                return "#6b7280"; // gray
            case "maternity":
                return "#c026d3"; // purple
            case "paternity":
                return "#0284c7"; // blue
            case "bereavement":
                return "#52525b"; // dark gray
            case "other":
                return "#64748b"; // slate
            default: {
                // Generate a consistent color based on leave type string
                const hash = leaveType?.split("").reduce((acc, char) => {
                    return char.charCodeAt(0) + ((acc << 5) - acc);
                }, 0);
                const hue = Math.abs(hash % 360);
                return `hsl(${hue}, 70%, 50%)`;
            }
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            <SectionTop heading="Attendance Calendar">
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
                    activeTab="CALENDAR"
                    navigateTo={() => `/calendar`}
                />
            </SectionTop>

            <div className={styles.calendarLayout}>
                <div className={styles.calendarMain}>
                    <div className={styles.controls}>
                        <div className={styles.viewControls}>
                            {Object.values(ViewTypes).map((view) => (
                                <button
                                    key={view}
                                    className={`${styles.viewButton} ${viewType === view ? styles.activeView : ""}`}
                                    onClick={() => setViewType(view)}
                                >
                                    {view.charAt(0).toUpperCase() +
                                        view.slice(1)}
                                </button>
                            ))}
                        </div>

                        {renderDateControls()}

                        <button
                            className={styles.todayButton}
                            onClick={() => setCurrentDate(new Date())}
                        >
                            Today
                        </button>
                    </div>

                    <div className={styles.actionButtons}>
                        <button
                            className={`${styles.actionButton} ${styles.checkinButton}`}
                            onClick={() => handleAction("check_in")}
                            disabled={hasCheckedIn}
                        >
                            Check In
                        </button>
                        <button
                            className={`${styles.actionButton} ${styles.checkoutButton}`}
                            onClick={() => handleAction("check_out")}
                            disabled={!hasCheckedIn}
                        >
                            Check Out
                        </button>
                    </div>

                    {renderCalendarGrid()}
                </div>

                <EventSidePanel
                    selectedDate={selectedDate}
                    events={
                        selectedDate
                            ? getEventsForDay(selectedDate)
                            : getAllEventsInDateRange()
                    }
                    // isAdmin={isAdmin}
                    handleApproveEvent={handleApproveEvent}
                    handleEventDeleteClick={(event) => {
                        setCurrentEventId(event._id);
                        setShowDeleteConfirm(true);
                    }}
                    handleDateClick={handleDateClick}
                    handleResetSelection={handleResetSelection}
                />
            </div>

            <div className={styles.summary}>
                <div className={styles.summaryHeader}>
                    <h3>Today&apos;s Attendance Summary</h3>
                    <div className={styles.summaryStatus}>
                        {hasCheckedIn ? (
                            <span className={styles.activeStatus}>
                                <Check size={16} />
                                Active
                            </span>
                        ) : (
                            <span className={styles.inactiveStatus}>
                                <Clock size={16} />
                                Not Checked In
                            </span>
                        )}
                    </div>
                </div>
                <div className={styles.summaryContent}>
                    {hasCheckedIn ? (
                        <div className={styles.checkStatus}>
                            <div className={styles.statusItem}>
                                <span className={styles.statusLabel}>
                                    Check-in Time
                                </span>
                                <span className={styles.statusValue}>
                                    <Clock size={14} /> {getTodayCheckInTime()}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.noCheckin}>
                            <Clock size={24} />
                            <p>No check-in recorded for today</p>
                            <button
                                className={styles.checkinButton}
                                onClick={() => handleAction("check_in")}
                            >
                                Check In Now
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <EventForm
                showEventForm={showEventForm}
                setShowEventForm={setShowEventForm}
                onSubmit={onSubmit}
                control={control}
                reset={reset}
                handleSubmit={handleSubmit}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                watch={watch}
                onDelete={handleDeleteClick}
            />

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Event"
                message="Are you sure you want to delete this event? This action cannot be undone."
            />

            <LoadingOverlay isSubmitting={isSubmitting} />
        </div>
    );
};

export default HrCalendar;
