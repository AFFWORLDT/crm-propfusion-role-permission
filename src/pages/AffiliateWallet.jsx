import { useState, useEffect } from 'react';
import { 
  Wallet, 
  Users, 
  TrendingUp, 
  RefreshCw, 
  AlertCircle,
  DollarSign,
  UserCheck,
  UserX,
  Clock,
  ChevronRight,
  Share2,
  ArrowRight,
  Star,
  Crown,
  Gift,
  Target,
  Award
} from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import SectionTop from '../ui/SectionTop';
import './AffiliateWallet.css';

const AffiliateWallet = () => {
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/agent/affiliate-earnings');
      setEarningsData(response.data);
    } catch (err) {
      console.error('Error fetching earnings data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (state) => {
    switch (state) {
      case 'active':
        return '#10b981';
      case 'inactive':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (state) => {
    switch (state) {
      case 'active':
        return <UserCheck size={16} />;
      case 'inactive':
        return <UserX size={16} />;
      case 'pending':
        return <Clock size={16} />;
      default:
        return <Users size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="sectionContainer">
        <SectionTop heading="Affiliate Wallet" />
        <div className="affiliate-wallet-container sectionStyles">
          <div className="loading-container">
            <RefreshCw className="loading-spinner" />
            <p>Loading earnings data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !earningsData) {
    return (
      <div className="sectionContainer">
        <SectionTop heading="Affiliate Wallet" />
        <div className="affiliate-wallet-container sectionStyles">
          <div className="error-container">
            <AlertCircle className="error-icon" />
            <h3>Error Loading Earnings Data</h3>
            <p>{error}</p>
            <button onClick={fetchEarningsData} className="retry-btn">
              <RefreshCw className="retry-icon" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sectionContainer">
      <SectionTop heading="Affiliate Wallet" />
      <div className="affiliate-wallet-container sectionStyles">
        {/* Header Stats */}
        <div className="wallet-header">
          <div className="header-left">
           
          </div>
          <button 
            onClick={fetchEarningsData} 
            className="refresh-btn"
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card total-earnings">
            <div className="card-icon">
             AED
            </div>
            <div className="card-content">
              <h3>Total Earnings</h3>
              <p className="amount">{earningsData?.total_payout || 0}</p>
              <div className="card-badge success">
                <Star size={14} />
                <span>Active</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card total-affiliates">
            <div className="card-icon">
              <Users size={24} />
            </div>
            <div className="card-content">
              <h3>Total Affiliates</h3>
              <p className="amount">{earningsData?.total_affiliates || 0}</p>
              <div className="card-badge info">
                <Crown size={14} />
                <span>Partners</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card total-referred">
            <div className="card-icon">
              <TrendingUp size={24} />
            </div>
            <div className="card-content">
              <h3>Referred Agents</h3>
              <p className="amount">{earningsData?.total_referred_agents || 0}</p>
              <div className="card-badge warning">
                <Target size={14} />
                <span>Success</span>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings List */}
        <div className="earnings-section">
          <div className="section-header">
            <h2 className="section-title">
              <Share2 size={20} />
              Referral Network & Earnings
            </h2>
            <div className="section-subtitle">
              Track your referral success and see who you&apos;ve helped join the team
            </div>
          </div>
          <div className="earnings-list">
            {earningsData?.earnings?.map((earning, index) => (
              <div key={earning.agent_id || index} className="earning-card">
                <div className="earning-header">
                  <div className="agent-info">
                    <div className="agent-avatar">
                      {earning.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="agent-details">
                      <h3 className="agent-name">{earning.name}</h3>
                      <p className="agent-email">{earning.email}</p>
                      <div className="agent-stats">
                        <span className="stat-item">
                          <Users size={14} />
                          {earning.referred_count} referrals
                        </span>
                        <span className="stat-item">
                          <span className="currency-text">AED</span>
                          {earning.earning} earned
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="earning-amount">
                    <div className="amount-display">
                      <span className="amount">{earning.earning}</span>
                      <div className="amount-label">Total Earnings</div>
                    </div>
                    <div className="referral-badge">
                      <Share2 size={16} />
                      <span>{earning.referred_count} Referrals</span>
                    </div>
                  </div>
                </div>
                
                {earning.referred_agents && earning.referred_agents.length > 0 && (
                  <div className="referred-agents">
                    <div className="referred-header">
                      <h4 className="referred-title">
                        <ArrowRight size={16} />
                        Your Referrals
                      </h4>
                      <div className="referral-summary">
                        <span className="summary-text">
                          You&apos;ve successfully referred {earning.referred_agents.length} agents
                        </span>
                      </div>
                    </div>
                    <div className="agents-grid">
                      {earning.referred_agents.map((agent, agentIndex) => (
                        <div key={agent.id} className="referred-agent-card">
                          <div className="referral-connection">
                            <div className="connection-line"></div>
                            <div className="connection-dot"></div>
                          </div>
                          <div className="agent-info-small">
                            <div className="agent-avatar-small">
                              {agent.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="agent-details-small">
                              <h5 className="agent-name-small">{agent.name}</h5>
                              <p className="agent-email-small">{agent.email}</p>
                              <div className="agent-meta">
                                <span className="join-date">
                                  <Clock size={12} />
                                  Joined: {formatDate(agent.created_at)}
                                </span>
                                <div 
                                  className="status-badge"
                                  style={{ 
                                    backgroundColor: getStatusColor(agent.state) + '20',
                                    color: getStatusColor(agent.state),
                                    border: `1px solid ${getStatusColor(agent.state)}40`
                                  }}
                                >
                                  {getStatusIcon(agent.state)}
                                  <span>{agent.state}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Warning */}
        {error && earningsData && (
          <div className="warning-banner">
            <AlertCircle className="warning-icon" />
            <div className="warning-content">
              <strong>API Error:</strong> Using cached data. {error}
            </div>
            <button onClick={fetchEarningsData} className="warning-refresh-btn">
              <RefreshCw className="warning-refresh-icon" />
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateWallet;
