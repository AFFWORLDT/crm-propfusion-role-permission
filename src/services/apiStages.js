import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getStages(stageType) {
    const url = `${getApiUrl()}/stages?stage_type=${stageType}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get stages!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function createStage(payload) {
    const url = `${getApiUrl()}/stages`;

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
        if (!res.ok) throw new Error("Could not create stage!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createMultipleStages(stagesArr) {
    try {
        if (stagesArr?.length) {
            await Promise.all(
                stagesArr.map((stageObj) => createStage(stageObj))
            );
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updateStage(id, payload) {
    console.log(id);
    const url = `${getApiUrl()}/stages/${id}`;

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
        if (!res.ok) throw new Error("Could not update stage!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateMultipleStages(stagesArr) {
    console.log(stagesArr);
    try {
        if (stagesArr?.length) {
            await Promise.all(
                stagesArr.map((stageObj) => updateStage(stageObj.id, stageObj))
            );
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteStage(id) {
    const url = `${getApiUrl()}/stages/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete stage!");
    } catch (err) {
        throw new Error(err.message);
    }
}
