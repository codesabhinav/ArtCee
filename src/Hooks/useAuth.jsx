import service from "../Helper/Axios";
import Cookies from 'js-cookie';

export function login(formData) {
  return service
    .post(`auth/login`, formData)
    .then((res) => {
      const data = res.data;
      if (data) {
        Cookies.set("token", data?.token, {
          expires: 365,
          secure: true,
          sameSite: "Strict",
        });
        // Cookies.set("role", data?.data?.role, {
        //   expires: 365,
        //   secure: true,
        //   sameSite: "Strict",
        // });
      }

      return res.data;
    })
     .catch((error) => {
      let errorMessage = "Failed to login";
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = errors.length > 0 ? errors[0] : errorMessage;
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

export function getPlans() {
  return service
    .get(`site/plans`)
    .then((res) => res.data?.data)
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to load plans";
      throw new Error(errorMessage);
    });
}