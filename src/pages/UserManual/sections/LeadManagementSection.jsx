import React, { useState } from 'react';
import { 
  Target, Users, Phone, Mail, MessageSquare, Calendar, 
  TrendingUp, Filter, Search, Plus, Edit, Trash, Eye,
  CheckCircle, Clock, AlertCircle, Star, BarChart3
} from 'lucide-react';
import styles from './LeadManagementSection.module.css';

const LeadManagementSection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Target size={16} /> },
    { id: 'capture', label: 'Lead Capture', icon: <Plus size={16} /> },
    { id: 'qualification', label: 'Qualification', icon: <Filter size={16} /> },
    { id: 'followup', label: 'Follow-up', icon: <MessageSquare size={16} /> },
    { id: 'conversion', label: 'Conversion', icon: <TrendingUp size={16} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={16} /> },
    { id: 'best-practices', label: 'Best Practices', icon: <Star size={16} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'capture':
        return <CaptureTab />;
      case 'qualification':
        return <QualificationTab />;
      case 'followup':
        return <FollowupTab />;
      case 'conversion':
        return <ConversionTab />;
      case 'reports':
        return <ReportsTab />;
      case 'best-practices':
        return <BestPracticesTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={styles.leadManagementSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <Target size={32} />
        </div>
        <div className={styles.headerContent}>
          <h3>Lead Management</h3>
          <p>Master the complete lead lifecycle from capture to conversion</p>
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
          <Target size={24} />
        </div>
        <h4>Lead Management Overview</h4>
        <p>Lead management is the process of capturing, qualifying, nurturing, and converting potential customers into actual clients. Our CRM provides a comprehensive system to manage this entire lifecycle efficiently.</p>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <TrendingUp size={24} />
        </div>
        <h4>Key Benefits</h4>
        <ul>
          <li>Centralized lead database</li>
          <li>Automated follow-up workflows</li>
          <li>Lead scoring and qualification</li>
          <li>Performance tracking and analytics</li>
          <li>Multi-channel lead capture</li>
        </ul>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Users size={24} />
        </div>
        <h4>Lead Sources</h4>
        <ul>
          <li>Website inquiries</li>
          <li>Property portal leads</li>
          <li>WhatsApp messages</li>
          <li>Phone calls</li>
          <li>Walk-in clients</li>
          <li>Referrals</li>
        </ul>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <BarChart3 size={24} />
        </div>
        <h4>Lead Lifecycle Stages</h4>
        <div className={styles.lifecycleStages}>
          <div className={styles.stage}>
            <span className={styles.stageNumber}>1</span>
            <span>New Lead</span>
          </div>
          <div className={styles.stage}>
            <span className={styles.stageNumber}>2</span>
            <span>Qualified</span>
          </div>
          <div className={styles.stage}>
            <span className={styles.stageNumber}>3</span>
            <span>Nurturing</span>
          </div>
          <div className={styles.stage}>
            <span className={styles.stageNumber}>4</span>
            <span>Converted</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CaptureTab = () => (
  <div className={styles.tabPanel}>
    <h4>Lead Capture Methods</h4>
    
    <div className={styles.captureMethods}>
      <div className={styles.methodCard}>
        <div className={styles.methodHeader}>
          <Phone size={24} />
          <h5>Phone Calls</h5>
        </div>
        <p>Capture leads from incoming and outgoing phone calls</p>
        <div className={styles.methodFeatures}>
          <span>Call recording</span>
          <span>Call notes</span>
          <span>Follow-up scheduling</span>
        </div>
      </div>

      <div className={styles.methodCard}>
        <div className={styles.methodHeader}>
          <Mail size={24} />
          <h5>Email Inquiries</h5>
        </div>
        <p>Automatically capture leads from email submissions</p>
        <div className={styles.methodFeatures}>
          <span>Form submissions</span>
          <span>Email parsing</span>
          <span>Auto-response</span>
        </div>
      </div>

      <div className={styles.methodCard}>
        <div className={styles.methodHeader}>
          <MessageSquare size={24} />
          <h5>WhatsApp Integration</h5>
        </div>
        <p>Capture leads directly from WhatsApp conversations</p>
        <div className={styles.methodFeatures}>
          <span>Message history</span>
          <span>Contact sync</span>
          <span>Quick responses</span>
        </div>
      </div>

      <div className={styles.methodCard}>
        <div className={styles.methodHeader}>
          <Search size={24} />
          <h5>Property Portal Leads</h5>
        </div>
        <p>Import leads from external property portals</p>
        <div className={styles.methodFeatures}>
          <span>Bayut integration</span>
          <span>Property Finder</span>
          <span>Dubizzle</span>
        </div>
      </div>
    </div>

    <div className={styles.setupGuide}>
      <h5>Setting Up Lead Capture</h5>
      <div className={styles.setupSteps}>
        <div className={styles.setupStep}>
          <div className={styles.stepNumber}>1</div>
          <div>
            <h6>Configure Lead Sources</h6>
            <p>Set up integrations with your preferred lead sources</p>
          </div>
        </div>
        <div className={styles.setupStep}>
          <div className={styles.stepNumber}>2</div>
          <div>
            <h6>Create Lead Forms</h6>
            <p>Design custom forms for your website and landing pages</p>
          </div>
        </div>
        <div className={styles.setupStep}>
          <div className={styles.stepNumber}>3</div>
          <div>
            <h6>Set Up Auto-Responses</h6>
            <p>Configure automatic email and SMS responses</p>
          </div>
        </div>
        <div className={styles.setupStep}>
          <div className={styles.stepNumber}>4</div>
          <div>
            <h6>Assign Lead Owners</h6>
            <p>Set up automatic lead assignment rules</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const QualificationTab = () => (
  <div className={styles.tabPanel}>
    <h4>Lead Qualification Process</h4>
    
    <div className={styles.qualificationOverview}>
      <p>Lead qualification helps you identify which leads are most likely to convert, allowing you to focus your efforts on high-potential prospects.</p>
    </div>

    <div className={styles.qualificationCriteria}>
      <h5>Qualification Criteria</h5>
      <div className={styles.criteriaGrid}>
        <div className={styles.criteriaCard}>
          <h6>Budget</h6>
          <ul>
            <li>Price range preference</li>
            <li>Financial capacity</li>
            <li>Payment method preference</li>
          </ul>
        </div>
        <div className={styles.criteriaCard}>
          <h6>Timeline</h6>
          <ul>
            <li>Urgency of purchase/rent</li>
            <li>Moving timeline</li>
            <li>Decision-making timeframe</li>
          </ul>
        </div>
        <div className={styles.criteriaCard}>
          <h6>Requirements</h6>
          <ul>
            <li>Property type preference</li>
            <li>Location requirements</li>
            <li>Specific amenities needed</li>
          </ul>
        </div>
        <div className={styles.criteriaCard}>
          <h6>Authority</h6>
          <ul>
            <li>Decision-making power</li>
            <li>Influencer vs. decision maker</li>
            <li>Approval process</li>
          </ul>
        </div>
      </div>
    </div>

    <div className={styles.leadScoring}>
      <h5>Lead Scoring System</h5>
      <div className={styles.scoringSystem}>
        <div className={styles.scoreLevel}>
          <div className={`${styles.scoreBadge} ${styles.hot}`}>Hot Lead</div>
          <p>High probability of conversion, immediate attention required</p>
          <span>Score: 80-100</span>
        </div>
        <div className={styles.scoreLevel}>
          <div className={`${styles.scoreBadge} ${styles.warm}`}>Warm Lead</div>
          <p>Good potential, regular follow-up needed</p>
          <span>Score: 60-79</span>
        </div>
        <div className={styles.scoreLevel}>
          <div className={`${styles.scoreBadge} ${styles.cold}`}>Cold Lead</div>
          <p>Low probability, minimal effort recommended</p>
          <span>Score: 0-59</span>
        </div>
      </div>
    </div>
  </div>
);

const FollowupTab = () => (
  <div className={styles.tabPanel}>
    <h4>Follow-up Management</h4>
    
    <div className={styles.followupOverview}>
      <p>Effective follow-up is crucial for converting leads into customers. Our CRM provides automated workflows and reminders to ensure no lead falls through the cracks.</p>
    </div>

    <div className={styles.followupWorkflows}>
      <h5>Automated Follow-up Workflows</h5>
      <div className={styles.workflowGrid}>
        <div className={styles.workflowCard}>
          <div className={styles.workflowHeader}>
            <Clock size={20} />
            <h6>Immediate Response</h6>
          </div>
          <p>Send instant acknowledgment within 5 minutes</p>
          <div className={styles.workflowSteps}>
            <span>Auto-email</span>
            <span>SMS notification</span>
            <span>WhatsApp message</span>
          </div>
        </div>

        <div className={styles.workflowCard}>
          <div className={styles.workflowHeader}>
            <Calendar size={20} />
            <h6>Follow-up Schedule</h6>
          </div>
          <p>Structured follow-up sequence over 30 days</p>
          <div className={styles.workflowSteps}>
            <span>Day 1: Welcome call</span>
            <span>Day 3: Property suggestions</span>
            <span>Day 7: Check-in</span>
            <span>Day 14: Offer update</span>
          </div>
        </div>

        <div className={styles.workflowCard}>
          <div className={styles.workflowHeader}>
            <AlertCircle size={20} />
            <h6>Escalation Rules</h6>
          </div>
          <p>Automatic escalation for unresponsive leads</p>
          <div className={styles.workflowSteps}>
            <span>Manager notification</span>
            <span>Alternative contact methods</span>
            <span>Special offers</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.followupTemplates}>
      <h5>Follow-up Templates</h5>
      <div className={styles.templateList}>
        <div className={styles.templateItem}>
          <h6>Initial Contact Template</h6>
          <p>Professional first contact message with company introduction</p>
          <button className={styles.templateBtn}>View Template</button>
        </div>
        <div className={styles.templateItem}>
          <h6>Property Suggestion Template</h6>
          <p>Personalized property recommendations based on requirements</p>
          <button className={styles.templateBtn}>View Template</button>
        </div>
        <div className={styles.templateItem}>
          <h6>Follow-up Reminder Template</h6>
          <p>Gentle reminder for leads who haven&apos;t responded</p>
          <button className={styles.templateBtn}>View Template</button>
        </div>
      </div>
    </div>
  </div>
);

const ConversionTab = () => (
  <div className={styles.tabPanel}>
    <h4>Lead Conversion</h4>
    
    <div className={styles.conversionOverview}>
      <p>Lead conversion is the ultimate goal of lead management. Learn how to optimize your conversion process and track success metrics.</p>
    </div>

    <div className={styles.conversionMetrics}>
      <h5>Key Conversion Metrics</h5>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>15%</div>
          <div className={styles.metricLabel}>Conversion Rate</div>
          <p>Percentage of leads that become customers</p>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>45 days</div>
          <div className={styles.metricLabel}>Average Sales Cycle</div>
          <p>Time from lead capture to conversion</p>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>$2,500</div>
          <div className={styles.metricLabel}>Average Deal Value</div>
          <p>Average revenue per converted lead</p>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>8</div>
          <div className={styles.metricLabel}>Touch Points</div>
          <p>Average interactions before conversion</p>
        </div>
      </div>
    </div>

    <div className={styles.conversionStrategies}>
      <h5>Conversion Strategies</h5>
      <div className={styles.strategyList}>
        <div className={styles.strategyItem}>
          <div className={styles.strategyIcon}>
            <CheckCircle size={20} />
          </div>
          <div>
            <h6>Build Trust</h6>
            <p>Provide valuable information and demonstrate expertise</p>
          </div>
        </div>
        <div className={styles.strategyItem}>
          <div className={styles.strategyIcon}>
            <Clock size={20} />
          </div>
          <div>
            <h6>Timely Follow-up</h6>
            <p>Respond quickly and maintain consistent communication</p>
          </div>
        </div>
        <div className={styles.strategyItem}>
          <div className={styles.strategyIcon}>
            <Star size={20} />
          </div>
          <div>
            <h6>Personalization</h6>
            <p>Tailor communication to individual lead preferences</p>
          </div>
        </div>
        <div className={styles.strategyItem}>
          <div className={styles.strategyIcon}>
            <TrendingUp size={20} />
          </div>
          <div>
            <h6>Value Proposition</h6>
            <p>Clearly communicate unique benefits and solutions</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ReportsTab = () => (
  <div className={styles.tabPanel}>
    <h4>Lead Management Reports</h4>
    
    <div className={styles.reportsOverview}>
      <p>Comprehensive reporting and analytics to track lead performance and optimize your lead management process.</p>
    </div>

    <div className={styles.reportTypes}>
      <h5>Available Reports</h5>
      <div className={styles.reportGrid}>
        <div className={styles.reportCard}>
          <h6>Lead Source Performance</h6>
          <p>Track which lead sources generate the highest quality leads</p>
          <div className={styles.reportMetrics}>
            <span>Conversion rates by source</span>
            <span>Cost per lead</span>
            <span>Lead quality scores</span>
          </div>
        </div>

        <div className={styles.reportCard}>
          <h6>Lead Conversion Funnel</h6>
          <p>Visualize your lead journey and identify drop-off points</p>
          <div className={styles.reportMetrics}>
            <span>Stage progression</span>
            <span>Conversion rates</span>
            <span>Time in each stage</span>
          </div>
        </div>

        <div className={styles.reportCard}>
          <h6>Agent Performance</h6>
          <p>Monitor individual agent performance and productivity</p>
          <div className={styles.reportMetrics}>
            <span>Leads assigned</span>
            <span>Conversion rates</span>
            <span>Response times</span>
          </div>
        </div>

        <div className={styles.reportCard}>
          <h6>Lead Quality Analysis</h6>
          <p>Analyze lead quality and qualification effectiveness</p>
          <div className={styles.reportMetrics}>
            <span>Scoring accuracy</span>
            <span>Qualification rates</span>
            <span>Quality trends</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.reportScheduling}>
      <h5>Automated Report Delivery</h5>
      <p>Set up automated report delivery to stakeholders via email or dashboard notifications.</p>
      <div className={styles.scheduleOptions}>
        <button className={styles.scheduleBtn}>Daily Reports</button>
        <button className={styles.scheduleBtn}>Weekly Summary</button>
        <button className={styles.scheduleBtn}>Monthly Analysis</button>
        <button className={styles.scheduleBtn}>Custom Schedule</button>
      </div>
    </div>
  </div>
);

const BestPracticesTab = () => (
  <div className={styles.tabPanel}>
    <h4>Lead Management Best Practices</h4>
    
    <div className={styles.bestPracticesOverview}>
      <p>Follow these proven strategies to maximize your lead management effectiveness and improve conversion rates.</p>
    </div>

    <div className={styles.practicesList}>
      <div className={styles.practiceItem}>
        <div className={styles.practiceNumber}>1</div>
        <div>
          <h6>Respond Quickly</h6>
          <p>Respond to new leads within 5 minutes to increase engagement by 900%</p>
        </div>
      </div>

      <div className={styles.practiceItem}>
        <div className={styles.practiceNumber}>2</div>
        <div>
          <h6>Personalize Communication</h6>
          <p>Use lead data to personalize messages and increase response rates</p>
        </div>
      </div>

      <div className={styles.practiceItem}>
        <div className={styles.practiceNumber}>3</div>
        <div>
          <h6>Follow Up Consistently</h6>
          <p>80% of sales require 5 follow-up calls, but 44% of salespeople give up after 1</p>
        </div>
      </div>

      <div className={styles.practiceItem}>
        <div className={styles.practiceNumber}>4</div>
        <div>
          <h6>Use Multiple Channels</h6>
          <p>Engage leads across multiple communication channels for better results</p>
        </div>
      </div>

      <div className={styles.practiceItem}>
        <div className={styles.practiceNumber}>5</div>
        <div>
          <h6>Track Everything</h6>
          <p>Monitor all interactions and use data to optimize your process</p>
        </div>
      </div>

      <div className={styles.practiceItem}>
        <div className={styles.practiceNumber}>6</div>
        <div>
          <h6>Qualify Early</h6>
          <p>Focus your efforts on qualified leads to improve efficiency</p>
        </div>
      </div>
    </div>

    <div className={styles.commonMistakes}>
      <h5>Common Mistakes to Avoid</h5>
      <div className={styles.mistakesList}>
        <div className={styles.mistakeItem}>
          <AlertCircle size={20} />
          <span>Not following up consistently</span>
        </div>
        <div className={styles.mistakeItem}>
          <AlertCircle size={20} />
          <span>Generic communication</span>
        </div>
        <div className={styles.mistakeItem}>
          <AlertCircle size={20} />
          <span>Ignoring lead scoring</span>
        </div>
        <div className={styles.mistakeItem}>
          <AlertCircle size={20} />
          <span>Poor data quality</span>
        </div>
        <div className={styles.mistakeItem}>
          <AlertCircle size={20} />
          <span>Lack of automation</span>
        </div>
      </div>
    </div>
  </div>
);

export default LeadManagementSection;
