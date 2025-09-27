import styles from "./../../styles/Audience.module.css";

const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    pageSize, 
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50]
}) => {
    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        onPageChange(pageNumber);
    };

    const handleSizeChange = (event) => {
        onPageSizeChange(Number(event.target.value));
    };

    return (
        <>
            <div className={styles.pagination}>
                <button 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                
                <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                            key={pageNumber}
                            className={currentPage === pageNumber ? styles.activePage : ''}
                            onClick={() => handlePageClick(pageNumber)}
                            disabled={currentPage === pageNumber}
                        >
                            {pageNumber}
                        </button>
                    ))}
                </div>
                
                <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
            
            <div className={styles.sizeSelector}>
                <label htmlFor="pageSize">Items per page:</label>
                <select
                    id="pageSize"
                    value={pageSize}
                    onChange={handleSizeChange}
                >
                    {pageSizeOptions.map(size => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default Pagination;