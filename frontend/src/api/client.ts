import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors and fallback to Supabase REST for public catalog
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Fallback: If GET /products fails on backend, fetch directly from Supabase REST
    if (error.config && error.config.method === 'get' && error.config.url?.startsWith('/products')) {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dylqlvwshrywdxzhdobe.supabase.co';
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHFsdndzaHJ5d2R4emhkb2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NTgwMjUsImV4cCI6MjEwODIzNDAyNX0.RFPXrFIJRXXyHxeqIklttjnnUD4dqrYq4HWr0JlvqhM';
        
        const fallbackRes = await axios.get(`${supabaseUrl}/rest/v1/products?select=*,category:categories(*),manufacturer:users(id,name,companyName,manufacturerProfile:manufacturer_profiles(*))`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`
          }
        });

        if (fallbackRes.data && Array.isArray(fallbackRes.data)) {
          return {
            data: {
              success: true,
              data: {
                products: fallbackRes.data,
                pagination: { total: fallbackRes.data.length, page: 1, limit: 50, pages: 1 }
              }
            }
          };
        }
      } catch (fallbackError) {
        console.warn('Supabase fallback also failed:', fallbackError);
      }
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
