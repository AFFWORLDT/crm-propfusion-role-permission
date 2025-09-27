import { useState } from "react";
import styles from "./Listings.module.css";
import { AddAreeaTanStack } from "./usePropertyFinderListings"; // Assuming this hook handles the API call
import Spinner from "../../../ui/Spinner";

const ListingArea = ({ isInOnboarding = false }) => {
    const [selectedArea, setSelectedArea] = useState(""); // Store selected area

    // Destructure the necessary responses from the hook
    const { areaResponse, isPending, isError, error } = AddAreeaTanStack();

    // Function to handle adding an area
    const AreaHandle = (val) => {
        try {
            areaResponse(val);
        } catch (err) {
            console.error("Failed to add area", err);
        }
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
        <>
            <div
                style={
                    isInOnboarding
                        ? {
                              marginBottom: "2.8rem",
                              backgroundColor: "var(--clr-neutral-50)",
                              padding: "2.4rem",
                              borderRadius: "2rem",
                          }
                        : null
                }
                className={`container-fluid ${styles.listings}`}
            >
                <h3>Import Area</h3>

                <div className={styles.listingsFlex}>
                    <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="areas">UAE</option>
                        {/* Add more options as needed */}
                    </select>

                    <button onClick={handleClick} disabled={isPending}>
                        Import Area
                    </button>

                    {/* Show error message if an error occurs */}
                    {isError && <p>Error: {error.message}</p>}
                </div>
            </div>
        </>
    );
};

export default ListingArea;
