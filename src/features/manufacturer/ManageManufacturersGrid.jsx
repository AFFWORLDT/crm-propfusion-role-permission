import styles from "./ManageManufacturersGrid.module.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";
import useInfiniteManufacturers from "./useInfiniteManufacturers";
import Modal from "../../ui/Modal";
import EditManufacturerForm from "./EditManufacturerForm";

function ManageManufacturersGrid() {
    const { isLoading, manufacturers, totalSize, error } =
        useInfiniteManufacturers();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const getImageUrl = (logoUrl, name) => {
        if (!logoUrl) {
            // Generate initials from name
            const initials = name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

            // Create a colored background based on name
            const colors = [
                "#FF6B6B",
                "#4ECDC4",
                "#45B7D1",
                "#96CEB4",
                "#FFEEAD",
                "#D4A5A5",
            ];
            const colorIndex =
                name
                    .split("")
                    .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
                colors.length;

            return `data:image/svg+xml,${encodeURIComponent(`
                <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="200" fill="${colors[colorIndex]}"/>
                    <text x="50%" y="50%" font-family="Arial" font-size="80" fill="white" text-anchor="middle" dy=".3em">${initials}</text>
                </svg>
            `)}`;
        }
        return logoUrl.startsWith("http") ? logoUrl : `https${logoUrl}`;
    };

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <div>
            <div className={styles.areaGrid}>
                {manufacturers.map((item) => (
                    <Modal key={item.id}>
                        <Modal.Open openWindowName="editAreaImage">
                            <div className={styles.areaItem}>
                                <div className={styles.areaImageContainer}>
                                    <img
                                        src={getImageUrl(
                                            item.logoUrl,
                                            item.name
                                        )}
                                        alt={item.name}
                                        onError={(e) => {
                                            e.target.src = getImageUrl(
                                                null,
                                                item.name
                                            );
                                        }}
                                    />
                                </div>
                                <div className={styles.areaName}>
                                    <span>{item.name}</span>
                                    <span className={styles.country}>
                                        {item.country || "Unknown"}
                                    </span>
                                </div>
                            </div>
                        </Modal.Open>
                        <Modal.Window name="editAreaImage">
                            <EditManufacturerForm manufacturerData={item} />
                        </Modal.Window>
                    </Modal>
                ))}
            </div>
            <div className="mt-5">
                <Pagination totalSize={totalSize} isLoading={isLoading} />
            </div>
        </div>
    );
}

export default ManageManufacturersGrid;
