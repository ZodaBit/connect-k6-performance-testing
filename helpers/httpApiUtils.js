import http from "k6/http";
import { CONFIG } from "../config/config.js";

const STAGING_URL = CONFIG.STAGING_URL;

export function postRequest(endpoint, payload, token = null) {
  return http.post(`${STAGING_URL}${endpoint}`, JSON.stringify(payload), {
    headers: getAuthHeaders(token),
  });
}

export function getRequest(id, endpoint, token = null) {
  return http.get(`${STAGING_URL}/${endpoint}/${id}`, {
    headers: getAuthHeaders(token),
  });
}

export function getRequestParams(params, token = null) {
  return http.get(`${STAGING_URL}/member-transactions/paginate${buildQueryString(params)}`, {
    headers: getAuthHeaders(token),
  });
}

export function getRequestInvoice(id, endpoint, token = null) {
  return http.get(`${STAGING_URL}/${endpoint}/${id}`, {
    headers: getAuthHeaders(token),
  });
}

function buildQueryString(params = {}) {
  let query = [];
  for (let key in params) {
    if (params[key] != null) {
      query.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
  }
  return query.length ? `?${query.join("&")}` : "";
}

function getAuthHeaders(token = null) {
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export function safeParse(body) {
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}
