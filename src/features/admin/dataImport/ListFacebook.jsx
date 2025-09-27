import { useNavigate } from "react-router-dom";
import { getApiUrl, getHostname } from "../../../utils/getApiUrl";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function ListFacebook() {
    const navigate = useNavigate();
    const apiUrl = getApiUrl();
    const organizationName = getHostname();
    const [connectedPages, setConnectedPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importingPages, setImportingPages] = useState(new Set());

    const handleFacebookConnect = () => {
        window.open(`https://meta-login.propfusion.io/?org_name=${organizationName}`, '_blank');
    };

    const fetchConnectedPages = async () => {
        try {
            const token = cookies.get("USER")?.access_token;
            const response = await fetch(`${apiUrl}/connected-pages`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setConnectedPages(data.pages || []);
            } else {
                console.error('Failed to fetch connected pages');
            }
        } catch (error) {
            console.error('Error fetching connected pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImportLeads = async (pageId, pageName) => {
        setImportingPages(prev => new Set([...prev, pageId]));
        
        try {
            const token = cookies.get("USER")?.access_token;
            const response = await fetch(`${apiUrl}/sync-page-leads?page_id=${pageId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                toast.success(`Successfully imported leads from ${pageName}`);
            } else {
                toast.error(`Failed to import leads from ${pageName}`);
            }
        } catch (error) {
            console.error('Error importing leads:', error);
            toast.error(`Error importing leads from ${pageName}`);
        } finally {
            setImportingPages(prev => {
                const newSet = new Set(prev);
                newSet.delete(pageId);
                return newSet;
            });
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
        fetchConnectedPages();
    }, []);

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
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
                        backgroundColor: "#1877F2",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.5rem auto",
                        boxShadow: "0 4px 12px rgba(24, 119, 242, 0.3)"
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </div>
                    <h2 style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "0.5rem"
                    }}>
                        Facebook Integration
                    </h2>
                    <p style={{
                        color: "#6b7280",
                        fontSize: "1rem",
                        lineHeight: "1.5"
                    }}>
                        Connect your Facebook account to import leads and manage your social media presence
                    </p>
                </div>

                <button
                    onClick={handleFacebookConnect}
                    style={{
                        width: "100%",
                        backgroundColor: "#1877F2",
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
                        boxShadow: "0 2px 4px rgba(24, 119, 242, 0.2)"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#166fe5";
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.boxShadow = "0 4px 8px rgba(24, 119, 242, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#1877F2";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 4px rgba(24, 119, 242, 0.2)";
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Connect with Facebook
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
                         🔒 Your data is secure. We only access the information you authorize.
                     </p>
                 </div>
             </div>

             {/* Connected Pages Section */}
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
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                         <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                     </svg>
                     Connected Pages ({connectedPages.length})
                 </h3>

                 {loading ? (
                     <div style={{ textAlign: "center", padding: "2rem" }}>
                         <div style={{
                             width: "40px",
                             height: "40px",
                             border: "4px solid #f3f4f6",
                             borderTop: "4px solid #1877F2",
                             borderRadius: "50%",
                             animation: "spin 1s linear infinite",
                             margin: "0 auto"
                         }}></div>
                         <p style={{ color: "#6b7280", marginTop: "1rem" }}>Loading connected pages...</p>
                     </div>
                 ) : connectedPages.length === 0 ? (
                     <div style={{
                         textAlign: "center",
                         padding: "3rem 1rem",
                         color: "#6b7280"
                     }}>
                         <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ margin: "0 auto 1rem auto" }}>
                             <circle cx="12" cy="12" r="10"/>
                             <path d="m9 12 2 2 4-4"/>
                         </svg>
                         <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>No Connected Pages</p>
                         <p style={{ fontSize: "0.875rem" }}>Connect your Facebook account to see your pages here.</p>
                     </div>
                 ) : (
                     <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                         {connectedPages.map((page) => (
                             <div key={page._id} style={{
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
                                         margin: "0 0 0.5rem 0"
                                     }}>
                                         {page.page_name}
                                     </h4>
                                     <p style={{
                                         fontSize: "0.875rem",
                                         color: "#6b7280",
                                         margin: "0"
                                     }}>
                                         Last updated: {formatDate(page.updated_at)}
                                     </p>
                                 </div>
                                 <button
                                     onClick={() => handleImportLeads(page.page_id, page.page_name)}
                                     disabled={importingPages.has(page.page_id)}
                                     style={{
                                         backgroundColor: importingPages.has(page.page_id) ? "#9ca3af" : "#10b981",
                                         color: "white",
                                         border: "none",
                                         borderRadius: "6px",
                                         padding: "0.5rem 1rem",
                                         fontSize: "0.875rem",
                                         fontWeight: "500",
                                         cursor: importingPages.has(page.page_id) ? "not-allowed" : "pointer",
                                         transition: "all 0.2s ease-in-out",
                                         display: "flex",
                                         alignItems: "center",
                                         gap: "0.5rem"
                                     }}
                                     onMouseEnter={(e) => {
                                         if (!importingPages.has(page.page_id)) {
                                             e.target.style.backgroundColor = "#059669";
                                         }
                                     }}
                                     onMouseLeave={(e) => {
                                         if (!importingPages.has(page.page_id)) {
                                             e.target.style.backgroundColor = "#10b981";
                                         }
                                     }}
                                 >
                                     {importingPages.has(page.page_id) ? (
                                         <>
                                             <div style={{
                                                 width: "16px",
                                                 height: "16px",
                                                 border: "2px solid #ffffff",
                                                 borderTop: "2px solid transparent",
                                                 borderRadius: "50%",
                                                 animation: "spin 1s linear infinite"
                                             }}></div>
                                             Importing...
                                         </>
                                     ) : (
                                         <>
                                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                 <polyline points="7,10 12,15 17,10"/>
                                                 <line x1="12" y1="15" x2="12" y2="3"/>
                                             </svg>
                                             Import Leads
                                         </>
                                     )}
                                 </button>
                             </div>
                         ))}
                     </div>
                 )}
                           </div>
          </div>
        </>
      );
  }

export default ListFacebook; 