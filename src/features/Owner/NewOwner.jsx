import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Owner.module.css";
// import Pagination from "../../ui/Pagination";
import toast from "react-hot-toast";
import OwnerActions from "./OwnerActions";
import {
    DollarSign,
    Home,
    Pencil,
    Trash,
    Eye,
    Grid,
    List,
    Table,
} from "lucide-react";
import AssignedOwnerButton from "../Tenants/AssinedOwnerButton";

function NewOwner({ data, error, handelDelete, handleEdit, onAddOwner }) {
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [viewMode, setViewMode] = useState("grid"); // grid, list, or table view
  
    const statusOptions = [
        { value: "active", label: "Active", color: "#4CAF50" },
        { value: "inactive", label: "Inactive", color: "#f44336" },
        { value: "pending", label: "Pending", color: "#FF9800" },
        { value: "verified", label: "Verified", color: "#2196F3" },
        { value: "unverified", label: "Unverified", color: "#9E9E9E" },
    ];

    // Column definitions for table view
    const columns = [
        { id: "owner_name", label: "Owner Name", sortable: true },
        { id: "owner_info", label: "Owner Info", sortable: true },
        { id: "lessor_name", label: "Lessor Name", sortable: true },
        { id: "lessor_emirates_id", label: "Emirates ID", sortable: true },
        { id: "license_no", label: "License No", sortable: true },
        { id: "lessor_email", label: "Email", sortable: true },
        { id: "lessor_phone", label: "Phone", sortable: true },
        { id: "nationality", label: "Nationality", sortable: true },
        { id: "status", label: "Status", sortable: true },
        { id: "actions", label: "Actions", sortable: false },
    ];

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });

    // Sorting function
    const sortData = (data, sortConfig) => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;

            const aValue = a[sortConfig.key].toString().toLowerCase();
            const bValue = b[sortConfig.key].toString().toLowerCase();

            if (aValue < bValue) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
        });
    };

    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

   

    const filteredData =
        selectedStatus === "all"
            ? data
            : data?.filter(
                  (item) => item?.status?.toLowerCase() === selectedStatus
              );

    const handleNavigateToPropertyListingPage = (type, id) => {
        if (type === "SELL") {
            navigate(`/for-sell/new-list?owner_id=${id}`);
        } else {
            navigate(`/for-rent/new-list?owner_id=${id}`);
        }
    };

    const handleViewDetails = (owner) => {
        navigate(`/for-owner/details/${owner.id}`);
    };

    const renderActionButtons = (item) => (
        <div className={styles.actionButtons}>
            { <AssignedOwnerButton id={item.id} />}
            <button
                className={styles.viewButton}
                onClick={() => handleViewDetails(item)}
            >
                <Eye size={15} /> View
            </button>
            <button
                className={styles.editButton}
                onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                }}
            >
                <Pencil size={15} /> Edit
            </button>
            <button
                className={styles.deleteButton}
                onClick={(e) => {
                    e.stopPropagation();
                    handelDelete(item);
                }}
            >
                <Trash size={15} /> Delete
            </button>
            <button
                className={styles.deleteButton}
                onClick={() => {
                    handleNavigateToPropertyListingPage("RENT", item.id);
                }}
            >
                <Home size={15} /> Rent
            </button>
            <button
                className={styles.deleteButton}
                onClick={() => {
                    handleNavigateToPropertyListingPage("SELL", item.id);
                }}
            >
                <DollarSign size={15} /> Sell
            </button>
        </div>
    );

    const renderListView = () => (
        <div className={styles.listView}>
            {filteredData?.map((item, i) => (
                <div className={styles.listViewItem} key={i}>
                    <div className={styles.listViewContent}>
                        <div className={styles.listViewHeader}>
                            <h3>{item?.owner_name}</h3>
                            <span
                                className={styles.listingStatus}
                                style={{
                                    backgroundColor:
                                        statusOptions.find(
                                            (s) =>
                                                s.value ===
                                                item?.status?.toLowerCase()
                                        )?.color || "#9E9E9E",
                                }}
                            >
                                {item?.status}
                            </span>
                        </div>
                        <div className={styles.listViewDetails}>
                            <div className={styles.detailColumn}>
                                <p>
                                    <strong>Owner Info:</strong>{" "}
                                    {item?.owner_info || "N/A"}
                                </p>
                                <p>
                                    <strong>Lessor Name:</strong>{" "}
                                    {item?.lessor_name || "N/A"}
                                </p>
                                <p>
                                    <strong>Emirates ID:</strong>{" "}
                                    {item?.lessor_emirates_id || "N/A"}
                                </p>
                            </div>
                            <div className={styles.detailColumn}>
                                <p>
                                    <strong>Email:</strong>{" "}
                                    {item?.lessor_email || "N/A"}
                                </p>
                                <p>
                                    <strong>Phone:</strong>{" "}
                                    {item?.lessor_phone || "N/A"}
                                </p>
                                <p>
                                    <strong>Nationality:</strong>{" "}
                                    {item?.nationality || "N/A"}
                                </p>
                            </div>
                        </div>
                        {renderActionButtons(item)}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderGridView = () => (
        <div className={styles.listings}>
            {filteredData?.map((item, i) => {
                const statusClass = item?.status
                    ? `status-${item.status.toLowerCase()}`
                    : "";

                return (
                    <div className={styles.listingItem} key={i}>
                        <div className={styles.listingContent}>
                            <div className={styles.listingTop}>
                                <h2>{item?.owner_name || "Unknown Owner"}</h2>
                            </div>
                            <span
                                className={`${styles.listingStatus} ${styles[statusClass]}`}
                                style={{
                                    backgroundColor:
                                        statusOptions.find(
                                            (s) =>
                                                s.value ===
                                                item?.status?.toLowerCase()
                                        )?.color || "#9E9E9E",
                                }}
                            >
                                {item?.status || "No Status"}
                            </span>

                            <ul>
                                <li>
                                    <span>Owner Info</span>
                                    <span>{item?.owner_info || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Lessor Name</span>
                                    <span>{item?.lessor_name || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Emirates ID</span>
                                    <span>
                                        {item?.lessor_emirates_id || "N/A"}
                                    </span>
                                </li>
                                <li>
                                    <span>License No</span>
                                    <span>{item?.license_no || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Email</span>
                                    <span>{item?.lessor_email || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Phone</span>
                                    <span>{item?.lessor_phone || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Agent</span>
                                    <span>{item?.agent_name || "N/A"}</span>
                                </li>
                                <li>
                                    <span>Nationality</span>
                                    <span>{item?.nationality || "N/A"}</span>
                                </li>
                            </ul>
                        </div>
                        {renderActionButtons(item)}
                    </div>
                );
            })}
        </div>
    );

    const renderTableView = () => {
        const sortedData = sortData(filteredData || [], sortConfig);

        return (
            <div
                className={styles.tableViewContainer}
                style={{ overflowX: "auto" }}
            >
                <table
                    className={styles.tableView}
                    style={{ fontSize: "15px", minWidth: "1200px" }}
                >
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.id}
                                    onClick={() =>
                                        column.sortable &&
                                        requestSort(column.id)
                                    }
                                    className={`${styles.tableHeader} ${column.sortable ? styles.sortable : ""} ${
                                        sortConfig.key === column.id
                                            ? styles.sorted
                                            : ""
                                    }`}
                                    style={{
                                        padding: "15px 20px",
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                    }}
                                >
                                    {column.label}
                                    {sortConfig.key === column.id && (
                                        <span className={styles.sortIcon}>
                                            {sortConfig.direction ===
                                            "ascending"
                                                ? " ↑"
                                                : " ↓"}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item, index) => (
                            <tr key={index} className={styles.tableRow}>
                                <td
                                    style={{
                                        padding: "12px 20px",
                                        fontWeight: "500",
                                        fontSize: "16px",
                                    }}
                                >
                                    {item.owner_name || "N/A"}
                                </td>
                                <td
                                    style={{
                                        padding: "12px 20px",
                                        fontSize: "16px",
                                    }}
                                >
                                    {item.owner_info || "N/A"}
                                </td>
                                <td
                                    style={{
                                        padding: "12px 20px",
                                        fontSize: "16px",
                                    }}
                                >
                                    {item.lessor_name || "N/A"}
                                </td>
                                <td
                                    style={{
                                        padding: "12px 20px",
                                        fontSize: "16px",
                                    }}
                                >
                                    {item.lessor_emirates_id || "N/A"}
                                </td>
                                <td
                                    style={{
                                        padding: "12px 20px",
                                        fontSize: "16px",
                                    }}
                                >
                                    {item.license_no || "N/A"}
                                </td>
                                <td
                                    style={{
                                        padding: "12px 20px",
                                        fontSize: "16px",
                                    }}
                                >
                                    {item.lessor_email || "N/A"}
                                </td>
                                <td
                                    style={{
                                        padding: "12px 20px",
                                        fontSize: "16px",
                                    }}
                                >
                                    {item.lessor_phone || "N/A"}
                                </td>
                                <td
                                    style={{
                                        padding: "12px 20px",
                                        fontSize: "16px",
                                    }}
                                >
                                    {item.nationality || "N/A"}
                                </td>
                                <td
                                    style={{
                                        padding: "12px 20px",
                                        fontSize: "16px",
                                    }}
                                >
                                    <span
                                        className={styles.listingStatus}
                                        style={{
                                            backgroundColor:
                                                statusOptions.find(
                                                    (s) =>
                                                        s.value ===
                                                        item?.status?.toLowerCase()
                                                )?.color || "#9E9E9E",
                                            fontSize: "16px",
                                            padding: "8px 12px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                                                <td style={{ padding: "12px 20px" }}>                                    {renderActionButtons(item)}                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <>
            <div className={styles.viewControls}>
                <OwnerActions
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    onAddOwner={onAddOwner}
                />
                <div className={styles.viewToggle}>
                    <button
                        className={`${styles.viewToggleButton} ${viewMode === "grid" ? styles.active : ""}`}
                        onClick={() => setViewMode("grid")}
                        title="Grid View"
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        className={`${styles.viewToggleButton} ${viewMode === "list" ? styles.active : ""}`}
                        onClick={() => setViewMode("list")}
                        title="List View"
                    >
                        <List size={20} />
                    </button>
                    <button
                        className={`${styles.viewToggleButton} ${viewMode === "table" ? styles.active : ""}`}
                        onClick={() => setViewMode("table")}
                        title="Table View"
                    >
                        <Table size={20} />
                    </button>
                </div>
            </div>

            {viewMode === "grid" && renderGridView()}
            {viewMode === "list" && renderListView()}
            {viewMode === "table" && renderTableView()}
        </>
    );
}

export default NewOwner;

// const SkeletonCard = () => {
//     return (
//         <div className={styles.skeletonCard}>
//             <div className={styles.skeletonHeader}>
//                 <div>
//                     <div className={styles.skeletonTitle}></div>
//                     <div className={styles.skeletonTimestamp}></div>
//                 </div>
//                 <div className={styles.skeletonActions}>
//                     <div className={styles.skeletonButton}></div>
//                     <div className={styles.skeletonButton}></div>
//                     <div className={styles.skeletonButton}></div>
//                 </div>
//             </div>

//             <div className={styles.skeletonField}>
//                 <div className={styles.skeletonLabel}></div>
//                 <div className={styles.skeletonValue}></div>
//             </div>
//             <div className={styles.skeletonField}>
//                 <div className={styles.skeletonLabel}></div>
//                 <div className={styles.skeletonValue}></div>
//             </div>
//             <div className={styles.skeletonField}>
//                 <div className={styles.skeletonLabel}></div>
//                 <div className={styles.skeletonValue}></div>
//             </div>
//             <div className={styles.skeletonField}>
//                 <div className={styles.skeletonLabel}></div>
//                 <div className={styles.skeletonValue}></div>
//             </div>
//         </div>
//     );
// };
