import { useState } from "react";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Pagination from "@/Pages/Layouts/Components/Pagination";
import { useMahasiswaList } from "@/Pages/Layouts/Utils/Hooks/useMahasiswa";
import { useKelasList } from "@/Pages/Layouts/Utils/Hooks/useKelas";
import { useMataKuliahList } from "@/Pages/Layouts/Utils/Hooks/useMataKuliah";

const MahasiswaSKS = () => {
  const { data: mahasiswaList = [], isLoading: loadingMahasiswa } = useMahasiswaList();
  const { data: kelasList = [] } = useKelasList();
  const { data: mataKuliahList = [] } = useMataKuliahList();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get enrolled classes for each mahasiswa
  const getMahasiswaWithClasses = () => {
    return mahasiswaList.map(mhs => {
      const enrolledClasses = kelasList.filter(
        kls => kls.mahasiswaIds && kls.mahasiswaIds.includes(mhs.id)
      );

      const classesWithDetails = enrolledClasses.map(kls => {
        const mataKuliah = mataKuliahList.find(mk => mk.id === kls.mataKuliahId);
        return {
          ...kls,
          mataKuliah
        };
      });

      return {
        ...mhs,
        enrolledClasses: classesWithDetails
      };
    });
  };

  const mahasiswaWithClasses = getMahasiswaWithClasses();
  const totalPages = Math.ceil(mahasiswaWithClasses.length / itemsPerPage);
  const paginatedData = mahasiswaWithClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loadingMahasiswa) {
    return (
      <Card>
        <div className="py-8 text-center text-gray-600">Memuat data...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <Heading as="h2" className="mb-6">📊 Daftar SKS Mahasiswa</Heading>

        <div className="space-y-4">
          {paginatedData.map((mhs, idx) => {
            const sksUsed = mhs.sksAmbil || 0;
            const sksRemaining = (mhs.maxSks || 0) - sksUsed;
            const percentage = mhs.maxSks ? (sksUsed / mhs.maxSks) * 100 : 0;

            return (
              <div 
                key={mhs.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Header Mahasiswa */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{mhs.nama}</h3>
                    <p className="text-sm text-gray-600">{mhs.nim} - {mhs.prodi}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {sksUsed} <span className="text-sm text-gray-500">/ {mhs.maxSks} SKS</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Sisa: <span className="font-semibold text-green-600">{sksRemaining} SKS</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        percentage >= 90 ? 'bg-red-500' : 
                        percentage >= 70 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{percentage.toFixed(1)}% terpakai</p>
                </div>

                {/* Daftar Kelas */}
                <div className="bg-gray-50 rounded p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    📚 Mata Kuliah yang Diambil ({mhs.enrolledClasses.length})
                  </h4>
                  {mhs.enrolledClasses.length === 0 ? (
                    <p className="text-sm text-gray-500">Belum mengambil mata kuliah</p>
                  ) : (
                    <div className="space-y-1">
                      {mhs.enrolledClasses.map((kls) => (
                        <div key={kls.id} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-gray-200">
                          <div className="flex-1">
                            <span className="font-medium text-gray-800">{kls.nama}</span>
                            {kls.mataKuliah && (
                              <span className="text-gray-600 ml-2">
                                ({kls.mataKuliah.kode})
                              </span>
                            )}
                          </div>
                          {kls.mataKuliah && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                              {kls.mataKuliah.sks} SKS
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {mahasiswaWithClasses.length > itemsPerPage && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={mahasiswaWithClasses.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default MahasiswaSKS;
