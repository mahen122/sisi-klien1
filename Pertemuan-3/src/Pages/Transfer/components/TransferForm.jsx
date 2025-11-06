import Label from "@/Pages/Layouts/Components/Label";
import Input from "@/Pages/Layouts/Components/Input";
import Button from "@/Pages/Layouts/Components/Button";

const TransferForm = ({
  sampleAccounts,
  account,
  setAccount,
  customAccount,
  setCustomAccount,
  useCustom,
  setUseCustom,
  amount,
  setAmount,
  message,
  setMessage,
  onSubmit,
}) => {
  return (
    <div className="max-w-md bg-white p-6 rounded-lg shadow">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="account">Nomor Rekening Tujuan</Label>
          <select
            id="account"
            value={account}
            onChange={(e) => {
              setAccount(e.target.value);
              setUseCustom(e.target.value === "other");
            }}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          >
            {sampleAccounts.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
            <option value="other">Lainnya (masukkan manual)</option>
          </select>

          {useCustom && (
            <div className="mt-2">
              <Input
                type="text"
                name="customAccount"
                value={customAccount}
                onChange={(e) => setCustomAccount(e.target.value)}
                placeholder="Masukkan nomor rekening"
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="amount">Nominal (Rp)</Label>
          <Input
            type="number"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Masukkan nominal, minimal 1000"
          />
        </div>

        <div>
          <Label htmlFor="message">Pesan (opsional)</Label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Pesan untuk penerima"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            rows={4}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary">
            Transfer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;
