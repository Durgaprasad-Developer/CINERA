import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0D0D0F", color: "#FFFFFF", fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
