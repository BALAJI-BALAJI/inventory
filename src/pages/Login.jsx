import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("admin"); // admin or staff
  const [staffForm, setStaffForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle role selection
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setError("");
    setStaffForm({ identifier: "", password: "" });
    console.log("Role changed to:", e.target.value);
  };

  // Handle staff input changes
  const handleStaffChange = (e) => {
    setStaffForm({ ...staffForm, [e.target.name]: e.target.value });
    console.log("Staff input changed:", { ...staffForm, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Login attempt:", { role, staffForm });

    try {
      if (role === "admin") {
        console.log("Admin login selected");
        login("admin");
        navigate("/dashboard");
      } else {
        // Staff login
        const res = await axios.post("http://localhost:5000/staff/login", staffForm);
        console.log("Response from backend:", res.data);

        if (res.data.success && res.data.staff?.role === "staff") {
          console.log("Staff login success:", res.data.staff);
          setUser(res.data.staff);       // store staff info in context
          navigate("/dashboard");        // go to dashboard
        } else {
          console.warn("Staff login failed:", res.data);
          setError(res.data.message || res.data.error || "Login failed");
        }
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-96"
      >
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

        {/* Staff Login Form */}
        {role === "staff" && (
          <>
            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="mb-4">
              <label className="block mb-1">Username or Phone</label>
              <input
                name="identifier"
                value={staffForm.identifier}
                onChange={handleStaffChange}
                className="border w-full p-2 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={staffForm.password}
                onChange={handleStaffChange}
                className="border w-full p-2 rounded"
                required
              />
            </div>
          </>
        )}

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
