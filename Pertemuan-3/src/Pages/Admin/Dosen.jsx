import { useState } from "react";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import Pagination from "@/Pages/Layouts/Components/Pagination";
import DosenTable from "./DosenTable";
import ModalDosen from "./ModalDosen";
import { toastSuccess, toastError } from "@/Pages/Layouts/Utils/Helpers/ToastHelpers";
import { confirmDelete, confirmUpdate } from "@/Pages/Layouts/Utils/Helpers/SwalHelpers";
import {
  useDosenList,
  useCreateDosen,
  useUpdateDosen,
  useDeleteDosen,
} from "@/Pages/Layouts/Utils/Hooks/useDosen";

const emptyForm = { nidn: "", nama: "", email: "", prodi: "" };

const Dosen = () => {
  const { data: dosen = [], isLoading } = useDosenList();
  const createMutation = useCreateDosen();
  const updateMutation = useUpdateDosen();
  const deleteMutation = useDeleteDosen();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [currentId, setCurrentId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(dosen.length / itemsPerPage);
  const paginatedData = dosen.slice(
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
    setForm({ ...item });
    setIsEdit(true);
    setCurrentId(item.id || item.nidn);
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

    if (!form.nidn.trim() || !form.nama.trim() || !form.email.trim() || !form.prodi.trim()) {
      toastError("Semua field wajib diisi");
      return;
    }

    if (isEdit) {
      confirmUpdate(async () => {
        try {
          await updateMutation.mutateAsync({ id: currentId, payload: form });
          toastSuccess("Data dosen diperbarui");
          closeModal();
        } catch (err) {
          toastError(err.response?.data?.message || "Gagal memperbarui dosen");
        }
      });
    } else {
      try {
        await createMutation.mutateAsync(form);
        toastSuccess("Data dosen ditambahkan");
        closeModal();
      } catch (err) {
        toastError(err.response?.data?.message || "Gagal menambah dosen");
      }
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteMutation.mutateAsync(id);
        toastSuccess("Data dosen dihapus");
      } catch (err) {
        toastError(err.response?.data?.message || "Gagal menghapus dosen");
      }
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Data Dosen
          </Heading>
          <Button onClick={handleAdd}>+ Tambah Dosen</Button>
        </div>

        <DosenTable data={paginatedData} loading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

        {!isLoading && dosen.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={dosen.length}
          />
        )}
      </Card>

      <ModalDosen
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

export default Dosen;
