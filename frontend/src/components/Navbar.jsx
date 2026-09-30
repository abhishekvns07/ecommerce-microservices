import React from 'react';
import { ShoppingBag, Upload, ShieldCheck, Cpu, LogIn, LogOut, User, Server } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAuth, onOpenUpload, onOpenInspector, selectedCategory, onSelectCategory }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const categories = ['All', 'Electronics', 'Wearables', 'Furniture'];

  return (
    <header className="navbar-container glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCategory('All')}>
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/30">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">NEXUS</span>
              <span className="badge-microservice">MICROSERVICES</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">AWS S3 • Onion Arch • Spring Boot</p>
          </div>
        </div>

        {/* Category Pill Filters */}
        <nav className="hidden md:flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Architecture Inspector Modal Trigger */}
          <button
            onClick={onOpenInspector}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-indigo-300 bg-indigo-950/40 border border-indigo-800/50 rounded-xl hover:bg-indigo-900/40 hover:border-indigo-600 transition-all duration-200"
            title="Inspect Microservice Architecture & Health"
          >
            <Server className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline">System Monitor</span>
          </button>

          {/* Upload Product / AWS S3 Image Trigger */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-indigo-600/20 transition-all duration-200 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image to S3</span>
          </button>

          {/* User JWT Auth Control */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-slate-200">{user?.username}</p>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck size={10} /> JWT Authenticated
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-all"
                title="Logout JWT Session"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800/80 border border-slate-700/60 rounded-xl hover:bg-slate-700 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-indigo-400" />
              <span>Login / JWT</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
