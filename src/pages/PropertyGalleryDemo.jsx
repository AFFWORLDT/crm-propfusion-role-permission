import React, { useState, useEffect } from 'react';
import PropertyGallerySlideshow from '../components/PropertyGallerySlideshow';
import { getApiUrl } from '../utils/getApiUrl';

const PropertyGalleryDemo = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch properties for the slideshow - increased limit to show more properties
            const response = await fetch(`${getApiUrl()}/properties/get_properties_for_sharing?limit=50`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }

            const data = await response.json();
            
            if (data.properties && data.properties.length > 0) {
                setProperties(data.properties);
            } else {
                // Fallback to sample data if API returns empty
                setProperties(getSampleProperties());
            }
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError(err.message);
            // Use sample data as fallback
            setProperties(getSampleProperties());
        } finally {
            setIsLoading(false);
        }
    };

    const getSampleProperties = () => {
        return [
            {
                id: 1,
                title: "Luxury Penthouse in Dubai Marina",
                description: "Stunning 3-bedroom penthouse with panoramic views of Dubai Marina. Features high-end finishes, private terrace, and access to premium amenities including infinity pool and 24/7 concierge service.",
                price: 2500000,
                listingType: "SELL",
                property_type: "PENTHOUSE",
                status: "ACTIVE",
                bedRooms: 3,
                bathrooms: "3",
                size: 2500,
                completionStatus: "Ready",
                createTime: "2024-01-15T10:00:00Z",
                photos: [
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1560448204-60396e136b25?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1560448204-60396e136b26?w=1200&h=800&fit=crop"
                ],
                amenities: ["Private Pool", "Gym", "Concierge", "Security", "Parking", "Private Terrace"],
                location: {
                    city: "Dubai",
                    community: "Dubai Marina",
                    sub_community: "Marina Heights",
                    property_name: "Marina Heights Tower"
                }
            },
            {
                id: 2,
                title: "Modern Villa in Palm Jumeirah",
                description: "Contemporary 5-bedroom villa with private beach access. Features open-plan living, gourmet kitchen, landscaped gardens, and smart home technology throughout.",
                price: 8500000,
                listingType: "SELL",
                property_type: "VILLA",
                status: "ACTIVE",
                bedRooms: 5,
                bathrooms: "6",
                size: 4500,
                completionStatus: "Ready",
                createTime: "2024-02-20T14:30:00Z",
                photos: [
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc7?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc8?w=1200&h=800&fit=crop"
                ],
                amenities: ["Private Beach", "Pool", "Garden", "Security", "Smart Home", "Gourmet Kitchen"],
                location: {
                    city: "Dubai",
                    community: "Palm Jumeirah",
                    sub_community: "Palm Tower",
                    property_name: "Ocean View Villa"
                }
            },
            {
                id: 3,
                title: "Premium Apartment in Downtown Dubai",
                description: "Luxurious 2-bedroom apartment in the heart of Downtown Dubai. Walking distance to Burj Khalifa and Dubai Mall. Features city views and premium finishes.",
                price: 1800000,
                listingType: "SELL",
                property_type: "APARTMENT",
                status: "ACTIVE",
                bedRooms: 2,
                bathrooms: "2",
                size: 1800,
                completionStatus: "Ready",
                createTime: "2024-03-10T09:15:00Z",
                photos: [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93689?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93690?w=1200&h=800&fit=crop"
                ],
                amenities: ["City View", "Balcony", "Gym", "Pool", "Security", "Concierge"],
                location: {
                    city: "Dubai",
                    community: "Downtown Dubai",
                    sub_community: "Burj Views",
                    property_name: "Burj Views Tower"
                }
            },
            {
                id: 4,
                title: "Elegant Townhouse in Emirates Hills",
                description: "Spacious 4-bedroom townhouse with golf course views. Features modern architecture, premium finishes, and access to community amenities.",
                price: 4200000,
                listingType: "SELL",
                property_type: "TOWNHOUSE",
                status: "ACTIVE",
                bedRooms: 4,
                bathrooms: "4",
                size: 3200,
                completionStatus: "Ready",
                createTime: "2024-01-28T16:45:00Z",
                photos: [
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc7?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc8?w=1200&h=800&fit=crop"
                ],
                amenities: ["Golf Course View", "Garden", "Garage", "Security", "Community Pool", "Gym"],
                location: {
                    city: "Dubai",
                    community: "Emirates Hills",
                    sub_community: "Golf Views",
                    property_name: "Golf Views Estate"
                }
            },
            {
                id: 5,
                title: "Luxury Rental in JBR",
                description: "Premium 3-bedroom apartment for rent in Jumeirah Beach Residence. Beachfront location with stunning sea views and access to beach amenities.",
                price: 85000,
                listingType: "RENT",
                priceType: "Year",
                property_type: "APARTMENT",
                status: "ACTIVE",
                bedRooms: 3,
                bathrooms: "3",
                size: 2200,
                completionStatus: "Ready",
                createTime: "2024-02-15T11:20:00Z",
                photos: [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93689?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93690?w=1200&h=800&fit=crop"
                ],
                amenities: ["Beach Access", "Sea View", "Balcony", "Gym", "Pool", "Beach Club"],
                location: {
                    city: "Dubai",
                    community: "JBR",
                    sub_community: "Beach Vista",
                    property_name: "Beach Vista Tower"
                }
            },
            {
                id: 6,
                title: "Modern Studio in Business Bay",
                description: "Contemporary studio apartment perfect for young professionals. Features modern design, smart home technology, and business district location.",
                price: 45000,
                listingType: "RENT",
                priceType: "Year",
                property_type: "STUDIO",
                status: "ACTIVE",
                bedRooms: 0,
                bathrooms: "1",
                size: 650,
                completionStatus: "Ready",
                createTime: "2024-03-05T13:10:00Z",
                photos: [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93689?w=1200&h=800&fit=crop"
                ],
                amenities: ["Smart Home", "Gym", "Pool", "Security", "Business Center", "Parking"],
                location: {
                    city: "Dubai",
                    community: "Business Bay",
                    sub_community: "Bay Central",
                    property_name: "Bay Central Tower"
                }
            },
            {
                id: 7,
                title: "Family Villa in Arabian Ranches",
                description: "Spacious 6-bedroom family villa with private garden and pool. Perfect for large families seeking privacy and community living.",
                price: 6500000,
                listingType: "SELL",
                property_type: "VILLA",
                status: "ACTIVE",
                bedRooms: 6,
                bathrooms: "7",
                size: 5800,
                completionStatus: "Ready",
                createTime: "2024-01-10T08:30:00Z",
                photos: [
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc7?w=1200&h=800&fit=crop"
                ],
                amenities: ["Private Garden", "Pool", "Gym", "Security", "Community Center", "Schools Nearby"],
                location: {
                    city: "Dubai",
                    community: "Arabian Ranches",
                    sub_community: "Golf Course",
                    property_name: "Golf Course Villa"
                }
            },
            {
                id: 8,
                title: "Luxury Penthouse in DIFC",
                description: "Exclusive 4-bedroom penthouse in Dubai International Financial Centre. Features panoramic city views and premium amenities.",
                price: 12000000,
                listingType: "SELL",
                property_type: "PENTHOUSE",
                status: "ACTIVE",
                bedRooms: 4,
                bathrooms: "5",
                size: 3800,
                completionStatus: "Ready",
                createTime: "2024-02-28T15:45:00Z",
                photos: [
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1560448204-60396e136b25?w=1200&h=800&fit=crop"
                ],
                amenities: ["City Views", "Private Terrace", "Gym", "Concierge", "Security", "Valet Parking"],
                location: {
                    city: "Dubai",
                    community: "DIFC",
                    sub_community: "Financial Center",
                    property_name: "DIFC Tower"
                }
            },
            {
                id: 9,
                title: "Cozy 2BR in JLT",
                description: "Perfect 2-bedroom apartment in Jumeirah Lake Towers. Great for families with lake views and community amenities.",
                price: 65000,
                listingType: "RENT",
                priceType: "Year",
                property_type: "APARTMENT",
                status: "ACTIVE",
                bedRooms: 2,
                bathrooms: "2",
                size: 1400,
                completionStatus: "Ready",
                createTime: "2024-03-12T10:30:00Z",
                photos: [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93689?w=1200&h=800&fit=crop"
                ],
                amenities: ["Lake View", "Balcony", "Gym", "Pool", "Security", "Parking"],
                location: {
                    city: "Dubai",
                    community: "JLT",
                    sub_community: "Lake View",
                    property_name: "Lake View Residences"
                }
            },
            {
                id: 10,
                title: "Premium Villa in Emirates Hills",
                description: "Luxurious 7-bedroom villa with private cinema and wine cellar. Ultimate luxury living with premium finishes.",
                price: 15000000,
                listingType: "SELL",
                property_type: "VILLA",
                status: "ACTIVE",
                bedRooms: 7,
                bathrooms: "8",
                size: 8500,
                completionStatus: "Ready",
                createTime: "2024-01-05T12:00:00Z",
                photos: [
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc7?w=1200&h=800&fit=crop"
                ],
                amenities: ["Private Cinema", "Wine Cellar", "Pool", "Gym", "Security", "Private Garden"],
                location: {
                    city: "Dubai",
                    community: "Emirates Hills",
                    sub_community: "Luxury Estates",
                    property_name: "Luxury Estates Villa"
                }
            }
        ];
    };

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '1.5rem',
                color: '#666',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        border: '4px solid #ffd700', 
                        borderTop: '4px solid transparent', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }}></div>
                    <p>Loading Enhanced Property Gallery...</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    if (error && properties.length === 0) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                color: 'white'
            }}>
                <h2>Error Loading Properties</h2>
                <p>{error}</p>
                <button 
                    onClick={fetchProperties}
                    style={{
                        padding: '1rem 2rem',
                        backgroundColor: '#ffd700',
                        color: '#000',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600'
                    }}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            <PropertyGallerySlideshow 
                properties={properties}
                autoPlay={true}
                interval={7000}
                showInfiniteScroll={true}
                itemsPerPage={20}
            />
        </div>
    );
};

export default PropertyGalleryDemo;
