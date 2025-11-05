import React, { useState, useEffect } from "react";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import { mahasiswaList } from "@/Data/Dummy";
import { useNavigate } from "react-router-dom";
import ModalMahasiswa from "./ModalMahasiswa";
import TableMahasiswa from "./TableMahasiswa";
import { toastSuccess, toastError } from "@/Pages/Layouts/Utils/Helpers/ToastHelpers";
import { confirmDelete, confirmUpdate } from "@/Pages/Layouts/Utils/Helpers/SwalHelpers";

const Mahasiswa = () => {
  const navigate = useNavigate();

  // Data Mahasiswa
  const [mahasiswa, setMahasiswa] = useState([]);

  // State Modal dan Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({ nim: "", nama: "" });
  const [originalNim, setOriginalNim] = useState(null);

  // useEffect
  useEffect(() => {
    setTimeout(() => fetchMahasiswa(), 500); // simulasi loading
  }, []);

  const fetchMahasiswa = async () => {
    // simulasi fetch API
    setMahasiswa(mahasiswaList);
  };

  // Handle input form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Tambah data mahasiswa baru
  const addMahasiswa = (newData) => {
    setMahasiswa([...mahasiswa, newData]);
  };

  // Update data mahasiswa
  const updateMahasiswa = (nim, newData) => {
    const updated = mahasiswa.map((mhs) =>
      mhs.nim === nim ? { ...mhs, ...newData } : mhs
    );
    setMahasiswa(updated);
  };

  // Hapus data mahasiswa
  const deleteMahasiswa = (nim) => {
    confirmDelete(() => {
      const filtered = mahasiswa.filter((mhs) => mhs.nim !== nim);
      setMahasiswa(filtered);
      toastSuccess("Data berhasil dihapus");
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

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nim.trim() || !form.nama.trim()) {
      alert("NIM dan Nama wajib diisi!");
      return;
    }

    if (isEdit) {
      // 🔹 Gunakan konfirmasi sebelum update
      confirmUpdate(() => {
        updateMahasiswa(originalNim, form);
        toastSuccess("Data berhasil diperbarui");
        closeModal();
      });
      
    } else {
      const exists = mahasiswa.some((mhs) => mhs.nim === form.nim);
      if (exists) {
        alert("NIM sudah terdaftar!");
        return;
      }
      addMahasiswa(form);
      // alert("Data berhasil ditambahkan!");
      toastSuccess("Data berhasil ditambahkan");
    }

    setForm({ nim: "", nama: "" });
    setIsEdit(false);
    setIsModalOpen(false);
    setOriginalNim(null);
  };

  // Modal Tambah/Edit
  const openAddModal = () => {
    setIsModalOpen(true);
    setForm({ nim: "", nama: "" });
    setIsEdit(false);
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mahasiswa
          </Heading>
          <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
        </div>

        <TableMahasiswa
          data={mahasiswa}
          onEdit={handleEdit}
          onDelete={deleteMahasiswa}
          onDetail={(nim) => navigate(`/admin/mahasiswa/${nim}`)}
        />
      </Card>

      <ModalMahasiswa
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Mahasiswa;
