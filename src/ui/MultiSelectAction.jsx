import { Link, useSearchParams } from "react-router-dom";
import style from "./MultiSelectAction.module.css";
import { useSelectedProperties } from "../context/SelectedPropertiesContext";
import useBrowserWidth from "../hooks/useBrowserWidth";
import Modal from "./Modal";
import NewPropertyItemTagMultiSelectActions from "../features/properties/NewPropertyItemTagMultiSelectActions";
import NewPropertyItemAgentMultiSelectActions from "../features/properties/NewPropertyItemAgentMultiSelectActions";
import toast from "react-hot-toast";

function MultiSelectAction({
    onClick,
    showCheckboxes,
    totalProperties = 0,
    listingType,
}) {
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status") ?? "ACTIVE";
    const { handleBulkAction, selectedIds, clearSelection } =
        useSelectedProperties();
    const browserWidth = useBrowserWidth();

    const handleBulkShare = () => {
        if (selectedIds.length === 0) {
            toast.error("Please select at least one property to share.");
            return;
        }

        if (selectedIds.length === 1) {
            toast.error("Please select multiple properties for bulk sharing.");
            return;
        }

        // Create bulk share URL with selected property IDs
        const propertyIds = selectedIds.join(",");
        const bulkShareUrl = `/bulk-share-premium?propertyIds=${propertyIds}&userId=${localStorage.getItem("userId") || ""}`;
        window.open(bulkShareUrl, "_blank", "noopener,noreferrer");
    };

    const handleSelectAll = () => {
        // This would need to be implemented with the actual property IDs from the current view
        toast.info(
            "Select All functionality will be implemented based on current filtered properties"
        );
    };

    return (
        <div className={style.container}>
            <Link to={`/PreopertyGallery/${listingType}`}>
                <button className={style.btn}>
                    Show Gallary
                </button>
            </Link>
            {showCheckboxes &&
                (browserWidth > 480 ? (
                    <div className={style.actionButtonContainer}>
                        <button
                            className={style.btn}
                            onClick={() =>
                                handleBulkAction(
                                    status.toString().trim() === "ACTIVE"
                                        ? "Mark Inactive"
                                        : "Mark Active"
                                )
                            }
                        >
                            {status === "ACTIVE"
                                ? "Mark Inactive"
                                : "Mark Active"}
                        </button>

                        <Modal>
                            <Modal.Open openWindowName="MultiSelectActionOnTag">
                                <button className={style.btn}>Tag</button>
                            </Modal.Open>
                            <Modal.Window name="MultiSelectActionOnTag">
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        minWidth: "300px",
                                    }}
                                >
                                    <NewPropertyItemTagMultiSelectActions />
                                </div>
                            </Modal.Window>
                        </Modal>

                        <Modal>
                            <Modal.Open openWindowName="MultiSelectActionOnAgent">
                                <button className={style.btn}>Agent</button>
                            </Modal.Open>
                            <Modal.Window name="MultiSelectActionOnAgent">
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        minWidth: "300px",
                                    }}
                                >
                                    <NewPropertyItemAgentMultiSelectActions />
                                </div>
                            </Modal.Window>
                        </Modal>

                        <button
                            className={`${style.btn} ${style.bulkShareBtn}`}
                            onClick={handleBulkShare}
                            disabled={selectedIds.length < 2}
                            title={
                                selectedIds.length < 2
                                    ? "Select at least 2 properties for bulk sharing"
                                    : "Share multiple properties as premium PDF"
                            }
                        >
                            Bulk Share ({selectedIds.length})
                        </button>

                        <button
                            className={style.btn}
                            onClick={() => handleBulkAction("Delete")}
                        >
                            Delete
                        </button>
                    </div>
                ) : (
                    <>
                        <Modal>
                            <Modal.Open openWindowName="MultiSelectActionOnTag">
                                <button
                                    className={style.btn}
                                    style={{ marginRight: 10 }}
                                >
                                    T
                                </button>
                            </Modal.Open>
                            <Modal.Window name="MultiSelectActionOnTag">
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <NewPropertyItemTagMultiSelectActions />
                                </div>
                            </Modal.Window>
                        </Modal>
                        <Modal>
                            <Modal.Open openWindowName="MultiSelectAction">
                                <button
                                    className={style.btn}
                                    style={{ marginRight: 10 }}
                                >
                                    F
                                </button>
                            </Modal.Open>
                            <Modal.Window name="MultiSelectAction">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <button
                                        className={style.btn}
                                        onClick={() =>
                                            handleBulkAction(
                                                status === "ACTIVE"
                                                    ? "Mark Inactive"
                                                    : "Mark Active"
                                            )
                                        }
                                        style={{ marginRight: 10 }}
                                    >
                                        {status === "ACTIVE"
                                            ? "Mark Inactive"
                                            : "Mark Active"}
                                    </button>

                                    <button
                                        className={`${style.btn} ${style.bulkShareBtn}`}
                                        onClick={handleBulkShare}
                                        disabled={selectedIds.length < 2}
                                        title={
                                            selectedIds.length < 2
                                                ? "Select at least 2 properties for bulk sharing"
                                                : "Share multiple properties as premium PDF"
                                        }
                                    >
                                        Share ({selectedIds.length})
                                    </button>

                                    <button
                                        className={style.btn}
                                        onClick={() =>
                                            handleBulkAction("Delete")
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </Modal.Window>
                        </Modal>
                    </>
                ))}

            <button className={style.btn} onClick={onClick}>
                Select
            </button>
        </div>
    );
}

export default MultiSelectAction;
