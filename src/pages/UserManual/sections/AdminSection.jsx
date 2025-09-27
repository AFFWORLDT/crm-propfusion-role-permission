import React, { useState } from 'react';
import { Settings, Users, Shield, Database, Globe, Key, BarChart3, AlertTriangle, Download, Upload, RefreshCw, Save, Trash2, Plus, Edit, Eye, CheckCircle } from 'lucide-react';
import styles from './AdminSection.module.css';

const AdminSection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Settings size={20} /> },
    { id: 'system', label: 'System Settings', icon: <Database size={20} /> },
    { id: 'users', label: 'User Management', icon: <Users size={20} /> },
    { id: 'security', label: 'Security & Access', icon: <Shield size={20} /> },
    { id: 'integrations', label: 'Integrations', icon: <Globe size={20} /> },
    { id: 'backup', label: 'Backup & Restore', icon: <Download size={20} /> },
    { id: 'maintenance', label: 'Maintenance', icon: <RefreshCw size={20} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'system':
        return <SystemTab />;
      case 'users':
        return <UsersTab />;
      case 'security':
        return <SecurityTab />;
      case 'integrations':
        return <IntegrationsTab />;
      case 'backup':
        return <BackupTab />;
      case 'maintenance':
        return <MaintenanceTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={styles.adminSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <Settings size={32} />
        </div>
        <div className={styles.headerContent}>
          <h2>Admin & Settings</h2>
          <p>Comprehensive system administration, configuration, and user management tools.</p>
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
          <Settings size={32} />
        </div>
        <h3>System Configuration</h3>
        <p>Manage core system settings and preferences</p>
        <div className={styles.cardFeatures}>
          <span>Global Settings</span>
          <span>Company Profile</span>
          <span>System Preferences</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Users size={32} />
        </div>
        <h3>User Administration</h3>
        <p>Control user access and permissions</p>
        <div className={styles.cardFeatures}>
          <span>User Creation</span>
          <span>Role Management</span>
          <span>Access Control</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Shield size={32} />
        </div>
        <h3>Security Management</h3>
        <p>Configure security policies and settings</p>
        <div className={styles.cardFeatures}>
          <span>Authentication</span>
          <span>Data Protection</span>
          <span>Audit Logs</span>
        </div>
      </div>
    </div>

    <div className={styles.adminFeatures}>
      <h3>Administrative Capabilities</h3>
      <div className={styles.featuresGrid}>
        <div className={styles.featureItem}>
          <Shield size={20} />
          <span>Full system access and control</span>
        </div>
        <div className={styles.featureItem}>
          <Database size={20} />
          <span>Database management and optimization</span>
        </div>
        <div className={styles.featureItem}>
          <Users size={20} />
          <span>User lifecycle management</span>
        </div>
        <div className={styles.featureItem}>
          <Globe size={20} />
          <span>Integration configuration</span>
        </div>
        <div className={styles.featureItem}>
          <Download size={20} />
          <span>Backup and restore operations</span>
        </div>
        <div className={styles.featureItem}>
          <BarChart3 size={20} />
          <span>System monitoring and analytics</span>
        </div>
      </div>
    </div>
  </div>
);

const SystemTab = () => (
  <div className={styles.systemTab}>
    <div className={styles.systemOverview}>
      <h3>System Configuration</h3>
      <p>Manage core system settings and preferences</p>
    </div>

    <div className={styles.configurationSections}>
      <div className={styles.configSection}>
        <h4>Company Profile</h4>
        <div className={styles.configForm}>
          <div className={styles.formGroup}>
            <label>Company Name</label>
            <input type="text" placeholder="Enter company name" />
          </div>
          <div className={styles.formGroup}>
            <label>Company Logo</label>
            <div className={styles.fileUpload}>
              <input type="file" accept="image/*" />
              <span>Upload Logo</span>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Business Address</label>
            <textarea placeholder="Enter business address"></textarea>
          </div>
          <div className={styles.formGroup}>
            <label>Contact Information</label>
            <input type="email" placeholder="Email address" />
            <input type="tel" placeholder="Phone number" />
          </div>
        </div>
      </div>

      <div className={styles.configSection}>
        <h4>System Preferences</h4>
        <div className={styles.preferencesGrid}>
          <div className={styles.preferenceItem}>
            <label>
              <input type="checkbox" />
              <span>Enable email notifications</span>
            </label>
          </div>
          <div className={styles.preferenceItem}>
            <label>
              <input type="checkbox" />
              <span>Enable SMS notifications</span>
            </label>
          </div>
          <div className={styles.preferenceItem}>
            <label>
              <input type="checkbox" />
              <span>Auto-backup enabled</span>
            </label>
          </div>
          <div className={styles.preferenceItem}>
            <label>
              <input type="checkbox" />
              <span>Two-factor authentication required</span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.configSection}>
        <h4>Regional Settings</h4>
        <div className={styles.regionalForm}>
          <div className={styles.formGroup}>
            <label>Time Zone</label>
            <select>
              <option>UTC (Coordinated Universal Time)</option>
              <option>EST (Eastern Standard Time)</option>
              <option>PST (Pacific Standard Time)</option>
              <option>GMT (Greenwich Mean Time)</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Date Format</label>
            <select>
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Currency</label>
            <select>
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>AED (د.إ)</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.saveActions}>
      <button className={styles.saveBtn}>
        <Save size={16} />
        Save All Changes
      </button>
      <button className={styles.resetBtn}>
        <RefreshCw size={16} />
        Reset to Defaults
      </button>
    </div>
  </div>
);

const UsersTab = () => (
  <div className={styles.usersTab}>
    <div className={styles.usersOverview}>
      <h3>User Management</h3>
      <p>Create, manage, and control user access to the system</p>
    </div>

    <div className={styles.userActions}>
      <button className={styles.addUserBtn}>
        <Plus size={16} />
        Add New User
      </button>
      <button className={styles.bulkImportBtn}>
        <Upload size={16} />
        Bulk Import Users
      </button>
      <button className={styles.exportUsersBtn}>
        <Download size={16} />
        Export User List
      </button>
    </div>

    <div className={styles.usersList}>
      <h4>Active Users</h4>
      <div className={styles.userTable}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>User</div>
          <div className={styles.headerCell}>Role</div>
          <div className={styles.headerCell}>Status</div>
          <div className={styles.headerCell}>Last Login</div>
          <div className={styles.headerCell}>Actions</div>
        </div>
        
        <div className={styles.tableRow}>
          <div className={styles.userCell}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>JD</div>
              <div>
                <div className={styles.userName}>John Doe</div>
                <div className={styles.userEmail}>john.doe@company.com</div>
              </div>
            </div>
          </div>
          <div className={styles.roleCell}>
            <span className={styles.roleBadge}>Admin</span>
          </div>
          <div className={styles.statusCell}>
            <span className={styles.statusBadge}>Active</span>
          </div>
          <div className={styles.lastLoginCell}>2 hours ago</div>
          <div className={styles.actionsCell}>
            <button className={styles.actionBtn}>
              <Eye size={16} />
            </button>
            <button className={styles.actionBtn}>
              <Edit size={16} />
            </button>
            <button className={styles.actionBtn}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className={styles.tableRow}>
          <div className={styles.userCell}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>JS</div>
              <div>
                <div className={styles.userName}>Jane Smith</div>
                <div className={styles.userEmail}>jane.smith@company.com</div>
              </div>
            </div>
          </div>
          <div className={styles.roleCell}>
            <span className={styles.roleBadge}>Manager</span>
          </div>
          <div className={styles.statusCell}>
            <span className={styles.statusBadge}>Active</span>
          </div>
          <div className={styles.lastLoginCell}>1 day ago</div>
          <div className={styles.actionsCell}>
            <button className={styles.actionBtn}>
              <Eye size={16} />
            </button>
            <button className={styles.actionBtn}>
              <Edit size={16} />
            </button>
            <button className={styles.actionBtn}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className={styles.tableRow}>
          <div className={styles.userCell}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>MJ</div>
              <div>
                <div className={styles.userName}>Mike Johnson</div>
                <div className={styles.userEmail}>mike.johnson@company.com</div>
              </div>
            </div>
          </div>
          <div className={styles.roleCell}>
            <span className={styles.roleBadge}>Agent</span>
          </div>
          <div className={styles.statusCell}>
            <span className={styles.statusBadge}>Inactive</span>
          </div>
          <div className={styles.lastLoginCell}>1 week ago</div>
          <div className={styles.actionsCell}>
            <button className={styles.actionBtn}>
              <Eye size={16} />
            </button>
            <button className={styles.actionBtn}>
              <Edit size={16} />
            </button>
            <button className={styles.actionBtn}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.userStats}>
      <h4>User Statistics</h4>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>24</div>
          <div className={styles.statLabel}>Total Users</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>18</div>
          <div className={styles.statLabel}>Active Users</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>6</div>
          <div className={styles.statLabel}>Inactive Users</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>3</div>
          <div className={styles.statLabel}>Admin Users</div>
        </div>
      </div>
    </div>
  </div>
);

const SecurityTab = () => (
  <div className={styles.securityTab}>
    <div className={styles.securityOverview}>
      <h3>Security & Access Control</h3>
      <p>Configure security policies and monitor system access</p>
    </div>

    <div className={styles.securitySettings}>
      <div className={styles.securitySection}>
        <h4>Authentication Settings</h4>
        <div className={styles.authSettings}>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              <span>Require strong passwords</span>
            </label>
            <div className={styles.settingDescription}>
              Passwords must contain uppercase, lowercase, numbers, and special characters
            </div>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              <span>Enable two-factor authentication</span>
            </label>
            <div className={styles.settingDescription}>
              Require 2FA for all user accounts
            </div>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" />
              <span>Session timeout after inactivity</span>
            </label>
            <div className={styles.settingDescription}>
              Automatically log out users after 30 minutes of inactivity
            </div>
          </div>
        </div>
      </div>

      <div className={styles.securitySection}>
        <h4>Access Control</h4>
        <div className={styles.accessSettings}>
          <div className={styles.settingItem}>
            <label>Maximum login attempts</label>
            <select defaultValue="5">
              <option>3</option>
              <option>5</option>
              <option>10</option>
              <option>Unlimited</option>
            </select>
          </div>
          <div className={styles.settingItem}>
            <label>Account lockout duration</label>
            <select defaultValue="15">
              <option>5 minutes</option>
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>1 hour</option>
            </select>
          </div>
          <div className={styles.settingItem}>
            <label>IP address restrictions</label>
            <input type="text" placeholder="Enter allowed IP addresses (comma-separated)" />
          </div>
        </div>
      </div>

      <div className={styles.securitySection}>
        <h4>Data Protection</h4>
        <div className={styles.dataSettings}>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              <span>Enable data encryption</span>
            </label>
            <div className={styles.settingDescription}>
              Encrypt sensitive data at rest and in transit
            </div>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" defaultChecked />
              <span>Audit logging enabled</span>
            </label>
            <div className={styles.settingDescription}>
              Log all system activities and user actions
            </div>
          </div>
          <div className={styles.settingItem}>
            <label>
              <input type="checkbox" />
              <span>Data retention policy</span>
            </label>
            <div className={styles.settingDescription}>
              Automatically delete old data after specified period
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.securityMonitoring}>
      <h4>Security Monitoring</h4>
      <div className={styles.monitoringGrid}>
        <div className={styles.monitoringCard}>
          <h5>Recent Security Events</h5>
          <div className={styles.eventList}>
            <div className={styles.eventItem}>
              <AlertTriangle size={16} />
              <span>Failed login attempt from unknown IP</span>
              <span className={styles.eventTime}>2 min ago</span>
            </div>
            <div className={styles.eventItem}>
              <Shield size={16} />
              <span>User role permissions updated</span>
              <span className={styles.eventTime}>15 min ago</span>
            </div>
            <div className={styles.eventItem}>
              <Key size={16} />
              <span>New user account created</span>
              <span className={styles.eventTime}>1 hour ago</span>
            </div>
          </div>
        </div>

        <div className={styles.monitoringCard}>
          <h5>Security Metrics</h5>
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>0</div>
              <div className={styles.metricLabel}>Failed Logins (Today)</div>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>3</div>
              <div className={styles.metricLabel}>Active Sessions</div>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>24</div>
              <div className={styles.metricLabel}>Total Users</div>
            </div>
            <div className={styles.metricItem}>
              <div className={styles.metricValue}>100%</div>
              <div className={styles.metricLabel}>2FA Enabled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IntegrationsTab = () => (
  <div className={styles.integrationsTab}>
    <div className={styles.integrationsOverview}>
      <h3>System Integrations</h3>
      <p>Connect external services and configure API connections</p>
    </div>

    <div className={styles.integrationTypes}>
      <div className={styles.integrationSection}>
        <h4>Email Services</h4>
        <div className={styles.integrationGrid}>
          <div className={styles.integrationCard}>
            <div className={styles.integrationHeader}>
              <h5>SMTP Configuration</h5>
              <span className={styles.statusBadge}>Connected</span>
            </div>
            <div className={styles.integrationDetails}>
              <div className={styles.detailItem}>
                <span>Server:</span>
                <span>smtp.gmail.com</span>
              </div>
              <div className={styles.detailItem}>
                <span>Port:</span>
                <span>587</span>
              </div>
              <div className={styles.detailItem}>
                <span>Security:</span>
                <span>TLS</span>
              </div>
            </div>
            <div className={styles.integrationActions}>
              <button className={styles.testBtn}>Test Connection</button>
              <button className={styles.editBtn}>Edit</button>
            </div>
          </div>

          <div className={styles.integrationCard}>
            <div className={styles.integrationHeader}>
              <h5>SendGrid API</h5>
              <span className={styles.statusBadge}>Disconnected</span>
            </div>
            <div className={styles.integrationDetails}>
              <div className={styles.detailItem}>
                <span>API Key:</span>
                <span>Not configured</span>
              </div>
            </div>
            <div className={styles.integrationActions}>
              <button className={styles.connectBtn}>Connect</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.integrationSection}>
        <h4>Payment Gateways</h4>
        <div className={styles.integrationGrid}>
          <div className={styles.integrationCard}>
            <div className={styles.integrationHeader}>
              <h5>Stripe</h5>
              <span className={styles.statusBadge}>Connected</span>
            </div>
            <div className={styles.integrationDetails}>
              <div className={styles.detailItem}>
                <span>Mode:</span>
                <span>Test</span>
              </div>
              <div className={styles.detailItem}>
                <span>Webhook:</span>
                <span>Configured</span>
              </div>
            </div>
            <div className={styles.integrationActions}>
              <button className={styles.testBtn}>Test Payment</button>
              <button className={styles.editBtn}>Edit</button>
            </div>
          </div>

          <div className={styles.integrationCard}>
            <div className={styles.integrationHeader}>
              <h5>PayPal</h5>
              <span className={styles.statusBadge}>Disconnected</span>
            </div>
            <div className={styles.integrationDetails}>
              <div className={styles.detailItem}>
                <span>Client ID:</span>
                <span>Not configured</span>
              </div>
            </div>
            <div className={styles.integrationActions}>
              <button className={styles.connectBtn}>Connect</button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.integrationSection}>
        <h4>Third-Party Services</h4>
        <div className={styles.integrationGrid}>
          <div className={styles.integrationCard}>
            <div className={styles.integrationHeader}>
              <h5>Google Calendar</h5>
              <span className={styles.statusBadge}>Connected</span>
            </div>
            <div className={styles.integrationDetails}>
              <div className={styles.detailItem}>
                <span>Account:</span>
                <span>admin@company.com</span>
              </div>
              <div className={styles.detailItem}>
                <span>Sync:</span>
                <span>Bidirectional</span>
              </div>
            </div>
            <div className={styles.integrationActions}>
              <button className={styles.testBtn}>Test Sync</button>
              <button className={styles.editBtn}>Edit</button>
            </div>
          </div>

          <div className={styles.integrationCard}>
            <div className={styles.integrationHeader}>
              <h5>Slack</h5>
              <span className={styles.statusBadge}>Disconnected</span>
            </div>
            <div className={styles.integrationDetails}>
              <div className={styles.detailItem}>
                <span>Webhook URL:</span>
                <span>Not configured</span>
              </div>
            </div>
            <div className={styles.integrationActions}>
              <button className={styles.connectBtn}>Connect</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BackupTab = () => (
  <div className={styles.backupTab}>
    <div className={styles.backupOverview}>
      <h3>Backup & Restore</h3>
      <p>Manage system backups and data recovery operations</p>
    </div>

    <div className={styles.backupStatus}>
      <h4>Backup Status</h4>
      <div className={styles.statusGrid}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>
            <Download size={24} />
          </div>
          <h5>Last Backup</h5>
          <div className={styles.statusValue}>2 hours ago</div>
          <div className={styles.statusDetails}>Size: 2.4 GB | Status: Successful</div>
        </div>

        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>
            <RefreshCw size={24} />
          </div>
          <h5>Next Scheduled</h5>
          <div className={styles.statusValue}>Tonight at 2:00 AM</div>
          <div className={styles.statusDetails}>Auto-backup enabled</div>
        </div>

        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>
            <Database size={24} />
          </div>
          <h5>Storage Used</h5>
          <div className={styles.statusValue}>15.2 GB / 100 GB</div>
          <div className={styles.statusDetails}>15% of available space</div>
        </div>
      </div>
    </div>

    <div className={styles.backupActions}>
      <h4>Manual Backup Operations</h4>
      <div className={styles.actionsGrid}>
        <div className={styles.actionCard}>
          <h5>Create Full Backup</h5>
          <p>Backup entire system including database, files, and configurations</p>
          <button className={styles.backupBtn}>
            <Download size={16} />
            Start Full Backup
          </button>
        </div>

        <div className={styles.actionCard}>
          <h5>Database Backup</h5>
          <p>Backup only the database for quick recovery</p>
          <button className={styles.backupBtn}>
            <Database size={16} />
            Backup Database
          </button>
        </div>

        <div className={styles.actionCard}>
          <h5>Files Backup</h5>
          <p>Backup uploaded files and documents</p>
          <button className={styles.backupBtn}>
            <Download size={16} />
            Backup Files
          </button>
        </div>
      </div>
    </div>

    <div className={styles.backupHistory}>
      <h4>Backup History</h4>
      <div className={styles.historyTable}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Date</div>
          <div className={styles.headerCell}>Type</div>
          <div className={styles.headerCell}>Size</div>
          <div className={styles.headerCell}>Status</div>
          <div className={styles.headerCell}>Actions</div>
        </div>
        
        <div className={styles.tableRow}>
          <div className={styles.dateCell}>Today, 2:00 AM</div>
          <div className={styles.typeCell}>Full Backup</div>
          <div className={styles.sizeCell}>2.4 GB</div>
          <div className={styles.statusCell}>
            <span className={styles.statusBadge}>Successful</span>
          </div>
          <div className={styles.actionsCell}>
            <button className={styles.actionBtn}>Download</button>
            <button className={styles.actionBtn}>Restore</button>
          </div>
        </div>

        <div className={styles.tableRow}>
          <div className={styles.dateCell}>Yesterday, 2:00 AM</div>
          <div className={styles.typeCell}>Full Backup</div>
          <div className={styles.sizeCell}>2.3 GB</div>
          <div className={styles.statusCell}>
            <span className={styles.statusBadge}>Successful</span>
          </div>
          <div className={styles.actionsCell}>
            <button className={styles.actionBtn}>Download</button>
            <button className={styles.actionBtn}>Restore</button>
          </div>
        </div>

        <div className={styles.tableRow}>
          <div className={styles.dateCell}>2 days ago, 2:00 AM</div>
          <div className={styles.typeCell}>Full Backup</div>
          <div className={styles.sizeCell}>2.2 GB</div>
          <div className={styles.statusCell}>
            <span className={styles.statusBadge}>Successful</span>
          </div>
          <div className={styles.actionsCell}>
            <button className={styles.actionBtn}>Download</button>
            <button className={styles.actionBtn}>Restore</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MaintenanceTab = () => (
  <div className={styles.maintenanceTab}>
    <div className={styles.maintenanceOverview}>
      <h3>System Maintenance</h3>
      <p>Perform system maintenance tasks and monitor system health</p>
    </div>

    <div className={styles.systemHealth}>
      <h4>System Health Status</h4>
      <div className={styles.healthGrid}>
        <div className={styles.healthCard}>
          <div className={styles.healthIcon}>
            <CheckCircle size={24} />
          </div>
          <h5>Database</h5>
          <div className={styles.healthStatus}>Healthy</div>
          <div className={styles.healthDetails}>All tables optimized, no errors detected</div>
        </div>

        <div className={styles.healthCard}>
          <div className={styles.healthIcon}>
            <CheckCircle size={24} />
          </div>
          <h5>File System</h5>
          <div className={styles.healthStatus}>Healthy</div>
          <div className={styles.healthDetails}>Storage: 15.2 GB / 100 GB (15%)</div>
        </div>

        <div className={styles.healthCard}>
          <div className={styles.healthIcon}>
            <AlertTriangle size={24} />
          </div>
          <h5>Performance</h5>
          <div className={styles.healthStatus}>Warning</div>
          <div className={styles.healthDetails}>Response time: 2.3s (target: &lt;2s)</div>
        </div>

        <div className={styles.healthCard}>
          <div className={styles.healthIcon}>
            <CheckCircle size={24} />
          </div>
          <h5>Security</h5>
          <div className={styles.healthStatus}>Healthy</div>
          <div className={styles.healthDetails}>All security measures active</div>
        </div>
      </div>
    </div>

    <div className={styles.maintenanceTasks}>
      <h4>Maintenance Tasks</h4>
      <div className={styles.tasksGrid}>
        <div className={styles.taskCard}>
          <h5>Database Optimization</h5>
          <p>Optimize database tables and clean up old data</p>
          <div className={styles.taskStatus}>
            <span className={styles.statusBadge}>Pending</span>
            <span>Last run: 3 days ago</span>
          </div>
          <button className={styles.runTaskBtn}>
            <RefreshCw size={16} />
            Run Now
          </button>
        </div>

        <div className={styles.taskCard}>
          <h5>Cache Clear</h5>
          <p>Clear system cache and temporary files</p>
          <div className={styles.taskStatus}>
            <span className={styles.statusBadge}>Pending</span>
            <span>Last run: 1 day ago</span>
          </div>
          <button className={styles.runTaskBtn}>
            <RefreshCw size={16} />
            Run Now
          </button>
        </div>

        <div className={styles.taskCard}>
          <h5>Log Cleanup</h5>
          <p>Clean up old log files and audit trails</p>
          <div className={styles.taskStatus}>
            <span className={styles.statusBadge}>Pending</span>
            <span>Last run: 5 days ago</span>
          </div>
          <button className={styles.runTaskBtn}>
            <RefreshCw size={16} />
            Run Now
          </button>
        </div>

        <div className={styles.taskCard}>
          <h5>System Update Check</h5>
          <p>Check for available system updates and patches</p>
          <div className={styles.taskStatus}>
            <span className={styles.statusBadge}>Pending</span>
            <span>Last run: 1 week ago</span>
          </div>
          <button className={styles.runTaskBtn}>
            <RefreshCw size={16} />
            Check Now
          </button>
        </div>
      </div>
    </div>

    <div className={styles.maintenanceSchedule}>
      <h4>Maintenance Schedule</h4>
      <div className={styles.scheduleGrid}>
        <div className={styles.scheduleItem}>
          <div className={styles.scheduleTime}>Daily (2:00 AM)</div>
          <div className={styles.scheduleTask}>Database backup</div>
        </div>
        <div className={styles.scheduleItem}>
          <div className={styles.scheduleTime}>Weekly (Sunday, 3:00 AM)</div>
          <div className={styles.scheduleTask}>Full system backup</div>
        </div>
        <div className={styles.scheduleItem}>
          <div className={styles.scheduleTime}>Monthly (1st, 4:00 AM)</div>
          <div className={styles.scheduleTask}>Database optimization</div>
        </div>
        <div className={styles.scheduleItem}>
          <div className={styles.scheduleTime}>Quarterly (1st, 5:00 AM)</div>
          <div className={styles.scheduleTask}>Log cleanup and archiving</div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminSection;
