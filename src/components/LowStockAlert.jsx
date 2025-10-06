import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LowStockAlert() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://inventory-backend-9skz.onrender.com/products");
      const lowStock = res.data.filter((p) => p.quantity < 5);
      setLowStockProducts(lowStock);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
      setLoading(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      {/* Back Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-2 bg-yellow-300 rounded hover:bg-yellow-400"
        >
          &larr; Back
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Low Stock Alerts</h1>

      {lowStockProducts.length === 0 ? (
        <p className="text-gray-500">No low stock products.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Quantity</th>
                <th className="border px-3 py-2">Cost Price</th>
                <th className="border px-3 py-2">Selling Price</th>
                <th className="border px-3 py-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{p.name}</td>
                  <td className="border px-3 py-2">{p.quantity}</td>
                  <td className="border px-3 py-2">₹{p.costPrice}</td>
                  <td className="border px-3 py-2">₹{p.sellingPrice}</td>
                  <td className="border px-3 py-2">
                    {p.category?.name || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
