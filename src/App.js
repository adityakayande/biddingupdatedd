import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Home from "./screens/home/Home";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import Dashboard from "./screens/dashboard/Dashboard";
import CreateListing from "./screens/dashboard/CreateListing";
import EditListing from "./screens/dashboard/EditListing";
import ProductDetails from "./screens/product/ProductDetails";
import Profile from "./screens/profile/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// PrivateRoute wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { isDark } = useTheme();
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      <BrowserRouter>
        <Navbar />
        <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/create-listing" element={<PrivateRoute><CreateListing /></PrivateRoute>} />
            <Route path="/edit-listing/:id" element={<PrivateRoute><EditListing /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </BrowserRouter>
      <ToastContainer theme={isDark ? 'dark' : 'light'} position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
