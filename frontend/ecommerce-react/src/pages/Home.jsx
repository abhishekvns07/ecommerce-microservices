import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { ProductCard } from '../components/ProductCard';
import { Loading } from '../components/Loading';
import { Server, Cpu, Database, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await productApi.getAllProducts();
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.warn('Backend service pending startup, showing default catalog');
        setFeaturedProducts([
          {
            id: 1,
            title: 'Minimalist Wireless Noise-Canceling Headphones',
            description: 'High-fidelity audio with active noise cancellation, 30-hour battery life.',
            price: 299.99,
            category: 'Electronics',
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
          },
          {
            id: 2,
            title: 'Ultra-Slim Mechanical Keyboard RGB',
            description: 'Low-profile mechanical switches, custom keycaps, aluminum top plate.',
            price: 149.50,
            category: 'Electronics',
            imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop',
          },
          {
            id: 3,
            title: 'Titanium Smart Watch Series X',
            description: 'Advanced health metrics, AMOLED display, GPS tracking, 50m water resistance.',
            price: 399.00,
            category: 'Wearables',
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop',
          },
          {
            id: 4,
            title: 'Ergonomic Artisan Leather Chair',
            description: 'Handcrafted genuine top-grain leather chair with adaptive lumbar support.',
            price: 680.00,
            category: 'Furniture',
            imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=800&auto=format&fit=crop',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 bg-slate-900/50 border-b border-slate-800 rounded-3xl text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-400 mb-6">
            <Server size={14} />
            <span>Eureka Discovery Server Registered Services</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            E-Commerce <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Microservices Platform</span>
          </h1>

          <p className="mt-4 text-sm text-slate-400 max-w-2xl mx-auto">
            Decoupled architecture orchestrated via Spring Cloud Gateway (:8080) and Netflix Eureka Discovery (:8761) with independent MySQL databases.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <ShoppingBag size={16} />
              <span>Browse Catalog</span>
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-xl transition-all"
            >
              <span>View Orders</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture Diagram Visualization */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Cpu size={16} className="text-indigo-400" />
          Live Microservices Topology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          
          {/* Frontend Box */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">FRONTEND</span>
            <h4 className="text-sm font-bold text-white">React UI (:5173)</h4>
            <p className="text-[11px] text-slate-400 mt-1">Vite + React Router + Axios</p>
          </div>

          {/* Gateway Box */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-mono text-indigo-400 font-bold block mb-1">API GATEWAY</span>
            <h4 className="text-sm font-bold text-white">Gateway (:8080)</h4>
            <p className="text-[11px] text-slate-400 mt-1">Spring Cloud Gateway</p>
          </div>

          {/* Product Service Box */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">SERVICE 1</span>
            <h4 className="text-sm font-bold text-white">Product Service (:8081)</h4>
            <p className="text-[11px] text-slate-400 mt-1">Product DB (MySQL)</p>
          </div>

          {/* Order Service Box */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-mono text-purple-400 font-bold block mb-1">SERVICE 2</span>
            <h4 className="text-sm font-bold text-white">Order Service (:8082)</h4>
            <p className="text-[11px] text-slate-400 mt-1">Order DB (MySQL)</p>
          </div>

        </div>
      </section>

      {/* Featured Products Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Featured Catalog Products</h2>
          <Link to="/products" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <Loading text="Loading products from Product Service (:8081)..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
