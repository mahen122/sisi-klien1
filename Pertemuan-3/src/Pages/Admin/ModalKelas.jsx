import { useState, useEffect } from "react";
import Form from "@/Pages/Layouts/Components/Form";
import Input from "@/Pages/Layouts/Components/Input";
import Label from "@/Pages/Layouts/Components/Label";
import Button from "@/Pages/Layouts/Components/Button";

const ModalKelas = ({ 
  isOpen, 
  isEdit, 
  form, 
  onChange, 
  onClose, 
  onSubmit,
  mataKuliahList = [],
  dosenList = [],
  mahasiswaList = []
}) => {
  const [selectedMahasiswaIds, setSelectedMahasiswaIds] = useState([]);

  useEffect(() => {
    if (isOpen && form.mahasiswaIds) {
      setSelectedMahasiswaIds(form.mahasiswaIds);
    } else if (isOpen) {
      setSelectedMahasiswaIds([]);
    }
  }, [isOpen, form.mahasiswaIds]);

  if (!isOpen) return null;

  const selectedMataKuliah = mataKuliahList.find(mk => mk.id === form.mataKuliahId);
  const selectedDosen = dosenList.find(d => d.id === form.dosenId);

  const toggleMahasiswa = (mhsId) => {
    const newSelection = selectedMahasiswaIds.includes(mhsId)
      ? selectedMahasiswaIds.filter(id => id !== mhsId)
      : [...selectedMahasiswaIds, mhsId];
    setSelectedMahasiswaIds(newSelection);
  };

  const handleSubmitWithMahasiswa = (e) => {
    e.preventDefault();
    const updatedForm = { ...form, mahasiswaIds: selectedMahasiswaIds };
    onSubmit(e, updatedForm);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">{isEdit ? "Edit Kelas" : "Tambah Kelas"}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">
            &times;
          </button>
        </div>

        <Form onSubmit={handleSubmitWithMahasiswa} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kode">Kode Kelas *</Label>
              <Input
                type="text"
                name="kode"
                value={form.kode}
                onChange={onChange}
                placeholder="IF101-A"
                required
              />
            </div>
            <div>
              <Label htmlFor="nama">Nama Kelas *</Label>
              <Input
                type="text"
                name="nama"
                value={form.nama}
                onChange={onChange}
                placeholder="Algoritma A"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="mataKuliahId">Mata Kuliah *</Label>
            <select
              name="mataKuliahId"
              value={form.mataKuliahId || ""}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Pilih Mata Kuliah --</option>
              {mataKuliahList.map(mk => (
                <option key={mk.id} value={mk.id}>
                  {mk.kode} - {mk.nama} ({mk.sks} SKS)
                </option>
              ))}
            </select>
            {selectedMataKuliah && (
              <p className="text-xs text-gray-600 mt-1">
                SKS: {selectedMataKuliah.sks}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="dosenId">Dosen Pengampu</Label>
            <select
              name="dosenId"
              value={form.dosenId || ""}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Dosen --</option>
              {dosenList.map(dosen => (
                <option key={dosen.id} value={dosen.id}>
                  {dosen.nama} ({dosen.prodi}) - SKS: {dosen.sksAmbil || 0}/{dosen.maxSks}
                </option>
              ))}
            </select>
            {selectedDosen && (
              <p className="text-xs text-gray-600 mt-1">
                ✅ {selectedDosen.nama} - SKS Tersedia: {(selectedDosen.maxSks - (selectedDosen.sksAmbil || 0))} SKS
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="kapasitas">Kapasitas Kelas</Label>
            <Input
              type="number"
              name="kapasitas"
              value={form.kapasitas}
              onChange={onChange}
              min="0"
              placeholder="30"
            />
          </div>

          <div>
            <Label>Daftar Mahasiswa</Label>
            <div className="border border-gray-300 rounded-md p-3 max-h-64 overflow-y-auto bg-gray-50">
              {mahasiswaList.length === 0 ? (
                <p className="text-sm text-gray-500">Tidak ada mahasiswa</p>
              ) : (
                <div className="space-y-2">
                  {mahasiswaList.map(mhs => {
                    const isSelected = selectedMahasiswaIds.includes(mhs.id);
                    const sksAvailable = (mhs.maxSks || 0) - (mhs.sksAmbil || 0);
                    const canEnroll = selectedMataKuliah ? sksAvailable >= selectedMataKuliah.sks : true;

                    return (
                      <div key={mhs.id} className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50">
                        <label className="flex items-center flex-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleMahasiswa(mhs.id)}
                            disabled={!canEnroll && !isSelected}
                            className="mr-3 h-4 w-4"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{mhs.nama}</p>
                            <p className="text-xs text-gray-600">{mhs.nim} - {mhs.prodi}</p>
                          </div>
                        </label>
                        <div className="text-right">
                          <p className={`text-xs font-semibold ${canEnroll ? 'text-green-600' : 'text-red-600'}`}>
                            SKS: {mhs.sksAmbil || 0}/{mhs.maxSks}
                          </p>
                          <p className="text-xs text-gray-500">
                            Sisa: {sksAvailable} SKS
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              ✅ Dipilih: {selectedMahasiswaIds.length} mahasiswa
            </p>
          </div>

          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">{isEdit ? "Perbarui" : "Simpan"}</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ModalKelas;
