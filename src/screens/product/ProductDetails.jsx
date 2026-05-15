import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiMail, FiUser, FiShield, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const [productRes, userRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/auth/me`).catch(() => ({ data: null }))
      ]);
      setProduct(productRes.data);
      setBids(productRes.data.bids || []);
      if (userRes.data) {
        setCurrentUser(userRes.data);
      }
    } catch (err) {
      console.error("Failed to fetch product details", err);
      setError("Could not load product details. It may have been removed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');

    if (!token) {
      setBidError('You must be logged in to place a bid.');
      return;
    }

    try {
      await api.post(`/bids/`, {
        amount: parseFloat(bidAmount),
        product_id: parseInt(id)
      });
      setBidSuccess('Bid placed successfully!');
      setBidAmount('');
      await fetchProductDetails();
    } catch (err) {
      setBidError(err.response?.data?.detail || 'Failed to place bid.');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/products/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete listing.');
      setDeleteConfirm(false);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <h2 className="text-3xl text-white mb-4">Oops!</h2>
        <p className="text-gray-400 mb-8">{error || "Product not found."}</p>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  const highestBid = bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : 0;
  const currentPrice = Math.max(product.base_price, highestBid);
  const isAuctionEnded = new Date(product.end_time) < new Date();
  const isOwner = currentUser && currentUser.id === product.seller_id;

  const sellerName = product.seller?.username || product.seller?.email?.split('@')[0] || `Seller #${product.seller_id}`;
  const sellerEmail = product.seller?.email || '';

  return (
    <div className="animate-fade-in py-8 max-w-6xl mx-auto">

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={28} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Listing?</h3>
            <p className="text-gray-400 mb-6 text-sm">
              This will permanently remove <span className="text-white font-medium">"{product.title}"</span> and all associated bids. This cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(false)}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image */}
        <div className="relative">
          <div className="glass-card overflow-hidden sticky top-24">
            <img 
              src={product.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} 
              alt={product.title} 
              className="w-full h-auto aspect-square object-cover"
            />
            {isAuctionEnded && (
              <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm flex items-center justify-center">
                <div className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-500 font-bold rounded-full text-xl rotate-[-15deg] shadow-2xl">
                  AUCTION ENDED
                </div>
              </div>
            )}
          </div>

          {/* Seller Card — shown to non-owners */}
          {!isOwner && (
            <div className="glass-card mt-6 p-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Hosted by</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-dark-900 font-bold text-lg flex-shrink-0">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white text-base truncate">{sellerName}</p>
                  {sellerEmail && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                      <FiMail size={11} />
                      {sellerEmail}
                    </p>
                  )}
                </div>
                <div className="ml-auto flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                    <FiShield size={10} /> Verified
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                Lot #{product.id}
              </div>
              {/* Owner controls */}
              {isOwner && (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/edit-listing/${product.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-primary/50 transition-all text-xs font-medium"
                  >
                    <FiEdit2 size={12} /> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs font-medium"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">{product.title}</h1>
            <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
              {product.description || "No description provided."}
            </p>
          </div>

          <div className="glass-card p-8 mb-8 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-white">${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  <span className="text-sm text-gray-500">USD</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Ends</p>
                <p className={`font-medium ${isAuctionEnded ? 'text-red-400' : 'text-secondary'}`}>
                  {new Date(product.end_time).toLocaleString()}
                </p>
              </div>
            </div>

            {!isAuctionEnded ? (
              isOwner ? (
                <div className="w-full py-4 text-center border border-white/10 rounded-xl bg-dark-900/50 text-gray-400 font-medium">
                  This is your listing. You cannot bid on your own item.
                </div>
              ) : (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  {bidError && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{bidError}</p>}
                  {bidSuccess && <p className="text-green-400 text-sm bg-green-500/10 p-3 rounded-lg">{bidSuccess}</p>}
                  
                  <div className="flex gap-4">
                    <div className="relative flex-grow">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input 
                        type="number" 
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Min bid ${(currentPrice + 1).toLocaleString()}`}
                        min={currentPrice + 0.01}
                        step="0.01"
                        required
                        className="input-field !pl-8 font-display font-bold text-lg"
                      />
                    </div>
                    <button type="submit" className="btn-primary !px-8 whitespace-nowrap">
                      Place Bid
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div className="w-full py-4 text-center border border-white/10 rounded-xl bg-dark-900/50 text-gray-400 font-medium">
                Bidding has closed for this item
              </div>
            )}
          </div>

          {/* Bidding History */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Bid History <span className="text-gray-500 font-normal text-sm ml-2">({bids.length} bids)</span></h3>
            <div className="glass-card p-1">
              {bids.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No bids placed yet. Be the first!</div>
              ) : (
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {bids.sort((a, b) => b.amount - a.amount).map((bid, idx) => {
                    const bidderName = bid.buyer?.username || bid.buyer?.email?.split('@')[0] || `Bidder #${bid.buyer_id}`;
                    return (
                      <div key={bid.id} className={`flex justify-between items-center p-4 border-b border-white/5 ${idx === 0 ? 'bg-primary/5' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-primary text-dark-900' : 'bg-dark-800 text-gray-400'}`}>
                            {idx === 0 ? '🥇' : `${idx + 1}`}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white flex items-center gap-1.5">
                              <FiUser size={11} className="text-gray-500" />
                              {bidderName}
                              {isOwner && bid.buyer?.email && (
                                <span className="text-xs text-gray-500 font-normal">({bid.buyer.email})</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">{new Date(bid.timestamp || Date.now()).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="font-display font-bold text-white">
                          ${bid.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
