import API from './axios';

export const productApi = {
  getAllProducts: async (category = null) => {
    const params = category && category !== 'All' ? { category } : {};
    const response = await API.get('/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData, imageFile = null) => {
    if (imageFile) {
      const formData = new FormData();
      const blob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
      formData.append('product', blob);
      formData.append('image', imageFile);
      const response = await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } else {
      const response = await API.post('/products', productData);
      return response.data;
    }
  },

  deleteProduct: async (id) => {
    await API.delete(`/products/${id}`);
  },
};
