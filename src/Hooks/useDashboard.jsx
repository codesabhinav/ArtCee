import service from "../Helper/Axios";
import Cookies from 'js-cookie';

export async function updateBasicInfo(id, payload) {
  try {
    const res = await service.put(`seller/user/${id}`, payload);
    return res.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Failed to update basic info";
    throw new Error(msg);
  }
}

export async function updateLocation(id, payload) {
  try {
    const res = await service.put(`seller/user/location/${id}`, payload);
    return res.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Failed to update location";
    throw new Error(msg);
  }
}

export async function updatePersonalIntro(id, payload) {
  try {
    const res = await service.put(`seller/update/${id}`, payload);
    return res.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Failed to update intro";
    throw new Error(msg);
  }
}

export async function uploadProfileMedia({ uuid, file, onProgress }) {
  if (!uuid) throw new Error("Missing uuid");
  if (!file) throw new Error("Missing file");

  const form = new FormData();
  form.append("uuid", uuid);
  form.append("portfolio", file);

  try {
    const res = await service.post("seller/profile/portfolio", form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      },
    });
    return res.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Upload failed";
    throw new Error(msg);
  }
}

export async function updateProfessionalBio(params) {
  try {
    const res = await service.post(`seller/bio/store`, params);
    return res.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Failed to update intro";
    throw new Error(msg);
  }
}

export async function updateSkills(id, payload) {
  try {
    const res = await service.put(`seller/user/update-skills/${id}`, payload);
    return res.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Failed to update skils";
    throw new Error(msg);
  }
}

export async function updatePortfolio(formData) {
  try {
    const res = await service.post("seller/portfolio/store", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Failed to update portfolio";
    throw new Error(msg);
  }
}

export async function updateSocialLinks(id, payload) {
  try {
    const res = await service.put(`seller/user/update-social-links/${id}`, payload);
    return res.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Failed to update links";
    throw new Error(msg);
  }
}

export async function updatePricing(payload) {
  try {

    const res = await service.put("seller/settings/pricing", payload);
    return res.data?.data ?? res.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Failed to update pricing";
    throw new Error(msg);
  }
}