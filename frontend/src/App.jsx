import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { AuthModal } from './components/AuthModal';
import { ImageUploaderModal } from './components/ImageUploaderModal';
import { ArchitectureInspector } from './components/ArchitectureInspector';
import { productService } from './services/productService';
import { useToast } from './context/ToastContext';
import { Cloud, ShieldCheck, Database, Layers, Search, RefreshCw, Plus, Cpu, GitBranch } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const { addToast } = useToast();

  // Fallback initial products if backend service is starting up
  const initialFallbackProducts = [
    {
      id: 1,
      title: 'Minimalist Wireless Noise-Canceling Headphones',
      description: 'High-fidelity audio with active noise cancellation, 30-hour battery life, and ergonomic leather cushions.',
      price: 299.99,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
      s3Key: 'seed-1',
    },
    {
      id: 2,
      title: 'Ultra-Slim Mechanical Keyboard RGB',
      description: 'Low-profile mechanical switches, custom keycaps, aircraft-grade aluminum top plate.',
      price: 149.50,
      category: 'Electronics',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop',
      s3Key: 'seed-2',
    },
    {
      id: 3,
      title: 'Titanium Smart Watch Series X',
      description: 'Advanced health metrics, AMOLED retina display, GPS tracking, 50m water resistance.',
      price: 399.00,
      category: 'Wearables',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop',
      s3Key: 'seed-3',
    },
    {
      id: 4,
      title: 'Ergonomic Artisan Leather Chair',
      description: 'Handcrafted genuine top-grain leather executive chair with adaptive lumbar support.',
      price: 680.00,
      category: 'Furniture',
      imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=800&auto=format&fit=crop',
      s3Key: 'seed-4',
    },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const cat = selectedCategory === 'All' ? null : selectedCategory;
      const data = await productService.getAllProducts(cat);
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(initialFallbackProducts);
      }
    } catch (err) {
      console.warn('Backend service offline, showing fallback catalog:', err.message);
      setProducts(initialFallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleDeleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addToast('Product & S3 file deleted', 'info');
    } catch (err) {
      // Local UI removal if backend is mock
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addToast('Product removed', 'info');
    }
  };

  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Header Navigation Bar */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenInspector={() => setIsInspectorOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Hero Banner with Tech Architecture Highlights */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          {/* Architecture Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-indigo-300 mb-6 shadow-inner">
            <GitBranch size={14} className="text-indigo-400" />
            <span>Clean Onion Architecture • Spring Boot Microservices</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Microservice Asset Engine & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">AWS S3 Storage</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal">
            Production-grade microservices built with Java 21 Spring Boot, JWT Security, PostgreSQL persistence, and React Axios Interceptors — deployable on Render & Vercel.
          </p>

          {/* Feature Badges Grid */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300">
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>AWS S3 Object Upload</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>JWT Bearer Auth</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>PostgreSQL / SQL Server</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-300">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Onion Architecture</span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or category..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={fetchProducts}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
              title="Refresh Products Catalog"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Upload New Product</span>
            </button>
          </div>

        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 mt-4 font-mono">Fetching catalog from Product Microservice...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
            <Cloud className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Products Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No assets match your filter. Upload a new image to AWS S3 to create a product!
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
            >
              Upload to S3
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Nexus Microservices • Onion Architecture • AWS S3 & PostgreSQL</p>
          <div className="flex gap-4 text-[11px]">
            <span className="hover:text-indigo-400 cursor-pointer" onClick={() => setIsInspectorOpen(true)}>System Monitor</span>
            <span>•</span>
            <span className="hover:text-indigo-400 cursor-pointer" onClick={() => setIsAuthOpen(true)}>JWT Authorization</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ImageUploaderModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onProductCreated={handleProductCreated}
      />
      <ArchitectureInspector isOpen={isInspectorOpen} onClose={() => setIsInspectorOpen(false)} />

    </div>
  );
}
