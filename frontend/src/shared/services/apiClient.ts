import axios from "axios";

import { env } from "@/config/env";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
