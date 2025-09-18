import service from "../Helper/Axios";
import Cookies from 'js-cookie';

export function getCreativeData(params = {}) {
  return service
    .get(`site/seller/creative`, { params })
    .then((res) => res.data?.data || [])
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to fetch seller data";
      throw new Error(errorMessage);
    });
}

export function getBusinessData(params = {}) {
  return service
    .get(`site/seller/business`, { params })
    .then((res) => res.data?.data || [])
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to fetch business data";
      throw new Error(errorMessage);
    });
}


export function getCreativeFilters() {
  return service
    .get(`site/seller/filter/creative`)
    .then((res) => res.data?.data || [])
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to fetch filter data";
      throw new Error(errorMessage);
    });
}

export function getBusinessFilters() {
  return service
    .get(`site/seller/filter/business`)
    .then((res) => res.data?.data || [])
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to fetch filter data";
      throw new Error(errorMessage);
    });
}

export function getJobsData(params = {}) {
  return service
    .post(`site/jobs`, params)
    .then((res) => {
      const data = res.data?.data || {};
      const jobsObj = data.jobs || {};
      const jobsArray = Object.values(jobsObj);
      const nextPageToken = data.next_page_token || null;
      return { jobs: jobsArray, next_page_token: nextPageToken };
    })
    .catch((error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to fetch jobs data";
      throw new Error(errorMessage);
    });
}

export function getJobsDataFilters() {
  return service
    .get(`site/jobs/filters`)
    .then((res) => res.data?.data || {})
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch jobs filter data";
      throw new Error(errorMessage);
    });
}

export function applyToJob(payload = {}) {
  return service
    .post(`seller/job/apply`, payload)
    .then((res) => res.data || {})
    .catch((error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to apply for job";
      throw new Error(errorMessage);
    });
}

export function getGuestDashboardData() {
  return service
    .get(`seller/dashboard`)
    .then((res) => res.data || [])
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to fetch seller data";
      throw new Error(errorMessage);
    });
}

export function createPost(formData) {
  return service
    .post("seller/posts/store", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data)
    .catch((error) => {
      const apiErrors = error?.response?.data?.errors;
      let message = error?.response?.data?.message || error?.message || "Failed to create post";

      if (apiErrors) {
        const allErrors = Object.values(apiErrors).flat();
        message = allErrors.join("\n");
      }

      throw new Error(message);
    });
}

export function getPostData(page = 1) {
  return service
    .get(`seller/posts?page=${page}`)
    .then((res) => {
      if (res.data?.status === "success") {
        return {
          posts: res.data.data || [],
          meta: res.data.meta || null,
          links: res.data.links || null,
        };
      }
      return { posts: [], meta: null, links: null };
    })
    .catch((error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch post data";
      throw new Error(errorMessage);
    });
}

export async function getPlans(params = {}) {
  try {
    const res = await service.get("site/plans", { params });
    return res.data;
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Failed to fetch plans");
  }
}

export async function getPlanShow(id, params = {}) {
  try {
    const res = await service.get(`site/plans/${id}`, { params });
    return res.data;
  } catch (err) {
    const msg =
      err?.response?.data?.message || err?.message || `Failed to fetch plans ${id}`;
    throw new Error(msg);
  }
}

export async function getProfileData(uuid) {
  try {
    const res = await service.get(`site/profile/${uuid}`);
    return res.data;
  } catch (err) {
    const msg =
      err?.response?.data?.message || err?.message || `Failed to fetch profile ${uuid}`;
    throw new Error(msg);
  }
}
 
export async function JobsData(params = {}) {
  try {
    const res = await service.get("seller/jobs", { params });
    const root = res.data ?? {};
    const jobsArray = Array.isArray(root.data) ? root.data : [];
    const meta = root.meta ?? null;
    const links = root.links ?? null;
    return { jobs: jobsArray, meta, links };
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || "Failed to fetch jobs data";
    throw new Error(message);
  }
}

export function createPayment(formData) {
  return service
    .post("seller/subscription/payment", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data)
    .catch((error) => {
      const apiErrors = error?.response?.data?.errors;
      let message = error?.response?.data?.message || error?.message || "Failed to create payment";

      if (apiErrors) {
        const allErrors = Object.values(apiErrors).flat();
        message = allErrors.join("\n");
      }
      throw new Error(message);
    });
}