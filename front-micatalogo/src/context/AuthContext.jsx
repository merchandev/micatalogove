import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('micatalogo_token');
            if (token) {
                try {
                    const response = await api.get('/user');
                    setUser(response.data);
                } catch (error) {
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
        const response = await api.post('/login', { email, password });
        localStorage.setItem('micatalogo_token', response.data.token);
        setUser(response.data.user);
        return response.data.user;
    };

    const logout = async () => {
        await api.post('/logout');
        localStorage.removeItem('micatalogo_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
