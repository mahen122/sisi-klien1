import Card from "@/Pages/Layouts/Components/Card";

const TransactionCard = ({ transaction }) => {
  const { datetime, account, amount, message } = transaction;

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">{datetime}</div>
          <div className="text-lg font-medium mt-1">Rek: {account}</div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">Nominal</div>
          <div className="text-lg font-semibold text-green-600">Rp {Number(amount).toLocaleString("id-ID")}</div>
        </div>
      </div>

      {message && (
        <div className="mt-4 text-gray-700">
          <strong>Pesan:</strong> {message}
        </div>
      )}
    </Card>
  );
};

export default TransactionCard;
