import React, { useState, useEffect } from 'react';
import { productApi } from '../api/productApi';
import { ProductCard } from '../components/ProductCard';
import { Loading } from '../components/Loading';
import { Search, Package, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Electronics', 'Wearables', 'Furniture'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAllProducts(selectedCategory === 'All' ? null : selectedCategory);
      setProducts(data);
    } catch (err) {
      console.warn('Backend service offline, showing catalog');
      setProducts([
        {
          id: 1,
          title: 'Minimalist Wireless Noise-Canceling Headphones',
          description: 'High-fidelity audio with active noise cancellation.',
          price: 299.99,
          category: 'Electronics',
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
        },
        {
          id: 2,
          title: 'Ultra-Slim Mechanical Keyboard RGB',
          description: 'Low-profile mechanical switches, custom keycaps.',
          price: 149.50,
          category: 'Electronics',
          imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop',
        },
        {
          id: 3,
          title: 'Titanium Smart Watch Series X',
          description: 'Advanced health metrics, AMOLED display.',
          price: 399.00,
          category: 'Wearables',
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop',
        },
        {
          id: 4,
          title: 'Ergonomic Artisan Leather Chair',
          description: 'Handcrafted genuine top-grain leather executive chair.',
          price: 680.00,
          category: 'Furniture',
          imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=800&auto=format&fit=crop',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-400" />
            Product Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Routed via API Gateway (:8080) ➔ Product Service (:8081)
          </p>
        </div>

        <button
          onClick={() => navigate('/create-order')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Place New Order</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

      </div>

      {/* Products Grid */}
      {loading ? (
        <Loading text="Fetching product inventory from Product Service..." />
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <p className="text-sm font-bold text-white">No products found matching your search</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting category filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
