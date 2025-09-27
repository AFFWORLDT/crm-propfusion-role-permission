import React, { useState } from "react";
import { Star as StarIcon } from "@mui/icons-material";
import QualityScoreModal from "./QualityScoreModal";

function PropertyQualityScore({ qualityScoreDetails, propertyTitle, propertyId }) {
    const [open, setOpen] = useState(false);

    if (!qualityScoreDetails) return null;

    // Convert simple score to proper format for modal if needed
    const modalData = typeof qualityScoreDetails === 'number' ? {
        quality_score: qualityScoreDetails,
        max_score: 100,
        breakdown: {
            overall: {
                score: qualityScoreDetails,
                max: 100
            }
        },
        tips: []
    } : qualityScoreDetails;

    const handleOpen = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    // Display the score as a percentage
    const displayScore = typeof qualityScoreDetails === 'number' 
        ? `${qualityScoreDetails}%` 
        : `${qualityScoreDetails.quality_score}/${qualityScoreDetails.max_score}`;

    return (
        <>
            <div
                style={{
                    padding: '4px 8px',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#2e7d32',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid #c8e6c9'
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#c8e6c9';
                    e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#e8f5e9';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                onClick={handleOpen}
                title="Click to view detailed quality score analysis"
            >
                <StarIcon 
                    sx={{ 
                        fontSize: '14px',
                        color: '#2e7d32'
                    }} 
                />
                {displayScore}
            </div>
            <QualityScoreModal
                open={open}
                onClose={handleClose}
                qualityScoreDetails={modalData}
                propertyTitle={propertyTitle}
                propertyId={propertyId}
            />
        </>
    );
}

export default PropertyQualityScore; 