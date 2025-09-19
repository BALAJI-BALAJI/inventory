import { useState, useEffect } from "react";
import axios from "axios";
import ProductTable from "../components/ProductTable";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    costPrice: "",
    sellingPrice: "",
    quantity: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/products");
    setProducts(res.data);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      quantity: Number(form.quantity),
    };

    if (editingId) {
      await axios.put(`http://localhost:5000/products/${editingId}`, data);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:5000/products", data);
    }
    setForm({ name: "", costPrice: "", sellingPrice: "", quantity: "" });
    fetchProducts();
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      quantity: p.quantity,
    });
    setEditingId(p._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/products/${id}`);
    fetchProducts();
  };

  const handleSell = (p) => {
    const soldQty = prompt(`Enter sold quantity for ${p.name}:`);
    if (soldQty && soldQty > 0 && soldQty <= p.quantity) {
      axios
        .put(`http://localhost:5000/products/${p._id}`, {
          ...p,
          quantity: p.quantity - Number(soldQty),
        })
        .then(fetchProducts);
    } else alert("Invalid quantity");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-5 gap-2 mb-4">
        <input
          placeholder="Name"
          className="border p-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Qty"
          type="number"
          className="border p-2"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <input
          placeholder="Cost Price"
          type="number"
          className="border p-2"
          value={form.costPrice}
          onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
        />
        <input
          placeholder="Selling Price"
          type="number"
          className="border p-2"
          value={form.sellingPrice}
          onChange={(e) =>
            setForm({ ...form, sellingPrice: e.target.value })
          }
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-3 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <ProductTable
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSell={handleSell}
      />
    </div>
  );
}
