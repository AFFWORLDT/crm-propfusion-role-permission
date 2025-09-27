import Table from "../../ui/Table";
import EditViewingFrom from "./EditViewingFrom";
import useDeleteViewing from "./useDeleteViewing";
import styles from "./ViewingsInTable.module.css";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useMyPermissions } from "../../hooks/useHasPermission";

function ViewingsInTable({ data, isFetchingNextPage, hasNextPage }) {
    const { deleteViewing, isPending } = useDeleteViewing();
    const { hasPermission } = useMyPermissions();

    const columns = "0.6fr 0.4fr 0.4fr 0.4fr 0.5fr 0.5fr 0.6fr 0.3fr";

    return (
        <Table columns={columns} rowWidth="155rem">
            <Table.Header>
                <div>Viewing Date</div>
                <div>Property Title</div>
                <div>Client Info</div>
                <div>Agent Info</div>
                <div>Duration</div>
                <div>Status</div>
                <div>Notes</div>
                <div>Actions</div>
            </Table.Header>
            <Table.Body
                data={data}
                render={(viewing) => (
                    <Table.Row key={viewing?.id}>
                        <div>
                            {new Date(viewing?.viewing_date).toLocaleString()}
                        </div>
                        <div>{viewing?.property?.title}</div>
                        <div className={styles.clientInfoCell}>
                            <span
                                className={styles.truncatedText}
                                title={`Name : ${viewing?.client_name}\nEmail : ${viewing?.client_email}\nPhone : ${viewing?.client_phone}`}
                            >
                                {viewing?.client_name}
                            </span>
                        </div>
                        <div className={styles.clientInfoCell}>
                            <div className={styles.agentInfo}>
                                <div className={styles.agentAvatarWrapper}>
                                    <img
                                        src={viewing?.agent?.avatar}
                                        alt={viewing?.agent?.name}
                                        className={styles.agentAvatar}
                                    />
                                    <div className={styles.agentPopover}>
                                        <div
                                            className={
                                                styles.agentPopoverContent
                                            }
                                        >
                                            <img
                                                src={viewing?.agent?.avatar}
                                                alt={viewing?.agent?.name}
                                                className={
                                                    styles.agentPopoverAvatar
                                                }
                                            />
                                            <div
                                                className={
                                                    styles.agentPopoverInfo
                                                }
                                            >
                                                <h4>{viewing?.agent?.name}</h4>
                                                <p>{viewing?.agent?.email}</p>
                                                <p>{viewing?.agent?.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>{viewing?.duration_minutes} minutes</div>
                        <div>{viewing?.status}</div>
                        <div className={styles.notesCell}>
                            <span
                                className={styles.truncatedText}
                                title={viewing.notes}
                            >
                                {viewing.notes}
                            </span>
                        </div>
                        <div className={styles.actionsCell}>
                            <Link to={`/viewings/${viewing?.id}`}>
                                <button
                                    className={styles.actionButton}
                                    title="View Details"
                                >
                                    <Eye size={18} />
                                </button>
                            </Link>
                            {hasPermission("manage_viewings") && (
                                <>
                                    <EditViewingFrom
                                        viewingId={viewing?.id}
                                        defaultData={viewing}
                                    />
                                    <Modal>
                                        <Modal.Open
                                            openWindowName={`deleteViewing-${viewing?.id}`}
                                        >
                                            <button
                                                className={styles.actionButton}
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </Modal.Open>
                                        <Modal.Window
                                            name={`deleteViewing-${viewing?.id}`}
                                        >
                                            <ConfirmDelete
                                                resourceName="viewing"
                                                onConfirm={() =>
                                                    deleteViewing(viewing?.id)
                                                }
                                                isDeleting={isPending}
                                            />
                                        </Modal.Window>
                                    </Modal>
                                </>
                            )}
                        </div>
                    </Table.Row>
                )}
            />
            {isFetchingNextPage && (
                <Table.Row>
                    <div colSpan={8} className={styles.loadingRow}>
                        Loading more viewings...
                    </div>
                </Table.Row>
            )}

            {!isFetchingNextPage && !hasNextPage && data.length > 0 && (
                <Table.Row>
                    <div colSpan={8} className={styles.noMoreDataRow}>
                        No more viewings available
                    </div>
                </Table.Row>
            )}
        </Table>
    );
}

export default ViewingsInTable;
