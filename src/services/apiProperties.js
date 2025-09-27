import { getApiUrl } from "../utils/getApiUrl";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export async function getPropertiesLogs(filters, signal) {
    const url = buildUrl("property_logs", filters);

    try {
        let user = cookies.get("USER");
        if (!user) {
            const localUser = localStorage.getItem("CRMUSER");
            if (localUser) {
                user = JSON.parse(localUser);
            }
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user?.access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);

        if (!res.ok) throw new Error("Could not get new properties logs!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function postRefreshListing(id, portal) {
    const url = `${getApiUrl()}/properties/refresh_listing/${id}${portal ? `?portal=${portal}` : ""}`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get properties!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function UpdateAgentIdBulk(
    agentIdToReplace,
    agentIdToReplaceWith,
    type
) {
    const url = `${getApiUrl()}/properties/${type === "property" ? "update_property_agent_id_bulk" : "update_leads_agent_id_bulk"}`;

    if (!agentIdToReplace || !agentIdToReplaceWith) {
        throw new Error(
            "Both agentIdToReplace and agentIdToReplaceWith are required."
        );
    }

    const formData = new URLSearchParams();
    formData.append(
        `${type === "property" ? "agent_id_to_replace" : "current_agent_id"}`,
        agentIdToReplace
    );
    formData.append("new_agent_id", agentIdToReplaceWith);

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        });

        checkUnauthorized(res.status, cookies);

        if (!res.ok) throw new Error("Could not update agent IDs!");

        const data = await res.json();
        return data;
    } catch (err) {
        console.log("Error:", err);
        throw new Error(err.message);
    }
}

export async function fetchPropertiesForMap(filter, signal) {
    const url = buildUrl("properties/get_properties_for_map", filter);
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
        if (!res.ok) throw new Error("Could not get properties!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function fetchDevelopersForMap(filter, signal) {
    const url = buildUrl("properties/get_developers", filter);
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
        if (!res.ok) throw new Error("Could not get developers!");

        const data = await res.json();

        return data.developers;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function fetchProjectsForMap(filter, signal) {
    const url = buildUrl("properties/projects", filter);
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
        if (!res.ok) throw new Error("Could not get projects!");

        const data = await res.json();

        return data.projects;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getProperties(filters, signal) {
    const url = buildUrl("properties/get_filtered_properties", filters);

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
        if (!res.ok) throw new Error("Could not get properties!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getNewProperties(filters, fetchAll = false) {
    const url = buildUrl(
        "properties/get_new_properties",
        {
            ...filters,
            size: filters.viewType === "map" ? 2000 : 12,
        },
        fetchAll
    );

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);

        if (!res.ok) throw new Error("Could not get new properties!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getNewPropertiesByBuildingId(buildingId, signal) {
    const url = buildUrl("properties/get_new_properties", {
        building_id: buildingId,
    });

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

        if (!res.ok) throw new Error("Could not get new properties!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getNewPropertiesByPropertyIdV2(id, signal) {
    const url = `${getApiUrl()}/properties/get_property_by_id?property_id=${id}`;

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

        if (!res.ok) throw new Error("Could not get new properties!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getMainSiteProperties(filters, signal) {
    const url = buildUrl("properties/get_properties_for_sharing", filters);

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

        if (!res.ok) throw new Error("Could not get new properties!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getPropertyById(id) {
    const url = `${getApiUrl()}/properties/get_new_properties?property_id=${id}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get new property!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getNewPropertiesForMaps(listingType, signal) {
    const url = `${getApiUrl()}/properties/get_properties_for_map?tit=${listingType}`;

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
        if (!res.ok) throw new Error("Could not get properties!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createProperty(
    newProperty,
    ownerDocs,
    photos,
    video,
    permit_qr_code
) {
    const url = `${getApiUrl()}/properties/create_property`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(newProperty),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not create property!");

        const { id } = await res.json();
        if (video) {
            await uploadPropertyVideo(id, video);
        }
        if (permit_qr_code) {
            await uploadPremitQrCode(id, permit_qr_code);
        }
        // Now, uploading docs
        if (!(ownerDocs?.length || photos?.length)) {
            return;
        }
        await uploadPropertyDocs(id, ownerDocs, photos);
    } catch (err) {
        throw new Error(err.message);
    }
}

async function uploadPropertyVideo(propertyId, video) {
    const url = `${getApiUrl()}/properties/${propertyId}/upload_video`;
    const formData = new FormData();

    const videoFile = video instanceof FileList ? video[0] : video;

    if (!videoFile || (video instanceof FileList && video.length === 0)) {
        return;
    }

    formData.append("video", videoFile);
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${cookies.get("USER").access_token}`,
        },
        body: formData,
    });
    checkUnauthorized(res.status, cookies);
    if (!res.ok) return;
}

async function uploadPropertyDocs(propertyId, ownerDocs, photos) {
    const url = `${getApiUrl()}/properties/upload_docs/${propertyId}`;

    const formData = new FormData();

    Array.from(ownerDocs).forEach((file) => {
        formData.append("owner_docs", file);
    });
    Array.from(photos).forEach((file) => {
        formData.append("photos", file);
    });

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to upload documents!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deletePropertyImage(propertyId, imageUrl) {
    const url = `${getApiUrl()}/properties/delete_images/${propertyId}`;
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(imageUrl),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete image!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteQrcode(propertyId) {
    const url = `${getApiUrl()}/properties/${propertyId}/delete_permit_qr_code`;
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete image!");
    } catch (err) {
        throw new Error(err.message);
    }
}

async function uploadPremitQrCode(propertyId, QrCode) {
    const url = `${getApiUrl()}/properties/${propertyId}/upload_permit_qr_code`;
    const formData = new FormData();

    const QrCodeFile = QrCode instanceof FileList ? QrCode[0] : QrCode;

    if (!QrCodeFile || (QrCode instanceof FileList && QrCode.length === 0)) {
        return;
    }

    formData.append("permit_qr_code", QrCodeFile);
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${cookies.get("USER").access_token}`,
        },
        body: formData,
    });
    checkUnauthorized(res.status, cookies);
    if (!res.ok) return;
}

export async function updateProperty(
    propertyId,
    updatedProperty,
    ownerDocs,
    photos,
    video,
    permit_qr_code
) {
    const url = `${getApiUrl()}/properties/update_property/${propertyId}`;
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(updatedProperty),
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update property!");
        
        if (video) {
            await uploadPropertyVideo(propertyId, video);
        }
        if (permit_qr_code) {
            await uploadPremitQrCode(propertyId, permit_qr_code);
        }
        // Now, uploading docs
        if (!(ownerDocs?.length || photos?.length)) {
            return;
        }
        await uploadPropertyDocs(propertyId, ownerDocs, photos);
        return res
    } catch (err) {
        console.log(err);
    }
}

export async function deleteProperty(propertyId) {
    const url = `${getApiUrl()}/properties/delete_property/${propertyId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete property!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export const getBayutLocations = async (search) => {
    const url = `${getApiUrl()}/support/bayut_locations?search=${search ?? ""}&page=1&size=10`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) throw new Error("Could not get Bayut locations!");

        const data = await res.json();

        return data?.locations ?? [];
    } catch (err) {
        throw new Error(err.message);
    }
};

export async function getLocations(search) {
    const searchParam = search ? `&search=${search}` : "";
    const response = await fetch(
        `${getApiUrl()}/support/locations?page=1&size=10${searchParam}`
    );
    const data = await response.json();

    if (!response.ok) {
        throw new Error("Couldn't fetch locations!");
    }

    return data?.locations ?? [];
}

export async function getCommunities(search) {
    const searchParam = search ? `&search=${search}` : "";
    try {
        let user = cookies.get("USER");
        if (!user) {
            const localUser = localStorage.getItem("CRMUSER");
            if (localUser) {
                user = JSON.parse(localUser);
            }
        }

        const response = await fetch(
            `${getApiUrl()}/locations/locations/list?page=1&size=10&location_type=community${searchParam}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${user?.access_token}`,
                },
            }
        );

        checkUnauthorized(response.status, cookies);

        if (!response.ok) throw new Error("Could not get communities!");

        const data = await response.json();
        return data?.locations ?? [];
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getPropertyTypes() {
    const url = `${getApiUrl()}/properties/get_property_types`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) throw new Error("Could not get property types!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getPropertyReports(type) {
    const user = cookies.get("USER");
    if (!user) {
        window.location.href = "/login";
        return;
    }

    const url = `${getApiUrl()}/properties/${type === "property" ? "property_reports" : "lead_reports"}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get property reports!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export const getPropertiesBasics = async (filters, fetchAll = false) => {
    const url = buildUrl(`properties/get_properties_basic`, filters, fetchAll);
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get properties basics!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};

export async function searchProperties(name, signal) {
    let url = `${getApiUrl()}/properties/get_properties_basic`;

    if (name) {
        url += `?name=${encodeURIComponent(name)}&size=20`;
    } else {
        url += `?size=20`;
    }

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
        if (!res.ok) throw new Error("Could not search properties!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function changePropertyRefId(oldPropertyId, newPropertyId) {
    const url = `${getApiUrl()}/properties/update_property_id/${oldPropertyId}?propertyId=${newPropertyId}`;
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not change property ref ID!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getStageFollowupReport() {
    const user = cookies.get("USER");
    if (!user) {
        window.location.href = "/login";
        return;
    }

    const url = `${getApiUrl()}/properties/stage_followup_report`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get stage follow-up report!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getLeadReportsSummary(page = 1, size = 10) {
    const user = cookies.get("USER");
    if (!user) {
        window.location.href = "/login";
        return;
    }

    const url = `${getApiUrl()}/properties/lead_reports?page=${page}&size=${size}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get lead reports summary!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAgentLeadsReport() {
    const user = cookies.get("USER");
    if (!user) {
        window.location.href = "/login";
        return;
    }

    const url = `${getApiUrl()}/properties/agent_leads_report`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get agent leads report!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAgentPropertiesReport() {
    const user = cookies.get("USER");
    if (!user) {
        window.location.href = "/login";
        return;
    }

    const url = `${getApiUrl()}/properties/agent_properties_report`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get agent properties report!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getProjectsReport() {
    const user = cookies.get("USER");
    if (!user) {
        window.location.href = "/login";
        return;
    }

    const url = `${getApiUrl()}/properties/projects_report`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get projects report!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
