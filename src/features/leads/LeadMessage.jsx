import styles from "./LeadMessage.module.css";
import { ExternalLink } from "lucide-react";
import useAllDetails from "../all-details/useAllDetails";

function LeadMessage({ 
  message, 
  agentName , 
  phoneNumber
}) {
  const { data: companyData } = useAllDetails();

  const extractInfoFromMessage = (text) => {
    if (!text) return { link: '', refNumber: '', phone: '' };
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlMatches = text.match(urlRegex);
    const link = urlMatches ? urlMatches[0] : '';
    
    const refRegex = /Reference no\.: ([^\s]+)/i;
    const refMatch = text.match(refRegex);
    const refNumber = refMatch ? refMatch[1] : '';
    
    const phoneRegex = /(?:(?:\+|00)([1-9]\d{0,3}))?[-. (]*(\d{1,4})[-. )]*(\d{1,4})[-. ]*(\d{1,9})/g;
    const phoneMatches = text.match(phoneRegex);
    const phone = phoneMatches ? phoneMatches[0].replace(/[^0-9+]/g, '') : '';
    
    return { link, refNumber, phone };
  };

  const makeLinksClickable = (text) => {
    if (!text) return '';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.propertyLink}
          >
            {part} <ExternalLink size={14} className={styles.linkIcon} />
          </a>
        );
      }
      return part;
    });
  };
const companyName = companyData?.company_settings?.company_name
  const handleWhatsAppClick = () => {
    const { link, refNumber } = extractInfoFromMessage(message);
        const propertyLink =  link;
        const whatsappNumber = phoneNumber ;
    
    let whatsappMessage = `Hi I'm ${agentName} from ${companyName}\nYou enquired on my hot listing\n${propertyLink}`;
    
    if (refNumber) {
      whatsappMessage += `\nReference no.: ${refNumber}`;
    }
    
    let whatsappUrl = 'https://wa.me/';
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/^\+/, '');
      whatsappUrl += cleanNumber; 
    }
        whatsappUrl += `?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const { phone } = extractInfoFromMessage(message);
  const hasPhoneNumber = phoneNumber || phone;

  return (
    <div className="sectionDiv">
      <div className={styles.header}>
        <img src="/icons/description.svg" alt="" className={styles.headerIcon} />
        <h3>Lead Message</h3>
      </div>
      
      {message && (
        <div className={styles.messageContainer}>
          <p className={styles.messageText}>
            {makeLinksClickable(message)}
          </p>
        </div>
      )}

      <button 
        onClick={handleWhatsAppClick}
        className={styles.whatsappButton}
        title={hasPhoneNumber ? "Send WhatsApp to " + (phoneNumber || phone) : "Phone number not found"}
      >
        <img src="/icons/whatsapp/whatsapp.svg" alt="WhatsApp" className={styles.whatsappIcon} />
        {hasPhoneNumber ? null : "No Phone Number Found"}
      </button>
    </div>
  );
}

export default LeadMessage;