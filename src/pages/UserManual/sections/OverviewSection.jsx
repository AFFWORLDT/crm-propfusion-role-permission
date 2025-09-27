import { 
  BookOpen, Building2, Target, Users, FileText, Calendar, 
  HelpCircle, Clock, MessageSquare, Phone, BarChart3, TrendingUp, Shield, Globe
} from 'lucide-react';
import styles from './OverviewSection.module.css';

const OverviewSection = () => {
  return (
    <div className={styles.overviewSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <BookOpen size={32} />
        </div>
        <div className={styles.headerContent}>
          <h3>CRM Property Fusion Overview</h3>
          <p>Welcome to the comprehensive real estate management system designed to streamline your property operations</p>
        </div>
      </div>

      <div className={styles.overviewContent}>
        <div className={styles.introductionSection}>
          <h4>What is CRM Property Fusion?</h4>
          <p>
            CRM Property Fusion is a cutting-edge real estate management system that combines customer relationship management, 
            property management, lead tracking, and business intelligence into one comprehensive platform. Designed specifically 
            for real estate agencies, property developers, and property management companies, it streamlines every aspect of 
            your business operations.
          </p>
        </div>

        <div className={styles.coreFeatures}>
          <h4>Core Features</h4>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Building2 size={24} />
              </div>
              <h5>Property Management</h5>
              <p>Complete lifecycle management from listing to sale/rent with advanced media management and sharing capabilities</p>
              <div className={styles.featureHighlights}>
                <span>Property listings</span>
                <span>Media management</span>
                <span>Virtual tours</span>
                <span>Premium PDFs</span>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Target size={24} />
              </div>
              <h5>Lead Management</h5>
              <p>Multi-source lead capture with automated qualification, scoring, and follow-up workflows</p>
              <div className={styles.featureHighlights}>
                <span>Lead capture</span>
                <span>Automated scoring</span>
                <span>Follow-up workflows</span>
                <span>Conversion tracking</span>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Users size={24} />
              </div>
              <h5>Customer CRM</h5>
              <p>Comprehensive customer relationship management with segmentation and personalized communication</p>
              <div className={styles.featureHighlights}>
                <span>Customer profiles</span>
                <span>Communication tools</span>
                <span>Preference tracking</span>
                <span>Interaction history</span>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FileText size={24} />
              </div>
              <h5>Contract Management</h5>
              <p>Streamlined contract workflows with digital signatures and automated document management</p>
              <div className={styles.featureHighlights}>
                <span>Contract templates</span>
                <span>Digital signatures</span>
                <span>Workflow automation</span>
                <span>Compliance tracking</span>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Calendar size={24} />
              </div>
              <h5>Calendar & Scheduling</h5>
              <p>Integrated calendar system for appointments, viewings, and team coordination</p>
              <div className={styles.featureHighlights}>
                <span>Appointment scheduling</span>
                <span>Property viewings</span>
                <span>Team coordination</span>
                <span>Reminder system</span>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <BarChart3 size={24} />
              </div>
              <h5>Analytics & Reports</h5>
              <p>Business intelligence with customizable reports and performance metrics</p>
              <div className={styles.featureHighlights}>
                <span>Performance metrics</span>
                <span>Custom reports</span>
                <span>Data visualization</span>
                <span>Trend analysis</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.benefitsSection}>
          <h4>Key Benefits</h4>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <TrendingUp size={20} />
              </div>
              <div>
                <h6>Increased Efficiency</h6>
                <p>Automate repetitive tasks and streamline workflows to save time and reduce errors</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <Users size={20} />
              </div>
              <div>
                <h6>Better Customer Service</h6>
                <p>Provide personalized experiences and faster response times to improve customer satisfaction</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <Target size={20} />
              </div>
              <div>
                <h6>Higher Conversion Rates</h6>
                <p>Track leads effectively and follow up systematically to convert more prospects into customers</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <BarChart3 size={20} />
              </div>
              <div>
                <h6>Data-Driven Decisions</h6>
                <p>Access real-time insights and analytics to make informed business decisions</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <Shield size={20} />
              </div>
              <div>
                <h6>Enhanced Security</h6>
                <p>Secure data storage with role-based access control and audit trails</p>
              </div>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <Globe size={20} />
              </div>
              <div>
                <h6>Multi-Platform Access</h6>
                <p>Access your CRM from anywhere with web-based interface and mobile optimization</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.targetUsersSection}>
          <h4>Who is it For?</h4>
          <div className={styles.usersGrid}>
            <div className={styles.userCard}>
              <h5>Real Estate Agencies</h5>
              <p>Manage multiple agents, properties, and clients with centralized control and reporting</p>
              <div className={styles.userFeatures}>
                <span>Agent management</span>
                <span>Commission tracking</span>
                <span>Performance analytics</span>
                <span>Client database</span>
              </div>
            </div>

            <div className={styles.userCard}>
              <h5>Property Developers</h5>
              <p>Track project progress, manage sales, and maintain customer relationships throughout development</p>
              <div className={styles.userFeatures}>
                <span>Project tracking</span>
                <span>Sales management</span>
                <span>Customer portal</span>
                <span>Progress updates</span>
              </div>
            </div>

            <div className={styles.userCard}>
              <h5>Property Management Companies</h5>
              <p>Streamline property operations, tenant management, and maintenance coordination</p>
              <div className={styles.userFeatures}>
                <span>Tenant management</span>
                <span>Maintenance tracking</span>
                <span>Rent collection</span>
                <span>Property inspections</span>
              </div>
            </div>

            <div className={styles.userCard}>
              <h5>Individual Agents</h5>
              <p>Professional tools to manage your client base, properties, and business operations</p>
              <div className={styles.userFeatures}>
                <span>Client CRM</span>
                <span>Property listings</span>
                <span>Lead tracking</span>
                <span>Business analytics</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.systemRequirements}>
          <h4>System Requirements</h4>
          <div className={styles.requirementsGrid}>
            <div className={styles.requirementCategory}>
              <h5>Hardware Requirements</h5>
              <ul>
                <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>Minimum 4GB RAM</li>
                <li>Stable internet connection</li>
                <li>HD display (1920x1080 recommended)</li>
              </ul>
            </div>

            <div className={styles.requirementCategory}>
              <h5>Software Requirements</h5>
              <ul>
                <li>Windows 10/11, macOS 10.15+, or Linux</li>
                <li>Latest browser version</li>
                <li>JavaScript enabled</li>
                <li>Cookies enabled</li>
              </ul>
            </div>

            <div className={styles.requirementCategory}>
              <h5>Network Requirements</h5>
              <ul>
                <li>Broadband internet connection</li>
                <li>Minimum 5 Mbps download speed</li>
                <li>Stable connection for real-time features</li>
                <li>VPN compatibility (if required)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.gettingStartedSection}>
          <h4>Getting Started</h4>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h5>System Access</h5>
                <p>Contact your administrator to get your login credentials and system access</p>
              </div>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h5>Profile Setup</h5>
                <p>Complete your user profile and set your preferences for the system</p>
              </div>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h5>Training & Orientation</h5>
                <p>Attend training sessions or review the user manual to understand system features</p>
              </div>
            </div>

            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h5>Start Using</h5>
                <p>Begin using the system with basic features and gradually explore advanced capabilities</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.supportSection}>
          <h4>Support & Resources</h4>
          <div className={styles.supportGrid}>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>
                <BookOpen size={24} />
              </div>
              <h5>User Manual</h5>
              <p>Comprehensive documentation covering all system features and workflows</p>
              <div className={styles.supportActions}>
                <button className={styles.supportBtn}>Browse Manual</button>
              </div>
            </div>

            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>
                <HelpCircle size={24} />
              </div>
              <h5>Help Center</h5>
              <p>Find answers to common questions and troubleshooting guides</p>
              <div className={styles.supportActions}>
                <button className={styles.supportBtn}>Visit Help Center</button>
              </div>
            </div>

            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>
                <Clock size={24} />
              </div>
              <h5>Training Sessions</h5>
              <p>Attend live training sessions to master system features</p>
              <div className={styles.supportActions}>
                <button className={styles.supportBtn}>Schedule Training</button>
              </div>
            </div>

            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>
                <MessageSquare size={24} />
              </div>
              <h5>Contact Support</h5>
              <p>Get direct assistance from our support team</p>
              <div className={styles.supportActions}>
                <button className={styles.supportBtn}>Contact Us</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contactSection}>
          <h4>Need Help?</h4>
          <p>
            Our support team is here to help you get the most out of CRM Property Fusion. 
            Whether you need technical assistance, training, or have questions about features, 
            we&apos;re committed to your success.
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Clock size={20} />
              <span>Support Hours: Sunday - Thursday, 9:00 AM - 6:00 PM GST</span>
            </div>
            <div className={styles.contactItem}>
              <MessageSquare size={20} />
              <span>Email: support@propfusion.com</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={20} />
              <span>Phone: +971 4 XXX XXXX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
