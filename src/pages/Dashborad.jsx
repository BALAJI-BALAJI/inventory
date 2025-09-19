import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/products");
    setProducts(res.data);
  };

  const fetchTransactions = async () => {
    const res = await axios.get("http://localhost:5000/transactions");
    setTransactions(res.data);
  };

  const totalStockValue = products.reduce(
    (acc, p) => acc + p.quantity * p.costPrice,
    0
  );

  const lowStockCount = products.filter((p) => p.quantity < 5).length;

  // Prepare daily sales for chart
  const dailySales = transactions
    .filter((t) => t.type === "OUT")
    .reduce((acc, t) => {
      const day = new Date(t.date).toLocaleDateString();
      const existing = acc.find((d) => d.date === day);
      if (existing) existing.sales += t.qty * t.sellingPrice;
      else acc.push({ date: day, sales: t.qty * t.sellingPrice });
      return acc;
    }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Total Products</h2>
          <p className="text-2xl">{products.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Total Stock Value</h2>
          <p className="text-2xl">₹{totalStockValue}</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Low Stock Alerts</h2>
          <p className="text-2xl">{lowStockCount}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-4">Daily Sales</h2>
        {dailySales.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No sales data</p>
        )}
      </div>
    </div>
  );
}
