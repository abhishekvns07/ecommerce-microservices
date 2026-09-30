import React, { useState, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, CheckCircle, Server, Database, Cloud, Tag, DollarSign, Layers } from 'lucide-react';
import { productService } from '../services/productService';
import { useToast } from '../context/ToastContext';

export const ImageUploaderModal = ({ isOpen, onClose, onProductCreated }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('15');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price) {
      addToast('Title and Price are required fields', 'error');
      return;
    }

    setUploading(true);

    try {
      const productPayload = {
        title,
        description,
        price: parseFloat(price),
        category,
        stock: parseInt(stock, 10),
      };

      const result = await productService.createProductWithImage(productPayload, selectedFile);
      addToast(`Product created & image uploaded to S3 successfully!`, 'success');
      onProductCreated(result);
      onClose();
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle('');
      setPrice('');
      setDescription('');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Image upload to S3 failed';
      addToast(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden glass-card">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AWS S3 Image Upload & Product Creator
              </h3>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Storage: Amazon S3 (us-east-1) / Microservice Storage Adapter
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* File Drag and Drop Zone */}
          <div className="flex flex-col">
            <label className="block text-xs font-medium text-slate-300 mb-2">Image File (S3 Object Target)</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px] ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-950/40 scale-[1.01]'
                  : previewUrl
                  ? 'border-emerald-500/50 bg-slate-950/80'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/80'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative w-full h-full flex flex-col items-center">
                  <img src={previewUrl} alt="Preview" className="max-h-40 object-contain rounded-xl shadow-md mb-2" />
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={12} /> {selectedFile?.name}
                  </span>
                  <span className="text-[10px] text-slate-500">{(selectedFile?.size / 1024).toFixed(1)} KB • Click to change</span>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-full mb-3 text-indigo-400">
                    <UploadCloud size={28} />
                  </div>
                  <p className="text-xs font-semibold text-slate-200">Drag & Drop Image Here</p>
                  <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
                  <span className="mt-3 px-3 py-1 bg-slate-800 text-indigo-300 text-[10px] font-medium rounded-lg">
                    Select File
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Metadata Fields */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Product Title</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Wireless Noise-Canceling Headphones"
                  className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="199.99"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product overview and feature details..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="md:col-span-2 pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <Database size={14} className="text-indigo-400" />
              <span>Persists metadata in PostgreSQL</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-xl shadow-lg shadow-cyan-600/20 hover:from-cyan-500 hover:to-indigo-500 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-3.5 h-3.5"></span>
                    <span>Uploading to S3...</span>
                  </>
                ) : (
                  <>
                    <Cloud size={15} />
                    <span>Upload & Save Product</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
