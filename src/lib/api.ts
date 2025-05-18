// src/lib/api.ts
import axios, { AxiosError } from 'axios';

//const BASE_URL = 'http://localhost:3000/api';
const BASE_URL = 'https://melbobackend.onrender.com/api/'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const errorMessage = error?.response?.data?.message || error?.message || 'Error en el servidor';
    console.error('API Error:', { message: errorMessage });
    throw error;
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getProducts: async (ubicacion?: string) => {
    const params = ubicacion ? { ubicacion } : {};
    const response = await api.get('/products', { params });
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  findByBarcode: async (barcode: string) => {
    const response = await api.get(`/products/barcode/${barcode}`);
    return response.data;
  },

  updateStock: async (productId: string, quantity: number, saleType: 'unit' | 'blister' | 'box') => {
    console.log(quantity)
    const response = await api.post('/products/update-stock', {
      productId,
      quantity,
      saleType
    });
    return response.data;
  }
};

// Ubicaciones API
export const ubicacionesAPI = {
  getUbicaciones: async () => {
    const response = await api.get('/ubicaciones');
    return response.data;
  },

  createUbicacion: async (ubicacionData: any) => {
    const response = await api.post('/ubicaciones', ubicacionData);
    return response.data;
  },

  updateUbicacion: async (id: string, ubicacionData: any) => {
    const response = await api.put(`/ubicaciones/${id}`, ubicacionData);
    return response.data;
  },

  deleteUbicacion: async (id: string) => {
    const response = await api.delete(`/ubicaciones/${id}`);
    return response.data;
  },

  getUbicacionById: async (id: string) => {
    const response = await api.get(`/ubicaciones/${id}`);
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  getCurrentReport: async (ubicacion?: string) => {
    console.log(ubicacion)
    const params = ubicacion ? { ubicacion } : {};
    const response = await api.get('/reports/current', { params });
    return response.data;
  },

  getReportHistory: async (ubicacion?: string) => {
    const params = ubicacion ? { ubicacion } : {};
    const response = await api.get('/reports/history', { params });
    return response.data;
  },

  addSaleToReport: async (sale: any) => {
    const response = await api.post('/reports/add-sale', sale);
    return response.data;
  },

  closeCurrentReport: async () => {
    const response = await api.post('/reports/close');
    return response.data;
  },

  generatePDF: async (reportId: string | null, startDate?: string, endDate?: string) => {
    const response = await api.post('/reports/generate-pdf', 
      { reportId, startDate, endDate }, 
      { responseType: 'blob' }
    );
    return response.data;
  },

  generateDetailedPDF: async (report: any) => {
    const response = await api.post('/reports/generate-detailed-pdf', { report }, {
      responseType: 'blob'
    });
    return response.data;
  },

  getReportByDate: async (date: string) => {
    const response = await api.get(`/reports/by-date/${date}`);
    return response.data;
  },

  generateExcel: async (reportId: string | null, startDate?: string, endDate?: string) => {
    let url = '/reports/generate-excel';
    const params = new URLSearchParams();
    
    if (reportId) {
      url += `/${reportId}`;
    } else if (startDate && endDate) {
      params.append('startDate', startDate);
      params.append('endDate', endDate);
    }
    
    const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;
    const response = await api.get(finalUrl, {
      responseType: 'blob'
    });
    return response;
  },

  getReportByRange: async (startDate: string, endDate: string) => {
    const response = await api.get(`/reports/by-range?startDate=${startDate}&endDate=${endDate}`);
    console.log(response)
    return response.data;
  }
};

