import useWatchmenLists from "../../features/watchmen/useGetwatchmenLists";
import WatchmenCard from "../../features/watchmen/WatchmenCard";
import SectionTop from "../../ui/SectionTop";
import Spinner from "../../ui/Spinner";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import Modal from "../../ui/Modal";
import AddWatchmenForm from "../../features/watchmen/AddWatchmenForm";
import styles from "./Watchmen.module.css";
import useUpdateKycStatus from "../../features/watchmen/useUpdateKycStatus";
import useAllDetails from "../../features/all-details/useAllDetails";

function Watchmen() {
    const { watchmen, isLoading, error } = useWatchmenLists();
    const { updateKycStatus, isLoading: isUpdatingKyc } = useUpdateKycStatus();
    const { data } = useAllDetails();
    const backgroundColor =
        data?.company_settings?.sidebar_color_code || "#020079";
    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const handleUpdateKyc = async (watchmanId, newKycStatus) => {
        try {
            isUpdatingKyc && toast.loading("Updating KYC status...");
            updateKycStatus({ watchmanId, kycStatus: newKycStatus });
        } catch (error) {
            console.error("Error updating KYC status:", error);
        }
    };

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <div>
            <Modal>
                <SectionTop heading={"Watchmen List"}/>
                <div className="sectionStyles">
                    <div
                        className="justify-end d-flex mb-4"
                        style={{
                            justifyContent: "flex-end",
                            display: "flex",
                        }}
                    >
                        <Modal.Open openWindowName="add-watchmen">
                            <button
                                className="btnSubmit"
                                style={{
                                    backgroundColor: backgroundColor,
                                    borderBottom: `1px solid ${backgroundColor}`,
                                }}
                            >
                                <i className="bi bi-plus-lg me-2"></i>
                                Add New Watchman
                            </button>
                        </Modal.Open>
                    </div>
                    {watchmen?.length > 0 ? (
                        watchmen.map((watchman) => (
                            <WatchmenCard
                                key={watchman.id}
                                watchmen={watchman}
                                onUpdateKyc={handleUpdateKyc}
                            />
                        ))
                    ) : (
                        <div className={styles.noWatchmen}>
                            <p>No watchmen found. Please add a new watchman.</p>
                        </div>
                    )}
                </div>

                <Modal.Window name="add-watchmen">
                    <AddWatchmenForm />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default Watchmen;
