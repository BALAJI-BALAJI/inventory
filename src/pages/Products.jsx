import { useState, useEffect } from "react";
import axios from "axios";
import ProductTable from "../components/ProductTable";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    costPrice: "",
    sellingPrice: "",
    quantity: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      quantity: Number(form.quantity),
    };

    try {
      let product;
      if (editingId) {
        await axios.put(`http://localhost:5000/products/${editingId}`, data);
        product = { ...data, _id: editingId };
        setEditingId(null);
      } else {
        const res = await axios.post("http://localhost:5000/products", data);
        product = res.data;
      }

      // Create Stock IN transaction only for new product
      if (!editingId && product.quantity > 0) {
        await axios.post("http://localhost:5000/transactions", {
          productId: product._id,
          productName: product.name,
          type: "IN",
          qty: product.quantity,
          costPrice: product.costPrice,
          sellingPrice: product.sellingPrice,
          date: new Date(),
        });
      }

      setForm({
        name: "",
        costPrice: "",
        sellingPrice: "",
        quantity: "",
        category: "",
      });

      fetchProducts();
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      quantity: p.quantity,
      category: p.category?._id || p.category || "",
    });
    setEditingId(p._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const handleSell = async (p) => {
    const soldQty = prompt(`Enter sold quantity for ${p.name}:`);
    const qtyNumber = Number(soldQty);

    if (!soldQty || qtyNumber <= 0 || qtyNumber > p.quantity) {
      alert("Invalid quantity");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/products/${p._id}`, {
        ...p,
        quantity: p.quantity - qtyNumber,
      });

      await axios.post("http://localhost:5000/transactions", {
        productId: p._id,
        productName: p.name,
        type: "OUT",
        qty: qtyNumber,
        sellingPrice: p.sellingPrice,
        costPrice: p.costPrice,
        date: new Date(),
      });

      fetchProducts();
    } catch (err) {
      console.error("Error selling product", err);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Products</h1>

      {/* Add / Update Form */}
      <div className="grid grid-cols-6 gap-2 mb-4">
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
          onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
        />
        <select
          className="border p-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-3 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by product or category"
          className="border p-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Table */}
      <ProductTable
        products={filteredProducts}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSell={handleSell}
      />
    </div>
  );
}
