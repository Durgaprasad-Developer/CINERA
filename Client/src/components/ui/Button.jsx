export default function Button({
  children,
  variant = "primary",
  full = false,
  ...props
}) {
  const base =
    "px-4 py-2 rounded-md font-medium transition-all duration-200";

  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${
        full ? "w-full" : ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
