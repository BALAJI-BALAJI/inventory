import { useState, useEffect } from "react";
import axios from "axios";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await axios.get("https://inventory-backend-9skz.onrender.com/suppliers");
    setSuppliers(res.data);
  };

  const handleSubmit = async () => {
    if (!name || !contact) return;

    const data = { name, contact, description };

    if (editingId) {
      await axios.put(`https://inventory-backend-9skz.onrender.com/suppliers/${editingId}`, data);
      setEditingId(null);
    } else {
      await axios.post("https://inventory-backend-9skz.onrender.com/suppliers", data);
    }

    setName("");
    setContact("");
    setDescription("");
    fetchSuppliers();
  };

  const handleEdit = (s) => {
    setName(s.name);
    setContact(s.contact);
    setDescription(s.description || "");
    setEditingId(s._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    await axios.delete(`https://inventory-backend-9skz.onrender.com/suppliers/${id}`);
    fetchSuppliers();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Suppliers</h1>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Supplier Name"
          className="border p-2"
        />
        <input
          value={contact}
          onChange={e => setContact(e.target.value)}
          placeholder="Contact"
          className="border p-2"
        />
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
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
            <th className="border p-2">Contact</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s, i) => (
            <tr key={s._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.contact}</td>
              <td className="border p-2">{s.description || "-"}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
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
