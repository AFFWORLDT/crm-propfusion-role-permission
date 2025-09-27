import { useForm } from "react-hook-form";
import useStaff from "../admin/staff/useStaff";
import styled from "./ViewingFrom.module.css";
import FormInputDataList from "../../ui/FormInputDataList";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { DURATION_OPTIONS, STATUS_OPTIONS } from "../../utils/constants";
import useCreateViewing from "./useCreateViewing";
import useLeads from "../leads/useLeads";
import useUpdateViewing from "./useUpdateViewing";
import { usePropertiesBasics } from "../properties/usePropertiesBasics";
import useAllDetails from "../all-details/useAllDetails";

function ViewingFrom({
    propertyId = null,
    isEditing = false,
    onCloseModal,
    defaultData,
    isPropertyDropdownShow,
}) {
    const { isLoading, data, error } = useStaff();
    const { addViewing, isPending: isCreating } = useCreateViewing();
    const { updateViewing, isPending: isUpdating } = useUpdateViewing();
    const { data: leadData, isLoading: isLeadLoading } = useLeads(
        "RENT",
        propertyId || defaultData?.property_id
    );
    const { properties, loading } = usePropertiesBasics(true);
    const { data: allDetails } = useAllDetails();
    const backgroundColor =   allDetails?.company_settings?.sidebar_color_code || "#020079"
    const getCurrentDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return getCurrentDate();
        // Convert ISO date to YYYY-MM-DD format
        return dateString.split('T')[0];
    };

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const formatTimeForInput = (dateString) => {
        if (!dateString) return getCurrentTime();
        // Extract time from ISO datetime format (e.g., "2025-07-02T01:30:00" -> "01:30")
        const timePart = dateString.split('T')[1];
        if (timePart) {
            return timePart.substring(0, 5); // Get HH:MM
        }
        return getCurrentTime();
    };

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            property_id: propertyId || defaultData?.property_id || null,
            agent_id: isEditing
                ? {
                      label: defaultData?.agent?.name,
                      value: defaultData?.agent?.id,
                  }
                : null,
            viewing_date: formatDateForInput(defaultData?.viewing_date),
            viewing_time: formatTimeForInput(defaultData?.viewing_date),
            duration_minutes: defaultData?.duration_minutes ?? 60,
            notes: defaultData?.notes ?? "",
            client_name: defaultData?.client_name ?? "",
            client_email: defaultData?.client_email ?? "",
            client_phone: defaultData?.client_phone ?? "",
            status: defaultData?.status ?? null,
            lead_id: defaultData?.lead_id ?? null,
        },
    });

    useEffect(() => {
        if (defaultData && isEditing) {
            reset({
                property_id: defaultData.property_id
                    ? defaultData?.property_id
                    : propertyId,
                agent_id: {
                    label: defaultData.agent?.name,
                    value: defaultData.agent_id,
                },
                viewing_date: formatDateForInput(defaultData.viewing_date),
                viewing_time: formatTimeForInput(defaultData.viewing_date),
                duration_minutes: defaultData.duration_minutes
                    ? {
                          label: defaultData.duration_minutes,
                          value: defaultData.duration_minutes,
                      }
                    : 60,
                notes: defaultData.notes,
                client_name: defaultData.client_name,
                client_email: defaultData.client_email,
                client_phone: defaultData.client_phone,
                status: {
                    label: defaultData.status,
                    value: defaultData.status,
                },
                lead_id: defaultData.lead_id ?{
                    label: defaultData.lead.name ,
                    value: defaultData.lead.id,
                }: null,
            });
        }
    }, [defaultData, isEditing, reset  ]);

    const propertyOption = properties?.map((data) => ({
        label: data.title,
        value: data.id,
    }));

    const leadDataOption = leadData?.map((staff) => ({
        label: staff.name,
        value: staff.id,
    }));

    const staffData = data?.map((staff) => ({
        label: staff.name,
        value: staff.id,
    }));

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    const onSubmit = (data) => {
        // Combine date and time into ISO datetime format
        const combineDateAndTime = (date, time) => {
            if (!date || !time) return null;
            return `${date}T${time}:00`;
        };

        const formdata = {
            property_id: defaultData?.property_id
                ? defaultData?.property_id
                : propertyId || data?.property_id?.value,
            agent_id: data.agent_id?.value,
            lead_id: data.lead_id?.value,
            status: data.status?.value,
            duration_minutes: typeof data.duration_minutes === 'object' 
                ? Number(data.duration_minutes?.value) || 60
                : Number(data.duration_minutes) || 60,
            viewing_date: combineDateAndTime(data.viewing_date, data.viewing_time),
            notes: data.notes || "",
            client_name: data.client_name || "",
            client_email: data.client_email || "",
            client_phone: data.client_phone || "",
        };

        if (isEditing && defaultData?.id) {
            updateViewing(
                { viewingId: defaultData?.id, viewingData: formdata },
                {
                    onSettled: () => {
                        onCloseModal?.();
                    },
                }
            );
        } else {
            addViewing(formdata, {
                onSettled: () => {
                    onCloseModal?.();
                },
            });
        }
    };

    if (isLoading && isEditing) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styled.formWrapper}>
            <div className={styled.formHeader}>
                <h2>{isEditing ? "Edit Viewing" : "Schedule Viewing"}</h2>
                <p>
                    {isEditing
                        ? "Update the viewing details below"
                        : "Fill in the details below to schedule a property viewing"}
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                {isPropertyDropdownShow &&  (
                        <FormInputDataList
                            control={control}
                            registerName="property_id"
                            label="Property"
                            data={propertyOption}
                            isDisabled={loading}
                            isLoading={loading}
                            placeholder={"Select Property"}
                        />
                    )}
                </div>
                <div className={styled.formGrid}>
                    
                    <FormInputDataList
                        control={control}
                        registerName="agent_id"
                        label="Agent"
                        data={staffData}
                        isDisabled={isLeadLoading}
                        isLoading={isLeadLoading}
                        placeholder={"Select Agent"}
                    />

                    <FormInputDataList
                        control={control}
                        registerName="lead_id"
                        label="Lead Details"
                        data={leadDataOption}
                        isDisabled={isLoading}
                        isLoading={isLoading}
                        placeholder={"Select Lead"}
                    />

                    <div className={styled.formGroup}>
                        <label htmlFor="viewing_date">Viewing Date</label>
                        <input
                            id="viewing_date"
                            type="date"
                            {...control.register("viewing_date")}
                        />
                    </div>
                    <div className={styled.formGroup}>
                        <label htmlFor="viewing_time">Viewing Time</label>
                        <input
                            id="viewing_time"
                            type="time"
                            {...control.register("viewing_time")}
                        />
                    </div>
                    <FormInputDataList
                        control={control}
                        registerName="duration_minutes"
                        label="Duration (minutes)"
                        data={DURATION_OPTIONS}
                        type="number"
                        placeholder="Select Duration"
                    />
                    <FormInputDataList
                        control={control}
                        registerName="status"
                        label="Status"
                        data={STATUS_OPTIONS}
                        placeholder="Select Status"
                    />
                    <div className={styled.formGroup}>
                        <label htmlFor="client_name">Client Name</label>
                        <input
                            id="client_name"
                            type="text"
                            {...control.register("client_name")}
                            placeholder="Enter client name"
                        />
                    </div>
                    <div className={styled.formGroup}>
                        <label htmlFor="client_email">Client Email</label>
                        <input
                            id="client_email"
                            type="email"
                            {...control.register("client_email")}
                            placeholder="Enter client email"
                        />
                    </div>
                    <div className={styled.formGroup}>
                        <label htmlFor="client_phone">Client Phone</label>
                        <input
                            id="client_phone"
                            type="tel"
                            {...control.register("client_phone")}
                            placeholder="Enter client phone"
                        />
                    </div>
                    <div className={styled.formGroup}>
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            {...control.register("notes")}
                            placeholder="Enter any additional notes"
                            rows={4}
                        />
                    </div>
                </div>
                <div className={styled.buttonContainer}>
                    <button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        style={{
                            backgroundColor: backgroundColor,
                            border: "1px solid gray",
                            padding: "1rem 1.5rem",
                            borderRadius: "0.5rem",
                            color: "white",
                            width: "100%",
                            maxWidth: "300px",
                            margin: "0 auto",
                            fontWeight: "500"
                        }}
                    >
                        {isEditing ? "Update Viewing" : "Save Viewing"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ViewingFrom;

