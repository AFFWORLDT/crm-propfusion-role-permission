import { useNavigate } from "react-router-dom";
import SectionTop from "../ui/SectionTop";
import { XCircle, ArrowLeft } from "lucide-react";

function BillingCancel() {
    const navigate = useNavigate();
    
    return (
        <div className="sectionContainer">
            <SectionTop heading="Payment Not Succeeded" />
            <section className="sectionStyles" style={{ backgroundColor: "#fef2f2" }}>
                <div className="sectionDiv" style={{ 
                    display: "grid", 
                    placeItems: "center", 
                    minHeight: "60vh",
                    textAlign: "center"
                }}>
                    <div style={{
                        background: "#fff",
                        padding: "4rem",
                        borderRadius: "1.2rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        maxWidth: "50rem",
                        width: "100%"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "2rem"
                        }}>
                            <div style={{
                                background: "#fee2e2",
                                borderRadius: "50%",
                                width: "8rem",
                                height: "8rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <XCircle size={48} color="#dc2626" />
                            </div>
                        </div>
                        
                        <h2 style={{
                            fontSize: "2.8rem",
                            fontWeight: "600",
                            color: "#1f2937",
                            marginBottom: "1.6rem"
                        }}>
                            Payment Not Succeeded
                        </h2>
                        
                        <p style={{
                            fontSize: "1.6rem",
                            color: "#6b7280",
                            lineHeight: "1.6",
                            marginBottom: "3rem"
                        }}>
                            Your payment was not completed successfully. This could be due to insufficient funds, 
                            payment method issues, or other technical problems. Please try again from your wallet.
                        </p>
                        
                        <div style={{
                            display: "flex",
                            gap: "1.2rem",
                            justifyContent: "center",
                            flexWrap: "wrap"
                        }}>
                            <button 
                                className="btn" 
                                onClick={() => navigate("/admin/general/organisation-wallet")}
                                style={{
                                    background: "linear-gradient(96.24deg, #6248ff, #ff4848 51%, #ff7a91 75%)",
                                    color: "#fff",
                                    padding: "1.2rem 2.4rem",
                                    fontSize: "1.6rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.8rem"
                                }}
                            >
                                <ArrowLeft size={20} />
                                Back to Wallet
                            </button>
                            
                            <button 
                                className="btn" 
                                onClick={() => navigate("/admin/general/subscription")}
                                style={{
                                    background: "#f3f4f6",
                                    color: "#374151",
                                    padding: "1.2rem 2.4rem",
                                    fontSize: "1.6rem"
                                }}
                            >
                                View Subscriptions
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BillingCancel;


