import { useEffect } from "react";
import AppRouter from "./app/route.jsx";
import Providers from "./app/providers";
import { useAuth } from "./features/auth/hooks/useAuth";

function AppContent() {
  const fetchProfile = useAuth((s) => s.fetchProfile);

  useEffect(() => {
    const token = localStorage.getItem("cinera_token");
    if (token) {
      fetchProfile();
    }
  }, []);

  return <AppRouter />;
}

function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}

export default App;
