import { useState } from "react";
import { Modal, Box } from "@mui/material";
import { Brain, ExternalLink, Loader2 } from "lucide-react";
import { useAIPropertySuggestions } from "../Ai/useAIPropertySuggestions";
import styles from "./AIPropertySuggestions.module.css";
import Spinner from "../../ui/Spinner";

function AIPropertySuggestions({ leadId }) {
    const [open, setOpen] = useState(false);
    const { createPropertySuggestions, isPending, suggestions } =
        useAIPropertySuggestions();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAISuggestions = async () => {
        createPropertySuggestions({
            leadId,
            prompt: "Get me the best properties for this lead",
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-AE", {
            style: "currency",
            currency: "AED",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatLocation = (location) => {
        if (!location) return "Location details not available";
        const parts = [
            location?.community,
            location?.sub_community,
            location?.property_name,
        ].filter(Boolean);
        return parts.join(" - ") || "Location details not available";
    };

    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: 2,
        maxWidth: "90%",
        maxHeight: "80vh",
        overflowY: "auto",
        overflowX: "hidden",
    };

    return (
        <>
            <button className={styles.suggestionButton} onClick={handleOpen}>
                <Brain size={18} />
                AI Property Suggestions
            </button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="ai-suggestions-modal"
                aria-describedby="ai-property-suggestions"
            >
                <Box sx={modalStyle}>
                    <div className={styles.modalContent}>
                        <h3 style={{
                            marginBottom: "10px"
                        }}>
                            AI Property Suggestions
                        </h3>

                        {!isPending &&
                           (
                                <button
                                    className="btnSubmit"
                                    style={{
                                        marginBottom: "10px",
                                        margin: "0 auto",
                                        display: "block"
                                    }}
                                    onClick={handleAISuggestions}
                                >
                                    {!suggestions?.suggested_properties ||
                                        suggestions?.suggested_properties
                                            ?.length === 0 ?
                                        "Get Suggestions" : "Get New Suggestions"}
                                </button>
                            )}

                        {isPending && (
                            <div >
                                <Spinner />
                                <span style={{
                                    marginTop: "10px",
                                    display: "block"
                                }}>
                                    Analyzing lead preferences and finding
                                    matching properties...
                                </span>
                            </div>
                        )}

                        {!isPending &&
                            suggestions?.suggested_properties &&
                            suggestions?.suggested_properties?.length > 0 && (
                                <>
                                    <div className={styles.analysisSection}>
                                        <h3>Analysis Summary</h3>
                                        <div className={styles.analysisSummary}>
                                            {suggestions?.analysis_summary}
                                        </div>
                                    </div>
                                    <div className={styles.suggestionGrid}>
                                        {suggestions?.suggested_properties?.map(
                                            (property, index) => (
                                                <div
                                                    key={property?.property_id}
                                                    className={
                                                        styles.suggestionCard
                                                    }
                                                >
                                                    <h3
                                                        className={
                                                            styles.cardTitle
                                                        }
                                                    >
                                                        {property?.title}
                                                    </h3>
                                                    <p
                                                        className={
                                                            styles.cardLocation
                                                        }
                                                    >
                                                        {formatLocation(
                                                            property?.location
                                                        )}
                                                    </p>
                                                    <p
                                                        className={
                                                            styles.cardPrice
                                                        }
                                                    >
                                                        Price:{" "}
                                                        {formatPrice(
                                                            property?.price
                                                        )}
                                                    </p>
                                                    <div
                                                        className={
                                                            styles.propertyDetails
                                                        }
                                                    >
                                                        <p>
                                                            Bedrooms:{" "}
                                                            {property?.bedrooms ||
                                                                "Studio"}
                                                        </p>
                                                        <p>
                                                            Bathrooms:{" "}
                                                            {property?.bathrooms}
                                                        </p>
                                                        <p>
                                                            Size:{" "}
                                                            {property?.size}{" "}
                                                            sq.ft
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.matchInfo
                                                        }
                                                    >
                                                        <p>
                                                            Match Score:{" "}
                                                            {
                                                                property?.match_score
                                                            }
                                                            %
                                                        </p>
                                                        <div
                                                            className={
                                                                styles.matchReasons
                                                            }
                                                        >
                                                            <p>
                                                                Matching
                                                                Criteria:
                                                            </p>
                                                            <ul>
                                                                {property?.match_reasons?.map(
                                                                    (
                                                                        reason,
                                                                        idx
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            {
                                                                                reason
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={`/for-${property?.listing_type}/new-list/${property?.property_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={
                                                            styles.viewButton
                                                        }
                                                    >
                                                        View Property
                                                        <ExternalLink
                                                            size={16}
                                                        />
                                                    </a>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default AIPropertySuggestions;
