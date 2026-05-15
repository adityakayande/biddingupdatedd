import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

import { FiUpload, FiDollarSign, FiAward, FiWatch, FiMonitor, FiCamera, FiMusic } from 'react-icons/fi';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/");
        setProducts(response.data.filter(p => p.is_active));
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: "Watches", icon: <FiWatch size={24} />, count: "124+" },
    { name: "Electronics", icon: <FiMonitor size={24} />, count: "89+" },
    { name: "Photography", icon: <FiCamera size={24} />, count: "45+" },
    { name: "Music", icon: <FiMusic size={24} />, count: "67+" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-sm font-medium text-gray-300">The Next Generation Bidding Platform</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl mb-6 leading-tight max-w-4xl">
          Discover, Collect, and Sell <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Extraordinary Items
          </span>
        </h1>
        
        <p className="text-lg text-gray-400 mb-10 max-w-2xl">
          Join the most exclusive bidding community. List your premium items and bid on rare finds with our state-of-the-art live auction system.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/dashboard" className="btn-primary">Explore Auctions</Link>
          <Link to="/create-listing" className="btn-secondary">List an Item</Link>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 mb-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Explore by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="glass-card p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4 text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                {cat.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-500 font-medium">{cat.count} Items</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-16 mb-12 relative overflow-hidden rounded-3xl glass-card border-x-0 sm:border-x">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How BidSync Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">A seamless peer-to-peer marketplace designed for collectors and enthusiasts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          <div className="flex flex-col items-center text-center relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-dark-800 to-dark-700 border border-white/10 flex items-center justify-center mb-6 shadow-xl relative z-10">
              <FiUpload size={28} className="text-primary" />
            </div>
            <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/50 to-transparent border-t border-dashed border-primary/30 -z-0"></div>
            <h3 className="text-xl font-bold text-white mb-3">1. List Your Item</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Upload high-quality images and set your base price. Your item instantly goes live on our global network.</p>
          </div>

          <div className="flex flex-col items-center text-center relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-dark-800 to-dark-700 border border-white/10 flex items-center justify-center mb-6 shadow-xl relative z-10">
              <FiDollarSign size={28} className="text-secondary" />
            </div>
            <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-secondary/50 to-transparent border-t border-dashed border-secondary/30 -z-0"></div>
            <h3 className="text-xl font-bold text-white mb-3">2. Place Bids</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Discover extraordinary items from other users and place competitive bids before the timer runs out.</p>
          </div>

          <div className="flex flex-col items-center text-center relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-dark-800 to-dark-700 border border-white/10 flex items-center justify-center mb-6 shadow-xl relative z-10">
              <FiAward size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">3. Win & Collect</h3>
            <p className="text-gray-400 text-sm leading-relaxed">When the auction ends, the highest bidder wins the item. Sellers are instantly notified of the successful sale.</p>
          </div>
        </div>
      </div>

      {/* Live Auctions Section */}
      <div className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl">Live Auctions</h2>
          <div className="h-[1px] flex-grow bg-white/10 mx-6"></div>
          <span className="text-primary font-medium">{products.length} Active</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <h3 className="text-xl text-gray-400">No active auctions right now.</h3>
            <p className="text-gray-500 mt-2">Be the first to list an item!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group glass-card overflow-hidden hover:-translate-y-2 transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute top-4 right-4 glass-card px-3 py-1 !rounded-full !bg-dark-900/80 backdrop-blur-md">
                    <span className="text-xs font-semibold text-primary">Live</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 truncate">{product.title}</h3>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Current Bid</p>
                      <p className="font-display font-bold text-xl text-white">
                        ${product.base_price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Ends</p>
                      <p className="text-sm font-medium text-secondary">
                        {new Date(product.end_time).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
