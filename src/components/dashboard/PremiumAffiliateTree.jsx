import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Users, 
  Crown,
  TrendingUp,
  UserCheck,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Eye,
  EyeOff,
  Search,
  Filter,
  X,
  Mail,
  Phone,
  User
} from 'lucide-react';
import { getApiUrl } from '../../utils/getApiUrl';
import Cookies from 'universal-cookie';
import styles from './PremiumAffiliateTree.module.css';

const PremiumAffiliateTree = ({ colorCode }) => {
  const [treeData, setTreeData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullTree, setShowFullTree] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all'); // 'all', 'name', 'email', 'phone'
  const [filteredTreeData, setFilteredTreeData] = useState(null);
  const [searchResultsCount, setSearchResultsCount] = useState(0);
  const cookies = useRef(new Cookies());

  // API call function
  const fetchAffiliateTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = cookies.current.get("USER")?.access_token;
      if (!token) {
        throw new Error('No authentication token found');
      }

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/agent/affiliate-tree`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTreeData(data);
      
      // Auto-expand first level for dashboard view
      if (data?.root_agent?.children) {
        setExpandedNodes(new Set([data.root_agent.agent_id]));
      }
    } catch (err) {
      console.error('Error fetching affiliate tree:', err);
      setError(err.message);
      // Fallback to mock data for development
      setTreeData(mockData);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mock data - fallback for development
  const mockData = {
    "root_agent": {
      "agent_id": 6035,
      "name": "Marcus Chen",
      "email": "user@example.com",
      "affiliate_id": null,
      "avatar": null,
      "created_at": null,
      "state": "active",
      "children": [
        {
          "agent_id": 8069,
          "name": "Rahul Sarswat",
          "email": "info@empireone.ae",
          "affiliate_id": "6035",
          "avatar": null,
          "created_at": "2025-09-06T10:23:51.047513",
          "state": "active",
          "children": [
            {
              "agent_id": 8696,
              "name": "John Smith",
              "email": "johnsmith@fakeemail.com",
              "affiliate_id": "8069",
              "avatar": null,
              "created_at": "2025-09-06T10:26:46.956866",
              "state": "active",
              "children": []
            }
          ]
        },
        {
          "agent_id": 8070,
          "name": "Sarah Johnson",
          "email": "sarah@example.com",
          "affiliate_id": "6035",
          "avatar": null,
          "created_at": "2025-09-06T10:25:00.000000",
          "state": "active",
          "children": []
        }
      ]
    },
    "total_agents": 4,
    "tree_depth": 3
  };

  useEffect(() => {
    fetchAffiliateTree();
  }, []);

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleRefresh = () => {
    fetchAffiliateTree();
  };

  // Enhanced search functionality that finds all matching nodes
  const searchInTree = useCallback((query, type, tree) => {
    if (!query.trim() || !tree) return tree;

    const searchLower = query.toLowerCase();
    const foundNodes = new Set(); // Track all found node IDs
    const nodesToExpand = new Set(); // Track nodes that need to be expanded
    
    const searchAllNodes = (node, parentPath = []) => {
      let matches = false;
      
      switch (type) {
        case 'name':
          matches = node.name?.toLowerCase().includes(searchLower);
          break;
        case 'email':
          matches = node.email?.toLowerCase().includes(searchLower);
          break;
        case 'phone':
          matches = node.phone?.toLowerCase().includes(searchLower);
          break;
        case 'all':
        default:
          matches = 
            node.name?.toLowerCase().includes(searchLower) ||
            node.email?.toLowerCase().includes(searchLower) ||
            node.phone?.toLowerCase().includes(searchLower);
          break;
      }

      if (matches) {
        foundNodes.add(node.agent_id);
        // Add all parent nodes to expansion list
        parentPath.forEach(parentId => nodesToExpand.add(parentId));
      }

      // Continue searching in children
      if (node.children && node.children.length > 0) {
        const newParentPath = [...parentPath, node.agent_id];
        node.children.forEach(child => searchAllNodes(child, newParentPath));
      }
    };

    // First pass: find all matching nodes and their parent paths
    searchAllNodes(tree);
    
    // Auto-expand all necessary nodes
    if (foundNodes.size > 0) {
      setExpandedNodes(prev => new Set([...prev, ...nodesToExpand]));
    }
    
    console.log("Premium Tree - Search results - Found nodes:", Array.from(foundNodes));
    console.log("Premium Tree - Nodes to expand:", Array.from(nodesToExpand));
    
    // Update search results count
    setSearchResultsCount(foundNodes.size);

    // Second pass: build filtered tree with found nodes
    const filterNode = (node) => {
      let matches = false;
      
      switch (type) {
        case 'name':
          matches = node.name?.toLowerCase().includes(searchLower);
          break;
        case 'email':
          matches = node.email?.toLowerCase().includes(searchLower);
          break;
        case 'phone':
          matches = node.phone?.toLowerCase().includes(searchLower);
          break;
        case 'all':
        default:
          matches = 
            node.name?.toLowerCase().includes(searchLower) ||
            node.email?.toLowerCase().includes(searchLower) ||
            node.phone?.toLowerCase().includes(searchLower);
          break;
      }

      if (matches) return node;

      if (node.children && node.children.length > 0) {
        const filteredChildren = node.children
          .map(child => filterNode(child))
          .filter(child => child !== null);

        if (filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          };
        }
      }

      return null;
    };

    return filterNode(tree);
  }, []);

  // Update filtered data when search changes
  useEffect(() => {
    if (treeData && treeData.root_agent) {
      console.log("Premium Tree - Searching with query:", searchQuery, "Type:", searchType);
      const filtered = searchInTree(searchQuery, searchType, treeData.root_agent);
      setFilteredTreeData(filtered);
    }
  }, [searchQuery, searchType, treeData, searchInTree]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchType('all');
    setFilteredTreeData(null);
    setSearchResultsCount(0);
  };

  // Analytics helper functions
  const getActiveAgentsCount = () => {
    if (!treeData?.root_agent) return 0;
    
    let count = 0;
    const countActive = (agents) => {
      agents.forEach(agent => {
        if (agent.state === 'active') count++;
        if (agent.children) countActive(agent.children);
      });
    };
    countActive([treeData.root_agent]);
    return count;
  };

  const getTopPerformersCount = () => {
    // Mock calculation - in real app, this would be based on performance metrics
    return Math.floor((treeData?.total_agents || 0) * 0.3);
  };

  const renderAgentCard = (agent, level = 0) => {
    const isExpanded = expandedNodes.has(agent.agent_id);
    const hasChildren = agent.children && agent.children.length > 0;
    const filteredChildren = agent.children || [];
    const isRoot = level === 0;

    return (
      <div key={agent.agent_id} className={`${styles.agentNode} ${styles[`level${level}`]}`}>
        <div className={`${styles.agentCard} ${isRoot ? styles.rootCard : ''}`}>
          <div className={styles.agentAvatar}>
            {agent.avatar ? (
              <img 
                src={agent.avatar} 
                alt={agent.name}
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatarCircle}>
                {agent.name.charAt(0).toUpperCase()}
              </div>
            )}
            {isRoot && <Crown className={styles.crownIcon} />}
          </div>
          
          <div className={styles.agentDetails}>
            <h3 className={styles.agentName}>{agent.name}</h3>
            <p className={styles.agentEmail}>{agent.email}</p>
            {agent.phone && (
              <p className={styles.agentPhone}>{agent.phone}</p>
            )}
            {isRoot && <span className={styles.rootBadge}>You</span>}
          </div>

          {hasChildren && (
            <button 
              className={styles.expandButton}
              onClick={() => toggleNode(agent.agent_id)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>{filteredChildren.length} Agents</span>
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className={styles.childrenContainer}>
            {filteredChildren.map(child => renderAgentCard(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.premiumAffiliateTree}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>
            <RefreshCw className={styles.spinningIcon} />
          </div>
          <p className={styles.loadingText}>Loading affiliate tree...</p>
        </div>
      </div>
    );
  }

  if (error && !treeData) {
    return (
      <div className={styles.premiumAffiliateTree}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorText}>Failed to load affiliate tree</p>
          <button 
            className={styles.retryButton}
            onClick={handleRefresh}
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.premiumAffiliateTree}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Sparkles className={styles.sparkleIcon} />
        </div>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Your Network</h2>
          <p className={styles.subtitle}>Affiliate tree overview</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.toggleButton}
            onClick={() => setShowFullTree(!showFullTree)}
            title={showFullTree ? "Show compact view" : "Show full tree"}
          >
            {showFullTree ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button 
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw 
              size={18} 
              className={loading ? styles.spinning : ""} 
            />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsOverview}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={20} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{treeData?.total_agents || 0}</div>
            <div className={styles.statLabel}>Total Agents</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={20} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{treeData?.tree_depth || 0}</div>
            <div className={styles.statLabel}>Tree Depth</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <UserCheck size={20} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{getActiveAgentsCount()}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Crown size={20} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{getTopPerformersCount()}</div>
            <div className={styles.statLabel}>Top Performers</div>
          </div>
        </div>
      </div>

      {/* Error Warning */}
      {error && treeData && (
        <div className={styles.warningBanner}>
          <AlertCircle className={styles.warningIcon} />
          <div className={styles.warningContent}>
            <strong>API Error:</strong> Using cached data. {error}
          </div>
          <button onClick={handleRefresh} className={styles.warningRefreshBtn}>
            <RefreshCw className={styles.warningRefreshIcon} />
            Retry
          </button>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className={styles.searchControls}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className={styles.clearButton}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className={styles.filterContainer}>
            <Filter className={styles.filterIcon} />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Fields</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>
        </div>
        
        {searchQuery && (
          <div className={styles.searchResults}>
            <span className={styles.searchResultsText}>
              {filteredTreeData ? 'Search results found' : 'No results found'}
            </span>
          </div>
        )}
      </div>

      {/* Tree Content */}
      <div className={styles.treeContent}>
        <div className={styles.treeView}>
          {(filteredTreeData?.root_agent || treeData?.root_agent) && (
            <div className={showFullTree ? styles.fullTree : styles.compactTree}>
              {renderAgentCard(filteredTreeData?.root_agent || treeData.root_agent)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumAffiliateTree;
