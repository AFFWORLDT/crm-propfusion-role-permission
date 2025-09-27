import  { useState } from 'react';
import styles from './../../styles/Support.module.css';
import SectionTop from '../../ui/SectionTop';
import TabBar from '../../ui/TabBar';
import { SUPPORT_TABS } from '../../utils/constants';

function Support() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const faqItems = [
    {
      question: "How do I create an account?",
      answer: "Click on the 'Sign Up' button in the top right corner, fill out the required information, and verify your email address."
    },
    {
      question: "How can I reset my password?",
      answer: "Go to the login page and click on 'Forgot Password'. Follow the instructions sent to your registered email."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers."
    },
    {
      question: "Is my personal information secure?",
      answer: "We use state-of-the-art encryption and follow strict data protection guidelines to ensure your personal information remains confidential and secure."
    }
  ];

  const userManual = [
    {
      title: "Account Setup",
      steps: [
        "Open the website in your browser",
        "Click on 'Create Account' in the top right corner",
        "Fill out the registration form with your personal details",
        "Verify your email address by clicking the link sent to your inbox",
        "Complete your profile by adding additional information"
      ]
    },
    {
      title: "Navigation",
      steps: [
        "Use the main menu located at the top of the page",
        "Hover over menu items to see dropdown options",
        "Click on the desired section to navigate",
        "Use the search bar to quickly find specific features or content"
      ]
    },
    {
      title: "Using Core Features",
      steps: [
        "Select the feature you want to use from the main menu",
        "Read the instructions carefully before proceeding",
        "Fill out any required forms or input fields",
        "Review your inputs before submitting",
        "Check your email or notifications for confirmation"
      ]
    }
  ];

  const contactInfo = [
    {
      icon: "✉️",
      title: "Email Support",
      details: "Supportcrm@Propfusion.io",
      description: "Respond within 24 hours"
    },
    {
      icon: "📞",
      title: "Phone Support",
      details: "+971542997582",
      description: "Monday-Friday, 9am-5pm EST"
    },
    {
      icon: "💬",
      title: "Live Chat",
      details: "Chat Now",
      description: "Instant support available"
    }
  ];

  const handleFaqToggle = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="sectionContainer">
      <SectionTop heading="Support">
        <TabBar
          tabs={SUPPORT_TABS}
          activeTab={"SUPPORT"}
          navigateTo={(id) => SUPPORT_TABS.find(tab => tab.id === id)?.path || '/admin/general/support'}
        />
      </SectionTop>
      <section className="sectionStyles" style={{ backgroundColor: SUPPORT_TABS[0].bgColor }}>
        <div className={styles.supportContainer} style={{
          backgroundColor: SUPPORT_TABS[0].bgColor,
          height: "100vh"
        }}>
          <header className={styles.header}>
            <h1>Support Center</h1>
            <p>We are here to help you get the most out of our website</p>
          </header>

          <section className={styles.quickLinks}>
            <h2>Quick Links</h2>
            <div className={styles.linkGrid}>
              <a href="#" className={styles.quickLink}>Getting Started</a>
              <a href="#" className={styles.quickLink}>Account Settings</a>
              <a href="#" className={styles.quickLink}>Billing Information</a>
              <a href="#" className={styles.quickLink}>Contact Support</a>
            </div>
          </section>

          <section className={styles.faq}>
            <h2>Frequently Asked Questions</h2>
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`${styles.faqItem} ${openFaqIndex === index ? styles.open : ''}`}
              >
                <div 
                  className={styles.faqQuestion}
                  onClick={() => handleFaqToggle(index)}
                >
                  {item.question}
                  <span className={styles.faqToggleIcon}>
                    {openFaqIndex === index ? '−' : '+'}
                  </span>
                </div>
                {openFaqIndex === index && (
                  <div className={styles.faqAnswer}>
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </section>

          <section className={styles.userGuide}>
            <h2>Comprehensive User Manual</h2>
            {userManual.map((section, sectionIndex) => (
              <div key={sectionIndex} className={styles.guideSection}>
                <h3 className={styles.guideSectionTitle}>{section.title}</h3>
                <ol className={styles.guideSteps}>
                  {section.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className={styles.guideStep}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </section>

          <section className={styles.contactSupport}>
            <h2>Contact Support</h2>
            <div className={styles.contactInfo}>
              {contactInfo.map((contact, index) => (
                <div key={index} className={styles.contactInfoItem}>
                  <div className={styles.icon}>{contact.icon}</div>
                  <h3>{contact.title}</h3>
                  <p>{contact.details}</p>
                  <p>{contact.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default Support;