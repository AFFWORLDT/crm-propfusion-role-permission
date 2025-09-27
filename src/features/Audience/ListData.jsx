import  { useState } from 'react';
import styles from "./../../styles/Audience.module.css";
import { Trash2, Edit2 } from "lucide-react";
import EmailPopup from './EmailPopup';
import useAudiences from './useAudince';
import Pagination from './Pagination';

function ListData({
    handleDeleteClick,
    handleEdit,
    audienceType
}) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState(null); // Add this state for selected emails
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { isLoading, data, error } = useAudiences(currentPage, pageSize,audienceType);

    const openPopup = (emails) => {
        setSelectedEmails(emails);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedEmails(null);
    };

    const totalPages = data?.pages || 1;  
  
  

    if (isLoading) {
        return (
            <div className={styles.dotsLoader}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
            </div>
        );
    }

    if (error) {
        return <p style={{ color: "red" }}>Error: {error.message}</p>;
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {/* <th>Affiliate ID</th>
                        <th>Name</th> */}
                        <th>Emails</th>
                        <th>Audience Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.items?.map((audience) => (
                        <tr key={audience.id}>
                            {/* <td>{audience.id}</td>
                            <td>{audience.name}</td> */}
                            <td
                                onClick={() => openPopup(audience.emails)}
                                style={{
                                    cursor: "pointer",
                                    color: "blue",
                                }}
                            >
                                Emails (Click to view)
                            </td>
                            <td>{audience.audience_type}</td>
                            <td className={styles.actionCell}>
                                <button
                                    className={`${styles.editButton}`}
                                    onClick={() => handleEdit(audience)}
                                >
                                    <Edit2 className={`${styles.icon} ${styles.iconSmall}`} />
                                    Edit
                                </button>
                                <button
                                    className={`${styles.deleteButton}`}
                                    onClick={() => handleDeleteClick(audience)}
                                >
                                    <Trash2 className={`${styles.icon} ${styles.iconSmall}`} />
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Move EmailPopup outside of the table */}
            {isPopupOpen && selectedEmails && (
                <EmailPopup
                    emails={selectedEmails}
                    onClose={closePopup}
                />
            )}

            {/* Pagination Controls */}
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[5, 10, 20, 50]} // Optional
        />
        </div>
    );
}

export default ListData;