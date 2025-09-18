import service from "../Helper/Axios";
import Cookies from 'js-cookie';

// export function login(formData) {
//   return service
//     .post(`auth/login`, formData)
//     .then((res) => {
//       const root = res.data ?? {};
//       const payload = root.data ?? root;

//       const token = payload?.token;
//       if (token) {
//         Cookies.set("token", token, {
//           expires: 365,
//           secure: true,
//           sameSite: "Strict",
//         });
//       }

//       return res.data;
//     })
//     .catch((error) => {
//       let errorMessage = "Failed to login";
//       if (error.response?.data?.errors) {
//         const errors = Object.values(error.response.data.errors).flat();
//         errorMessage = errors.length > 0 ? errors[0] : errorMessage;
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       }
//       throw new Error(errorMessage);
//     });
// }


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

  // append scalar values
  for (const key in formData) {
    if (formData[key] === null || formData[key] === undefined) continue;

    if (key === "portfolio" && formData[key]) {
      // File upload
      payload.append("portfolio", formData[key]);
    } else if (Array.isArray(formData[key])) {
      // Arrays like skills[], services[]
      formData[key].forEach((val) => payload.append(`${key}[]`, val));
    } else if (typeof formData[key] === "object" && formData[key] !== null) {
      // Nested objects (like social)
      for (const nestedKey in formData[key]) {
        payload.append(`${key}[${nestedKey}]`, formData[key][nestedKey]);
      }
    } else {
      payload.append(key, formData[key]);
    }
  }

  return service
    .post(`auth/register`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
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