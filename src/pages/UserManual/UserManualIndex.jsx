import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Home, Users, Building2, Target, FileText, Calendar, 
  Settings, BarChart3, Zap, HelpCircle, ChevronRight, Search,
  Play, Download, ExternalLink, Star, Clock, Bookmark, MessageCircle,
  TrendingUp, Award, Globe, Shield, Heart, Lightbulb, Rocket
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './UserManualIndex.module.css';

const UserManualIndex = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const sections = [
    {
      id: 'overview',
      title: 'Project Overview',
      icon: <BookOpen size={24} />,
      description: 'Understanding CRM Property Fusion system',
      color: '#3B82F6',
      category: 'Foundation',
      difficulty: 'Beginner',
      timeToRead: '5 min',
      features: ['System Overview', 'Key Features', 'Target Users', 'Requirements'],
      tags: ['system', 'overview', 'features', 'introduction'],
      popularity: 95,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Home size={24} />,
      description: 'First time setup and navigation basics',
      color: '#10B981',
      category: 'Foundation',
      difficulty: 'Beginner',
      timeToRead: '10 min',
      features: ['System Setup', 'Navigation', 'First Steps', 'Quick Tour'],
      tags: ['setup', 'navigation', 'first-steps', 'quick-start'],
      popularity: 98,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'authentication',
      title: 'Authentication & Users',
      icon: <Users size={24} />,
      description: 'Login, roles, and user management',
      color: '#F59E0B',
      category: 'Foundation',
      difficulty: 'Beginner',
      timeToRead: '8 min',
      features: ['User Roles', 'Permissions', 'Security', 'Profile Management'],
      tags: ['login', 'roles', 'security', 'users', 'permissions'],
      popularity: 92,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'dashboard',
      title: 'Dashboard & Analytics',
      icon: <BarChart3 size={24} />,
      description: 'Main dashboard and performance metrics',
      color: '#8B5CF6',
      category: 'Core Features',
      difficulty: 'Intermediate',
      timeToRead: '12 min',
      features: ['Key Metrics', 'Quick Actions', 'Widgets', 'Customization'],
      tags: ['dashboard', 'analytics', 'metrics', 'performance', 'widgets'],
      popularity: 88,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'properties',
      title: 'Property Management',
      icon: <Building2 size={24} />,
      description: 'Complete property lifecycle management',
      color: '#EF4444',
      category: 'Core Features',
      difficulty: 'Intermediate',
      timeToRead: '20 min',
      features: ['Property Creation', 'Media Management', 'Sharing', 'Viewings'],
      tags: ['properties', 'listings', 'photos', 'viewings', 'sharing'],
      popularity: 96,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'leads',
      title: 'Lead Management',
      icon: <Target size={24} />,
      description: 'Lead capture, qualification, and conversion',
      color: '#06B6D4',
      category: 'Core Features',
      difficulty: 'Intermediate',
      timeToRead: '18 min',
      features: ['Lead Capture', 'Qualification', 'Follow-up', 'Conversion'],
      tags: ['leads', 'capture', 'qualification', 'follow-up', 'conversion'],
      popularity: 90,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'customers',
      title: 'Customer Management',
      icon: <Users size={24} />,
      description: 'Customer database and communication',
      color: '#84CC16',
      category: 'Core Features',
      difficulty: 'Intermediate',
      timeToRead: '15 min',
      features: ['Customer Database', 'Communication', 'Preferences', 'History'],
      tags: ['customers', 'database', 'communication', 'preferences', 'history'],
      popularity: 87,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'contracts',
      title: 'Contract Management',
      icon: <FileText size={24} />,
      description: 'Contract workflows and document management',
      color: '#F97316',
      category: 'Advanced Features',
      difficulty: 'Advanced',
      timeToRead: '16 min',
      features: ['Contract Types', 'Workflows', 'Templates', 'Digital Signatures'],
      tags: ['contracts', 'workflows', 'templates', 'digital-signatures', 'compliance'],
      popularity: 85,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'calendar',
      title: 'Calendar & Scheduling',
      icon: <Calendar size={24} />,
      description: 'Appointments, viewings, and scheduling',
      color: '#EC4899',
      category: 'Core Features',
      difficulty: 'Intermediate',
      timeToRead: '12 min',
      features: ['Scheduling', 'Calendar Integration', 'Reminders', 'Availability'],
      tags: ['calendar', 'scheduling', 'appointments', 'viewings', 'integration'],
      popularity: 89,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'admin',
      title: 'Admin & Settings',
      icon: <Settings size={24} />,
      description: 'System configuration and user management',
      color: '#6B7280',
      category: 'Advanced Features',
      difficulty: 'Advanced',
      timeToRead: '18 min',
      features: ['User Management', 'System Config', 'Data Management', 'Access Control'],
      tags: ['admin', 'settings', 'users', 'configuration', 'permissions'],
      popularity: 82,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: <BarChart3 size={24} />,
      description: 'Business intelligence and custom reports',
      color: '#059669',
      category: 'Advanced Features',
      difficulty: 'Advanced',
      timeToRead: '15 min',
      features: ['Business Reports', 'Financial Reports', 'Custom Reports', 'Analytics'],
      tags: ['reports', 'analytics', 'business-intelligence', 'custom-reports', 'data'],
      popularity: 86,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: <Zap size={24} />,
      description: 'External systems and portal connections',
      color: '#DC2626',
      category: 'Advanced Features',
      difficulty: 'Advanced',
      timeToRead: '14 min',
      features: ['Property Portals', 'Communication Tools', 'Business Tools', 'APIs'],
      tags: ['integrations', 'portals', 'apis', 'external-systems', 'connectivity'],
      popularity: 84,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'gallery',
      title: 'Property Gallery',
      icon: <Building2 size={24} />,
      description: 'Interactive property showcase and reels',
      color: '#7C3AED',
      category: 'Core Features',
      difficulty: 'Intermediate',
      timeToRead: '12 min',
      features: ['Interactive Slideshow', 'Property Reels', 'Sharing', 'Customization'],
      tags: ['gallery', 'showcase', 'reels', 'interactive', 'presentation'],
      popularity: 91,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <HelpCircle size={24} />,
      description: 'Common issues and solutions',
      color: '#D97706',
      category: 'Support',
      difficulty: 'All Levels',
      timeToRead: '10 min',
      features: ['Common Issues', 'Solutions', 'Support', 'Best Practices'],
      tags: ['troubleshooting', 'issues', 'solutions', 'support', 'help'],
      popularity: 93,
      lastUpdated: '2024-01-15'
    }
  ];

  const quickActions = [
    {
      title: 'Video Tutorials',
      icon: <Play size={20} />,
      description: 'Watch step-by-step video guides',
      color: '#3B82F6',
      link: '#video-tutorials',
      count: '50+ videos'
    },
    {
      title: 'Download PDF',
      icon: <Download size={20} />,
      description: 'Download complete manual as PDF',
      color: '#10B981',
      link: '#download',
      count: 'Full manual'
    },
    {
      title: 'Live Support',
      icon: <HelpCircle size={20} />,
      description: 'Get help from our support team',
      color: '#F59E0B',
      link: '#support',
      count: '24/7 available'
    },
    {
      title: 'Training Schedule',
      icon: <Calendar size={20} />,
      description: 'Book training sessions',
      color: '#8B5CF6',
      link: '#training',
      count: 'Weekly sessions'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: sections.length },
    { id: 'Foundation', name: 'Foundation', count: sections.filter(s => s.category === 'Foundation').length },
    { id: 'Core Features', name: 'Core Features', count: sections.filter(s => s.category === 'Core Features').length },
    { id: 'Advanced Features', name: 'Advanced Features', count: sections.filter(s => s.category === 'Advanced Features').length },
    { id: 'Support', name: 'Support', count: sections.filter(s => s.category === 'Support').length }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels', count: sections.length },
    { id: 'Beginner', name: 'Beginner', count: sections.filter(s => s.difficulty === 'Beginner').length },
    { id: 'Intermediate', name: 'Intermediate', count: sections.filter(s => s.difficulty === 'Intermediate').length },
    { id: 'Advanced', name: 'Advanced', count: sections.filter(s => s.difficulty === 'Advanced').length },
    { id: 'All Levels', name: 'All Levels', count: sections.filter(s => s.difficulty === 'All Levels').length }
  ];

  const difficultyColors = {
    'Beginner': '#10B981',
    'Intermediate': '#F59E0B',
    'Advanced': '#EF4444',
    'All Levels': '#6B7280'
  };

  const categoryColors = {
    'Foundation': '#3B82F6',
    'Core Features': '#10B981',
    'Advanced Features': '#F59E0B',
    'Support': '#8B5CF6'
  };

  // Filter and sort sections
  const filteredSections = sections
    .filter(section => {
      const matchesSearch = searchQuery === '' || 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || section.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return b.popularity - a.popularity;
        case 'time':
          return parseInt(a.timeToRead) - parseInt(b.timeToRead);
        case 'updated':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        default:
          return 0;
      }
    });

  const handleSectionClick = (sectionId) => {
    navigate(`/user-manual?section=${sectionId}`);
  };

  const getPopularityColor = (popularity) => {
    if (popularity >= 90) return '#10B981';
    if (popularity >= 80) return '#F59E0B';
    if (popularity >= 70) return '#EF4444';
    return '#6B7280';
  };

  return (
    <div className={styles.indexContainer}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroIcon}>
            <BookOpen size={48} />
          </div>
          <h1>CRM Property Fusion</h1>
          <h2>Complete User Manual & Documentation</h2>
          <p>Master every aspect of the system with our comprehensive guides, tutorials, and best practices</p>
          
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{sections.length}</div>
              <div className={styles.statLabel}>Manual Sections</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Pages of Content</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50+</div>
              <div className={styles.statLabel}>Video Tutorials</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Support Available</div>
            </div>
          </div>
          
          <div className={styles.heroActions}>
            <button className={styles.primaryBtn}>
              <Search size={20} />
              Search Manual
            </button>
            <button className={styles.secondaryBtn}>
              <Play size={20} />
              Watch Tutorials
            </button>
            <button className={styles.tertiaryBtn}>
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search the manual..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filtersContainer}>
            <div className={styles.filterGroup}>
              <label>Category:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.filterSelect}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label>Difficulty:</label>
              <select 
                value={selectedDifficulty} 
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className={styles.filterSelect}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>
                    {difficulty.name} ({difficulty.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label>Sort By:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="name">Name</option>
                <option value="popularity">Popularity</option>
                <option value="time">Reading Time</option>
                <option value="updated">Last Updated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActionsSection}>
        <h3>Quick Actions</h3>
        <div className={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <div key={index} className={styles.quickActionCard} style={{ '--accent-color': action.color }}>
              <div className={styles.actionIcon}>
                {action.icon}
              </div>
              <h4>{action.title}</h4>
              <p>{action.description}</p>
              <div className={styles.actionCount}>{action.count}</div>
              <a href={action.link} className={styles.actionLink}>
                Learn More <ExternalLink size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Sections */}
      <div className={styles.sectionsSection}>
        <div className={styles.sectionHeader}>
          <h3>Complete Manual Sections</h3>
          <p>Navigate through all topics to master the CRM system</p>
          <div className={styles.resultsInfo}>
            Showing {filteredSections.length} of {sections.length} sections
          </div>
        </div>

        <div className={styles.sectionsGrid}>
          {filteredSections.map((section) => (
            <div key={section.id} className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <div className={styles.sectionIcon} style={{ '--accent-color': section.color }}>
                  {section.icon}
                </div>
                <div className={styles.sectionMeta}>
                  <span 
                    className={styles.difficulty}
                    style={{ backgroundColor: difficultyColors[section.difficulty] }}
                  >
                    {section.difficulty}
                  </span>
                  <span 
                    className={styles.category}
                    style={{ backgroundColor: categoryColors[section.category] }}
                  >
                    {section.category}
                  </span>
                  <div className={styles.readTime}>
                    <Clock size={14} />
                    {section.timeToRead}
                  </div>
                </div>
                <div className={styles.popularityBadge}>
                  <TrendingUp size={14} />
                  {section.popularity}%
                </div>
              </div>

              <div className={styles.cardContent}>
                <h4>{section.title}</h4>
                <p>{section.description}</p>
                
                <div className={styles.featuresList}>
                  {section.features.map((feature, index) => (
                    <span key={index} className={styles.feature}>
                      {feature}
                    </span>
                  ))}
                </div>

                <div className={styles.tagsList}>
                  {section.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.cardActions}>
                <button 
                  className={styles.readBtn}
                  onClick={() => handleSectionClick(section.id)}
                  style={{ '--accent-color': section.color }}
                >
                  Read Section
                  <ChevronRight size={16} />
                </button>
                <button className={styles.bookmarkBtn}>
                  <Bookmark size={16} />
                </button>
                <button className={styles.shareBtn}>
                  <ExternalLink size={16} />
                </button>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.lastUpdated}>
                  Updated: {new Date(section.lastUpdated).toLocaleDateString()}
                </span>
                <div className={styles.cardStats}>
                  <span className={styles.stat}>
                    <Star size={12} />
                    {section.popularity}% helpful
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSections.length === 0 && (
          <div className={styles.noResults}>
            <Search size={48} />
            <h4>No sections found</h4>
            <p>Try adjusting your search criteria or filters</p>
            <button 
              className={styles.clearFiltersBtn}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Learning Paths */}
      <div className={styles.learningPathsSection}>
        <h3>Recommended Learning Paths</h3>
        
        <div className={styles.pathsGrid}>
          <div className={styles.learningPath}>
            <div className={styles.pathHeader}>
              <Star size={24} />
              <h4>New User Path</h4>
              <span className={styles.pathBadge}>Most Popular</span>
            </div>
            <p>Perfect for first-time users</p>
            <div className={styles.pathSteps}>
              <div className={styles.pathStep}>1. Project Overview</div>
              <div className={styles.pathStep}>2. Getting Started</div>
              <div className={styles.pathStep}>3. Authentication & Users</div>
              <div className={styles.pathStep}>4. Dashboard Basics</div>
            </div>
            <div className={styles.pathTime}>Estimated: 35 minutes</div>
            <button className={styles.startPathBtn}>Start Learning Path</button>
          </div>

          <div className={styles.learningPath}>
            <div className={styles.pathHeader}>
              <Target size={24} />
              <h4>Property Manager Path</h4>
              <span className={styles.pathBadge}>Professional</span>
            </div>
            <p>For property management professionals</p>
            <div className={styles.pathSteps}>
              <div className={styles.pathStep}>1. Property Management</div>
              <div className={styles.pathStep}>2. Media & Photos</div>
              <div className={styles.pathStep}>3. Sharing & Marketing</div>
              <div className={styles.pathStep}>4. Viewing Management</div>
            </div>
            <div className={styles.pathTime}>Estimated: 50 minutes</div>
            <button className={styles.startPathBtn}>Start Learning Path</button>
          </div>

          <div className={styles.learningPath}>
            <div className={styles.pathHeader}>
              <Users size={24} />
              <h4>Lead Manager Path</h4>
              <span className={styles.pathBadge}>Sales Focus</span>
            </div>
            <p>For sales and lead management</p>
            <div className={styles.pathSteps}>
              <div className={styles.pathStep}>1. Lead Management</div>
              <div className={styles.pathStep}>2. Customer Management</div>
              <div className={styles.pathStep}>3. Follow-up Processes</div>
              <div className={styles.pathStep}>4. Conversion Tracking</div>
            </div>
            <div className={styles.pathTime}>Estimated: 45 minutes</div>
            <button className={styles.startPathBtn}>Start Learning Path</button>
          </div>

          <div className={styles.learningPath}>
            <div className={styles.pathHeader}>
              <Settings size={24} />
              <h4>Administrator Path</h4>
              <span className={styles.pathBadge}>Advanced</span>
            </div>
            <p>For system administrators</p>
            <div className={styles.pathSteps}>
              <div className={styles.pathStep}>1. Admin & Settings</div>
              <div className={styles.pathStep}>2. User Management</div>
              <div className={styles.pathStep}>3. System Configuration</div>
              <div className={styles.pathStep}>4. Reports & Analytics</div>
            </div>
            <div className={styles.pathTime}>Estimated: 60 minutes</div>
            <button className={styles.startPathBtn}>Start Learning Path</button>
          </div>
        </div>
      </div>

      {/* Features Highlight */}
      <div className={styles.featuresSection}>
        <h3>Why Choose Our User Manual?</h3>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Lightbulb size={24} />
            </div>
            <h4>Comprehensive Coverage</h4>
            <p>Every feature and workflow explained in detail</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Rocket size={24} />
            </div>
            <h4>Quick Learning</h4>
            <p>Structured paths for different skill levels</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Shield size={24} />
            </div>
            <h4>Always Up-to-Date</h4>
            <p>Regular updates with latest features</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Globe size={24} />
            </div>
            <h4>Multi-Format</h4>
            <p>Web, PDF, and video content available</p>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className={styles.supportSection}>
        <div className={styles.supportContent}>
          <div className={styles.supportInfo}>
            <h3>Need Help?</h3>
            <p>Our support team is here to help you succeed with CRM Property Fusion</p>
            
            <div className={styles.supportFeatures}>
              <div className={styles.supportFeature}>
                <HelpCircle size={20} />
                <span>24/7 Documentation Access</span>
              </div>
              <div className={styles.supportFeature}>
                <Play size={20} />
                <span>Video Tutorials</span>
              </div>
              <div className={styles.supportFeature}>
                <Users size={20} />
                <span>Live Training Sessions</span>
              </div>
              <div className={styles.supportFeature}>
                <MessageCircle size={20} />
                <span>Direct Support Contact</span>
              </div>
            </div>

            <div className={styles.supportActions}>
              <button className={styles.supportBtn}>
                <HelpCircle size={16} />
                Contact Support
              </button>
              <button className={styles.trainingBtn}>
                <Calendar size={16} />
                Schedule Training
              </button>
            </div>
          </div>

          <div className={styles.supportStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Pages of Documentation</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50+</div>
              <div className={styles.statLabel}>Video Tutorials</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Support Availability</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>99%</div>
              <div className={styles.statLabel}>User Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Documentation</h4>
            <ul>
              <li><a href="#api-docs">API Documentation</a></li>
              <li><a href="#developer-guide">Developer Guide</a></li>
              <li><a href="#changelog">Changelog</a></li>
              <li><a href="#roadmap">Product Roadmap</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h4>Training</h4>
            <ul>
              <li><a href="#certification">User Certification</a></li>
              <li><a href="#webinars">Live Webinars</a></li>
              <li><a href="#workshops">Training Workshops</a></li>
              <li><a href="#resources">Learning Resources</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>Support</h4>
            <ul>
              <li><a href="#help-center">Help Center</a></li>
              <li><a href="#community">User Community</a></li>
              <li><a href="#tickets">Support Tickets</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4>System Info</h4>
            <p><strong>Version:</strong> 2.0</p>
            <p><strong>Last Updated:</strong> January 2024</p>
            <p><strong>Support Hours:</strong> Sun-Thu 9AM-6PM GST</p>
            <p><strong>Response Time:</strong> Within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManualIndex;
