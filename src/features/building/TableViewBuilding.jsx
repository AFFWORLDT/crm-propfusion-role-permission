import styles from "./TableViewBuilding.module.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import { getDaysFromCurrentDate } from "../../utils/utils";
import { useNavigate } from "react-router-dom";

function TableViewBuilding({ isLoading, data, error, isFetchingNextPage }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate=useNavigate()
    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);
    
    const handleViewDetails = (item) => {
        setSelectedItem(item);
        navigate(`/new-building/list/${item.id}`)
    };

    return (
        <div className={styles.tableContainer}>
            {isLoading ? (
                <div className={styles.spinnerContainer}>
                    <Spinner type="fullPage" />
                </div>
            ) : (
                <>
                    <table className={styles.buildingTable}>
                        <thead>
                            <tr>
                                <th className={styles.imageHeader}>Image</th>
                                <th>Building Name</th>
                                <th>Property Type</th>
                                <th>Owner</th>
                                <th>City</th>
                                <th>Agent</th>
                                <th>Listed</th>
                                <th className={styles.actionHeader}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} className={styles.tableRow}>
                                    <td className={styles.imageCell}>
                                        <div className={styles.thumbnailContainer}>
                                            <img
                                                src={item?.photos?.[0]}
                                                alt={item?.name}
                                                className={styles.thumbnail}
                                            />
                                        </div>
                                    </td>
                                    <td className={styles.nameCell}>
                                        <h3 className={styles.buildingName}>{item?.name}</h3>
                                        <p className={styles.buildingSubName}>{item.building_name}</p>
                                    </td>
                                    <td className={styles.propertyTypeCell}>
                                        {item?.propertyTypes?.join(", ")}
                                    </td>
                                    <td>
                                        {item?.owner?.owner_name || "N/A"}
                                    </td>
                                    <td>
                                        {item?.location?.city || "N/A"}
                                    </td>
                                    <td>
                                        {item?.agent?.name || "N/A"}
                                    </td>
                                    <td className={styles.daysCell}>
                                        {`${getDaysFromCurrentDate(item?.created_at)} days ago`}
                                    </td>
                                    <td className={styles.actionCell}>
                                        <button 
                                            className={styles.detailButton}
                                            onClick={() => handleViewDetails(item)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {isFetchingNextPage && (
                        <div className={styles.loadingMoreContainer}>
                            <Spinner />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default TableViewBuilding;