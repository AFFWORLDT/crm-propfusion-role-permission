import { ExternalLink, Facebook, Instagram, MessageCircle, Linkedin, Youtube, Music } from 'lucide-react';
import styles from './LinkTree.module.css';

const LinkTree = () => {
    console.log('LinkTree component rendering');
    
    // Default URLs - can be customized later via admin settings
    const defaultUrls = {
        company_website: 'https://onexproperties.com',
        academy_url: 'https://onexproperties.com/academy',
        real_estate_url: 'https://onexproperties.com/real-estate',
        media_url: 'https://onexproperties.com/media',
        facebook_url: 'https://facebook.com/onexproperties',
        instagram_url: 'https://instagram.com/onexproperties',
        whatsapp_url: 'https://wa.me/1234567890',
        linkedin_url: 'https://linkedin.com/company/onexproperties',
        youtube_url: 'https://youtube.com/@onexproperties',
        tiktok_url: 'https://tiktok.com/@onexproperties'
    };
    
    // Company links - can be customized via settings or hardcoded
    const companyLinks = [
        {
            id: 1,
            title: 'OneX Company Profile',
            url: defaultUrls.company_website,
            icon: 'profile'
        },
        {
            id: 2,
            title: 'OneX Academy',
            url: defaultUrls.academy_url,
            icon: 'academy'
        },
        {
            id: 3,
            title: 'OneX Real Estate',
            url: defaultUrls.real_estate_url,
            icon: 'estate'
        },
        {
            id: 4,
            title: 'OneX Real Partnership',
            url: '/packages',
            icon: 'partnership'
        },
        {
            id: 5,
            title: 'Website',
            url: defaultUrls.company_website,
            icon: 'website'
        },
        {
            id: 6,
            title: 'OneX In Media',
            url: defaultUrls.media_url,
            icon: 'media'
        }
    ];

    // Social media links
    const socialLinks = [
        {
            id: 'facebook',
            name: 'Facebook',
            url: defaultUrls.facebook_url,
            icon: Facebook,
            color: '#1877F2'
        },
        {
            id: 'instagram',
            name: 'Instagram',
            url: defaultUrls.instagram_url,
            icon: Instagram,
            color: '#E4405F'
        },
        {
            id: 'whatsapp',
            name: 'WhatsApp',
            url: defaultUrls.whatsapp_url,
            icon: MessageCircle,
            color: '#25D366'
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            url: defaultUrls.linkedin_url,
            icon: Linkedin,
            color: '#0077B5'
        },
        {
            id: 'youtube',
            name: 'YouTube',
            url: defaultUrls.youtube_url,
            icon: Youtube,
            color: '#FF0000'
        },
        {
            id: 'tiktok',
            name: 'TikTok',
            url: defaultUrls.tiktok_url,
            icon: Music,
            color: '#000000'
        }
    ];

    const handleLinkClick = (url) => {
        if (url && url !== '#') {
            if (url.startsWith('http')) {
                window.open(url, '_blank', 'noopener,noreferrer');
            } else {
                window.location.href = url;
            }
        }
    };

    return (
        <div className={styles.linkTreeContainer}>
            <div className={styles.background}>
                <div className={styles.glowEffect}></div>
            </div>
            
            <div className={styles.content}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.slogan}>
                        Learn. <span className={styles.italic}>Succeed.</span>
                    </h1>
                </div>

                {/* Logo and Menu Card */}
                <div className={styles.menuCard}>
                    <div className={styles.logoSection}>
                        <div className={styles.logo}>
                            <span className={styles.logoOneX}>ONEX</span>
                            <span className={styles.logoProperties}>PROPERTIES</span>
                        </div>
                    </div>

                    <div className={styles.linksList}>
                        {companyLinks.map((link) => (
                            <button
                                key={link.id}
                                className={styles.linkButton}
                                onClick={() => handleLinkClick(link.url)}
                            >
                                {link.title}
                                <ExternalLink size={18} className={styles.linkIcon} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Social Media Section */}
                <div className={styles.socialSection}>
                    <p className={styles.socialTitle}>
                        FOLLOW US ON OUR <span className={styles.highlight}>SOCIALS</span>
                    </p>
                    <div className={styles.socialIcons}>
                        {socialLinks.map((social) => {
                            const IconComponent = social.icon;
                            return (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialIcon}
                                    style={{ '--icon-color': social.color }}
                                    onClick={(e) => {
                                        if (social.url === '#') {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <IconComponent size={24} />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkTree;

