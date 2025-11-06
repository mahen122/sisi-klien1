import { useEffect, useState } from "react";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button from "@/Pages/Layouts/Components/Button";
import TransactionCard from "@/Pages/Transfer/components/TransactionCard";
import { confirmDelete } from "@/Pages/Layouts/Utils/Helpers/SwalHelpers";
import { toastSuccess } from "@/Pages/Layouts/Utils/Helpers/ToastHelpers";
import { sampleTransactions as fallbackTransactions } from "@/utils/dummyData";

const DaftarTransaksi = () => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const s = localStorage.getItem("transactions");
      return s ? JSON.parse(s) : fallbackTransactions;
    } catch (err) {
      console.error("Gagal membaca transaksi dari localStorage", err);
      return fallbackTransactions;
    }
  });

  useEffect(() => {
    const handler = () => {
      try {
        const s = localStorage.getItem("transactions");
        setTransactions(s ? JSON.parse(s) : []);
      } catch (err) {
        console.error("Gagal memuat transaksi:", err);
      }
    };

    window.addEventListener("transactions-updated", handler);

    return () => window.removeEventListener("transactions-updated", handler);
  }, []);

  const handleClearAll = () => {
    confirmDelete(() => {
      try {
        localStorage.removeItem("transactions");
        window.dispatchEvent(new Event("transactions-updated"));
        toastSuccess("Semua transaksi telah dihapus");
      } catch (err) {
        console.error("Gagal menghapus transaksi:", err);
      }
    });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Heading as="h2" align="left" color="text-gray-800" spacing="mb-0">
          Daftar Transaksi
        </Heading>
        <div>
          <Button variant="danger" size="sm" onClick={handleClearAll}>
            Hapus Semua Transaksi
          </Button>
        </div>
      </div>

      <div className="max-w-3xl">
        {transactions && transactions.length > 0 ? (
          transactions.map((t) => (
            <TransactionCard key={t.id} transaction={t} />
          ))
        ) : (
          <div className="text-gray-600">Belum ada transaksi.</div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">Halaman 2 dari 4</div>
      </div>
    </div>
  );
};

export default DaftarTransaksi;
