import Cookies from "universal-cookie";
import { buildUrl, buildUrlforLeads, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();
export async function getLeadLogs(filters, signal) {
    const url = buildUrl("lead_logs", filters, true);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get lead logs!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getLeads(filters, signal) {
    const url = buildUrlforLeads("properties/get_leads", filters);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get leads!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createLead(payload) {
    const url = `${getApiUrl()}/properties/add_lead`;

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
        if (!res.ok) throw new Error("Could not create lead!");
        const responseData = await res.json();

        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function sendLeadReminder(leadId) {
    const url = `${getApiUrl()}/properties/send_lead_reminder/${leadId}`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not send lead reminder!");
        const responseData = await res.json();

        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateLead(id, payload) {
    const url = `${getApiUrl()}/properties/update_lead/${id}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update lead!");

        const responseData = await res.json();
        return responseData;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createFollowUpLead(payload) {
    const url = `${getApiUrl()}/followup`;

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
        if (!res.ok) throw new Error("Could not create follow up!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteLead(id) {
    const url = `${getApiUrl()}/properties/delete_lead/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete lead!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getPortalCalls(filters, signal) {
    const url = buildUrl("integration/call_logs", filters);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get portal calls!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getWhatsappLeads(filters, signal) {
    const url = buildUrl("integration/all_whatsapp_leads", filters);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get whatsapp leads!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getPhoneView(filters, signal) {
    const url = buildUrl("integration/phone_views", filters);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get !");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getSmsClick(filters, signal) {
    const url = buildUrl("integration/sms_clicks", filters);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get !");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getWhatappsClick(filters, signal) {
    const url = buildUrl("integration/whatsapp_views", filters);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get !");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

// Bulk update leads takes an array of ids and updates the lead draft
export async function updateBulkLeadDraft(lead_ids, update_fields) {
    const url = `${getApiUrl()}/properties/bulk_update_leads`;
    const payload = {
        lead_ids: lead_ids,
        update_fields: update_fields,
    };
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update leads!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export const getAllForums = async () => {
    const url = `${getApiUrl()}/forums`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get !");

        const data = await res.json();

        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};
