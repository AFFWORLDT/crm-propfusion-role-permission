// Social Media Sharing Utility
export const socialMediaPlatforms = {
    facebook: {
        name: 'Facebook',
        icon: '/icons/meta.png',
        color: '#1877F2',
        shareUrl: (url, text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
    },
    linkedin: {
        name: 'LinkedIn',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDhDMTcuNjU2OSA4IDE5IDkuMzQzMTUgMTkgMTFWMTZIMTdWMTFDMTcgMTAuNDQ3NyAxNi41NTIzIDEwIDE2IDEwQzE1LjQ0NzcgMTAgMTUgMTAuNDQ3NyAxNSAxMVYxNkgxM1YxMUMxMyA5LjM0MzE1IDE0LjM0MzEgOCAxNiA4WiIgZmlsbD0iIzBBNjZDMiIvPgo8cGF0aCBkPSJNMTAgMTBIMTFWMTZIMTBWMTBaIiBmaWxsPSIjMEE2NkMyIi8+CjxwYXRoIGQ9Ik0xMC41IDlDMTEuMzI4NCA5IDEyIDguMzI4NDMgMTIgNy41QzEyIDYuNjcxNTcgMTEuMzI4NCA2IDEwLjUgNkM5LjY3MTU3IDYgOSA2LjY3MTU3IDkgNy41QzkgOC4zMjg0MyA5LjY3MTU3IDkgMTAuNSA5WiIgZmlsbD0iIzBBNjZDMiIvPgo8cGF0aCBkPSJNMTIgMkM2LjQ3NyAyIDIgNi40NzcgMiAxMkMyIDE3LjUyMyA2LjQ3NyAyMiAxMiAyMkMxNy41MjMgMjIgMjIgMTcuNTIzIDIyIDEyQzIyIDYuNDc3IDE3LjUyMyAyIDEyIDJaIiBzdHJva2U9IiMwQTY2QzIiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K',
        color: '#0A66C2',
        shareUrl: (url, text) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
    },
    twitter: {
        name: 'Twitter',
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjI0NDMgNy4yMTQyOUwxNi4zNzUgMTUuNzE0M0gxNC4xMjVMMTYuMzc1IDcuMjE0MjlIMTguMjQ0M1oiIGZpbGw9IiMxREExRjIiLz4KPHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJDMiAxNy41MjMgNi40NzcgMjIgMTIgMjJDMTcuNTIzIDIyIDIyIDE3LjUyMyAyMiAxMkMyMiA2LjQ3NyAxNy41MjMgMiAxMiAyWiIgc3Ryb2tlPSIjMURBMUYyIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg==',
        color: '#1DA1F2',
        shareUrl: (url, text) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    },
    whatsapp: {
        name: 'WhatsApp',
        icon: '/icons/whatsapp.svg',
        color: '#25D366',
        shareUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    },
    telegram: {
        name: 'Telegram',
        icon: '/icons/telegram.png',
        color: '#0088CC',
        shareUrl: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    },
    instagram: {
        name: 'Instagram',
        icon: '/icons/instagram.png',
        color: '#E4405F',
        shareUrl: (url, text) => `https://www.instagram.com/?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
    },
    email: {
        name: 'Email',
        icon: '/icons/mail.svg',
        color: '#EA4335',
        shareUrl: (url, text) => `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent('Check out this property: ' + url)}`
    }
};

export const shareToSocialMedia = (platform, url, text = '') => {
    const platformConfig = socialMediaPlatforms[platform];
    if (!platformConfig) {
        console.error(`Unknown platform: ${platform}`);
        return;
    }

    const shareUrl = platformConfig.shareUrl(url, text);
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
};

export const generateShareText = (property) => {
    if (!property) return '';
    
    // Check if it's a project or property
    const isProject = !property.listingType && (property.name || property.projectStatus);
    
    if (isProject) {
        // Handle project data
        const title = property.name || property.title || 'Amazing Project';
        const price = property.newParam?.price ? `AED ${property.newParam.price.toLocaleString()} Starting` : '';
        const location = property.location?.community || property.location?.sub_community || property.area || '';
        const developer = property.developer?.name || '';
        const handover = property.newParam?.handoverTime ? new Date(property.newParam.handoverTime).getFullYear() : '';
        
        let text = `🏗️ ${title}`;
        if (price) text += ` | ${price}`;
        if (location) text += ` | 📍 ${location}`;
        if (developer) text += ` | 🏢 ${developer}`;
        if (handover) text += ` | 📅 ${handover}`;
        
        return text;
    } else {
        // Handle property data
        const title = property.title || 'Amazing Property';
        const price = property.price || (property.newParam && property.newParam.price) ? `AED ${(property.price || (property.newParam && property.newParam.price)).toLocaleString()}` : '';
        const location = property.location || property.area || (property.newParam && property.newParam.location) || '';
        const bedrooms = property.bedrooms || (property.newParam && property.newParam.bedrooms) || '';
        const bathrooms = property.bathrooms || (property.newParam && property.newParam.bathrooms) || '';
        
        let text = `🏠 ${title}`;
        if (price) text += ` | ${price}`;
        if (location) text += ` | 📍 ${location}`;
        if (bedrooms) text += ` | 🛏️ ${bedrooms} bed`;
        if (bathrooms) text += ` | 🚿 ${bathrooms} bath`;
        
        return text;
    }
};

export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
    }
}; 