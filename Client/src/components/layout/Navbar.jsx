import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-30 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <span
          className="text-red-600 text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          CINERA
        </span>

        {user && (
          <div className="flex items-center gap-6">
            {/* Search */}
            <button
              onClick={() => navigate("/search")}
              className="text-gray-300 hover:text-white text-lg"
              title="Search"
            >
              🔍
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="text-sm text-gray-300 hover:text-white"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
