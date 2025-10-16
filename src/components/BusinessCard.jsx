import React from 'react';

const BusinessCard = ({ data, side = 'front' }) => {
  if (side === 'back') {
    return (
      <div
        style={{
          width: 580,
          height: 340,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          borderRadius: 20,
          background: '#ffffff',
          overflow: 'hidden',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          position: 'relative',
          border: '2px solid rgba(0,0,0,0.1)',
          transform: 'none',
        }}
      >
        {/* Background Grid Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          opacity: 0.8,
        }} />
        
        {/* Main Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}>
          {/* Logo */}
          <div style={{
            marginBottom: '35px',
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
                transform: 'none',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
              }}
              onError={(e) => {
                console.warn('Failed to load company logo:', data.company_logo_url);
                e.target.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Company logo loaded successfully:', data.company_logo_url);
              }}
            />
          </div>
          
          {/* Company Name */}
          {/* <div style={{ 
            fontWeight: 900, 
            fontSize: 36, 
            marginBottom: 15,
            textAlign: 'center',
            color: '#1a1a1a',
            letterSpacing: '-1px',
            lineHeight: 1.1,
            transform: 'none',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            {data.company_name}
          </div> */}
          
        </div>
        
        {/* Bottom Dark Blue Bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(135deg, #2d4263 0%, #1e2a3a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'none',
          boxShadow: '0 -8px 20px rgba(45, 66, 99, 0.4)',
        }}>
          <div style={{
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: '1px',
            textAlign: 'center',
            transform: 'none',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>
            {data.website}
          </div>
        </div>
      </div>
    );
  }

  // Front side - Wave Design
  return (
    <div
      style={{
        width: 580,
        height: 340,
        boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
        borderRadius: 24,
        background: '#ffffff',
        overflow: 'hidden',
        fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        border: '3px solid rgba(0,0,0,0.05)',
        transform: 'none',
      }}
    >
      {/* Wave Design Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(135deg, #2d4263 0%, #1e2a3a 50%, #2d4263 100%),
          radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(255,255,255,0.05) 0%, transparent 50%)
        `,
        clipPath: 'polygon(0% 0%, 75% 0%, 85% 15%, 80% 35%, 85% 55%, 80% 75%, 85% 100%, 0% 100%)',
        transform: 'none',
      }} />
      
      {/* Secondary Wave Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)
        `,
        clipPath: 'polygon(0% 0%, 70% 0%, 78% 12%, 73% 32%, 78% 52%, 73% 72%, 78% 100%, 0% 100%)',
        transform: 'none',
      }} />
      
      {/* Tertiary Wave Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)
        `,
        clipPath: 'polygon(0% 0%, 65% 0%, 72% 10%, 67% 30%, 72% 50%, 67% 70%, 72% 100%, 0% 100%)',
        transform: 'none',
      }} />

      {/* Left Section - Personal Information */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '75%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '45px 50px',
        transform: 'none',
        zIndex: 2,
      }}>
        {/* Personal Name */}
        <div style={{ 
          fontWeight: 800, 
          fontSize: 36, 
          marginBottom: 8,
          color: '#ffffff',
          letterSpacing: '-1px',
          lineHeight: 1.1,
          textAlign: 'left',
          transform: 'none',
          textShadow: '0 4px 12px rgba(0,0,0,0.4)',
          fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          {data.name}
        </div>
        
        
        {/* Contact Information */}
        <div style={{
          fontSize: 15,
          lineHeight: 1.8,
          transform: 'none',
          marginTop: 20,
        }}>
          <div style={{ 
            marginBottom: 16, 
            display: 'flex', 
            alignItems: 'center',
            transform: 'none',
          }}>
            <span style={{ 
              marginRight: 16, 
              fontSize: 20,
              transform: 'none',
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}>📞</span>
            <span style={{ 
              color: '#ffffff',
              transform: 'none',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontWeight: 500,
              fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            }}>{data.phone}</span>
          </div>
          <div style={{ 
            marginBottom: 16, 
            display: 'flex', 
            alignItems: 'center',
            transform: 'none',
          }}>
            <span style={{ 
              marginRight: 16, 
              fontSize: 20,
              transform: 'none',
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}>✉</span>
            <span style={{ 
              color: '#ffffff',
              transform: 'none',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontWeight: 500,
              wordBreak: 'break-all',
              fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            }}>{data.email}</span>
          </div>
          <div style={{ 
            marginBottom: 16, 
            display: 'flex', 
            alignItems: 'center',
            transform: 'none',
          }}>
            <span style={{ 
              marginRight: 16, 
              fontSize: 20,
              transform: 'none',
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}>🌐</span>
            <span style={{ 
              color: '#ffffff',
              transform: 'none',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontWeight: 500,
              fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            }}>{data.website}</span>
          </div>
        </div>
      </div>

      {/* Right Section - Company Branding */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: '25%',
        height: '100%',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 25px',
        transform: 'none',
        zIndex: 1,
      }}>
        {/* Subtle pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 30% 20%, rgba(45, 66, 99, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(45, 66, 99, 0.03) 0%, transparent 50%)
          `,
          transform: 'none',
        }} />
        
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          textAlign: 'center',
          transform: 'none',
        }}>
          {/* Company Logo */}
          <div style={{
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'none',
          }}>
            <img
              src={data.company_logo_url}
              alt="Company Logo"
              crossOrigin="anonymous"
              style={{ 
                height: 70, 
                maxWidth: '100%',
                objectFit: 'contain',
                transform: 'none',
                filter: 'drop-shadow(0 6px 20px rgba(45, 66, 99, 0.2))',
              }}
              onError={(e) => {
                console.warn('Failed to load company logo:', data.company_logo_url);
                e.target.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Company logo loaded successfully:', data.company_logo_url);
              }}
            />
          </div>
          
          {/* Company Name */}
          {/* <div style={{ 
            fontWeight: 800, 
            fontSize: 16, 
            marginBottom: 8,
            color: '#2d4263',
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
            textAlign: 'center',
            transform: 'none',
            textShadow: '0 1px 3px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
            fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
          }}>
            {data.company_name}
          </div> */}
          
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
