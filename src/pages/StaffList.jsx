import { useState, useEffect } from "react";
import axios from "axios";

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get("https://inventory-backend-9skz.onrender.com/staff");
      setStaff(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`https://inventory-backend-9skz.onrender.com/staff/${id}`);
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  if (loading) return <p>Loading staff...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (staff.length === 0) return <p>No staff found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Staff Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Password</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s, i) => (
              <tr key={s._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.phone}</td>
                <td className="border p-2">{s.username}</td>
                <td className="border p-2">{s.password}</td> {/* Only visible to admin */}
                <td className="border p-2">{s.role}</td>
                <td className="border p-2 flex gap-2 justify-center">
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
    </div>
  );
}
