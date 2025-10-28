import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Crown,
  TrendingUp,
  Eye,
  Download,
  RefreshCw,
  AlertCircle,
  ChevronDown,
  Wallet,
  X,
  Mail,
  Phone,
  User
} from 'lucide-react';
import { getApiUrl } from '../utils/getApiUrl';
import Cookies from 'universal-cookie';
import './AffiliateTree.css';
import SectionTop from '../ui/SectionTop';

const AffiliateTree = () => {
  const [treeData, setTreeData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      
      // Auto-expand first level
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
  }, []); // No dependencies to prevent recreation

  // Mock data - fallback for development
  const mockData = {
    "root_agent": {
      "agent_id": 6035,
      "name": "Marcus Chen",
      "email": "user@example.com",
      "affiliate_id": null,
      "avatar": "https://meja.blob.core.windows.net/affx/demo/agents/6035/65294cc5c8896319b24bbb99_masterpieces_img_04_d_scaled_dq6aQU.jpeg",
      "created_at": null,
      "state": "active",
      "children": [
        {
          "agent_id": 8069,
          "name": "Rahul sarswaT",
          "email": "info@empireone.ae",
          "affiliate_id": "6035",
          "avatar": "https://meja.blob.core.windows.net/affx/demo/agents/8069/cropped_image_Hr3VgB_EcHIN3.jpeg",
          "created_at": "2025-09-06T10:23:51.047513",
          "state": "active",
          "children": [
            {
              "agent_id": 8696,
              "name": "daskljdsa",
              "email": "johnsmiwth@fakeemail.com",
              "affiliate_id": "8069",
              "avatar": "https://meja.blob.core.windows.net/affx/demo/agents/8696/cropped_image_BuHQPr_IBXMkm.jpeg",
              "created_at": "2025-09-06T10:26:46.956866",
              "state": "active",
              "children": []
            }
          ]
        }
      ]
    },
    "total_agents": 3,
    "tree_depth": 3
  };

  useEffect(() => {
    fetchAffiliateTree();
  }, []);

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
    if (treeData) {
      const filtered = searchInTree(searchQuery, searchType, treeData);
      setFilteredTreeData(filtered);
    }
  }, [searchQuery, searchType, treeData, searchInTree]);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchType('all');
    setFilteredTreeData(null);
    setSearchResultsCount(0);
  };

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

    return (
      <div key={agent.agent_id} className={`agent-node level-${level}`}>
        <div className="agent-card">
          <div className="agent-avatar">
            {agent.avatar ? (
              <img 
                src={agent.avatar} 
                alt={agent.name}
                className="avatar-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="avatar-circle" style={{ display: agent.avatar ? 'none' : 'flex' }}>
              {agent.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <h3 className="agent-name">
            {agent.name}
          </h3>
          <p className="agent-email">{agent.email}</p>
          {agent.phone && (
            <p className="agent-phone">📞 {agent.phone}</p>
          )}
          
          {hasChildren && (
            <button
              className="luxury-expand-btn"
              onClick={() => toggleNode(agent.agent_id)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
                minWidth: '100px',
                justifyContent: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '8px auto',
              }}
            >
              <Users size={14} />
              {isExpanded ? `${filteredChildren.length} AGENTS` : `${agent.children.length} AGENTS`}
              <span className="shimmer"></span>
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="children-container">
            {filteredChildren.map(child => renderAgentCard(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderGridView = () => {
    const allAgents = [];
    const collectAgents = (agents) => {
      agents.forEach(agent => {
        if (agent.agent_id !== 0) {
          allAgents.push(agent);
        }
        if (agent.children) {
          collectAgents(agent.children);
        }
      });
    };

    if (treeData?.root_agent?.children) {
      collectAgents(treeData.root_agent.children);
    }

    const filteredAgents = allAgents;

    return (
      <div className="grid-view">
        <div className="grid-header">
          <h3>All Agents ({filteredAgents.length})</h3>
        </div>
        <div className="agents-grid">
          {filteredAgents.map(agent => (
            <div key={agent.agent_id} className="grid-agent-card">
              <div className="grid-avatar">
                {agent.avatar ? (
                  <img 
                    src={agent.avatar} 
                    alt={agent.name}
                    className="grid-avatar-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="grid-avatar-circle" style={{ display: agent.avatar ? 'none' : 'flex' }}>
                  {agent.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <h4 className="grid-name">{agent.name}</h4>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="affiliate-tree-container">
        <div className="loading-container">
          <RefreshCw className="loading-spinner" />
          <p>Loading affiliate tree...</p>
        </div>
      </div>
    );
  }

  if (error && !treeData) {
    return (
      <div className="affiliate-tree-container">
        <div className="error-container">
          <AlertCircle className="error-icon" />
          <h3>Error Loading Affiliate Tree</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            <RefreshCw className="retry-icon" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sectionContainer">
            <SectionTop heading="Lead Details" />
    <div className="affiliate-tree-container sectionStyles">
      {/* Header */}
      <div className="ultra-compact-header">
        <div className="header-left">
          <Users className="title-icon" size={20} />
          <h1 className="compact-title">Affiliate Tree</h1>
        </div>
        <div className="ultra-compact-stats">
          <div className="mini-stat">
            <Users size={14} />
            <span>{treeData?.total_agents || 0}</span>
          </div>
          <div className="mini-stat">
            <TrendingUp size={14} />
            <span>{treeData?.tree_depth || 0}</span>
          </div>
          <div className="mini-stat">
            <UserCheck size={14} />
            <span>{getActiveAgentsCount()}</span>
          </div>
          <div className="mini-stat">
            <Crown size={14} />
            <span>{getTopPerformersCount()}</span>
          </div>
          <button 
            onClick={handleRefresh} 
            className="mini-refresh"
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {/* Error Warning */}
      {error && treeData && (
        <div className="warning-banner">
          <AlertCircle className="warning-icon" />
          <div className="warning-content">
            <strong>API Error:</strong> Using cached data. {error}
          </div>
          <button onClick={handleRefresh} className="warning-refresh-btn">
            <RefreshCw className="warning-refresh-icon" />
            Retry
          </button>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="search-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="clear-button"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="filter-container">
            <Filter className="filter-icon" />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Fields</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>
        </div>
        
        {searchQuery && (
          <div className="search-results">
            <span className="search-results-text">
              {searchResultsCount > 0 
                ? `Found ${searchResultsCount} result${searchResultsCount !== 1 ? 's' : ''} - Auto-expanded to show hidden matches`
                : 'No results found'
              }
            </span>
          </div>
        )}
      </div>

      {/* Tree Content */}
      <div className="tree-content">
        <div className="tree-view">
          {(filteredTreeData?.root_agent || treeData?.root_agent) && 
            renderAgentCard(filteredTreeData?.root_agent || treeData.root_agent)}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AffiliateTree;
