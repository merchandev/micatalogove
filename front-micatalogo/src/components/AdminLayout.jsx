import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    BarChart3,
    Database,
    FileText,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Package,
    ShoppingCart,
    Store,
    Users,
    CreditCard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SubscriptionBanner from './SubscriptionBanner';
import EmailVerificationBanner from './EmailVerificationBanner';
import { canAccessDatabase, canManageBlog, canManageUsers, isClient, isSuperAdmin, ROLE_LABELS } from '../lib/permissions';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    const links = [
        { to: '/admin/dashboard', label: 'Panel', icon: LayoutDashboard, show: true },
        { to: '/admin/store', label: 'Tienda', icon: Store, show: isClient(user) },
        { to: '/admin/products', label: 'Inventario', icon: Package, show: true },
        { to: '/admin/conversations', label: 'Conversaciones', icon: MessageSquare, show: true },
        { to: '/admin/carts', label: 'Carritos', icon: ShoppingCart, show: true },
        { to: '/admin/sales', label: 'Ventas', icon: BarChart3, show: true },
        { to: '/admin/subscription', label: isSuperAdmin(user) ? 'Suscripciones' : 'Suscripción', icon: CreditCard, show: isClient(user) || isSuperAdmin(user) },
        { to: '/admin/users', label: 'Usuarios', icon: Users, show: canManageUsers(user) },
        { to: '/admin/blog', label: 'Blog', icon: FileText, show: canManageBlog(user) },
        { to: '/admin/database', label: 'Base de datos', icon: Database, show: canAccessDatabase(user) },
    ].filter((item) => item.show);

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <div className="workspace-shell flex min-h-screen bg-bgDark">
            <aside className="w-64 bg-[#111116] border-r border-borderDark flex flex-col">
                <div className="p-6 border-b border-borderDark">
                    <Link to="/admin/dashboard" className="workspace-brand"><span className="brand-mark">m.</span>MiCatálogo.</Link>
                    <p className="text-sm text-gray-400 mt-1">{ROLE_LABELS[user?.role] || 'Panel'}</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {links.map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                                isActive(to)
                                    ? 'bg-accent/10 text-accent font-semibold'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {label}
                        </Link>
                    ))}

                    {user?.tenant?.domain && (
                        <a
                            href={`/${user.tenant.domain}`}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-primary hover:text-primaryHover p-3 rounded transition font-medium"
                        >
                            Ver mi tienda
                        </a>
                    )}
                </nav>

                <div className="p-4 border-t border-borderDark">
                    <div className="text-white truncate font-semibold">{user?.name}</div>
                    <div className="text-xs text-gray-500 truncate mb-3">{user?.email}</div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 text-left text-red-400 hover:text-red-300 p-2 rounded transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesion
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-8 text-white">
                {isClient(user) && !user.email_verified_at && <EmailVerificationBanner />}
                {isClient(user) && <SubscriptionBanner />}
                <Outlet />
            </main>
        </div>
    );
}
