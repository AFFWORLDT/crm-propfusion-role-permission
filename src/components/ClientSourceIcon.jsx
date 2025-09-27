import { LinkedIn, Telegram, Twitter, YouTube, YoutubeSearchedForRounded } from "@mui/icons-material";
import { ArrowUpRight, Database, Globe, LinkedinIcon } from "lucide-react";

const ClientSourceIcon = ({
    source,
    leadMessage,
    agentName,
    phoneNumber,
    companyLogo,
}) => {
    const getIconPath = () => {
        switch ((source || "").toLowerCase()) {
            case "property_finder":
                return "/icons/property-finder.png";
            case "bayut":
                return "/icons/bayut.png";
            case "dubizzle":
                return "/icons/dubizzle.png";
            case "whatsapp":
                return "/icons/whatsapp/whatsapp.svg";
            case "Facebook":
                return "/images/facebook.avif";
            case "company website" || "website":
                return companyLogo || null; // Will use Globe icon as fallback
            case "company app":
                return companyLogo || null; // Will use Globe icon as fallback
            case "company database":
                return companyLogo || "/icons/database.svg";
            default:
                return null;
        }
    };

    const extractLink = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/;
        const match = text?.match(urlRegex);
        return match ? match[0] : null;
    };

    const link = extractLink(leadMessage);

    const handleClick = () => {
        if (link) {
            window.open(link, "_blank");
        }
    };

    const iconPath = getIconPath();
    const showDatabaseIcon =
        (source || "").toLowerCase() === "company database" && !companyLogo;
    const showWebsiteIcon =
        (source || "").toLowerCase() === "company website" || (source || "").toLowerCase() === "website" && !companyLogo;
    const showFacebookIcon = (source || "").toLowerCase() === "facebook";
    const showMetaAdsIcon = (source || "").toLowerCase() === "meta ads";
    const showInstagramIcon = (source || "").toLowerCase() === "instagram";
    const showPropertyOwnerIcon = source === "Property Owner";
    const showGoogleIcon = source === "Google";
    const showZoomIcon = source === "Zoom";
    const showClientReferralIcon = source === "Client Referral";
    const showPersonalReferralIcon = source === "Personal Referral";
    const showFriendIcon = source === "Friend";
    const showYouTubeIcon = source === "YouTube";
    const showTwitterIcon = source === "Twitter";
    const showTelegramIcon = source === "Telegram";
    const showLinkedInIcon = source === "LinkedIn";

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                cursor: link ? "pointer" : "default",
            }}
            onClick={handleClick}
        >
            <div
                style={{
                    position: "relative",
                    width: 20,
                    height: 20,
                    marginRight: "10px",
                }}
            >
                {iconPath ? (
                    <img
                        title="source"
                        src={iconPath}
                        alt={source}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            borderRadius: "4px",
                        }}
                    />
                ) : showDatabaseIcon ? (
                    <Database size={20} color="#4f46e5" />
                ) : showWebsiteIcon ? (
                    <Globe size={20} color="#2563eb" />
                ) : showFacebookIcon ? (
                    <img
                        src="/images/facebook.avif"
                        alt="Facebook"
                        style={{ width: 20, height: 20 }}
                    />
                ) : showMetaAdsIcon ? (
                    <img
                        src="/icons/meta.png"
                        alt="Meta Ads"
                        style={{ width: 20, height: 20 }}
                    />
                ) : showInstagramIcon ? (
                    <img
                        src="/icons/instagram.png"
                        alt="Instagram"
                        style={{ width: 20, height: 20 }}
                    />
                ) : showPropertyOwnerIcon ? (
                    <img
                        src="/icons/property-owner.svg"
                        alt="Property Owner"
                        style={{ width: 20, height: 20 }}
                    />
                )  : showGoogleIcon ? (
                    <img
                        src="/icons/google.png"
                        alt="Google"
                        style={{ width: 20, height: 20 }}
                    />
                ) : showLinkedInIcon ? (
                    <LinkedIn size={22} color="#1691d3" />
                ) : showZoomIcon ? (
                    <img
                        src="/icons/zoom.svg"
                        alt="Zoom"
                        style={{ width: 20, height: 20 }}
                    />
                ) : showClientReferralIcon ? (
                    <img
                        src="/icons/referral.svg"
                        alt="Client Referral"
                        style={{ width: 20, height: 20 }}
                    />
                ) : showPersonalReferralIcon ? (
                    <img
                        src={"/icons/personal-referral.svg"}
                        alt="Personal Referral"
                        style={{ width: 20, height: 20 }}
                    />
                ) : showFriendIcon ? (
                    <img
                        src={"/icons/friend.svg"}
                        alt="Friend"
                        style={{ width: 20, height: 20 }}
                    />
                ) : showPropertyOwnerIcon ? (
                    <img
                        src={"/icons/owner.svg"}
                        alt="Property Owner"
                        style={{ width: 20, height: 20 }}
                    />
                ) : showYouTubeIcon ? (
                    <YouTube size={20} color="#ff0000" />
                ) : showTwitterIcon ? (
                    <Twitter size={20} color="#1691d3" />
                ) : showTelegramIcon ? (
                    <Telegram size={20} color="#1691d3" />
                ) : (
                    <span>{source ? source?.charAt(0).toUpperCase()  : "Other"}</span>
                )}
                {link && (
                    <ArrowUpRight
                        size={14}
                        color="white"
                        style={{
                            backgroundColor: "#3b82f6", // Tailwind's blue-500
                            borderRadius: "9999px",
                            padding: "2px",
                            position: "absolute",
                            top: -6,
                            right: -6,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ClientSourceIcon;
