import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllMataKuliah,
  getMataKuliahById,
  createMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "@/api/mataKuliahApi";

export const useMataKuliahList = () =>
  useQuery({
    queryKey: ["mata-kuliah"],
    queryFn: async () => {
      const res = await getAllMataKuliah();
      return res.data || [];
    },
  });

export const useMataKuliahDetail = (id) =>
  useQuery({
    queryKey: ["mata-kuliah", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await getMataKuliahById(id);
      return res.data;
    },
  });

export const useCreateMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await createMataKuliah(payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] }),
  });
};

export const useUpdateMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await updateMataKuliah(id, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah", id] });
    },
  });
};

export const useDeleteMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await deleteMataKuliah(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah", id] });
    },
  });
};
