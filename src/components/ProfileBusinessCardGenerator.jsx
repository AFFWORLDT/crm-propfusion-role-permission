import React, { useState, useRef } from 'react';
import { getStaff } from '../services/apiStaff';
import { fetchCurrentLoggedInUserAllData } from '../services/apiAllData';
import BusinessCard from './BusinessCard';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ProfileBusinessCardGenerator = ({ currentUser, colorCode }) => {
  const [cardData, setCardData] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSide, setCurrentSide] = useState('front');
  const [isFlipping, setIsFlipping] = useState(false);
  const frontPdfRef = useRef();
  const backPdfRef = useRef();
  const cardRef = useRef();
  
  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [lastTap, setLastTap] = useState(0);

  const fetchData = async () => {
    if (!currentUser?.id) {
      toast.error("User ID not found. Please try logging in again.");
      return;
    }

    setLoading(true);
    try {
      // Fetch agent data and company data in parallel using existing API services
      const [agent, allData] = await Promise.all([
        getStaff(currentUser.id),
        fetchCurrentLoggedInUserAllData()
      ]);

      const companySettings = allData?.company_settings || {};

      // Prepare card data with dynamic values from API
      const cardData = {
        name: agent.name || 'Admin',
        email: agent.email || 'user@example.com',
        phone: agent.phone || '+91 952932 8188',
        website: companySettings.website || 'www.example.com',
        company_name: companySettings.company_name || 'Company Name',
        company_logo_url: companySettings.company_logo_url || 
          'https://via.placeholder.com/150x150?text=Logo',
      };

      setCardData(cardData);
      setShowDialog(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data for business card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!frontPdfRef.current || !backPdfRef.current) return;

    try {
      // Wait longer to ensure elements are fully rendered and images are loaded
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Pre-load images to ensure they're available for PDF generation
      const preloadImages = async (urls) => {
        const promises = urls.map(url => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
          });
        });
        return Promise.all(promises);
      };

      // Pre-load company logo
      if (cardData?.company_logo_url) {
        try {
          await preloadImages([cardData.company_logo_url]);
        } catch (error) {
          console.warn('Failed to preload logo:', error);
        }
      }

      // Generate canvas for both sides with improved settings
      const [frontCanvas, backCanvas] = await Promise.all([
        html2canvas(frontPdfRef.current, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true, // Allow taint for better rendering
          backgroundColor: '#ffffff',
          logging: true, // Enable logging to debug
          width: 580,
          height: 340,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 580,
          windowHeight: 340,
          foreignObjectRendering: true, // Better text rendering
          removeContainer: false, // Keep container
          imageTimeout: 15000, // Increase timeout for image loading
        }),
        html2canvas(backPdfRef.current, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true, // Allow taint for better rendering
          backgroundColor: '#ffffff',
          logging: true, // Enable logging to debug
          width: 580,
          height: 340,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 580,
          windowHeight: 340,
          foreignObjectRendering: true, // Better text rendering
          removeContainer: false, // Keep container
          imageTimeout: 15000, // Increase timeout for image loading
        })
      ]);

      // Check if canvas has content
      console.log('Front canvas dimensions:', frontCanvas.width, 'x', frontCanvas.height);
      console.log('Back canvas dimensions:', backCanvas.width, 'x', backCanvas.height);

      if (frontCanvas.width === 0 || frontCanvas.height === 0 || 
          backCanvas.width === 0 || backCanvas.height === 0) {
        throw new Error('Canvas is empty - elements may not be visible');
      }

      // Create PDF with both sides
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // Standard business card size
      });

      // Add front side
      const frontImgData = frontCanvas.toDataURL('image/png', 1.0); // Use PNG for better quality
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(frontImgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Add back side as new page
      pdf.addPage();
      const backImgData = backCanvas.toDataURL('image/png', 1.0); // Use PNG for better quality
      pdf.addImage(backImgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      pdf.save('business-card.pdf');
      
      toast.success('Business card (both sides) downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download PDF. Please try again.');
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setCardData(null);
    setCurrentSide('front');
  };

  const toggleSide = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCurrentSide(currentSide === 'front' ? 'back' : 'front');
    setTimeout(() => setIsFlipping(false), 600);
  };

  // Double tap handling
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      toggleSide();
    }
    setLastTap(now);
  };

  // Swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSide === 'front') {
      toggleSide();
    } else if (isRightSwipe && currentSide === 'back') {
      toggleSide();
    }
  };

  return (
    <div>
      {/* Generate Business Card Button */}
      <div className="profileActions" style={{ marginTop: '16px' }}>
        <button
          style={{
            background: colorCode,
            width: '100%',
            padding: '12px',
            borderRadius: '5px',
            color: '#fff',
            fontWeight: 600,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onClick={fetchData}
          disabled={loading}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          {loading ? 'Generating...' : 'Generate Business Card'}
        </button>
      </div>

      {/* Business Card Modal */}
      {showDialog && cardData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: '#fff',
            padding: '32px',
            borderRadius: '16px',
            minWidth: '750px',
            maxWidth: '95vw',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Close button */}
            <button
              onClick={handleCloseDialog}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0f0f0';
                e.target.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#666';
              }}
            >
              ×
            </button>

            {/* Modal Header */}
            <div style={{
              marginBottom: '24px',
              textAlign: 'center',
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 700,
                color: '#333',
                marginBottom: '8px',
              }}>
                Your Business Card
              </h3>
              <p style={{
                margin: 0,
                color: '#666',
                fontSize: '14px',
              }}>
                Preview and download your personalized business card
              </p>
            </div>

            {/* Side Toggle Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '20px',
              gap: '12px',
            }}>
              <button
                onClick={() => setCurrentSide('front')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: currentSide === 'front' ? colorCode : '#f0f0f0',
                  color: currentSide === 'front' ? '#fff' : '#666',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
              >
                Front Side
              </button>
              <button
                onClick={toggleSide}
                disabled={isFlipping}
                style={{
                  padding: '8px 12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isFlipping ? '#e0e0e0' : '#f0f0f0',
                  color: '#666',
                  fontWeight: 600,
                  cursor: isFlipping ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isFlipping ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
                title="Flip Card"
              >
                🔄
              </button>
              <button
                onClick={() => setCurrentSide('back')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: currentSide === 'back' ? colorCode : '#f0f0f0',
                  color: currentSide === 'back' ? '#fff' : '#666',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
              >
                Back Side
              </button>
            </div>

            {/* Business Card Preview */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '24px',
              padding: '30px',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderRadius: '16px',
              border: '2px dashed #e3f2fd',
              minHeight: '480px',
              position: 'relative',
              gap: '20px',
            }}>
              {/* Hidden elements for PDF generation */}
              <div style={{ display: 'none' }}>
                <div ref={frontPdfRef}>
                  <BusinessCard data={cardData} side="front" />
                </div>
                <div ref={backPdfRef}>
                  <BusinessCard data={cardData} side="back" />
                </div>
              </div>
              
              {/* Left Arrow Button */}
              <button
                onClick={() => setCurrentSide(currentSide === 'front' ? 'back' : 'front')}
                disabled={isFlipping}
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isFlipping ? '#e0e0e0' : '#2d4263',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: isFlipping ? 'not-allowed' : 'pointer',
                  fontSize: '20px',
                  transition: 'all 0.3s ease',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(45, 66, 99, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!isFlipping) {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 6px 20px rgba(45, 66, 99, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isFlipping) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(45, 66, 99, 0.3)';
                  }
                }}
                title="Previous Side"
              >
                ◀
              </button>
              
              {/* Interactive Card Container */}
              <div
                ref={cardRef}
                style={{
                  transform: 'none', // Remove any rotation to prevent text reversal
                  transition: isFlipping ? 'transform 0.6s ease-in-out' : 'transform 0.3s ease',
                  transformStyle: 'preserve-3d',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onClick={handleDoubleTap}
                onMouseEnter={(e) => {
                  if (!isFlipping) {
                    e.target.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isFlipping) {
                    e.target.style.transform = 'scale(1)';
                  }
                }}
                title="Double tap or swipe to flip card"
              >
                <BusinessCard data={cardData} side={currentSide} />
              </div>
              
              {/* Right Arrow Button */}
              <button
                onClick={() => setCurrentSide(currentSide === 'front' ? 'back' : 'front')}
                disabled={isFlipping}
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isFlipping ? '#e0e0e0' : '#2d4263',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: isFlipping ? 'not-allowed' : 'pointer',
                  fontSize: '20px',
                  transition: 'all 0.3s ease',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(45, 66, 99, 0.3)',
                }}
                onMouseEnter={(e) => {
                  if (!isFlipping) {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 6px 20px rgba(45, 66, 99, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isFlipping) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(45, 66, 99, 0.3)';
                  }
                }}
                title="Next Side"
              >
                ▶
              </button>
              
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
            }}>
              <button
                onClick={handleDownloadPDF}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  background: colorCode,
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span>📄</span>
                Download PDF (Both Sides)
              </button>
              <button
                onClick={handleCloseDialog}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  background: '#f5f5f5',
                  color: '#333',
                  border: '1px solid #e0e0e0',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e0e0e0';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f5f5f5';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBusinessCardGenerator;
