import { useForm } from "react-hook-form";
import styles from "./kpiForm.module.css";
import { useCreateKpi } from "./useCreateKpi";
import { useUpdateKpi } from "./useUpdateKpi";
import { useState } from "react";
import useAllDetails from "../all-details/useAllDetails";

function KpiForm({ kpiToEdit, onCloseModal }) {
    const [currentStep, setCurrentStep] = useState(1);

    const { addKpi, isPending: isCreating } = useCreateKpi();
    const { updateKpi, isPending: isUpdating } = useUpdateKpi();
    const { data } = useAllDetails();

    const bgColor = data?.company_settings?.sidebar_color_code || "#020079";

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: kpiToEdit
            ? {
                  agent_id: kpiToEdit.agent_id,
                  submission_date: kpiToEdit.submission_date,
                  leads_generated: kpiToEdit.leads_generated,
                  calls_made: kpiToEdit.calls_made,
                  meetings_scheduled: kpiToEdit.meetings_scheduled,
                  property_viewings: kpiToEdit.property_viewings,
                  offers_made: kpiToEdit.offers_made,
                  deals_closed: kpiToEdit.deals_closed,
                  client_followups: kpiToEdit.client_followups,
                  followup_details: kpiToEdit.followup_details,
                  total_calls: kpiToEdit.total_calls,
                  connected_calls: kpiToEdit.connected_calls,
                  followups_scheduled: kpiToEdit.followups_scheduled,
                  meeting_status: {
                      with_agents:
                          kpiToEdit.meeting_status?.with_agents || false,
                      with_management:
                          kpiToEdit.meeting_status?.with_management || false,
                      property_hunting:
                          kpiToEdit.meeting_status?.property_hunting || false,
                  },
                  broadcast_metrics: {
                      sellers_added:
                          kpiToEdit.broadcast_metrics?.sellers_added || 0,
                      buyers_added:
                          kpiToEdit.broadcast_metrics?.buyers_added || 0,
                      agents_added:
                          kpiToEdit.broadcast_metrics?.agents_added || 0,
                  },
                  new_listings_added: kpiToEdit.new_listings_added,
                  notes: kpiToEdit.notes,
              }
            : {
                  agent_id: null,
                  submission_date: new Date().toISOString().split("T")[0],
                  leads_generated: 0,
                  calls_made: 0,
                  meetings_scheduled: 0,
                  property_viewings: 0,
                  offers_made: 0,
                  deals_closed: 0,
                  client_followups: 0,
                  followup_details: "",
                  total_calls: 0,
                  connected_calls: 0,
                  followups_scheduled: 0,
                  meeting_status: {
                      with_agents: false,
                      with_management: false,
                      property_hunting: false,
                  },
                  broadcast_metrics: {
                      sellers_added: 0,
                      buyers_added: 0,
                      agents_added: 0,
                  },
                  new_listings_added: 0,
                  notes: "",
              },
    });

    const onSubmit = (data) => {
        const formData = {
            ...data,
            agent_id: data?.agent_id?.value || data?.agent_id,
            submission_date: new Date().toISOString().split("T")[0],
        };

        if (kpiToEdit) {
            updateKpi(
                { id: kpiToEdit.id, data: formData },
                {
                    onSettled: () => {
                        onCloseModal();
                    },
                }
            );
        } else {
            addKpi(formData,{
                onSettled:()=>{
                    onCloseModal();

                }
            });
        }
        reset();
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const renderStep1 = () => (
        <>
            <h2 className={styles.sectionTitle}>Basic Activity Metrics</h2>
            <div className={styles.formGrid}>
                {[
                    {
                        field: "leads_generated",
                        placeholder: "Enter number of leads generated",
                    },
                    {
                        field: "calls_made",
                        placeholder: "Enter number of calls made",
                    },
                    {
                        field: "meetings_scheduled",
                        placeholder: "Enter number of meetings scheduled",
                    },
                    {
                        field: "property_viewings",
                        placeholder: "Enter number of property viewings",
                    },
                ].map(({ field, placeholder }) => (
                    <div className={styles.inputGroup} key={field}>
                        <label className={styles.inputLabel} htmlFor={field}>
                            {field
                                .split("_")
                                .map(
                                    (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                )
                                .join(" ")}
                        </label>
                        <input
                            id={field}
                            type="number"
                            className={styles.inputField}
                            placeholder={placeholder}
                            {...register(field, {
                                required: `${field} is required`,
                            })}
                        />
                        {errors[field] && (
                            <span className={styles.errorText}>
                                {errors[field].message}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </>
    );

    const renderStep2 = () => (
        <>
            <h2 className={styles.sectionTitle}>Advanced Activity Metrics</h2>
            <div className={styles.formGrid}>
                {[
                    {
                        field: "offers_made",
                        placeholder: "Enter number of offers made",
                    },
                    {
                        field: "deals_closed",
                        placeholder: "Enter number of deals closed",
                    },
                    {
                        field: "client_followups",
                        placeholder: "Enter number of client followups",
                    },
                    {
                        field: "total_calls",
                        placeholder: "Enter total number of calls",
                    },
                    {
                        field: "connected_calls",
                        placeholder: "Enter number of connected calls",
                    },
                    {
                        field: "followups_scheduled",
                        placeholder: "Enter number of followups scheduled",
                    },
                    {
                        field: "new_listings_added",
                        placeholder: "Enter number of new listings",
                    },
                ].map(({ field, placeholder }) => (
                    <div className={styles.inputGroup} key={field}>
                        <label className={styles.inputLabel} htmlFor={field}>
                            {field
                                .split("_")
                                .map(
                                    (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                )
                                .join(" ")}
                        </label>
                        <input
                            id={field}
                            type="number"
                            className={styles.inputField}
                            placeholder={placeholder}
                            {...register(field, {
                                required: `${field} is required`,
                            })}
                        />
                        {errors[field] && (
                            <span className={styles.errorText}>
                                {errors[field].message}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </>
    );

    const renderStep3 = () => (
        <>
            <h2 className={styles.sectionTitle}>
                Meeting Status & Broadcast Metrics
            </h2>
            <div className={styles.formGrid}>
                <div className={styles.checkboxGroup}>
                    {["with_agents", "with_management", "property_hunting"].map(
                        (field) => (
                            <label key={field} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    className={styles.checkboxInput}
                                    {...register(`meeting_status.${field}`)}
                                />
                                {field
                                    .split("_")
                                    .map(
                                        (word) =>
                                            word.charAt(0).toUpperCase() +
                                            word.slice(1)
                                    )
                                    .join(" ")}
                            </label>
                        )
                    )}
                </div>

                {[
                    {
                        field: "sellers_added",
                        placeholder: "Enter number of sellers added",
                    },
                    {
                        field: "buyers_added",
                        placeholder: "Enter number of buyers added",
                    },
                    {
                        field: "agents_added",
                        placeholder: "Enter number of agents added",
                    },
                ].map(({ field, placeholder }) => (
                    <div className={styles.inputGroup} key={field}>
                        <label className={styles.inputLabel} htmlFor={field}>
                            {field
                                .split("_")
                                .map(
                                    (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                )
                                .join(" ")}
                        </label>
                        <input
                            id={field}
                            type="number"
                            className={styles.inputField}
                            placeholder={placeholder}
                            {...register(`broadcast_metrics.${field}`, {
                                required: `${field} is required`,
                            })}
                        />
                        {errors.broadcast_metrics?.[field] && (
                            <span className={styles.errorText}>
                                {errors.broadcast_metrics[field].message}
                            </span>
                        )}
                    </div>
                ))}

                <div
                    className={styles.inputGroup}
                    style={{ gridColumn: "span 6" }}
                >
                    <label
                        className={styles.inputLabel}
                        htmlFor="followup_details"
                    >
                        Followup Details
                    </label>
                    <textarea
                        id="followup_details"
                        className={styles.textarea}
                        placeholder="Enter details about client followups..."
                        {...register("followup_details")}
                    />
                </div>

                <div
                    className={styles.inputGroup}
                    style={{ gridColumn: "span 6" }}
                >
                    <label className={styles.inputLabel} htmlFor="notes">
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        className={styles.textarea}
                        placeholder="Enter any additional notes..."
                        {...register("notes")}
                    />
                </div>
            </div>
        </>
    );

    return (
        <div className={styles.formWrapper} style={{ "--bg-color": bgColor }}>
            <h1 className={styles.formTitle}>
                {kpiToEdit ? "Edit KPI" : "KPI Submission Form"} - Step{" "}
                {currentStep} of 3
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.formContainer}>
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    <div className={styles.buttonGroup}>
                        {currentStep > 1 && (
                            <button
                                type="button"
                                className={styles.navigationButton}
                                onClick={prevStep}
                            >
                                Previous
                            </button>
                        )}
                        {currentStep < 3 ? (
                            <button
                                type="button"
                                className={styles.navigationButton}
                                onClick={nextStep}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="button"
                                className={styles.submitButton}
                                onClick={handleSubmitClick}
                                disabled={isCreating || isUpdating}
                            >
                                {kpiToEdit ? "Update KPI" : "Submit KPI"}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default KpiForm;
