import { useEffect } from "react";
import { 
    Sparkles,
    ExternalLink
} from "lucide-react";
import styles from "./SocialMediaLinks.module.css";

const SocialMediaLinks = () => {
    // Load Facebook SDK
    useEffect(() => {
        if (window.FB) {
            window.FB.XFBML.parse();
            return;
        }
        
        window.fbAsyncInit = function() {
            window.FB.init({
                xfbml: true,
                version: 'v18.0'
            });
            window.FB.XFBML.parse();
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, []);

    // Load Twitter widget
    useEffect(() => {
        if (window.twttr) {
            window.twttr.widgets.load();
        } else {
            const script = document.createElement('script');
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            script.charset = "utf-8";
            document.body.appendChild(script);
        }
    }, []);

    // Load Pinterest script
    useEffect(() => {
        if (document.querySelector('script[src*="pinterest.com/js/pinit"]')) return;
        
        const script = document.createElement('script');
        script.src = "https://assets.pinterest.com/js/pinit.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const socialLinks = [
        {
            id: "facebook",
            name: "Facebook",
            url: "https://www.facebook.com/onexproperty/",
            pageUrl: "https://www.facebook.com/onexproperty/"
        },
        {
            id: "instagram",
            name: "Instagram",
            url: "https://www.instagram.com/onexproperty/",
            embedUrl: "https://www.instagram.com/onexproperty/embed/"
        },
        {
            id: "youtube",
            name: "YouTube",
            url: "https://www.youtube.com/watch?v=W237WIdUol0",
            channelId: "@onexproperties",
            // YouTube video embed
            embedUrl: "https://www.youtube.com/embed/W237WIdUol0?si=03T8L1Sh8sNz4H1O"
        },
        {
            id: "pinterest",
            name: "Pinterest",
            url: "https://jp.pinterest.com/onexproperties/",
            embedUrl: "https://assets.pinterest.com/js/pinit.js"
        }
    ];

    return (
        <div className={styles.socialMediaLinks}>
            <div className={styles.header}>
                <div className={styles.headerIcon}>
                    <Sparkles className={styles.sparkleIcon} />
                </div>
                <div className={styles.headerContent}>
                    <h2 className={styles.title}>Connect With Us</h2>
                    <p className={styles.subtitle}>Follow OneX Property on social media</p>
                </div>
            </div>

            <div className={styles.socialGrid}>
                {socialLinks.map((social) => {
                    // Facebook Embed
                    if (social.id === "facebook") {
                        return (
                            <div key={social.id} className={`${styles.socialCard} ${styles.embedCard}`}>
                                <div className={styles.embedHeader}>
                                    <h3 className={styles.embedTitle}>{social.name}</h3>
                                    <a 
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.embedLink}
                                    >
                                        <ExternalLink className={styles.embedIcon} />
                                    </a>
                                </div>
                                <div className={styles.embedContainer}>
                                    <div 
                                        className="fb-page" 
                                        data-href={social.pageUrl}
                                        data-tabs="timeline"
                                        data-width="340"
                                        data-height="500"
                                        data-small-header="false"
                                        data-adapt-container-width="true"
                                        data-hide-cover="false"
                                        data-show-facepile="true"
                                    >
                                        <blockquote cite={social.pageUrl} className="fb-xfbml-parse-ignore">
                                            <a href={social.pageUrl}>OneX Property</a>
                                        </blockquote>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // Instagram Embed
                    if (social.id === "instagram") {
                        return (
                            <div key={social.id} className={`${styles.socialCard} ${styles.embedCard}`}>
                                <div className={styles.embedHeader}>
                                    <h3 className={styles.embedTitle}>{social.name}</h3>
                                    <a 
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.embedLink}
                                    >
                                        <ExternalLink className={styles.embedIcon} />
                                    </a>
                                </div>
                                <div className={styles.embedContainer}>
                                    <iframe
                                        src={social.embedUrl}
                                        width="340"
                                        height="400"
                                        frameBorder="0"
                                        scrolling="no"
                                        allow="encrypted-media"
                                        title="Instagram Profile"
                                    ></iframe>
                                </div>
                            </div>
                        );
                    }

                    // YouTube Embed - Shows channel videos
                    if (social.id === "youtube") {
                        return (
                            <div key={social.id} className={`${styles.socialCard} ${styles.embedCard}`}>
                                <div className={styles.embedHeader}>
                                    <h3 className={styles.embedTitle}>{social.name}</h3>
                                    <a 
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.embedLink}
                                    >
                                        <ExternalLink className={styles.embedIcon} />
                                    </a>
                                </div>
                                <div className={styles.embedContainer}>
                                    {/* YouTube Video Embed */}
                                    <iframe
                                        width="560"
                                        height="315"
                                        src={social.embedUrl}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        title="YouTube video player"
                                    ></iframe>
                                </div>
                            </div>
                        );
                    }

                    // Twitter/X Embed
                    if (social.id === "twitter") {
                        return (
                            <div key={social.id} className={`${styles.socialCard} ${styles.embedCard}`}>
                                <div className={styles.embedHeader}>
                                    <h3 className={styles.embedTitle}>{social.name}</h3>
                                    <a 
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.embedLink}
                                    >
                                        <ExternalLink className={styles.embedIcon} />
                                    </a>
                                </div>
                                <div className={styles.embedContainer}>
                                    <a
                                        className="twitter-timeline"
                                        data-height="500"
                                        data-theme="light"
                                        href={`https://twitter.com/${social.username}`}
                                    >
                                        Tweets by {social.username}
                                    </a>
                                </div>
                            </div>
                        );
                    }

                    // Pinterest Embed
                    if (social.id === "pinterest") {
                        return (
                            <div key={social.id} className={`${styles.socialCard} ${styles.embedCard}`}>
                                <div className={styles.embedHeader}>
                                    <h3 className={styles.embedTitle}>{social.name}</h3>
                                    <a 
                                        href={social.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.embedLink}
                                    >
                                        <ExternalLink className={styles.embedIcon} />
                                    </a>
                                </div>
                                <div className={styles.embedContainer}>
                                    <a
                                        data-pin-do="embedUser"
                                        data-pin-board-width="340"
                                        data-pin-scale-height="500"
                                        data-pin-scale-width="340"
                                        href={social.url}
                                    ></a>
                                </div>
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
        </div>
    );
};

export default SocialMediaLinks;

