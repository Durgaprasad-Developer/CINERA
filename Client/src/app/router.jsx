import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import HomePage from "../features/home/pages/HomePage";
import ContentCard from "../components/common/ContentCard";
import Player from "../features/player/pages/Player";
import MyList from "../features/favorites/pages/MyList";
import SearchPage from "../features/search/pages/SearchPage";
import ContentDetail from "../features/content/pages/ContentDetail";




function ProtectedRoute({ children }) {
  const token = localStorage.getItem("cinera_token");
  return token ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("cinera_token");
  return token ? <Navigate to="/" /> : children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route
  path="/forgot-password"
  element={
    <PublicRoute>
      <ForgotPassword />
    </PublicRoute>
  }
/>

<Route
  path="/reset-password"
  element={
    <PublicRoute>
      <ResetPassword />
    </PublicRoute>
  }
/>


        {/* App layout + protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/content/:id" element={<ContentCard />} /> */}
          <Route path="/content/:id" element={<ContentDetail />} />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/notifications" element={<div>Notifications</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
