import styles from "./AddLeadFollowup.module.css";
import useCreateFollowUp from "../../features/followUps/useCreateFollowUp";
import Modal from "../../ui/Modal";
import { useForm } from "react-hook-form";
import FormInputDataList from "../../ui/FormInputDataList";
import useStages from "../../features/stages/useStages";
import useRating from "../../features/rating/useRating";
import useStatus from "../../features/status/useStatus";
import useAllDetails from "../../features/all-details/useAllDetails";
import { AddCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import { sendLeadReminder } from "../../services/apiLeads";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useState } from "react";

function AddLeadFollowup({ type, targetId, maxWidth = null, comment }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleRowClick = (leadId) => {
        navigate(`/leads/details/${leadId}`);
    };

    const sendReminder = async (leadId) => {
        try {
            setLoading(true);
            let res = await sendLeadReminder(leadId);
            console.log("this is res", res);
            if(res.whatsapp_status == "success"){
                toast.success("Lead reminder sent successfully!");
            }else{
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }   

    return (
        <div
            className={`${styles.followUpsWrapper} ${maxWidth ? styles.customWidth : ""}`}
        >
            <div className={styles.followUpsTop}>
                <div className={styles.actionButtons}>
                    <Modal>
                        <Modal.Open openWindowName="addFollowUp">
                            <Tooltip title="Add Lead Follow Up" arrow placement="top">
                                <button className={styles.iconButton}>
                                    <AddCircleOutline sx={{ fontSize: 20 }} />
                                </button>
                            </Tooltip>
                        </Modal.Open>
                        <Modal.Window name="addFollowUp">
                            <FollowUpForm
                                type={type}
                                targetId={targetId}
                                comment={comment}
                            />
                        </Modal.Window>
                    </Modal>
                    
                    <Tooltip title="See More Details" arrow placement="top">
                        <button 
                            onClick={() => handleRowClick(targetId)}
                            className={styles.iconButton}
                        >
                            <VisibilityIcon sx={{ fontSize: 20 }} />
                        </button>
                    </Tooltip>
                    <Tooltip title="Send Lead Reminder" arrow placement="top">
                        <button 
                            onClick={() => sendReminder(targetId)}
                            className={styles.iconButton}
                        >
                            {loading ? <Loader className="animate-spin" /> : <SendTimeExtensionIcon sx={{ fontSize: 20 }} />}
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

export function FollowUpForm({ type, targetId, onCloseModal }) {
    const { data: stages, isLoading: isStagesLoading } = useStages("leads");
    const { data: rating, isLoading: isRatingLoading } = useRating("leads");
    const { data: status, isLoading: isStatusLoading } = useStatus("leads");
    const { data } = useAllDetails();

    const backgroundColor =
        data?.company_settings?.sidebar_color_code || "#020079";

    const modifiedStatusData = status?.map((status) => ({
        value: status.id,
        label: status.name,
    }));

    const modifiedRatingData = rating?.map((rating) => ({
        value: rating.id,
        label: rating.name,
    }));

    const modifiedStageData = stages?.map((stage) => ({
        value: stage.id,
        label: stage.name,
    }));
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm();
    const { addFollowUp, isPending } = useCreateFollowUp();

    const onSubmit = (data) => {
        // Validate that both date and time are provided
        if (!data.followupDate || !data.followupTime) {
            return; // Don't submit if date or time is missing
        }

        const followupDateTime = `${data.followupDate}T${data.followupTime}`;

        addFollowUp(
            {
                type,
                target_id: targetId,
                nextfollowupdate: followupDateTime,
                text: data.text,
                stages: data.stages ? data?.stages?.value?.toString() : null,
                rating: data.rating ? data?.rating?.value?.toString() : null,
                status: data.status ? data?.status?.value?.toString() : null,
            },
            {
                onSettled: () => {
                    reset();
                    onCloseModal();
                },
            }
        );
    };

    return (
        <div className={styles.followUpForm}>
            <h3>Add {type === "lead" ? "Lead" : "Client"} Follow Up</h3>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.followUpFormGrid}
            >
                <div>
                    <textarea
                        {...register("text")}
                        placeholder="remark"
                        rows={2}
                        className={styles.textareaField}
                    />
                    {errors.text && (
                        <span className={styles.error}>
                            {errors.text?.message}
                        </span>
                    )}
                </div>

                <div className={styles.followUpDateTimeGroup}>
                    <div className={styles.formFieldGroup}>
                        <label>Follow-up Date</label>
                        <input
                            type="date"
                            {...register("followupDate", {
                                required: "Follow-up date is required",
                            })}
                        />
                    </div>
                    <div className={styles.formFieldGroup}>
                        <label>Follow-up Time</label>
                        <input
                            type="time"
                            {...register("followupTime", {
                                required: "Follow-up time is required",
                            })}
                        />
                    </div>
                </div>
                {(errors.followupDate || errors.followupTime) && (
                    <span className={styles.error}>
                        {errors.followupDate?.message ||
                            errors.followupTime?.message}
                    </span>
                )}

                <div className={styles.formFieldGroup}>
                    <label>Stages</label>
                    <FormInputDataList
                        control={control}
                        registerName={"stages"}
                        isLoading={isStagesLoading}
                        placeholder={"Stages"}
                        isDisabled={isStagesLoading}
                        data={modifiedStageData || []}
                    />
                </div>
                <div className={styles.formFieldGroup}>
                    <label>Rating</label>
                    <FormInputDataList
                        control={control}
                        registerName={"rating"}
                        isLoading={isRatingLoading}
                        isDisabled={isRatingLoading}
                        placeholder={"Rating"}
                        data={modifiedRatingData || []}
                    />
                </div>
                <div className={styles.formFieldGroup}>
                    <label>Status</label>
                    <FormInputDataList
                        control={control}
                        registerName={"status"}
                        isLoading={isStatusLoading}
                        isDisabled={isStatusLoading}
                        placeholder={"Status"}
                        data={modifiedStatusData || []}
                    />
                </div>
                <button
                    style={{
                        backgroundColor: backgroundColor,
                    }}
                    className={"btnSubmit"}
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? "Adding..." : "Add"}
                </button>
            </form>
        </div>
    );
}

export default AddLeadFollowup;
