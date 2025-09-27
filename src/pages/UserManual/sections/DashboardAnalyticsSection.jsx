import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Home, 
  DollarSign, 
  Calendar, 
  Target, 
  PieChart,
  LineChart,
  Activity,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  Award,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Lock,
  Unlock,
  Archive,
  BarChart,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  ScatterChart,
  AreaChart,
  Gauge,
  Thermometer,
  Zap,
  Target as TargetIcon,
  Flag,
  CalendarDays,
  Clock as ClockIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Minus,
  Equal,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  Share2,
  Printer,
  FileText,
  Database,
  Server,
  Cloud,
  Shield,
  Key,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus
} from 'lucide-react';
import styles from './DashboardAnalyticsSection.module.css';

const DashboardAnalyticsSection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'metrics', label: 'Key Metrics', icon: TrendingUp },
    { id: 'charts', label: 'Charts & Graphs', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'alerts', label: 'Alerts & Notifications', icon: AlertTriangle },
    { id: 'customization', label: 'Customization', icon: Settings },
    { id: 'integration', label: 'Integration', icon: Database }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'metrics':
        return <MetricsTab />;
      case 'charts':
        return <ChartsTab />;
      case 'reports':
        return <ReportsTab />;
      case 'alerts':
        return <AlertsTab />;
      case 'customization':
        return <CustomizationTab />;
      case 'integration':
        return <IntegrationTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={styles.dashboardAnalyticsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <BarChart3 size={24} />
        </div>
        <div className={styles.headerContent}>
          <h3>Dashboard & Analytics</h3>
          <p>Comprehensive insights and analytics to monitor performance, track KPIs, and make data-driven decisions</p>
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
          <BarChart3 size={24} />
        </div>
        <h4>Real-time Analytics</h4>
        <p>Live dashboard with real-time data updates and performance monitoring</p>
        <div className={styles.cardFeatures}>
          <span>Live Updates</span>
          <span>Performance Tracking</span>
          <span>Instant Insights</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <TrendingUp size={24} />
        </div>
        <h4>Performance Metrics</h4>
        <p>Track key performance indicators and business metrics across all operations</p>
        <div className={styles.cardFeatures}>
          <span>KPI Tracking</span>
          <span>Trend Analysis</span>
          <span>Goal Setting</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Users size={24} />
        </div>
        <h4>User Analytics</h4>
        <p>Monitor user behavior, engagement patterns, and system usage statistics</p>
        <div className={styles.cardFeatures}>
          <span>User Behavior</span>
          <span>Engagement Metrics</span>
          <span>Usage Statistics</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Home size={24} />
        </div>
        <h4>Property Insights</h4>
        <p>Comprehensive property performance data and market analysis</p>
        <div className={styles.cardFeatures}>
          <span>Market Analysis</span>
          <span>Performance Data</span>
          <span>Trend Insights</span>
        </div>
      </div>
    </div>

    <div className={styles.dashboardFeatures}>
      <h4>Dashboard Features</h4>
      <div className={styles.featureGrid}>
        <div className={styles.featureItem}>
          <Activity size={20} />
          <span>Real-time Monitoring</span>
        </div>
        <div className={styles.featureItem}>
          <RefreshCw size={20} />
          <span>Auto-refresh</span>
        </div>
        <div className={styles.featureItem}>
          <Download size={20} />
          <span>Export Options</span>
        </div>
        <div className={styles.featureItem}>
          <Eye size={20} />
          <span>Drill-down Views</span>
        </div>
        <div className={styles.featureItem}>
          <Filter size={20} />
          <span>Advanced Filtering</span>
        </div>
        <div className={styles.featureItem}>
          <Settings size={20} />
          <span>Customizable Layouts</span>
        </div>
      </div>
    </div>
  </div>
);

// Metrics Tab
const MetricsTab = () => (
  <div className={styles.metricsTab}>
    <div className={styles.metricsOverview}>
      <h4>Key Performance Indicators</h4>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon}>
              <Home size={24} />
            </div>
            <div className={styles.metricTrend}>
              <TrendingUp size={16} />
              <span>+12.5%</span>
            </div>
          </div>
          <div className={styles.metricValue}>2,847</div>
          <div className={styles.metricLabel}>Total Properties</div>
          <div className={styles.metricDescription}>Active listings in the system</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon}>
              <Users size={24} />
            </div>
            <div className={styles.metricTrend}>
              <TrendingUp size={16} />
              <span>+8.3%</span>
            </div>
          </div>
          <div className={styles.metricValue}>1,234</div>
          <div className={styles.metricLabel}>Active Leads</div>
          <div className={styles.metricDescription}>Qualified leads in pipeline</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon}>
              <DollarSign size={24} />
            </div>
            <div className={styles.metricTrend}>
              <TrendingUp size={16} />
              <span>+15.2%</span>
            </div>
          </div>
          <div className={styles.metricValue}>$2.4M</div>
          <div className={styles.metricLabel}>Monthly Revenue</div>
          <div className={styles.metricDescription}>Total revenue this month</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon}>
              <Target size={24} />
            </div>
            <div className={styles.metricTrend}>
              <TrendingDown size={16} />
              <span>-2.1%</span>
            </div>
          </div>
          <div className={styles.metricValue}>87.3%</div>
          <div className={styles.metricLabel}>Conversion Rate</div>
          <div className={styles.metricDescription}>Lead to customer conversion</div>
        </div>
      </div>
    </div>

    <div className={styles.metricCategories}>
      <h4>Metric Categories</h4>
      <div className={styles.categoryGrid}>
        <div className={styles.category}>
          <h5>Sales Metrics</h5>
          <ul>
            <li>Revenue Growth</li>
            <li>Sales Volume</li>
            <li>Average Deal Size</li>
            <li>Sales Cycle Length</li>
          </ul>
        </div>
        <div className={styles.category}>
          <h5>Marketing Metrics</h5>
          <ul>
            <li>Lead Generation</li>
            <li>Conversion Rates</li>
            <li>Cost per Lead</li>
            <li>ROI by Channel</li>
          </ul>
        </div>
        <div className={styles.category}>
          <h5>Operational Metrics</h5>
          <ul>
            <li>Response Time</li>
            <li>Task Completion</li>
            <li>User Productivity</li>
            <li>System Uptime</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Charts Tab
const ChartsTab = () => (
  <div className={styles.chartsTab}>
    <div className={styles.chartTypes}>
      <h4>Chart Types & Visualizations</h4>
      <div className={styles.chartGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <BarChart size={24} />
            <h5>Bar Charts</h5>
          </div>
          <p>Compare values across categories and track performance over time</p>
          <div className={styles.chartFeatures}>
            <span>Category Comparison</span>
            <span>Time Series</span>
            <span>Stacked Bars</span>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <LineChart size={24} />
            <h5>Line Charts</h5>
          </div>
          <p>Show trends and patterns over time with smooth data visualization</p>
          <div className={styles.chartFeatures}>
            <span>Trend Analysis</span>
            <span>Multiple Series</span>
            <span>Forecasting</span>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <PieChartIcon size={24} />
            <h5>Pie Charts</h5>
          </div>
          <p>Display proportions and percentages in an easy-to-understand format</p>
          <div className={styles.chartFeatures}>
            <span>Proportion Display</span>
            <span>Percentage View</span>
            <span>Segment Analysis</span>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <AreaChart size={24} />
            <h5>Area Charts</h5>
          </div>
          <p>Show cumulative data and volume trends with filled areas</p>
          <div className={styles.chartFeatures}>
            <span>Cumulative Data</span>
            <span>Volume Trends</span>
            <span>Overlap Analysis</span>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <ScatterChart size={24} />
            <h5>Scatter Plots</h5>
          </div>
          <p>Identify correlations and relationships between two variables</p>
          <div className={styles.chartFeatures}>
            <span>Correlation Analysis</span>
            <span>Outlier Detection</span>
            <span>Pattern Recognition</span>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <Gauge size={24} />
            <h5>Gauge Charts</h5>
          </div>
          <p>Display progress towards goals and performance thresholds</p>
          <div className={styles.chartFeatures}>
            <span>Goal Tracking</span>
            <span>Performance Metrics</span>
            <span>Threshold Alerts</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.chartCustomization}>
      <h4>Chart Customization</h4>
      <div className={styles.customizationGrid}>
        <div className={styles.customizationCard}>
          <h5>Visual Options</h5>
          <ul>
            <li>Color Schemes</li>
            <li>Chart Styles</li>
            <li>Axis Configuration</li>
            <li>Legend Positioning</li>
          </ul>
        </div>
        <div className={styles.customizationCard}>
          <h5>Interactive Features</h5>
          <ul>
            <li>Tooltips</li>
            <li>Zoom & Pan</li>
            <li>Drill-down</li>
            <li>Data Selection</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Reports Tab
const ReportsTab = () => (
  <div className={styles.reportsTab}>
    <div className={styles.reportTypes}>
      <h4>Report Types</h4>
      <div className={styles.reportGrid}>
        <div className={styles.reportItem}>
          <div className={styles.reportIcon}>
            <BarChart3 size={24} />
          </div>
          <h5>Performance Reports</h5>
          <p>Comprehensive analysis of business performance and key metrics</p>
          <div className={styles.reportFeatures}>
            <span>KPI Analysis</span>
            <span>Trend Reports</span>
            <span>Comparative Data</span>
          </div>
        </div>

        <div className={styles.reportItem}>
          <div className={styles.reportIcon}>
            <Users size={24} />
          </div>
          <h5>User Activity Reports</h5>
          <p>Track user engagement, system usage, and productivity metrics</p>
          <div className={styles.reportFeatures}>
            <span>User Engagement</span>
            <span>System Usage</span>
            <span>Productivity Metrics</span>
          </div>
        </div>

        <div className={styles.reportItem}>
          <div className={styles.reportIcon}>
            <Home size={24} />
          </div>
          <h5>Property Reports</h5>
          <p>Detailed property performance, market analysis, and inventory reports</p>
          <div className={styles.reportFeatures}>
            <span>Performance Analysis</span>
            <span>Market Trends</span>
            <span>Inventory Status</span>
          </div>
        </div>

        <div className={styles.reportItem}>
          <div className={styles.reportIcon}>
            <DollarSign size={24} />
          </div>
          <h5>Financial Reports</h5>
          <p>Revenue analysis, cost tracking, and financial performance insights</p>
          <div className={styles.reportFeatures}>
            <span>Revenue Analysis</span>
            <span>Cost Tracking</span>
            <span>Profit Margins</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.reportScheduling}>
      <h4>Report Scheduling & Delivery</h4>
      <div className={styles.schedulingGrid}>
        <div className={styles.schedulingCard}>
          <h5>Automated Reports</h5>
          <p>Schedule reports to be generated and delivered automatically</p>
          <div className={styles.schedulingFeatures}>
            <span>Daily Reports</span>
            <span>Weekly Summaries</span>
            <span>Monthly Analytics</span>
            <span>Quarterly Reviews</span>
          </div>
        </div>
        <div className={styles.schedulingCard}>
          <h5>Delivery Options</h5>
          <p>Multiple delivery methods for report distribution</p>
          <div className={styles.deliveryFeatures}>
            <span>Email Delivery</span>
            <span>PDF Export</span>
            <span>Dashboard Access</span>
            <span>Mobile Notifications</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Alerts Tab
const AlertsTab = () => (
  <div className={styles.alertsTab}>
    <div className={styles.alertTypes}>
      <h4>Alert Types & Triggers</h4>
      <div className={styles.alertGrid}>
        <div className={styles.alertCard}>
          <div className={styles.alertIcon}>
            <AlertTriangle size={24} />
          </div>
          <h5>Performance Alerts</h5>
          <p>Notifications when KPIs fall below or exceed target thresholds</p>
          <div className={styles.alertTriggers}>
            <span>KPI Thresholds</span>
            <span>Goal Milestones</span>
            <span>Performance Drops</span>
          </div>
        </div>

        <div className={styles.alertCard}>
          <div className={styles.alertIcon}>
            <Clock size={24} />
          </div>
          <h5>Time-based Alerts</h5>
          <p>Reminders for deadlines, scheduled tasks, and time-sensitive activities</p>
          <div className={styles.alertTriggers}>
            <span>Deadlines</span>
            <span>Task Reminders</span>
            <span>Follow-up Calls</span>
          </div>
        </div>

        <div className={styles.alertCard}>
          <div className={styles.alertIcon}>
            <TrendingDown size={24} />
          </div>
          <h5>Trend Alerts</h5>
          <p>Warnings about negative trends or declining performance indicators</p>
          <div className={styles.alertTriggers}>
            <span>Declining Metrics</span>
            <span>Negative Trends</span>
            <span>Risk Indicators</span>
          </div>
        </div>

        <div className={styles.alertCard}>
          <div className={styles.alertIcon}>
            <CheckCircle size={24} />
          </div>
          <h5>Success Alerts</h5>
          <p>Celebrations and notifications for achievements and positive milestones</p>
          <div className={styles.alertTriggers}>
            <span>Goal Achievement</span>
            <span>Record Breaking</span>
            <span>Positive Trends</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.alertConfiguration}>
      <h4>Alert Configuration</h4>
      <div className={styles.configurationGrid}>
        <div className={styles.configurationCard}>
          <h5>Notification Settings</h5>
          <ul>
            <li>Email Notifications</li>
            <li>SMS Alerts</li>
            <li>Push Notifications</li>
            <li>Dashboard Banners</li>
          </ul>
        </div>
        <div className={styles.configurationCard}>
          <h5>Alert Frequency</h5>
          <ul>
            <li>Immediate Alerts</li>
            <li>Daily Summaries</li>
            <li>Weekly Reports</li>
            <li>Custom Schedules</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Customization Tab
const CustomizationTab = () => (
  <div className={styles.customizationTab}>
    <div className={styles.dashboardCustomization}>
      <h4>Dashboard Customization</h4>
      <div className={styles.customizationGrid}>
        <div className={styles.customizationCard}>
          <h5>Layout Options</h5>
          <p>Customize dashboard layout and widget positioning</p>
          <div className={styles.layoutFeatures}>
            <span>Drag & Drop</span>
            <span>Grid Layouts</span>
            <span>Responsive Design</span>
            <span>Custom Themes</span>
          </div>
        </div>

        <div className={styles.customizationCard}>
          <h5>Widget Library</h5>
          <p>Choose from various widget types and customize their appearance</p>
          <div className={styles.widgetFeatures}>
            <span>Metric Widgets</span>
            <span>Chart Widgets</span>
            <span>Table Widgets</span>
            <span>Custom Widgets</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.userPreferences}>
      <h4>User Preferences</h4>
      <div className={styles.preferencesGrid}>
        <div className={styles.preferenceCard}>
          <h5>Personalization</h5>
          <ul>
            <li>Default Dashboard</li>
            <li>Favorite Reports</li>
            <li>Custom Filters</li>
            <li>Saved Views</li>
          </ul>
        </div>
        <div className={styles.preferenceCard}>
          <h5>Display Options</h5>
          <ul>
            <li>Theme Selection</li>
            <li>Language Settings</li>
            <li>Time Zone</li>
            <li>Date Format</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Integration Tab
const IntegrationTab = () => (
  <div className={styles.integrationTab}>
    <div className={styles.dataSources}>
      <h4>Data Sources & Integration</h4>
      <div className={styles.integrationGrid}>
        <div className={styles.integrationCard}>
          <div className={styles.integrationIcon}>
            <Database size={24} />
          </div>
          <h5>Internal Systems</h5>
          <p>Connect with internal CRM, ERP, and business systems</p>
          <div className={styles.integrationFeatures}>
            <span>CRM Integration</span>
            <span>ERP Systems</span>
            <span>Accounting Software</span>
            <span>HR Systems</span>
          </div>
        </div>

        <div className={styles.integrationCard}>
          <div className={styles.integrationIcon}>
            <Cloud size={24} />
          </div>
          <h5>External APIs</h5>
          <p>Integrate with third-party services and external data sources</p>
          <div className={styles.integrationFeatures}>
            <span>Market Data APIs</span>
            <span>Social Media</span>
            <span>Email Services</span>
            <span>Payment Gateways</span>
          </div>
        </div>

        <div className={styles.integrationCard}>
          <div className={styles.integrationIcon}>
            <Server size={24} />
          </div>
          <h5>Data Warehouses</h5>
          <p>Connect to data warehouses and business intelligence platforms</p>
          <div className={styles.integrationFeatures}>
            <span>SQL Databases</span>
            <span>NoSQL Databases</span>
            <span>Data Lakes</span>
            <span>BI Platforms</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.integrationFeatures}>
      <h4>Integration Features</h4>
      <div className={styles.featureList}>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Real-time Sync</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Data Validation</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Error Handling</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Security Protocols</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Backup & Recovery</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Performance Monitoring</span>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardAnalyticsSection;
