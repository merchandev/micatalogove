import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Interceptor para inyectar el token en cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('micatalogo_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    const support = sessionStorage.getItem('micatalogo_support');
    if (support) config.headers['X-Support-Session'] = support;
    return config;
});

// An expired or revoked token ends the panel session instead of leaving a broken screen.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data?.code === 'support_session_ended') {
            sessionStorage.removeItem('micatalogo_support');
            window.location.assign('/admin/stores?assistance=ended');
            return Promise.reject(error);
        }
        const isLogin = error.config?.url?.endsWith('/login');
        if (error.response?.status === 401 && !isLogin && localStorage.getItem('micatalogo_token')) {
            localStorage.removeItem('micatalogo_token');
            sessionStorage.removeItem('micatalogo_support');
            const { pathname } = window.location;
            if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
                window.location.assign('/admin/login?session=expired');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
