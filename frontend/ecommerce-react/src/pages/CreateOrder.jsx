import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { productApi } from '../api/productApi';
import { PlusCircle, ShoppingCart, User, Mail, DollarSign, CheckCircle, Package } from 'lucide-react';

export const CreateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const passedProduct = location.state?.product || null;

  const [products, setProducts] = useState(passedProduct ? [passedProduct] : []);
  const [selectedProductId, setSelectedProductId] = useState(passedProduct?.id || '');
  const [selectedProduct, setSelectedProduct] = useState(passedProduct);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const list = await productApi.getAllProducts();
        if (list && list.length > 0) {
          setProducts(list);
          if (!selectedProductId) {
            setSelectedProductId(list[0].id);
            setSelectedProduct(list[0]);
          }
        }
      } catch (err) {
        if (!passedProduct) {
          const fallbackList = [
            { id: 1, title: 'Minimalist Wireless Headphones', price: 299.99 },
            { id: 2, title: 'Ultra-Slim Mechanical Keyboard', price: 149.50 },
            { id: 3, title: 'Titanium Smart Watch Series X', price: 399.00 },
          ];
          setProducts(fallbackList);
          setSelectedProductId(fallbackList[0].id);
          setSelectedProduct(fallbackList[0]);
        }
      }
    };
    fetchCatalog();
  }, []);

  const handleProductSelect = (idStr) => {
    const id = parseInt(idStr, 10);
    setSelectedProductId(id);
    const prod = products.find((p) => p.id === id);
    setSelectedProduct(prod);
  };

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    return (parseFloat(selectedProduct.price || 0) * quantity).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const orderPayload = {
        customerName,
        customerEmail,
        productId: selectedProduct.id,
        productName: selectedProduct.title,
        quantity: parseInt(quantity, 10),
        unitPrice: parseFloat(selectedProduct.price),
      };

      await orderApi.createOrder(orderPayload);
      setSuccessMsg(`Order placed successfully for ${selectedProduct.title}!`);
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to place order';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 text-center">
        <h1 className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
          <PlusCircle className="w-6 h-6 text-emerald-400" />
          Create New Customer Order
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Submits payload to API Gateway (:8080) ➔ Order Service (:8082)
        </p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
        
        {successMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Customer Name */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Customer Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Customer Email */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Customer Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Select Product */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Select Catalog Product</label>
          <div className="relative">
            <Package className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <select
              value={selectedProductId}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (${parseFloat(p.price || 0).toFixed(2)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Quantity</label>
          <input
            type="number"
            min="1"
            max="50"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Calculated Total Price */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">TOTAL ESTIMATE</span>
            <span className="text-xl font-extrabold text-emerald-400">
              ${calculateTotal()}
            </span>
          </div>

          <span className="text-[10px] font-mono text-slate-400">
            {quantity} x ${parseFloat(selectedProduct?.price || 0).toFixed(2)}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>Confirm & Submit Order</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
};
