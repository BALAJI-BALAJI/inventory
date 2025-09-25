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

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setError("");
    setStaffForm({ identifier: "", password: "" });
  };

  const handleStaffChange = (e) => {
    setStaffForm({ ...staffForm, [e.target.name]: e.target.value });
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (role === "admin") {
    // Admin login is implicit
    login("admin");
    navigate("/dashboard");
  } else {
    // Staff login
    try {
      const res = await axios.post("http://localhost:5000/staff/login", staffForm);

      // Check if backend returned a staff object
      if (res.data && res.data.role === "staff") {
        setUser(res.data);        // store staff info in context
        navigate("/dashboard");   // ✅ go to dashboard
      } else {
        setError("Login failed"); // fallback error
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }
};


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Inventory Login</h1>

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

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
