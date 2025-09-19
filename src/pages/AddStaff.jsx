import { useState } from "react";
import axios from "axios";

export default function UserForm() {
  const [form, setForm] = useState({
    role: "staff",
    name: "",
    phone: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/staff", form);
      alert("User created successfully");
      setForm({ role: "staff", name: "", phone: "", username: "", password: "" });
    } catch (err) {
      alert("Error: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded w-96 mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Staff User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="border w-full p-2 rounded"
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
            className="border w-full p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
