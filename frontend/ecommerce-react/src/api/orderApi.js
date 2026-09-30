import API from './axios';

export const orderApi = {
  getAllOrders: async (email = null) => {
    const params = email ? { email } : {};
    const response = await API.get('/orders', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  },

  deleteOrder: async (id) => {
    await API.delete(`/orders/${id}`);
  },
};
