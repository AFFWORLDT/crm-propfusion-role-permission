import React, { useState } from 'react';
import { 
  Users, Database, MessageSquare, Phone, Mail, Calendar, 
  Star, Heart, History, Settings, Search, Filter, Plus,
  Edit, Trash, Eye, BarChart3, TrendingUp, UserCheck
} from 'lucide-react';
import styles from './CustomerManagementSection.module.css';

const CustomerManagementSection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Users size={16} /> },
    { id: 'database', label: 'Customer Database', icon: <Database size={16} /> },
    { id: 'communication', label: 'Communication', icon: <MessageSquare size={16} /> },
    { id: 'preferences', label: 'Preferences', icon: <Heart size={16} /> },
    { id: 'history', label: 'Interaction History', icon: <History size={16} /> },
    { id: 'segmentation', label: 'Segmentation', icon: <Filter size={16} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={16} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'database':
        return <DatabaseTab />;
      case 'communication':
        return <CommunicationTab />;
      case 'preferences':
        return <PreferencesTab />;
      case 'history':
        return <HistoryTab />;
      case 'segmentation':
        return <SegmentationTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={styles.customerManagementSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <Users size={32} />
        </div>
        <div className={styles.headerContent}>
          <h3>Customer Management</h3>
          <p>Build and maintain strong customer relationships with comprehensive CRM tools</p>
        </div>
      </div>

      <div className={styles.tabNavigation}>
        {tabs.map((tab) => (
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
        {renderTabContent()}
      </div>
    </div>
  );
};

const OverviewTab = () => (
  <div className={styles.tabPanel}>
    <div className={styles.overviewGrid}>
      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Users size={24} />
        </div>
        <h4>Customer Management Overview</h4>
        <p>Customer management is the foundation of successful real estate business. Our CRM provides comprehensive tools to manage customer relationships, track interactions, and deliver personalized experiences.</p>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Database size={24} />
        </div>
        <h4>Centralized Database</h4>
        <ul>
          <li>Complete customer profiles</li>
          <li>Contact information management</li>
          <li>Property preferences tracking</li>
          <li>Interaction history</li>
          <li>Document storage</li>
        </ul>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <MessageSquare size={24} />
        </div>
        <h4>Communication Tools</h4>
        <ul>
          <li>Multi-channel messaging</li>
          <li>Email templates</li>
          <li>SMS integration</li>
          <li>WhatsApp Business</li>
          <li>Call tracking</li>
        </ul>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <TrendingUp size={24} />
        </div>
        <h4>Relationship Building</h4>
        <ul>
          <li>Customer segmentation</li>
          <li>Personalized marketing</li>
          <li>Loyalty programs</li>
          <li>Referral tracking</li>
          <li>Customer satisfaction</li>
        </ul>
      </div>
    </div>

    <div className={styles.benefitsSection}>
      <h4>Key Benefits</h4>
      <div className={styles.benefitsGrid}>
        <div className={styles.benefitItem}>
          <Star size={20} />
          <span>Improved customer retention</span>
        </div>
        <div className={styles.benefitItem}>
          <TrendingUp size={20} />
          <span>Increased sales opportunities</span>
        </div>
        <div className={styles.benefitItem}>
          <Heart size={20} />
          <span>Better customer satisfaction</span>
        </div>
        <div className={styles.benefitItem}>
          <UserCheck size={20} />
          <span>Enhanced customer loyalty</span>
        </div>
      </div>
    </div>
  </div>
);

const DatabaseTab = () => (
  <div className={styles.tabPanel}>
    <h4>Customer Database Management</h4>
    
    <div className={styles.databaseOverview}>
      <p>Maintain a comprehensive customer database with detailed profiles, contact information, and property preferences.</p>
    </div>

    <div className={styles.customerProfile}>
      <h5>Customer Profile Structure</h5>
      <div className={styles.profileGrid}>
        <div className={styles.profileSection}>
          <h6>Basic Information</h6>
          <div className={styles.fieldList}>
            <span>Full Name</span>
            <span>Email Address</span>
            <span>Phone Number</span>
            <span>Date of Birth</span>
            <span>Nationality</span>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h6>Property Preferences</h6>
          <div className={styles.fieldList}>
            <span>Property Type</span>
            <span>Location Areas</span>
            <span>Budget Range</span>
            <span>Bedrooms</span>
            <span>Amenities</span>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h6>Financial Information</h6>
          <div className={styles.fieldList}>
            <span>Income Level</span>
            <span>Employment Status</span>
            <span>Credit Score</span>
            <span>Down Payment</span>
            <span>Mortgage Pref.</span>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h6>Communication Preferences</h6>
          <div className={styles.fieldList}>
            <span>Preferred Channel</span>
            <span>Best Time to Contact</span>
            <span>Language</span>
            <span>Frequency</span>
            <span>Opt-out Status</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.dataImport}>
      <h5>Data Import & Export</h5>
      <div className={styles.importMethods}>
        <div className={styles.importCard}>
          <h6>CSV Import</h6>
          <p>Bulk import customer data from CSV files</p>
          <div className={styles.importFeatures}>
            <span>Field mapping</span>
            <span>Data validation</span>
            <span>Duplicate detection</span>
          </div>
        </div>

        <div className={styles.importCard}>
          <h6>API Integration</h6>
          <p>Connect with external systems and databases</p>
          <div className={styles.importFeatures}>
            <span>Real-time sync</span>
            <span>Automated updates</span>
            <span>Error handling</span>
          </div>
        </div>

        <div className={styles.importCard}>
          <h6>Manual Entry</h6>
          <p>Add customers one by one through forms</p>
          <div className={styles.importFeatures}>
            <span>Guided forms</span>
            <span>Validation rules</span>
            <span>Auto-save</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.dataQuality}>
      <h5>Data Quality Management</h5>
      <div className={styles.qualityTools}>
        <div className={styles.qualityItem}>
          <h6>Duplicate Detection</h6>
          <p>Automatically identify and merge duplicate customer records</p>
        </div>
        <div className={styles.qualityItem}>
          <h6>Data Validation</h6>
          <p>Ensure data accuracy with validation rules and checks</p>
        </div>
        <div className={styles.qualityItem}>
          <h6>Regular Cleanup</h6>
          <p>Schedule automated data cleanup and maintenance</p>
        </div>
      </div>
    </div>
  </div>
);

const CommunicationTab = () => (
  <div className={styles.tabPanel}>
    <h4>Customer Communication Tools</h4>
    
    <div className={styles.communicationOverview}>
      <p>Stay connected with customers through multiple communication channels and automated workflows.</p>
    </div>

    <div className={styles.communicationChannels}>
      <h5>Communication Channels</h5>
      <div className={styles.channelsGrid}>
        <div className={styles.channelCard}>
          <div className={styles.channelHeader}>
            <Mail size={24} />
            <h6>Email Marketing</h6>
          </div>
          <p>Send personalized emails and newsletters</p>
          <div className={styles.channelFeatures}>
            <span>Template library</span>
            <span>Personalization</span>
            <span>Automated campaigns</span>
            <span>Open tracking</span>
          </div>
        </div>

        <div className={styles.channelCard}>
          <div className={styles.channelHeader}>
            <MessageSquare size={24} />
            <h6>WhatsApp Business</h6>
          </div>
          <p>Direct messaging through WhatsApp</p>
          <div className={styles.channelFeatures}>
            <span>Quick responses</span>
            <span>Media sharing</span>
            <span>Group chats</span>
            <span>Message history</span>
          </div>
        </div>

        <div className={styles.channelCard}>
          <div className={styles.channelHeader}>
            <Phone size={24} />
            <h6>Phone & SMS</h6>
          </div>
          <p>Voice calls and text messaging</p>
          <div className={styles.channelFeatures}>
            <span>Call recording</span>
            <span>Call notes</span>
            <span>SMS templates</span>
            <span>Call scheduling</span>
          </div>
        </div>

        <div className={styles.channelCard}>
          <div className={styles.channelHeader}>
            <Calendar size={24} />
            <h6>Appointment Scheduling</h6>
          </div>
          <p>Book meetings and property viewings</p>
          <div className={styles.channelFeatures}>
            <span>Online booking</span>
            <span>Calendar sync</span>
            <span>Reminders</span>
            <span>Rescheduling</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.communicationTemplates}>
      <h5>Communication Templates</h5>
      <div className={styles.templateCategories}>
        <div className={styles.templateCategory}>
          <h6>Welcome Messages</h6>
          <div className={styles.templateList}>
            <span>New customer welcome</span>
            <span>Property inquiry response</span>
            <span>Thank you messages</span>
          </div>
        </div>

        <div className={styles.templateCategory}>
          <h6>Property Updates</h6>
          <div className={styles.templateList}>
            <span>New listings</span>
            <span>Price changes</span>
            <span>Open house invitations</span>
          </div>
        </div>

        <div className={styles.templateCategory}>
          <h6>Follow-up Messages</h6>
          <div className={styles.templateList}>
            <span>Viewing reminders</span>
            <span>Offer follow-up</span>
            <span>Check-in messages</span>
          </div>
        </div>

        <div className={styles.templateCategory}>
          <h6>Special Offers</h6>
          <div className={styles.templateList}>
            <span>Discount notifications</span>
            <span>Exclusive deals</span>
            <span>Seasonal promotions</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.automationWorkflows}>
      <h5>Automated Communication Workflows</h5>
      <div className={styles.workflowExamples}>
        <div className={styles.workflowExample}>
          <h6>New Customer Onboarding</h6>
          <div className={styles.workflowSteps}>
            <span>Day 1: Welcome email</span>
            <span>Day 2: Property suggestions</span>
            <span>Day 5: Follow-up call</span>
            <span>Day 10: Newsletter signup</span>
          </div>
        </div>

        <div className={styles.workflowExample}>
          <h6>Property Viewing Follow-up</h6>
          <div className={styles.workflowSteps}>
            <span>Immediate: Thank you message</span>
            <span>Day 1: Feedback request</span>
            <span>Day 3: Additional properties</span>
            <span>Day 7: Final follow-up</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PreferencesTab = () => (
  <div className={styles.tabPanel}>
    <h4>Customer Preferences Management</h4>
    
    <div className={styles.preferencesOverview}>
      <p>Track and manage customer preferences to deliver personalized experiences and improve customer satisfaction.</p>
    </div>

    <div className={styles.preferenceCategories}>
      <h5>Preference Categories</h5>
      <div className={styles.categoriesGrid}>
        <div className={styles.preferenceCategory}>
          <h6>Property Preferences</h6>
          <div className={styles.preferenceFields}>
            <div className={styles.preferenceField}>
              <label>Property Type</label>
              <div className={styles.preferenceValues}>
                <span>Apartment</span>
                <span>Villa</span>
                <span>Townhouse</span>
                <span>Penthouse</span>
              </div>
            </div>
            <div className={styles.preferenceField}>
              <label>Location Areas</label>
              <div className={styles.preferenceValues}>
                <span>Dubai Marina</span>
                <span>Palm Jumeirah</span>
                <span>Downtown Dubai</span>
                <span>Business Bay</span>
              </div>
            </div>
            <div className={styles.preferenceField}>
              <label>Budget Range</label>
              <div className={styles.preferenceValues}>
                <span>AED 500K - 1M</span>
                <span>AED 1M - 2M</span>
                <span>AED 2M - 5M</span>
                <span>AED 5M+</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.preferenceCategory}>
          <h6>Communication Preferences</h6>
          <div className={styles.preferenceFields}>
            <div className={styles.preferenceField}>
              <label>Preferred Channel</label>
              <div className={styles.preferenceValues}>
                <span>Email</span>
                <span>WhatsApp</span>
                <span>Phone</span>
                <span>SMS</span>
              </div>
            </div>
            <div className={styles.preferenceField}>
              <label>Contact Frequency</label>
              <div className={styles.preferenceValues}>
                <span>Daily</span>
                <span>Weekly</span>
                <span>Monthly</span>
                <span>On-demand</span>
              </div>
            </div>
            <div className={styles.preferenceField}>
              <label>Best Time</label>
              <div className={styles.preferenceValues}>
                <span>Morning</span>
                <span>Afternoon</span>
                <span>Evening</span>
                <span>Weekends</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.preferenceCategory}>
          <h6>Service Preferences</h6>
          <div className={styles.preferenceFields}>
            <div className={styles.preferenceField}>
              <label>Viewing Preferences</label>
              <div className={styles.preferenceValues}>
                <span>In-person</span>
                <span>Virtual tour</span>
                <span>Video call</span>
                <span>Photos only</span>
              </div>
            </div>
            <div className={styles.preferenceField}>
              <label>Document Preferences</label>
              <div className={styles.preferenceValues}>
                <span>Digital</span>
                <span>Physical</span>
                <span>Both</span>
                <span>Email only</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.preferenceTracking}>
      <h5>Preference Tracking Methods</h5>
      <div className={styles.trackingMethods}>
        <div className={styles.trackingMethod}>
          <h6>Explicit Preferences</h6>
          <p>Directly asked preferences through forms and surveys</p>
        </div>
        <div className={styles.trackingMethod}>
          <h6>Behavioral Analysis</h6>
          <p>Inferred preferences from customer actions and interactions</p>
        </div>
        <div className={styles.trackingMethod}>
          <h6>Feedback Collection</h6>
          <p>Preferences gathered from customer feedback and reviews</p>
        </div>
      </div>
    </div>
  </div>
);

const HistoryTab = () => (
  <div className={styles.tabPanel}>
    <h4>Customer Interaction History</h4>
    
    <div className={styles.historyOverview}>
      <p>Track all customer interactions to understand their journey and provide better service.</p>
    </div>

    <div className={styles.interactionTypes}>
      <h5>Types of Interactions</h5>
      <div className={styles.interactionGrid}>
        <div className={styles.interactionType}>
          <div className={styles.interactionIcon}>
            <Phone size={20} />
          </div>
          <h6>Phone Calls</h6>
          <p>Incoming and outgoing calls with notes and recordings</p>
        </div>

        <div className={styles.interactionType}>
          <div className={styles.interactionIcon}>
            <Mail size={20} />
          </div>
          <h6>Emails</h6>
          <p>Email communications and responses</p>
        </div>

        <div className={styles.interactionType}>
          <div className={styles.interactionIcon}>
            <MessageSquare size={20} />
          </div>
          <h6>WhatsApp Messages</h6>
          <p>WhatsApp conversations and media sharing</p>
        </div>

        <div className={styles.interactionType}>
          <div className={styles.interactionIcon}>
            <Calendar size={20} />
          </div>
          <h6>Meetings & Viewings</h6>
          <p>Scheduled appointments and property viewings</p>
        </div>

        <div className={styles.interactionType}>
          <div className={styles.interactionIcon}>
            <Eye size={20} />
          </div>
          <h6>Property Views</h6>
          <p>Properties viewed and interest levels</p>
        </div>

        <div className={styles.interactionType}>
          <div className={styles.interactionIcon}>
            <Star size={20} />
          </div>
          <h6>Feedback & Reviews</h6>
          <p>Customer feedback, ratings, and reviews</p>
        </div>
      </div>
    </div>

    <div className={styles.historyTimeline}>
      <h5>Interaction Timeline</h5>
      <div className={styles.timelineExample}>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>Jan 15, 2024</div>
          <div className={styles.timelineContent}>
            <h6>Initial Contact</h6>
            <p>Customer inquired about 2-bedroom apartments in Dubai Marina</p>
            <span className={styles.timelineChannel}>Website Form</span>
          </div>
        </div>

        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>Jan 16, 2024</div>
          <div className={styles.timelineContent}>
            <h6>Follow-up Call</h6>
            <p>Discussed requirements and scheduled property viewing</p>
            <span className={styles.timelineChannel}>Phone Call</span>
          </div>
        </div>

        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>Jan 18, 2024</div>
          <div className={styles.timelineContent}>
            <h6>Property Viewing</h6>
            <p>Showed 3 properties matching customer criteria</p>
            <span className={styles.timelineChannel}>In-person</span>
          </div>
        </div>

        <div className={styles.timelineItem}>
          <div className={styles.timelineDate}>Jan 20, 2024</div>
          <div className={styles.timelineContent}>
            <h6>Follow-up Email</h6>
            <p>Sent additional property suggestions and pricing details</p>
            <span className={styles.timelineChannel}>Email</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.historyAnalytics}>
      <h5>Interaction Analytics</h5>
      <div className={styles.analyticsGrid}>
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsValue}>12</div>
          <div className={styles.analyticsLabel}>Total Interactions</div>
          <p>Over the last 30 days</p>
        </div>
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsValue}>85%</div>
          <div className={styles.analyticsLabel}>Response Rate</div>
          <p>Customer engagement level</p>
        </div>
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsValue}>2.3 days</div>
          <div className={styles.analyticsLabel}>Avg Response Time</div>
          <p>Time to customer response</p>
        </div>
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsValue}>4.2</div>
          <div className={styles.analyticsLabel}>Touch Points</div>
          <p>Average interactions per customer</p>
        </div>
      </div>
    </div>
  </div>
);

const SegmentationTab = () => (
  <div className={styles.tabPanel}>
    <h4>Customer Segmentation</h4>
    
    <div className={styles.segmentationOverview}>
      <p>Segment your customer base to deliver targeted marketing and personalized experiences.</p>
    </div>

    <div className={styles.segmentationCriteria}>
      <h5>Segmentation Criteria</h5>
      <div className={styles.criteriaGrid}>
        <div className={styles.criteriaCard}>
          <h6>Demographic Segmentation</h6>
          <div className={styles.criteriaList}>
            <span>Age groups</span>
            <span>Income levels</span>
            <span>Nationality</span>
            <span>Family size</span>
            <span>Occupation</span>
          </div>
        </div>

        <div className={styles.criteriaCard}>
          <h6>Behavioral Segmentation</h6>
          <div className={styles.criteriaList}>
            <span>Property search patterns</span>
            <span>Interaction frequency</span>
            <span>Response rates</span>
            <span>Engagement level</span>
            <span>Purchase history</span>
          </div>
        </div>

        <div className={styles.criteriaCard}>
          <h6>Geographic Segmentation</h6>
          <div className={styles.criteriaList}>
            <span>Current location</span>
            <span>Preferred areas</span>
            <span>Commute preferences</span>
            <span>Market knowledge</span>
            <span>Local preferences</span>
          </div>
        </div>

        <div className={styles.criteriaCard}>
          <h6>Psychographic Segmentation</h6>
          <div className={styles.criteriaList}>
            <span>Lifestyle choices</span>
            <span>Values and beliefs</span>
            <span>Interests and hobbies</span>
            <span>Risk tolerance</span>
            <span>Decision-making style</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.segmentExamples}>
      <h5>Common Customer Segments</h5>
      <div className={styles.segmentsGrid}>
        <div className={styles.segmentCard}>
          <h6>First-time Buyers</h6>
          <p>New to real estate market</p>
          <div className={styles.segmentCharacteristics}>
            <span>Need guidance</span>
            <span>Budget conscious</span>
            <span>Research oriented</span>
          </div>
        </div>

        <div className={styles.segmentCard}>
          <h6>Investors</h6>
          <p>Property investment focused</p>
          <div className={styles.segmentCharacteristics}>
            <span>ROI focused</span>
            <span>Market savvy</span>
            <span>Quick decisions</span>
          </div>
        </div>

        <div className={styles.segmentCard}>
          <h6>Luxury Buyers</h6>
          <p>High-end property seekers</p>
          <div className={styles.segmentCharacteristics}>
            <span>Premium quality</span>
            <span>Exclusive locations</span>
            <span>Personalized service</span>
          </div>
        </div>

        <div className={styles.segmentCard}>
          <h6>Renters</h6>
          <p>Looking for rental properties</p>
          <div className={styles.segmentCharacteristics}>
            <span>Flexibility needed</span>
            <span>Location important</span>
            <span>Budget sensitive</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.segmentationStrategy}>
      <h5>Segmentation Strategy</h5>
      <div className={styles.strategySteps}>
        <div className={styles.strategyStep}>
          <div className={styles.stepNumber}>1</div>
          <div>
            <h6>Data Collection</h6>
            <p>Gather comprehensive customer data through various touchpoints</p>
          </div>
        </div>
        <div className={styles.strategyStep}>
          <div className={styles.stepNumber}>2</div>
          <div>
            <h6>Analysis</h6>
            <p>Analyze data to identify patterns and create meaningful segments</p>
          </div>
        </div>
        <div className={styles.strategyStep}>
          <div className={styles.stepNumber}>3</div>
          <div>
            <h6>Targeting</h6>
            <p>Develop targeted marketing strategies for each segment</p>
          </div>
        </div>
        <div className={styles.strategyStep}>
          <div className={styles.stepNumber}>4</div>
          <div>
            <h6>Optimization</h6>
            <p>Continuously monitor and optimize segmentation strategies</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ReportsTab = () => (
  <div className={styles.tabPanel}>
    <h4>Customer Management Reports</h4>
    
    <div className={styles.reportsOverview}>
      <p>Generate comprehensive reports to analyze customer behavior, track performance, and make data-driven decisions.</p>
    </div>

    <div className={styles.reportTypes}>
      <h5>Available Reports</h5>
      <div className={styles.reportGrid}>
        <div className={styles.reportCard}>
          <h6>Customer Acquisition</h6>
          <p>Track new customer acquisition and sources</p>
          <div className={styles.reportMetrics}>
            <span>New customers per month</span>
            <span>Acquisition cost</span>
            <span>Source effectiveness</span>
          </div>
        </div>

        <div className={styles.reportCard}>
          <h6>Customer Retention</h6>
          <p>Monitor customer retention and loyalty</p>
          <div className={styles.reportMetrics}>
            <span>Retention rate</span>
            <span>Churn analysis</span>
            <span>Loyalty metrics</span>
          </div>
        </div>

        <div className={styles.reportCard}>
          <h6>Customer Engagement</h6>
          <p>Analyze customer engagement patterns</p>
          <div className={styles.reportMetrics}>
            <span>Interaction frequency</span>
            <span>Response rates</span>
            <span>Engagement scores</span>
          </div>
        </div>

        <div className={styles.reportCard}>
          <h6>Customer Satisfaction</h6>
          <p>Measure customer satisfaction and feedback</p>
          <div className={styles.reportMetrics}>
            <span>NPS scores</span>
            <span>Feedback analysis</span>
            <span>Service ratings</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.reportScheduling}>
      <h5>Automated Report Delivery</h5>
      <p>Set up automated report delivery to stakeholders and team members.</p>
      <div className={styles.scheduleOptions}>
        <button className={styles.scheduleBtn}>Daily Reports</button>
        <button className={styles.scheduleBtn}>Weekly Summary</button>
        <button className={styles.scheduleBtn}>Monthly Analysis</button>
        <button className={styles.scheduleBtn}>Custom Schedule</button>
      </div>
    </div>

    <div className={styles.reportCustomization}>
      <h5>Report Customization</h5>
      <div className={styles.customizationOptions}>
        <div className={styles.customizationOption}>
          <h6>Date Ranges</h6>
          <p>Customize report periods and timeframes</p>
        </div>
        <div className={styles.customizationOption}>
          <h6>Filters</h6>
          <p>Apply filters to focus on specific data</p>
        </div>
        <div className={styles.customizationOption}>
          <h6>Visualizations</h6>
          <p>Choose from charts, graphs, and tables</p>
        </div>
        <div className={styles.customizationOption}>
          <h6>Export Formats</h6>
          <p>Export as PDF, Excel, or CSV</p>
        </div>
      </div>
    </div>
  </div>
);

export default CustomerManagementSection;
