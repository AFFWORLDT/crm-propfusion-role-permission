import { useEffect, useState, useRef } from "react";
import styles from "./Profile.module.css";
import SectionTop from "../ui/SectionTop";
import { useAuth } from "../context/AuthContext";
import useStaff from "../features/admin/staff/useStaff";
import toast from "react-hot-toast";
import useTeam from "../features/admin/teams/useTeam";
import Spinner from "../ui/Spinner";

import { useNavigate } from "react-router-dom";

import "react-image-crop/dist/ReactCrop.css";

import { getAgentWalletBalance, getAgentPayouts } from "../services/apiWalletNew";
import { getAgentWalletTransactions } from "../services/apiWalletNew";
import { createPayout as createPayoutApi } from "../services/apiWalletNew";
import { useQuery } from "@tanstack/react-query";
import useAllDetails from "../features/all-details/useAllDetails";

function Wallet() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("transactions");
    const { currentUser } = useAuth();
    const { data: userData, isLoading, error } = useStaff(currentUser?.id);
    const { data: teamData } = useTeam(userData?.team);
    const {data}=useAllDetails()
    const colorCode = data?.company_settings?.sidebar_color_code || "#020079";

    const [walletBalance, setWalletBalance] = useState(0);
    const [walletTransactions, setWalletTransactions] = useState([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const  [currency, setCurrency] = useState("AED");
    const [walletPayouts, setWalletPayouts] = useState([]);
    const [totalPayouts, setTotalPayouts] = useState(0);
    const [isPayoutOpen, setIsPayoutOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [payoutForm, setPayoutForm] = useState({ amount: "", currency: "AED", note: "" });


   
    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const  getWalletBalance = async () => {
        try {
            const response = await getAgentWalletBalance();
            setWalletBalance(response.current_balance);
            setCurrency(response.currency);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const  getWalletTransactions = async () => {
        try {
            const response = await getAgentWalletTransactions(page, size);

            setWalletTransactions(response.items);
            setTotalTransactions(response.total);
        } catch (error) {
            toast.error(error.message);
        }
    }

    const  getWalletPayouts = async () => {
        try {
            const response = await getAgentPayouts(page, size);

            setWalletPayouts(response.items);
            setTotalPayouts(response.total);
        } catch (error) {
            toast.error(error.message);
        }
    }


    const openPayoutModal = () => {
        setPayoutForm({ amount: "", currency: currency || "AED", note: "" });
        setIsPayoutOpen(true);
    };

    const closePayoutModal = () => {
        setIsPayoutOpen(false);
    };

    const handleSubmitPayout = async (e) => {
        e?.preventDefault?.();
        try {
            setLoading(true);
            const amountNum = Number(payoutForm.amount);
            if (!amountNum || amountNum <= 0) {
                toast.error("Enter a valid amount");
                return;
            }
            if (walletBalance && amountNum > Number(walletBalance)) {
                toast.error("Amount exceeds available balance");
                return;
            }
            const payload = {
                amount: amountNum,
                currency: payoutForm.currency || currency || "AED",
                note: payoutForm.note || "",
            };
            await createPayoutApi(payload);
            toast.success("Payout request submitted");
            closePayoutModal();
            await getWalletBalance();
            await getWalletPayouts();
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWalletBalance();
    }, []);

    useEffect(() => {
        getWalletTransactions();
        getWalletPayouts();
    }, [page, size]);

    const formatAmount = (amount, ccy) => {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: ccy || "AED",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDateTime = (iso) => {
        try {
            const d = new Date(iso);
            return d.toLocaleString();
        } catch (e) {
            return iso;
        }
    };
  


    return (
        <div className="sectionContainer">
            <SectionTop heading="Agent Wallet">
            </SectionTop>
            <section
                className="sectionStyles"
                // style={{ backgroundColor: MENU_TABS[0].bgColor }}
            >
                {isLoading ? (
                    <Spinner type="fullPage" />
                ) : (
                    <>
                        <div style={{
                            background: "#f6f7f9",
                            borderRadius: 12,
                            padding: 24,
                            marginBottom: 16,
                        }}>
                            <div style={{ color: "#6b7280", fontSize: 12 }}>Current Balance</div>
                            <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1, marginTop: 4 }}>
                                {formatAmount(walletBalance || 0, currency)}
                            </div>
                            <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>Available for withdrawal</div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                                <button onClick={openPayoutModal} disabled={loading}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: 8,
                                        background: colorCode,
                                        color: "#fff",
                                        fontWeight: 600,
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    + Request Payout
                                </button>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                            <button
                                onClick={() => setActiveTab("transactions")}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                    background: activeTab === "transactions" ? colorCode : "#fff",
                                    color: activeTab === "transactions" ? "#fff" : "#111827",
                                    fontWeight: 600,
                                }}
                            >
                                Transactions
                            </button>
                            <button
                                onClick={() => setActiveTab("payouts")}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                    background: activeTab === "payouts" ? colorCode : "#fff",
                                    color: activeTab === "payouts" ? "#fff" : "#111827",
                                    fontWeight: 600,
                                }}
                            >
                                Payouts
                            </button>
                        </div>

                        {activeTab === "transactions" ? (
                            <div>
                                <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 8 }}>
                                    Transaction History{totalTransactions ? ` · ${totalTransactions} total` : ""}
                                </div>
                                <div>
                                    {(walletTransactions || []).map((tx) => {
                                        const isCredit = tx.type === "credit";
                                        const amountSign = isCredit ? "+" : "-";
                                        const amountColor = isCredit ? "#16a34a" : "#dc2626";
                                        return (
                                            <div key={tx._id}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    border: "1px solid #eef0f2",
                                                    padding: 12,
                                                    borderRadius: 10,
                                                    marginBottom: 8,
                                                    background: "#fff",
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{tx.description || `Transaction ${tx.wallet_tx_id}`}</div>
                                                    <div style={{ color: "#6b7280", fontSize: 12 }}>
                                                        {formatDateTime(tx.created_at)} · TX: {tx.wallet_tx_id}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: "right" }}>
                                                    <div style={{ color: amountColor, fontWeight: 700 }}>
                                                        {amountSign}{formatAmount(tx.amount, tx.currency)}
                                                    </div>
                                                    <div style={{ color: "#9ca3af", fontSize: 12 }}>
                                                        Balance: {formatAmount(tx.balance_after, tx.currency)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 8 }}>
                                    Payout Requests{totalPayouts ? ` · ${totalPayouts} total` : ""}
                                </div>
                                <div>
                                    {(walletPayouts || []).map((p) => (
                                        <div key={p._id}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                border: "1px solid #eef0f2",
                                                padding: 12,
                                                borderRadius: 10,
                                                marginBottom: 8,
                                                background: "#fff",
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 600 }}>Payout Request #{p.request_id}</div>
                                                <div style={{ color: "#6b7280", fontSize: 12 }}>
                                                    {formatDateTime(p.created_at)} · Status: {p.status}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <div style={{ fontWeight: 700 }}>
                                                    {formatAmount(p.amount, p.currency)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isPayoutOpen && (
                            <div style={{
                                position: "fixed",
                                inset: 0,
                                background: "rgba(0,0,0,0.4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 50,
                            }}>
                                <div style={{ background: "#fff", width: 520, borderRadius: 10, padding: 20 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                        <div style={{ fontWeight: 700 }}>Request Payout</div>
                                        <button onClick={closePayoutModal} style={{ border: "none", background: "transparent", fontSize: 18, cursor: "pointer" }}>×</button>
                                    </div>
                                    <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 12 }}>Submit a withdrawal request from your wallet balance</div>
                                    <form onSubmit={handleSubmitPayout}>
                                        <label style={{ fontSize: 12, color: "#6b7280" }}>Amount ({currency})</label>
                                        <div style={{ display: "flex", gap: 8, marginTop: 6, marginBottom: 10 }}>
                                            <input type="number" min={1} step={1}
                                                value={payoutForm.amount}
                                                onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                                                placeholder="Enter amount"
                                                style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }}
                                            />
                                            <select value={payoutForm.currency}
                                                onChange={(e) => setPayoutForm({ ...payoutForm, currency: e.target.value })}
                                                style={{ width: 90, padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }}
                                            >
                                                <option value="AED">AED</option>
                                            </select>
                                        </div>
                                        <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 10 }}>Enter the amount you wish to withdraw</div>

                                        <label style={{ fontSize: 12, color: "#6b7280" }}>Note</label>
                                        <textarea rows={3}
                                            value={payoutForm.note}
                                            onChange={(e) => setPayoutForm({ ...payoutForm, note: e.target.value })}
                                            placeholder="Add a description for this payout request"
                                            style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }}
                                        />
                                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
                                            <button type="button" onClick={closePayoutModal} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" }}>Cancel</button>
                                            <button type="submit" disabled={loading} style={{ padding: "8px 12px", borderRadius: 8, background: colorCode, color: "#fff", border: "none" }}>
                                                {loading ? "Submitting..." : "Submit Request"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

export default Wallet;
