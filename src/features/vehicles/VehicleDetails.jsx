import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/VehicleDetails.module.css";
import VehicleTop from "./VehicleTop";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../../pages/PageNotFound";
import useVehicle from "./useVehicle";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import Button from "../../ui/Button";

function VehicleDetails() {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const { data: vehicle, isLoading, error } = useVehicle(vehicleId);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (isLoading) return <Spinner type="fullPage" />;
    if (!vehicle) return <PageNotFound />;

    const handleViewReport = () => {
        navigate(`/vehicles/${vehicleId}/report`);
    };

    return (
        <div className={styles.container}>
            <VehicleTop data={vehicle} />

            <div className={styles.content}>
                <div className={styles.section}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2>Basic Information</h2>
                        <Button onClick={handleViewReport}>View Inspection Report</Button>
                    </div>
                    <div className={styles.grid}>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Brand</span>
                            <span className={styles.value}>
                                {vehicle.brand}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Model</span>
                            <span className={styles.value}>
                                {vehicle.model}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Year</span>
                            <span className={styles.value}>{vehicle.year}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Color</span>
                            <span className={styles.value}>
                                {vehicle.color}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Transmission</span>
                            <span className={styles.value}>
                                {vehicle.transmission}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Fuel Type</span>
                            <span className={styles.value}>
                                {vehicle.fuel_type}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Odometer</span>
                            <span className={styles.value}>
                                {vehicle.odometer_reading_km} km
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Drive</span>
                            <span className={styles.value}>
                                {vehicle.drive}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicleDetails;
