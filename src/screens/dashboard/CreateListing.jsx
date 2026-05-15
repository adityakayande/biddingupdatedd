import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";
import api from "../../utils/api";

const CreateListing = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    base_price: "",
    duration_hours: "24",
    category: "Uncategorized",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const processFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPEG, PNG, WebP, GIF).");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadedUrl(""); // reset previous upload

    // Auto-upload immediately
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedUrl(res.data.url);
    } catch (err) {
      setError("Image upload failed. Please try again.");
      setImageFile(null);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadedUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!uploadedUrl) {
      setError("Please upload a product image before creating the listing.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/products/", {
        title: formData.title,
        description: formData.description,
        base_price: parseFloat(formData.base_price),
        image_url: uploadedUrl,
        duration_hours: parseFloat(formData.duration_hours),
        category: formData.category,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Listing</h1>
        <p className="text-gray-400">Add a new premium item to the auction block.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="glass-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Product Image <span className="text-red-500">*</span>
            </label>

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative w-full h-52 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : "border-white/20 bg-dark-900/50 hover:border-primary/60 hover:bg-primary/5"
                }`}
              >
                <div className="flex flex-col items-center gap-3 pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-dark-800 flex items-center justify-center">
                    <FiUploadCloud size={26} className={isDragging ? "text-primary" : "text-gray-500"} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-300">
                      {isDragging ? "Drop it here!" : "Drag & drop your image here"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">or <span className="text-primary">browse files</span> — JPEG, PNG, WebP, GIF</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-white/10 group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {/* overlay */}
                <div className="absolute inset-0 bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/20 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full hover:bg-white/30 transition-colors flex items-center gap-1"
                  >
                    <FiImage size={14} /> Change
                  </button>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="bg-red-500/30 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full hover:bg-red-500/50 transition-colors flex items-center gap-1"
                  >
                    <FiX size={14} /> Remove
                  </button>
                </div>
                {/* Upload status badge */}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                  uploading
                    ? "bg-yellow-500/20 text-yellow-300"
                    : "bg-green-500/20 text-green-400"
                }`}>
                  {uploading ? "Uploading…" : "✓ Uploaded"}
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Item Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="E.g., Vintage Rolex Daytona"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-field resize-none"
              placeholder="Describe your item in detail — condition, history, specifications…"
            />
          </div>

          {/* Price + Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Starting Bid ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="base_price"
                value={formData.base_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="input-field font-display font-bold"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Auction Duration (hours)
              </label>
              <select
                name="duration_hours"
                value={formData.duration_hours}
                onChange={handleChange}
                className="input-field"
              >
                <option value="1">1 hour</option>
                <option value="6">6 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours (1 day)</option>
                <option value="48">48 hours (2 days)</option>
                <option value="72">72 hours (3 days)</option>
                <option value="168">7 days</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Uncategorized">Uncategorized</option>
              <option value="Watches">Watches</option>
              <option value="Electronics">Electronics</option>
              <option value="Photography">Photography</option>
              <option value="Music">Music</option>
              <option value="Art">Art</option>
              <option value="Collectibles">Collectibles</option>
              <option value="Fashion">Fashion</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading || !uploadedUrl}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating…" : uploading ? "Uploading image…" : "Launch Auction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
