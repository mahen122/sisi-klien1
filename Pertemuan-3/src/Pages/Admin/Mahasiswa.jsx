import React, { useState } from "react";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import Pagination from "@/Pages/Layouts/Components/Pagination";
import { useNavigate } from "react-router-dom";
import ModalMahasiswa from "./ModalMahasiswa";
import TableMahasiswa from "./TableMahasiswa";
import { toastSuccess, toastError } from "@/Pages/Layouts/Utils/Helpers/ToastHelpers";
import { confirmDelete, confirmUpdate } from "@/Pages/Layouts/Utils/Helpers/SwalHelpers";
import {
  useMahasiswaList,
  useCreateMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Pages/Layouts/Utils/Hooks/useMahasiswa";

const Mahasiswa = () => {
  const navigate = useNavigate();

  const { data: mahasiswa = [], isLoading } = useMahasiswaList();
  const createMutation = useCreateMahasiswa();
  const updateMutation = useUpdateMahasiswa();
  const deleteMutation = useDeleteMahasiswa();

  // State Modal dan Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ nim: "", nama: "" });
  const [originalNim, setOriginalNim] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(mahasiswa.length / itemsPerPage);
  const paginatedData = mahasiswa.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle input form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = (nim) => {
    confirmDelete(async () => {
      try {
        await deleteMutation.mutateAsync(nim);
        toastSuccess("Data berhasil dihapus");
      } catch (err) {
        toastError(err.response?.data?.message || "Gagal menghapus mahasiswa");
      }
    });
  };

  // Buka modal untuk tambah
  const handleAdd = () => {
    setForm({ nim: "", nama: "" });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  // Buka modal untuk edit
  const handleEdit = (mhs) => {
    setForm(mhs);
    setOriginalNim(mhs.nim);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEdit(false);
    setOriginalNim(null);
    setForm({ nim: "", nama: "" });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nim.trim() || !form.nama.trim()) {
      alert("NIM dan Nama wajib diisi!");
      return;
    }

    if (isEdit) {
      confirmUpdate(() => {
        updateMutation
          .mutateAsync({ id: originalNim, payload: form })
          .then(() => {
            toastSuccess("Data berhasil diperbarui");
            closeModal();
          })
          .catch((err) => toastError(err.response?.data?.message || "Gagal memperbarui mahasiswa"));
      });
      
    } else {
      try {
        await createMutation.mutateAsync(form);
        toastSuccess("Data berhasil ditambahkan");
      } catch (err) {
        toastError(err.response?.data?.message || "Gagal menambah mahasiswa");
        return;
      }
    }

    setForm({ nim: "", nama: "" });
    setIsEdit(false);
    setIsModalOpen(false);
    setOriginalNim(null);
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mahasiswa
          </Heading>
          <Button onClick={handleAdd}>+ Tambah Mahasiswa</Button>
        </div>

        <TableMahasiswa
          data={paginatedData}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDetail={(nim) => navigate(`/admin/mahasiswa/${nim}`)}
        />

        {!isLoading && mahasiswa.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={mahasiswa.length}
          />
        )}
      </Card>

      <ModalMahasiswa
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

export default Mahasiswa;
