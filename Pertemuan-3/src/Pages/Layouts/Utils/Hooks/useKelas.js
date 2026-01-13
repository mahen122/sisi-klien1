import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllKelas, getKelasById, createKelas, updateKelas, deleteKelas } from "@/api/kelasApi";

export const useKelasList = () =>
  useQuery({
    queryKey: ["kelas"],
    queryFn: async () => {
      const res = await getAllKelas();
      return res.data || [];
    },
  });

export const useKelasDetail = (id) =>
  useQuery({
    queryKey: ["kelas", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await getKelasById(id);
      return res.data;
    },
  });

export const useCreateKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await createKelas(payload);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kelas"] }),
  });
};

export const useUpdateKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await updateKelas(id, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      queryClient.invalidateQueries({ queryKey: ["kelas", id] });
    },
  });
};

export const useDeleteKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await deleteKelas(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["kelas"] });
      queryClient.invalidateQueries({ queryKey: ["kelas", id] });
    },
  });
};
