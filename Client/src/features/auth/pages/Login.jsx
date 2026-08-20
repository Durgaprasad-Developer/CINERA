import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Spinner from "../../../components/ui/Spinner";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0D0D0F" }}
    >
      {/* Top bar */}
      <header className="px-8 py-6">
        <span
          className="text-white text-xl font-bold tracking-widest uppercase cursor-pointer"
          onClick={() => navigate("/")}
        >
          CINERA
        </span>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white">Sign in</h1>
            <p className="text-sm text-[#A8A8B3]">
              Welcome back to CINERA
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#A8A8B3] uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-[#1A1A1D] border border-white/[0.08] text-white placeholder-[#6B6B7B] px-4 py-3 rounded-xl text-sm outline-none focus:border-white/30 focus:ring-0 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#A8A8B3] uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#1A1A1D] border border-white/[0.08] text-white placeholder-[#6B6B7B] px-4 py-3 rounded-xl text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-[#A8A8B3] bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold text-sm py-3 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all duration-150 mt-2 disabled:opacity-50"
            >
              {loading ? <Spinner className="w-4 h-4 mx-auto" /> : "Sign In"}
            </button>
          </form>

          <div className="flex items-center justify-between text-sm text-[#6B6B7B]">
            <Link to="/forgot-password" className="hover:text-[#A8A8B3] transition-colors">
              Forgot password?
            </Link>
            <span>
              New?{" "}
              <Link to="/signup" className="text-white hover:text-white/80 transition-colors font-medium">
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
