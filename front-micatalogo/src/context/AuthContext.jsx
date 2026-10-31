import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        const response = await api.get('/user');
        setUser(response.data);
        return response.data;
    }, []);

    useEffect(() => {
        const onFocus = () => {
            if (localStorage.getItem('micatalogo_token')) refreshUser().catch(() => {});
        };
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [refreshUser]);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('micatalogo_token');
            if (token) {
                try {
                    const response = await api.get('/user');
                    setUser(response.data);
                } catch (error) {
                    if (error.response?.data?.code === 'support_session_ended') return;
                    console.error("Token inválido o expirado");
                    localStorage.removeItem('micatalogo_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (email, password) => {
        sessionStorage.removeItem('micatalogo_support');
        const response = await api.post('/login', { email, password });
        localStorage.setItem('micatalogo_token', response.data.token);
        setUser(response.data.user);
        return response.data.user;
    };

    const logout = async ({ remote = true } = {}) => {
        try {
            const support = sessionStorage.getItem('micatalogo_support');
            if (remote && support) await api.post('/support/stop', { session_id: support });
            sessionStorage.removeItem('micatalogo_support');
            if (remote) await api.post('/logout');
        } finally {
            sessionStorage.removeItem('micatalogo_support');
            localStorage.removeItem('micatalogo_token');
            setUser(null);
        }
    };

    const registerLogin = (user, token) => {
        sessionStorage.removeItem('micatalogo_support');
        localStorage.setItem('micatalogo_token', token);
        setUser(user);
    };

    const startSupport = async (tenantId) => {
        const { data } = await api.post(`/admin/platform/stores/${tenantId}/support`);
        sessionStorage.setItem('micatalogo_support', data.support_session.id);
        window.location.assign('/admin/dashboard');
    };

    const endSupport = async () => {
        const id = sessionStorage.getItem('micatalogo_support');
        if (id) await api.post('/support/stop', { session_id: id });
        sessionStorage.removeItem('micatalogo_support');
        window.location.assign('/admin/stores');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, registerLogin, refreshUser, startSupport, endSupport, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
