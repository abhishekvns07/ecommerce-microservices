import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Package, ShoppingCart, PlusCircle, Server } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span>NEXUS<span className="text-indigo-400">STORE</span></span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded-md">
            API Gateway :8080
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              isActive('/') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Home
          </Link>

          <Link
            to="/products"
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              isActive('/products') || location.pathname.startsWith('/products/')
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package size={14} />
            <span>Products</span>
          </Link>

          <Link
            to="/orders"
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              isActive('/orders') ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingCart size={14} />
            <span>Orders</span>
          </Link>

          <Link
            to="/create-order"
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              isActive('/create-order')
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/80'
            }`}
          >
            <PlusCircle size={14} />
            <span>New Order</span>
          </Link>

          <a
            href="http://localhost:8761"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-800/60 rounded-xl hover:bg-cyan-900/50 transition-all ml-2"
            title="Open Eureka Dashboard (:8761)"
          >
            <Server size={12} className="text-cyan-400" />
            <span>Eureka :8761</span>
          </a>
        </div>

      </div>
    </nav>
  );
};
