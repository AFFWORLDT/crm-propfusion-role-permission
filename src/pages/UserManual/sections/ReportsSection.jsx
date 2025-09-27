import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, FileText, Download, Filter, Calendar, Users, DollarSign, Home, Eye, Share2, RefreshCw, Settings } from 'lucide-react';
import styles from './ReportsSection.module.css';

const ReportsSection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={20} /> },
    { id: 'sales', label: 'Sales Reports', icon: <TrendingUp size={20} /> },
    { id: 'rental', label: 'Rental Reports', icon: <Home size={20} /> },
    { id: 'leads', label: 'Lead Reports', icon: <Users size={20} /> },
    { id: 'performance', label: 'Performance', icon: <PieChart size={20} /> },
    { id: 'custom', label: 'Custom Reports', icon: <FileText size={20} /> },
    { id: 'scheduling', label: 'Scheduling', icon: <Calendar size={20} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'sales':
        return <SalesTab />;
      case 'rental':
        return <RentalTab />;
      case 'leads':
        return <LeadsTab />;
      case 'performance':
        return <PerformanceTab />;
      case 'custom':
        return <CustomTab />;
      case 'scheduling':
        return <SchedulingTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={styles.reportsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <BarChart3 size={32} />
        </div>
        <div className={styles.headerContent}>
          <h2>Reports & Analytics</h2>
          <p>Comprehensive business intelligence, data analysis, and reporting tools for informed decision-making.</p>
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
          <TrendingUp size={32} />
        </div>
        <h3>Sales Analytics</h3>
        <p>Track sales performance and revenue trends</p>
        <div className={styles.cardFeatures}>
          <span>Revenue Tracking</span>
          <span>Conversion Rates</span>
          <span>Market Trends</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Home size={32} />
        </div>
        <h3>Property Insights</h3>
        <p>Analyze property performance and market data</p>
        <div className={styles.cardFeatures}>
          <span>Market Analysis</span>
          <span>Property ROI</span>
          <span>Inventory Status</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Users size={32} />
        </div>
        <h3>Lead Intelligence</h3>
        <p>Monitor lead generation and conversion metrics</p>
        <div className={styles.cardFeatures}>
          <span>Lead Sources</span>
          <span>Conversion Funnel</span>
          <span>Customer Journey</span>
        </div>
      </div>
    </div>

    <div className={styles.reportFeatures}>
      <h3>Reporting Capabilities</h3>
      <div className={styles.featuresGrid}>
        <div className={styles.featureItem}>
          <BarChart3 size={20} />
          <span>Real-time data visualization</span>
        </div>
        <div className={styles.featureItem}>
          <Download size={20} />
          <span>Export to multiple formats (PDF, Excel, CSV)</span>
        </div>
        <div className={styles.featureItem}>
          <Filter size={20} />
          <span>Advanced filtering and segmentation</span>
        </div>
        <div className={styles.featureItem}>
          <Calendar size={20} />
          <span>Scheduled report delivery</span>
        </div>
        <div className={styles.featureItem}>
          <Share2 size={20} />
          <span>Share reports with stakeholders</span>
        </div>
        <div className={styles.featureItem}>
          <Settings size={20} />
          <span>Customizable dashboards and widgets</span>
        </div>
      </div>
    </div>

    <div className={styles.quickStats}>
      <h3>Quick Statistics</h3>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>$2.4M</div>
            <div className={styles.statLabel}>Total Revenue (This Month)</div>
            <div className={styles.statChange}>+12.5% vs Last Month</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Home size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>156</div>
            <div className={styles.statLabel}>Properties Sold (This Month)</div>
            <div className={styles.statChange}>+8.3% vs Last Month</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>89</div>
            <div className={styles.statLabel}>New Leads (This Week)</div>
            <div className={styles.statChange}>-2.1% vs Last Week</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statNumber}>23.4%</div>
            <div className={styles.statLabel}>Conversion Rate</div>
            <div className={styles.statChange}>+1.2% vs Last Month</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SalesTab = () => (
  <div className={styles.salesTab}>
    <div className={styles.salesOverview}>
      <h3>Sales Performance Reports</h3>
      <p>Comprehensive analysis of sales activities, revenue trends, and market performance</p>
    </div>

    <div className={styles.reportFilters}>
      <h4>Report Filters</h4>
      <div className={styles.filterGrid}>
        <div className={styles.filterGroup}>
          <label>Date Range</label>
          <select defaultValue="this-month">
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-quarter">This Quarter</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Property Type</label>
          <select defaultValue="all">
            <option value="all">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="townhouse">Townhouse</option>
            <option value="penthouse">Penthouse</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Agent</label>
          <select defaultValue="all">
            <option value="all">All Agents</option>
            <option value="agent1">John Doe</option>
            <option value="agent2">Jane Smith</option>
            <option value="agent3">Mike Johnson</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Location</label>
          <select defaultValue="all">
            <option value="all">All Locations</option>
            <option value="dubai">Dubai</option>
            <option value="abu-dhabi">Abu Dhabi</option>
            <option value="sharjah">Sharjah</option>
          </select>
        </div>
      </div>
    </div>

    <div className={styles.salesMetrics}>
      <h4>Key Sales Metrics</h4>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h5>Revenue Overview</h5>
          <div className={styles.metricValue}>$2,456,789</div>
          <div className={styles.metricLabel}>Total Revenue</div>
          <div className={styles.metricChange}>+15.3% vs Previous Period</div>
        </div>

        <div className={styles.metricCard}>
          <h5>Units Sold</h5>
          <div className={styles.metricValue}>156</div>
          <div className={styles.metricLabel}>Properties Sold</div>
          <div className={styles.metricChange}>+12.8% vs Previous Period</div>
        </div>

        <div className={styles.metricCard}>
          <h5>Average Price</h5>
          <div className={styles.metricValue}>$15,748</div>
          <div className={styles.metricLabel}>Per Property</div>
          <div className={styles.metricChange}>+2.1% vs Previous Period</div>
        </div>

        <div className={styles.metricCard}>
          <h5>Sales Cycle</h5>
          <div className={styles.metricValue}>45 days</div>
          <div className={styles.metricLabel}>Average Time to Close</div>
          <div className={styles.metricChange}>+3.2 days vs Previous Period</div>
        </div>
      </div>
    </div>

    <div className={styles.salesBreakdown}>
      <h4>Sales Breakdown</h4>
      <div className={styles.breakdownGrid}>
        <div className={styles.breakdownCard}>
          <h5>By Property Type</h5>
          <div className={styles.chartPlaceholder}>
            <PieChart size={48} />
            <span>Pie Chart Visualization</span>
          </div>
          <div className={styles.breakdownList}>
            <div className={styles.breakdownItem}>
              <span>Apartments</span>
              <span>45% (70 units)</span>
            </div>
            <div className={styles.breakdownItem}>
              <span>Villas</span>
              <span>32% (50 units)</span>
            </div>
            <div className={styles.breakdownItem}>
              <span>Townhouses</span>
              <span>18% (28 units)</span>
            </div>
            <div className={styles.breakdownItem}>
              <span>Penthouses</span>
              <span>5% (8 units)</span>
            </div>
          </div>
        </div>

        <div className={styles.breakdownCard}>
          <h5>By Location</h5>
          <div className={styles.chartPlaceholder}>
            <BarChart3 size={48} />
            <span>Bar Chart Visualization</span>
          </div>
          <div className={styles.breakdownList}>
            <div className={styles.breakdownItem}>
              <span>Dubai</span>
              <span>58% ($1.42M)</span>
            </div>
            <div className={styles.breakdownItem}>
              <span>Abu Dhabi</span>
              <span>28% ($0.69M)</span>
            </div>
            <div className={styles.breakdownItem}>
              <span>Sharjah</span>
              <span>14% ($0.34M)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.reportActions}>
      <button className={styles.generateBtn}>
        <RefreshCw size={16} />
        Generate Report
      </button>
      <button className={styles.exportBtn}>
        <Download size={16} />
        Export to Excel
      </button>
      <button className={styles.shareBtn}>
        <Share2 size={16} />
        Share Report
      </button>
    </div>
  </div>
);

const RentalTab = () => (
  <div className={styles.rentalTab}>
    <div className={styles.rentalOverview}>
      <h3>Rental Performance Reports</h3>
      <p>Analyze rental income, occupancy rates, and property performance metrics</p>
    </div>

    <div className={styles.rentalMetrics}>
      <h4>Rental Key Metrics</h4>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h5>Monthly Rental Income</h5>
          <div className={styles.metricValue}>$456,789</div>
          <div className={styles.metricLabel}>Total Monthly Revenue</div>
          <div className={styles.metricChange}>+8.7% vs Last Month</div>
        </div>

        <div className={styles.metricCard}>
          <h5>Occupancy Rate</h5>
          <div className={styles.metricValue}>94.2%</div>
          <div className={styles.metricLabel}>Current Occupancy</div>
          <div className={styles.metricChange}>+2.1% vs Last Month</div>
        </div>

        <div className={styles.metricCard}>
          <h5>Average Rent</h5>
          <div className={styles.metricValue}>$3,245</div>
          <div className={styles.metricLabel}>Per Property</div>
          <div className={styles.metricChange}>+5.3% vs Last Month</div>
        </div>

        <div className={styles.metricCard}>
          <h5>Vacancy Rate</h5>
          <div className={styles.metricValue}>5.8%</div>
          <div className={styles.metricLabel}>Current Vacancy</div>
          <div className={styles.metricChange}>-2.1% vs Last Month</div>
        </div>
      </div>
    </div>

    <div className={styles.rentalAnalysis}>
      <h4>Rental Analysis</h4>
      <div className={styles.analysisGrid}>
        <div className={styles.analysisCard}>
          <h5>Top Performing Areas</h5>
          <div className={styles.performanceList}>
            <div className={styles.performanceItem}>
              <span className={styles.areaName}>Dubai Marina</span>
              <span className={styles.areaStats}>98.5% occupancy, $4,200 avg rent</span>
            </div>
            <div className={styles.performanceItem}>
              <span className={styles.areaName}>Palm Jumeirah</span>
              <span className={styles.areaStats}>96.2% occupancy, $5,800 avg rent</span>
            </div>
            <div className={styles.performanceItem}>
              <span className={styles.areaName}>Downtown Dubai</span>
              <span className={styles.areaStats}>94.8% occupancy, $3,900 avg rent</span>
            </div>
          </div>
        </div>

        <div className={styles.analysisCard}>
          <h5>Rental Trends</h5>
          <div className={styles.trendList}>
            <div className={styles.trendItem}>
              <span className={styles.trendLabel}>Studio Apartments</span>
              <span className={styles.trendValue}>+12.3%</span>
            </div>
            <div className={styles.trendItem}>
              <span className={styles.trendLabel}>1-Bedroom</span>
              <span className={styles.trendValue}>+8.7%</span>
            </div>
            <div className={styles.trendItem}>
              <span className={styles.trendLabel}>2-Bedroom</span>
              <span className={styles.trendValue}>+6.2%</span>
            </div>
            <div className={styles.trendItem}>
              <span className={styles.trendLabel}>3+ Bedroom</span>
              <span className={styles.trendValue}>-1.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LeadsTab = () => (
  <div className={styles.leadsTab}>
    <div className={styles.leadsOverview}>
      <h3>Lead Generation & Conversion Reports</h3>
      <p>Track lead sources, conversion rates, and sales funnel performance</p>
    </div>

    <div className={styles.leadMetrics}>
      <h4>Lead Performance Metrics</h4>
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h5>Total Leads</h5>
          <div className={styles.metricValue}>1,234</div>
          <div className={styles.metricLabel}>This Month</div>
          <div className={styles.metricChange}>+18.5% vs Last Month</div>
        </div>

        <div className={styles.metricCard}>
          <h5>Conversion Rate</h5>
          <div className={styles.metricValue}>23.4%</div>
          <div className={styles.metricLabel}>Lead to Sale</div>
          <div className={styles.metricChange}>+2.1% vs Last Month</div>
        </div>

        <div className={styles.metricCard}>
          <h5>Response Time</h5>
          <div className={styles.metricValue}>2.3 hours</div>
          <div className={styles.metricLabel}>Average Response</div>
          <div className={styles.metricChange}>+0.4 hours vs Last Month</div>
        </div>

        <div className={styles.metricCard}>
          <h5>Lead Quality Score</h5>
          <div className={styles.metricValue}>7.8/10</div>
          <div className={styles.metricLabel}>Average Score</div>
          <div className={styles.metricChange}>+0.3 vs Last Month</div>
        </div>
      </div>
    </div>

    <div className={styles.leadSources}>
      <h4>Lead Sources Analysis</h4>
      <div className={styles.sourcesGrid}>
        <div className={styles.sourceCard}>
          <h5>Website & Online</h5>
          <div className={styles.sourceStats}>
            <div className={styles.sourceMetric}>
              <span>Leads Generated</span>
              <span>456 (37%)</span>
            </div>
            <div className={styles.sourceMetric}>
              <span>Conversion Rate</span>
              <span>28.5%</span>
            </div>
            <div className={styles.sourceMetric}>
              <span>Quality Score</span>
              <span>8.2/10</span>
            </div>
          </div>
        </div>

        <div className={styles.sourceCard}>
          <h5>Referrals</h5>
          <div className={styles.sourceStats}>
            <div className={styles.sourceMetric}>
              <span>Leads Generated</span>
              <span>234 (19%)</span>
            </div>
            <div className={styles.sourceMetric}>
              <span>Conversion Rate</span>
              <span>35.2%</span>
            </div>
            <div className={styles.sourceMetric}>
              <span>Quality Score</span>
              <span>8.7/10</span>
            </div>
          </div>
        </div>

        <div className={styles.sourceCard}>
          <h5>Social Media</h5>
          <div className={styles.sourceStats}>
            <div className={styles.sourceMetric}>
              <span>Leads Generated</span>
              <span>189 (15%)</span>
            </div>
            <div className={styles.sourceMetric}>
              <span>Conversion Rate</span>
              <span>18.9%</span>
            </div>
            <div className={styles.sourceMetric}>
              <span>Quality Score</span>
              <span>6.8/10</span>
            </div>
          </div>
        </div>

        <div className={styles.sourceCard}>
          <h5>Other Sources</h5>
          <div className={styles.sourceStats}>
            <div className={styles.sourceMetric}>
              <span>Leads Generated</span>
              <span>355 (29%)</span>
            </div>
            <div className={styles.sourceMetric}>
              <span>Conversion Rate</span>
              <span>22.1%</span>
            </div>
            <div className={styles.sourceMetric}>
              <span>Quality Score</span>
              <span>7.1/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PerformanceTab = () => (
  <div className={styles.performanceTab}>
    <div className={styles.performanceOverview}>
      <h3>Team & Agent Performance</h3>
      <p>Monitor individual and team performance metrics, productivity, and achievements</p>
    </div>

    <div className={styles.agentPerformance}>
      <h4>Top Performing Agents</h4>
      <div className={styles.agentGrid}>
        <div className={styles.agentCard}>
          <div className={styles.agentRank}>1st</div>
          <div className={styles.agentInfo}>
            <div className={styles.agentName}>Sarah Johnson</div>
            <div className={styles.agentRole}>Senior Agent</div>
          </div>
          <div className={styles.agentStats}>
            <div className={styles.statItem}>
              <span>Properties Sold</span>
              <span>24</span>
            </div>
            <div className={styles.statItem}>
              <span>Revenue Generated</span>
              <span>$456,789</span>
            </div>
            <div className={styles.statItem}>
              <span>Conversion Rate</span>
              <span>31.2%</span>
            </div>
          </div>
        </div>

        <div className={styles.agentCard}>
          <div className={styles.agentRank}>2nd</div>
          <div className={styles.agentInfo}>
            <div className={styles.agentName}>Michael Chen</div>
            <div className={styles.agentRole}>Agent</div>
          </div>
          <div className={styles.agentStats}>
            <div className={styles.statItem}>
              <span>Properties Sold</span>
              <span>19</span>
            </div>
            <div className={styles.statItem}>
              <span>Revenue Generated</span>
              <span>$389,456</span>
            </div>
            <div className={styles.statItem}>
              <span>Conversion Rate</span>
              <span>28.7%</span>
            </div>
          </div>
        </div>

        <div className={styles.agentCard}>
          <div className={styles.agentRank}>3rd</div>
          <div className={styles.agentInfo}>
            <div className={styles.agentName}>Emily Rodriguez</div>
            <div className={styles.agentRole}>Agent</div>
          </div>
          <div className={styles.agentStats}>
            <div className={styles.statItem}>
              <span>Properties Sold</span>
              <span>17</span>
            </div>
            <div className={styles.statItem}>
              <span>Revenue Generated</span>
              <span>$342,123</span>
            </div>
            <div className={styles.statItem}>
              <span>Conversion Rate</span>
              <span>26.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.teamMetrics}>
      <h4>Team Performance Metrics</h4>
      <div className={styles.teamGrid}>
        <div className={styles.teamCard}>
          <h5>Overall Team Performance</h5>
          <div className={styles.teamStats}>
            <div className={styles.teamMetric}>
              <span>Total Sales</span>
              <span>156 properties</span>
            </div>
            <div className={styles.teamMetric}>
              <span>Team Revenue</span>
              <span>$2.4M</span>
            </div>
            <div className={styles.teamMetric}>
              <span>Average Conversion</span>
              <span>23.4%</span>
            </div>
            <div className={styles.teamMetric}>
              <span>Response Time</span>
              <span>2.3 hours</span>
            </div>
          </div>
        </div>

        <div className={styles.teamCard}>
          <h5>Performance Trends</h5>
          <div className={styles.trendChart}>
            <div className={styles.chartPlaceholder}>
              <TrendingUp size={48} />
              <span>Performance Trend Chart</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CustomTab = () => (
  <div className={styles.customTab}>
    <div className={styles.customOverview}>
      <h3>Custom Report Builder</h3>
      <p>Create personalized reports with custom metrics, filters, and visualizations</p>
    </div>

    <div className={styles.reportBuilder}>
      <h4>Build Your Report</h4>
      <div className={styles.builderGrid}>
        <div className={styles.builderSection}>
          <h5>Select Data Source</h5>
          <div className={styles.dataSourceOptions}>
            <label>
              <input type="radio" name="dataSource" value="properties" defaultChecked />
              <span>Properties Database</span>
            </label>
            <label>
              <input type="radio" name="dataSource" value="leads" />
              <span>Leads & Contacts</span>
            </label>
            <label>
              <input type="radio" name="dataSource" value="transactions" />
              <span>Sales Transactions</span>
            </label>
            <label>
              <input type="radio" name="dataSource" value="agents" />
              <span>Agent Performance</span>
            </label>
          </div>
        </div>

        <div className={styles.builderSection}>
          <h5>Choose Metrics</h5>
          <div className={styles.metricsOptions}>
            <label>
              <input type="checkbox" value="revenue" defaultChecked />
              <span>Revenue</span>
            </label>
            <label>
              <input type="checkbox" value="units" defaultChecked />
              <span>Units Sold</span>
            </label>
            <label>
              <input type="checkbox" value="conversion" />
              <span>Conversion Rate</span>
            </label>
            <label>
              <input type="checkbox" value="response" />
              <span>Response Time</span>
            </label>
            <label>
              <input type="checkbox" value="quality" />
              <span>Lead Quality</span>
            </label>
          </div>
        </div>

        <div className={styles.builderSection}>
          <h5>Set Time Period</h5>
          <div className={styles.timeOptions}>
            <label>
              <input type="radio" name="timePeriod" value="custom" defaultChecked />
              <span>Custom Range</span>
            </label>
            <label>
              <input type="radio" name="timePeriod" value="monthly" />
              <span>Monthly</span>
            </label>
            <label>
              <input type="radio" name="timePeriod" value="quarterly" />
              <span>Quarterly</span>
            </label>
            <label>
              <input type="radio" name="timePeriod" value="yearly" />
              <span>Yearly</span>
            </label>
          </div>
        </div>

        <div className={styles.builderSection}>
          <h5>Visualization Type</h5>
          <div className={styles.visualizationOptions}>
            <label>
              <input type="radio" name="visualization" value="chart" defaultChecked />
              <span>Chart</span>
            </label>
            <label>
              <input type="radio" name="visualization" value="table" />
              <span>Table</span>
            </label>
            <label>
              <input type="radio" name="visualization" value="dashboard" />
              <span>Dashboard</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.customActions}>
      <button className={styles.previewBtn}>
        <Eye size={16} />
        Preview Report
      </button>
      <button className={styles.generateBtn}>
        <RefreshCw size={16} />
        Generate Report
      </button>
      <button className={styles.saveBtn}>
        <Download size={16} />
        Save Template
      </button>
    </div>
  </div>
);

const SchedulingTab = () => (
  <div className={styles.schedulingTab}>
    <div className={styles.schedulingOverview}>
      <h3>Report Scheduling & Automation</h3>
      <p>Set up automated report generation and delivery to stakeholders</p>
    </div>

    <div className={styles.scheduledReports}>
      <h4>Currently Scheduled Reports</h4>
      <div className={styles.scheduleGrid}>
        <div className={styles.scheduleCard}>
          <div className={styles.scheduleHeader}>
            <h5>Weekly Sales Summary</h5>
            <span className={styles.scheduleStatus}>Active</span>
          </div>
          <div className={styles.scheduleDetails}>
            <div className={styles.scheduleDetail}>
              <span>Frequency:</span>
              <span>Every Monday at 9:00 AM</span>
            </div>
            <div className={styles.scheduleDetail}>
              <span>Recipients:</span>
              <span>Management Team (5 people)</span>
            </div>
            <div className={styles.scheduleDetail}>
              <span>Format:</span>
              <span>PDF Report</span>
            </div>
            <div className={styles.scheduleDetail}>
              <span>Last Sent:</span>
              <span>Today, 9:00 AM</span>
            </div>
          </div>
          <div className={styles.scheduleActions}>
            <button className={styles.editBtn}>Edit</button>
            <button className={styles.pauseBtn}>Pause</button>
            <button className={styles.deleteBtn}>Delete</button>
          </div>
        </div>

        <div className={styles.scheduleCard}>
          <div className={styles.scheduleHeader}>
            <h5>Monthly Performance Review</h5>
            <span className={styles.scheduleStatus}>Active</span>
          </div>
          <div className={styles.scheduleDetails}>
            <div className={styles.scheduleDetail}>
              <span>Frequency:</span>
              <span>1st of every month at 8:00 AM</span>
            </div>
            <div className={styles.scheduleDetail}>
              <span>Recipients:</span>
              <span>All Agents (24 people)</span>
            </div>
            <div className={styles.scheduleDetail}>
              <span>Format:</span>
              <span>Excel Spreadsheet</span>
            </div>
            <div className={styles.scheduleDetail}>
              <span>Last Sent:</span>
              <span>December 1st, 8:00 AM</span>
            </div>
          </div>
          <div className={styles.scheduleActions}>
            <button className={styles.editBtn}>Edit</button>
            <button className={styles.pauseBtn}>Pause</button>
            <button className={styles.deleteBtn}>Delete</button>
          </div>
        </div>

        <div className={styles.scheduleCard}>
          <div className={styles.scheduleHeader}>
            <h5>Daily Lead Alert</h5>
            <span className={styles.scheduleStatus}>Paused</span>
          </div>
          <div className={styles.scheduleDetails}>
            <div className={styles.scheduleDetail}>
              <span>Frequency:</span>
              <span>Every weekday at 6:00 PM</span>
            </div>
            <div className={styles.scheduleDetail}>
              <span>Recipients:</span>
              <span>Lead Managers (3 people)</span>
            </div>
            <div className={styles.scheduleDetail}>
              <span>Format:</span>
              <span>Email Summary</span>
            </div>
            <div className={styles.scheduleDetail}>
              <span>Last Sent:</span>
              <span>December 20th, 6:00 PM</span>
            </div>
          </div>
          <div className={styles.scheduleActions}>
            <button className={styles.editBtn}>Edit</button>
            <button className={styles.resumeBtn}>Resume</button>
            <button className={styles.deleteBtn}>Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.createSchedule}>
      <h4>Create New Scheduled Report</h4>
      <div className={styles.scheduleForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Report Name</label>
            <input type="text" placeholder="Enter report name" />
          </div>
          <div className={styles.formGroup}>
            <label>Report Type</label>
            <select>
              <option>Sales Summary</option>
              <option>Lead Analysis</option>
              <option>Performance Review</option>
              <option>Custom Report</option>
            </select>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Frequency</label>
            <select>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Time</label>
            <input type="time" defaultValue="09:00" />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Recipients</label>
            <input type="text" placeholder="Enter email addresses (comma-separated)" />
          </div>
          <div className={styles.formGroup}>
            <label>Format</label>
            <select>
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
              <option>Email Summary</option>
            </select>
          </div>
        </div>
        <div className={styles.formActions}>
          <button className={styles.createBtn}>
            <Calendar size={16} />
            Create Schedule
          </button>
          <button className={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  </div>
);

export default ReportsSection;
