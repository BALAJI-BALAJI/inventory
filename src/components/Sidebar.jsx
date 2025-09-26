import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Products", path: "/products" },
    { name: "Suppliers", path: "/suppliers" },
    { name: "Categories", path: "/categories" },
    { name: "Transactions", path: "/transactions" },
  ];

  // Only show Add Staff and Staff List for admin
  if (user?.role === "admin") {
    links.push(
      { name: "Add Staff", path: "/addstaff" },
      { name: "Staff List", path: "/staff" } 
    );
  }

  return (
    <div className="w-60 bg-gray-900 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `p-3 rounded mb-2 block ${
              isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  );
}
