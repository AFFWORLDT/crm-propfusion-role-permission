import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Calendar, 
  DollarSign, 
  Shield, 
  BarChart3, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileCheck,
  UserCheck,
  CalendarDays,
  Calculator,
  CreditCard,
  Building2,
  Home,
  MapPin,
  Phone,
  Mail,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  Archive,
  Search,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import styles from './ContractManagementSection.module.css';

const ContractManagementSection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'types', label: 'Contract Types', icon: Users },
    { id: 'workflow', label: 'Workflow', icon: Calendar },
    { id: 'templates', label: 'Templates', icon: FileCheck },
    { id: 'negotiation', label: 'Negotiation', icon: DollarSign },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'types':
        return <TypesTab />;
      case 'workflow':
        return <WorkflowTab />;
      case 'templates':
        return <TemplatesTab />;
      case 'negotiation':
        return <NegotiationTab />;
      case 'compliance':
        return <ComplianceTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={styles.contractManagementSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <FileText size={24} />
        </div>
        <div className={styles.headerContent}>
          <h3>Contract Management</h3>
          <p>Streamline contract creation, negotiation, and management processes for all property transactions</p>
        </div>
      </div>

      <div className={styles.tabNavigation}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className={styles.tabContent}>
        <div className={styles.tabPanel}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab = () => (
  <div className={styles.overviewTab}>
    <div className={styles.overviewGrid}>
      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <FileText size={24} />
        </div>
        <h4>Contract Creation</h4>
        <p>Generate professional contracts using customizable templates with automated field population</p>
        <div className={styles.cardFeatures}>
          <span>Template Library</span>
          <span>Auto-fill</span>
          <span>Digital Signatures</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Users size={24} />
        </div>
        <h4>Stakeholder Management</h4>
        <p>Manage all parties involved in contracts including buyers, sellers, agents, and legal representatives</p>
        <div className={styles.cardFeatures}>
          <span>Role Assignment</span>
          <span>Contact Info</span>
          <span>Permissions</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Calendar size={24} />
        </div>
        <h4>Timeline Tracking</h4>
        <p>Monitor contract milestones, deadlines, and important dates with automated reminders</p>
        <div className={styles.cardFeatures}>
          <span>Milestones</span>
          <span>Deadlines</span>
          <span>Reminders</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Shield size={24} />
        </div>
        <h4>Compliance & Legal</h4>
        <p>Ensure all contracts meet legal requirements and regulatory compliance standards</p>
        <div className={styles.cardFeatures}>
          <span>Legal Checks</span>
          <span>Compliance</span>
          <span>Audit Trail</span>
        </div>
      </div>
    </div>

    <div className={styles.quickStart}>
      <h4>Quick Start Guide</h4>
      <div className={styles.quickStartSteps}>
        <div className={styles.quickStep}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h5>Choose Template</h5>
            <p>Select from pre-built contract templates or create custom ones</p>
          </div>
        </div>
        <div className={styles.quickStep}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h5>Fill Details</h5>
            <p>Auto-populate contract fields with property and client information</p>
          </div>
        </div>
        <div className={styles.quickStep}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h5>Review & Send</h5>
            <p>Review contract terms and send to all parties for signature</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Types Tab
const TypesTab = () => (
  <div className={styles.typesTab}>
    <div className={styles.contractTypesGrid}>
      <div className={styles.contractType}>
        <div className={styles.typeIcon}>
          <Home size={24} />
        </div>
        <h4>Sales Contracts</h4>
        <p>Standard property purchase agreements with customizable terms and conditions</p>
        <div className={styles.typeFeatures}>
          <span>Purchase Agreement</span>
          <span>Terms & Conditions</span>
          <span>Payment Schedule</span>
          <span>Closing Date</span>
        </div>
      </div>

      <div className={styles.contractType}>
        <div className={styles.typeIcon}>
          <Building2 size={24} />
        </div>
        <h4>Rental Agreements</h4>
        <p>Comprehensive lease agreements for residential and commercial properties</p>
        <div className={styles.typeFeatures}>
          <span>Lease Terms</span>
          <span>Rent Schedule</span>
          <span>Maintenance</span>
          <span>Utilities</span>
        </div>
      </div>

      <div className={styles.contractType}>
        <div className={styles.typeIcon}>
          <Users size={24} />
        </div>
        <h4>Agency Agreements</h4>
        <p>Contracts between property agents and clients for representation services</p>
        <div className={styles.typeFeatures}>
          <span>Commission Structure</span>
          <span>Service Scope</span>
          <span>Duration</span>
          <span>Exclusivity</span>
        </div>
      </div>

      <div className={styles.contractType}>
        <div className={styles.typeIcon}>
          <FileCheck size={24} />
        </div>
        <h4>Option Contracts</h4>
        <p>Agreements giving buyers the right to purchase properties within specified timeframes</p>
        <div className={styles.typeFeatures}>
          <span>Option Period</span>
          <span>Exercise Price</span>
          <span>Extension Terms</span>
          <span>Forfeiture</span>
        </div>
      </div>
    </div>

    <div className={styles.contractCategories}>
      <h4>Contract Categories</h4>
      <div className={styles.categoryGrid}>
        <div className={styles.category}>
          <h5>Residential</h5>
          <ul>
            <li>Single Family Homes</li>
            <li>Condominiums</li>
            <li>Townhouses</li>
            <li>Multi-family Units</li>
          </ul>
        </div>
        <div className={styles.category}>
          <h5>Commercial</h5>
          <ul>
            <li>Office Spaces</li>
            <li>Retail Properties</li>
            <li>Industrial Units</li>
            <li>Warehouses</li>
          </ul>
        </div>
        <div className={styles.category}>
          <h5>Land</h5>
          <ul>
            <li>Vacant Lots</li>
            <li>Agricultural Land</li>
            <li>Development Sites</li>
            <li>Investment Land</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Workflow Tab
const WorkflowTab = () => (
  <div className={styles.workflowTab}>
    <div className={styles.workflowContainer}>
      <div className={styles.workflowStep}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>
            <Plus size={20} />
          </div>
          <h4>1. Contract Initiation</h4>
        </div>
        <p>Create new contract from template or scratch, assign parties and basic terms</p>
        <div className={styles.stepActions}>
          <span>Template Selection</span>
          <span>Party Assignment</span>
          <span>Initial Terms</span>
        </div>
      </div>

      <div className={styles.workflowStep}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>
            <Edit size={20} />
          </div>
          <h4>2. Draft & Review</h4>
        </div>
        <p>Draft contract terms, review with stakeholders, and make necessary adjustments</p>
        <div className={styles.stepActions}>
          <span>Term Drafting</span>
          <span>Stakeholder Review</span>
          <span>Revision Cycles</span>
        </div>
      </div>

      <div className={styles.workflowStep}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>
            <Send size={20} />
          </div>
          <h4>3. Negotiation</h4>
        </div>
        <p>Send contract to all parties, track changes, and manage negotiation process</p>
        <div className={styles.stepActions}>
          <span>Contract Sharing</span>
          <span>Change Tracking</span>
          <span>Version Control</span>
        </div>
      </div>

      <div className={styles.workflowStep}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>
            <CheckCircle size={20} />
          </div>
          <h4>4. Approval & Signing</h4>
        </div>
        <p>Obtain approvals from all parties and collect digital signatures</p>
        <div className={styles.stepActions}>
          <span>Approval Workflow</span>
          <span>Digital Signatures</span>
          <span>Execution Tracking</span>
        </div>
      </div>

      <div className={styles.workflowStep}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>
            <FileCheck size={20} />
          </div>
          <h4>5. Execution & Monitoring</h4>
        </div>
        <p>Monitor contract performance, track obligations, and manage renewals</p>
        <div className={styles.stepActions}>
          <span>Performance Tracking</span>
          <span>Obligation Management</span>
          <span>Renewal Alerts</span>
        </div>
      </div>
    </div>

    <div className={styles.workflowFeatures}>
      <h4>Workflow Features</h4>
      <div className={styles.featureGrid}>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Automated Notifications</span>
        </div>
        <div className={styles.featureItem}>
          <Clock size={20} />
          <span>Deadline Tracking</span>
        </div>
        <div className={styles.featureItem}>
          <AlertTriangle size={20} />
          <span>Risk Alerts</span>
        </div>
        <div className={styles.featureItem}>
          <RefreshCw size={20} />
          <span>Status Updates</span>
        </div>
      </div>
    </div>
  </div>
);

// Templates Tab
const TemplatesTab = () => (
  <div className={styles.templatesTab}>
    <div className={styles.templateLibrary}>
      <h4>Template Library</h4>
      <div className={styles.templateGrid}>
        <div className={styles.templateCard}>
          <div className={styles.templateHeader}>
            <FileText size={24} />
            <h5>Standard Sales Contract</h5>
          </div>
          <p>Comprehensive property purchase agreement with standard terms and conditions</p>
          <div className={styles.templateActions}>
            <button className={styles.actionBtn}>
              <Eye size={16} />
              Preview
            </button>
            <button className={styles.actionBtn}>
              <Download size={16} />
              Download
            </button>
            <button className={styles.actionBtn}>
              <Edit size={16} />
              Customize
            </button>
          </div>
        </div>

        <div className={styles.templateCard}>
          <div className={styles.templateHeader}>
            <Building2 size={24} />
            <h5>Residential Lease Agreement</h5>
          </div>
          <p>Standard residential lease with customizable terms for different property types</p>
          <div className={styles.templateActions}>
            <button className={styles.actionBtn}>
              <Eye size={16} />
              Preview
            </button>
            <button className={styles.actionBtn}>
              <Download size={16} />
              Download
            </button>
            <button className={styles.actionBtn}>
              <Edit size={16} />
              Customize
            </button>
          </div>
        </div>

        <div className={styles.templateCard}>
          <div className={styles.templateHeader}>
            <Users size={24} />
            <h5>Exclusive Agency Agreement</h5>
          </div>
          <p>Agent-client representation agreement with commission structure and terms</p>
          <div className={styles.templateActions}>
            <button className={styles.actionBtn}>
              <Eye size={16} />
              Preview
            </button>
            <button className={styles.actionBtn}>
              <Download size={16} />
              Download
            </button>
            <button className={styles.actionBtn}>
              <Edit size={16} />
              Customize
            </button>
          </div>
        </div>

        <div className={styles.templateCard}>
          <div className={styles.templateHeader}>
            <FileCheck size={24} />
            <h5>Option to Purchase</h5>
          </div>
          <p>Option contract giving buyers rights to purchase within specified timeframe</p>
          <div className={styles.templateActions}>
            <button className={styles.actionBtn}>
              <Eye size={16} />
              Preview
            </button>
            <button className={styles.actionBtn}>
              <Download size={16} />
              Download
            </button>
            <button className={styles.actionBtn}>
              <Edit size={16} />
              Customize
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.templateCustomization}>
      <h4>Template Customization</h4>
      <div className={styles.customizationGrid}>
        <div className={styles.customizationCard}>
          <h5>Dynamic Fields</h5>
          <p>Auto-populate contract fields with property and client information</p>
          <ul>
            <li>Property Details</li>
            <li>Client Information</li>
            <li>Financial Terms</li>
            <li>Dates & Deadlines</li>
          </ul>
        </div>
        <div className={styles.customizationCard}>
          <h5>Clause Library</h5>
          <p>Pre-built legal clauses for common contract scenarios</p>
          <ul>
            <li>Standard Terms</li>
            <li>Special Conditions</li>
            <li>Legal Provisions</li>
            <li>Compliance Clauses</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Negotiation Tab
const NegotiationTab = () => (
  <div className={styles.negotiationTab}>
    <div className={styles.negotiationProcess}>
      <h4>Negotiation Process</h4>
      <div className={styles.processSteps}>
        <div className={styles.processStep}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h5>Initial Offer</h5>
            <p>Present initial contract terms and conditions to all parties</p>
          </div>
        </div>
        <div className={styles.processStep}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h5>Counter Offers</h5>
            <p>Track and manage counter offers with version control</p>
          </div>
        </div>
        <div className={styles.processStep}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h5>Negotiation Rounds</h5>
            <p>Manage multiple negotiation rounds with change tracking</p>
          </div>
        </div>
        <div className={styles.processStep}>
          <div className={styles.stepNumber}>4</div>
          <div className={styles.stepContent}>
            <h5>Final Agreement</h5>
            <p>Reach consensus and finalize contract terms</p>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.negotiationTools}>
      <h4>Negotiation Tools</h4>
      <div className={styles.toolsGrid}>
        <div className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <Edit size={24} />
          </div>
          <h5>Change Tracking</h5>
          <p>Track all changes made during negotiation with detailed audit trail</p>
        </div>
        <div className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <Clock size={24} />
          </div>
          <h5>Version Control</h5>
          <p>Maintain multiple contract versions with clear change history</p>
        </div>
        <div className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <Send size={24} />
          </div>
          <h5>Communication Hub</h5>
          <p>Centralized communication for all negotiation discussions</p>
        </div>
        <div className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <CheckCircle size={24} />
          </div>
          <h5>Approval Workflow</h5>
          <p>Streamlined approval process for contract changes</p>
        </div>
      </div>
    </div>
  </div>
);

// Compliance Tab
const ComplianceTab = () => (
  <div className={styles.complianceTab}>
    <div className={styles.complianceOverview}>
      <h4>Compliance & Legal Requirements</h4>
      <div className={styles.complianceGrid}>
        <div className={styles.complianceCard}>
          <div className={styles.complianceIcon}>
            <Shield size={24} />
          </div>
          <h5>Legal Compliance</h5>
          <p>Ensure contracts meet all local, state, and federal legal requirements</p>
          <ul>
            <li>Property Law Compliance</li>
            <li>Consumer Protection</li>
            <li>Fair Housing Laws</li>
            <li>Tax Regulations</li>
          </ul>
        </div>

        <div className={styles.complianceCard}>
          <div className={styles.complianceIcon}>
            <FileCheck size={24} />
          </div>
          <h5>Documentation Standards</h5>
          <p>Maintain proper documentation and record-keeping requirements</p>
          <ul>
            <li>Contract Archives</li>
            <li>Digital Signatures</li>
            <li>Audit Trails</li>
            <li>Record Retention</li>
          </ul>
        </div>

        <div className={styles.complianceCard}>
          <div className={styles.complianceIcon}>
            <AlertTriangle size={24} />
          </div>
          <h5>Risk Management</h5>
          <p>Identify and mitigate potential legal and compliance risks</p>
          <ul>
            <li>Risk Assessment</li>
            <li>Mitigation Strategies</li>
            <li>Insurance Requirements</li>
            <li>Liability Protection</li>
          </ul>
        </div>
      </div>
    </div>

    <div className={styles.complianceFeatures}>
      <h4>Compliance Features</h4>
      <div className={styles.featureList}>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Automated Legal Checks</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Compliance Monitoring</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Regulatory Updates</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Audit Trail</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Legal Templates</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Risk Alerts</span>
        </div>
      </div>
    </div>
  </div>
);

// Reports Tab
const ReportsTab = () => (
  <div className={styles.reportsTab}>
    <div className={styles.reportCategories}>
      <h4>Contract Reports</h4>
      <div className={styles.reportGrid}>
        <div className={styles.reportItem}>
          <div className={styles.reportIcon}>
            <BarChart3 size={24} />
          </div>
          <h5>Contract Analytics</h5>
          <p>Comprehensive analytics on contract performance, trends, and metrics</p>
          <div className={styles.reportFeatures}>
            <span>Volume Analysis</span>
            <span>Success Rates</span>
            <span>Timeline Metrics</span>
          </div>
        </div>

        <div className={styles.reportItem}>
          <div className={styles.reportIcon}>
            <Calendar size={24} />
          </div>
          <h5>Timeline Reports</h5>
          <p>Track contract milestones, deadlines, and completion rates</p>
          <div className={styles.reportFeatures}>
            <span>Milestone Tracking</span>
            <span>Deadline Analysis</span>
            <span>Completion Rates</span>
          </div>
        </div>

        <div className={styles.reportItem}>
          <div className={styles.reportIcon}>
            <DollarSign size={24} />
          </div>
          <h5>Financial Reports</h5>
          <p>Monitor contract values, payments, and financial performance</p>
          <div className={styles.reportFeatures}>
            <span>Contract Values</span>
            <span>Payment Tracking</span>
            <span>Revenue Analysis</span>
          </div>
        </div>

        <div className={styles.reportItem}>
          <div className={styles.reportIcon}>
            <Shield size={24} />
          </div>
          <h5>Compliance Reports</h5>
          <p>Track compliance status, legal requirements, and risk assessments</p>
          <div className={styles.reportFeatures}>
            <span>Compliance Status</span>
            <span>Risk Assessment</span>
            <span>Legal Updates</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.customReports}>
      <h4>Custom Reports</h4>
      <div className={styles.customReportInfo}>
        <div className={styles.infoCard}>
          <h5>Report Builder</h5>
          <p>Create custom reports with drag-and-drop interface and multiple data sources</p>
          <div className={styles.builderFeatures}>
            <span>Drag & Drop</span>
            <span>Multiple Sources</span>
            <span>Custom Filters</span>
            <span>Export Options</span>
          </div>
        </div>
        <div className={styles.infoCard}>
          <h5>Scheduled Reports</h5>
          <p>Automate report generation and delivery on regular intervals</p>
          <div className={styles.schedulingFeatures}>
            <span>Daily Reports</span>
            <span>Weekly Summaries</span>
            <span>Monthly Analytics</span>
            <span>Email Delivery</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContractManagementSection;
