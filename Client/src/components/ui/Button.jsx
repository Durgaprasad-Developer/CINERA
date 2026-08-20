export default function Button({
  children,
  variant = "primary",
  full = false,
  ...props
}) {
  const base =
    "px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-[0.98]";

  const variants = {
    primary: "bg-white text-black hover:bg-white/90",
    secondary: "bg-[#1A1A1D] text-white border border-white/[0.08] hover:bg-[#242428]",
    ghost: "bg-transparent text-white hover:bg-white/10 border border-white/20",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${full ? "w-full" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
