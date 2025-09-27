import React, { useEffect, useState } from 'react';
import { Dialog } from '@mui/material';
import {
    Close as CloseIcon,
    Star as StarIcon,
    Description as DescriptionIcon,
    Image as ImageIcon,
    PhotoLibrary as PhotoLibraryIcon,
    PhotoSizeSelectLarge as PhotoSizeIcon,
    CheckCircle as CheckCircleIcon,
    LocationOn as LocationIcon,
    Title as TitleIcon,
    VerifiedUser as VerifiedUserIcon,
    Info as InfoIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import styles from './QualityScoreModal.module.css';
import { getApiUrl } from '../../utils/getApiUrl';
import { checkUnauthorized } from '../../utils/utils';  
import Cookies from 'universal-cookie';

const QualityScoreModal = ({ open, onClose, propertyTitle, propertyId }) => {
    const [qualityScoreDetails, setQualityScoreDetails] = useState(null);
    const cookies = new Cookies();

    useEffect(() => {
        const fetchQualityScore = async () => {
            if (!propertyId) return;
            
            try {
                const response = await fetch(`${getApiUrl()}/properties/get_quality_score/${propertyId}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${cookies.get("USER").access_token}`
                    }
                });
                
                checkUnauthorized(response.status, cookies);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch quality score');
                }

                const data = await response.json();
                
                // Transform the data to match our component's expected format
                const transformedData = {
                    quality_score: data.total_score,
                    max_score: 100,
                    breakdown: {},
                    tips: []
                };

                // Transform breakdown scores
                Object.entries(data.breakdown).forEach(([key, value]) => {
                    let scoreStr, reason;
                    if (typeof value === 'string') {
                        scoreStr = value;
                        reason = undefined;
                    } else if (typeof value === 'object' && value !== null) {
                        scoreStr = value.score;
                        reason = value.reason;
                    }
                    if (scoreStr) {
                        const [score, max] = scoreStr.split('/');
                        transformedData.breakdown[key] = {
                            score: parseFloat(score),
                            max: parseFloat(max),
                            reason: reason || ''
                        };
                    }
                });

                setQualityScoreDetails(transformedData);
            } catch (error) {
                console.error('Error fetching quality score:', error);
            }
        };

        if (open && propertyId) {
            fetchQualityScore();
        }
    }, [propertyId, open]);

    if (!qualityScoreDetails || !propertyId) return null;

    const {
        quality_score = 0,
        max_score = 100,
        breakdown = {},
        tips = []
    } = qualityScoreDetails;

    if (typeof breakdown !== 'object' || breakdown === null) {
        console.error('Invalid breakdown data in qualityScoreDetails');
        return null;
    }

    const percentage = max_score > 0 ? (quality_score / max_score) * 100 : 0;

    const getScoreColor = (score, max) => {
        const percentage = max > 0 ? (score / max) * 100 : 0;
        if (percentage >= 80) return '#4caf50';
        if (percentage >= 60) return '#ff9800';
        return '#f44336';
    };

    const getScoreIcon = (category) => {
        switch (category) {
            case 'description':
                return <DescriptionIcon sx={{ fontSize: 22 }} />;
            case 'image_count':
            case 'images':
                return <ImageIcon sx={{ fontSize: 22 }} />;
            case 'image_diversity':
                return <PhotoLibraryIcon sx={{ fontSize: 22 }} />;
            case 'image_duplicates':
                return <CheckCircleIcon sx={{ fontSize: 22 }} />;
            case 'image_dimensions':
                return <PhotoSizeIcon sx={{ fontSize: 22 }} />;
            case 'listing_completion':
                return <CheckCircleIcon sx={{ fontSize: 22 }} />;
            case 'location':
                return <LocationIcon sx={{ fontSize: 22 }} />;
            case 'title':
                return <TitleIcon sx={{ fontSize: 22 }} />;
            case 'listing_verification':
                return <VerifiedUserIcon sx={{ fontSize: 22 }} />;
            default:
                return <InfoIcon sx={{ fontSize: 22 }} />;
        }
    };

    const getCategoryLabel = (category) => {
        const labels = {
            description: 'Description',
            title: 'Title',
            location: 'Location',
            listing_completion: 'Listing Completion',
            listing_verification: 'Listing Verification',
            // Image related categories grouped together
            images: '📸 Images Overview',
            image_count: '📸 Number of Images',
            image_diversity: '📸 Image Variety',
            image_duplicates: '📸 Unique Images',
            image_dimensions: '📸 Image Quality'
        };
        return labels[category] || category;
    };

    const getCategoryDescription = (category) => {
        const descriptions = {
            description: 'Quality and completeness of property description',
            title: 'Quality and relevance of listing title',
            location: 'Accuracy and detail of location information',
            listing_completion: 'Completeness of listing information',
            listing_verification: 'Verification status of listing details',
            // Image related descriptions grouped together
            images: 'Overall image score for the property',
            image_count: 'Number of property images uploaded',
            image_diversity: 'Different views and angles of the property',
            image_duplicates: 'No duplicate or similar images detected',
            image_dimensions: 'High resolution and properly sized images'
        };
        return descriptions[category] || 'Quality metric for this category';
    };

    // Add a function to sort categories so image-related ones appear together
    const sortCategories = (categories) => {
        const order = {
            images: 1,
            image_count: 2,
            image_diversity: 3,
            image_duplicates: 4,
            image_dimensions: 5,
            title: 6,
            description: 7,
            location: 8,
            listing_completion: 9,
            listing_verification: 10
        };
        
        return categories.sort((a, b) => (order[a] || 100) - (order[b] || 100));
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
        >
            <div className={styles.modalHeader}>
                <div className={styles.headerContent}>
                    <StarIcon />
                    <div>
                        <h2 className={styles.headerTitle}>Quality Score Analysis</h2>
                        <p className={styles.headerSubtitle}>{propertyTitle}</p>
                    </div>
                </div>
                <button className={styles.closeButton} onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>

            <div className={styles.modalContent}>
                {/* Overall Score Section */}
                <div className={styles.scoreCard}>
                    <div className={styles.scoreHeader}>
                        <h3 className={styles.scoreTitle}>Overall Score</h3>
                        <div 
                            className={styles.scoreChip}
                            style={{ 
                                backgroundColor: percentage >= 80 ? '#4caf50' : percentage >= 60 ? '#ff9800' : '#f44336',
                                color: 'white'
                            }}
                        >
                            <StarIcon />
                            {quality_score}/{max_score}
                        </div>
                    </div>
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFill}
                            style={{ 
                                width: `${percentage}%`,
                                backgroundColor: getScoreColor(quality_score, max_score)
                            }}
                        />
                    </div>
                    <p className={styles.progressText}>{percentage.toFixed(1)}% completion rate</p>
                </div>

                {/* Breakdown Section */}
                <h3 className={styles.sectionTitle}>
                    <TrendingUpIcon style={{ color: '#1976d2' }} />
                    Detailed Breakdown
                </h3>

                <div className={styles.breakdownGrid}>
                    {sortCategories(Object.keys(breakdown)).map(category => (
                        <div key={category} className={styles.categoryCard}>
                            <div className={styles.categoryHeader}>
                                <span style={{ color: getScoreColor(breakdown[category].score, breakdown[category].max) }}>
                                    {getScoreIcon(category)}
                                </span>
                                <h4 className={styles.categoryTitle}>{getCategoryLabel(category)}</h4>
                            </div>
                            <p className={styles.categoryDescription}>
                                {getCategoryDescription(category)}
                            </p>
                            <div className={styles.categoryScore}>
                                <strong>{breakdown[category].score}/{breakdown[category].max}</strong>
                                <span>({((breakdown[category].score / breakdown[category].max) * 100).toFixed(0)}%)</span>
                            </div>
                            {/* Show reason if present */}
                            {breakdown[category].reason && (
                                <div className={styles.categoryReason} style={{ color: '#1976d2', fontSize: '0.95em', marginTop: 4 }}>
                                    {breakdown[category].reason}
                                </div>
                            )}
                            <div className={styles.progressBar}>
                                <div 
                                    className={styles.progressFill}
                                    style={{ 
                                        width: `${(breakdown[category].score / breakdown[category].max) * 100}%`,
                                        backgroundColor: getScoreColor(breakdown[category].score, breakdown[category].max)
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tips Section */}
                {tips && tips.length > 0 && (
                    <>
                        <div className={styles.divider} />
                        <h3 className={styles.sectionTitle}>
                            <InfoIcon style={{ color: '#2196f3' }} />
                            Improvement Tips
                        </h3>
                        <div className={styles.tipsList}>
                            {tips.map((tip, index) => (
                                <div key={index} className={styles.tipChip}>
                                    <InfoIcon />
                                    {tip}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className={styles.modalActions}>
                <button onClick={onClose} className={styles.closeBtn}>
                    Close
                </button>
            </div>
        </Dialog>
    );
};

export default QualityScoreModal;