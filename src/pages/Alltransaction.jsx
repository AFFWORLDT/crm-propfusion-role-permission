import React, { useState, useEffect } from "react";
import SectionTop from "../ui/SectionTop";
import { agentWalletApi } from "../services/apiAgentWallet";
import { getStaff } from "../services/apiStaff";
import TabBar from "../ui/TabBar";
import { KPI_CONTRACTS_TABS } from "../utils/constants";

function Alltransaction() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        agent_id: "",
        type_filter: "",
        page: 1,
        size: 10,
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        size: 10,
    });
    const [staffData, setStaffData] = useState({});
    const [allStaff, setAllStaff] = useState([]);

    // Fetch transactions
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await agentWalletApi.getAllTransactions(filters);
            setTransactions(response.items || []);
            setPagination({
                total: response.total || 0,
                page: response.page || 1,
                size: response.size || 10,
            });

            // Fetch all staff data once and create a lookup map
            try {
                console.log("Fetching all staff data...");
                const allStaff = await getStaff("all");
                console.log("All staff data:", allStaff);

                // Create a map for quick lookup by agent ID
                const staffMap = {};
                if (Array.isArray(allStaff)) {
                    allStaff.forEach((staff) => {
                        staffMap[staff.id] = staff;
                    });
                }
                console.log("Staff lookup map:", staffMap);
                setStaffData(staffMap);
                setAllStaff(allStaff); // Store all staff for dropdown
            } catch (err) {
                console.error("Failed to fetch staff data:", err);
                setStaffData({});
            }
        } catch (err) {
            setError(err.message || "Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters.page, filters.agent_id, filters.type_filter]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            page: 1, // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatAmount = (amount, currency) => {
        return `${amount} ${currency}`;
    };

    const getTypeColor = (type) => {
        return type === "credit" ? "#10b981" : "#ef4444";
    };

    const getStaffName = (agentId) => {
        const staff = staffData[agentId];
        console.log(`Getting staff name for agent ${agentId}:`, staff);

        if (!staff) {
            console.log(`No staff data found for agent ${agentId}`);
            return `Agent ${agentId}`;
        }

        // Use the name property as shown in AgentSelector
        if (staff.name) {
            console.log(`Found staff name for agent ${agentId}: ${staff.name}`);
            return staff.name;
        }

        console.log(`No name found for agent ${agentId}, using fallback`);
        return `Agent ${agentId}`;
    };

    const totalPages = Math.ceil(pagination.total / pagination.size);

    return (
        <div
            className="sectionContainer"
            style={{ backgroundColor: "white", color: "black" }}
        >
            <SectionTop >
            <TabBar
                    tabs={KPI_CONTRACTS_TABS}
                    activeTab={"ALLTRANSACTIONS"}
                    navigateTo={(tabId) => {
                        if (tabId === "VIEWINGS") {
                            return "/viewings";
                        }
                        if (tabId === "CONTACTS") {
                            return "/contacts";
                        }
                        if (tabId === "TRANSACTIONS") {
                            return "/transactions";
                        }
                        
                        if (tabId === "LEDGER") {
                            return "/ledger";
                        }
                        if (tabId === "PAYOUTLIST") {
                            return "/payout-list";
                        }
                        if (tabId === "ALLTRANSACTIONS") {
                            return "/all-transactions";
                        }
                        if (tabId === "ALLAGENTWALLET") {
                            return "/all-agent-wallet";
                        }
                        return `/kpi-submissions`;
                    }}
                />
            </SectionTop>

            <section
                className="sectionStyles"
                style={{ backgroundColor: "white", color: "black" }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                    }}
                >
                    <div>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "5px",
                                fontWeight: "500",
                                color: "black",
                            }}
                        >
                            Select Agent:
                        </label>
                        <select
                            value={filters.agent_id}
                            onChange={(e) =>
                                handleFilterChange("agent_id", e.target.value)
                            }
                            style={{
                                padding: "8px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                backgroundColor: "white",
                                color: "black",
                                width: "250px",
                            }}
                        >
                            <option value="">All Agents</option>
                            {allStaff.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                    {staff.name} (ID: {staff.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "5px",
                                fontWeight: "500",
                                color: "black",
                            }}
                        >
                            Transaction Type:
                        </label>
                        <select
                            value={filters.type_filter}
                            onChange={(e) =>
                                handleFilterChange(
                                    "type_filter",
                                    e.target.value
                                )
                            }
                            style={{
                                padding: "8px 12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "6px",
                                backgroundColor: "white",
                                color: "black",
                                width: "150px",
                            }}
                        >
                            <option value="">All Types</option>
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>
                    </div>
                </div>
                {loading ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "black",
                        }}
                    >
                        Loading transactions...
                    </div>
                ) : error ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#ef4444",
                            backgroundColor: "#fef2f2",
                            borderRadius: "8px",
                            margin: "20px",
                        }}
                    >
                        Error: {error}
                    </div>
                ) : (
                    <>
                        {/* Transaction Table */}
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "8px",
                                overflow: "hidden",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    backgroundColor: "white",
                                    color: "black",
                                }}
                            >
                                <thead>
                                    <tr style={{ backgroundColor: "#f8fafc" }}>
                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "left",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                fontWeight: "600",
                                                color: "black",
                                            }}
                                        >
                                            Transaction ID
                                        </th>
                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "left",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                fontWeight: "600",
                                                color: "black",
                                            }}
                                        >
                                            Agent
                                        </th>
                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "left",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                fontWeight: "600",
                                                color: "black",
                                            }}
                                        >
                                            Type
                                        </th>
                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "right",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                fontWeight: "600",
                                                color: "black",
                                            }}
                                        >
                                            Amount
                                        </th>
                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "left",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                fontWeight: "600",
                                                color: "black",
                                            }}
                                        >
                                            Description
                                        </th>
                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "right",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                fontWeight: "600",
                                                color: "black",
                                            }}
                                        >
                                            Balance Before
                                        </th>
                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "right",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                fontWeight: "600",
                                                color: "black",
                                            }}
                                        >
                                            Balance After
                                        </th>
                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "left",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                fontWeight: "600",
                                                color: "black",
                                            }}
                                        >
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr
                                            key={transaction._id}
                                            style={{
                                                borderBottom:
                                                    "1px solid #f3f4f6",
                                                backgroundColor: "white",
                                            }}
                                        >
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    color: "black",
                                                    fontFamily: "monospace",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {transaction.wallet_tx_id}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    color: "black",
                                                }}
                                            >
                                                {getStaffName(
                                                    transaction.agent_id
                                                )}
                                                <br />
                                                <small
                                                    style={{ color: "#6b7280" }}
                                                >
                                                    ID: {transaction.agent_id}
                                                </small>
                                            </td>
                                            <td style={{ padding: "12px" }}>
                                                <span
                                                    style={{
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        backgroundColor:
                                                            transaction.type ===
                                                            "credit"
                                                                ? "#dcfce7"
                                                                : "#fef2f2",
                                                        color: getTypeColor(
                                                            transaction.type
                                                        ),
                                                    }}
                                                >
                                                    {transaction.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    textAlign: "right",
                                                    fontWeight: "600",
                                                    color: getTypeColor(
                                                        transaction.type
                                                    ),
                                                }}
                                            >
                                                {transaction.type === "credit"
                                                    ? "+"
                                                    : "-"}
                                                {formatAmount(
                                                    transaction.amount,
                                                    transaction.currency
                                                )}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    color: "black",
                                                    maxWidth: "200px",
                                                    wordWrap: "break-word",
                                                }}
                                            >
                                                {transaction.description}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    textAlign: "right",
                                                    color: "black",
                                                }}
                                            >
                                                {formatAmount(
                                                    transaction.balance_before,
                                                    transaction.currency
                                                )}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    textAlign: "right",
                                                    fontWeight: "600",
                                                    color: "black",
                                                }}
                                            >
                                                {formatAmount(
                                                    transaction.balance_after,
                                                    transaction.currency
                                                )}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "12px",
                                                    color: "black",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {formatDate(
                                                    transaction.created_at
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginTop: "20px",
                                    padding: "20px",
                                }}
                            >
                                <button
                                    onClick={() =>
                                        handlePageChange(pagination.page - 1)
                                    }
                                    disabled={pagination.page === 1}
                                    style={{
                                        padding: "8px 12px",
                                        backgroundColor:
                                            pagination.page === 1
                                                ? "#f3f4f6"
                                                : "#3b82f6",
                                        color:
                                            pagination.page === 1
                                                ? "#9ca3af"
                                                : "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor:
                                            pagination.page === 1
                                                ? "not-allowed"
                                                : "pointer",
                                    }}
                                >
                                    Previous
                                </button>

                                <span
                                    style={{
                                        color: "black",
                                        fontWeight: "500",
                                    }}
                                >
                                    Page {pagination.page} of {totalPages}
                                </span>

                                <button
                                    onClick={() =>
                                        handlePageChange(pagination.page + 1)
                                    }
                                    disabled={pagination.page === totalPages}
                                    style={{
                                        padding: "8px 12px",
                                        backgroundColor:
                                            pagination.page === totalPages
                                                ? "#f3f4f6"
                                                : "#3b82f6",
                                        color:
                                            pagination.page === totalPages
                                                ? "#9ca3af"
                                                : "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor:
                                            pagination.page === totalPages
                                                ? "not-allowed"
                                                : "pointer",
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {/* Summary */}
                        <div
                            style={{
                                marginTop: "20px",
                                padding: "15px",
                                backgroundColor: "#f8fafc",
                                borderRadius: "8px",
                                color: "black",
                            }}
                        >
                            <strong>
                                Total Transactions: {pagination.total}
                            </strong>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

export default Alltransaction;
