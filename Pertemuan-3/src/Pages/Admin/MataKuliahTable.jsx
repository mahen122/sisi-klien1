import Button from "@/Pages/Layouts/Components/Button";

const MataKuliahTable = ({ data = [], onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="py-4 text-sm text-gray-600">Memuat data mata kuliah...</div>;
  }

  if (!data.length) {
    return <div className="py-4 text-sm text-gray-600">Belum ada data mata kuliah.</div>;
  }

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">Kode</th>
          <th className="py-2 px-4 text-left">Nama Mata Kuliah</th>
          <th className="py-2 px-4 text-left">SKS</th>
          <th className="py-2 px-4 text-left">Dosen Pengampu</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((mk, index) => (
          <tr key={mk.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
            <td className="py-2 px-4 whitespace-nowrap">{mk.kode}</td>
            <td className="py-2 px-4">{mk.nama}</td>
            <td className="py-2 px-4">{mk.sks}</td>
            <td className="py-2 px-4">{mk.dosenPengampu}</td>
            <td className="py-2 px-4 text-center space-x-2">
              <Button size="sm" variant="warning" onClick={() => onEdit(mk)}>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDelete(mk.id)}>
                Hapus
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MataKuliahTable;
