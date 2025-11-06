import TransactionCard from "@/Pages/Transfer/components/TransactionCard";

const TransactionList = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="max-w-3xl">
        <div className="p-6 bg-white rounded-lg shadow">Loading transaksi...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {transactions && transactions.length > 0 ? (
        transactions.map((t) => <TransactionCard key={t.id} transaction={t} />)
      ) : (
        <div className="p-6 bg-white rounded-lg shadow text-gray-600">Belum ada transaksi.</div>
      )}
    </div>
  );
};

export default TransactionList;
