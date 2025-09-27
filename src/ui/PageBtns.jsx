import { useSearchParams } from "react-router-dom";
import styles from "./PageBtns.module.css";

// assuming that only 5 page btns will be visible (don't modify it)
const VISIBLE_PAGE_BTNS_COUNT = 5;

// Btns for first and last page will be visible explicitly, so 3 btns remain
const BTNS_REMAINING = VISIBLE_PAGE_BTNS_COUNT - 2;

function PageBtns({ totalPages, currentPage }) {
    const [searchParams, setSearchParams] = useSearchParams();

    function handlePageBtnClick(pageNum) {
        searchParams.set("page", pageNum);
        setSearchParams(searchParams);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (totalPages === 1) {
        return (
            <div className={styles.pageBtns}>
                <FirstPageBtn
                    currentPage={currentPage}
                    onPageBtnClick={handlePageBtnClick}
                />
            </div>
        );
    }

    if (totalPages <= VISIBLE_PAGE_BTNS_COUNT) {
        return (
            <div className={styles.pageBtns}>
                {Array.from({ length: totalPages }, (_, i) => {
                    const page = i + 1;
                    return (
                        <button
                            className={
                                currentPage === page ? styles.activePageBtn : ""
                            }
                            onClick={() => handlePageBtnClick(page)}
                            key={page}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={styles.pageBtns}>
            <FirstPageBtn
                currentPage={currentPage}
                onPageBtnClick={handlePageBtnClick}
            />

            {currentPage >= VISIBLE_PAGE_BTNS_COUNT - 1 && <span>...</span>}

            {Array.from({ length: BTNS_REMAINING }, (_, i) => {
                if (currentPage >= totalPages - 1) {
                    const page = totalPages - 1 - BTNS_REMAINING + i + 1;
                    return (
                        <button
                            className={
                                currentPage === page ? styles.activePageBtn : ""
                            }
                            onClick={() => handlePageBtnClick(page)}
                            key={page}
                        >
                            {page}
                        </button>
                    );
                }
                if (currentPage <= 2) {
                    const page = 2 + i;
                    return (
                        <button
                            className={
                                currentPage === page ? styles.activePageBtn : ""
                            }
                            onClick={() => handlePageBtnClick(page)}
                            key={page}
                        >
                            {page}
                        </button>
                    );
                }
                if (currentPage > 2) {
                    const page = currentPage + i - 1;
                    return (
                        <button
                            className={
                                currentPage === page ? styles.activePageBtn : ""
                            }
                            onClick={() => handlePageBtnClick(page)}
                            key={page}
                        >
                            {page}
                        </button>
                    );
                }
            })}

            {currentPage < totalPages - 2 && <span>...</span>}

            <LastPageBtn
                totalPages={totalPages}
                currentPage={currentPage}
                onPageBtnClick={handlePageBtnClick}
            />
        </div>
    );
}

function FirstPageBtn({ currentPage, onPageBtnClick }) {
    return (
        <button
            className={currentPage === 1 ? styles.activePageBtn : ""}
            onClick={() => onPageBtnClick(1)}
        >
            1
        </button>
    );
}

function LastPageBtn({ totalPages, currentPage, onPageBtnClick }) {
    return (
        <button
            className={currentPage === totalPages ? styles.activePageBtn : ""}
            onClick={() => onPageBtnClick(totalPages)}
        >
            {totalPages}
        </button>
    );
}

export default PageBtns;
