import styles from "./ExtraFilters.module.css";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

function ExtraFilters({ buttonOptions, totalSize, leadType }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const savedStatus = localStorage.getItem("projectStatus");
    
    // If there's no status in URL but exists in localStorage, add it to URL
    useEffect(() => {
        if (!searchParams.has("status") && savedStatus) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set("status", savedStatus);
            setSearchParams(newSearchParams);
        }
    }, [searchParams, savedStatus, setSearchParams]);

    // Get status from URL or localStorage or default to "ACTIVE"
    const currentStatus = searchParams.get("status") ?? savedStatus ?? "ACTIVE";

    // Keep localStorage and URL params in sync
    useEffect(() => {
        // Handle reset case
        if ([...searchParams.entries()].length === 0) {
            localStorage.removeItem("projectStatus");
            // Ensure status is set to ACTIVE in URL after reset
            const newSearchParams = new URLSearchParams();
            newSearchParams.set("status", "ACTIVE");
            setSearchParams(newSearchParams);
            return;
        }

        const status = searchParams.get("status");
        if (status) {
            localStorage.setItem("projectStatus", status);
        }
    }, [searchParams, setSearchParams]);

    function handleStatus(status) {
        // Save status to both localStorage and URL
        localStorage.setItem("projectStatus", status);
        
        // Update URL params while preserving other params
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("status", status);
        newSearchParams.set("page", 1);
        setSearchParams(newSearchParams);
    }

    return (
        <div className={styles.extraFilters}>
            <div className={styles.filterButtons}>
                {leadType !== "UNDEFINED"
                    ? buttonOptions.map((options) => (
                          <button
                              key={options.value}
                              className={`${styles.btnActive} ${
                                  currentStatus === options.value
                                      ? styles.activeStatusBtn
                                      : ""
                              }`}
                              onClick={() => handleStatus(options.value)}
                          >
                              {currentStatus === options.value
                                  ? `${options.label} (${totalSize ?? ""})`
                                  : options.label}
                          </button>
                      ))
                    : null}
            </div>
        </div>
    );
}

export default ExtraFilters;
