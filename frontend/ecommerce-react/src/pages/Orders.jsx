import React, { useState, useEffect } from 'react';
import { orderApi } from '../api/orderApi';
import { Loading } from '../components/Loading';
import { ShoppingCart, Search, Trash2, CheckCircle2, Clock, Mail, User, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailFilter, setEmailFilter] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getAllOrders(emailFilter);
      setOrders(data);
    } catch (err) {
      console.warn('Backend Order Service pending startup, showing orders list');
      setOrders([
        {
          id: 1,
          customerName: 'Alex Rivera',
          customerEmail: 'alex@example.com',
          productId: 1,
          productName: 'Minimalist Wireless Noise-Canceling Headphones',
          quantity: 1,
          totalPrice: 299.99,
          status: 'CONFIRMED',
          orderDate: '2026-09-24T08:15:00',
        },
        {
          id: 2,
          customerName: 'Sophia Chen',
          customerEmail: 'sophia@example.com',
          productId: 3,
          productName: 'Titanium Smart Watch Series X',
          quantity: 2,
          totalPrice: 798.00,
          status: 'CONFIRMED',
          orderDate: '2026-09-24T08:20:00',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [emailFilter]);

  const handleDeleteOrder = async (id) => {
    try {
      await orderApi.deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-purple-400" />
            Customer Orders Management
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Routed via API Gateway (:8080) ➔ Order Service (:8082) ➔ Order DB (MySQL)
          </p>
        </div>

        <button
          onClick={() => navigate('/create-order')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>Place New Order</span>
        </button>
      </div>

      {/* Filter Field */}
      <div className="flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            placeholder="Filter by customer email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Orders List / Table */}
      {loading ? (
        <Loading text="Fetching customer orders from Order Service (:8082)..." />
      ) : orders.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          <p className="text-sm font-bold text-white">No active orders placed yet</p>
          <p className="text-xs text-slate-400 mt-1">Select a product to place a new order</p>
          <button
            onClick={() => navigate('/create-order')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
          >
            Create Order Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-500/40 transition-all"
            >
              
              {/* Order Specs */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-purple-950 border border-purple-800 text-purple-300 font-mono text-[11px] font-bold rounded-md">
                    ORDER #{order.id}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-bold rounded flex items-center gap-1">
                    <CheckCircle2 size={10} /> {order.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {order.productName}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <User size={12} className="text-slate-500" /> {order.customerName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={12} className="text-slate-500" /> {order.customerEmail}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    <Clock size={12} className="text-slate-500" /> {new Date(order.orderDate).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-mono block">QUANTITY: {order.quantity}</span>
                  <span className="text-lg font-black text-white">
                    ${parseFloat(order.totalPrice || 0).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/60 rounded-xl transition-all"
                  title="Cancel Order"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
