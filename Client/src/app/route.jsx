import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("cinera_token");
  return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const role = localStorage.getItem("cinera_role");
  return role === "admin" ? children : <Navigate to="/admin/login" />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<div>Login</div>} />
        <Route path="/signup" element={<div>Signup</div>} />

        {/* User protected pages */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>Home</div>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <div>Admin Dashboard</div>
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
