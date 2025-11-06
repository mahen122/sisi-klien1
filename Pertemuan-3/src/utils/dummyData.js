// Dummy data shared across transfer pages
export const sampleAccounts = [
  { label: "Bank ABC - 1234567890", value: "1234567890" },
  { label: "Bank XYZ - 0987654321", value: "0987654321" },
];

export const sampleTransactions = [
  {
    id: 1,
    datetime: "2025-11-05 09:32:12",
    account: "1234567890",
    amount: 250000,
    message: "Pembayaran SPP",
  },
  {
    id: 2,
    datetime: "2025-11-04 15:10:05",
    account: "0987654321",
    amount: 15000,
    message: "",
  },
  {
    id: 3,
    datetime: "2025-11-03 18:45:33",
    account: "1234567890",
    amount: 1000000,
    message: "Transfer hadiah",
  },
];

export const dummyUser = {
  email: "user@transaksiku.com",
  password: "123456",
  name: "Andi Saputra",
  saldo: 2500000,
};

export const transaksiList = [
  {
    id: "TRX001",
    tanggal: "2025-04-20",
    tujuan: "Budi Santoso",
    nominal: 500000,
    catatan: "Bayar utang",
    status: "Berhasil",
  },
  {
    id: "TRX002",
    tanggal: "2025-04-18",
    tujuan: "Siti Aminah",
    nominal: 250000,
    catatan: "Transfer pulsa",
    status: "Berhasil",
  },
  {
    id: "TRX003",
    tanggal: "2025-04-15",
    tujuan: "Ahmad Fauzi",
    nominal: 1000000,
    catatan: "Biaya kuliah",
    status: "Berhasil",
  },
];
