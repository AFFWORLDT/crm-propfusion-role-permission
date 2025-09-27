import { useNavigate } from "react-router-dom";
import { getApiUrl, getHostname } from "../../../utils/getApiUrl";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import { unSubscribePage, subscribePage, deletePageAccess } from "../../../services/apiIntegrations";

const cookies = new Cookies();

function FbIntegration() {
    const navigate = useNavigate();
    const apiUrl = getApiUrl();
    const organizationName = getHostname();
    const [connectedPages, setConnectedPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [importingPages, setImportingPages] = useState(new Set());
    const [actionPages, setActionPages] = useState(new Set());
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // { pageId, pageName }

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

    const handleSubscribe = async (pageId, pageName) => {
        setActionPages(prev => new Set([...prev, pageId]));
        try {
            await subscribePage(pageId);
            toast.success(`Subscribed to ${pageName}`);
            await fetchConnectedPages();
        } catch (error) {
            toast.error(`Failed to subscribe to ${pageName}`);
        } finally {
            setActionPages(prev => {
                const newSet = new Set(prev);
                newSet.delete(pageId);
                return newSet;
            });
        }
    };

    const handleDeletePage = async () => {
        if (!deleteTarget) return;
        setActionPages(prev => new Set([...prev, deleteTarget.pageId]));
        setShowDeleteModal(false);
        try {
            await deletePageAccess(deleteTarget.pageId);
            toast.success(
                <span style={{ color: '#fff', fontWeight: 600 }}>
                    <svg style={{ verticalAlign: 'middle', marginRight: 8 }} width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
                    Deleted page <b>{deleteTarget.pageName}</b>
                </span>,
                { style: { background: '#ef4444', color: '#fff' } }
            );
            await fetchConnectedPages();
        } catch (error) {
            toast.error(
                <span style={{ color: '#fff', fontWeight: 600 }}>
                    <svg style={{ verticalAlign: 'middle', marginRight: 8 }} width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>
                    Failed to delete page <b>{deleteTarget.pageName}</b>
                </span>,
                { style: { background: '#ef4444', color: '#fff' } }
            );
        } finally {
            setActionPages(prev => {
                const newSet = new Set(prev);
                newSet.delete(deleteTarget.pageId);
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
                                         margin: "0 0 0.5rem 0",
                                         display: 'flex',
                                         alignItems: 'center',
                                         gap: 8
                                     }}>
                                         {page.page_name}
                                         <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center' }}>
                                             <svg width="10" height="10" style={{ display: 'block' }}>
                                                 <circle cx="5" cy="5" r="5" fill={page.subscribed === true ? '#22c55e' : '#f87171'} />
                                             </svg>
                                         </span>
                                     </h4>
                                     <p style={{
                                         fontSize: "0.875rem",
                                         color: "#6b7280",
                                         margin: "0"
                                     }}>
                                         Last updated: {formatDate(page.updated_at)}
                                     </p>
                                 </div>
                                 <div style={{ display: "flex", gap: "0.5rem" }}>
                                 {/* Subscribe/Unsubscribe Button */}
                                 {page.subscribed === false ? (
                                     <button
                                         disabled={actionPages.has(page.page_id)}
                                         style={{
                                             backgroundColor: actionPages.has(page.page_id) ? "#9ca3af" : "#22c55e",
                                             color: "white",
                                             border: "none",
                                             borderRadius: "6px",
                                             padding: "0.5rem 1rem",
                                             fontSize: "0.875rem",
                                             fontWeight: "500",
                                             cursor: actionPages.has(page.page_id) ? "not-allowed" : "pointer",
                                             transition: "all 0.2s ease-in-out"
                                         }}
                                         onClick={() => handleSubscribe(page.page_id, page.page_name)}
                                     >
                                         {actionPages.has(page.page_id) ? "Subscribing..." : "Subscribe"}
                                     </button>
                                 ) : (
                                     <button
                                         disabled={importingPages.has(page.page_id)}
                                         style={{
                                             backgroundColor: importingPages.has(page.page_id) ? "#9ca3af" : "#ef4444",
                                             color: "white",
                                             border: "none",
                                             borderRadius: "6px",
                                             padding: "0.5rem 1rem",
                                             fontSize: "0.875rem",
                                             fontWeight: "500",
                                             cursor: importingPages.has(page.page_id) ? "not-allowed" : "pointer",
                                             transition: "all 0.2s ease-in-out"
                                         }}
                                         onClick={async () => {
                                             setImportingPages(prev => new Set([...prev, page.page_id]));
                                             try {
                                                 await unSubscribePage(page.page_id);
                                                 toast.success(`Unsubscribed from ${page.page_name}`);
                                                 await fetchConnectedPages();
                                             } catch (error) {
                                                 toast.error(`Failed to unsubscribe from ${page.page_name}`);
                                             } finally {
                                                 setImportingPages(prev => {
                                                     const newSet = new Set(prev);
                                                     newSet.delete(page.page_id);
                                                     return newSet;
                                                 });
                                             }
                                         }}
                                     >
                                         {importingPages.has(page.page_id) ? "Unsubscribing..." : "Unsubscribe"}
                                     </button>
                                 )}
                                 {/* Delete Page Button */}
                                 <button
                                     disabled={actionPages.has(page.page_id)}
                                     style={{
                                         backgroundColor: actionPages.has(page.page_id) ? "#9ca3af" : "#6b7280",
                                         color: "white",
                                         border: "none",
                                         borderRadius: "6px",
                                         padding: "0.5rem 1rem",
                                         fontSize: "0.875rem",
                                         fontWeight: "500",
                                         cursor: actionPages.has(page.page_id) ? "not-allowed" : "pointer",
                                         transition: "all 0.2s ease-in-out"
                                     }}
                                     onClick={() => {
                                         setDeleteTarget({ pageId: page.page_id, pageName: page.page_name });
                                         setShowDeleteModal(true);
                                     }}
                                 >
                                     {actionPages.has(page.page_id) ? "Deleting..." : "Remove Page"}
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
                      <h3 style={{ color: '#dc2626', marginBottom: 16 }}>Remove Page</h3>
                      <p style={{ color: '#374151', marginBottom: 24 }}>
                          Are you sure you want to <b>permanently delete</b> the page <b>{deleteTarget.pageName}</b>?<br/>This action cannot be undone.
                      </p>
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                          <button onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, border: 'none', background: '#e5e7eb', color: '#374151', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                          <button onClick={handleDeletePage} style={{ padding: '0.5rem 1.2rem', borderRadius: 6, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                      </div>
                  </div>
              </div>
          )}
        </>
      );
  }

export default FbIntegration;