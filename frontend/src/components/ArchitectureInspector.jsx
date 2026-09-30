import React, { useState, useEffect } from 'react';
import { X, Server, Database, Cloud, ShieldCheck, Activity, ArrowRight, RefreshCw, CheckCircle2, AlertTriangle, Layers, FileCode } from 'lucide-react';
import { authService } from '../services/authService';
import { productService } from '../services/productService';

export const ArchitectureInspector = ({ isOpen, onClose }) => {
  const [authHealth, setAuthHealth] = useState(null);
  const [productHealth, setProductHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    const [authRes, prodRes] = await Promise.all([
      authService.checkAuthHealth(),
      productService.checkProductHealth(),
    ]);
    setAuthHealth(authRes);
    setProductHealth(prodRes);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden glass-card max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/30 border border-indigo-500/40 rounded-2xl text-indigo-400">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">System Architecture & Microservices Monitor</h3>
              <p className="text-xs text-slate-400 font-mono">
                Onion Architecture • Spring Boot Microservices • Render & Vercel Deployments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Ping Services</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Diagram Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Microservices Blueprint Diagram Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Frontend / Vercel Box */}
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Frontend UI</span>
                  <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded text-[10px]">Vercel</span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCode size={16} className="text-cyan-400" />
                  React / Next UI
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Axios Request/Response Interceptor attaching JWT Bearer Token to microservice requests.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Deploy: Vercel SPA</span>
                <span className="text-emerald-400 font-bold">READY</span>
              </div>
            </div>

            {/* Auth Microservice Box */}
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Microservice 1</span>
                  <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded text-[10px]">Render</span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-indigo-400" />
                  Auth Microservice
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Spring Boot 3 + JWT Token Provider + Spring Security 6 + Onion Layers (Domain, App, Infra, Web).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Port: :8081</span>
                {authHealth?.status === 'UP' ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={10} /> UP</span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center gap-1"><AlertTriangle size={10} /> LOCAL / STANDBY</span>
                )}
              </div>
            </div>

            {/* Product Microservice & AWS S3 Box */}
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">Microservice 2</span>
                  <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded text-[10px]">Render</span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cloud size={16} className="text-purple-400" />
                  Product & S3 Service
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  AWS S3 SDK v2 Storage Adapter + Product Catalog CRUD + PostgreSQL persistence.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Port: :8082</span>
                {productHealth?.status === 'UP' ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={10} /> UP</span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center gap-1"><AlertTriangle size={10} /> LOCAL / STANDBY</span>
                )}
              </div>
            </div>

          </div>

          {/* Architectural Specifications Summary */}
          <div className="p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers size={14} className="text-indigo-400" /> Onion Architecture Specifications
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="font-bold text-indigo-300 block mb-1">1. Domain Layer (Core)</span>
                <p className="text-slate-400 text-[11px]">
                  Entities (<code className="text-indigo-200">User</code>, <code className="text-indigo-200">Product</code>), Enums (<code className="text-indigo-200">Role</code>), and Ports (<code className="text-indigo-200">StoragePort</code>, <code className="text-indigo-200">UserRepositoryPort</code>).
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="font-bold text-indigo-300 block mb-1">2. Application Layer</span>
                <p className="text-slate-400 text-[11px]">
                  Use cases (<code className="text-indigo-200">AuthUseCase</code>, <code className="text-indigo-200">ProductUseCase</code>), DTOs, and Spring Dependency Injection services.
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="font-bold text-indigo-300 block mb-1">3. Infrastructure Layer</span>
                <p className="text-slate-400 text-[11px]">
                  PostgreSQL JPA Adapters, AWS S3 Storage Adapter, SLF4J / Logback logger, JJWT Provider.
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="font-bold text-indigo-300 block mb-1">4. Presentation Layer</span>
                <p className="text-slate-400 text-[11px]">
                  REST Controllers (<code className="text-indigo-200">AuthController</code>, <code className="text-indigo-200">ProductController</code>), Global Exception Handlers.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
