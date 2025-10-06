import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import  bg from "../assets/inventory-bg-img.jpg"
import axios from "axios";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("admin"); // admin or staff
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle role change
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setForm({ username: "", password: "" });
    setError("");
  };

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;

      if (role === "admin") {
        // ✅ Admin login (hardcoded) using /auth/login
        res = await axios.post("https://inventory-backend-9skz.onrender.com/auth/login", form, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // ✅ Staff login using /staff/login
        const payload = {
          identifier: form.username, // backend expects 'identifier' (username or phone)
          password: form.password,
        };
        res = await axios.post("https://inventory-backend-9skz.onrender.com/staff/login", payload, {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Check response
      if (res.data.success) {
        const userData = role === "admin" ? res.data.user : res.data.staff;
        const token = res.data.token || null;

        // Save in context
        login(userData, token);
        navigate("/dashboard");
      } else {
        setError(res.data.message || res.data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-100"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Inventory Login</h1>

        {/* Role Selection */}
        <div className="mb-4">
          <label className="block mb-1">Select Role</label>
          <select
            value={role}
            onChange={handleRoleChange}
            className="border w-full p-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Username / Identifier */}
        <div className="mb-4">
          <label className="block mb-1">
            {role === "admin" ? "Admin Username" : "Staff Username / Phone"}
          </label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
