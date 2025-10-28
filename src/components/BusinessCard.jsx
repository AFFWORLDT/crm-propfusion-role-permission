import React from 'react';

const BusinessCard = ({ data, side = 'front' }) => {
  console.log("BusinessCard received data:", data);
  console.log("Agent name in BusinessCard:", data?.name);
  
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

      {/* Header Section with Logo */}
      <div style={{
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        position: 'relative',
        zIndex: 2,
      }}>
        <img
          src={data.company_logo_url}
          alt="Company Logo"
          crossOrigin="anonymous"
          style={{ 
            height: 45, 
            maxWidth: '160px',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
          }}
          onError={(e) => {
            console.warn('Failed to load company logo:', data.company_logo_url);
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Main Content Area */}
      <div style={{
        padding: '0 40px',
        height: 'calc(100% - 80px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        
        {/* Agent Name */}
        <div style={{
          fontSize: 24,
          color: 'rgba(255,255,255,0.95)',
          marginBottom: '8px',
          fontWeight: 700,
          textAlign: 'center',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}>
          {data.name || "Agent Name"}
        </div>

        {/* Title/Position */}
        <div style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.8)',
          marginBottom: '50px',
          fontWeight: 500,
          textAlign: 'center',
          letterSpacing: '0.5px',
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
          maxWidth: '350px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 14,
            color: '#ffffff',
            width: '100%',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              marginRight: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '14px',
              flexShrink: 0,
            }}>
              📞
            </div>
            <span style={{ fontWeight: 500, textAlign: 'left', flex: 1 }}>{data.phone}</span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 14,
            color: '#ffffff',
            width: '100%',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              marginRight: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '14px',
              flexShrink: 0,
            }}>
              ✉
            </div>
            <span style={{ fontWeight: 500, wordBreak: 'break-all', textAlign: 'left', flex: 1 }}>{data.email}</span>
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
