import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllMahasiswa,
  getMahasiswaById,
  createMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/api/mahasiswaApi";

export const useMahasiswaList = () =>
  useQuery({
    queryKey: ["mahasiswa"],
    queryFn: async () => {
      const res = await getAllMahasiswa();
      return res.data || [];
    },
  });

export const useMahasiswaDetail = (id) =>
  useQuery({
    queryKey: ["mahasiswa", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await getMahasiswaById(id);
      return res.data;
    },
  });

export const useCreateMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await createMahasiswa(payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mahasiswa"] }),
  });
};

export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await updateMahasiswa(id, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      queryClient.invalidateQueries({ queryKey: ["mahasiswa", id] });
    },
  });
};

export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await deleteMahasiswa(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      queryClient.invalidateQueries({ queryKey: ["mahasiswa", id] });
    },
  });
};
