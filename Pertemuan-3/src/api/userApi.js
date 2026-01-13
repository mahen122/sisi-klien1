import api from "./client";

export const getUsers = () => api.get("/users");
export const updateUserRole = (id, payload) => api.put(`/users/${id}`, payload);
