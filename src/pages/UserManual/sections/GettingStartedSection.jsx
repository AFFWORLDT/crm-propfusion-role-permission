import { useState } from 'react';
import { Play, Download, BookOpen, Users, Settings, CheckCircle, ArrowRight, Clock, Star, HelpCircle, Video, FileText, Smartphone, Monitor, Globe, BarChart3, MessageCircle } from 'lucide-react';
import styles from './GettingStartedSection.module.css';

const GettingStartedSection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen size={20} /> },
    { id: 'setup', label: 'Setup Guide', icon: <Settings size={20} /> },
    { id: 'navigation', label: 'Navigation', icon: <ArrowRight size={20} /> },
    { id: 'first-steps', label: 'First Steps', icon: <Play size={20} /> },
    { id: 'quick-tour', label: 'Quick Tour', icon: <Video size={20} /> },
    { id: 'best-practices', label: 'Best Practices', icon: <Star size={20} /> },
    { id: 'support', label: 'Support', icon: <HelpCircle size={20} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'setup':
        return <SetupTab />;
      case 'navigation':
        return <NavigationTab />;
      case 'first-steps':
        return <FirstStepsTab />;
      case 'quick-tour':
        return <QuickTourTab />;
      case 'best-practices':
        return <BestPracticesTab />;
      case 'support':
        return <SupportTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={styles.gettingStartedSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <Play size={32} />
        </div>
        <div className={styles.headerContent}>
          <h2>Getting Started</h2>
          <p>Welcome to CRM Property Fusion! This guide will help you get up and running quickly with your new CRM system.</p>
        </div>
      </div>

      <div className={styles.tabNavigation}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        <div className={styles.tabPanel}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

const OverviewTab = () => (
  <div className={styles.overviewTab}>
    <div className={styles.overviewGrid}>
      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Play size={32} />
        </div>
        <h3>Quick Start</h3>
        <p>Get your first property listed and lead captured in under 10 minutes</p>
        <div className={styles.cardFeatures}>
          <span>Setup Wizard</span>
          <span>Video Tutorials</span>
          <span>Sample Data</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Users size={32} />
        </div>
        <h3>User Onboarding</h3>
        <p>Complete user setup with role-based access and permissions</p>
        <div className={styles.cardFeatures}>
          <span>Role Assignment</span>
          <span>Permission Setup</span>
          <span>Team Structure</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Settings size={32} />
        </div>
        <h3>System Configuration</h3>
        <p>Configure your CRM with company settings and integrations</p>
        <div className={styles.cardFeatures}>
          <span>Company Profile</span>
          <span>Portal Setup</span>
          <span>API Keys</span>
        </div>
      </div>
    </div>

    <div className={styles.quickStart}>
      <h3>Ready to Begin?</h3>
      <div className={styles.quickStartSteps}>
        <div className={styles.quickStep}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h4>Complete Setup Wizard</h4>
            <p>Follow the guided setup to configure your company profile</p>
          </div>
        </div>
        <div className={styles.quickStep}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h4>Add Your First Property</h4>
            <p>Create a sample listing to understand the workflow</p>
          </div>
        </div>
        <div className={styles.quickStep}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h4>Invite Team Members</h4>
            <p>Set up user accounts with appropriate roles</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SetupTab = () => (
  <div className={styles.setupTab}>
    <div className={styles.setupGuide}>
      <h3>Complete Setup Guide</h3>
      
      <div className={styles.setupPhase}>
        <h4>Phase 1: Company Setup</h4>
        <div className={styles.setupSteps}>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Enter company name and contact information</span>
          </div>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Upload company logo and branding</span>
          </div>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Configure business hours and timezone</span>
          </div>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Set up company address and locations</span>
          </div>
        </div>
      </div>

      <div className={styles.setupPhase}>
        <h4>Phase 2: User Management</h4>
        <div className={styles.setupSteps}>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Create admin user account</span>
          </div>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Define user roles and permissions</span>
          </div>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Invite team members</span>
          </div>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Set up team structure</span>
          </div>
        </div>
      </div>

      <div className={styles.setupPhase}>
        <h4>Phase 3: System Configuration</h4>
        <div className={styles.setupSteps}>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Configure property types and categories</span>
          </div>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Set up lead sources and statuses</span>
          </div>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Configure email templates</span>
          </div>
          <div className={styles.setupStep}>
            <CheckCircle size={20} />
            <span>Set up payment gateways</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.setupChecklist}>
      <h4>Setup Checklist</h4>
      <div className={styles.checklistItems}>
        <label className={styles.checklistItem}>
          <input type="checkbox" />
          <span>Company profile completed</span>
        </label>
        <label className={styles.checklistItem}>
          <input type="checkbox" />
          <span>Admin user created</span>
        </label>
        <label className={styles.checklistItem}>
          <input type="checkbox" />
          <span>Team members invited</span>
        </label>
        <label className={styles.checklistItem}>
          <input type="checkbox" />
          <span>First property added</span>
        </label>
        <label className={styles.checklistItem}>
          <input type="checkbox" />
          <span>Email templates configured</span>
        </label>
        <label className={styles.checklistItem}>
          <input type="checkbox" />
          <span>Portal integrations set up</span>
        </label>
      </div>
    </div>
  </div>
);

const NavigationTab = () => (
  <div className={styles.navigationTab}>
    <div className={styles.navigationOverview}>
      <h3>Main Navigation Structure</h3>
      <p>Learn how to navigate through the CRM system efficiently</p>
    </div>

    <div className={styles.navigationGrid}>
      <div className={styles.navSection}>
        <h4>Top Navigation Bar</h4>
        <div className={styles.navItems}>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>🏠</span>
            <span>Dashboard - Main overview and metrics</span>
          </div>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>🏢</span>
            <span>Properties - Property management</span>
          </div>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>🎯</span>
            <span>Leads - Lead management</span>
          </div>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>👥</span>
            <span>Customers - Customer database</span>
          </div>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>📅</span>
            <span>Calendar - Scheduling and appointments</span>
          </div>
        </div>
      </div>

      <div className={styles.navSection}>
        <h4>Sidebar Navigation</h4>
        <div className={styles.navItems}>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>⚙️</span>
            <span>Settings - System configuration</span>
          </div>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>📊</span>
            <span>Reports - Analytics and insights</span>
          </div>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>🔗</span>
            <span>Integrations - External connections</span>
          </div>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>👤</span>
            <span>Profile - User settings</span>
          </div>
          <div className={styles.navItem}>
            <span className={styles.navIcon}>❓</span>
            <span>Help - Documentation and support</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.navigationTips}>
      <h4>Navigation Tips</h4>
      <div className={styles.tipsList}>
        <div className={styles.tip}>
          <Star size={16} />
          <span>Use the search bar to quickly find any section</span>
        </div>
        <div className={styles.tip}>
          <Star size={16} />
          <span>Bookmark frequently used sections</span>
        </div>
        <div className={styles.tip}>
          <Star size={16} />
          <span>Use keyboard shortcuts for faster navigation</span>
        </div>
        <div className={styles.tip}>
          <Star size={16} />
          <span>Customize your dashboard layout</span>
        </div>
      </div>
    </div>
  </div>
);

const FirstStepsTab = () => (
  <div className={styles.firstStepsTab}>
    <div className={styles.firstStepsHeader}>
      <h3>Your First Steps in CRM Property Fusion</h3>
      <p>Follow these steps to get started with your first property and lead</p>
    </div>

    <div className={styles.stepsContainer}>
      <div className={styles.step}>
        <div className={styles.stepHeader}>
          <div className={styles.stepNumber}>1</div>
          <h4>Add Your First Property</h4>
        </div>
        <div className={styles.stepContent}>
          <p>Start by adding a property to your portfolio:</p>
          <ul>
            <li>Click on &quot;Properties&quot; in the main navigation</li>
            <li>Click &quot;Add New Property&quot; button</li>
            <li>Fill in basic property details (title, type, location)</li>
            <li>Upload at least 3-5 high-quality photos</li>
            <li>Set pricing and availability</li>
            <li>Click &quot;Save Property&quot;</li>
          </ul>
          <div className={styles.stepTime}>
            <Clock size={16} />
            <span>Estimated time: 5-10 minutes</span>
          </div>
        </div>
      </div>

      <div className={styles.step}>
        <div className={styles.stepHeader}>
          <div className={styles.stepNumber}>2</div>
          <h4>Create Your First Lead</h4>
        </div>
        <div className={styles.stepContent}>
          <p>Capture your first potential customer:</p>
          <ul>
            <li>Go to &quot;Leads&quot; section</li>
            <li>Click &quot;Add New Lead&quot;</li>
            <li>Enter contact information (name, phone, email)</li>
            <li>Select lead source (website, referral, etc.)</li>
            <li>Add any notes or requirements</li>
            <li>Assign to yourself or team member</li>
          </ul>
          <div className={styles.stepTime}>
            <Clock size={16} />
            <span>Estimated time: 3-5 minutes</span>
          </div>
        </div>
      </div>

      <div className={styles.step}>
        <div className={styles.stepHeader}>
          <div className={styles.stepNumber}>3</div>
          <h4>Schedule Your First Viewing</h4>
        </div>
        <div className={styles.stepContent}>
          <p>Set up a property viewing appointment:</p>
          <ul>
            <li>Navigate to &quot;Calendar&quot; section</li>
            <li>Click &quot;Add Appointment&quot;</li>
            <li>Select the property and lead</li>
            <li>Choose date and time</li>
            <li>Add location and notes</li>
            <li>Send confirmation to the lead</li>
          </ul>
          <div className={styles.stepTime}>
            <Clock size={16} />
            <span>Estimated time: 3-5 minutes</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.completionReward}>
      <h4>🎉 Congratulations!</h4>
      <p>You&apos;ve completed your first workflow! You now have a property, lead, and scheduled viewing in your CRM.</p>
      <div className={styles.nextSteps}>
        <h5>Next Steps:</h5>
        <ul>
          <li>Explore the dashboard to see your metrics</li>
          <li>Add more properties to build your portfolio</li>
          <li>Invite team members to collaborate</li>
          <li>Set up email templates for automation</li>
        </ul>
      </div>
    </div>
  </div>
);

const QuickTourTab = () => (
  <div className={styles.quickTourTab}>
    <div className={styles.tourHeader}>
      <h3>Quick Tour of CRM Property Fusion</h3>
      <p>Take a guided tour through the main features and sections</p>
    </div>

    <div className={styles.tourSections}>
      <div className={styles.tourSection}>
        <h4>🏠 Dashboard Overview</h4>
        <div className={styles.tourContent}>
          <p>The dashboard is your command center, showing:</p>
          <ul>
            <li>Total properties and their status</li>
            <li>Active leads and conversion rates</li>
            <li>Recent activities and notifications</li>
            <li>Performance metrics and charts</li>
            <li>Quick action buttons</li>
          </ul>
          <div className={styles.tourTip}>
            <Star size={16} />
            <span>Tip: Customize your dashboard widgets for better visibility</span>
          </div>
        </div>
      </div>

      <div className={styles.tourSection}>
        <h4>🏢 Property Management</h4>
        <div className={styles.tourContent}>
          <p>Manage your entire property portfolio:</p>
          <ul>
            <li>Add new properties with detailed information</li>
            <li>Upload multiple photos and virtual tours</li>
            <li>Set pricing and availability</li>
            <li>Track property status and updates</li>
            <li>Generate property reports and analytics</li>
          </ul>
          <div className={styles.tourTip}>
            <Star size={16} />
            <span>Tip: Use bulk actions to manage multiple properties efficiently</span>
          </div>
        </div>
      </div>

      <div className={styles.tourSection}>
        <h4>🎯 Lead Management</h4>
        <div className={styles.tourContent}>
          <p>Capture and nurture potential customers:</p>
          <ul>
            <li>Import leads from various sources</li>
            <li>Qualify leads with scoring system</li>
            <li>Track follow-up activities</li>
            <li>Convert leads to customers</li>
            <li>Generate lead reports and analytics</li>
          </ul>
          <div className={styles.tourTip}>
            <Star size={16} />
            <span>Tip: Set up automated follow-up reminders for better conversion</span>
          </div>
        </div>
      </div>

      <div className={styles.tourSection}>
        <h4>📅 Calendar & Scheduling</h4>
        <div className={styles.tourContent}>
          <p>Manage appointments and viewings:</p>
          <ul>
            <li>Schedule property viewings</li>
            <li>Set up team meetings</li>
            <li>Track appointment status</li>
            <li>Send automated reminders</li>
            <li>Integrate with external calendars</li>
          </ul>
          <div className={styles.tourTip}>
            <Star size={16} />
            <span>Tip: Use the calendar view to see your daily schedule at a glance</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.tourActions}>
      <h4>Ready to Explore?</h4>
      <div className={styles.tourButtons}>
        <button className={styles.tourBtn}>
          <Video size={16} />
          Watch Video Tutorials
        </button>
        <button className={styles.tourBtn}>
          <BookOpen size={16} />
          Read Detailed Guides
        </button>
        <button className={styles.tourBtn}>
          <HelpCircle size={16} />
          Get Live Support
        </button>
      </div>
    </div>
  </div>
);

const BestPracticesTab = () => (
  <div className={styles.bestPracticesTab}>
    <div className={styles.practicesHeader}>
      <h3>Best Practices for Success</h3>
      <p>Follow these proven strategies to maximize your CRM efficiency</p>
    </div>

    <div className={styles.practicesGrid}>
      <div className={styles.practiceCard}>
        <div className={styles.practiceIcon}>
          <Star size={24} />
        </div>
        <h4>Data Quality</h4>
        <ul>
          <li>Always upload high-quality property photos</li>
          <li>Keep property information up-to-date</li>
          <li>Use consistent naming conventions</li>
          <li>Regularly clean duplicate data</li>
        </ul>
      </div>

      <div className={styles.practiceCard}>
        <div className={styles.practiceIcon}>
          <Clock size={24} />
        </div>
        <h4>Time Management</h4>
        <ul>
          <li>Set up automated follow-up reminders</li>
          <li>Use calendar for scheduling viewings</li>
          <li>Batch similar tasks together</li>
          <li>Set daily priorities and goals</li>
        </ul>
      </div>

      <div className={styles.practiceCard}>
        <div className={styles.practiceIcon}>
          <Users size={24} />
        </div>
        <h4>Team Collaboration</h4>
        <ul>
          <li>Assign clear responsibilities</li>
          <li>Use activity notes for communication</li>
          <li>Regular team meetings and updates</li>
          <li>Share best practices and insights</li>
        </ul>
      </div>

      <div className={styles.practiceCard}>
        <div className={styles.practiceIcon}>
          <BarChart3 size={24} />
        </div>
        <h4>Performance Tracking</h4>
        <ul>
          <li>Monitor key metrics regularly</li>
          <li>Set performance goals</li>
          <li>Analyze conversion rates</li>
          <li>Identify improvement areas</li>
        </ul>
      </div>
    </div>

    <div className={styles.practiceTips}>
      <h4>Pro Tips for Power Users</h4>
      <div className={styles.tipsGrid}>
        <div className={styles.tip}>
          <h5>Keyboard Shortcuts</h5>
          <p>Learn keyboard shortcuts to navigate faster</p>
        </div>
        <div className={styles.tip}>
          <h5>Bulk Operations</h5>
          <p>Use bulk actions for managing multiple items</p>
        </div>
        <div className={styles.tip}>
          <h5>Automation</h5>
          <p>Set up automated workflows for repetitive tasks</p>
        </div>
        <div className={styles.tip}>
          <h5>Integration</h5>
          <p>Connect with external tools for seamless workflow</p>
        </div>
      </div>
    </div>
  </div>
);

const SupportTab = () => (
  <div className={styles.supportTab}>
    <div className={styles.supportHeader}>
      <h3>Getting Help & Support</h3>
      <p>Multiple ways to get assistance when you need it</p>
    </div>

    <div className={styles.supportOptions}>
      <div className={styles.supportCard}>
        <div className={styles.supportIcon}>
          <BookOpen size={32} />
        </div>
        <h4>Documentation</h4>
        <p>Comprehensive guides and tutorials</p>
        <ul>
          <li>User Manual (this section)</li>
          <li>Video Tutorials</li>
          <li>FAQ Section</li>
          <li>Best Practices Guide</li>
        </ul>
        <button className={styles.supportBtn}>
          <BookOpen size={16} />
          Browse Documentation
        </button>
      </div>

      <div className={styles.supportCard}>
        <div className={styles.supportIcon}>
          <Video size={32} />
        </div>
        <h4>Video Tutorials</h4>
        <p>Step-by-step video guides</p>
        <ul>
          <li>Getting Started Videos</li>
          <li>Feature Walkthroughs</li>
          <li>Advanced Techniques</li>
          <li>Tips & Tricks</li>
        </ul>
        <button className={styles.supportBtn}>
          <Video size={16} />
          Watch Videos
        </button>
      </div>

      <div className={styles.supportCard}>
        <div className={styles.supportIcon}>
          <MessageCircle size={32} />
        </div>
        <h4>Live Support</h4>
        <p>Get help from our support team</p>
        <ul>
          <li>Live Chat Support</li>
          <li>Email Support</li>
          <li>Phone Support</li>
          <li>Priority Support (Premium)</li>
        </ul>
        <button className={styles.supportBtn}>
          <MessageCircle size={16} />
          Contact Support
        </button>
      </div>
    </div>

    <div className={styles.supportResources}>
      <h4>Additional Resources</h4>
      <div className={styles.resourcesGrid}>
        <div className={styles.resource}>
          <Download size={20} />
          <span>Download User Manual PDF</span>
        </div>
        <div className={styles.resource}>
          <Globe size={20} />
          <span>Online Knowledge Base</span>
        </div>
        <div className={styles.resource}>
          <Users size={20} />
          <span>Community Forum</span>
        </div>
        <div className={styles.resource}>
          <Smartphone size={20} />
          <span>Mobile App Guide</span>
        </div>
      </div>
    </div>

    <div className={styles.emergencyContact}>
      <h4>🚨 Emergency Support</h4>
      <p>For urgent issues affecting your business operations:</p>
      <div className={styles.emergencyInfo}>
        <div className={styles.emergencyItem}>
          <strong>Phone:</strong> +1-800-CRM-HELP
        </div>
        <div className={styles.emergencyItem}>
          <strong>Email:</strong> support@onexproperties.com
        </div>
        <div className={styles.emergencyItem}>
          <strong>Response Time:</strong> Within 2 hours
        </div>
      </div>
    </div>
  </div>
);

export default GettingStartedSection;
