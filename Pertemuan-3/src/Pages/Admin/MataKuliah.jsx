import { useState } from "react";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import Pagination from "@/Pages/Layouts/Components/Pagination";
import MataKuliahTable from "./MataKuliahTable";
import ModalMataKuliah from "./ModalMataKuliah";
import { toastSuccess, toastError } from "@/Pages/Layouts/Utils/Helpers/ToastHelpers";
import { confirmDelete, confirmUpdate } from "@/Pages/Layouts/Utils/Helpers/SwalHelpers";
import {
  useMataKuliahList,
  useCreateMataKuliah,
  useUpdateMataKuliah,
  useDeleteMataKuliah,
} from "@/Pages/Layouts/Utils/Hooks/useMataKuliah";

const emptyForm = { kode: "", nama: "", sks: "", dosenPengampu: "" };

const MataKuliah = () => {
  const { data: mataKuliah = [], isLoading } = useMataKuliahList();
  const createMutation = useCreateMataKuliah();
  const updateMutation = useUpdateMataKuliah();
  const deleteMutation = useDeleteMataKuliah();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [currentId, setCurrentId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(mataKuliah.length / itemsPerPage);
  const paginatedData = mataKuliah.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setForm(emptyForm);
    setIsEdit(false);
    setCurrentId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setForm({ ...item, sks: item.sks ?? "" });
    setIsEdit(true);
    setCurrentId(item.id || item.kode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setCurrentId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.kode.trim() || !form.nama.trim() || !form.sks || !form.dosenPengampu.trim()) {
      toastError("Semua field wajib diisi");
      return;
    }

    if (isEdit) {
      confirmUpdate(async () => {
        try {
          await updateMutation.mutateAsync({ id: currentId, payload: { ...form, sks: Number(form.sks) } });
          toastSuccess("Data mata kuliah diperbarui");
          closeModal();
        } catch (err) {
          toastError(err.response?.data?.message || "Gagal memperbarui mata kuliah");
        }
      });
    } else {
      try {
        await createMutation.mutateAsync({ ...form, sks: Number(form.sks) });
        toastSuccess("Data mata kuliah ditambahkan");
        closeModal();
      } catch (err) {
        toastError(err.response?.data?.message || "Gagal menambah mata kuliah");
      }
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteMutation.mutateAsync(id);
        toastSuccess("Data mata kuliah dihapus");
      } catch (err) {
        toastError(err.response?.data?.message || "Gagal menghapus mata kuliah");
      }
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Data Mata Kuliah
          </Heading>
          <Button onClick={handleAdd}>+ Tambah Mata Kuliah</Button>
        </div>

        <MataKuliahTable data={paginatedData} loading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

        {!isLoading && mataKuliah.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={mataKuliah.length}
          />
        )}
      </Card>

      <ModalMataKuliah
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default MataKuliah;
