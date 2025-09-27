import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Video, Phone, CheckCircle, AlertTriangle, Settings, BarChart3, Download, Share2, Plus, Edit, Trash2 } from 'lucide-react';
import styles from './CalendarSection.module.css';

const CalendarSection = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Calendar size={20} /> },
    { id: 'appointments', label: 'Appointments', icon: <Clock size={20} /> },
    { id: 'viewings', label: 'Property Viewings', icon: <MapPin size={20} /> },
    { id: 'scheduling', label: 'Scheduling Tools', icon: <Settings size={20} /> },
    { id: 'meetings', label: 'Team Meetings', icon: <Users size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <AlertTriangle size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'appointments':
        return <AppointmentsTab />;
      case 'viewings':
        return <ViewingsTab />;
      case 'scheduling':
        return <SchedulingTab />;
      case 'meetings':
        return <MeetingsTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={styles.calendarSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <Calendar size={32} />
        </div>
        <div className={styles.headerContent}>
          <h2>Calendar & Scheduling</h2>
          <p>Comprehensive calendar management for appointments, property viewings, and team coordination.</p>
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
          <Calendar size={32} />
        </div>
        <h3>Centralized Scheduling</h3>
        <p>Manage all appointments, viewings, and meetings in one unified calendar</p>
        <div className={styles.cardFeatures}>
          <span>Unified Calendar</span>
          <span>Multi-User Access</span>
          <span>Real-time Updates</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <MapPin size={32} />
        </div>
        <h3>Property Viewings</h3>
        <p>Schedule and manage property viewings with clients and prospects</p>
        <div className={styles.cardFeatures}>
          <span>Location Mapping</span>
          <span>Client Management</span>
          <span>Follow-up Tracking</span>
        </div>
      </div>

      <div className={styles.overviewCard}>
        <div className={styles.cardIcon}>
          <Users size={32} />
        </div>
        <h3>Team Coordination</h3>
        <p>Coordinate team schedules and manage shared appointments</p>
        <div className={styles.cardFeatures}>
          <span>Team Availability</span>
          <span>Shared Calendars</span>
          <span>Conflict Resolution</span>
        </div>
      </div>
    </div>

    <div className={styles.calendarFeatures}>
      <h3>Key Calendar Features</h3>
      <div className={styles.featuresGrid}>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Multiple calendar views (day, week, month)</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Drag & drop appointment scheduling</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Automated reminders and notifications</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Integration with external calendars</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Mobile app synchronization</span>
        </div>
        <div className={styles.featureItem}>
          <CheckCircle size={20} />
          <span>Conflict detection and resolution</span>
        </div>
      </div>
    </div>
  </div>
);

const AppointmentsTab = () => (
  <div className={styles.appointmentsTab}>
    <div className={styles.appointmentsOverview}>
      <h3>Appointment Management</h3>
      <p>Create, manage, and track all types of appointments efficiently</p>
    </div>

    <div className={styles.appointmentTypes}>
      <h4>Appointment Types</h4>
      <div className={styles.typesGrid}>
        <div className={styles.typeCard}>
          <div className={styles.typeIcon}>
            <MapPin size={24} />
          </div>
          <h5>Property Viewings</h5>
          <p>Schedule property visits with clients</p>
          <ul>
            <li>Location-based scheduling</li>
            <li>Client preferences</li>
            <li>Duration tracking</li>
            <li>Follow-up scheduling</li>
          </ul>
        </div>

        <div className={styles.typeCard}>
          <div className={styles.typeIcon}>
            <Users size={24} />
          </div>
          <h5>Client Meetings</h5>
          <p>Face-to-face or virtual client consultations</p>
          <ul>
            <li>Meeting room booking</li>
            <li>Video call integration</li>
            <li>Agenda management</li>
            <li>Document sharing</li>
          </ul>
        </div>

        <div className={styles.typeCard}>
          <div className={styles.typeIcon}>
            <Phone size={24} />
          </div>
          <h5>Phone Calls</h5>
          <p>Schedule follow-up calls and consultations</p>
          <ul>
            <li>Call reminders</li>
            <li>Duration tracking</li>
            <li>Call notes</li>
            <li>Follow-up scheduling</li>
          </ul>
        </div>

        <div className={styles.typeCard}>
          <div className={styles.typeIcon}>
            <Video size={24} />
          </div>
          <h5>Virtual Tours</h5>
          <p>Online property presentations</p>
          <ul>
            <li>Video platform integration</li>
            <li>Screen sharing</li>
            <li>Recording capabilities</li>
            <li>Participant management</li>
          </ul>
        </div>
      </div>
    </div>

    <div className={styles.appointmentWorkflow}>
      <h4>Appointment Workflow</h4>
      <div className={styles.workflowSteps}>
        <div className={styles.workflowStep}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepContent}>
            <h5>Create Appointment</h5>
            <p>Select type, date, time, and participants</p>
          </div>
        </div>

        <div className={styles.workflowStep}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepContent}>
            <h5>Send Invitations</h5>
            <p>Automated notifications to all participants</p>
          </div>
        </div>

        <div className={styles.workflowStep}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepContent}>
            <h5>Manage Responses</h5>
            <p>Track confirmations and handle conflicts</p>
          </div>
        </div>

        <div className={styles.workflowStep}>
          <div className={styles.stepNumber}>4</div>
          <div className={styles.stepContent}>
            <h5>Conduct Meeting</h5>
            <p>Use integrated tools and track outcomes</p>
          </div>
        </div>

        <div className={styles.workflowStep}>
          <div className={styles.stepNumber}>5</div>
          <div className={styles.stepContent}>
            <h5>Follow-up</h5>
            <p>Schedule next steps and send summaries</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ViewingsTab = () => (
  <div className={styles.viewingsTab}>
    <div className={styles.viewingsOverview}>
      <h3>Property Viewings Management</h3>
      <p>Streamlined process for scheduling and managing property viewings</p>
    </div>

    <div className={styles.viewingProcess}>
      <h4>Viewing Process</h4>
      <div className={styles.processGrid}>
        <div className={styles.processCard}>
          <div className={styles.processIcon}>
            <Plus size={24} />
          </div>
          <h5>Schedule Viewing</h5>
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>1</span>
              <span>Select property and available time slots</span>
            </div>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>2</span>
              <span>Choose viewing type (in-person/virtual)</span>
            </div>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>3</span>
              <span>Add client details and preferences</span>
            </div>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>4</span>
              <span>Set duration and special requirements</span>
            </div>
          </div>
        </div>

        <div className={styles.processCard}>
          <div className={styles.processIcon}>
            <Edit size={24} />
          </div>
          <h5>Manage Viewings</h5>
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>1</span>
              <span>Update viewing status and notes</span>
            </div>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>2</span>
              <span>Handle rescheduling requests</span>
            </div>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>3</span>
              <span>Add viewing feedback and outcomes</span>
            </div>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>4</span>
              <span>Schedule follow-up appointments</span>
            </div>
          </div>
        </div>

        <div className={styles.processCard}>
          <div className={styles.processIcon}>
            <CheckCircle size={24} />
          </div>
          <h5>Follow-up Actions</h5>
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>1</span>
              <span>Send viewing summary to client</span>
            </div>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>2</span>
              <span>Update lead status and notes</span>
            </div>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>3</span>
              <span>Schedule next viewing if needed</span>
            </div>
            <div className={styles.processStep}>
              <span className={styles.stepDot}>4</span>
              <span>Generate viewing reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.viewingFeatures}>
      <h4>Advanced Viewing Features</h4>
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <h5>Location Services</h5>
          <ul>
            <li>GPS coordinates for properties</li>
            <li>Route planning and directions</li>
            <li>Travel time estimation</li>
            <li>Nearby amenities display</li>
          </ul>
        </div>

        <div className={styles.featureCard}>
          <h5>Virtual Viewing Tools</h5>
          <ul>
            <li>360° virtual tours</li>
            <li>Video call integration</li>
            <li>Screen sharing capabilities</li>
            <li>Recording and playback</li>
          </ul>
        </div>

        <div className={styles.featureCard}>
          <h5>Client Management</h5>
          <ul>
            <li>Client preferences tracking</li>
            <li>Viewing history</li>
            <li>Feedback collection</li>
            <li>Automated follow-ups</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SchedulingTab = () => (
  <div className={styles.schedulingTab}>
    <div className={styles.schedulingOverview}>
      <h3>Scheduling Tools & Features</h3>
      <p>Powerful tools to streamline appointment scheduling and management</p>
    </div>

    <div className={styles.schedulingTools}>
      <h4>Core Scheduling Tools</h4>
      <div className={styles.toolsGrid}>
        <div className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <Calendar size={24} />
          </div>
          <h5>Calendar Views</h5>
          <div className={styles.toolFeatures}>
            <span>Day View</span>
            <span>Week View</span>
            <span>Month View</span>
            <span>List View</span>
          </div>
          <p>Multiple calendar perspectives for different scheduling needs</p>
        </div>

        <div className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <Plus size={24} />
          </div>
          <h5>Quick Scheduling</h5>
          <div className={styles.toolFeatures}>
            <span>Drag & Drop</span>
            <span>Quick Add</span>
            <span>Templates</span>
            <span>Recurring</span>
          </div>
          <p>Fast and intuitive appointment creation methods</p>
        </div>

        <div className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <Settings size={24} />
          </div>
          <h5>Availability Management</h5>
          <div className={styles.toolFeatures}>
            <span>Working Hours</span>
            <span>Break Times</span>
            <span>Holidays</span>
            <span>Personal Time</span>
          </div>
          <p>Configure when you&apos;re available for appointments</p>
        </div>

        <div className={styles.toolCard}>
          <div className={styles.toolIcon}>
            <Users size={24} />
          </div>
          <h5>Team Scheduling</h5>
          <div className={styles.toolFeatures}>
            <span>Shared Calendars</span>
            <span>Team Availability</span>
            <span>Resource Booking</span>
            <span>Conflict Resolution</span>
          </div>
          <p>Coordinate schedules across your entire team</p>
        </div>
      </div>
    </div>

    <div className={styles.advancedFeatures}>
      <h4>Advanced Scheduling Features</h4>
      <div className={styles.advancedGrid}>
        <div className={styles.advancedCard}>
          <h5>Automated Scheduling</h5>
          <ul>
            <li>AI-powered time slot suggestions</li>
            <li>Automatic conflict detection</li>
            <li>Smart rescheduling recommendations</li>
            <li>Buffer time management</li>
          </ul>
        </div>

        <div className={styles.advancedCard}>
          <h5>Integration Capabilities</h5>
          <ul>
            <li>Google Calendar sync</li>
            <li>Outlook integration</li>
            <li>Mobile app synchronization</li>
            <li>API connections</li>
          </ul>
        </div>

        <div className={styles.advancedCard}>
          <h5>Customization Options</h5>
          <ul>
            <li>Custom appointment types</li>
            <li>Color coding system</li>
            <li>Personalized views</li>
            <li>Workflow automation</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const MeetingsTab = () => (
  <div className={styles.meetingsTab}>
    <div className={styles.meetingsOverview}>
      <h3>Team Meeting Management</h3>
      <p>Coordinate team meetings, training sessions, and collaborative sessions</p>
    </div>

    <div className={styles.meetingTypes}>
      <h4>Meeting Types</h4>
      <div className={styles.typesGrid}>
        <div className={styles.meetingType}>
          <div className={styles.typeIcon}>
            <Users size={24} />
          </div>
          <h5>Team Stand-ups</h5>
          <p>Daily or weekly team status updates</p>
          <div className={styles.meetingDetails}>
            <span>Duration: 15-30 min</span>
            <span>Frequency: Daily/Weekly</span>
            <span>Participants: Team members</span>
          </div>
        </div>

        <div className={styles.meetingType}>
          <div className={styles.typeIcon}>
            <BarChart3 size={24} />
          </div>
          <h5>Performance Reviews</h5>
          <p>Regular performance and goal discussions</p>
          <div className={styles.meetingDetails}>
            <span>Duration: 45-60 min</span>
            <span>Frequency: Monthly/Quarterly</span>
            <span>Participants: Manager + Employee</span>
          </div>
        </div>

        <div className={styles.meetingType}>
          <div className={styles.typeIcon}>
            <Settings size={24} />
          </div>
          <h5>Training Sessions</h5>
          <p>Skill development and knowledge sharing</p>
          <div className={styles.meetingDetails}>
            <span>Duration: 1-2 hours</span>
            <span>Frequency: As needed</span>
            <span>Participants: Team + Trainer</span>
          </div>
        </div>

        <div className={styles.meetingType}>
          <div className={styles.typeIcon}>
            <Calendar size={24} />
          </div>
          <h5>Project Planning</h5>
          <p>Strategic planning and project coordination</p>
          <div className={styles.meetingDetails}>
            <span>Duration: 1-3 hours</span>
            <span>Frequency: Weekly/Monthly</span>
            <span>Participants: Project team</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.meetingManagement}>
      <h4>Meeting Management Tools</h4>
      <div className={styles.managementGrid}>
        <div className={styles.managementCard}>
          <h5>Agenda Management</h5>
          <ul>
            <li>Create and share meeting agendas</li>
            <li>Attach relevant documents</li>
            <li>Set discussion time limits</li>
            <li>Track action items</li>
          </ul>
        </div>

        <div className={styles.managementCard}>
          <h5>Participant Management</h5>
          <ul>
            <li>Send meeting invitations</li>
            <li>Track RSVP responses</li>
            <li>Manage attendee lists</li>
            <li>Handle conflicts</li>
          </ul>
        </div>

        <div className={styles.managementCard}>
          <h5>Meeting Resources</h5>
          <ul>
            <li>Room booking system</li>
            <li>Equipment reservation</li>
            <li>Catering coordination</li>
            <li>Virtual meeting links</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const NotificationsTab = () => (
  <div className={styles.notificationsTab}>
    <div className={styles.notificationsOverview}>
      <h3>Notification & Reminder System</h3>
      <p>Stay on top of your schedule with intelligent notifications and reminders</p>
    </div>

    <div className={styles.notificationTypes}>
      <h4>Notification Types</h4>
      <div className={styles.notificationGrid}>
        <div className={styles.notificationCard}>
          <div className={styles.notificationIcon}>
            <Clock size={24} />
          </div>
          <h5>Appointment Reminders</h5>
          <p>Timely reminders for upcoming appointments</p>
          <div className={styles.notificationSettings}>
            <span>15 min before</span>
            <span>1 hour before</span>
            <span>1 day before</span>
            <span>Custom timing</span>
          </div>
        </div>

        <div className={styles.notificationCard}>
          <div className={styles.notificationIcon}>
            <AlertTriangle size={24} />
          </div>
          <h5>Conflict Alerts</h5>
          <p>Warnings about scheduling conflicts</p>
          <div className={styles.notificationSettings}>
            <span>Double-booking alerts</span>
            <span>Travel time warnings</span>
            <span>Resource conflicts</span>
            <span>Team availability</span>
          </div>
        </div>

        <div className={styles.notificationCard}>
          <div className={styles.notificationIcon}>
            <CheckCircle size={24} />
          </div>
          <h5>Confirmation Notifications</h5>
          <p>Confirmations and status updates</p>
          <div className={styles.notificationSettings}>
            <span>Appointment confirmations</span>
            <span>Rescheduling updates</span>
            <span>Cancellation notices</span>
            <span>Participant changes</span>
          </div>
        </div>

        <div className={styles.notificationCard}>
          <div className={styles.notificationIcon}>
            <Users size={24} />
          </div>
          <h5>Team Notifications</h5>
          <p>Team-related scheduling updates</p>
          <div className={styles.notificationSettings}>
            <span>Team member availability</span>
            <span>Shared calendar updates</span>
            <span>Resource bookings</span>
            <span>Meeting invitations</span>
          </div>
        </div>
      </div>
    </div>

    <div className={styles.notificationChannels}>
      <h4>Notification Channels</h4>
      <div className={styles.channelsGrid}>
        <div className={styles.channelCard}>
          <h5>Email Notifications</h5>
          <ul>
            <li>Daily schedule summaries</li>
            <li>Appointment confirmations</li>
            <li>Reminder emails</li>
            <li>Calendar updates</li>
          </ul>
        </div>

        <div className={styles.channelCard}>
          <h5>SMS/Text Messages</h5>
          <ul>
            <li>Urgent appointment reminders</li>
            <li>Last-minute changes</li>
            <li>Travel time alerts</li>
            <li>Confirmation requests</li>
          </ul>
        </div>

        <div className={styles.channelCard}>
          <h5>Push Notifications</h5>
          <ul>
            <li>Mobile app alerts</li>
            <li>Real-time updates</li>
            <li>Quick actions</li>
            <li>Offline reminders</li>
          </ul>
        </div>

        <div className={styles.channelCard}>
          <h5>In-App Notifications</h5>
          <ul>
            <li>Dashboard alerts</li>
            <li>Calendar pop-ups</li>
            <li>Task reminders</li>
            <li>System messages</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ReportsTab = () => (
  <div className={styles.reportsTab}>
    <div className={styles.reportsOverview}>
      <h3>Calendar Reports & Analytics</h3>
      <p>Comprehensive insights into your scheduling patterns and productivity</p>
    </div>

    <div className={styles.reportTypes}>
      <h4>Report Categories</h4>
      <div className={styles.reportsGrid}>
        <div className={styles.reportCard}>
          <div className={styles.reportIcon}>
            <BarChart3 size={24} />
          </div>
          <h5>Productivity Reports</h5>
          <p>Track your time utilization and efficiency</p>
          <ul>
            <li>Appointment completion rates</li>
            <li>Time spent in meetings</li>
            <li>Productivity trends</li>
            <li>Efficiency metrics</li>
          </ul>
          <button className={styles.reportBtn}>
            <Download size={16} />
            Generate Report
          </button>
        </div>

        <div className={styles.reportCard}>
          <div className={styles.reportIcon}>
            <Users size={24} />
          </div>
          <h5>Team Performance</h5>
          <p>Monitor team scheduling and collaboration</p>
          <ul>
            <li>Team availability analysis</li>
            <li>Meeting participation rates</li>
            <li>Collaboration patterns</li>
            <li>Resource utilization</li>
          </ul>
          <button className={styles.reportBtn}>
            <Download size={16} />
            Generate Report
          </button>
        </div>

        <div className={styles.reportCard}>
          <div className={styles.reportIcon}>
            <MapPin size={24} />
          </div>
          <h5>Viewing Analytics</h5>
          <p>Analyze property viewing patterns and outcomes</p>
          <ul>
            <li>Viewing success rates</li>
            <li>Client engagement metrics</li>
            <li>Property performance</li>
            <li>Conversion tracking</li>
          </ul>
          <button className={styles.reportBtn}>
            <Download size={16} />
            Generate Report
          </button>
        </div>

        <div className={styles.reportCard}>
          <div className={styles.reportIcon}>
            <Calendar size={24} />
          </div>
          <h5>Schedule Analysis</h5>
          <p>Understand your scheduling patterns and optimization</p>
          <ul>
            <li>Peak scheduling times</li>
            <li>Gap analysis</li>
            <li>Conflict patterns</li>
            <li>Optimization opportunities</li>
          </ul>
          <button className={styles.reportBtn}>
            <Download size={16} />
            Generate Report
          </button>
        </div>
      </div>
    </div>

    <div className={styles.reportFeatures}>
      <h4>Advanced Reporting Features</h4>
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <h5>Custom Report Builder</h5>
          <ul>
            <li>Drag-and-drop report designer</li>
            <li>Custom metrics and KPIs</li>
            <li>Filtering and segmentation</li>
            <li>Chart and graph options</li>
          </ul>
        </div>

        <div className={styles.featureCard}>
          <h5>Scheduled Reports</h5>
          <ul>
            <li>Automated report generation</li>
            <li>Email delivery scheduling</li>
            <li>Multiple format support</li>
            <li>Recipient management</li>
          </ul>
        </div>

        <div className={styles.featureCard}>
          <h5>Data Export</h5>
          <ul>
            <li>Multiple export formats</li>
            <li>Bulk data download</li>
            <li>API access for integration</li>
            <li>Real-time data sync</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default CalendarSection;
