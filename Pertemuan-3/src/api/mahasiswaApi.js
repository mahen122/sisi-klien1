import api from "./client";

export const getAllMahasiswa = () => api.get("/mahasiswa");
export const getMahasiswaById = (nim) => api.get(`/mahasiswa/${nim}`);
export const createMahasiswa = (payload) => api.post("/mahasiswa", payload);
export const updateMahasiswa = (nim, payload) => api.put(`/mahasiswa/${nim}`, payload);
export const deleteMahasiswa = (nim) => api.delete(`/mahasiswa/${nim}`);
