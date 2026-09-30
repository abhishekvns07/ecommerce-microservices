import api from '../api/axiosInstance';

export const productService = {
  getAllProducts: async (category = null) => {
    const params = category ? { category } : {};
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  // Creates a product with optional AWS S3 Image Upload (Multipart)
  createProductWithImage: async (productData, imageFile) => {
    const formData = new FormData();
    const productBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
    formData.append('product', productBlob);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await api.post('/api/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Direct AWS S3 Upload Endpoint
  uploadImageToS3: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    await api.delete(`/api/products/${id}`);
  },

  checkProductHealth: async () => {
    try {
      const res = await api.get('/api/products/health');
      return res.data;
    } catch (e) {
      return { service: 'product-service', status: 'DOWN', error: e.message };
    }
  }
};
