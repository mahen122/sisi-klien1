import Button from "@/Pages/Layouts/Components/Button";

const DosenTable = ({ data = [], onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="py-4 text-sm text-gray-600">Memuat data dosen...</div>;
  }

  if (!data.length) {
    return <div className="py-4 text-sm text-gray-600">Belum ada data dosen.</div>;
  }

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIDN</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-left">Email</th>
          <th className="py-2 px-4 text-left">Prodi</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((dosen, index) => (
          <tr key={dosen.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
            <td className="py-2 px-4 whitespace-nowrap">{dosen.nidn}</td>
            <td className="py-2 px-4">{dosen.nama}</td>
            <td className="py-2 px-4">{dosen.email}</td>
            <td className="py-2 px-4">{dosen.prodi}</td>
            <td className="py-2 px-4 text-center space-x-2">
              <Button size="sm" variant="warning" onClick={() => onEdit(dosen)}>
                Edit
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDelete(dosen.id)}>
                Hapus
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DosenTable;
