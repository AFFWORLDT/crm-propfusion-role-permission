import Spinner from "../../ui/Spinner";
import styles from "./Vehicles.module.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

const Vehicles = ({
    isLoading,
    error,
    vehicles,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const handleNavigate = (id) => {
        navigate(`/vehicles/${id}`);
    };

    if (isLoading) {
        return <Spinner type="fullPage" />;
    }

    if (error) {
        return (
            <div className={styles.error}>
                Error loading vehicles: {error.message}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {vehicles.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>
                        <svg
                            width="100"
                            height="100"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6b7280"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                            <path d="M16 2v6h6" />
                            <path d="m3 16 5-5c.928-.893 2.072-.893 3 0l3 3" />
                            <path d="m14 14 1-1c.928-.893 2.072-.893 3 0l3 3" />
                        </svg>
                    </div>
                    <h2>No Vehicles Found</h2>
                    <p>Try broadening your search criteria</p>
                </div>
            ) : (
                <div className={styles.listings}>
                    {vehicles?.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className={styles.listingItem}
                            onClick={() => handleNavigate(vehicle.id)}
                        >
                            <div className={styles.imgContainer}>
                                {vehicle.status === "COMPLETED" && (
                                    <span className={styles.completionStatus}>
                                        Completed
                                    </span>
                                )}
                                {vehicle.photos && vehicle.photos.length > 0 ? (
                                    <img
                                        src={vehicle.photos[0]}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                    />
                                ) : (
                                    <div className={styles.photoPlaceholder}>
                                        No photo available
                                    </div>
                                )}
                            </div>
                            <div className={styles.listingContent}>
                                <div className={styles.listingTop}>
                                    <h2>
                                        {vehicle.brand} {vehicle.model}
                                    </h2>
                                    <div>
                                        <span>{vehicle.transmission}</span>
                                        <span>{vehicle.body_type}</span>
                                    </div>
                                    <div>
                                        <span>
                                            {new Date(
                                                vehicle.inspection_date
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <p className={styles.price}>
                                    <span>
                                        Price : {vehicle?.price || "N/A"}{" "}
                                        {vehicle?.priceType
                                            ? `/${vehicle?.priceType}`
                                            : null}
                                    </span>
                                </p>
                                <ul>
                                    <li>
                                        <span>Year</span>
                                        <span>{vehicle.year}</span>
                                    </li>
                                    <li>
                                        <span>Color</span>
                                        <span>{vehicle.color}</span>
                                    </li>
                                    <li>
                                        <span>Transmission</span>
                                        <span>{vehicle.transmission}</span>
                                    </li>
                                    <li>
                                        <span>Fuel Type</span>
                                        <span>{vehicle.fuel_type}</span>
                                    </li>
                                    <li>
                                        <span>Odometer</span>
                                        <span>
                                            {vehicle.odometer_reading_km} km
                                        </span>
                                    </li>
                                    <li>
                                        <span>Drive</span>
                                        <span>{vehicle.drive}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                    {isFetchingNextPage && <Spinner />}
                </div>
            )}
        </div>
    );
};

export default Vehicles;
