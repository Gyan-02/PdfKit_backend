import axios from "axios";

// Empty baseURL → requests are relative → routed through the Vite dev proxy
// which forwards /api/v1/* to http://localhost:8000 without CORS issues.
const API_PREFIX = "/api/v1";

const API = axios.create({
  baseURL: API_PREFIX,
  headers: { "Content-Type": "application/json" },
});

/* ── File Upload ──────────────────────────────────────────────── */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await API.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { file_id, filename }
}

/* ── Tool Endpoints ───────────────────────────────────────────── */
const TOOL_ENDPOINTS = {
  merge_pdf:     "/merge/",
  split_pdf:     "/split/",
  rotate_pdf:    "/rotate/",
  watermark_pdf: "/watermark/",
  page_numbers:  "/page-numbers/",
  protect_pdf:   "/protect/",
  unlock_pdf:    "/unlock/",
  jpg_to_pdf:    "/jpg-to-pdf/",
  pdf_to_jpg:    "/pdf-to-jpg/",
  compress_pdf:  "/compress/",
  ai_summarise:  "/ai-summarise/",
  ai_translate:  "/ai-translate/",
  ai_rewrite:    "/ai-rewrite/",
  qr_pdf:        "/qr-pdf/",
};

export async function processTool(toolKey, payload) {
  const endpoint = TOOL_ENDPOINTS[toolKey];
  if (!endpoint) throw new Error(`Unknown tool: ${toolKey}`);
  const { data } = await API.post(endpoint, payload);
  return data; // { job_id, status }
}

/* ── Job Polling ──────────────────────────────────────────────── */
export async function getJobStatus(jobId) {
  const { data } = await API.get(`/jobs/${jobId}`);
  return data; // { job_id, status, tool_name, owner }
}

/* ── Download URL builder ─────────────────────────────────────── */
export function getDownloadUrl(jobId) {
  return `${API_PREFIX}/jobs/${jobId}/download`;
}

export default API;
