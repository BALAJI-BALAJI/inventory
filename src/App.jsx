import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LowStockAlert from "./components/LowStockAlert";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// 🌀 Simple loading spinner
function Loader() {
  console.log("🌀 Loader displayed — component is loading...");
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// 🧩 Lazy-loaded pages (add console logs here)
const Login = lazy(() => {
  console.log("📦 Lazy loading: Login.jsx");
  return import("./pages/Login");
});
const Dashboard = lazy(() => {
  console.log("📦 Lazy loading: Dashboard.jsx");
  return import("./pages/Dashborad");
});
const Products = lazy(() => {
  console.log("📦 Lazy loading: Products.jsx");
  return import("./pages/Products");
});
const Suppliers = lazy(() => {
  console.log("📦 Lazy loading: Suppliers.jsx");
  return import("./pages/Suppliers");
});
const Categories = lazy(() => {
  console.log("📦 Lazy loading: Categories.jsx");
  return import("./pages/Categories");
});
const Transactions = lazy(() => {
  console.log("📦 Lazy loading: Transactions.jsx");
  return import("./pages/Transactions");
});
const AddStaff = lazy(() => {
  console.log("📦 Lazy loading: AddStaff.jsx");
  return import("./pages/AddStaff");
});
const StaffList = lazy(() => {
  console.log("📦 Lazy loading: StaffList.jsx");
  return import("./pages/StaffList");
});

function App() {
  const { user } = useAuth();

  console.log("🚀 App component rendered");

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Navbar />
                  <div className="p-5 flex-1 overflow-auto">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/suppliers" element={<Suppliers />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/transactions" element={<Transactions />} />
                      <Route path="/low-stock" element={<LowStockAlert />} />
                      {user?.role === "admin" && (
                        <>
                          <Route path="/addstaff" element={<AddStaff />} />
                          <Route path="/staff" element={<StaffList />} />
                        </>
                      )}
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
