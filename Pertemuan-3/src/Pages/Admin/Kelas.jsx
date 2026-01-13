import { useState } from "react";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import Pagination from "@/Pages/Layouts/Components/Pagination";
import { toastSuccess, toastError } from "@/Pages/Layouts/Utils/Helpers/ToastHelpers";
import { confirmDelete, confirmUpdate } from "@/Pages/Layouts/Utils/Helpers/SwalHelpers";
import {
  useKelasList,
  useCreateKelas,
  useUpdateKelas,
  useDeleteKelas,
} from "@/Pages/Layouts/Utils/Hooks/useKelas";
import { useMataKuliahList } from "@/Pages/Layouts/Utils/Hooks/useMataKuliah";
import { useDosenList } from "@/Pages/Layouts/Utils/Hooks/useDosen";
import { useMahasiswaList } from "@/Pages/Layouts/Utils/Hooks/useMahasiswa";
import KelasTable from "./KelasTable";
import ModalKelas from "./ModalKelas";
import KelasDetail from "./KelasDetail";

const emptyForm = { 
  kode: "", 
  nama: "", 
  mataKuliahId: "", 
  dosenId: "", 
  mahasiswaIds: [],
  kapasitas: "" 
};

const Kelas = () => {
  const { data: kelas = [], isLoading } = useKelasList();
  const { data: mataKuliahList = [] } = useMataKuliahList();
  const { data: dosenList = [] } = useDosenList();
  const { data: mahasiswaList = [] } = useMahasiswaList();
  
  const createMutation = useCreateKelas();
  const updateMutation = useUpdateKelas();
  const deleteMutation = useDeleteKelas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [currentId, setCurrentId] = useState(null);
  const [selectedKelas, setSelectedKelas] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(kelas.length / itemsPerPage);
  const paginatedData = kelas.slice(
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
    setForm({
      kode: item.kode || "",
      nama: item.nama || "",
      mataKuliahId: item.mataKuliahId || "",
      dosenId: item.dosenId || "",
      mahasiswaIds: item.mahasiswaIds || [],
      kapasitas: item.kapasitas ?? "",
    });
    setCurrentId(item.id);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleViewDetail = (item) => {
    setSelectedKelas(item);
    setIsDetailOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm(emptyForm);
    setCurrentId(null);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedKelas(null);
  };

  const handleSubmit = async (e, updatedForm = null) => {
    e.preventDefault();
    const dataToSubmit = updatedForm || form;

    try {
      if (isEdit) {
        const confirmed = await confirmUpdate();
        if (!confirmed) return;

        await updateMutation.mutateAsync({ id: currentId, data: dataToSubmit });
        toastSuccess("Kelas berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(dataToSubmit);
        toastSuccess("Kelas berhasil ditambahkan");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
      toastError(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete();
    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(id);
      toastSuccess("Kelas berhasil dihapus");
    } catch (error) {
      console.error("Error:", error);
      toastError(error.response?.data?.message || "Gagal menghapus kelas");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2">Pengelolaan Kelas</Heading>
          <Button onClick={handleAdd}>+ Tambah Kelas</Button>
        </div>
        <KelasTable 
          data={paginatedData} 
          loading={isLoading} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          onViewDetail={handleViewDetail}
          mataKuliahList={mataKuliahList}
          dosenList={dosenList}
          mahasiswaList={mahasiswaList}
        />
        {kelas.length > itemsPerPage && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={kelas.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </Card>

      <ModalKelas
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        mataKuliahList={mataKuliahList}
        dosenList={dosenList}
        mahasiswaList={mahasiswaList}
      />

      <KelasDetail
        isOpen={isDetailOpen}
        kelas={selectedKelas}
        onClose={handleCloseDetail}
        mataKuliahList={mataKuliahList}
        dosenList={dosenList}
        mahasiswaList={mahasiswaList}
      />
    </div>
  );
};

export default Kelas;
