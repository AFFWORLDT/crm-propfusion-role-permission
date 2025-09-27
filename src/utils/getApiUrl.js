const DEFAULT_API_URL = "https://onexproperty-api.propfusion.io";

export const getHostname = () => {
    const hostname = window.location.hostname;

    if (hostname === "crm.propfusion.io") {
        const organizationName = localStorage.getItem("organizationName");
        if (organizationName) {
            return organizationName;
        }
        return "test";
    }

    const parts = hostname.split(".");
    // Handle both 2-part (domain.tld) and 3-part (subdomain.domain.tld) hostnames
    if (parts.length >= 2) {
        // For 3-part hostname, get the domain part
        // For 2-part hostname, get the first part
        const domain = parts.length === 3 ? parts[1] : parts[0];
        
        if (parts.length === 3) {
            const subdomain = parts[0];
            if (subdomain === "portal") {
                return domain;
            } else if (subdomain.endsWith("-portal")) {
                return subdomain.replace("-portal", "");
            }
        }
        return domain;
    }

    return "test";
};

export const getApiUrl = () => {
    const hostname = window.location.hostname;

    // For localhost development, return the test API
    if (hostname.includes("localhost")) {
        return DEFAULT_API_URL;
    }

    // For Vercel deployments, always use the default API
    if (hostname.includes("vercel.app")) {
        return DEFAULT_API_URL;
    }

    // Check if domain is propfusion.io or www.propfusion.io
    if (hostname === "crm.propfusion.io") {
        const organizationName = localStorage.getItem("organizationName");
        if (organizationName) {
            return `https://${organizationName}-api.propfusion.io`;
        }
        return DEFAULT_API_URL;
    }

    // For other domains, use hostname parsing logic
    const parts = hostname.split(".");
    let apiHostname;

    // Handle cases where the hostname has exactly 3 parts (subdomain, domain, TLD)
    if (parts.length === 3) {
        const [subdomain, domain] = parts;

        if (subdomain === "portal") {
            apiHostname = `${domain}-api.propfusion.io`;
        } else if (subdomain.endsWith("-portal")) {
            const baseSubdomain = subdomain.replace("-portal", "");
            apiHostname = `${baseSubdomain}-api.propfusion.io`;
        } else {
            apiHostname = `${domain}-api.propfusion.io`;
        }
    } else {
        // Default case if the hostname does not match expected patterns
        console.warn("Unexpected hostname structure:", hostname);
        return DEFAULT_API_URL;
    }

    return `https://${apiHostname}`;
};