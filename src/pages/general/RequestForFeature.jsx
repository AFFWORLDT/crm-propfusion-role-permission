import  { useState, useEffect } from 'react';
import styles from './../../styles/FeatureRequest.module.css';
import SectionTop from '../../ui/SectionTop';
import Cookies from 'universal-cookie';
import TabBar from '../../ui/TabBar';
import { REQUEST_FEATURE_TABS } from '../../utils/constants';


const cookies = new Cookies();
const user=cookies.get("USER")
const RequestForFeature = () => {
  const [features, setFeatures] = useState([
    { 
      id: 1, 
      title: 'Dark Mode', 
      description: 'Implement a sleek dark theme to reduce eye strain and save battery life ', 
      votes: 42,
      votedBy: [] 
    },
    { 
      id: 2, 
      title: 'Mobile Responsiveness', 
      description: 'Enhance the user experience with a fully adaptive mobile design', 
      votes: 35,
      votedBy: [] 
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeature, setNewFeature] = useState({ title: '', description: '' });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (user.id) {
      setUserId(user.id);
    } else {
      const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(newUserId);
      localStorage.setItem('featureRequestUserId', newUserId);
    }
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFeatures = features.filter(feature => 
    feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFeature = () => {
    if (newFeature.title && newFeature.description) {
      setFeatures([
        ...features, 
        { 
          id: features.length + 1, 
          ...newFeature, 
          votes: 0,
          votedBy: []
        }
      ]);
      setNewFeature({ title: '', description: '' });
      setIsModalOpen(false);
    }
  };

  const handleVote = (id) => {
    setFeatures(features.map(feature => {
      if (feature.id === id) {
        // Toggle vote
        if (!feature.votedBy.includes(userId)) {
          return { 
            ...feature, 
            votes: feature.votes + 1,
            votedBy: [...feature.votedBy, userId]
          };
        } else {
          return { 
            ...feature, 
            votes: feature.votes - 1,
            votedBy: feature.votedBy.filter(user => user !== userId)
          };
        }
      }
      return feature;
    }));
  };

  return (
    <div className="sectionContainer">
    <SectionTop heading="Request Feature">
      <TabBar
        tabs={REQUEST_FEATURE_TABS}
        activeTab={"REQUEST_FEATURE"}
        navigateTo={(id) => REQUEST_FEATURE_TABS.find(tab => tab.id === id)?.path || '/admin/general/request-feature'}
      />
    </SectionTop>

    <section className="sectionStyles" style={{ backgroundColor: REQUEST_FEATURE_TABS[0].bgColor }}>
    <div className={styles.container} style={{
        backgroundColor:REQUEST_FEATURE_TABS[0].bgColor,
        height : "100vh"
    }}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.gradientText}>Feature Playground</h1>
          <p>Shape the future of our platform. Vote and suggest features that matter to you.</p>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search features..." 
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className={styles.addFeatureBtn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.addIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Request Feature
          </button>
        </div>
      </div>

      <div className={styles.featureList}>
        {filteredFeatures.map(feature => (
          <div key={feature.id} className={styles.featureCard}>
            <div className={styles.featureContent}>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
            <div className={styles.featureActions}>
              <button 
                onClick={() => handleVote(feature.id)}
                className={`${styles.voteBtn} ${feature.votedBy.includes(userId) ? styles.voted : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.voteIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.576 2.022L7 11h7z" />
                </svg>
                {feature.votes} Votes
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button 
              className={styles.closeModal}
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2>Propose a New Feature</h2>
            <p>Your innovative ideas help us improve!</p>
            <input 
              type="text" 
              placeholder="Feature Title"
              value={newFeature.title}
              onChange={(e) => setNewFeature({...newFeature, title: e.target.value})}
              className={styles.modalInput}
            />
            <textarea 
              placeholder="Describe your feature in detail..."
              value={newFeature.description}
              onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
              className={styles.modalTextarea}
            />
            <div className={styles.modalActions}>
              <button 
                onClick={handleAddFeature}
                className={styles.submitBtn}
              >
                Submit Feature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </section>
    </div>
  );
};

export default RequestForFeature;