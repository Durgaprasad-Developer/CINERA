import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";
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
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card>
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Sign in to CINERA
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button full type="submit">
  {loading ? <Spinner /> : "Sign In"}
</Button>

        </form>

        <div className="mt-4 text-sm text-gray-400 text-center">
          <Link
            to="/forgot-password"
            className="hover:text-white"
          >
            Forgot password?
          </Link>
        </div>

        <div className="mt-4 text-sm text-gray-400 text-center">
          New to CINERA?{" "}
          <Link
            to="/signup"
            className="text-white hover:underline"
          >
            Sign up now
          </Link>
        </div>
      </Card>
    </div>
  );
}
