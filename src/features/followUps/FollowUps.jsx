import Modal from "../../ui/Modal";
import styles from "./FollowUps.module.css";
import useCreateFollowUp from "./useCreateFollowUp";
import useFollowUps from "./useFollowUps";
import { getDaysFromCurrentDate } from "../../utils/utils";
import useStages from "../stages/useStages";
import useRating from "../rating/useRating";
import useStatus from "../status/useStatus";
import { useForm } from "react-hook-form";
import FormInputDataList from "../../ui/FormInputDataList";
import { format } from "date-fns";
import useAllDetails from "../all-details/useAllDetails";
import { useState, useRef, useEffect } from "react";

function FollowUps({
    type,
    targetId,
    maxWidth = null,
    maxHeight = null,
    isForProperty = false,
    height = null,
}) {
    const { isLoading, data, error } = useFollowUps(type, targetId);
    const [replyToId, setReplyToId] = useState(null);
    const followUpsContentRef = useRef(null);

    const handleOpenReply = (id) => {
        setReplyToId(id);
        setTimeout(() => {
            const element = document.querySelector(`[data-followup-id="${id}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    };
    const handleCloseReply = () => {
        setReplyToId(null);
    };

    return (
        <div style={{ maxWidth }} className={`sectionDiv ${styles.followUps}`}>
            <div className={styles.followUpsTop}>
                <h3>
                    <img src="/icons/description.svg" alt="" />
                    <span>Follow Up</span>
                </h3>
                <Modal>
                    <Modal.Open openWindowName="addFollowUp">
                        <button className={styles.btnAddFollowUp}>
                            <img src="/icons/add.svg" />
                            <span>Add</span>
                        </button>
                    </Modal.Open>
                    <Modal.Window name="addFollowUp">
                        <FollowUpForm
                            type={type}
                            targetId={targetId}
                            isForProperty={isForProperty}
                        />
                    </Modal.Window>
                </Modal>
            </div>

            <div
                style={{
                    gridTemplateColumns: maxWidth ? "repeat(1, 1fr)" : "",
                    gap: "1.9rem",
                    maxHeight: maxHeight ? "50rem" : "auto",
                    overflowY: maxHeight ? "auto" : "hidden",
                    height: height ? height : "auto",
                }}
                className={styles.followUpsContent}
                ref={followUpsContentRef}
            >
                {isLoading || error || !data.length ? (
                    <p>No Data Found</p>
                ) : (
                    data.map((item) => {
                        // Check if this follow-up is a reply (has linked_followup_id)
                        const isReply = !!item.linked_followup_id;
                        const replyStyle = isReply
                            ? { 
                                width: "95%", 
                                marginLeft: "5%",
                                borderLeft: "3px solid #3182ce",
                                backgroundColor: "#f0f9ff",
                                position: "relative",
                                paddingLeft: "20px",
                                borderRadius: "20px 3px 20px 20px",
                                boxShadow: "0 2px 8px rgba(49, 130, 206, 0.1)",
                                border: "1px solid #e2e8f0",
                                overflowY: "visible",
                                height: "auto",
                                maxHeight: "none",
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                marginTop: "0.5rem"
                              }
                            : { 
                                width: "100%", 
                                marginLeft: 0,
                                backgroundColor: "#ffffff",
                                borderRadius: "3px 20px 20px 20px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                border: "1px solid #e2e8f0",
                                wordWrap: "break-word",
                                overflowWrap: "break-word"
                              };
                        return (
                            <div
                                className={styles.followUpItem}
                                key={item.id}
                                style={{ 
                                    position: "relative", 
                                    ...replyStyle,
                                    marginBottom: isReply ? "1rem" : "2.4rem"
                                }}
                                data-followup-id={item.id}
                            >
                                <div>
                                    <img src={item.agent_avatar} />
                                    <h4>{item.agent_name}</h4>
                                    {isReply && (
                                        <span style={{
                                            fontSize: "1.1rem",
                                            color: "#3182ce",
                                            fontWeight: "500",
                                            marginLeft: "0.5rem"
                                        }}>
                                            ↳ Reply
                                        </span>
                                    )}

                                    <span>
                                        {(() => {
                                            const date = new Date(
                                                item.created_at
                                            );
                                            date.setHours(date.getHours() + 4);
                                            return format(date, 'dd/MM/yyyy HH:mm:ss');
                                        })()}{" "}
                                        (
                                        {`${getDaysFromCurrentDate(item.created_at)} days ago`}
                                        )
                                    </span>
                                </div>

                                <div>
                                    <p style={{ 
                                        fontSize: isReply ? "1.4rem" : "1.6rem",
                                        color: isReply ? "#4a5568" : "#2d3748",
                                        lineHeight: "1.6",
                                        margin: "0",
                                        padding: "0",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word"
                                    }}>
                                        {item.text}
                                    </p>
                                </div>
                                <h4
                                    style={{
                                        color: item.stage_data?.color_code,
                                    }}
                                >
                                    {item.stage_data?.name}
                                </h4>
                                <h4
                                    style={{
                                        color: item.rating_data?.color_code,
                                    }}
                                >
                                    {item.rating_data?.name}
                                </h4>
                                {/* Reply Button */}
                                {!isReply && (
                                    <button
                                        style={{
                                            position: "absolute",
                                            right: 10,
                                            bottom: 10,
                                            background: "#f0f0f0",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "4px 12px",
                                            cursor: "pointer",
                                            fontSize: "0.95rem",
                                            zIndex: 2,
                                        }}
                                        onClick={() => handleOpenReply(item.id)}
                                    >
                                        Reply
                                    </button>
                                )}
                                {/* Inline Reply Box */}
                                {replyToId === item.id && (
                                    <div
                                        data-reply-form={item.id}
                                        style={{
                                            position: "absolute",
                                            left: "50%",
                                            top: "50%",
                                            transform: "translate(-50%, -50%)",
                                            zIndex: 9999,
                                            background: "#fff",
                                            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                                            borderRadius: "12px",
                                            padding: "24px",
                                            minWidth: "380px",
                                            maxWidth: "90vw",
                                            width: "max-content",
                                            marginTop: "6rem",
                                            maxHeight: "90vh",
                                            overflowY: "auto",
                                            border: "1px solid #e2e8f0",
                                            opacity: 0,
                                            animation: "fadeIn 0.2s ease forwards"
                                        }}
                                    >
                                        <style>
                                            {`
                                                @keyframes fadeIn {
                                                    from { opacity: 0; transform: translate(-50%, -45%); }
                                                    to { opacity: 1; transform: translate(-50%, -50%); }
                                                }
                                            `}
                                        </style>
                                        <div style={{ 
                                            position: "absolute", 
                                            right: "12px", 
                                            top: "12px",
                                            cursor: "pointer",
                                            padding: "8px",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "#f7fafc",
                                            border: "1px solid #e2e8f0",
                                            transition: "all 0.2s ease"
                                        }}
                                            onClick={handleCloseReply}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </div>
                                        <ReplyFollowUpForm
                                            type={type}
                                            targetId={targetId}
                                            linkedFollowUpId={item.id}
                                            onCloseModal={handleCloseReply}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function FollowUpForm({ type, targetId, onCloseModal, isForProperty = false }) {
    const { addFollowUp, isPending } = useCreateFollowUp();
    const { data: stages, isLoading: isStagesLoading } = useStages("leads");
    const { data: rating, isLoading: isRatingLoading } = useRating("leads");
    const { data: status, isLoading: isStatusLoading } = useStatus("leads");
    const { data: allDetails } = useAllDetails();

    const getCurrentDateTime = () => {
        const now = new Date();
        return {
            date: format(now, "yyyy-MM-dd"),
            time: format(now, "HH:mm"),
        };
    };

    const currentDateTime = getCurrentDateTime();

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

    const { register, handleSubmit, reset, control } = useForm({
        defaultValues: {
            followupDate: currentDateTime.date,
            followupTime: currentDateTime.time,
        },
    });

    const onSubmit = (data) => {
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
                </div>

                <div className={styles.followUpDateTimeGroup}>
                    <div className={styles.formFieldGroup}>
                        <label>Follow-up Date</label>
                        <input
                            type="date"
                            {...register("followupDate")}
                            defaultValue={currentDateTime.date}
                        />
                    </div>
                    <div className={styles.formFieldGroup}>
                        <label>Follow-up Time</label>
                        <input
                            type="time"
                            {...register("followupTime")}
                            defaultValue={currentDateTime.time}
                        />
                    </div>
                </div>

                {!isForProperty && (
                    <>
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
                    </>
                )}
                <button
                    className={"btnSubmit"}
                    type="submit"
                    disabled={isPending}
                    style={{
                        background:
                            allDetails?.company_settings?.sidebar_color_code ||
                            "#020079",
                    }}
                >
                    {isPending ? "Adding..." : "Add"}
                </button>
            </form>
        </div>
    );
}

function ReplyFollowUpForm({ type, targetId, linkedFollowUpId, onCloseModal }) {
    const { addFollowUp, isPending } = useCreateFollowUp();
    const { register, handleSubmit, reset } = useForm();
    const { data: allDetails } = useAllDetails();

    const onSubmit = (data) => {
        addFollowUp(
            {
                type,
                target_id: targetId,
                text: data.text,
                linked_followup_id: linkedFollowUpId,
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
        <div
            style={{
                minWidth: 320,
            }}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                <div>
                    <textarea
                        {...register("text", { required: true })}
                        placeholder="Type your reply..."
                        rows={3}
                        className={styles.textareaField}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            fontSize: "1.6rem",
                            resize: "vertical",
                            minHeight: "100px",
                            outline: "none",
                            transition: "border-color 0.2s ease",
                        }}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "flex-end",
                    }}
                >
                    <button
                        className={"btnSubmit"}
                        type="submit"
                        disabled={isPending}
                        style={{
                            background:
                                allDetails?.company_settings
                                    ?.sidebar_color_code || "#020079",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            border: "none",
                            color: "#ffffff",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "opacity 0.2s ease",
                            opacity: isPending ? "0.7" : "1",
                            minWidth: "100px",
                        }}
                    >
                        {isPending ? "Replying..." : "Send"}
                    </button>
                    <button
                        type="button"
                        onClick={onCloseModal}
                        style={{
                            background: "#f7fafc",
                            color: "#4a5568",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            padding: "10px 20px",
                            cursor: "pointer",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                            minWidth: "100px",
                            ":hover": {
                                background: "#edf2f7",
                            },
                        }}
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FollowUps;
