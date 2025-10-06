import { Routes, Route, Navigate, Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LowStockAlert from "./components/LowStockAlert";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashborad"));
const Products = lazy(() => import("./pages/Products"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const Categories = lazy(() => import("./pages/Categories"));
const Transactions = lazy(() => import("./pages/Transactions"));
const AddStaff = lazy(() => import("./pages/AddStaff"));
const StaffList = lazy(() => import("./pages/StaffList"));

// Tailwind loader
function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

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
                    {/* ✅ NO nested <Routes> — just child <Route>s below */}
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
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
