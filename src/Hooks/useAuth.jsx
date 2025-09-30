import service from "../Helper/Axios";
import Cookies from 'js-cookie';

export function login(formData) {
  return service
    .post(`auth/login`, formData)
    .then((res) => {
      const root = res.data ?? {};
      const payload = root.data ?? root;

      const token = payload?.token;
      if (token) {
        Cookies.set("token", token, {
          expires: 365,
          secure: true,
          sameSite: "Strict",
        });
        window.dispatchEvent(new Event("authChanged"));
        try {
          localStorage.setItem("authEvent", Date.now().toString());
        } catch (e) {
          console.warn("Could not write auth event to localStorage", e);
        }
      }

      return res.data;
    })
    .catch((error) => {
      let errorMessage = "Failed to login";
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = errors.length > 0 ? errors[0] : errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    });
}

export function register(formData) {
  const payload = new FormData();

  for (const key in formData) {
    if (formData[key] === null || formData[key] === undefined) continue;

    const value = formData[key];

    if (typeof File !== "undefined" && value instanceof File) {
      payload.append(key, value);
      continue;
    }
    if (typeof Blob !== "undefined" && value instanceof Blob) {
      payload.append(key, value);
      continue;
    }

    if (key === "portfolio") {
      if (value === null) {
        continue;
      }
      if (typeof value === "string") {
        payload.append("portfolio[url]", value);
      } else if (value instanceof File || (typeof Blob !== "undefined" && value instanceof Blob)) {
        payload.append("portfolio", value);
      } else if (typeof value === "object" && value.url) {
        payload.append("portfolio[url]", value.url);
      }
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((val) => {
        if (typeof File !== "undefined" && val instanceof File) {
          payload.append(`${key}[]`, val);
        } else {
          payload.append(`${key}[]`, val);
        }
      });
      continue;
    }

    if (typeof value === "object") {
      for (const nestedKey in value) {
        if (value[nestedKey] === null || value[nestedKey] === undefined) continue;
        payload.append(`${key}[${nestedKey}]`, value[nestedKey]);
      }
      continue;
    }

    payload.append(key, value);
  }

  return service
    .post(`auth/register`, payload)
    .then((res) => {
      const data = res.data;
      if (data?.token) {
        Cookies.set("token", data.token, {
          expires: 365,
          secure: true,
          sameSite: "Strict",
        });
      }
      return data;
    })
    .catch((error) => {
      let errorMessage = "Failed to register";
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = errors.length > 0 ? errors[0] : errorMessage;
      }
      throw new Error(errorMessage);
    });
}

export function getSkills() {
  return service
    .get(`site/skills?per_page=1000`)
    .then((res) => res.data?.data)
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to load skills";
      throw new Error(errorMessage);
    });
}

export function getCities(search = "") {
  return service
    .get(`site/cities`, { params: { search } })
    .then((res) => res.data?.data || [])
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to fetch cities";
      throw new Error(errorMessage);
    });
}

export function getStates(search = "", country = "") {
  return service
    .get(`site/states`, { params: { search, country } })
    .then((res) => res.data?.data || [])
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to fetch states";
      throw new Error(errorMessage);
    });
}

export function getCountries(search = "") {
  return service
    .get(`site/countries`, { params: { search } })
    .then((res) => res.data?.data || [])
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to fetch countries";
      throw new Error(errorMessage);
    });
}

export function sendOtp() {
  return service
    .get("auth/send/opt")
    .then((res) => res.data)
    .catch((error) => {
      const respData = error?.response?.data ?? {};
      const apiErrors = respData?.errors;
      const nestedErrorMessage = respData?.error?.message;
      let message = respData?.message || nestedErrorMessage || error?.message || "Failed to send OTP";

      if (apiErrors && typeof apiErrors === "object") {
        const allErrors = Object.values(apiErrors).flat();
        if (allErrors.length) {
          message = allErrors.join("\n");
        }
      }
      throw new Error(message);
    });
}

export function verifyOtp(payload) {
  return service
    .post("auth/verify/opt", payload, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => res.data)
    .catch((error) => {
      const respData = error?.response?.data ?? {};
      const apiErrors = respData?.errors;
      const nestedErrorMessage = respData?.error?.message;
      let message = respData?.message || nestedErrorMessage || error?.message || "Failed to send OTP";

      if (apiErrors && typeof apiErrors === "object") {
        const allErrors = Object.values(apiErrors).flat();
        if (allErrors.length) {
          message = allErrors.join("\n");
        }
      }
      throw new Error(message);
    });
}

export async function updatePortfolio(formData) {
  try {
    const res = await service.post("auth/portfolio/store", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Failed to update portfolio";
    throw new Error(msg);
  }
}

export async function getPortfolios(ss_id = null) {
  try {
    const params = {};
    if (ss_id) params.ss_id = ss_id;
    const res = await service.get("auth/portfolio", { params });
    // normalize to array
    return res.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Failed to fetch portfolios";
    throw new Error(msg);
  }
}

export async function deletePortfolio(id) {
  try {
    const res = await service.delete(`auth/portfolio/${id}`);
    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Failed to delete portfolio";
    throw new Error(msg);
  }
}

export function forgotSendOtp(payload) {
  return service
    .post("auth/forgot-password", payload)
    .then((res) => res.data)
    .catch((error) => {
      const respData = error?.response?.data ?? {};
      const apiErrors = respData?.errors;
      const nestedErrorMessage = respData?.error?.message;
      let message = respData?.message || nestedErrorMessage || error?.message || "Failed to send OTP";

      if (apiErrors && typeof apiErrors === "object") {
        const allErrors = Object.values(apiErrors).flat();
        if (allErrors.length) {
          message = allErrors.join("\n");
        }
      }
      throw new Error(message);
    });
}

export function forgotVerifyOtp(payload) {
  return service
    .post("auth/verify-opt", payload)
    .then((res) => res.data)
    .catch((error) => {
      const respData = error?.response?.data ?? {};
      const apiErrors = respData?.errors;
      const nestedErrorMessage = respData?.error?.message;
      let message = respData?.message || nestedErrorMessage || error?.message || "Failed to verify OTP";

      if (apiErrors && typeof apiErrors === "object") {
        const allErrors = Object.values(apiErrors).flat();
        if (allErrors.length) {
          message = allErrors.join("\n");
        }
      }
      throw new Error(message);
    });
}

export function resetPassword(payload) {
  return service
    .post("auth/change-password", payload)
    .then((res) => res.data)
    .catch((error) => {
      const respData = error?.response?.data ?? {};
      const apiErrors = respData?.errors;
      const nestedErrorMessage = respData?.error?.message;
      let message = respData?.message || nestedErrorMessage || error?.message || "Failed to verify OTP";

      if (apiErrors && typeof apiErrors === "object") {
        const allErrors = Object.values(apiErrors).flat();
        if (allErrors.length) {
          message = allErrors.join("\n");
        }
      }
      throw new Error(message);
    });
}