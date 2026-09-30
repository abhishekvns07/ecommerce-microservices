import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Tag } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col group">
      
      {/* Image Thumbnail */}
      <div className="relative w-full h-48 bg-slate-950 overflow-hidden">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop';
          }}
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-lg text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
          <Tag size={10} className="text-indigo-400" />
          {product.category || 'General'}
        </div>
      </div>

      {/* Body Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description || 'High performance microservice asset managed via Spring Boot Product Service.'}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">PRICE</span>
            <span className="text-lg font-extrabold text-white">
              ${parseFloat(product.price || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/products/${product.id}`}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-all"
              title="View Product Details"
            >
              <Eye size={16} />
            </Link>

            <button
              onClick={() => navigate('/create-order', { state: { product } })}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <ShoppingCart size={14} />
              <span>Order</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
