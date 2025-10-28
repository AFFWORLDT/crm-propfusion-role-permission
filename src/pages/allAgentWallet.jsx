import React, { useState, useEffect } from "react";
import TabBar from "../ui/TabBar";
import SectionTop from "../ui/SectionTop";
import { KPI_CONTRACTS_TABS } from "../utils/constants";
import { agentWalletApi } from "../services/apiAgentWallet";

function AllAgentWallet() {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        min_balance: "",
        max_balance: "",
        page: 1,
        size: 10
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        size: 10
    });
    const [summary, setSummary] = useState({
        total_balance: 0,
        average_balance: 0,
        active_wallets: 0,
        total_wallets: 0
    });

    // Fetch wallets
    const fetchWallets = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await agentWalletApi.getAllWallets(filters);
            setWallets(response.items || []);
            setPagination({
                total: response.total || 0,
                page: response.page || 1,
                size: response.size || 10
            });
            setSummary(response.summary || {
                total_balance: 0,
                average_balance: 0,
                active_wallets: 0,
                total_wallets: 0
            });
            
        } catch (err) {
            setError(err.message || "Failed to fetch wallets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, [filters.page, filters.min_balance, filters.max_balance]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const formatAmount = (amount, currency) => {
        return `${amount} ${currency}`;
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

    const getStateColor = (state) => {
        return state === 'active' ? '#10b981' : '#6b7280';
    };

    const getStaffLevelColor = (level) => {
        switch(level.toLowerCase()) {
            case 'exclusive': return '#fbbf24';
            case 'premium': return '#9ca3af';
            case 'essential': return '#cd7f32';
            default: return '#6b7280';
        }
    };

    const totalPages = Math.ceil(pagination.total / pagination.size);

    return (
        <div className="sectionContainer" style={{ backgroundColor: 'white', color: 'black' }}>
            <SectionTop>
                <TabBar
                    tabs={KPI_CONTRACTS_TABS}
                    activeTab={"ALLAGENTWALLET"}
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

            <section className="sectionStyles" style={{ backgroundColor: 'white', color: 'black' }}>
                {/* Summary Cards */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '30px' 
                }}>
                    <div style={{ 
                        backgroundColor: '#f8fafc', 
                        padding: '20px', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: 'black', fontSize: '14px', fontWeight: '500' }}>
                            Total Balance
                        </h3>
                        <p style={{ margin: '0', color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>
                            {formatAmount(summary.total_balance, 'AED')}
                        </p>
                    </div>
                    
                    <div style={{ 
                        backgroundColor: '#f8fafc', 
                        padding: '20px', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: 'black', fontSize: '14px', fontWeight: '500' }}>
                            Average Balance
                        </h3>
                        <p style={{ margin: '0', color: '#3b82f6', fontSize: '24px', fontWeight: 'bold' }}>
                            {formatAmount(summary.average_balance, 'AED')}
                        </p>
                    </div>
                    
                    <div style={{ 
                        backgroundColor: '#f8fafc', 
                        padding: '20px', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: 'black', fontSize: '14px', fontWeight: '500' }}>
                            Active Wallets
                        </h3>
                        <p style={{ margin: '0', color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>
                            {summary.active_wallets}
                        </p>
                    </div>
                    
                    <div style={{ 
                        backgroundColor: '#f8fafc', 
                        padding: '20px', 
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ margin: '0 0 10px 0', color: 'black', fontSize: '14px', fontWeight: '500' }}>
                            Total Wallets
                        </h3>
                        <p style={{ margin: '0', color: '#6b7280', fontSize: '24px', fontWeight: 'bold' }}>
                            {summary.total_wallets}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ 
                    display: 'flex', 
                    gap: '15px', 
                    alignItems: 'center', 
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                }}>
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '5px', 
                            fontWeight: '500',
                            color: 'black'
                        }}>
                            Min Balance:
                        </label>
                        <input
                            type="number"
                            value={filters.min_balance}
                            onChange={(e) => handleFilterChange('min_balance', e.target.value)}
                            placeholder="Min Balance"
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                backgroundColor: 'white',
                                color: 'black',
                                width: '150px'
                            }}
                        />
                    </div>
                    
                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '5px', 
                            fontWeight: '500',
                            color: 'black'
                        }}>
                            Max Balance:
                        </label>
                        <input
                            type="number"
                            value={filters.max_balance}
                            onChange={(e) => handleFilterChange('max_balance', e.target.value)}
                            placeholder="Max Balance"
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                backgroundColor: 'white',
                                color: 'black',
                                width: '150px'
                            }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'black' }}>
                        Loading wallets...
                    </div>
                ) : error ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '40px', 
                        color: '#ef4444',
                        backgroundColor: '#fef2f2',
                        borderRadius: '8px',
                        margin: '20px'
                    }}>
                        Error: {error}
                    </div>
                ) : (
                    <>
                        {/* Wallets Table */}
                        <div style={{ 
                            backgroundColor: 'white', 
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                backgroundColor: 'white',
                                color: 'black'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc' }}>
                                        <th style={{ 
                                            padding: '12px', 
                                            textAlign: 'left', 
                                            borderBottom: '1px solid #e5e7eb',
                                            fontWeight: '600',
                                            color: 'black'
                                        }}>
                                            Agent ID
                                        </th>
                                        <th style={{ 
                                            padding: '12px', 
                                            textAlign: 'left', 
                                            borderBottom: '1px solid #e5e7eb',
                                            fontWeight: '600',
                                            color: 'black'
                                        }}>
                                            Agent Name
                                        </th>
                                        <th style={{ 
                                            padding: '12px', 
                                            textAlign: 'left', 
                                            borderBottom: '1px solid #e5e7eb',
                                            fontWeight: '600',
                                            color: 'black'
                                        }}>
                                            Email
                                        </th>
                                        <th style={{ 
                                            padding: '12px', 
                                            textAlign: 'left', 
                                            borderBottom: '1px solid #e5e7eb',
                                            fontWeight: '600',
                                            color: 'black'
                                        }}>
                                            Status
                                        </th>
                                        <th style={{ 
                                            padding: '12px', 
                                            textAlign: 'left', 
                                            borderBottom: '1px solid #e5e7eb',
                                            fontWeight: '600',
                                            color: 'black'
                                        }}>
                                            Staff Level
                                        </th>
                                        <th style={{ 
                                            padding: '12px', 
                                            textAlign: 'right', 
                                            borderBottom: '1px solid #e5e7eb',
                                            fontWeight: '600',
                                            color: 'black'
                                        }}>
                                            Current Balance
                                        </th>
                                        <th style={{ 
                                            padding: '12px', 
                                            textAlign: 'left', 
                                            borderBottom: '1px solid #e5e7eb',
                                            fontWeight: '600',
                                            color: 'black'
                                        }}>
                                            Last Updated
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wallets.map((wallet) => (
                                        <tr key={wallet.agent_id} style={{ 
                                            borderBottom: '1px solid #f3f4f6',
                                            backgroundColor: 'white'
                                        }}>
                                            <td style={{ 
                                                padding: '12px', 
                                                color: 'black',
                                                fontWeight: '600'
                                            }}>
                                                {wallet.agent_id}
                                            </td>
                                            <td style={{ 
                                                padding: '12px', 
                                                color: 'black',
                                                fontWeight: '500'
                                            }}>
                                                {wallet.agent_name}
                                            </td>
                                            <td style={{ 
                                                padding: '12px', 
                                                color: 'black'
                                            }}>
                                                {wallet.agent_email}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: '500',
                                                    backgroundColor: wallet.agent_state === 'active' ? '#dcfce7' : '#f3f4f6',
                                                    color: getStateColor(wallet.agent_state)
                                                }}>
                                                    {wallet.agent_state.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                {wallet.staff_level ? (
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: '500',
                                                        backgroundColor: '#fef3c7',
                                                        color: getStaffLevelColor(wallet.staff_level)
                                                    }}>
                                                        {wallet.staff_level.toUpperCase()}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#9ca3af' }}>-</span>
                                                )}
                                            </td>
                                            <td style={{ 
                                                padding: '12px', 
                                                textAlign: 'right',
                                                fontWeight: '600',
                                                color: '#10b981'
                                            }}>
                                                {formatAmount(wallet.current_balance, wallet.currency)}
                                            </td>
                                            <td style={{ 
                                                padding: '12px', 
                                                color: 'black',
                                                fontSize: '14px'
                                            }}>
                                                {formatDate(wallet.updated_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                gap: '10px',
                                marginTop: '20px',
                                padding: '20px'
                            }}>
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: pagination.page === 1 ? '#f3f4f6' : '#3b82f6',
                                        color: pagination.page === 1 ? '#9ca3af' : 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: pagination.page === 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Previous
                                </button>
                                
                                <span style={{ color: 'black', fontWeight: '500' }}>
                                    Page {pagination.page} of {totalPages}
                                </span>
                                
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === totalPages}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: pagination.page === totalPages ? '#f3f4f6' : '#3b82f6',
                                        color: pagination.page === totalPages ? '#9ca3af' : 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: pagination.page === totalPages ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {/* Summary */}
                        <div style={{ 
                            marginTop: '20px', 
                            padding: '15px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            color: 'black'
                        }}>
                            <strong>Total Wallets: {pagination.total}</strong>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

export default AllAgentWallet;