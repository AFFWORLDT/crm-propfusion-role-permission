import React, { useState } from 'react';
import { Shield, Users, Key, Lock, UserCheck, Settings, Eye, EyeOff, AlertTriangle, CheckCircle, Clock, Star, HelpCircle, Download, ExternalLink } from 'lucide-react';
import styles from './AuthenticationSection.module.css';

const AuthenticationSection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Shield size={20} /> },
    { id: 'login', label: 'Login & Access', icon: <Key size={20} /> },
    { id: 'roles', label: 'User Roles', icon: <Users size={20} /> },
    { id: 'permissions', label: 'Permissions', icon: <Lock size={20} /> },
    { id: 'security', label: 'Security', icon: <UserCheck size={20} /> },
    { id: 'management', label: 'User Management', icon: <Settings size={20} /> },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: <HelpCircle size={20} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'login':
        return <LoginTab />;
      case 'roles':
        return <RolesTab />;
      case 'permissions':
        return <PermissionsTab />;
      case 'security':
        return <SecurityTab />;
      case 'management':
        return <ManagementTab />;
      case 'troubleshooting':
        return <TroubleshootingTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={styles.authenticationSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <Shield size={32} />
        </div>
        <div className={styles.headerContent}>
          <h2>Authentication & Users</h2>
          <p>Secure access control, user management, and role-based permissions for your CRM system.</p>
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
          <Shield size={32} />
        </div>
        <h3>Secure Access</h3>
        <p>Multi-layered security with encrypted authentication and session management</p>
        <div className={styles.cardFeatures}>
          <span>SSL Encryption</span>
          <span>2FA Support</span>
          <span>Session Control</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Users size={32} />
        </div>
        <h3>Role Management</h3>
        <p>Granular role-based access control with customizable permissions</p>
        <div className={styles.cardFeatures}>
          <span>Predefined Roles</span>
          <span>Custom Permissions</span>
          <span>Hierarchy Support</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Settings size={32} />
        </div>
        <h3>User Administration</h3>
        <p>Comprehensive user management with audit trails and activity monitoring</p>
        <div className={styles.cardFeatures}>
          <span>User Creation</span>
          <span>Activity Logs</span>
          <span>Bulk Operations</span>
        </div>
      </div>
    </div>

    <div className={styles.securityFeatures}>
      <h3>Security Features Overview</h3>
      <div className={styles.featuresGrid}>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Password complexity requirements</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Account lockout protection</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>IP address restrictions</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Session timeout management</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Multi-factor authentication</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Audit trail logging</span>
        </div>
      </div>
    </div>
  </div>
);

const LoginTab = () => (
  <div className={styles.loginTab}>
    <div className={styles.loginOverview}>
      <h3>Login & Access Control</h3>
      <p>Secure authentication process and access management for all users</p>
    </div>

    <div className={styles.loginProcess}>
      <h4>Login Process</h4>
      <div className={styles.processSteps}>
        <div className={styles.processStep}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h5>Enter Credentials</h5>
            <p>Provide username/email and password</p>
          </div>
        </div>

        <div className={styles.processStep}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h5>Verification</h5>
            <p>System validates credentials and permissions</p>
          </div>
        </div>

        <div className={styles.processStep}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h5>Access Granted</h5>
            <p>User redirected to appropriate dashboard</p>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.loginOptions}>
      <h4>Login Options</h4>
      <div className={styles.optionsGrid}>
        <div className={styles.optionCard}>
          <h5>Standard Login</h5>
          <p>Username/password authentication</p>
          <ul>
            <li>Email address as username</li>
            <li>Secure password requirements</li>
            <li>Remember me functionality</li>
          </ul>
        </div>

        <div className={styles.optionCard}>
          <h5>Two-Factor Authentication</h5>
          <p>Enhanced security with 2FA</p>
          <ul>
            <li>SMS verification codes</li>
            <li>Authenticator app support</li>
            <li>Backup codes available</li>
          </ul>
        </div>

        <div className={styles.optionCard}>
          <h5>Single Sign-On (SSO)</h5>
          <p>Enterprise integration support</p>
          <ul>
            <li>Active Directory integration</li>
            <li>SAML 2.0 support</li>
            <li>OAuth 2.0 providers</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const RolesTab = () => (
  <div className={styles.rolesTab}>
    <div className={styles.rolesOverview}>
      <h3>User Roles & Responsibilities</h3>
      <p>Predefined roles with specific permissions and access levels</p>
    </div>

    <div className={styles.rolesGrid}>
      <div className={styles.roleCard}>
        <div className={styles.roleHeader}>
          <div className={styles.roleIcon}>
            <Star size={24} />
          </div>
          <h4>Super Admin</h4>
          <span className={styles.roleBadge}>Full Access</span>
        </div>
        <div className={styles.roleDescription}>
          <p>Complete system access with all permissions</p>
        </div>
        <div className={styles.rolePermissions}>
          <h5>Key Permissions:</h5>
          <ul>
            <li>User management and role assignment</li>
            <li>System configuration and settings</li>
            <li>Database access and maintenance</li>
            <li>API key management</li>
            <li>Billing and subscription control</li>
          </ul>
        </div>
      </div>

      <div className={styles.roleCard}>
        <div className={styles.roleHeader}>
          <div className={styles.roleIcon}>
            <Users size={24} />
          </div>
          <h4>Admin</h4>
          <span className={styles.roleBadge}>Administrative</span>
        </div>
        <div className={styles.roleDescription}>
          <p>Administrative access with user management capabilities</p>
        </div>
        <div className={styles.rolePermissions}>
          <h5>Key Permissions:</h5>
          <ul>
            <li>User creation and management</li>
            <li>Property and lead management</li>
            <li>Report generation and analytics</li>
            <li>System configuration</li>
            <li>Team performance monitoring</li>
          </ul>
        </div>
      </div>

      <div className={styles.roleCard}>
        <div className={styles.roleHeader}>
          <div className={styles.roleIcon}>
            <UserCheck size={24} />
          </div>
          <h4>Manager</h4>
          <span className={styles.roleBadge}>Management</span>
        </div>
        <div className={styles.roleDescription}>
          <p>Team management with oversight capabilities</p>
        </div>
        <div className={styles.rolePermissions}>
          <h5>Key Permissions:</h5>
          <ul>
            <li>Team member oversight</li>
            <li>Property and lead management</li>
            <li>Performance reporting</li>
            <li>Client communication</li>
            <li>Appointment scheduling</li>
          </ul>
        </div>
      </div>

      <div className={styles.roleCard}>
        <div className={styles.roleHeader}>
          <div className={styles.roleIcon}>
            <Key size={24} />
          </div>
          <h4>Agent</h4>
          <span className={styles.roleBadge}>Standard</span>
        </div>
        <div className={styles.roleDescription}>
          <p>Standard user access for daily operations</p>
        </div>
        <div className={styles.rolePermissions}>
          <h5>Key Permissions:</h5>
          <ul>
            <li>Property management (assigned)</li>
            <li>Lead management (assigned)</li>
            <li>Client communication</li>
            <li>Appointment scheduling</li>
            <li>Basic reporting</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const PermissionsTab = () => (
  <div className={styles.permissionsTab}>
    <div className={styles.permissionsOverview}>
      <h3>Permission System</h3>
      <p>Granular control over what users can access and modify in the system</p>
    </div>

    <div className={styles.permissionCategories}>
      <h4>Permission Categories</h4>
      <div className={styles.categoriesGrid}>
        <div className={styles.categoryCard}>
          <h5>Property Management</h5>
          <div className={styles.permissionList}>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>View Properties</span>
            </label>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>Create Properties</span>
            </label>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>Edit Properties</span>
            </label>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>Delete Properties</span>
            </label>
          </div>
        </div>

        <div className={styles.categoryCard}>
          <h5>Lead Management</h5>
          <div className={styles.permissionList}>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>View Leads</span>
            </label>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>Create Leads</span>
            </label>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>Edit Leads</span>
            </label>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>Delete Leads</span>
            </label>
          </div>
        </div>

        <div className={styles.categoryCard}>
          <h5>Reports & Analytics</h5>
          <div className={styles.permissionList}>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>View Reports</span>
            </label>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>Generate Reports</span>
            </label>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>Export Data</span>
            </label>
            <label className={styles.permissionItem}>
              <input type="checkbox" />
              <span>Custom Dashboards</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SecurityTab = () => (
  <div className={styles.securityTab}>
    <div className={styles.securityOverview}>
      <h3>Security Features & Best Practices</h3>
      <p>Comprehensive security measures to protect your CRM system and data</p>
    </div>

    <div className={styles.securityFeatures}>
      <h4>Security Features</h4>
      <div className={styles.featuresGrid}>
        <div className={styles.securityFeature}>
          <div className={styles.featureIcon}>
            <Lock size={24} />
          </div>
          <h5>Password Security</h5>
          <ul>
            <li>Minimum 8 characters required</li>
            <li>Must include uppercase, lowercase, numbers</li>
            <li>Special characters recommended</li>
            <li>Password history enforcement</li>
            <li>Regular password expiration</li>
          </ul>
        </div>

        <div className={styles.securityFeature}>
          <div className={styles.featureIcon}>
            <Shield size={24} />
          </div>
          <h5>Account Protection</h5>
          <ul>
            <li>Account lockout after failed attempts</li>
            <li>IP address restrictions</li>
            <li>Geographic access controls</li>
            <li>Suspicious activity detection</li>
            <li>Automatic account suspension</li>
          </ul>
        </div>

        <div className={styles.securityFeature}>
          <div className={styles.featureIcon}>
            <Clock size={24} />
          </div>
          <h5>Session Management</h5>
          <ul>
            <li>Configurable session timeout</li>
            <li>Concurrent session limits</li>
            <li>Automatic logout on inactivity</li>
            <li>Session invalidation on logout</li>
            <li>Device fingerprinting</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ManagementTab = () => (
  <div className={styles.managementTab}>
    <div className={styles.managementOverview}>
      <h3>User Management</h3>
      <p>Comprehensive tools for managing users, roles, and permissions</p>
    </div>

    <div className={styles.managementTools}>
      <h4>User Management Tools</h4>
      <div className={styles.toolsGrid}>
        <div className={styles.toolCard}>
          <h5>User Creation</h5>
          <div className={styles.toolFeatures}>
            <span>Bulk user import</span>
            <span>Template-based creation</span>
            <span>Role assignment</span>
            <span>Welcome email setup</span>
          </div>
          <button className={styles.toolBtn}>
            <Users size={16} />
            Create Users
          </button>
        </div>

        <div className={styles.toolCard}>
          <h5>Role Management</h5>
          <div className={styles.toolFeatures}>
            <span>Custom role creation</span>
            <span>Permission templates</span>
            <span>Role cloning</span>
            <span>Bulk role assignment</span>
          </div>
          <button className={styles.toolBtn}>
            <Settings size={16} />
            Manage Roles
          </button>
        </div>

        <div className={styles.toolCard}>
          <h5>Access Control</h5>
          <div className={styles.toolFeatures}>
            <span>Permission management</span>
            <span>Access restrictions</span>
            <span>IP whitelisting</span>
            <span>Time-based access</span>
          </div>
          <button className={styles.toolBtn}>
            <Lock size={16} />
            Access Control
          </button>
        </div>
      </div>
    </div>
  </div>
);

const TroubleshootingTab = () => (
  <div className={styles.troubleshootingTab}>
    <div className={styles.troubleshootingOverview}>
      <h3>Authentication Troubleshooting</h3>
      <p>Common issues and solutions for authentication and user access problems</p>
    </div>

    <div className={styles.commonIssues}>
      <h4>Common Issues & Solutions</h4>
      <div className={styles.issuesList}>
        <div className={styles.issueItem}>
          <div className={styles.issueHeader}>
            <AlertTriangle size={20} />
            <h5>Login Failed - Invalid Credentials</h5>
          </div>
          <div className={styles.issueSolution}>
            <h6>Solution:</h6>
            <ul>
              <li>Verify username/email spelling</li>
              <li>Check password case sensitivity</li>
              <li>Reset password if forgotten</li>
              <li>Clear browser cache and cookies</li>
            </ul>
          </div>
        </div>

        <div className={styles.issueItem}>
          <div className={styles.issueHeader}>
            <Lock size={20} />
            <h5>Account Locked</h5>
          </div>
          <div className={styles.issueSolution}>
            <h6>Solution:</h6>
            <ul>
              <li>Wait for automatic unlock (15 minutes)</li>
              <li>Contact administrator for manual unlock</li>
              <li>Verify account status</li>
              <li>Check for suspicious activity</li>
            </ul>
          </div>
        </div>

        <div className={styles.issueItem}>
          <div className={styles.issueHeader}>
            <Clock size={20} />
            <h5>Session Expired</h5>
          </div>
          <div className={styles.issueSolution}>
            <h6>Solution:</h6>
            <ul>
              <li>Re-login with credentials</li>
              <li>Check session timeout settings</li>
              <li>Enable &quot;Remember Me&quot; option</li>
              <li>Contact admin for timeout adjustment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.contactSupport}>
      <h4>Need Additional Help?</h4>
      <p>If you&apos;re still experiencing issues, our support team is here to help</p>
      <div className={styles.supportOptions}>
        <button className={styles.supportBtn}>
          <HelpCircle size={16} />
          Live Chat Support
        </button>
        <button className={styles.supportBtn}>
          <ExternalLink size={16} />
          Submit Support Ticket
        </button>
        <button className={styles.supportBtn}>
          <Download size={16} />
          Download Troubleshooting Guide
        </button>
      </div>
    </div>
  </div>
);

export default AuthenticationSection;
