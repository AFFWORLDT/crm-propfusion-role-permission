import  { useState } from 'react';
import { Calendar, MapPin, Building2, User, ChevronLeft, ChevronRight, Tag, Clock } from 'lucide-react';
import styles from './ReadblogPage.module.css';

const ReadBlogPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const blogData = {
    agency_name: "Affworld Luxury Real Estate",
    area: "Dubai Marina, Dubai",
    category: "Luxury Real Estate",
    content: `Dubai's luxury real estate market continues to evolve and exceed expectations in 2024. The emirate's strategic location, world-class infrastructure, and tax-friendly environment have made it a magnet for high-net-worth individuals and investors worldwide.

    One of the most striking developments is the integration of sustainable technology in luxury properties. From solar-powered amenities to smart home systems that optimize energy consumption, Dubai's premium properties are setting new standards in eco-conscious luxury living.

    The Dubai Marina area, in particular, has seen remarkable growth, with property values appreciating by 15% in the past year alone. The combination of stunning waterfront views, premium dining options, and excellent connectivity has made it one of the most sought-after locations for luxury real estate investment.

    Market analysts predict this upward trend will continue, supported by Dubai's robust economic policies and its growing status as a global business hub. For investors and homebuyers alike, the Dubai luxury real estate market represents an opportunity to be part of one of the world's most dynamic property markets.`,
    created_at: "2024-11-25T10:46:54.836000",
    created_by: "Sarah Anderson",
    developer: "Damac Properties",
    id: "vKsOu2",
    name: "Dubai's Luxury Real Estate Market: A 2024 Perspective",
    readTime: "5 min read",
    tags: ["Luxury Real Estate", "Investment", "Dubai Property", "Market Analysis"]
  };

  const images = [
    "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg",
    "https://www.travelpayouts.com/blog/wp-content/uploads/2021/02/blog-images.png",
    "https://img.freepik.com/free-photo/online-blog_53876-123696.jpg",
    "https://cdn.pixabay.com/photo/2017/05/30/03/58/blog-2355684_640.jpg"
  ];

  const thumbnails = [
    "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg",
    "https://www.travelpayouts.com/blog/wp-content/uploads/2021/02/blog-images.png",
    "https://img.freepik.com/free-photo/online-blog_53876-123696.jpg",
    "https://cdn.pixabay.com/photo/2017/05/30/03/58/blog-2355684_640.jpg"
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className={styles.container}>
      {/* Image Slider */}
      <div className={styles.sliderContainer}>
        <div className={styles.slide}>
          <img
            src={images[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
          />
        </div>
        
        <button 
          onClick={prevSlide}
          className={`${styles.sliderButton} ${styles.prevButton}`}
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={nextSlide}
          className={`${styles.sliderButton} ${styles.nextButton}`}
        >
          <ChevronRight size={24} />
        </button>

        <div className={styles.indicators}>
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.indicator} ${
                idx === currentSlide ? styles.indicatorActive : ''
              }`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.categoryWrapper}>
          <span className={styles.category}>
            {blogData.category}
          </span>
          <span className={styles.readTime}>
            <Clock size={16} />
            {blogData.readTime}
          </span>
        </div>
        <h1 className={styles.title}>{blogData.name}</h1>
        <div className={styles.metadata}>
          <div className={styles.metaItem}>
            <Calendar size={18} />
            <span>{formatDate(blogData.created_at)}</span>
          </div>
          <div className={styles.metaItem}>
            <User size={18} />
            <span>{blogData.created_by}</span>
          </div>
        </div>
      </header>

      {/* Agency Info */}
      <div className={styles.agency}>
        <h2 className={styles.agencyTitle}>{blogData.agency_name}</h2>
        <div className={styles.location}>
          <MapPin size={18} />
          <span>{blogData.area}</span>
        </div>
        <div className={styles.location}>
          <Building2 size={18} />
          <span>Developer: {blogData.developer}</span>
        </div>
      </div>

      {/* Tags */}
      <div className={styles.tags}>
        {blogData.tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            <Tag size={16} />
            {tag}
          </span>
        ))}
      </div>

      {/* Main Content */}
      <article className={styles.content}>
        {blogData.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph.trim()}</p>
        ))}
      </article>

      {/* Thumbnails Grid */}
      <div className={styles.thumbnailGrid}>
        {thumbnails.map((thumb, idx) => (
          <div key={idx} className={styles.thumbnailWrapper}>
            <img
              src={thumb}
              alt={`Thumbnail ${idx + 1}`}
              className={styles.thumbnail}
            />
            <div className={styles.thumbnailOverlay} />
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      {/* Footer */}
      <footer className={styles.source}>
        <p>
          Source:{' '}
          <a 
            href={blogData.sources} 
            className={styles.sourceLink} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Affworld Blog
          </a>
        </p>
      </footer>
    </div>
  );
};

export default ReadBlogPage;