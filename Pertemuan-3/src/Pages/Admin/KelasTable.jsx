import Button from "@/Pages/Layouts/Components/Button";

const KelasTable = ({ 
  data = [], 
  onEdit, 
  onDelete, 
  onViewDetail,
  loading,
  mataKuliahList = [],
  dosenList = [],
  mahasiswaList = []
}) => {
  if (loading) {
    return <div className="py-4 text-sm text-gray-600">Memuat data kelas...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="py-4 text-sm text-gray-600">Belum ada data kelas.</div>;
  }

  const getMataKuliahInfo = (mataKuliahId) => {
    const mk = mataKuliahList.find(m => m.id === mataKuliahId);
    return mk ? `${mk.kode} - ${mk.nama} (${mk.sks} SKS)` : "-";
  };

  const getDosenInfo = (dosenId) => {
    const dosen = dosenList.find(d => d.id === dosenId);
    return dosen ? dosen.nama : "-";
  };

  const getMahasiswaCount = (mahasiswaIds) => {
    return Array.isArray(mahasiswaIds) ? mahasiswaIds.length : 0;
  };

  const getTotalSksMahasiswa = (mahasiswaIds, mataKuliahId) => {
    if (!Array.isArray(mahasiswaIds) || mahasiswaIds.length === 0) return 0;
    const mk = mataKuliahList.find(m => m.id === mataKuliahId);
    return mk ? mk.sks * mahasiswaIds.length : 0;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Kode Kelas</th>
            <th className="py-2 px-4 text-left">Nama Kelas</th>
            <th className="py-2 px-4 text-left">Mata Kuliah</th>
            <th className="py-2 px-4 text-left">Dosen</th>
            <th className="py-2 px-4 text-center">Jumlah Mahasiswa</th>
            <th className="py-2 px-4 text-center">Kapasitas</th>
            <th className="py-2 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((kls, idx) => (
            <tr key={kls.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              <td className="py-2 px-4 whitespace-nowrap font-medium">{kls.kode}</td>
              <td className="py-2 px-4">{kls.nama}</td>
              <td className="py-2 px-4 text-xs">
                {getMataKuliahInfo(kls.mataKuliahId)}
              </td>
              <td className="py-2 px-4">{getDosenInfo(kls.dosenId)}</td>
              <td className="py-2 px-4 text-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {getMahasiswaCount(kls.mahasiswaIds)} Mahasiswa
                </span>
              </td>
              <td className="py-2 px-4 text-center">{kls.kapasitas ?? 0}</td>
              <td className="py-2 px-4 text-center space-x-2">
                <Button size="sm" variant="primary" onClick={() => onViewDetail(kls)}>
                  Detail
                </Button>
                <Button size="sm" variant="warning" onClick={() => onEdit(kls)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(kls.id)}>
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KelasTable;
