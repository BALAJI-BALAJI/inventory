import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useAuth();
  return (
    <div className="flex justify-between items-center bg-gray-800 text-white p-4">
      <h1 className="text-lg font-bold">Inventory System</h1>
      <div>
        <span className="mr-4">{user.role.toUpperCase()}</span>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}
