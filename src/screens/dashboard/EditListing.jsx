import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";
import api from "../../utils/api";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    base_price: "",
    category: "Uncategorized",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data;
        setFormData({
          title: p.title || "",
          description: p.description || "",
          base_price: p.base_price || "",
          category: p.category || "Uncategorized",
        });
        setImagePreview(p.image_url || null);
        setUploadedUrl(p.image_url || "");
      } catch (err) {
        setError("Failed to load listing. It may have been removed.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const processFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    setUploadedUrl("");
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

  const clearImage = () => {
    setImagePreview(null);
    setUploadedUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!uploadedUrl) {
      setError("Please upload a product image before saving.");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/products/${id}`, {
        title: formData.title,
        description: formData.description,
        base_price: parseFloat(formData.base_price),
        image_url: uploadedUrl,
        category: formData.category,
      });
      setSuccess("Listing updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update listing.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Listing</h1>
        <p className="text-gray-400">Update your auction details below.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm">
          {success}
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
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
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
                  <p className="text-sm font-medium text-gray-300">Drag & drop or <span className="text-primary">browse files</span></p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-white/10 group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                  uploading ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-400"
                }`}>
                  {uploading ? "Uploading…" : "✓ Ready"}
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
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
              placeholder="Describe your item in detail…"
            />
          </div>

          {/* Price */}
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

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="input-field">
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
            <button type="button" onClick={() => navigate("/dashboard")} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading || !uploadedUrl}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving…" : uploading ? "Uploading image…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
