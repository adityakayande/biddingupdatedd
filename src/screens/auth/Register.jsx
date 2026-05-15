import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in relative z-10 py-12">
      <div className="glass-card w-full max-w-xl p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl mb-2 text-white">Create an Account</h2>
          <p className="text-gray-400">Join the premium bidding community</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field" 
                placeholder="Choose a username" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field" 
                placeholder="Enter your email" 
                required 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field" 
              placeholder="Create a strong password" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field" 
              placeholder="Confirm your password" 
              required 
            />
          </div>

          <div className="flex items-start gap-3 py-2">
            <input 
              type="checkbox" 
              required 
              className="mt-1 w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary focus:ring-offset-dark-900 bg-dark-800"
            />
            <label className="text-sm text-gray-400">
              I agree to the <span className="text-primary cursor-pointer hover:underline">Terms of Service</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary !py-4 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400">
          Already have an account? <Link to="/login" className="text-primary hover:text-white transition-colors font-medium">Sign in instead</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
