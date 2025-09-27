import { useState, useRef, useEffect } from 'react';
import styles from "./../../styles/RaiseIssue.module.css"
import toast from 'react-hot-toast';
import { 
  Headphones, AlertTriangle, Upload, X, Paperclip, Send, 
  TrendingUp, Clock, CheckCircle, AlertCircle,
  Filter, HelpCircle, FileText, Eye
} from 'lucide-react';
import SectionTop from '../../ui/SectionTop';
import TabBar from '../../ui/TabBar';
import { SUPPORT_TABS } from '../../utils/constants';
import { 
  createQuery, 
  getOrganizationQueries, 
  getQueryCategories, 
  getQueryPriorities,
  getQueryStats
} from '../../services/apiIssues';
import { formatToGMT4, truncateTitle, formatErrorMessage } from '../../utils/formatUtils';

function RaiseIssue() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // API Data
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
    status: '',
    priority: '',
    category: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Attachment modal state
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  
  // Resolution notes modal state
  const [selectedResolutionNotes, setSelectedResolutionNotes] = useState('');
  const [showResolutionModal, setShowResolutionModal] = useState(false);

  const fileInputRef = useRef(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

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
        sort_by: currentFilters.sortBy,
        sort_order: currentFilters.sortOrder,
        ...(currentFilters.status && { status_filter: currentFilters.status }),
        ...(currentFilters.priority && { priority: currentFilters.priority }),
        ...(currentFilters.category && { category: currentFilters.category })
      };

      const response = await getOrganizationQueries(params);
      
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

  const handleViewAttachments = (attachments) => {
    setSelectedAttachments(attachments);
    setShowAttachmentModal(true);
  };

  const closeAttachmentModal = () => {
    setShowAttachmentModal(false);
    setSelectedAttachments([]);
  };

  const handleViewResolutionNotes = (notes) => {
    setSelectedResolutionNotes(notes);
    setShowResolutionModal(true);
  };

  const closeResolutionModal = () => {
    setShowResolutionModal(false);
    setSelectedResolutionNotes('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files].slice(0, 5)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('priority', formData.priority);
      formDataToSend.append('is_urgent', 'false');
      
      // Add attachments
      formData.attachments.forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      // Create the query
      await createQuery(formDataToSend);
      
      toast.success('Support request submitted successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: '',
        attachments: []
      });

      // Refresh queries list and stats
      await loadQueries();

    } catch (error) {
      console.error('Error creating issue:', error);
      const errorMessage = formatErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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

  const formatDate = (dateString) => {
    return formatToGMT4(dateString, 'dd MMM h:mm a');
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

  if (isLoading) {
    return (
      <div className="sectionContainer">
        <SectionTop heading="Support">
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
      <SectionTop heading="Support">
        <TabBar
          tabs={SUPPORT_TABS}
          activeTab={"SUPPORT"}
          navigateTo={(id) => {
            const tab = SUPPORT_TABS.find(tab => tab.id === id);
            return tab ? tab.path : '/support';
          }}
        />
      </SectionTop>
      
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>
            <Headphones size={48} className={styles.titleIcon} />
            <span className={styles.titleText}>Support Request</span>
          </h1>
          <p className={styles.subtitle}>
            Get help with any questions or issues you may have. 
            Our support team is here to assist you promptly!
          </p>
        </div>

        <div className={styles.mainContent}>
          {/* Main Form */}
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Category */}
              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>
                  <Filter size={18} />
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={styles.select}
                  disabled={categories.length === 0}
                >
                  <option value="">{categories.length === 0 ? 'Loading categories...' : 'Select a category'}</option>
                  {categories.map((category, index) => (
                    <option key={`category-${index}`} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className={styles.error}>
                    <AlertTriangle size={14} />
                    {errors.category}
                  </span>
                )}
              </div>

              {/* Title */}
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  <HelpCircle size={18} />
                  Request Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Brief description of your request"
                />
                {errors.title && (
                  <span className={styles.error}>
                    <AlertTriangle size={14} />
                    {errors.title}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  <AlertTriangle size={18} />
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Please provide detailed information about your request..."
                  rows={6}
                />
                {errors.description && (
                  <span className={styles.error}>
                    <AlertTriangle size={14} />
                    {errors.description}
                  </span>
                )}
              </div>

              {/* Priority */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <TrendingUp size={18} />
                  Priority Level
                </label>
                {priorities.length === 0 ? (
                  <div className={styles.priorityGrid}>
                    <div className={styles.priorityOption} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      Loading priorities...
                    </div>
                  </div>
                ) : (
                  <div className={styles.priorityGrid}>
                    {priorities.map((priority, index) => (
                      <div
                        key={`priority-${index}`}
                        className={`${styles.priorityOption} ${
                          formData.priority === priority ? styles.selected : ''
                        } ${styles[`priority${priority.replace(/\s+/g, '')}`] || ''}`}
                        onClick={() => handleChange({ 
                          target: { name: 'priority', value: priority }
                        })}
                        style={{
                          borderColor: formData.priority === priority 
                            ? getPriorityColor(priority) 
                            : '#e5e7eb'
                        }}
                      >
                        {priority}
                      </div>
                    ))}
                  </div>
                )}
                {errors.priority && (
                  <span className={styles.error}>
                    <AlertTriangle size={14} />
                    {errors.priority}
                  </span>
                )}
              </div>




              {/* File Upload */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Paperclip size={18} />
                  Attachments
                </label>
                <div
                  className={styles.fileUploadArea}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={32} />
                  <p>Drop files here or click to upload</p>
                  <small>Max 5 files. Screenshots, logs, or error messages are helpful!</small>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className={styles.fileInput}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,.log,.txt,.pdf,.doc,.docx"
                />
                {formData.attachments.length > 0 && (
                  <div className={styles.filePreview}>
                    {formData.attachments.map((file, index) => (
                      <div key={index} className={styles.previewItem}>
                        {file.type.startsWith('image/') ? (
                          <div className={styles.imagePreview}>
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={file.name}
                              className={styles.previewImage}
                            />
                          </div>
                        ) : (
                          <div className={styles.fileIcon}>
                            {file.type.includes('pdf') ? (
                              <FileText size={20} />
                            ) : file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx') ? (
                              <FileText size={20} />
                            ) : file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.log') ? (
                              <FileText size={20} />
                            ) : (
                              <Paperclip size={20} />
                            )}
                          </div>
                        )}
                        <div className={styles.fileInfo}>
                          <span className={styles.fileName}>{file.name}</span>
                          <span className={styles.fileSize}>
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className={styles.removeFile}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className={styles.spinner}></div>
                    Submitting Issue...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Raise Issue
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Stats */}
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
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{stats.reopened_queries || 0}</span>
                <span className={styles.statLabel}>Reopened</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{stats.under_review_queries || 0}</span>
                <span className={styles.statLabel}>Under Review</span>
              </div>
            </div>


          </div>
        </div>

        {/* Queries List Section */}
        <div className={styles.issuesSection}>
          <div className={styles.issuesHeader}>
            <h2 className={styles.issuesTitle}>
              <Eye size={24} />
              All Requests
            </h2>
            
            {/* Filters */}
            <div className={styles.filtersContainer}>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
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
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
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
          <div className={styles.issuesList}>
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
                  <div key={query.id} className={styles.issueCard}>
                    <div className={styles.issueHeader}>
                      <div className={styles.issueTitle}>
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
                      </div>
                      <div className={styles.issueMeta}>
                        <span className={styles.issueNumber}>#{query.query_number || query.id}</span>
                        <span className={styles.issueDate}>{formatDate(query.created_at)}</span>
                      </div>
                    </div>

                    <div className={styles.issueDescription}>
                      {query.description?.substring(0, 150)}
                      {query.description?.length > 150 && '...'}
                    </div>

                    {/* Resolution Notes */}
                    {query.resolution_notes && (
                      <div className={styles.resolutionNotes}>
                        <div className={styles.resolutionHeader}>
                          <CheckCircle size={16} className={styles.resolutionIcon} />
                          <span className={styles.resolutionTitle}>Resolution Notes</span>
                        </div>
                        <div className={styles.resolutionContent}>
                          {query.resolution_notes.length > 200 ? (
                            <>
                              <p className={styles.resolutionText}>
                                {query.resolution_notes.substring(0, 200)}...
                              </p>
                              <button 
                                className={styles.readMoreButton}
                                onClick={() => handleViewResolutionNotes(query.resolution_notes)}
                              >
                                Read More
                              </button>
                            </>
                          ) : (
                            <p className={styles.resolutionText}>
                              {query.resolution_notes}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className={styles.issueFooter}>
                      <div className={styles.issueInfo}>
                        <div className={styles.reporterInfo}>
                          {query.reporter_avatar ? (
                            <img 
                              src={query.reporter_avatar} 
                              alt={query.reporter_name}
                              className={styles.reporterAvatar}
                            />
                          ) : (
                            <div className={styles.reporterAvatarPlaceholder}>
                              {query.reporter_name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <span className={styles.reporterName}>{query.reporter_name}</span>
                        </div>
                        
                        <div className={styles.issueTags}>
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
                      </div>
                      
                      {query.attachments && query.attachments.length > 0 && (
                        <button
                          onClick={() => handleViewAttachments(query.attachments)}
                          className={styles.attachmentsButton}
                        >
                          <Paperclip size={14} />
                          <span>{query.attachments.length} attachment(s)</span>
                        </button>
                      )}
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

        {/* Attachment Modal */}
        {showAttachmentModal && (
          <div className={styles.modal} onClick={closeAttachmentModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Attachments</h3>
                <button onClick={closeAttachmentModal} className={styles.closeButton}>
                  <X size={20} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.attachmentsGrid}>
                  {selectedAttachments.map((attachment, index) => (
                    <div key={index} className={styles.attachmentItem}>
                      {attachment.toLowerCase().includes('.jpg') || 
                       attachment.toLowerCase().includes('.jpeg') || 
                       attachment.toLowerCase().includes('.png') || 
                       attachment.toLowerCase().includes('.gif') ? (
                        <img 
                          src={attachment} 
                          alt={`Attachment ${index + 1}`}
                          className={styles.attachmentImage}
                          onClick={() => window.open(attachment, '_blank')}
                        />
                      ) : (
                        <div className={styles.attachmentFile}>
                          <FileText size={32} />
                          <span className={styles.attachmentFileName}>
                            {attachment.split('/').pop()}
                          </span>
                          <button 
                            onClick={() => window.open(attachment, '_blank')}
                            className={styles.downloadButton}
                          >
                            Download
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resolution Notes Modal */}
        {showResolutionModal && (
          <div className={styles.modal} onClick={closeResolutionModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitleWithIcon}>
                  <CheckCircle size={20} className={styles.resolutionIcon} />
                  <h3>Resolution Notes</h3>
                </div>
                <button onClick={closeResolutionModal} className={styles.closeButton}>
                  <X size={20} />
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.resolutionModalContent}>
                  <p className={styles.fullResolutionText}>
                    {selectedResolutionNotes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RaiseIssue;
