import React from 'react';

const BusinessCard = ({ data, side = 'front' }) => {
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
                height: 100, 
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
            ONEXPROPERTY.COM
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

      {/* Header Section with White Logo */}
      <div style={{
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Company Logo - White on Dark Background */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <img
            src={data.company_logo_url}
            alt="Company Logo"
            crossOrigin="anonymous"
            style={{ 
              height: 60, 
              maxWidth: '200px',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
            }}
            onError={(e) => {
              console.warn('Failed to load company logo:', data.company_logo_url);
              e.target.style.display = 'none';
            }}
          />
          <div style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '1px',
            textAlign: 'center',
          }}>
            {data.company_name}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        padding: '40px',
        height: 'calc(100% - 100px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Title/Position */}
        <div style={{
          fontSize: 24,
          color: 'rgba(255,255,255,0.9)',
          marginBottom: '40px',
          fontWeight: 600,
          textAlign: 'center',
        }}>
          Real Estate Professional
        </div>

        {/* Contact Information */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 16,
            color: '#ffffff',
            width: '100%',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              marginRight: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '20px',
              flexShrink: 0,
            }}>
              📞
            </div>
            <span style={{ fontWeight: 500, textAlign: 'left', flex: 1 }}>{data.phone}</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 16,
            color: '#ffffff',
            width: '100%',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              marginRight: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '20px',
              flexShrink: 0,
            }}>
              ✉
            </div>
            <span style={{ fontWeight: 500, wordBreak: 'break-all', textAlign: 'left', flex: 1 }}>{data.email}</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 16,
            color: '#ffffff',
            width: '100%',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              marginRight: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '20px',
              flexShrink: 0,
            }}>
              🌐
            </div>
            <span style={{ fontWeight: 500, textAlign: 'left', flex: 1 }}>ONEXPROPERTY.COM</span>
          </div>
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
    </div>
  );
};

export default BusinessCard;
