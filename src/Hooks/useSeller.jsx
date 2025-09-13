import service from "../Helper/Axios";
import Cookies from 'js-cookie';

export function getCreativeData(params = {}) {
  // params can include { search, level, availability, working_style, union_status, order_by, ... }
  return service
    .get(`site/seller/creative`, { params })
    .then((res) => res.data?.data || [])
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to fetch seller data";
      throw new Error(errorMessage);
    });
}

export function getBusinessData(params = {}) {
  // params can include { search, type, locations, order_by, ... }
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
    .post(`site/jobs/apply`, payload)
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
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create post";
      throw new Error(message);
    });
}