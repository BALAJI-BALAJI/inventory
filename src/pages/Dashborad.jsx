import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();



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

  // ✅ Filter transactions by selected date range
  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;
    return afterStart && beforeEnd;
  });

  // ✅ Prepare daily sales for chart
  const dailySalesMap = filteredTransactions
    .filter((t) => t.type === "OUT")
    .reduce((acc, t) => {
      const day = new Date(t.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
      acc[day] = (acc[day] || 0) + t.qty * t.sellingPrice;
      return acc;
    }, {});

  // Convert to array & sort by date
  const dailySales = Object.entries(dailySalesMap)
    .map(([date, sales]) => ({ date, sales }))
    .sort(
      (a, b) =>
        new Date(a.date.split("-").reverse().join("-")) -
        new Date(b.date.split("-").reverse().join("-"))
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Total Products</h2>
          <p className="text-2xl">{products.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h2 className="font-bold">Total Stock Value</h2>
          <p className="text-2xl">₹{totalStockValue}</p>
        </div>
        <div
        onClick={() => navigate("/low-stock")} 
          className="bg-red-500 text-white p-4 rounded shadow cursor-pointer hover:bg-red-600"
        >
          <h2 className="font-bold">Low Stock Alerts</h2>
          <p className="text-2xl">{lowStockCount}</p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-bold">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-bold">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
          }}
          className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {/* Daily Sales Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-4">Daily Sales</h2>
        {dailySales.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
              <Bar dataKey="sales" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No sales data</p>
        )}
      </div>
    </div>
  );
}
