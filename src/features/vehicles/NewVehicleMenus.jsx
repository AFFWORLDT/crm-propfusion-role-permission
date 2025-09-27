import { useNavigate } from "react-router-dom";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import styles from "./VehicleMenus.module.css";
import useDeleteVehicle from "./useDeleteVehicle";
import useUpdateVehicle from "./useUpdateVehicle";
import useImagesStore from "../../store/imagesStore";

function NewVehicleMenus({ data }) {
    const { removeVehicle, isPending: isDeletingVehicle } = useDeleteVehicle();
    const { editVehicle } = useUpdateVehicle();
    const navigate = useNavigate();
    const { clearAllImages } = useImagesStore();
    const LystingType = data?.listingType;

    function handleChangeStatus(status) {
        const updatedVehicle = {
            ...data,
            status,
        };

        delete updatedVehicle.id;

        editVehicle({ vehicleId: data?.id, vehicleData: updatedVehicle });
    }

    return (
        <div className={styles.vehicleMenus}>
            <Modal>
                <Menus>
                    <Menus.Toggle id={data?.id} />

                    <Menus.List id={data?.id}>
                        {/* <Modal.Open openWindowName="ownerInfo">
                            <Menus.Button icon="/icons/info.svg">
                                Owner Info
                            </Menus.Button>
                        </Modal.Open> */}

                        {data?.status !== "ACTIVE" && (
                            <>
                                <Menus.Button
                                    onClick={() => handleChangeStatus("ACTIVE")}
                                    icon="/icons/eye.svg"
                                >
                                    Activate
                                </Menus.Button>
                            </>
                        )}

                        {data?.status !== "INACTIVE" && (
                            <>
                                <Menus.Button
                                    onClick={() =>
                                        handleChangeStatus("INACTIVE")
                                    }
                                    icon="/icons/eye-off.svg"
                                >
                                    Inactivate
                                </Menus.Button>
                            </>
                        )}

                        {data?.status !== "RENTED" && LystingType === "RENT" && (
                            <Menus.Button
                                onClick={() => handleChangeStatus("RENTED")}
                                icon="/icons/sold.svg"
                            >
                                Mark as Rented
                            </Menus.Button>
                        )}

                        {data?.status !== "SOLD" && LystingType === "SELL" && (
                            <Menus.Button
                                onClick={() => handleChangeStatus("SOLD")}
                                icon="/icons/sold.svg"
                            >
                                Mark as Sold
                            </Menus.Button>
                        )}

                        <Menus.Button
                            onClick={() => {
                                clearAllImages();

                                navigate(
                                    `/vehicles/for-${data?.listingType}/edit/${data?.id}`
                                );
                            }}
                            icon="/icons/edit.svg"
                        >
                            Edit
                        </Menus.Button>
                        <Menus.Button
                            onClick={() => {
                                navigate(`/vehicles/report/${data?.id}`);
                            }}
                            icon="/icons/eye.svg"
                        >
                            View Report
                        </Menus.Button>
                        <Modal.Open openWindowName="deleteVehicle">
                            <Menus.Button icon="/icons/delete.svg">
                                Delete
                            </Menus.Button>
                        </Modal.Open>

                        {/* <Menus.Button
                            icon="/icons/share.svg"
                            onClick={() =>
                                window.open(
                                    `/share-vehicle/${data?.id}?pdf=1&userId=${currentUser?.id}`,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                        >
                            Share PDF
                        </Menus.Button>

                        <Menus.Button
                            icon="/icons/share-social.svg"
                            onClick={() =>
                                window.open(
                                    `/share-vehicle/${data?.id}?userId=${currentUser?.id}`,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                        >
                            Share Link
                        </Menus.Button> */}
                    </Menus.List>
                </Menus>
                {/* 
                <Modal.Window name="ownerInfo">
                    <div className={styles.ownerInfo}>
                        <h3>Owner Info</h3>
                        <ul>
                            <li>
                                <span>Name:</span>
                                <span>{data?.owner_info?.name}</span>
                            </li>
                            <li>
                                <span>Phone:</span>
                                <span>{data?.owner_info?.phone}</span>
                            </li>
                            <li>
                                <span>Email:</span>
                                <span>{data?.owner_info?.email}</span>
                            </li>
                        </ul>
                    </div>
                </Modal.Window> */}

                <Modal.Window name="deleteVehicle">
                    <ConfirmDelete
                        resourceName="vehicle"
                        onConfirm={() =>
                            removeVehicle(data?.id, {
                                onSettled: () => navigate(-1),
                            })
                        }
                        isDeleting={isDeletingVehicle}
                    />
                </Modal.Window>
            </Modal>
        </div>
    );
}

export default NewVehicleMenus;
