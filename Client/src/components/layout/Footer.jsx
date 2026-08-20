export default function Footer() {
  return (
    <footer
      className="border-t text-[#6B6B7B] text-sm"
      style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0D0D0F" }}
    >
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <span className="text-white font-bold text-lg tracking-widest uppercase">
            CINERA
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#6B6B7B]">
            <span className="cursor-pointer hover:text-[#A8A8B3] transition-colors">Help Center</span>
            <span className="cursor-pointer hover:text-[#A8A8B3] transition-colors">Terms of Use</span>
            <span className="cursor-pointer hover:text-[#A8A8B3] transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-[#A8A8B3] transition-colors">Contact Us</span>
          </div>
        </div>
        <p className="mt-6 text-xs text-[#6B6B7B]/60">
          © {new Date().getFullYear()} CINERA. Every title on this platform was generated, not filmed.
        </p>
      </div>
    </footer>
  );
}
