import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  error,
  type,
  ...props
}) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-300">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          className="bg-gray-800 text-white px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-red-600 pr-10 w-full"
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
