import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <div className="flex h-screen bg-bgDark">
            {/* Sidebar */}
            <aside className="w-64 bg-cardDark border-r border-borderDark flex flex-col">
                <div className="p-6 border-b border-borderDark">
                    <h2 className="text-2xl font-bold text-white">Micatálogo</h2>
                    <p className="text-sm text-gray-400 mt-1">Panel de Control</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin/dashboard" className="block text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded transition">
                        Dashboard
                    </Link>
                    <Link to="/admin/products" className="block text-gray-300 hover:text-white hover:bg-gray-800 p-3 rounded transition">
                        Productos
                    </Link>
                    <a href={`/tienda/${user?.tenant?.domain}`} target="_blank" rel="noreferrer" className="block text-primary hover:text-primaryHover p-3 rounded transition font-medium">
                        Ver Mi Tienda ↗
                    </a>
                </nav>

                <div className="p-4 border-t border-borderDark">
                    <div className="text-white mb-2 truncate font-semibold">{user?.name}</div>
                    <button 
                        onClick={handleLogout}
                        className="w-full text-left text-red-500 hover:text-red-400 p-2 rounded transition"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 text-white">
                <Outlet />
            </main>
        </div>
    );
}
