import api from "./client";

export const getAllKelas = () => api.get("/kelas");
export const getKelasById = (id) => api.get(`/kelas/${id}`);
export const createKelas = (payload) => api.post("/kelas", payload);
export const updateKelas = (id, payload) => api.put(`/kelas/${id}`, payload);
export const deleteKelas = (id) => api.delete(`/kelas/${id}`);
