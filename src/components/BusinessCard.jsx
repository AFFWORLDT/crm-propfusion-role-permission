import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const BusinessCard = ({ data, side = 'front' }) => {
  
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generate affiliate registration URL
  const affiliateUrl = data?.id ? `https://partnership.onexproperty.com/apply?affiliate_id=${data.id}&roleid=108` : '';
  
  // Generate QR code
  useEffect(() => {
    const generateQRCode = async () => {
      if (!data?.id || !affiliateUrl) return;
      
      setIsGenerating(true);
      try {
        const qrDataURL = await QRCode.toDataURL(affiliateUrl, { 
          width: 150,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataURL(qrDataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRCode();
  }, [data?.id, affiliateUrl]);
  
  if (side === 'back') {
    return (
      <div
        style={{
          width: 580,
          height: 340,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          borderRadius: 16,
          background: `linear-gradient(135deg, ${data.themeColor || '#2d4263'} 0%, #1e2a3a 100%)`,
          overflow: 'hidden',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Subtle Pattern Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)
          `,
          zIndex: 1,
        }} />
        
        {/* Main Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}>
          {/* Company Logo - White on Dark Background */}
          <div style={{
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src={data.company_logo_url}
              alt="Company Logo"
              crossOrigin="anonymous"
              style={{ 
                height: 120, 
                maxWidth: '100%',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
              onError={(e) => {
                console.warn('Failed to load company logo:', data.company_logo_url);
                e.target.style.display = 'none';
              }}
            />
          </div>
          
          {/* Website */}
          <div style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 500,
            letterSpacing: '1px',
            textAlign: 'center',
            marginTop: '20px',
          }}>
            {"ONEXPROPERTY.COM"}
          </div>
        </div>
      </div>
    );
  }

  // Front side - Dark Design for White Logo
  return (
    <div
      style={{
        width: 580,
        height: 340,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        borderRadius: 16,
        background: `linear-gradient(135deg, ${data.themeColor || '#2d4263'} 0%, #1e2a3a 100%)`,
        overflow: 'hidden',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Subtle Pattern Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)
        `,
        zIndex: 1,
      }} />

      {/* Header Section with Logo */}
      <div style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 30px',
        position: 'relative',
        zIndex: 2,
      }}>
        <img
          src={data.company_logo_url}
          alt="Company Logo"
          crossOrigin="anonymous"
          style={{ 
            height: 48, 
            maxWidth: '140px',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
          }}
          onError={(e) => {
            console.warn('Failed to load company logo:', data.company_logo_url);
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Main Content Area - Two Column Layout */}
      <div style={{
        padding: '20px 30px',
        height: 'calc(100% - 60px)',
        display: 'flex',
        gap: '20px',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Left Side - Details */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingRight: '10px',
        }}>
          {/* Agent Name */}
          <div style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '6px',
            fontWeight: 700,
            textAlign: 'left',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            width: '100%',
          }}>
            {data.name || "Agent Name"}
          </div>

          {/* Title/Position */}
          <div style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '24px',
            fontWeight: 500,
            textAlign: 'left',
            letterSpacing: '0.5px',
            width: '100%',
            textTransform: 'uppercase',
          }}>
             {data.job_type}
          </div>

          {/* Contact Information */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'flex-start',
            width: '100%',
          }}>
            {/* Phone Number */}
            {data.phone && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 13,
                color: '#ffffff',
                gap: '10px',
              }}>
                <span style={{
                  fontSize: '14px',
                  lineHeight: '1',
                  flexShrink: 0,
                }}>
                  📞
                </span>
                <span style={{ 
                  fontWeight: 500,
                }}>
                  {data.phone}
                </span>
              </div>
            )}
            
            {/* Email */}
            {data.email && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 13,
                color: '#ffffff',
                gap: '10px',
              }}>
                <span style={{
                  fontSize: '14px',
                  lineHeight: '1',
                  flexShrink: 0,
                }}>
                  ✉️
                </span>
                <span style={{ 
                  fontWeight: 500,
                }}>
                  {data.email}
                </span>
              </div>
            )}
            
           
            
            {/* Website */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 12,
              color: '#ffffff',
              fontWeight: 500,
              letterSpacing: '0.5px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              marginTop: '4px',
              gap: '8px',
            }}>
              <span style={{
                fontSize: '14px',
                lineHeight: '1',
                flexShrink: 0,
              }}>
                🌐
              </span>
              <span>
                ONEXPROPERTY.COM
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - QR Code */}
        <div style={{
          width: '140px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '10px',
        }}>
          {isGenerating ? (
            <div style={{
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid rgba(255,255,255,0.9)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></div>
            </div>
          ) : qrCodeDataURL ? (
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: '8px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              <img
                src={qrCodeDataURL}
                alt="Affiliate QR Code"
                style={{
                  width: '120px',
                  height: '120px',
                  display: 'block',
                }}
              />
            </div>
          ) : (
            <div style={{
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              border: '2px dashed rgba(255,255,255,0.3)',
            }}>
              <div style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.6)',
                textAlign: 'center',
                padding: '8px',
              }}>
                QR Code
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'rgba(255,255,255,0.3)',
        zIndex: 2,
      }} />
      
      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BusinessCard;
