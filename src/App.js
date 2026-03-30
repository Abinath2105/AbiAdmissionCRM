import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppRoutes from "./routes";
import Layout from "./components/layouts/Layout";


function AppContent() {
  const { role } = useAuth();


  if (!role) {
    return <AppRoutes />;
  }

 
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}