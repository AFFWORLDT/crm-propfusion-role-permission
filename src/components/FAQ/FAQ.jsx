import React, { useState, useEffect } from 'react';
import { fetchFAQs } from '../../services/faqService';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setLoading(true);
        const data = await fetchFAQs();
        setFaqs(data.faqs);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.faqs.map(faq => faq.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError('Failed to load FAQs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  if (loading) {
    return <div className="faq-loading">Loading FAQs...</div>;
  }

  if (error) {
    return <div className="faq-error">{error}</div>;
  }

  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>
      
      <div className="faq-categories">
        <button 
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="faq-list">
        {filteredFaqs.map((faq, index) => (
          <div key={faq.id} className="faq-item">
            <div 
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <h3>{faq.question}</h3>
              <span className={`faq-icon ${activeIndex === index ? 'active' : ''}`}>
                {activeIndex === index ? '−' : '+'}
              </span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ; 