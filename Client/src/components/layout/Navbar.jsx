import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Search, Bell, ChevronDown } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0D0D0F] border-b border-white/[0.06] shadow-lg"
          : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">

        {/* Left — logo + nav links */}
        <div className="flex items-center gap-8">
          <span
            className="text-white text-xl font-bold tracking-widest cursor-pointer select-none uppercase"
            onClick={() => navigate("/")}
          >
            CINERA
          </span>

          {user && (
            <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-[#A8A8B3]">
              <li
                className="cursor-pointer hover:text-white transition-colors duration-150"
                onClick={() => navigate("/")}
              >
                Home
              </li>
              <li
                className="cursor-pointer hover:text-white transition-colors duration-150"
                onClick={() => navigate("/my-list")}
              >
                My List
              </li>
            </ul>
          )}
        </div>

        {/* Right — actions */}
        {user ? (
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/search")}
              className="text-[#A8A8B3] hover:text-white transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button className="text-[#A8A8B3] hover:text-white transition-colors relative" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </button>

            {/* Avatar dropdown */}
            <div className="relative group flex items-center gap-1.5 cursor-pointer">
              <div className="w-8 h-8 rounded-md overflow-hidden bg-[#242428] border border-white/10">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || "cinera"}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#A8A8B3] group-hover:text-white transition-colors" />

              {/* Dropdown */}
              <div className="absolute right-0 top-10 w-44 bg-[#1A1A1D] border border-white/[0.08] rounded-xl py-1.5 hidden group-hover:block shadow-2xl">
                <div className="px-3 py-2 text-xs text-[#6B6B7B] border-b border-white/[0.06] mb-1 truncate">
                  {user.email}
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-[#A8A8B3] hover:text-white hover:bg-white/5 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
