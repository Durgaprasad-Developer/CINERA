import { useAuth } from "../../features/auth/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-30 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="text-red-600 text-2xl font-bold">CINERA</span>

        {user && (
          <button
            onClick={logout}
            className="text-sm text-gray-300 hover:text-white"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
