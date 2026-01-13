import React from "react";
import { useParams } from "react-router-dom";
import Card from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import { useMahasiswaDetail } from "@/Pages/Layouts/Utils/Hooks/useMahasiswa";

const MahasiswaDetail = () => {
  const { nim } = useParams();
  const { data, isLoading, isError } = useMahasiswaDetail(nim);

  if (isLoading) {
    return <p className="text-gray-600">Memuat detail...</p>;
  }

  if (isError || !data) {
    return <p className="text-red-600">Data mahasiswa tidak ditemukan.</p>;
  }

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">Detail Mahasiswa</Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">NIM</td>
            <td className="py-2 px-4">{data.nim}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama</td>
            <td className="py-2 px-4">{data.nama}</td>
          </tr>
          {data.prodi ? (
            <tr>
              <td className="py-2 px-4 font-medium">Prodi</td>
              <td className="py-2 px-4">{data.prodi}</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </Card>
  );
};

export default MahasiswaDetail;