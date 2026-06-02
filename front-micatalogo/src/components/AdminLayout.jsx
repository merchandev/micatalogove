import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

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
                    <Link to="/admin/dashboard" className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/admin/dashboard') ? 'bg-accent/10 text-accent font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Panel de Control
                    </Link>
                    <Link to="/admin/products" className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/admin/products') ? 'bg-accent/10 text-accent font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <Package className="w-5 h-5 mr-3" />
                        Productos
                    </Link>
                    <Link to="/admin/blog" className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/admin/blog') ? 'bg-accent/10 text-accent font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <FileText className="w-5 h-5 mr-3" />
                        Blog / Noticias
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
