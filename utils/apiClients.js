// utils/apiClient.js
import { request } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "https://dummyjson.com";

async function createApiClient(authToken = null) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const context = await request.newContext({
    baseURL: BASE_URL,
    extraHTTPHeaders: headers,
  });

  return context;
}

module.exports = { createApiClient };
