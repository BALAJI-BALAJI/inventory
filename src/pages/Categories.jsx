import { useState, useEffect } from "react";
import axios from "axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("https://inventory-backend-9skz.onrender.com/categories");
    setCategories(res.data);
  };

  const handleSubmit = async () => {
    if (!name) return;
    if (editingId) {
      await axios.put(`https://inventory-backend-9skz.onrender.com/categories/${editingId}`, { name });
      setEditingId(null);
    } else {
      await axios.post("https://inventory-backend-9skz.onrender.com/categories", { name });
    }
    setName("");
    fetchCategories();
  };

  const handleEdit = (c) => {
    setName(c.name);
    setEditingId(c._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    await axios.delete(`https://inventory-backend-9skz.onrender.com/categories/${id}`);
    fetchCategories();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Category Name"
          className="border p-2"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-3 rounded"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c, i) => (
            <tr key={c._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
