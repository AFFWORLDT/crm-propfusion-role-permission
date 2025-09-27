import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";
import toast from "react-hot-toast";

const cookies = new Cookies();

export async function fetchBayutLeadSyncer() {
    const url = `${getApiUrl()}/integration/bayut_leads_syncer`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(
                errorDetails.message || "Could not sync Bayut & Dubizzle leads"
            );
        }
    } catch (err) {
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function unSubscribePage(pageId) {
    const url = `${getApiUrl()}/unsubscribe-page?page_id=${pageId}`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }

        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(
                errorDetails.message || "Could not sync Bayut & Dubizzle leads"
            );
        }
    } catch (err) {
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function fetchPropertyFinderLeadSyncer() {
    const url = `${getApiUrl()}/integration/pf_leads_syncer`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(
                errorDetails.message || "Could not sync Property Finder leads"
            );
        }
    } catch (err) {
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function fetchBayutWPLeadSync() {
    const url = `${getApiUrl()}/integration/bayut_whatsapp_leads_syncer`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }

        // Perform the API call
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(
                errorDetails.message || "Could not sync Bayut & Dubizzle leads"
            );
        }

        const data = await res.json();
        toast.success(data.message || "Successfully synced Bayut & Dubizzle leads");
        return data;
    } catch (err) {
        toast.error(err.message || "An unexpected error occurred");
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function fetchPropertyFinderWPLeadSync() {
    const url = `${getApiUrl()}/integration/pf_whatsapp_leads_syncer`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not sync leads");
        }

        const data = await res.json();
        toast.success(data.message || "Successfully synced Property Finder leads");
        return data;
    } catch (err) {
        toast.error(err.message || "An unexpected error occurred");
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function fetchPropertyFinderCallTrackings() {
    const url = `${getApiUrl()}/integration/pf_call_trackings_syncer`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not sync call tracking data");
        }

        const data = await res.json();
        toast.success(data.message || "Successfully synced Property Finder call tracking data");
        return data;
    } catch (err) {
        toast.error(err.message || "An unexpected error occurred");
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function fetchBayutCallLogs() {
    const url = `${getApiUrl()}/integration/bayut_call_logs_syncer`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not sync call logs");
        }

        const data = await res.json();
        toast.success(data.message || "Successfully synced Bayut call logs");
        return data;
    } catch (err) {
        toast.error(err.message || "An unexpected error occurred");
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function updateTagForLead(id, tag) {
    const url = `${getApiUrl()}/integration/update_lead_tag?lead_id=${id}&tag=${tag}`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Property Finder API keys!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getPropertyFinderKeys() {
    const url = `${getApiUrl()}/integration/get_property_finder_api_key`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Property Finder API keys!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getBayutKey() {
    const url = `${getApiUrl()}/integration/bayut_dubizzle_get_api_key`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Bayut & Dubizzle API key!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createPropertyFinderKey(payload) {
    const url = `${getApiUrl()}/integration/save_property_finder_api_key`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not save Property Finder key!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createBayutKey(payload) {
    const url = `${getApiUrl()}/integration/bayut_dubizzle_save_api_key`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not save Bayut & Dubizzle key!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getBayutXmlFeed() {
    const url = `${getApiUrl()}/properties/bayut_xml_feed`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Bayut's XML Feed!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getPropertyFinderXmlFeed() {
    const url = `${getApiUrl()}/properties/pf_xml_feed`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok)
            throw new Error("Could not get Property Finder's XML Feed!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createCloudinaryKey(payload) {
    const url = `${getApiUrl()}/creds/save_cloudinary_credentials`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);
                if (!res.ok) throw new Error("Could not save Cloudinary key!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getCloudinaryCredentials() {
    const url = `${getApiUrl()}/creds/get_cloudinary_credentials`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Cloudinary credentials!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createOpenAiKey(payload) {
    const url = `${getApiUrl()}/creds/save_openai_api_key`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not save OpenAI API key!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getOpenAiKey() {
    const url = `${getApiUrl()}/creds/get_openai_api_key`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get OpenAI API key!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getGeminiKey() {
    const url = `${getApiUrl()}/ai/get_gemini_api_key`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Gemini API key!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createGeminiKey(payload) {
    const url = `${getApiUrl()}/ai/save_gemini_api_key`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not save Gemini API key!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function subscribePage(pageId) {
    const url = `${getApiUrl()}/subscribe-page?page_id=${pageId}`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not subscribe page");
        }
    } catch (err) {
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function deletePageAccess(pageId) {
    const url = `${getApiUrl()}/remove-page-access?page_id=${pageId}`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not delete page access");
        }
    } catch (err) {
        throw new Error(err.message || "An unexpected error occurred");
    }
}

// Google Ads Integration Functions
export async function subscribeGoogleAdsAccount(accountId) {
    const url = `${getApiUrl()}/subscribe-google-ads-account`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
            body: JSON.stringify({ account_id: accountId }),
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not subscribe to Google Ads account");
        }
    } catch (err) {
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function unSubscribeGoogleAdsAccount(accountId) {
    const url = `${getApiUrl()}/unsubscribe-google-ads-account`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
            body: JSON.stringify({ account_id: accountId }),
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not unsubscribe from Google Ads account");
        }
    } catch (err) {
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function deleteGoogleAdsAccount(accountId) {
    const url = `${getApiUrl()}/delete-google-ads-account`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
            body: JSON.stringify({ account_id: accountId }),
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not delete Google Ads account");
        }
    } catch (err) {
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function fetchConnectedGoogleAdsAccounts() {
    const url = `${getApiUrl()}/connected-google-ads-accounts`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not fetch Google Ads accounts");
        }
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function syncGoogleAdsCampaigns(accountId) {
    const url = `${getApiUrl()}/sync-google-ads-campaigns?account_id=${accountId}`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not sync Google Ads campaigns");
        }
        const data = await res.json();
        toast.success(data.message || "Successfully synced Google Ads campaigns");
        return data;
    } catch (err) {
        toast.error(err.message || "An unexpected error occurred");
        throw new Error(err.message || "An unexpected error occurred");
    }
}

// New Google Ads User Management Functions
export async function fetchGoogleAdsUsers() {
    const url = `${getApiUrl()}/google_ads/users`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not fetch Google Ads users");
        }
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message || "An unexpected error occurred");
    }
}

export async function removeGoogleAdsUserAccess(googleId) {
    const url = `${getApiUrl()}/google_ads/remove-user-access?google_id=${googleId}`;
    try {
        const user = cookies.get("USER");
        if (!user || !user.access_token) {
            throw new Error("User is not authenticated");
        }
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            const errorDetails = await res.json();
            throw new Error(errorDetails.message || "Could not remove Google Ads user access");
        }
        const data = await res.json();
        toast.success(data.message || "Successfully removed user access");
        return data;
    } catch (err) {
        toast.error(err.message || "An unexpected error occurred");
        throw new Error(err.message || "An unexpected error occurred");
    }
}
