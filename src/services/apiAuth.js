import { getApiUrl } from "../utils/getApiUrl";

export async function loginApi(credentials) {
    try {
        const res = await fetch(`${getApiUrl()}/api/login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(credentials),
        });

        const data = await res.json();
        
        if (res.ok) {
            return data;
        } else {
            // Handle different status codes
            if (res.status === 403) {
                throw new Error("Invalid username or password");
            } else {
                throw new Error(data.message || "Something went wrong. Please try again later.");
            }
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getSubscriptionStatus() {
    try {
        const res = await fetch(
            `${getApiUrl()}/integration/subscription_status`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        if (!res.ok) throw new Error("Could not get subscription status!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

/**
 * Request password reset OTP
 * @param {string} email - User email address
 * @returns {Promise} API response
 */
export async function requestPasswordReset(email) {
    try {
        const res = await fetch(`${getApiUrl()}/agent/password-reset/request`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        
        if (res.ok) {
            return data;
        } else {
            throw new Error(data.message || "Failed to send password reset OTP");
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

/**
 * Resend password reset OTP
 * @param {string} email - User email address
 * @returns {Promise} API response
 */
export async function resendPasswordResetOtp(email) {
    try {
        const res = await fetch(`${getApiUrl()}/agent/password-reset/resend`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        
        if (res.ok) {
            return data;
        } else {
            throw new Error(data.message || "Failed to resend OTP");
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

/**
 * Verify OTP and reset password
 * @param {Object} resetData - Reset data containing email, otp, and new_password
 * @param {string} resetData.email - User email address
 * @param {string} resetData.otp - OTP code received via email
 * @param {string} resetData.new_password - New password to set
 * @returns {Promise} API response
 */
export async function verifyPasswordReset(resetData) {
    try {
        const res = await fetch(`${getApiUrl()}/agent/password-reset/verify`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resetData),
        });

        const data = await res.json();
        
        if (res.ok) {
            return data;
        } else {
            throw new Error(data.message || "Failed to reset password");
        }
    } catch (err) {
        throw new Error(err.message);
    }
}
