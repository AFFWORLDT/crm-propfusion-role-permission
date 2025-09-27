import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getProjects(filters, signal) {
    let url;
    let poolFilters = { ...filters };

    poolFilters.size = filters.viewType === "map" ? 2000 : 12;

    if (filters.status === "POOL") {
        delete poolFilters.project_status;
        delete poolFilters.status;

        url = buildUrl("properties/pool_projects", poolFilters);
    } else {
        url = buildUrl("properties/projects", {
            size: filters.viewType === "map" ? 2000 : 12,
            ...filters,
        });
    }

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get projects!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteQrcode(propertyId) {
    const url = `${getApiUrl()}/properties/projects/${propertyId}/delete_permit_qr_code`;
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
    const url = `${getApiUrl()}/properties/projects/${propertyId}/upload_permit_qr_code`;
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

export async function createProject(
    newProject,
    photos,
    floorPlanList,
    Brochure,
    masterPlans,
    video,
    paymentPlanList,
    permit_qr_code
) {
    const url = `${getApiUrl()}/properties/add_new_project`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(newProject),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not create project!");

        const { id } = await res.json();

        // Now, uploading images
        if (photos?.length) {
            await uploadProjectImages(id, photos);
        }
        if (Brochure?.length) {
            await uploadProjectBrochure(id, Array.from(Brochure));
        }

        // Now, creating floor plans
        if (floorPlanList?.length) {
            await Promise.all(
                floorPlanList.map((floorPlan) => createFloorPlan(id, floorPlan))
            );
        }
        if (masterPlans?.length) {
            await uploadProjectMasterPlans(id, Array.from(masterPlans));
        }
        if (video?.length) {
            await uploadProjectVideo(id, Array.from(video));
        }
        if (permit_qr_code?.length) {
            await uploadPremitQrCode(id, permit_qr_code);
        }
       
        if (paymentPlanList?.length) {
            await Promise.all(
                paymentPlanList.map((paymentPlan) =>
                    uploadProjectPaymentPlan(id, paymentPlan)
                )
            );
        }
        return id;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateProject(
    projectId,
    photos,
    updatedProject,
    newFloorPlans,
    Brochure,
    masterPlans,
    video,
    paymentPlanList,
    permit_qr_code
) {
    const url = `${getApiUrl()}/properties/projects/${projectId}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(updatedProject),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update project!");

        // Now, uploading images
        if (photos?.length) {
            await uploadProjectImages(projectId, photos);
        }

        // Now, creating floor plans
        if (newFloorPlans?.length) {
            await Promise.all(
                newFloorPlans.map((floorPlan) =>
                    createFloorPlan(projectId, floorPlan)
                )
            );
        }
        if (Brochure?.length) {
            await uploadProjectBrochure(projectId, Array.from(Brochure));
        }
        if (masterPlans?.length) {
            await uploadProjectMasterPlans(projectId, Array.from(masterPlans));
        }
        if (video?.length) {
            await uploadProjectVideo(projectId, Array.from(video));
        }
        if (permit_qr_code?.length) {
            await uploadPremitQrCode(projectId, permit_qr_code);
        }
        if (paymentPlanList?.length) {
            await Promise.all(
                paymentPlanList.map((paymentPlan) =>
                    uploadProjectPaymentPlan(projectId, paymentPlan)
                )
            );
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteProject(projectId) {
    const url = `${getApiUrl()}/properties/projects/${projectId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete project!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function syncProject(projectId) {
    //TODO will make this dynamic later
    const SYNC_MODE = "update_only";
    const url = `${getApiUrl()}/properties/sync_projects_from_master?project_ids=${projectId}&sync_mode=${SYNC_MODE}`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not sync project!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function syncAllProjects() {
    //TODO will make this dynamic later
    const SYNC_MODE = "update_only";
    const url = `${getApiUrl()}/properties/sync_projects_from_master?sync_mode=${SYNC_MODE}`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not sync all projects!");
    } catch (err) {
        throw new Error(err.message);
    }
}

async function uploadProjectBrochure(projectId, brochure) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/upload_brochure`;

    const formData = new FormData();

    Array.from(brochure).forEach((file) => {
        formData.append("brochure", file);
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
        if (!res.ok) throw new Error("Failed to upload brochure!");
    } catch (err) {
        throw new Error(err.message);
    }
}
async function uploadProjectImages(projectId, photos) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/upload_photos`;

    const formData = new FormData();

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
        if (!res.ok) throw new Error("Failed to upload photos!");
    } catch (err) {
        throw new Error(err.message);
    }
}

async function uploadProjectMasterPlans(projectId, masterPlans) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/upload_master_plan`;

    const formData = new FormData();

    Array.from(masterPlans).forEach((file) => {
        formData.append("master_plans", file);
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
        if (!res.ok) throw new Error("Failed to upload master plans!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteProjectImage(projectId, imageUrl) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/delete_project_images?photo_urls=${imageUrl}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete image!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteProjectMasterPlan(projectId, masterPlanUrl) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/delete_master_plan?master_plan_url=${masterPlanUrl}`;
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete image!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteProjectBrochure(projectId) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/delete_brochure`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete brochure!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createFloorPlan(projectId, newFloorPlan) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/add_floor_plan`;

    const formData = new FormData();
    formData.append("title", newFloorPlan.floorPlanTitle);
    formData.append("Bedroom", newFloorPlan.floorPlanBedroom);
    formData.append("price", newFloorPlan.floorPlanPrice || 0);
    formData.append("size", newFloorPlan.floorPlanSize || 0);
    formData.append("sold_out", newFloorPlan.sold_out || false);
    formData.append("property_type", newFloorPlan.property_type || "");
    formData.append("tower", newFloorPlan.tower || "");
    if (newFloorPlan.floorPlanLayout[0]) {
        formData.append("layout", newFloorPlan.floorPlanLayout[0]);
    }

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
        if (!res.ok) throw new Error("Could not upload floor plan!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadProjectPaymentPlan(projectId, paymentPlanData) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/payment_plans`;

    // Convert the payment plan data to URL encoded format
    const formData = new URLSearchParams();
    formData.append("post_handover", paymentPlanData.post_handover || 0);
    formData.append("on_handover", paymentPlanData.on_handover || 0);
    formData.append(
        "under_construction_count",
        paymentPlanData.under_construction_count || 1
    );
    formData.append(
        "first_installment",
        paymentPlanData.first_installment || 0
    );
    formData.append("name", paymentPlanData.name);
    formData.append(
        "post_handover_count",
        paymentPlanData.post_handover_count || 1
    );
    formData.append(
        "on_handover_count",
        paymentPlanData.on_handover_count || 1
    );
    formData.append(
        "under_construction",
        paymentPlanData.under_construction || 0
    );
    formData.append(
        "first_installment_count",
        paymentPlanData.first_installment_count || 1
    );
    formData.append("is_active", paymentPlanData.is_active || true);
    formData.append("description", paymentPlanData.description || "");

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData.toString(),
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to upload payment plan!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateFloorPlan(
    projectId,
    floorPlanId,
    updatedFloorPlan
) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/update_floor_plan/${floorPlanId}`;

    const formData = new FormData();
    formData.append("title", updatedFloorPlan.title);
    formData.append("Bedroom", updatedFloorPlan.Bedroom);
    formData.append("price", updatedFloorPlan.price || 0);
    formData.append("size", updatedFloorPlan.size || 0);
    formData.append("sold_out", updatedFloorPlan.sold_out || false);
    formData.append("property_type", updatedFloorPlan.property_type || "");
    formData.append("tower", updatedFloorPlan.tower || "");

    // Handle layout file if provided
    if (updatedFloorPlan.layout instanceof File) {
        formData.append("layout", updatedFloorPlan.layout);
    }

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update floor plan!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteFloorPlan(projectId, floorPlanId) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/floor_plan/${floorPlanId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete floor plan!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function searchProjects(name, signal) {
    let url = `${getApiUrl()}/properties/projects`;

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
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not search projects!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getNewProjectsForMaps(signal) {
    const url = `${getApiUrl()}/properties/get_projects_for_map`;

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

export async function uploadProjectVideo(projectId, video) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/upload_videos`;
    const formData = new FormData();
    Array.from(video).forEach((file) => {
        formData.append("video", file);
    });

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

export async function deleteProjectPaymentPlan(projectId, paymentPlanId) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/payment_plans/${paymentPlanId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete payment plan!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateProjectPaymentPlan(
    projectId,
    paymentPlanId,
    paymentPlanData
) {
    const url = `${getApiUrl()}/properties/projects/${projectId}/payment_plans/${paymentPlanId}`;

    // Convert the payment plan data to URL encoded format
    const formData = new URLSearchParams();
    formData.append("post_handover", paymentPlanData.post_handover);
    formData.append("on_handover", paymentPlanData.on_handover);
    formData.append(
        "under_construction_count",
        paymentPlanData.under_construction_count
    );
    formData.append("first_installment", paymentPlanData.first_installment);
    formData.append("name", paymentPlanData.name);
    formData.append("post_handover_count", paymentPlanData.post_handover_count);
    formData.append("on_handover_count", paymentPlanData.on_handover_count);
    formData.append("under_construction", paymentPlanData.under_construction);
    formData.append(
        "first_installment_count",
        paymentPlanData.first_installment_count
    );
    formData.append("is_active", paymentPlanData.is_active);
    formData.append("description", paymentPlanData.description);

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData.toString(),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update payment plan!");
    } catch (err) {
        throw new Error(err.message);
    }
}


