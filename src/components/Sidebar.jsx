import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Suppliers", path: "/suppliers" },
    { name: "Categories", path: "/categories" },
    { name: "Transactions", path: "/transactions" },
    { name: "Add Staff", path: "/addstaff" },
  ];

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
