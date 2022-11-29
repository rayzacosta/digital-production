import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  const userObj = user ? JSON.parse(user) : null;

  if (userObj?.token) {
    (config.headers as any)['Authorization'] = `Bearer ${userObj.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    throw error;
  }
);

export { api };
