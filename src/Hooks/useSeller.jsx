import service from "../Helper/Axios";
import Cookies from 'js-cookie';

export function getCreativeData(params = {}) {
  return service
    .get(`site/seller/creative`, { params })
    .then((res) => {
      const payload = res.data || {};
      return {
        data: payload.data || [], 
        links: payload.links || null,
        meta: payload.meta || null,
      };
    })
    .catch((error) => {
      const errorMessage = error.response?.message || "Failed to fetch seller data";
      throw new Error(errorMessage);
    });
}

export function getBusinessData(params = {}) {
  return service
    .get(`site/seller/business`, { params })
    .then((res) => {
      const payload = res.data || {};
      return {
        data: payload.data || [],
        links: payload.links || null,
        meta: payload.meta || null,
      };
    })
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

export function updatePost(id, formData) {
  return service
    .put(`seller/posts/${id}`, formData, {
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => res.data)
    .catch((error) => {
      const apiErrors = error?.response?.data?.errors;
      let message = error?.response?.data?.message || error?.message || "Failed to update post";

      if (apiErrors) {
        const allErrors = Object.values(apiErrors).flat();
        message = allErrors.join("\n");
      }

      throw new Error(message);
    });
}

export function deletePost(id) {
  return service
    .delete(`seller/posts/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      const apiErrors = error?.response?.data?.errors;
      let message = error?.response?.data?.message || error?.message || "Failed to delete post";

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

export function createSubscription(formData) {
  return service
    .post("seller/subscription/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data)
    .catch((error) => {
      const apiErrors = error?.response?.data?.errors;
      let message = error?.response?.data?.message || error?.message || "Failed to create subscription";

      if (apiErrors) {
        const allErrors = Object.values(apiErrors).flat();
        message = allErrors.join("\n");
      }
      throw new Error(message);
    });
}

export function createPayment(formData) {
  return service
    .post("seller/subscription/payment", formData)
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

export function fetchPaymentStatus(formData) {
  return service
    .post("seller/payment", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data)
    .catch((error) => {
      const apiErrors = error?.response?.data?.errors;
      let message = error?.response?.data?.message || error?.message || "Failed to fetch payment status";

      if (apiErrors) {
        const allErrors = Object.values(apiErrors).flat();
        message = allErrors.join("\n");
      }
      throw new Error(message);
    });
}

export function followUnfollowMethod(uuid) {
  return service
    .post(`site/follow/${uuid}/toggle`)
    .then((res) => res.data || {})
    .catch((error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to follow/unfollow";
      throw new Error(errorMessage);
    });
}

export function initChatWithUser(uuid) {
  return service
    .get(`chats/user/${uuid}`)
    .then((res) => res.data?.data || null)
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message || "Init chat failed";
      throw new Error(errorMessage);
    });
}

export function fetchChatData(id) {
  return service
    .get(`chats/${id}/messages`)
    .then((res) => res.data || {})
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch chat";
      throw new Error(errorMessage);
    });
}

export function sendTextMessage(id, payload) {
  return service
    .post(`chats/${id}/messages`, payload)
    .then((res) => res.data || {})
    .catch((error) => {
      const errorMessage = error.response?.data?.message || error.message || "Failed to send message";
      throw new Error(errorMessage);
    });
}

export function sendMediaMessage(id, { message = "", message_type = "file", file }, onUploadProgress) {
  const formData = new FormData();
  formData.append("message", message);
  formData.append("message_type", message_type);
  formData.append("media", file);

  return service.post(`chats/${id}/messages`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        onUploadProgress(percent);
      }
    },
  })
  .then((res) => res.data || {})
  .catch((error) => {
    const errorMessage = error.response?.data?.message || error.message || "Failed to upload media";
    throw new Error(errorMessage);
  });
}