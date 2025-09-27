import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  SkipForward,
  HelpCircle,
  Home,
  Users,
  Building2,
  FileText,
  Calendar,
  Settings,
  BarChart3,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Shield,
  Globe,
  Database,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import styles from './TourGuide.module.css';

// Tour steps configuration
const TOUR_STEPS = {
  dashboard: [
    {
      id: 'dashboard-overview',
      title: 'Dashboard Overview',
      description: 'Welcome to your Real Estate CRM Dashboard! This is your command center where you can see all important metrics and quick actions.',
      target: '.dashboard-container',
      position: 'bottom',
      icon: <BarChart3 size={24} />,
      content: 'Here you can view your KPI submissions, recent activities, and overall performance metrics.'
    },
    {
      id: 'quick-actions',
      title: 'Quick Actions',
      description: 'Access frequently used functions quickly from the dashboard.',
      target: '.quick-actions',
      position: 'right',
      icon: <Plus size={24} />,
      content: 'Add new leads, properties, or projects with just one click.'
    }
  ],
  leads: [
    {
      id: 'leads-overview',
      title: 'Leads Management',
      description: 'Manage all your leads from various sources in one place.',
      target: '.leads-container',
      position: 'bottom',
      icon: <Users size={24} />,
      content: 'Track leads from WhatsApp, portal calls, and other sources. Monitor their status and progress.'
    },
    {
      id: 'add-lead',
      title: 'Add New Lead',
      description: 'Create new leads manually or import them from various sources.',
      target: '.add-lead-btn',
      position: 'left',
      icon: <Plus size={24} />,
      content: 'Click here to add a new lead with detailed information.'
    },
    {
      id: 'lead-filters',
      title: 'Lead Filtering',
      description: 'Use advanced filters to find specific leads quickly.',
      target: '.lead-filters',
      position: 'top',
      icon: <Search size={24} />,
      content: 'Filter leads by status, source, agent, or any other criteria.'
    }
  ],
  properties: [
    {
      id: 'properties-overview',
      title: 'Properties Management',
      description: 'Manage all your real estate properties and listings.',
      target: '.properties-container',
      position: 'bottom',
      icon: <Building2 size={24} />,
      content: 'View, add, edit, and manage all your property listings in one place.'
    },
    {
      id: 'property-types',
      title: 'Property Types',
      description: 'Different types of properties for different purposes.',
      target: '.property-types',
      position: 'right',
      icon: <Home size={24} />,
      content: 'Manage properties for sale, rent, or off-plan projects.'
    },
    {
      id: 'property-actions',
      title: 'Property Actions',
      description: 'Perform various actions on your properties.',
      target: '.property-actions',
      position: 'left',
      icon: <Eye size={24} />,
      content: 'View, edit, delete, or share your properties with clients.'
    }
  ],
  calendar: [
    {
      id: 'calendar-overview',
      title: 'Calendar Management',
      description: 'Schedule and manage appointments, viewings, and meetings.',
      target: '.calendar-container',
      position: 'bottom',
      icon: <Calendar size={24} />,
      content: 'Keep track of all your appointments and never miss important meetings.'
    },
    {
      id: 'add-event',
      title: 'Add Events',
      description: 'Create new calendar events and appointments.',
      target: '.add-event-btn',
      position: 'right',
      icon: <Plus size={24} />,
      content: 'Schedule viewings, meetings, or any other important events.'
    }
  ],
  admin: [
    {
      id: 'admin-overview',
      title: 'Admin Panel',
      description: 'Manage your organization settings and user permissions.',
      target: '.admin-container',
      position: 'bottom',
      icon: <Settings size={24} />,
      content: 'Configure system settings, manage users, and control access permissions.'
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Add, edit, and manage user accounts and roles.',
      target: '.user-management',
      position: 'right',
      icon: <Users size={24} />,
      content: 'Create new users, assign roles, and manage permissions.'
    }
  ],
  general: [
    {
      id: 'general-overview',
      title: 'General Settings',
      description: 'Configure your organization and system settings.',
      target: '.general-container',
      position: 'bottom',
      icon: <Settings size={24} />,
      content: 'Manage company information, areas, developers, and other general settings.'
    },
    {
      id: 'raise-issue',
      title: 'Raise Issues',
      description: 'Report bugs or request new features.',
      target: '.raise-issue-btn',
      position: 'left',
      icon: <HelpCircle size={24} />,
      content: 'Found a bug? Need a new feature? Click here to let us know!'
    }
  ]
};

const TourGuide = ({ 
  isOpen, 
  onClose, 
  currentSection = 'dashboard',
  autoStart = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [showProgress, setShowProgress] = useState(true);
  const [currentTour, setCurrentTour] = useState(currentSection);
  
  const tourSteps = TOUR_STEPS[currentTour] || TOUR_STEPS.dashboard;
  const totalSteps = tourSteps.length;
  
  const tourRef = useRef(null);
  const stepRefs = useRef({});

  useEffect(() => {
    if (isOpen && autoStart) {
      startTour();
    }
  }, [isOpen, autoStart]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const startTour = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setShowProgress(true);
  };

  const pauseTour = () => {
    setIsPlaying(false);
  };

  const resumeTour = () => {
    setIsPlaying(true);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    completeTour();
  };

  const completeTour = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    onClose();
    
    // Save tour completion status
    localStorage.setItem(`tour-${currentTour}-completed`, 'true');
  };

  const changeTour = (tourName) => {
    setCurrentTour(tourName);
    setCurrentStep(0);
    setShowProgress(true);
  };

  const currentStepData = tourSteps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Auto-advance if playing
  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) {
      const timer = setTimeout(() => {
        nextStep();
      }, 5000); // 5 seconds per step
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, totalSteps]);

  if (!isOpen) return null;

  return (
    <div className={styles.tourOverlay}>
      {/* Tour Modal */}
      <div className={styles.tourModal} ref={tourRef}>
        {/* Header */}
        <div className={styles.tourHeader}>
          <div className={styles.stepIndicator}>
            Step {currentStep + 1} of {totalSteps}
          </div>
          
          <div className={styles.tourControls}>
            {isPlaying ? (
              <button 
                onClick={pauseTour}
                className={styles.controlBtn}
                title="Pause Tour"
              >
                <Pause size={16} />
              </button>
            ) : (
              <button 
                onClick={resumeTour}
                className={styles.controlBtn}
                title="Resume Tour"
              >
                <Play size={16} />
              </button>
            )}
            
            <button 
              onClick={skipTour}
              className={styles.controlBtn}
              title="Skip Tour"
            >
              <SkipForward size={16} />
            </button>
            
            <button 
              onClick={onClose}
              className={styles.closeBtn}
              title="Close Tour"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tour Selection */}
        <div className={styles.tourSelection}>
          {Object.keys(TOUR_STEPS).map((tourName) => (
            <button
              key={tourName}
              onClick={() => changeTour(tourName)}
              className={`${styles.tourTab} ${currentTour === tourName ? styles.active : ''}`}
            >
              {getTourIcon(tourName)}
              <span>{tourName.charAt(0).toUpperCase() + tourName.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.tourContent}>
          <div className={styles.stepIcon}>
            {currentStepData?.icon}
          </div>
          
          <h2 className={styles.stepTitle}>
            {currentStepData?.title}
          </h2>
          
          <p className={styles.stepDescription}>
            {currentStepData?.description}
          </p>
          
          <div className={styles.stepContent}>
            {currentStepData?.content}
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.progressText}>
              {Math.round(progress)}% Complete
            </span>
          </div>
        )}

        {/* Navigation */}
        <div className={styles.tourNavigation}>
          <button
            onClick={previousStep}
            disabled={currentStep === 0}
            className={`${styles.navBtn} ${styles.prevBtn} ${currentStep === 0 ? styles.disabled : ''}`}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <button
            onClick={skipTour}
            className={styles.skipBtn}
          >
            Skip Tour
          </button>
          
          <button
            onClick={nextStep}
            className={`${styles.navBtn} ${styles.nextBtn}`}
          >
            {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Tour Spotlight */}
      {currentStepData?.target && (
        <div className={styles.spotlight} data-target={currentStepData.target}>
          <div className={styles.spotlightRing} />
        </div>
      )}
    </div>
  );
};

// Helper function to get tour icons
const getTourIcon = (tourName) => {
  const icons = {
    dashboard: <BarChart3 size={16} />,
    leads: <Users size={16} />,
    properties: <Building2 size={16} />,
    calendar: <Calendar size={16} />,
    admin: <Settings size={16} />,
    general: <Settings size={16} />
  };
  return icons[tourName] || <HelpCircle size={16} />;
};

export default TourGuide; 