import { useState, useEffect } from 'react'
import SectionTop from '../ui/SectionTop'
import QRCode from 'qrcode'
import { Download, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import useAllDetails from '../features/all-details/useAllDetails'

function Affiliate() {
const {data}=useAllDetails()
  const [qrCodeDataURL, setQrCodeDataURL] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const currentUser=data?.current_user_details
console.log(currentUser)
  // Generate affiliate registration URL
  const affiliateUrl = `https://partnership.onexproperty.com/apply?affiliate_id=${currentUser?.id}&roleid=108`

  // Generate QR code
  useEffect(() => {
    const generateQRCode = async () => {
      if (!currentUser?.id) return
      
      setIsGenerating(true)
      try {
        const qrDataURL = await QRCode.toDataURL(affiliateUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrCodeDataURL(qrDataURL)
      } catch (error) {
        console.error('Error generating QR code:', error)
        toast.error('Failed to generate QR code')
      } finally {
        setIsGenerating(false)
      }
    }

    generateQRCode()
  }, [currentUser?.id, affiliateUrl])

  // Copy affiliate link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(affiliateUrl)
      toast.success('Affiliate link copied to clipboard!')
    } catch (err) {
      console.error("Failed to copy: ", err)
      toast.error('Failed to copy link')
    }
  }

  // Download QR code
  const handleDownloadQR = () => {
    if (!qrCodeDataURL) {
      toast.error('QR code not ready yet')
      return
    }

    const link = document.createElement('a')
    link.download = `affiliate-qr-code-${currentUser?.name || 'user'}.png`
    link.href = qrCodeDataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('QR code downloaded!')
  }

  return (
    <div className='sectionContainer'>
      <SectionTop heading='Affiliate' />
      <section className='sectionStyles'>
      <div style={{
        padding: '2rem',
        backgroundColor: '#f5f4fa',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 0.5rem 0'
            }}>
              Your Affiliate Link
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '16px',
              margin: 0
            }}>
              Share this link to invite new agents to join your team
            </p>
          </div>

         

          {/* Affiliate Link */}
          <div style={{
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 1rem 0'
            }}>
              Affiliate Registration Link
            </h3>
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '1rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                flex: 1,
                fontSize: '14px',
                color: '#374151',
                fontFamily: 'monospace',
                wordBreak: 'break-all',
                lineHeight: '1.5'
              }}>
                {affiliateUrl}
              </div>
              <button
                onClick={handleCopyLink}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6'
                }}
              >
                <Copy size={16} />
                Copy
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          <div style={{
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 1.5rem 0'
            }}>
              QR Code
            </h3>
            
            {isGenerating ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '3rem',
                color: '#6b7280'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid #e5e7eb',
                  borderTop: '2px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '0.75rem'
                }}></div>
                Generating QR code...
              </div>
            ) : qrCodeDataURL ? (
              <div>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  marginBottom: '1.5rem'
                }}>
                  <img
                    src={qrCodeDataURL}
                    alt="Affiliate QR Code"
                    style={{
                      width: '300px',
                      height: '300px',
                      display: 'block'
                    }}
                  />
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={handleDownloadQR}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem 1.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '16px',
                      fontWeight: '500',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#10b981'
                    }}
                  >
                    <Download size={20} />
                    Download QR Code
                  </button>
                  
                 
                </div>
              </div>
            ) : (
              <div style={{
                padding: '3rem',
                color: '#6b7280'
              }}>
                Failed to generate QR code
              </div>
            )}
          </div>

          {/* Instructions */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#fef3c7',
            borderRadius: '12px',
            border: '1px solid #f59e0b'
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#92400e',
              margin: '0 0 0.75rem 0'
            }}>
              How to use your affiliate link:
            </h4>
            <ul style={{
              margin: 0,
              paddingLeft: '1.5rem',
              color: '#92400e',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              <li>Share the link or QR code with potential agents</li>
              <li>When they register using your link, they&apos;ll be automatically assigned to your team</li>
              <li>You can track their performance and earnings in your dashboard</li>
              <li>The QR code can be printed or shared digitally for easy access</li>
            </ul>
          </div>
          </div>
        </div>
      </section>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Affiliate
