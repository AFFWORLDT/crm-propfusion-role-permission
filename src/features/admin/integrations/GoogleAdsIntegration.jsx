import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl, getHostname } from "../../../utils/getApiUrl";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import { 
    fetchGoogleAdsUsers, 
    removeGoogleAdsUserAccess 
} from "../../../services/apiIntegrations";

const cookies = new Cookies();

function GoogleAdsIntegration() {
    const navigate = useNavigate();
    const organizationName = getHostname();
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionUsers, setActionUsers] = useState(new Set());
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { googleId, email }

    const handleGoogleConnect = () => {
        window.open(`https://google-login.propfusion.io/?org_name=${organizationName}`, '_blank');
    };

    const fetchConnectedUsersData = async () => {
        try {
            const data = await fetchGoogleAdsUsers();
            setConnectedUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching connected Google Ads users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveUserAccess = async () => {
        if (!deleteTarget) return;
        setActionUsers(prev => new Set([...prev, deleteTarget.googleId]));
        setShowDeleteModal(false);
        try {
            await removeGoogleAdsUserAccess(deleteTarget.googleId);
            await fetchConnectedUsersData();
        } catch (error) {
            toast.error(
                <span style={{ color: '#fff', fontWeight: 600 }}>
                    <svg style={{ verticalAlign: 'middle', marginRight: 8 }} width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
                    Failed to remove access for <b>{deleteTarget.email}</b>
                </span>,
                { style: { background: '#ef4444', color: '#fff' } }
            );
        } finally {
            setActionUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(deleteTarget.googleId);
                return newSet;
            });
            setDeleteTarget(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        fetchConnectedUsersData();
    }, []);

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes googleGradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}
            </style>
            <div style={{ padding: "2rem" }}>
                <div style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    padding: "2.5rem",
                    maxWidth: "500px",
                    margin: "0 auto"
                }}>
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        <div style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient(45deg, #4285f4, #ea4335, #fbbc05, #34a853)",
                            backgroundSize: "400% 400%",
                            animation: "googleGradient 3s ease infinite",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 1.5rem auto",
                            boxShadow: "0 4px 12px rgba(66, 133, 244, 0.3)"
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        </div>
                        <h2 style={{
                            fontSize: "1.5rem",
                            fontWeight: "600",
                            color: "#1f2937",
                            marginBottom: "0.5rem"
                        }}>
                            Google Ads Integration
                        </h2>
                        <p style={{
                            color: "#6b7280",
                            fontSize: "1rem",
                            lineHeight: "1.5"
                        }}>
                            Connect your Google Ads account to manage users and track advertising data for your organization
                        </p>
                    </div>

                    <button
                        onClick={handleGoogleConnect}
                        style={{
                            width: "100%",
                            background: "linear-gradient(135deg, #4285f4 0%, #34a853 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            padding: "0.875rem 1.5rem",
                            fontSize: "1rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.75rem",
                            transition: "all 0.2s ease-in-out",
                            boxShadow: "0 2px 4px rgba(66, 133, 244, 0.2)"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = "linear-gradient(135deg, #3367d6 0%, #2d8f47 100%)";
                            e.target.style.transform = "translateY(-1px)";
                            e.target.style.boxShadow = "0 4px 8px rgba(66, 133, 244, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "linear-gradient(135deg, #4285f4 0%, #34a853 100%)";
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 2px 4px rgba(66, 133, 244, 0.2)";
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Connect with Google Ads
                    </button>

                    <div style={{
                        marginTop: "1.5rem",
                        padding: "1rem",
                        backgroundColor: "#f8fafc",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0"
                    }}>
                        <p style={{
                            fontSize: "0.875rem",
                            color: "#64748b",
                            margin: "0",
                            textAlign: "center"
                        }}>
                            🔒 Your data is secure. We only access the advertising data you authorize.
                        </p>
                    </div>
                </div>

                {/* Connected Users Section */}
                <div style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    padding: "2.5rem",
                    marginTop: "2rem"
                }}>
                    <h3 style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#4285f4">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        Connected Users ({connectedUsers.length})
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "2rem" }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                border: "4px solid #f3f4f6",
                                borderTop: "4px solid #4285f4",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite",
                                margin: "0 auto"
                            }}></div>
                            <p style={{ color: "#6b7280", marginTop: "1rem" }}>Loading connected users...</p>
                        </div>
                    ) : connectedUsers.length === 0 ? (
                        <div style={{
                            textAlign: "center",
                            padding: "3rem 1rem",
                            color: "#6b7280"
                        }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ margin: "0 auto 1rem auto" }}>
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="8.5" cy="7" r="4"/>
                                <path d="m22 2-5 10-5-5L22 2z"/>
                            </svg>
                            <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>No Connected Users</p>
                            <p style={{ fontSize: "0.875rem" }}>Connect your Google Ads account to see users here.</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {connectedUsers.map((user) => (
                                <div key={user._id} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "1.25rem",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    backgroundColor: "#fafafa"
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{
                                            fontSize: "1rem",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0 0 0.5rem 0",
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#4285f4">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                            {user.email}
                                            <span style={{
                                                marginLeft: 8,
                                                padding: "2px 8px",
                                                backgroundColor: "#22c55e",
                                                color: "white",
                                                borderRadius: "12px",
                                                fontSize: "0.75rem",
                                                fontWeight: "500"
                                            }}>
                                                Active
                                            </span>
                                        </h4>
                                        <div style={{
                                            fontSize: "0.875rem",
                                            color: "#6b7280",
                                            margin: "0"
                                        }}>
                                            <p style={{ margin: "0 0 0.25rem 0" }}>Google ID: {user.google_id}</p>
                                            {user.created_at && (
                                                <p style={{ margin: "0" }}>Connected: {formatDate(user.created_at)}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        {/* Remove User Access Button */}
                                        <button
                                            disabled={actionUsers.has(user.google_id)}
                                            style={{
                                                backgroundColor: actionUsers.has(user.google_id) ? "#9ca3af" : "#ef4444",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "6px",
                                                padding: "0.5rem 1rem",
                                                fontSize: "0.875rem",
                                                fontWeight: "500",
                                                cursor: actionUsers.has(user.google_id) ? "not-allowed" : "pointer",
                                                transition: "all 0.2s ease-in-out"
                                            }}
                                            onClick={() => {
                                                setDeleteTarget({ googleId: user.google_id, email: user.email });
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            {actionUsers.has(user.google_id) ? "Removing..." : "Remove Access"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deleteTarget && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.35)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ background: '#fff', borderRadius: 10, padding: 32, minWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
                        <h3 style={{ color: '#dc2626', marginBottom: 16 }}>Remove User Access</h3>
                        <p style={{ color: '#374151', marginBottom: 24 }}>
                            Are you sure you want to <b>permanently remove access</b> for <b>{deleteTarget.email}</b>?<br/>
                            This will delete all user data and cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                            <button onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, border: 'none', background: '#e5e7eb', color: '#374151', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleRemoveUserAccess} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Remove Access</button>
                        </div>
                    </div>
        </div>
            )}
        </>
    );
}

export default GoogleAdsIntegration;