import { useEffect, useMemo, useState } from "react";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import Modal from "../../ui/Modal";
import { SUBSCRIPTION_TABS } from "../../utils/constants";
import { walletApi } from "../../services/apiWallet";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    useElements,
    useStripe,
    PaymentElement,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, useElements, useStripe, PaymentElement } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

function TopupForm({ clientSecret, onSuccess, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (!stripe || !elements) return;
        setSubmitting(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/billing/success`,
            },
            redirect: "if_required",
        });
        setSubmitting(false);
        if (error) {
            toast.error(error.message || "Payment failed");
            return;
        }
        if (
            paymentIntent?.status === "succeeded" ||
            paymentIntent?.status === "processing"
        ) {
            toast.success("Top-up processing. Updating balance shortly...");
            onSuccess?.();
        }
    };

    return (
        <div style={{ display: "grid", gap: "1rem" }}>
            <PaymentElement />
            <div
                style={{
                    display: "flex",
                    gap: "0.8rem",
                    justifyContent: "flex-end",
                }}
            >
                <button
                    className="btn"
                    onClick={onCancel}
                    style={{ background: "#f3f4f6" }}
                >
                    Cancel
                </button>
                <button
                    className="btn"
                    onClick={handleConfirm}
                    disabled={isSubmitting || !stripe}
                >
                    {isSubmitting ? "Processing..." : "Pay"}
                </button>
            </div>
        </div>
    );
}
//     const handleConfirm = async () => {
//         if (!stripe || !elements) return;
//         setSubmitting(true);
//         const { error, paymentIntent } = await stripe.confirmPayment({
//             elements,
//             confirmParams: {
//                 return_url: `${window.location.origin}/billing/success`,
//             },
//             redirect: "if_required",
//         });
//         setSubmitting(false);
//         if (error) {
//             toast.error(error.message || "Payment failed");
//             return;
//         }
//         if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
//             toast.success("Top-up processing. Updating balance shortly...");
//             onSuccess?.();
//         }
//     };

//     return (
//         <div style={{ display: "grid", gap: "1rem" }}>
//             <PaymentElement />
//             <div style={{ display: "grid", gap: "0.8rem", justifyContent: "flex-end" }}>
//                 <button className="btn" onClick={onCancel} style={{ background: "#f3f4f6" }}>Cancel</button>
//                 <button className="btn" onClick={handleConfirm} disabled={isSubmitting || !stripe}>
//                     {isSubmitting ? "Processing..." : "Pay"}
//                 </button>
//             </div>
//         </div>
//     );
// }

function TopupModalContent({ onDone }) {
    const [amount, setAmount] = useState(50);
    const [currency, setCurrency] = useState("AED");
    const [isLoading, setLoading] = useState(false);

    const startTopup = async () => {
        try {
            if (amount < 1) {
                toast.error("Amount must be at least 1 AED");
                return;
            }
            setLoading(true);
            const res = await walletApi.createTopupIntent({
                amount: Number(amount),
                currency,
            });

            // Check for Stripe Checkout URL redirect (from API docs)
            if (res?.checkout_url || res?.payment_link) {
                window.location.href = res.checkout_url || res.payment_link;
                return;
            }

            // Fallback: if we get client_secret, use Elements (old flow)
            if (res?.client_secret) {
                toast.info("Using Payment Element flow");
                // Could implement Elements flow here if needed
                return;
            }

            throw new Error("No checkout URL or client secret in response");
        } catch (e) {
            toast.error(e.message || "Failed to create topup intent");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "grid", gap: "0.8rem", maxWidth: 420 }}>
            <h3 style={{ marginTop: 0 }}>Top up wallet</h3>
            <label style={{ fontSize: "1.4rem" }}>Amount (≥ 1 AED)</label>
            <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <label style={{ fontSize: "1.4rem" }}>Currency</label>
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
            >
                <option value="AED">AED</option>
                <option value="USD">USD</option>
            </select>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.8rem",
                    marginTop: "0.8rem",
                }}
            >
                <button
                    className="btn"
                    style={{ background: "#f3f4f6" }}
                    onClick={onDone}
                >
                    Close
                </button>
                <button
                    className="btn"
                    onClick={startTopup}
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : "Continue"}
                </button>
            </div>
        </div>
    );
}

function OrganisationWallet() {
    const [wallet, setWallet] = useState(null);
    const [summary, setSummary] = useState(null);
    const [services, setServices] = useState([]);
    const [subs, setSubs] = useState([]);
    const [tx, setTx] = useState({ list: [], page: 1, size: 10, total: 0 });
    const [isLoading, setLoading] = useState(true);
    const [offerCodes, setOfferCodes] = useState({});
    async function loadAll() {
        setLoading(true);
        try {
            const [w, s, sv, sub, tr] = await Promise.all([
                walletApi.getWallet(),
                walletApi.getSummary(),
                walletApi.getServices(),
                walletApi.getSubscriptions("active"),
                walletApi.getTransactions(tx.page, tx.size),
            ]);
            setWallet(w);
            setSummary(s);
            setServices(
                Array.isArray(sv?.items)
                    ? sv.items
                    : Array.isArray(sv)
                      ? sv
                      : []
            );
            setSubs(
                Array.isArray(sub?.items)
                    ? sub.items
                    : Array.isArray(sub)
                      ? sub
                      : []
            );
            setTx((prev) => ({
                ...prev,
                list: tr?.items || tr?.data || tr || [],
            }));
        } catch (e) {
            toast.error(e.message || "Failed to load wallet data");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAfterTopup = async () => {
        setTimeout(loadAll, 2000);
    };

    const subscribe = async (service, method, autoRenew = true) => {
        try {
            const offerCodeValue = offerCodes[service.id]?.trim() || undefined;
            
            if (method === "wallet") {
                await walletApi.subscribeWallet({
                    service_id: service.id,
                    auto_renew: !!autoRenew,
                    discount_code: offerCodeValue,
                });
                toast.success("Subscribed from wallet");
                await loadAll();
            } else {
                const res = await walletApi.subscribeStripe({
                    service_id: service.id,
                    auto_renew: !!autoRenew,
                    discount_code: offerCodeValue,
                });
                if (res?.checkout_url) {
                    window.location.href = res.checkout_url;
                } else {
                    toast.error("No checkout URL returned");
                }
            }
        } catch (e) {
            if (
                e.status === 400 &&
                String(e.message).toLowerCase().includes("insufficient")
            ) {
                toast.error("Insufficient wallet balance. Please top up.");
            } else {
                toast.error(e.message || "Failed to subscribe");
            }
        }
    };

    const toggleAutoRenew = async (subscription, enabled) => {
        try {
            await walletApi.setAutoRenew(subscription.id, enabled);
            toast.success("Auto-renew updated");
            await loadAll();
        } catch (e) {
            toast.error(e.message || "Failed to update auto-renew");
        }
    };

    const cancelSubscription = async (subscription) => {
        const ok = window.confirm("Cancel this subscription?");
        if (!ok) return;
        try {
            await walletApi.cancelSubscription(subscription.id);
            toast.success("Subscription canceled");
            await loadAll();
        } catch (e) {
            toast.error(e.message || "Failed to cancel subscription");
        }
    };

    const updateOfferCode = (serviceId, code) => {
        setOfferCodes(prev => ({
            ...prev,
            [serviceId]: code
        }));
    };

    return (
        <div className="sectionContainer">
            <SectionTop heading="Wallet & Billing">
                <TabBar
                    tabs={SUBSCRIPTION_TABS}
                    activeTab={"ORG_WALLET"}
                    navigateTo={(id) =>
                        SUBSCRIPTION_TABS.find((tab) => tab.id === id)?.path ||
                        "/admin/general/organisation-wallet"
                    }
                />
            </SectionTop>
            <section
                className="sectionStyles"
                style={{ backgroundColor: SUBSCRIPTION_TABS[1].bgColor }}
            >
                <div
                    className="sectionDiv"
                    style={{ display: "grid", gap: "1.6rem" }}
                >
                    {/* Wallet card wrapped with Modal provider so Open/Window share context */}
                    <Modal>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "1.6rem",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0.8rem",
                                background: "#fff",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: "1.4rem",
                                        color: "#6b7280",
                                    }}
                                >
                                    Available Balance (
                                    {wallet?.currency || "AED"})
                                </div>
                                <div
                                    style={{
                                        fontSize: "2.2rem",
                                        fontWeight: 700,
                                    }}
                                >
                                    {wallet?.current_balance?.toFixed
                                        ? wallet.current_balance.toFixed(2)
                                        : wallet?.balance?.toFixed
                                          ? wallet.balance.toFixed(2)
                                          : (wallet?.current_balance ??
                                            wallet?.balance ??
                                            "0.00")}
                                </div>
                                <div
                                    style={{
                                        fontSize: "1.2rem",
                                        color: "#6b7280",
                                    }}
                                >
                                    Monthly Estimate:{" "}
                                    {summary?.monthly_spend_estimate ?? "-"}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.8rem" }}>
                                <Modal.Open openWindowName="topup">
                                    <button
                                        className="btn"
                                        style={{ padding: "0.8rem 1.2rem" }}
                                    >
                                        Top up
                                    </button>
                                </Modal.Open>
                                <a
                                    className="btn"
                                    style={{
                                        padding: "0.8rem 1.2rem",
                                        background: "#f3f4f6",
                                    }}
                                    href="#transactions"
                                >
                                    View History
                                </a>
                            </div>
                        </div>
                        <Modal.Window name="topup" overflow>
                            <TopupModalContent onDone={handleAfterTopup} />
                        </Modal.Window>
                    </Modal>

                    {/* Services catalog */}
                    <div
                        style={{
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.8rem",
                            padding: "1.6rem",
                        }}
                    >
                        <h4 style={{ marginTop: 0 }}>Services</h4>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fill, minmax(260px, 1fr))",
                                gap: "1rem",
                            }}
                        >
                            {services?.length ? (
                                services.map((sv) => {
                                    const serviceId = sv.id ?? sv.service_id;
                                    return (
                                        <div
                                            key={sv._id || sv.id || sv.service_id}
                                            style={{
                                                border: "1px solid #eee",
                                                borderRadius: "0.8rem",
                                                padding: "1rem",
                                            }}
                                        >
                                            <div style={{ fontWeight: 600 }}>
                                                {sv.name}
                                            </div>
                                            <div
                                                style={{
                                                    color: "#6b7280",
                                                    fontSize: "1.3rem",
                                                    margin: "0.4rem 0",
                                                }}
                                            >
                                                {sv.description}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "1.2rem",
                                                    color: "#374151",
                                                }}
                                            >
                                                Type: {sv.service_type} • Pricing:{" "}
                                                {sv.pricing_type}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: "1.4rem",
                                                    marginTop: "0.2rem",
                                                }}
                                            >
                                                {sv.price} {sv.currency}
                                            </div>

                                            {/* Offer Code Input */}
                                            <div style={{ 
                                                margin: '0.8rem 0',
                                                padding: '0.8rem',
                                                backgroundColor: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '0.6rem'
                                            }}>
                                                <label style={{ 
                                                    display: 'block', 
                                                    fontSize: '1.1rem', 
                                                    fontWeight: '600', 
                                                    marginBottom: '0.4rem',
                                                    color: '#374151'
                                                }}>
                                                    🎫 Offer Code (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={offerCodes[serviceId] || ''}
                                                    onChange={(e) => updateOfferCode(serviceId, e.target.value.toUpperCase())}
                                                    placeholder="e.g., SPEC30"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem 0.6rem',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '0.4rem',
                                                        fontSize: '1.2rem',
                                                        outline: 'none',
                                                        transition: 'border-color 0.2s',
                                                        backgroundColor: offerCodes[serviceId] ? '#f0fdf4' : '#ffffff'
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                />
                                                {offerCodes[serviceId] && (
                                                    <p style={{ 
                                                        fontSize: '1rem', 
                                                        color: '#059669', 
                                                        marginTop: '0.3rem',
                                                        marginBottom: 0,
                                                        fontWeight: '500'
                                                    }}>
                                                        ✅ {offerCodes[serviceId]} will be applied
                                                    </p>
                                                )}
                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "0.6rem",
                                                    marginTop: "0.8rem",
                                                }}
                                            >
                                                <button
                                                    className="btn"
                                                    onClick={() =>
                                                        subscribe(
                                                            {
                                                                id: serviceId,
                                                                ...sv,
                                                            },
                                                            "wallet"
                                                        )
                                                    }
                                                    style={{
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {offerCodes[serviceId] && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '0.1rem',
                                                            right: '0.1rem',
                                                            background: 'rgba(16, 185, 129, 0.9)',
                                                            color: 'white',
                                                            fontSize: '0.7rem',
                                                            padding: '0.1rem 0.2rem',
                                                            borderRadius: '0.2rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            -{offerCodes[serviceId]}
                                                        </div>
                                                    )}
                                                    Subscribe (Wallet)
                                                </button>
                                                <button
                                                    className="btn"
                                                    onClick={() =>
                                                        subscribe(
                                                            {
                                                                id: serviceId,
                                                                ...sv,
                                                            },
                                                            "stripe"
                                                        )
                                                    }
                                                    style={{
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {offerCodes[serviceId] && (
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '0.1rem',
                                                            right: '0.1rem',
                                                            background: 'rgba(16, 185, 129, 0.9)',
                                                            color: 'white',
                                                            fontSize: '0.7rem',
                                                            padding: '0.1rem 0.2rem',
                                                            borderRadius: '0.2rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            -{offerCodes[serviceId]}
                                                        </div>
                                                    )}
                                                    Subscribe (Stripe)
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ color: "#6b7280" }}>
                                    No services available.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Active subscriptions */}
                    <div
                        style={{
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.8rem",
                            padding: "1.6rem",
                        }}
                    >
                        <h4 style={{ marginTop: 0 }}>Active Subscriptions</h4>
                        <div style={{ display: "grid", gap: "0.8rem" }}>
                            {subs?.length ? (
                                subs.map((sub) => (
                                    <div
                                        key={
                                            sub.id ||
                                            sub._id ||
                                            sub.subscription_id
                                        }
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            border: "1px solid #eee",
                                            borderRadius: "0.8rem",
                                            padding: "1rem",
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600 }}>
                                                {sub.service_name}
                                            </div>
                                            <div
                                                style={{
                                                    color: "#6b7280",
                                                    fontSize: "1.2rem",
                                                }}
                                            >
                                                Status: {sub.status} |{" "}
                                                {sub.start_date} -{" "}
                                                {sub.end_date || "—"}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "0.8rem",
                                                alignItems: "center",
                                            }}
                                        >
                                            <label
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.4rem",
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={!!sub.auto_renew}
                                                    onChange={(e) =>
                                                        toggleAutoRenew(
                                                            sub,
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                Auto-renew
                                            </label>
                                            <button
                                                className="btn"
                                                style={{
                                                    background: "#fee2e2",
                                                }}
                                                onClick={() =>
                                                    cancelSubscription(sub)
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: "#6b7280" }}>
                                    No active subscriptions.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Transactions table */}
                    <div
                        id="transactions"
                        style={{
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.8rem",
                            padding: "1.6rem",
                        }}
                    >
                        <h4 style={{ marginTop: 0 }}>Transactions</h4>
                        <div style={{ overflowX: "auto" }}>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th
                                            style={{
                                                textAlign: "left",
                                                padding: "0.6rem",
                                                borderBottom: "1px solid #eee",
                                            }}
                                        >
                                            Date
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "left",
                                                padding: "0.6rem",
                                                borderBottom: "1px solid #eee",
                                            }}
                                        >
                                            Type
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "left",
                                                padding: "0.6rem",
                                                borderBottom: "1px solid #eee",
                                            }}
                                        >
                                            Description
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "right",
                                                padding: "0.6rem",
                                                borderBottom: "1px solid #eee",
                                            }}
                                        >
                                            Amount
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "right",
                                                padding: "0.6rem",
                                                borderBottom: "1px solid #eee",
                                            }}
                                        >
                                            Balance After
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tx?.list?.length ? (
                                        tx.list.map((row, idx) => (
                                            <tr
                                                key={
                                                    row.id ||
                                                    row._id ||
                                                    row.reference ||
                                                    `${row.date}-${idx}`
                                                }
                                            >
                                                <td
                                                    style={{
                                                        padding: "0.6rem",
                                                        borderBottom:
                                                            "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    {row.date}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "0.6rem",
                                                        borderBottom:
                                                            "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    {row.type}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "0.6rem",
                                                        borderBottom:
                                                            "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    {row.description}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "0.6rem",
                                                        textAlign: "right",
                                                        borderBottom:
                                                            "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    {row.amount}
                                                </td>
                                                <td
                                                    style={{
                                                        padding: "0.6rem",
                                                        textAlign: "right",
                                                        borderBottom:
                                                            "1px solid #f3f4f6",
                                                    }}
                                                >
                                                    {row.balance_after}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                style={{
                                                    padding: "0.8rem",
                                                    color: "#6b7280",
                                                }}
                                            >
                                                No transactions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* (Removed separate Modal at root; modal is colocated with Wallet card) */}
        </div>
    );
}

export default OrganisationWallet;
