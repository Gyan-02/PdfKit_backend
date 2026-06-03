import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function uploadFile(file) {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await API.post(
    "/files/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return data;
}

const TOOL_ENDPOINTS = {
  merge_pdf: "/merge/",
  split_pdf: "/split/",
  rotate_pdf: "/rotate/",
  watermark_pdf: "/watermark/",
  page_numbers: "/page-numbers/",
  protect_pdf: "/protect/",
  unlock_pdf: "/unlock/",
  jpg_to_pdf: "/jpg-to-pdf/",
  pdf_to_jpg: "/pdf-to-jpg/",
  compress_pdf: "/compress/",
  ai_summarise: "/ai-summarise/",
  ai_translate: "/ai-translate/",
  ai_rewrite: "/ai-rewrite/",
  qr_pdf: "/qr-pdf/",
};

export async function processTool(
  toolKey,
  payload
) {
  const endpoint =
    TOOL_ENDPOINTS[toolKey];

  const { data } = await API.post(
    endpoint,
    payload
  );

  return data;
}

export async function getJobStatus(
  jobId
) {
  const { data } = await API.get(
    `/jobs/${jobId}`
  );

  return data;
}

export function getDownloadUrl(
  jobId
) {
  return `${API_BASE_URL}/jobs/${jobId}/download`;
}

export default API;