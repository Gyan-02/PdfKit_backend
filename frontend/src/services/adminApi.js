import API from "./api";

export async function getStats() {
  const { data } = await API.get("/admin/stats");
  return data;
}

export async function getJobs() {
  const { data } = await API.get("/admin/jobs");
  return data;
}

export async function getFiles() {
  const { data } = await API.get("/admin/files");
  return data;
}

export async function getUsers() {
  const { data } = await API.get("/admin/users");
  return data;
}
