import { useEffect } from "react";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import styles from "./Logs.module.css";

function Logs({
    leadLogs,
    isLoading,
    isError,
    title = "Lead Logs",
    height = null,
    maxHeight = null,
}) {
    useEffect(() => {
        if (isError) toast.error(isError.message);
    }, [isError]);

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <div className="sectionDiv">
            <div className={styles.leadLogsTop}>
                <h3>
                    <img src="/icons/description.svg" alt="" />
                    <span>{title}</span>
                </h3>
            </div>
            <div
                className={`${styles.logsContainer}`}
                style={{
                    height: height ? height : "auto",
                    maxHeight: maxHeight ? maxHeight : "auto",
                }}
            >
                {leadLogs?.data?.logs?.length > 0 ? (
                    leadLogs?.data?.logs?.map((log) => (
                        <div key={log.id} className={styles.logItem}>
                            <div className={styles.logHeader}>
                                <img
                                    src={log?.agent_avatar}
                                    alt={log?.agent_name}
                                    className={styles.agentAvatar}
                                />
                                <div>
                                    <strong>{log?.agent_name}</strong>
                                    <br />
                                    <span className={styles.logTimestamp}>
                                        {new Date(
                                            new Date(log?.timestamp).getTime() + (4 * 60 * 60 * 1000)
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <p className={styles.logMessage}>{log.message}</p>
                        </div>
                    ))
                ) : (
                    <p className={styles.noLogs}>
                        No logs available for this lead.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Logs;
