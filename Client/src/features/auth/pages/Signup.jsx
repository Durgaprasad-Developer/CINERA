import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../../components/ui/Spinner";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup({ name, email, password });
      navigate("/login");
    } catch {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0D0D0F" }}
    >
      {/* Top bar */}
      <header className="px-8 py-6 flex items-center justify-between">
        <span
          className="text-white text-xl font-bold tracking-widest uppercase cursor-pointer"
          onClick={() => navigate("/")}
        >
          CINERA
        </span>
        <Link to="/login" className="text-sm text-[#A8A8B3] hover:text-white transition-colors">
          Sign in
        </Link>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-white">Create account</h1>
            <p className="text-sm text-[#A8A8B3]">
              Join CINERA — AI-generated cinema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#A8A8B3] uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full bg-[#1A1A1D] border border-white/[0.08] text-white placeholder-[#6B6B7B] px-4 py-3 rounded-xl text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>

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
                className="w-full bg-[#1A1A1D] border border-white/[0.08] text-white placeholder-[#6B6B7B] px-4 py-3 rounded-xl text-sm outline-none focus:border-white/30 transition-colors"
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
              {loading ? <Spinner className="w-4 h-4 mx-auto" /> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#6B6B7B]">
            Already a member?{" "}
            <Link to="/login" className="text-white hover:text-white/80 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
