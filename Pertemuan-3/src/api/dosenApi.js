import api from "./client";

export const getAllDosen = () => api.get("/dosen");
export const getDosenById = (id) => api.get(`/dosen/${id}`);
export const createDosen = (payload) => api.post("/dosen", payload);
export const updateDosen = (id, payload) => api.put(`/dosen/${id}` , payload);
export const deleteDosen = (id) => api.delete(`/dosen/${id}`);
