import { useEffect, useState } from "react";
import Heading from "@/Pages/Layouts/Components/Heading";
import { toastSuccess, toastError } from "@/Pages/Layouts/Utils/Helpers/ToastHelpers";
import TransferForm from "@/Pages/Transfer/components/TransferForm";
import TransactionList from "@/Pages/Transfer/components/TransactionList";
import { sampleAccounts, sampleTransactions as fallbackTransactions } from "@/utils/dummyData";

const Transfer = () => {
	// Form state (lifted)
	const [account, setAccount] = useState(sampleAccounts[0].value);
	const [customAccount, setCustomAccount] = useState("");
	const [amount, setAmount] = useState("");
	const [message, setMessage] = useState("");
	const [useCustom, setUseCustom] = useState(false);

	// Transactions state
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	// Simulate fetching transactions with delay
		useEffect(() => {
			setLoading(true);
			const t = setTimeout(() => {
				try {
					const s = localStorage.getItem("transactions");
					const parsed = s ? JSON.parse(s) : fallbackTransactions;
					setTransactions(parsed);
				} catch (err) {
					console.error("Gagal memuat transaksi:", err);
					setTransactions(fallbackTransactions);
				} finally {
					setLoading(false);
				}
			}, 800); // 800ms delay to simulate network

			return () => clearTimeout(t);
		}, []);

	// Keep DaftarTransaksi (other pages) in sync — still dispatch an event
	const pushTransaction = (tx) => {
		try {
			const stored = JSON.parse(localStorage.getItem("transactions") || "[]");
			stored.unshift(tx);
			localStorage.setItem("transactions", JSON.stringify(stored));
			window.dispatchEvent(new Event("transactions-updated"));
		} catch (err) {
			console.error("Gagal menyimpan transaksi:", err);
		}
	};

	const handleTransfer = (e) => {
		e.preventDefault();

		const destination = account === "other" ? customAccount.trim() : account;
		if (!destination) {
			toastError("Nomor rekening tujuan wajib diisi");
			return;
		}

		const numeric = Number(amount);
		if (!numeric || numeric < 1000) {
			toastError("Nominal minimal Rp 1000");
			return;
		}

		const newTx = {
			id: Date.now(),
			datetime: new Date().toLocaleString("id-ID"),
			account: destination,
			amount: numeric,
			message: message.trim(),
		};

		// update local state so TransactionList updates immediately
		setTransactions((prev) => [newTx, ...(prev || [])]);

		// persist and notify other pages
		pushTransaction(newTx);

		toastSuccess(
			`Transfer berhasil ke ${destination} sebesar Rp ${numeric.toLocaleString("id-ID")}`
		);

		// reset form
		setAccount(sampleAccounts[0].value);
		setCustomAccount("");
		setAmount("");
		setMessage("");
		setUseCustom(false);
	};

	return (
		<div className="p-4">
			<Heading as="h2" align="left" color="text-gray-800" spacing="mb-4">
				Transfer
			</Heading>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<TransferForm
					sampleAccounts={sampleAccounts}
					account={account}
					setAccount={setAccount}
					customAccount={customAccount}
					setCustomAccount={setCustomAccount}
					useCustom={useCustom}
					setUseCustom={setUseCustom}
					amount={amount}
					setAmount={setAmount}
					message={message}
					setMessage={setMessage}
					onSubmit={handleTransfer}
				/>

				<div>
					<div className="mb-4 text-gray-700 font-medium">Riwayat Transaksi</div>
					<TransactionList transactions={transactions} loading={loading} />
				</div>
			</div>
		</div>
	);
};

export default Transfer;
