import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllDosen, getDosenById, createDosen, updateDosen, deleteDosen } from "@/api/dosenApi";

export const useDosenList = () =>
  useQuery({
    queryKey: ["dosen"],
    queryFn: async () => {
      const res = await getAllDosen();
      return res.data || [];
    },
  });

export const useDosenDetail = (id) =>
  useQuery({
    queryKey: ["dosen", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await getDosenById(id);
      return res.data;
    },
  });

export const useCreateDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await createDosen(payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dosen"] }),
  });
};

export const useUpdateDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await updateDosen(id, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      queryClient.invalidateQueries({ queryKey: ["dosen", id] });
    },
  });
};

export const useDeleteDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await deleteDosen(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      queryClient.invalidateQueries({ queryKey: ["dosen", id] });
    },
  });
};
