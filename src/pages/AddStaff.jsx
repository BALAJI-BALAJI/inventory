import { useState } from "react";
import axios from "axios";

export default function AddStaff() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    username: "",
    password: "",
    role: "staff", // default role
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/staff", form);
      setMessage("Staff added successfully!");
      setForm({
        name: "",
        phone: "",
        username: "",
        password: "",
        role: "staff",
      });
    } catch (err) {
      console.error(err);
      setMessage("Error adding staff");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Add Staff</h1>
      {message && <p className="mb-2 text-blue-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Staff
        </button>
      </form>
    </div>
  );
}
