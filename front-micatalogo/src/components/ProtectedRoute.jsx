import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-bgDark flex items-center justify-center text-white">Cargando sesión...</div>;
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
