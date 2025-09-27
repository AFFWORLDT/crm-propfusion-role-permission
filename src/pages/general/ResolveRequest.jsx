import { useState, useEffect } from 'react';
import styles from "./../../styles/ResolveRequest.module.css";
import toast from 'react-hot-toast';
import { 
  CheckCircle, AlertTriangle, X, Clock, AlertCircle,
  Eye, MessageSquare
} from 'lucide-react';
import SectionTop from '../../ui/SectionTop';
import TabBar from '../../ui/TabBar';
import { SUPPORT_TABS } from '../../utils/constants';
import { 
  getAllQueriesFromAllOrganizations,
  getQueryCategories, 
  getQueryPriorities,
  getQueryStats,
  updateQuery,
  resolveQuery
} from '../../services/apiIssues';
import { formatToGMT4, truncateTitle, formatErrorMessage } from '../../utils/formatUtils';

function ResolveRequest() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [stats, setStats] = useState({
    total_queries: 0,
    open_queries: 0,
    in_progress_queries: 0,
    resolved_queries: 0,
    closed_queries: 0,
    reopened_queries: 0,
    under_review_queries: 0
  });

  // Queries List State
  const [queries, setQueries] = useState([]);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status_filter: '',
    priority: '',
    category: '',
    is_urgent: '',
    organization: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  // Resolution modal state
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has access to this page
  const isAdminDomain = window.location.hostname === 'propfusion-portal.propfusion.ae' ||
                       (window.location.hostname === 'localhost' && window.location.port === '5173');

  // Load initial data
  useEffect(() => {
    if (isAdminDomain) {
      loadInitialData();
    }
  }, [isAdminDomain]);

  if (!isAdminDomain) {
    return (
      <div className="sectionContainer">
        <SectionTop heading="Access Denied">
          <p>You do not have permission to view this page.</p>
        </SectionTop>
      </div>
    );
  }

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, prioritiesData, statsData] = await Promise.all([
        getQueryCategories().catch(() => []),
        getQueryPriorities().catch(() => []),
        getQueryStats().catch(() => ({ 
          total_queries: 0, 
          open_queries: 0, 
          in_progress_queries: 0, 
          resolved_queries: 0, 
          closed_queries: 0, 
          reopened_queries: 0, 
          under_review_queries: 0 
        }))
      ]);

      setCategories(categoriesData || []);
      setPriorities(prioritiesData || []);
      setStats(statsData || { 
        total_queries: 0, 
        open_queries: 0, 
        in_progress_queries: 0, 
        resolved_queries: 0, 
        closed_queries: 0, 
        reopened_queries: 0, 
        under_review_queries: 0 
      });
      
      // Load queries list
      await loadQueries();
    } catch (error) {
      console.error('Error loading initial data:', error);
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadQueries = async (page = 1, newFilters = null) => {
    try {
      setQueriesLoading(true);
      const currentFilters = newFilters || filters;
      
      const params = {
        page,
        size: 10,
        sort_by: currentFilters.sort_by,
        sort_order: currentFilters.sort_order,
        ...(currentFilters.status_filter && { status_filter: currentFilters.status_filter }),
        ...(currentFilters.priority && { priority: currentFilters.priority }),
        ...(currentFilters.category && { category: currentFilters.category }),
        ...(currentFilters.is_urgent !== '' && { is_urgent: currentFilters.is_urgent === 'true' }),
        ...(currentFilters.organization && { organization: currentFilters.organization })
      };

      const response = await getAllQueriesFromAllOrganizations(params);
      
      setQueries(response.queries || []);
      setCurrentPage(response.page || 1);
      setTotalPages(Math.ceil((response.total || 0) / 10));
      
      // Update stats from the response
      if (response.report) {
        setStats({
          total_queries: response.report.total_queries || 0,
          open_queries: response.report.open_queries || 0,
          in_progress_queries: response.report.in_progress_queries || 0,
          resolved_queries: response.report.resolved_queries || 0,
          closed_queries: response.report.closed_queries || 0,
          reopened_queries: response.report.reopened_queries || 0,
          under_review_queries: response.report.under_review_queries || 0
        });
      }
    } catch (error) {
      console.error('Error loading queries:', error);
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setQueriesLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    loadQueries(1, newFilters);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadQueries(page);
  };

  const handleResolveQuery = (query) => {
    setSelectedQuery(query);
    setResolutionNotes('');
    setShowResolutionModal(true);
  };

  const handleSubmitResolution = async () => {
    if (!selectedQuery || !resolutionNotes.trim()) {
      toast.error('Please provide resolution notes');
      return;
    }

    setIsSubmitting(true);
    try {
      // Try to use the resolve endpoint first
      try {
        await resolveQuery(selectedQuery.id, {
          resolution_notes: resolutionNotes.trim(),
          status: 'resolved'
        });
      } catch (resolveError) {
        // Fallback to update endpoint
        await updateQuery(selectedQuery.id, {
          resolution_notes: resolutionNotes.trim(),
          status: 'resolved'
        });
      }

      toast.success('Query resolved successfully!');
      setShowResolutionModal(false);
      setSelectedQuery(null);
      setResolutionNotes('');
      
      // Refresh queries list
      await loadQueries(currentPage);
    } catch (error) {
      console.error('Error resolving query:', error);
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeResolutionModal = () => {
    setShowResolutionModal(false);
    setSelectedQuery(null);
    setResolutionNotes('');
  };

  const getPriorityColor = (priority) => {
    if (!priority) return '#6b7280';
    const name = typeof priority === 'string' ? priority.toLowerCase() : priority.name?.toLowerCase() || '';
    if (name.includes('low')) return '#10b981';
    if (name.includes('medium')) return '#f59e0b';
    if (name.includes('high')) return '#ef4444';
    if (name.includes('critical')) return '#dc2626';
    return '#6b7280';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={16} style={{ color: '#f59e0b' }} />;
      case 'in_progress':
        return <Clock size={16} style={{ color: '#3b82f6' }} />;
      case 'resolved':
        return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      case 'closed':
        return <X size={16} style={{ color: '#6b7280' }} />;
      default:
        return <AlertCircle size={16} style={{ color: '#6b7280' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return '#fef3c7';
      case 'in_progress':
        return '#dbeafe';
      case 'resolved':
        return '#d1fae5';
      case 'closed':
        return '#f3f4f6';
      default:
        return '#f3f4f6';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return formatToGMT4(new Date(dateString));
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="sectionContainer">
        <SectionTop heading="Resolve Requests">
          <TabBar
            tabs={SUPPORT_TABS}
            activeTab={"SUPPORT"}
            navigateTo={(id) => SUPPORT_TABS.find(tab => tab.id === id)?.path || '/admin/general/support'}
          />
        </SectionTop>
        <div className={styles.container}>
          <div className={styles.headerSection}>
            <div className={styles.spinner}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sectionContainer">
      <SectionTop heading="Resolve Requests">
        <TabBar
          tabs={SUPPORT_TABS}
          activeTab={"SUPPORT"}
          navigateTo={(id) => {
            const tab = SUPPORT_TABS.find(tab => tab.id === id);
            if (tab) {
              window.location.href = tab.path;
            }
          }}
        />
      </SectionTop>
      
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>
            <CheckCircle size={48} className={styles.titleIcon} />
            <span className={styles.titleText}>Resolve Requests</span>
          </h1>
          <p className={styles.subtitle}>
            Manage and resolve support requests from all organizations. 
            Review, update status, and provide resolution notes.
          </p>
        </div>

        {/* Stats Section */}
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.total_queries || 0}</span>
              <span className={styles.statLabel}>Total Requests</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.open_queries || 0}</span>
              <span className={styles.statLabel}>Open</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.in_progress_queries || 0}</span>
              <span className={styles.statLabel}>In Progress</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.resolved_queries || 0}</span>
              <span className={styles.statLabel}>Resolved</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.closed_queries || 0}</span>
              <span className={styles.statLabel}>Closed</span>
            </div>
          </div>
        </div>

        {/* Queries List Section */}
        <div className={styles.queriesSection}>
          <div className={styles.queriesHeader}>
            <h2 className={styles.queriesTitle}>
              <Eye size={24} />
              All Requests
            </h2>
          </div>

          {/* Filters Section */}
          <div className={styles.filtersSection}>
            <h3 className={styles.filtersTitle}>Filter & Search</h3>
            <div className={styles.filtersContainer}>
              <select
                value={filters.status_filter}
                onChange={(e) => handleFilterChange('status_filter', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Priorities</option>
                {priorities.map((priority, index) => (
                  <option key={`priority-${index}`} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={`category-${index}`} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={filters.is_urgent}
                onChange={(e) => handleFilterChange('is_urgent', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Urgency</option>
                <option value="true">Urgent</option>
                <option value="false">Not Urgent</option>
              </select>

              <input
                type="text"
                placeholder="Filter by organization..."
                value={filters.organization}
                onChange={(e) => handleFilterChange('organization', e.target.value)}
                className={styles.filterSelect}
              />

              <select
                value={`${filters.sort_by}-${filters.sort_order}`}
                onChange={(e) => {
                  const [sort_by, sort_order] = e.target.value.split('-');
                  handleFilterChange('sort_by', sort_by);
                  handleFilterChange('sort_order', sort_order);
                }}
                className={styles.filterSelect}
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="updated_at-desc">Recently Updated</option>
                <option value="updated_at-asc">Least Recently Updated</option>
              </select>
            </div>
          </div>

          {/* Queries List */}
          <div className={styles.queriesList}>
            {queriesLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Loading requests...</p>
              </div>
            ) : queries.length === 0 ? (
              <div className={styles.emptyState}>
                <AlertCircle size={48} />
                <h3>No requests found</h3>
                <p>No requests match your current filters or there are no requests yet.</p>
              </div>
            ) : (
              <>
                {queries.map(query => (
                  <div key={query.id} className={styles.queryCard}>
                    <div className={styles.queryHeader}>
                      <div className={styles.queryTitle}>
                        {getStatusIcon(query.status)}
                        <h3 title={query.title}>{truncateTitle(query.title)}</h3>
                        <span 
                          className={styles.priorityBadge}
                          style={{ 
                            backgroundColor: getPriorityColor(query.priority)
                          }}
                        >
                          {query.priority}
                        </span>
                        {query.is_urgent && (
                          <span className={styles.urgentBadge}>
                            <AlertTriangle size={14} />
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className={styles.queryMeta}>
                        <span className={styles.queryNumber}>#{query.query_number || query.id}</span>
                        <span className={styles.queryDate}>{formatDate(query.created_at)}</span>
                      </div>
                    </div>

                    <div className={styles.queryDescription}>
                      {query.description?.substring(0, 150)}
                      {query.description?.length > 150 && '...'}
                    </div>

                    <div className={styles.queryInfo}>
                      <div className={styles.queryDetails}>
                        <div className={styles.queryDetail}>
                          <strong>Organization:</strong> {query.organization_name || 'N/A'}
                        </div>
                        <div className={styles.queryDetail}>
                          <strong>Reporter:</strong> {query.reporter_name || 'N/A'}
                        </div>
                        <div className={styles.queryDetail}>
                          <strong>Category:</strong> {query.category || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Resolution Notes */}
                    {query.resolution_notes && (
                      <div className={styles.resolutionNotes}>
                        <div className={styles.resolutionHeader}>
                          <CheckCircle size={16} className={styles.resolutionIcon} />
                          <span className={styles.resolutionTitle}>Resolution Notes</span>
                        </div>
                        <div className={styles.resolutionContent}>
                          <p className={styles.resolutionText}>
                            {query.resolution_notes}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className={styles.queryFooter}>
                      <div className={styles.queryTags}>
                        <span 
                          className={styles.statusTag}
                          style={{ backgroundColor: getStatusColor(query.status) }}
                        >
                          {query.status.replace('_', ' ')}
                        </span>
                        <span className={styles.categoryTag}>
                          {query.category}
                        </span>
                      </div>
                      
                      <div className={styles.queryActions}>
                        <button
                          onClick={() => handleResolveQuery(query)}
                          className={styles.resolveButton}
                          disabled={query.status === 'resolved' || query.status === 'closed'}
                        >
                          <CheckCircle size={16} />
                          {query.status === 'resolved' || query.status === 'closed' ? 'Resolved' : 'Resolve'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={styles.paginationButton}
                    >
                      Previous
                    </button>
                    
                    <span className={styles.paginationInfo}>
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={styles.paginationButton}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolutionModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Resolve Request</h2>
              <button onClick={closeResolutionModal} className={styles.closeButton}>
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.queryInfo}>
                <h3>{selectedQuery?.title}</h3>
                <p><strong>Organization:</strong> {selectedQuery?.organization_name || 'N/A'}</p>
                <p><strong>Reporter:</strong> {selectedQuery?.reporter_name || 'N/A'}</p>
                <p><strong>Category:</strong> {selectedQuery?.category || 'N/A'}</p>
                <p><strong>Priority:</strong> {selectedQuery?.priority || 'N/A'}</p>
              </div>
              
              <div className={styles.resolutionForm}>
                <label htmlFor="resolutionNotes" className={styles.resolutionLabel}>
                  <MessageSquare size={18} />
                  Resolution Notes
                </label>
                <textarea
                  id="resolutionNotes"
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className={styles.resolutionTextarea}
                  placeholder="Provide detailed resolution notes..."
                  rows={6}
                />
              </div>
              
              <div className={styles.modalActions}>
                <button
                  onClick={closeResolutionModal}
                  className={styles.cancelButton}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitResolution}
                  className={styles.submitButton}
                  disabled={isSubmitting || !resolutionNotes.trim()}
                >
                  {isSubmitting ? 'Resolving...' : 'Resolve Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResolveRequest;
