import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import { forgotPasswordApi } from "../api/authApi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await forgotPasswordApi({ email });
      setMessage("OTP sent to your email");
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card>
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}

          <Button full type="submit">
            {loading ? <Spinner /> : "Send OTP"}
          </Button>
        </form>

        <div className="mt-4 text-sm text-gray-400 text-center">
          <Link to="/login" className="hover:text-white">
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
