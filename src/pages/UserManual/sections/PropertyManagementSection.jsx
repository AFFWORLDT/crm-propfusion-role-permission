import React, { useState } from 'react';
import { Building2, Plus, Camera, MapPin, FileText, Share2, Calendar, DollarSign, Users, Settings, BarChart3, ArrowRight, CheckCircle, AlertCircle, Info } from 'lucide-react';
import styles from './PropertyManagementSection.module.css';

const PropertyManagementSection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Building2 size={20} /> },
    { id: 'workflow', label: 'Workflow', icon: <ArrowRight size={20} /> },
    { id: 'types', label: 'Property Types', icon: <Settings size={20} /> },
    { id: 'media', label: 'Photos & Media', icon: <Camera size={20} /> },
    { id: 'sharing', label: 'Sharing & Marketing', icon: <Share2 size={20} /> },
    { id: 'viewings', label: 'Viewings', icon: <Calendar size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> }
  ];

  return (
    <div className={styles.propertyManagementSection}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <Building2 size={32} />
        </div>
        <div className={styles.headerContent}>
          <h2>Property Management</h2>
          <p>Complete guide to managing properties throughout their lifecycle - from listing creation to sale/rent completion</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'workflow' && <WorkflowTab />}
        {activeTab === 'types' && <TypesTab />}
        {activeTab === 'media' && <MediaTab />}
        {activeTab === 'sharing' && <SharingTab />}
        {activeTab === 'viewings' && <ViewingsTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab = () => (
  <div className={styles.tabPanel}>
    <div className={styles.overviewGrid}>
      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Building2 size={24} />
        </div>
        <h3>Complete Lifecycle Management</h3>
        <p>Manage properties from initial listing through to successful sale or rental completion</p>
        <ul>
          <li>Property creation and listing</li>
          <li>Media and document management</li>
          <li>Marketing and promotion</li>
          <li>Viewing coordination</li>
          <li>Offer and transaction management</li>
        </ul>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Users size={24} />
        </div>
        <h3>Team Collaboration</h3>
        <p>Enable multiple agents to work together on property management</p>
        <ul>
          <li>Agent assignment and permissions</li>
          <li>Shared property access</li>
          <li>Activity tracking and history</li>
          <li>Communication tools</li>
        </ul>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <BarChart3 size={24} />
        </div>
        <h3>Performance Analytics</h3>
        <p>Track property performance and agent productivity</p>
        <ul>
          <li>Property view statistics</li>
          <li>Lead generation metrics</li>
          <li>Conversion rate analysis</li>
          <li>Market trend insights</li>
        </ul>
      </div>
    </div>

    <div className={styles.quickStart}>
      <h3>Quick Start Guide</h3>
      <div className={styles.quickStartSteps}>
        <div className={styles.quickStep}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h4>Add New Property</h4>
            <p>Click the &quot;+ Add Property&quot; button and fill in basic details</p>
          </div>
        </div>
        <div className={styles.quickStep}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h4>Upload Photos</h4>
            <p>Add high-quality images and virtual tours</p>
          </div>
        </div>
        <div className={styles.quickStep}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h4>Generate PDF</h4>
            <p>Create professional property brochures for sharing</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Workflow Tab
const WorkflowTab = () => (
  <div className={styles.tabPanel}>
    <div className={styles.workflowContainer}>
      <div className={styles.workflowStep}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>📝</div>
          <h3>1. Property Creation</h3>
        </div>
        <div className={styles.stepContent}>
          <h4>Basic Information</h4>
          <ul>
            <li>Property title and description</li>
            <li>Price and listing type (Sell/Rent)</li>
            <li>Property type and specifications</li>
            <li>Location and address details</li>
          </ul>
          
          <h4>Advanced Details</h4>
          <ul>
            <li>Completion status and build year</li>
            <li>Developer and agent assignment</li>
            <li>Amenities and features</li>
            <li>Documents and permits</li>
          </ul>
        </div>
      </div>

      <div className={styles.workflowStep}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>📸</div>
          <h3>2. Media Management</h3>
        </div>
        <div className={styles.stepContent}>
          <h4>Photo Requirements</h4>
          <ul>
            <li>Minimum resolution: 1200x800 pixels</li>
            <li>Formats: JPG, PNG, WebP</li>
            <li>Maximum file size: 5MB per photo</li>
            <li>Recommended: 10-20 photos per property</li>
          </ul>
          
          <h4>Content Types</h4>
          <ul>
            <li>Exterior and building facade</li>
            <li>Interior rooms and spaces</li>
            <li>Amenities and facilities</li>
            <li>Neighborhood and views</li>
          </ul>
        </div>
      </div>

      <div className={styles.workflowStep}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>📤</div>
          <h3>3. Marketing & Sharing</h3>
        </div>
        <div className={styles.stepContent}>
          <h4>Premium PDF Generation</h4>
          <ul>
            <li>Professional property brochures</li>
            <li>Company branding and information</li>
            <li>High-quality print-ready output</li>
            <li>Easy sharing and distribution</li>
          </ul>
          
          <h4>Portal Integration</h4>
          <ul>
            <li>Automatic portal updates</li>
            <li>Multi-platform synchronization</li>
            <li>Content optimization</li>
            <li>Performance tracking</li>
          </ul>
        </div>
      </div>

      <div className={styles.workflowStep}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>📅</div>
          <h3>4. Viewing Management</h3>
        </div>
        <div className={styles.stepContent}>
          <h4>Scheduling Viewings</h4>
          <ul>
            <li>Calendar integration</li>
            <li>Agent availability management</li>
            <li>Client appointment booking</li>
            <li>Automated reminders</li>
          </ul>
          
          <h4>Viewing Types</h4>
          <ul>
            <li>Individual property tours</li>
            <li>Group viewings</li>
            <li>Virtual tours</li>
            <li>Open houses</li>
          </ul>
        </div>
      </div>

      <div className={styles.workflowStep}>
        <div className={styles.stepHeader}>
          <div className={styles.stepIcon}>💰</div>
          <h3>5. Offers & Transactions</h3>
        </div>
        <div className={styles.stepContent}>
          <h4>Offer Management</h4>
          <ul>
            <li>Offer recording and tracking</li>
            <li>Negotiation management</li>
            <li>Contract generation</li>
            <li>Transaction completion</li>
          </ul>
          
          <h4>Post-Sale Process</h4>
          <ul>
            <li>Property status updates</li>
            <li>Document archiving</li>
            <li>Client follow-up</li>
            <li>Performance analysis</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Types Tab
const TypesTab = () => (
  <div className={styles.tabPanel}>
    <div className={styles.propertyTypesGrid}>
      <div className={styles.propertyTypeCard}>
        <div className={styles.typeIcon}>🏢</div>
        <h3>Residential Properties</h3>
        <div className={styles.typeCategories}>
          <div className={styles.category}>
            <h4>Apartments</h4>
            <ul>
              <li>Studio apartments</li>
              <li>1-4+ bedroom units</li>
              <li>Penthouses</li>
              <li>Duplexes</li>
            </ul>
          </div>
          <div className={styles.category}>
            <h4>Villas</h4>
            <ul>
              <li>Townhouses</li>
              <li>Detached villas</li>
              <li>Compound villas</li>
              <li>Luxury villas</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.propertyTypeCard}>
        <div className={styles.typeIcon}>🏭</div>
        <h3>Commercial Properties</h3>
        <div className={styles.typeCategories}>
          <div className={styles.category}>
            <h4>Office Spaces</h4>
            <ul>
              <li>Office buildings</li>
              <li>Co-working spaces</li>
              <li>Business centers</li>
              <li>Corporate offices</li>
            </ul>
          </div>
          <div className={styles.category}>
            <h4>Retail & Industrial</h4>
            <ul>
              <li>Shops and malls</li>
              <li>Warehouses</li>
              <li>Factories</li>
              <li>Showrooms</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.propertyTypeCard}>
        <div className={styles.typeIcon}>🏗️</div>
        <h3>Special Categories</h3>
        <div className={styles.typeCategories}>
          <div className={styles.category}>
            <h4>Off-Plan</h4>
            <ul>
              <li>Pre-construction</li>
              <li>Under construction</li>
              <li>Development projects</li>
              <li>Investment properties</li>
            </ul>
          </div>
          <div className={styles.category}>
            <h4>Land & Development</h4>
            <ul>
              <li>Residential plots</li>
              <li>Commercial land</li>
              <li>Agricultural land</li>
              <li>Development sites</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.listingTypes}>
      <h3>Listing Types</h3>
      <div className={styles.listingTypeGrid}>
        <div className={styles.listingType}>
          <DollarSign size={24} />
          <h4>For Sale</h4>
          <p>Properties available for purchase</p>
          <ul>
            <li>Freehold properties</li>
            <li>Leasehold properties</li>
            <li>Investment opportunities</li>
            <li>Development projects</li>
          </ul>
        </div>
        <div className={styles.listingType}>
          <Calendar size={24} />
          <h4>For Rent</h4>
          <p>Properties available for rental</p>
          <ul>
            <li>Short-term rentals</li>
            <li>Long-term leases</li>
            <li>Furnished units</li>
            <li>Unfurnished units</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Media Tab
const MediaTab = () => (
  <div className={styles.tabPanel}>
    <div className={styles.mediaGuidelines}>
      <h3>Photo & Media Guidelines</h3>
      
      <div className={styles.guidelineGrid}>
        <div className={styles.guidelineCard}>
          <h4>📱 Photo Requirements</h4>
          <div className={styles.requirementList}>
            <div className={styles.requirement}>
              <CheckCircle size={16} />
              <span>Minimum resolution: 1200x800 pixels</span>
            </div>
            <div className={styles.requirement}>
              <CheckCircle size={16} />
              <span>Formats: JPG, PNG, WebP</span>
            </div>
            <div className={styles.requirement}>
              <CheckCircle size={16} />
              <span>Maximum file size: 5MB per photo</span>
            </div>
            <div className={styles.requirement}>
              <CheckCircle size={16} />
              <span>Recommended count: 10-20 photos</span>
            </div>
          </div>
        </div>

        <div className={styles.guidelineCard}>
          <h4>🎯 Content Strategy</h4>
          <div className={styles.contentStrategy}>
            <div className={styles.strategyItem}>
              <strong>Primary Photo:</strong> Best exterior or main feature
            </div>
            <div className={styles.strategyItem}>
              <strong>Exterior Photos:</strong> Building facade, entrance, views
            </div>
            <div className={styles.strategyItem}>
              <strong>Interior Photos:</strong> Living areas, bedrooms, kitchen
            </div>
            <div className={styles.strategyItem}>
              <strong>Amenity Photos:</strong> Pool, gym, garden, facilities
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mediaFeatures}>
        <h4>Advanced Media Features</h4>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <Camera size={24} />
            <h5>360° Photos</h5>
            <p>Upload panoramic images for immersive viewing</p>
          </div>
          <div className={styles.featureItem}>
            <FileText size={24} />
            <h5>Virtual Tours</h5>
            <p>Add property walkthrough videos</p>
          </div>
          <div className={styles.featureItem}>
            <MapPin size={24} />
            <h5>Drone Footage</h5>
            <p>Aerial property views and neighborhood shots</p>
          </div>
          <div className={styles.featureItem}>
            <Building2 size={24} />
            <h5>Interactive Maps</h5>
            <p>Location and neighborhood information</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Sharing Tab
const SharingTab = () => (
  <div className={styles.tabPanel}>
    <div className={styles.sharingOptions}>
      <h3>Property Sharing & Marketing</h3>
      
      <div className={styles.sharingGrid}>
        <div className={styles.sharingCard}>
          <div className={styles.cardHeader}>
            <FileText size={24} />
            <h4>Premium PDF Generation</h4>
          </div>
          <p>Create professional property brochures with company branding</p>
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>High-quality print-ready output</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Company logo and information</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Professional layout and design</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Easy sharing and distribution</span>
            </div>
          </div>
        </div>

        <div className={styles.sharingCard}>
          <div className={styles.cardHeader}>
            <Share2 size={24} />
            <h4>Bulk Property Sharing</h4>
          </div>
          <p>Generate comparison documents for multiple properties</p>
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Multiple property comparison</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Feature analysis and pricing</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Professional comparison layout</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Client presentation ready</span>
            </div>
          </div>
        </div>

        <div className={styles.sharingCard}>
          <div className={styles.cardHeader}>
            <Building2 size={24} />
            <h4>Portal Integration</h4>
          </div>
          <p>Automatic synchronization with property portals</p>
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Bayut integration</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Property Finder sync</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Dubizzle platform</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Custom portal support</span>
            </div>
          </div>
        </div>

        <div className={styles.sharingCard}>
          <div className={styles.cardHeader}>
            <Share2 size={24} />
            <h4>Social Media Sharing</h4>
          </div>
          <p>Direct sharing to social platforms</p>
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>WhatsApp Business</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Facebook and Instagram</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>LinkedIn professional</span>
            </div>
            <div className={styles.featureItem}>
              <CheckCircle size={16} />
              <span>Twitter and other platforms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Viewings Tab
const ViewingsTab = () => (
  <div className={styles.tabPanel}>
    <div className={styles.viewingsGuide}>
      <h3>Property Viewing Management</h3>
      
      <div className={styles.viewingTypes}>
        <h4>Types of Viewings</h4>
        <div className={styles.viewingTypeGrid}>
          <div className={styles.viewingType}>
            <Users size={24} />
            <h5>Individual Viewings</h5>
            <p>One-on-one property tours with clients</p>
            <ul>
              <li>Personalized attention</li>
              <li>Detailed property explanation</li>
              <li>Client preference discussion</li>
              <li>Immediate feedback collection</li>
            </ul>
          </div>
          
          <div className={styles.viewingType}>
            <Calendar size={24} />
            <h5>Group Viewings</h5>
            <p>Multiple client viewings simultaneously</p>
            <ul>
              <li>Efficient time management</li>
              <li>Group dynamics and interest</li>
              <li>Competitive atmosphere</li>
              <li>Multiple offers potential</li>
            </ul>
          </div>
          
          <div className={styles.viewingType}>
            <Camera size={24} />
            <h5>Virtual Viewings</h5>
            <p>Online property tours and presentations</p>
            <ul>
              <li>Remote client access</li>
              <li>Cost-effective solution</li>
              <li>Flexible scheduling</li>
              <li>Recording capabilities</li>
            </ul>
          </div>
          
          <div className={styles.viewingType}>
            <Building2 size={24} />
            <h5>Open Houses</h5>
            <p>Public property viewing events</p>
            <ul>
              <li>Maximum exposure</li>
              <li>Multiple potential buyers</li>
              <li>Market feedback</li>
              <li>Networking opportunities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.viewingProcess}>
        <h4>Viewing Process Workflow</h4>
        <div className={styles.processSteps}>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h5>Schedule Viewing</h5>
              <p>Set date, time, and assign agent</p>
            </div>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h5>Prepare Property</h5>
              <p>Ensure property is viewing-ready</p>
            </div>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h5>Conduct Viewing</h5>
              <p>Show property and answer questions</p>
            </div>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h5>Collect Feedback</h5>
              <p>Get client impressions and interest</p>
            </div>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>5</div>
            <div className={styles.stepContent}>
              <h5>Follow-up</h5>
              <p>Send thank you and next steps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Reports Tab
const ReportsTab = () => (
  <div className={styles.tabPanel}>
    <div className={styles.reportsGuide}>
      <h3>Property Reports & Analytics</h3>
      
      <div className={styles.reportCategories}>
        <div className={styles.reportCategory}>
          <h4>Performance Reports</h4>
          <div className={styles.reportGrid}>
            <div className={styles.reportItem}>
              <BarChart3 size={24} />
              <h5>Property Views</h5>
              <p>Track property visibility and interest levels</p>
              <ul>
                <li>View count statistics</li>
                <li>Unique visitor tracking</li>
                <li>Viewing duration analysis</li>
                <li>Popular property identification</li>
              </ul>
            </div>
            
            <div className={styles.reportItem}>
              <Users size={24} />
              <h5>Inquiry Rates</h5>
              <p>Monitor lead generation from properties</p>
              <ul>
                <li>Inquiry volume tracking</li>
                <li>Lead quality assessment</li>
                <li>Response time analysis</li>
                <li>Conversion potential</li>
              </ul>
            </div>
            
            <div className={styles.reportItem}>
              <Calendar size={24} />
              <h5>Viewing Statistics</h5>
              <p>Analyze viewing success and patterns</p>
              <ul>
                <li>Viewing completion rates</li>
                <li>Scheduling efficiency</li>
                <li>Client satisfaction scores</li>
                <li>Follow-up effectiveness</li>
              </ul>
            </div>
            
            <div className={styles.reportItem}>
              <DollarSign size={24} />
              <h5>Conversion Rates</h5>
              <p>Measure property success metrics</p>
              <ul>
                <li>Viewing to offer ratio</li>
                <li>Offer to sale conversion</li>
                <li>Time to sale analysis</li>
                <li>Revenue per property</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.reportCategory}>
          <h4>Financial Reports</h4>
          <div className={styles.reportGrid}>
            <div className={styles.reportItem}>
              <BarChart3 size={24} />
              <h5>Price Analysis</h5>
              <p>Market price comparisons and trends</p>
              <ul>
                <li>Market value assessment</li>
                <li>Price trend analysis</li>
                <li>Competitive pricing</li>
                <li>ROI calculations</li>
              </ul>
            </div>
            
            <div className={styles.reportItem}>
              <Users size={24} />
              <h5>Commission Tracking</h5>
              <p>Agent performance and earnings</p>
              <ul>
                <li>Individual agent metrics</li>
                <li>Team performance comparison</li>
                <li>Commission calculations</li>
                <li>Performance incentives</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.reportCategory}>
          <h4>Custom Reports</h4>
          <div className={styles.customReportInfo}>
            <div className={styles.infoCard}>
              <Info size={24} />
              <h5>Report Builder</h5>
              <p>Create custom reports tailored to your needs</p>
            </div>
            
            <div className={styles.infoCard}>
              <BarChart3 size={24} />
              <h5>Data Visualization</h5>
              <p>Charts, graphs, and interactive dashboards</p>
            </div>
            
            <div className={styles.infoCard}>
              <FileText size={24} />
              <h5>Export Options</h5>
              <p>Multiple formats: PDF, Excel, CSV</p>
            </div>
            
            <div className={styles.infoCard}>
              <Calendar size={24} />
              <h5>Scheduled Reports</h5>
              <p>Automated report delivery and sharing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PropertyManagementSection;
