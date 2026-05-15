import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiActivity, FiClock, FiPlus, FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";
import api from "../../utils/api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("listings");
  const [products, setProducts] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); // product to delete
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, bidsRes] = await Promise.all([
        api.get("/products/me"),
        api.get("/bids/me")
      ]);
      setProducts(productsRes.data);
      setBids(bidsRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteTarget.id}`);
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete listing", err);
    } finally {
      setDeleting(false);
    }
  };

  const activeListings = products.filter(p => p.is_active && new Date(p.end_time) > new Date()).length;
  const wonBids = bids.filter(b => b.status === 'accepted').length;

  return (
    <div className="animate-fade-in py-8">

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={28} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Listing?</h3>
            <p className="text-gray-400 mb-6 text-sm">
              Permanently remove <span className="text-white font-medium">"{deleteTarget.title}"</span> and all its bids? This cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn-secondary flex-1"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 px-6 rounded-xl font-semibold text-sm bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-all"
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your listings and track your bids.</p>
        </div>
        <Link to="/create-listing" className="btn-primary flex items-center gap-2">
          <FiPlus /> New Listing
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <FiPackage size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Active Listings</p>
            <p className="text-2xl font-bold text-white">{activeListings}</p>
          </div>
        </div>
        
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
            <FiActivity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">My Bids</p>
            <p className="text-2xl font-bold text-white">{bids.length}</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
            <FiClock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Items Won</p>
            <p className="text-2xl font-bold text-white">{wonBids}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-8">
        <button 
          onClick={() => setActiveTab("listings")}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === "listings" ? "text-primary" : "text-gray-400 hover:text-white"}`}
        >
          My Listings
          {activeTab === "listings" && (
            <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-primary rounded-t-full"></span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab("bids")}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === "bids" ? "text-primary" : "text-gray-400 hover:text-white"}`}
        >
          My Bids
          {activeTab === "bids" && (
            <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-primary rounded-t-full"></span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="glass-card min-h-[300px] p-8">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === "listings" ? (
          products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => {
                const isEnded = new Date(product.end_time) < new Date();
                return (
                  <div
                    key={product.id}
                    className="bg-dark-900 rounded-xl overflow-hidden border border-white/10 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 flex flex-col"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${!isEnded && product.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {!isEnded && product.is_active ? 'Active' : 'Ended'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-white mb-1 truncate">{product.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">Base: ${product.base_price.toLocaleString()}</p>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-auto">
                        <Link
                          to={`/product/${product.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all text-xs font-medium"
                        >
                          <FiExternalLink size={12} /> View
                        </Link>
                        <Link
                          to={`/edit-listing/${product.id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all text-xs font-medium"
                        >
                          <FiEdit2 size={12} /> Edit
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs font-medium"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                <FiPackage size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No listings yet</h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">You haven't created any auctions. Start selling your premium items today.</p>
              <Link to="/create-listing" className="btn-secondary !px-6 !py-2">Create Listing</Link>
            </div>
          )
        ) : (
          bids.length > 0 ? (
            <div className="space-y-4">
              {bids.map(bid => (
                <div key={bid.id} className="bg-dark-900 rounded-xl border border-white/10 p-4 flex justify-between items-center">
                  <div>
                    <Link to={`/product/${bid.product_id}`} className="font-bold text-white mb-1 hover:text-primary transition-colors flex items-center gap-1.5">
                      Product #{bid.product_id} <FiExternalLink size={12} />
                    </Link>
                    <p className="text-sm text-gray-400">Amount: <span className="text-white font-semibold">${bid.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bid.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 
                    bid.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {bid.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                <FiActivity size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No active bids</h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">You haven't placed any bids yet. Explore live auctions to find something you love.</p>
              <Link to="/" className="btn-secondary !px-6 !py-2">Explore Auctions</Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
