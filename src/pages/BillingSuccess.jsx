import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { walletApi } from "../services/apiWallet";
import SectionTop from "../ui/SectionTop";
import { CheckCircle2 } from "lucide-react";

function BillingSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                await Promise.all([
                    walletApi.getWallet(),
                    walletApi.getSummary(),
                    walletApi.getSubscriptions("active"),
                ]);
            } catch (_) {
                // no-op
            }
        })();
    }, []);

    return (
        <div className="sectionContainer">
            <SectionTop heading="Payment successful" />
            <section className="sectionStyles" style={{ backgroundColor: "#ffffff" }}>
                <div className="sectionDiv" style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
                    <div style={{ textAlign: "center", maxWidth: 560 }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.2rem" }}>
                            <div style={{ background: "#ecfdf5", borderRadius: "999px", padding: "1.2rem", border: "1px solid #d1fae5" }}>
                                <CheckCircle2 size={56} color="#059669" />
                            </div>
                        </div>
                        <h1 style={{ margin: 0, fontSize: "2.4rem" }}>Payment successful</h1>
                        <p style={{ color: "#6b7280", fontSize: "1.4rem", marginTop: "0.8rem" }}>
                            Thank you. Your payment has been received. You can return to your Wallet to continue.
                        </p>
                        <div style={{ marginTop: "1.6rem" }}>
                            <button className="btn" onClick={() => navigate("/admin/general/organisation-wallet")}>Back to Wallet</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BillingSuccess;


