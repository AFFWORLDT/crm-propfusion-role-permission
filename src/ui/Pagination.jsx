import { useSearchParams } from "react-router-dom";
import styles from "./Pagination.module.css";
import { PAGE_SIZE } from "../utils/constants";
import PageBtns from "./PageBtns";

function Pagination({ totalSize, isLoading, PerPageOptions }) {
    const totalPages = Math.ceil(totalSize / PAGE_SIZE);
    const [searchParams, setSearchParams] = useSearchParams();


    const currentPage = !searchParams.get("page")
        ? 1
        : Number(searchParams.get("page"));

    const currentPageSize = !searchParams.get("size")
        ? PAGE_SIZE
        : Number(searchParams.get("size"));

    function handlePrevious() {
        if (currentPage > 1) {
            searchParams.set("page", currentPage - 1);
            setSearchParams(searchParams);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    function handleNext() {
        if (currentPage < totalPages) {
            searchParams.set("page", currentPage + 1);
            setSearchParams(searchParams);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    function handlePageSelect(e) {
        searchParams.set("page", Number(e.target.value));
        setSearchParams(searchParams);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }


    function handleSizeSelect(e) {
        const newSize = Number(e.target.value);
        searchParams.set("size", newSize);
        searchParams.set("page", 1);
        setSearchParams(searchParams);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (!totalSize) return;

    return (
        <div className={styles.pagination}>
            <span>Total: {totalSize}</span>

            <div className={styles.paginationBtns}>
                <button onClick={handlePrevious} disabled={isLoading}>
                    <img src="/icons/chevron-back.svg" alt="" />
                </button>

                <PageBtns totalPages={totalPages} currentPage={currentPage} />

                <button onClick={handleNext} disabled={isLoading}>
                    <img src="/icons/chevron-forward.svg" alt="" />
                </button>
            </div>

            <div className={styles.pageInfo}>
                <span>Go to</span>
                <select value={currentPage} onChange={handlePageSelect}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <option value={i + 1} key={i}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>
            {
                PerPageOptions && (
                    <div className={styles.pageSize}>
                        <span> Per page</span>
                        <select value={currentPageSize} onChange={handleSizeSelect}>
                            {PerPageOptions?.map((size) => (
                                <option value={size} key={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )
            }
        </div>
    );
}

export default Pagination;
