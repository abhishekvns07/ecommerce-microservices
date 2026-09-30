import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { Loading } from '../components/Loading';
import { ArrowLeft, ShoppingCart, Tag, ShieldCheck, Database, CheckCircle } from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProductById(id);
        setProduct(data);
      } catch (err) {
        // Fallback mock detail if backend is offline
        setProduct({
          id: id,
          title: 'Minimalist Wireless Noise-Canceling Headphones',
          description: 'High-fidelity audio with active noise cancellation, 30-hour battery life, and ergonomic leather ear cushions. Engineered for immersive sound experience.',
          price: 299.99,
          category: 'Electronics',
          stock: 25,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Loading text="Fetching product detail specifications..." />;
  if (!product) return <div className="py-20 text-center text-white">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-all"
      >
        <ArrowLeft size={16} />
        <span>Back to Products</span>
      </Link>

      {/* Main Detail Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        
        {/* Product Image */}
        <div className="relative w-full h-80 bg-slate-950 rounded-2xl overflow-hidden">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop'}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Tag size={12} className="text-indigo-400" />
            {product.category || 'General'}
          </div>
        </div>

        {/* Details Column */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white leading-tight">
              {product.title}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-3xl font-black text-white">
                ${parseFloat(product.price || 0).toFixed(2)}
              </span>
              <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono rounded-lg flex items-center gap-1">
                <CheckCircle size={10} /> In Stock ({product.stock || 15} available)
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Microservice Metadata */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Service ID:</span>
              <span className="text-indigo-300 font-bold">PRODUCT-SERVICE (:8081)</span>
            </div>
            <div className="flex justify-between">
              <span>Database Engine:</span>
              <span className="text-emerald-300 font-bold">MySQL Product DB</span>
            </div>
            <div className="flex justify-between">
              <span>Gateway Router:</span>
              <span className="text-cyan-300 font-bold">http://localhost:8080/api/products/{product.id}</span>
            </div>
          </div>

          {/* Order Action Button */}
          <button
            onClick={() => navigate('/create-order', { state: { product } })}
            className="w-full py-3.5 px-6 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <ShoppingCart size={16} />
            <span>Proceed to Create Order</span>
          </button>
        </div>

      </div>

    </div>
  );
};
