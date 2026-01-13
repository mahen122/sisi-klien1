import Button from "@/Pages/Layouts/Components/Button";

const KelasDetail = ({ 
  isOpen, 
  kelas, 
  onClose,
  mataKuliahList = [],
  dosenList = [],
  mahasiswaList = []
}) => {
  if (!isOpen || !kelas) return null;

  const mataKuliah = mataKuliahList.find(mk => mk.id === kelas.mataKuliahId);
  const dosen = dosenList.find(d => d.id === kelas.dosenId);
  const enrolledMahasiswa = mahasiswaList.filter(m => 
    kelas.mahasiswaIds && kelas.mahasiswaIds.includes(m.id)
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">Detail Kelas</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informasi Kelas */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <h3 className="text-lg font-bold">{kelas.nama}</h3>
            <p className="text-sm opacity-90">Kode: {kelas.kode}</p>
            <p className="text-sm opacity-90">Kapasitas: {kelas.kapasitas} mahasiswa</p>
          </div>

          {/* Informasi Mata Kuliah */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-2">📚 Mata Kuliah</h4>
            {mataKuliah ? (
              <div className="space-y-1">
                <p className="text-sm"><span className="font-medium">Kode:</span> {mataKuliah.kode}</p>
                <p className="text-sm"><span className="font-medium">Nama:</span> {mataKuliah.nama}</p>
                <p className="text-sm">
                  <span className="font-medium">SKS:</span> 
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                    {mataKuliah.sks} SKS
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Mata kuliah belum dipilih</p>
            )}
          </div>

          {/* Informasi Dosen */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-2">👨‍🏫 Dosen Pengampu</h4>
            {dosen ? (
              <div className="space-y-1">
                <p className="text-sm"><span className="font-medium">Nama:</span> {dosen.nama}</p>
                <p className="text-sm"><span className="font-medium">NIDN:</span> {dosen.nidn}</p>
                <p className="text-sm"><span className="font-medium">Program Studi:</span> {dosen.prodi}</p>
                <p className="text-sm">
                  <span className="font-medium">SKS yang Diampu:</span> 
                  <span className="ml-2 text-green-600 font-semibold">
                    {dosen.sksAmbil || 0} / {dosen.maxSks} SKS
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Dosen belum ditugaskan</p>
            )}
          </div>

          {/* Daftar Mahasiswa */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3">
              👥 Daftar Mahasiswa Terdaftar ({enrolledMahasiswa.length})
            </h4>
            {enrolledMahasiswa.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada mahasiswa terdaftar</p>
            ) : (
              <div className="space-y-2">
                {enrolledMahasiswa.map((mhs, idx) => (
                  <div 
                    key={mhs.id} 
                    className="flex justify-between items-center p-3 bg-white rounded border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-700">{idx + 1}.</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{mhs.nama}</p>
                          <p className="text-xs text-gray-600">{mhs.nim} - {mhs.prodi}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-600">
                        SKS: {mhs.sksAmbil || 0} / {mhs.maxSks}
                      </p>
                      <p className="text-xs text-gray-500">
                        Sisa: {(mhs.maxSks || 0) - (mhs.sksAmbil || 0)} SKS
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {mataKuliah && enrolledMahasiswa.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">📊 Ringkasan</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Mahasiswa</p>
                  <p className="text-2xl font-bold text-green-700">{enrolledMahasiswa.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total SKS Mahasiswa</p>
                  <p className="text-2xl font-bold text-green-700">
                    {enrolledMahasiswa.length * mataKuliah.sks} SKS
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t bg-gray-50">
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  );
};

export default KelasDetail;
