import { useEffect, useState } from "react";
import axios from "axios";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await axios.get("http://localhost:5000/transactions");
    setTransactions(res.data);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Transactions (Stock In/Out)</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t,i)=>(
              <tr key={t._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                <td className="border p-2">{i+1}</td>
                <td className="border p-2">{t.productName}</td>
                <td className="border p-2">{t.type}</td>
                <td className="border p-2">{t.qty}</td>
                <td className="border p-2">{new Date(t.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
