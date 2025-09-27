import { useState } from "react";
import styles from "./VehicleTop.module.css";
import { formatNum } from "../../utils/utils";
import NewVehicleMenus from "./NewVehicleMenus.jsx";
import useUpdateVehicle from "./useUpdateVehicle";
import { ConfirmDeActivate } from "../../ui/ConfirmDelete";
import Modal from "../calendar/Modal";
import useAllDetails from "../all-details/useAllDetails";
import { useNavigate } from "react-router-dom";
import VehicleImageGallery from "./VehicleImageGallery";

function VehicleTop({ data }) {
    const { changeVehicle, isPending } = useUpdateVehicle();
    const { data: allData } = useAllDetails();
    const navigate = useNavigate();
    // State for controlling modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);


    function openRemoveLocationModal(locationType) {
        setSelectedLocation(locationType);
        setModalOpen(true);
    }

    function handleConfirmRemoveLocation() {
        if (selectedLocation) {
            changeVehicle({
                id: data?.id,
                updatedVehicle: { ...data, [selectedLocation]: "" },
            });
        }
        setModalOpen(false);
    }

    function handleWhatsappClick() {
        navigate(`/leads/whatsapp-leads?vehicle_id=${data?.id}`);
    }

    // WhatsApp icon component
    const WhatsAppIcon = () => {
        const [showPopover, setShowPopover] = useState(false);

        return (
            <div
                onClick={handleWhatsappClick}
                onMouseEnter={() => setShowPopover(true)}
                onMouseLeave={() => setShowPopover(false)}
                style={{ position: "relative" }}
            >
                <img
                    src="/icons/whatsapp.png"
                    alt=""
                    style={{ width: "4rem", height: "4rem" }}
                />
                {showPopover && (
                    <div
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#ffffff",
                            color: "#000",
                            padding: "5px 10px",
                            borderRadius: "40px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            zIndex: 10,
                            border: "1px solid #ccc",
                        }}
                    >
                        See all whatsapp leads for this vehicle
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`sectionDiv ${styles.vehicleTop}`}>
            {/* Vehicle Images */}
            <div style={{ position: "relative" }}>
                {(data?.status === "completed_primary" ||
                    data?.status === "completed") && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            position: "absolute",
                            top: "0px",
                            left: "0px",
                            zIndex: 1,
                        }}
                    >
                        <span
                            style={{
                                padding: "8px 10px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                fontWeight: "bold",
                                borderRadius: "12px",
                                fontSize: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                textTransform: "uppercase",
                            }}
                        >
                            Completed
                        </span>
                        <WhatsAppIcon />
                    </div>
                )}
              
                <VehicleImageGallery
                    images={
                        data?.photos?.map((url) => {
                            return {
                                original: url,
                                thumbnail: url,
                            };
                        }) || []
                    }
                />
            </div>
            <div className={styles.vehicleTopContent}>
                <NewVehicleMenus data={data} />

                <div className={styles.statusContainer}>
                    <span className={styles.status}>{data?.status}</span>
                    
                </div>

                <h1>
                    {data?.brand} {data?.model}
                </h1>
                <p className={styles.location}>
                    <img src="/icons/location.svg" alt="" />
                    <span>{data?.location || "N/A"}</span>
                </p>

                <p className={styles.price}>
                    <span>
                    {data.price
                            ? `AED ${formatNum(data.price)}`
                            : "Not specified"}
                        {data?.rentParam?.priceType
                            ? ` / ${data.rentParam.priceType}`
                            : ""}
                    </span>
                </p>

                <div className={styles.type}>
                    <span> {data?.body_type || "N/A"}</span>
                </div>

                <p className={styles.details}>
                    <span>Year: </span>
                    <span>{data?.year || "N/A"}</span>
                </p>

                <p className={styles.details}>
                    <span>Color: </span>
                    <span>{data?.color || "N/A"}</span>
                </p>

                {/* <AgentContact
                    onChangeAgent={handleChangeAgent}
                    isChangingAgent={isPending}
                    agentAvatar={data?.agent?.avatar}
                    agentName={data?.agent?.name}
                    agentPhone={data?.agent?.phone}
                    agentMail={data?.agent?.email}
                /> */}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Alert!"
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ConfirmDeActivate
                        resourceName={`Vehicle from this portal`}
                        onConfirm={handleConfirmRemoveLocation}
                        onCancel={() => setModalOpen(false)}
                        isDeleting={isPending}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default VehicleTop;
