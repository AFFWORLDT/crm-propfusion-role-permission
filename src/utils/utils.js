import { PAGE_SIZE } from "../utils/constants";
import { getApiUrl } from "./getApiUrl";

export function buildUrl(resource, filters = {}, fetchAll) {
    let url = `${getApiUrl()}/${resource}?`;
    const params = [];
    if (fetchAll) {
        params.push(`size=1000`);
    } else if (!('size' in filters)) {
        params.push(`size=${PAGE_SIZE}`);
    }
    for (const [key, val] of Object.entries(filters)) {
        if (val !== undefined && val !== null && val !== "") {
            params.push(`${key}=${encodeURIComponent(val)}`);
        }
    }
    url += params.join('&');
    return url;
}

export function buildUrlforLeads(resource, filters, fetchAll) {
    let url = `${getApiUrl()}/${resource}?size=${fetchAll ? 1000 : 200}`;

    for (const [key, val] of Object.entries(filters)) {
        if (val) {
            url += `&${key}=${val}`;
        }
    }

    return url;
}

export function formatNum(number) {
    return new Intl.NumberFormat("en-US").format(number);
}

export function secondsToHMS(secondsInput) {
    const hours = Math.floor(secondsInput / 3600);
    const minutes = Math.floor((secondsInput % 3600) / 60);
    const seconds = secondsInput % 60;

    const pad = (num) => String(num).padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function dateToYMD(dateString) {
    const dateObj = new Date(dateString);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const date = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${date}`;
}

export function formatMonthYear(dateString) {
    const dateObj = new Date(dateString);
    const monthNames = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    
    const year = dateObj.getFullYear();
    const month = monthNames[dateObj.getMonth()];
    
    return `${month} ${year}`;
}

export function getDaysFromCurrentDate(date) {
    return Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
}

export function bedroomString(roomNum) {
    return roomNum === 0 ? "Studio" : roomNum || "N/A";
}

export function formatLocationsOptions(data) {
    return data.map((obj) => {
        return {
            value: {
                id: obj.id || null,
                city: obj.city || null,
                community: obj.community || null,
                sub_community: obj.sub_community || null,
                property_name: obj.property_name || null,
                latitude: obj.latitude || null,
                longitude: obj.longitude || null
            },
            label: `${obj?.property_name ? obj.property_name + ", " : ""}${obj?.sub_community ? obj.sub_community + ", " : ""}${obj?.community ? obj.community + ", " : ""}${obj?.city ? obj.city : ""}`,
            // Store the full object in a separate property for access if needed
            data: obj
        };
    });
}

export function formatLocationsCommunityOptions(data) {
    return data.map((obj) => {
        return {
            value: {
                id: obj.id || null,
                city: obj.city || null,
                community: obj.community || null,
                sub_community: obj.sub_community || null,
                property_name: obj.property_name || null,
                latitude: obj.latitude || null,
                longitude: obj.longitude || null
            },
            label: `${obj?.property_name ? obj.property_name + ", " : ""}${obj?.sub_community ? obj.sub_community + ", " : ""}${obj?.community ? obj.community + ", " : ""}${obj?.city ? obj.city : ""}`,
            // Store the full object in a separate property for access if needed
            data: obj
        };
    });
}

export function formatLocationsCommunityOptionsForProperties(data) {
    return data?.map((obj) => {
        return {
            value: obj?.name,
            label: `${obj?.name ? obj.name + " " : ""}${obj?.property_name ? obj.property_name + ", " : ""}${obj?.sub_community ? obj.sub_community + ", " : ""}${obj?.community ? obj.community + ", " : ""}${obj?.city ? obj.city : ""}`,
        };
    });
}

export function formatLocationsForMetaAds(data) {
    return data?.map((obj) => {
        return {
            value: {
                id: obj.id || null,
                city: obj.city || null,
                community: obj.community || null,
                sub_community: obj.sub_community || null,
                property_name: obj.property_name || null,
                latitude: obj.latitude || null,
                longitude: obj.longitude || null
            },
            label: `${obj?.name ? obj.name + ", " : ""}${obj?.property_name ? obj.property_name + ", " : ""}${obj?.sub_community ? obj.sub_community + ", " : ""}${obj?.community ? obj.community + ", " : ""}${obj?.city ? obj.city : ""}`,
            // Store the full object in a separate property for access if needed
            data: obj
        };
    });
}

export function formatLocationsForChangeAreaAgent(data) {
    return data?.map((obj) => {
        return {
            value: obj.name,
            label: `${obj?.name ? obj.name + ", " : ""}${obj?.property_name ? obj.property_name + ", " : ""}${obj?.sub_community ? obj.sub_community + ", " : ""}${obj?.community ? obj.community + ", " : ""}${obj?.city ? obj.city : ""}`,
        };
    });
}

export const formateBayutLocationOptions = (data) => {
    return data.map((obj) => {
        return {
            value: {
                id: obj.id || null,
                hierarchy: obj.hierarchy || null,
                city: obj.city || null,
                community: obj.community || null,
                sub_community: obj.sub_community || null,
                property_name: obj.property_name || null,
                latitude: obj.latitude || null,
                longitude: obj.longitude || null
            },
            label: `${obj.hierarchy}`,
            // Store the full object in a separate property for access if needed
            data: obj
        };
    });
};

export const formateAgentOptions = (data) => {
    return data.map((obj) => {
        return {
            value: obj.id,
            label: `${obj.name}`,
        };
    });
};

export const formatLocationOptionsForCity = (data) => {
    return data.map((obj) => {
        return {
            value: obj.city,
            label: obj.city,
        };
    });
};

export const formatLocationOptionsForCommunity = (data) => {
    return data.map((obj) => {
        return {
            value: obj.community,
            label: obj.community,
        };
    });
};

export const formatLocationOptionsForSubCommunity = (data) => {
    return data.map((obj) => {
        return {
            value: obj.sub_community,
            label: obj.sub_community,
        };
    });
};

export const formatLocationOptionsForProperty = (data) => {
    return data.map((obj) => {
        return {
            value: obj.property_name,
            label: obj.property_name,
        };
    });
};

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function checkUnauthorized(status, cookies) {
    if (status === 401 || !cookies.get("USER")) {
        cookies.remove("USER", { path: "/" });
        localStorage.removeItem("CRMUSER");
        window.location.replace("/login");
        throw new Error("You're not authorized. Please Log in again!");
    }
}

export function capitalizeFirstLetter(str) {
    if (!str) return "-";
    return str.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


export const formatForumOptionsForLeades = (data) => {
    console.log(data)
    return data?.forums?.map((obj) => {
        return {
            value: obj.name,
            label: obj.name,
        };
    });
};

export const formateDevelopersOptions = (data) => {
    return data.map((obj) => {
        return {
            value: obj.id,
            label: `${obj.name}`,
        };
    });
};
