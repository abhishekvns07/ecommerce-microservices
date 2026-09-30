import React from 'react';
import { ShoppingCart, Trash2, Cloud, HardDrive, Tag } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ProductCard = ({ product, onDelete }) => {
  const { addToast } = useToast();

  const isS3Url = product.imageUrl?.includes('amazonaws.com') || product.s3Key?.startsWith('seed') || product.s3Key?.startsWith('products/');

  const handleBuy = () => {
    addToast(`Added "${product.title}" to cart!`, 'success');
  };

  return (
    <div className="group relative bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col glass-card">
      
      {/* Image Thumbnail with S3 Badge */}
      <div className="relative w-full h-48 bg-slate-950 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop';
          }}
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-lg text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
          <Tag size={10} className="text-indigo-400" />
          {product.category || 'General'}
        </div>

        {/* S3 Storage Type Indicator Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-md">
          {isS3Url ? (
            <>
              <Cloud size={11} className="text-cyan-400" />
              <span className="text-cyan-300">AWS S3</span>
            </>
          ) : (
            <>
              <HardDrive size={11} className="text-emerald-400" />
              <span className="text-emerald-300">Local S3 Mock</span>
            </>
          )}
        </div>
      </div>

      {/* Body Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {product.title}
          </h4>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description || 'High quality microservice asset managed via clean Onion Architecture backend.'}
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">PRICE</span>
            <span className="text-lg font-extrabold text-white">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={() => onDelete(product.id)}
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-all"
                title="Delete Product"
              >
                <Trash2 size={16} />
              </button>
            )}

            <button
              onClick={handleBuy}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <ShoppingCart size={14} />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
