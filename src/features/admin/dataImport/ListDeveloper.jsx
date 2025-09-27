import { useState } from "react";
import styles from "./Listings.module.css";
import { AddAreeaTanStack } from "./usePropertyFinderListings"; // Assuming this hook handles the API call
import Spinner from "../../../ui/Spinner";

const ListDeveloper = ({ isInOnboarding = false }) => {
    const [selectedArea, setSelectedArea] = useState(""); // Store selected area
    const { areaResponse, isPending, isError, error } = AddAreeaTanStack(); // Assuming these come from your hook

    // Function to handle adding a developer area
    const AreaHandle = (val) => {
        areaResponse(val);
    };

    // Handle selection change
    const handleClick = () => {
        // Call AreaHandle function with selected area
        if (selectedArea) {
            AreaHandle(selectedArea);
        }
    };

    if (isPending && !isInOnboarding) return <Spinner type="fullPage" />;

    return (
        <div
            style={
                isInOnboarding
                    ? {
                          backgroundColor: "var(--clr-neutral-50)",
                          padding: "2.4rem",
                          borderRadius: "2rem",
                      }
                    : null
            }
            className={styles.listings}
        >
            <h3>Import Developers</h3>

            <div className={styles.listingsFlex}>
                <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                >
                    <option value="">Select </option>
                    <option value="developers">UAE</option>
                    {/* Add more options as needed */}
                </select>

                <button onClick={handleClick} disabled={isPending}>
                    Import Developers
                </button>

                {/* Show error message if an error occurs */}
                {isError && <p>Error: {error.message}</p>}
            </div>
        </div>
    );
};

export default ListDeveloper;
