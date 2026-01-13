import api from "./client";

export const getAllMataKuliah = () => api.get("/mata-kuliah");
export const getMataKuliahById = (id) => api.get(`/mata-kuliah/${id}`);
export const createMataKuliah = (payload) => api.post("/mata-kuliah", payload);
export const updateMataKuliah = (id, payload) => api.put(`/mata-kuliah/${id}`, payload);
export const deleteMataKuliah = (id) => api.delete(`/mata-kuliah/${id}`);
