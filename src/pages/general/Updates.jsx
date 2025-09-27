/* eslint-disable no-unused-vars */
import  { useState } from 'react';
import { AlertCircle, Check, Clock, Sparkles, Rocket, UserPlus } from 'lucide-react';
import styles from './../../styles/Updates.module.css';
import SectionTop from '../../ui/SectionTop';
import TabBar from '../../ui/TabBar';
import { UPDATES_TABS } from '../../utils/constants';

function Updates() {
  const [showBetaForm, setShowBetaForm] = useState(false);

  const updates = [
    {
      id: 1,
      date: 'November 26, 2024',
      title: 'New Design System Launch',
      description: 'Implemented a comprehensive design system with improved typography, spacing, and color schemes for better visual consistency across the platform.',
      type: 'design',
      status: 'completed'
    },
    {
      id: 2,
      date: 'November 24, 2024',
      title: 'AI-Powered Search Beta',
      description: 'Launching beta testing for our new AI-powered search feature. Join the beta program to try it out and provide feedback!',
      type: 'beta',
      status: 'in-progress',
      isBeta: true
    },
    {
      id: 3,
      date: 'November 22, 2024',
      title: 'Mobile Responsive Updates',
      description: 'Improved mobile experience with better navigation, touch-friendly interfaces, and optimized layouts for different screen sizes.',
      type: 'design',
      status: 'completed'
    },
    {
      id: 4,
      date: 'November 20, 2024',
      title: 'Dark Mode Implementation',
      description: 'Currently working on system-wide dark mode support with smooth transitions and consistent color schemes.',
      type: 'feature',
      status: 'in-progress'
    }
  ];

  const upcomingFeatures = [
    {
      id: 1,
      title: 'Real-time Collaboration',
      description: 'Work together with your team in real-time with live cursors and instant updates.',
      estimatedRelease: 'December 2024'
    },
    {
      id: 2,
      title: 'Advanced Analytics Dashboard',
      description: 'Get deeper insights into your project metrics with our new analytics dashboard.',
      estimatedRelease: 'January 2025'
    }
  ];

 

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check className={styles.statusCompleted} />;
      case 'in-progress':
        return <Clock className={styles.statusInProgress} />;
      default:
        return <AlertCircle className={styles.statusPending} />;
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'design':
        return styles.tagDesign;
      case 'technical':
        return styles.tagTechnical;
      case 'feature':
        return styles.tagFeature;
      case 'beta':
        return styles.tagBeta;
      case 'upcoming':
        return styles.tagUpcoming;
      default:
        return '';
    }
  };

  return (
    <div className="sectionContainer">
    <SectionTop heading="Updates">
      <TabBar
        tabs={UPDATES_TABS}
        activeTab={"UPDATES"}
        navigateTo={(id) => UPDATES_TABS.find(tab => tab.id === id)?.path || '/admin/general/updates'}
      />
    </SectionTop>

    <section className="sectionStyles" style={{ backgroundColor: UPDATES_TABS[0].bgColor }}>
    <div className={styles.container} style={{
      backgroundColor: UPDATES_TABS[0].bgColor,
      height: "100vh"
    }}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
         <div style={{display:"flex", gap:"7px"}}>
         <Sparkles size={32} className={styles.statusCompleted} />
         <h1 className={styles.title}>Recent Updates</h1>
         </div>
          <button 
            className={styles.joinBetaButton}
            onClick={() => setShowBetaForm(true)}
          >
            <UserPlus size={16} />
            Join Beta Program
          </button>
        </div>

        <div className={styles.updateGrid}>
          {updates.map((update) => (
            <div key={update.id} className={styles.updateCard}>
              <div className={styles.cardHeader}>
                <span className={styles.date}>
                  {update.date}
                  {update.isBeta && <span className={styles.betaBadge}>BETA</span>}
                </span>
                {getStatusIcon(update.status)}
              </div>
              
              <h2 className={styles.cardTitle}>{update.title}</h2>
              <p className={styles.description}>{update.description}</p>
              
              <div className={styles.footer}>
                <span className={`${styles.tag} ${getTypeClass(update.type)}`}>
                  {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Features Section */}
        <div className={styles.feedbackSection}>
          <div className={styles.sectionTitle}>
            <Rocket size={24} className={styles.statusInProgress} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Upcoming Features
          </div>
          <div className={styles.updateGrid}>
            {upcomingFeatures.map((feature) => (
              <div key={feature.id} className={styles.updateCard}>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.description}>{feature.description}</p>
                <div className={styles.footer}>
                  <span className={`${styles.tag} ${styles.tagUpcoming}`}>
                    Coming {feature.estimatedRelease}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div> 
      </div>
    </div>
    </section>
    </div>
  );
}

export default Updates;