import axios from "axios";
import { getAppVersion } from "./version";
import Cookies from 'js-cookie';

export const service = axios.create({
  baseURL: "https://artceebackend.raomtech.com/v1/",
});

async function requestConfig(config) {
  if (!config.headers) {
    config.headers = {};
  }

  try {
    config.headers.version = await getAppVersion();
  } catch (error) {
    console.warn("Failed to retrieve app version:", error);
  }

  const authToken = Cookies.get("token");

  
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
}

service.interceptors.request.use(requestConfig);

// service.interceptors.response.use((response) => response);
service.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 ||
      error?.response?.statusText === "Unauthenticated."
    ) {
      Cookies.remove("token");
    }

    return Promise.reject(error);
  }
);

export default service;
