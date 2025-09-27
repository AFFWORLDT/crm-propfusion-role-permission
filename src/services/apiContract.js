import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export const saveContractInfo = async (payload) => {
    const url = `${getApiUrl()}/agreement`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload)
        });
        
        checkUnauthorized(response.status, cookies);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw new Error(error.message || "Failed to save contract");
    }
};

export const getSaveData = async (params) => {
  const baseUrl = `${getApiUrl()}/agreements`;

  // Build URL with query parameters, including agreement_id if provided
  const url = `${baseUrl}?${new URLSearchParams({
    page: params?.page || 1,
    size: params?.size || 10,
    ...(params?.owner_name && { owner_name: params.owner_name }),
    ...(params?.tenant_name && { tenant_name: params.tenant_name }),
    ...(params?.property_no && { property_no: params.property_no }),
    ...(params?.agreement_type && { agreement_type: params.agreement_type }),
    ...(params?.agreement_id && { agreement_id: params.agreement_id }) // Add agreement_id as query parameter
  }).toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
      },
    });
    
    checkUnauthorized(res.status, cookies);
    if (!res.ok) throw new Error(`Could not get Agreement${params?.agreement_id ? '' : 's'}!`);
    
    return await res.json();
  } catch (err) {
    throw new Error(err.message);
  }
};

export async function deletecontract(id) {
  const url = `${getApiUrl()}/agreement/${id}`;

  try {
      const res = await fetch(url, {
          method: "DELETE",
          headers: {
              Accept: "application/json",
              Authorization: `Bearer ${cookies.get("USER").access_token}`,
          },
      });

      checkUnauthorized(res.status, cookies);
      if (!res.ok) throw new Error("Could not delete Contract!");
  } catch (err) {
      throw new Error(err.message);
  }
}


