import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiShield, FiSettings } from "react-icons/fi";
import api from "../../utils/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20 glass-card max-w-2xl mx-auto mt-12">
        <h3 className="text-xl text-red-400 mb-2">Oops!</h3>
        <p className="text-gray-500">{error || "User not found."}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in py-12 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400">Manage your account details and settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="glass-card p-8 md:col-span-1 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/20 mb-6">
            <FiUser size={48} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-1 truncate w-full">{user.email.split('@')[0]}</h2>
          <p className="text-primary font-medium mb-6 uppercase tracking-widest text-xs">{user.role}</p>
          
          <div className="w-full h-[1px] bg-white/10 mb-6"></div>
          
          <Link to="/dashboard" className="w-full btn-secondary mb-3">View Dashboard</Link>
          <Link to="/create-listing" className="w-full btn-primary">Create Listing</Link>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FiSettings className="text-primary" /> Account Details
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <div className="flex items-center gap-3 bg-dark-900/50 p-4 rounded-xl border border-white/5">
                  <FiMail className="text-gray-500" />
                  <span className="text-white font-medium">{user.email}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Account ID</label>
                <div className="flex items-center gap-3 bg-dark-900/50 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-500 font-bold">#</span>
                  <span className="text-white font-medium">{user.id}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Security Role</label>
                <div className="flex items-center gap-3 bg-dark-900/50 p-4 rounded-xl border border-white/5">
                  <FiShield className="text-green-500" />
                  <span className="text-white font-medium capitalize">{user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
