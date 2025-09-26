import { useEffect, useState } from "react";
import axios from "axios";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/transactions");
      setTransactions(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete all transactions?")) return;
    try {
      await axios.delete("http://localhost:5000/transactions");
      setTransactions([]);
    } catch (err) {
      console.error("Error clearing transactions", err);
      setError("Failed to clear transactions");
    }
  };

  const totalInQty = transactions
    .filter((t) => t.type === "IN")
    .reduce((sum, t) => sum + Number(t.qty || 0), 0);

  const totalOutQty = transactions
    .filter((t) => t.type === "OUT")
    .reduce((sum, t) => sum + Number(t.qty || 0), 0);

  const totalInAmount = transactions
    .filter((t) => t.type === "IN")
    .reduce((sum, t) => sum + (Number(t.qty || 0) * Number(t.costPrice || 0)), 0);

  const totalOutAmount = transactions
    .filter((t) => t.type === "OUT")
    .reduce((sum, t) => sum + (Number(t.qty || 0) * Number(t.sellingPrice || 0)), 0);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (transactions.length === 0) return <p>No transactions available.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Transactions (Stock In/Out)</h1>

      <div className="flex justify-between items-center mb-4">
        <p>
          <span className="font-semibold text-green-600">
            Total In: {totalInQty} (₹{totalInAmount})
          </span>{" "}
          |{" "}
          <span className="font-semibold text-red-600">
            Total Out: {totalOutQty} (₹{totalOutAmount})
          </span>
        </p>
        <button
          onClick={handleClearAll}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Clear All Transactions
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => {
              const amount =
                t.type === "IN"
                  ? Number(t.qty || 0) * Number(t.costPrice || 0)
                  : Number(t.qty || 0) * Number(t.sellingPrice || 0);

              return (
                <tr key={t._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{t.productName || "-"}</td>
                  <td
                    className={`border p-2 font-semibold ${
                      t.type === "IN" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "IN" ? "Stock In" : "Stock Out"}
                  </td>
                  <td className="border p-2">{t.qty}</td>
                  <td className="border p-2">₹{amount}</td>
                  <td className="border p-2">{new Date(t.date).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
