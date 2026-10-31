import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionExpired = searchParams.get('session') === 'expired';
    const passwordUpdated = searchParams.get('password') === 'updated';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            const message = err.response?.data?.message || 'Credenciales inválidas o error en el servidor';
            setError(message);
        }
    };

    return (
        <div className="auth-page min-h-screen flex text-white font-sans selection:bg-accent selection:text-white">
            {/* Left Panel */}
            <div className="auth-story hidden lg:flex lg:w-1/2 relative bg-[#040C08] items-center justify-center overflow-hidden">
                {/* Glow effect */}

                <div className="relative z-10 text-left px-12">
                    <h1 className="text-5xl font-extrabold mb-6">Tu negocio,
tu espacio.</h1>
                    <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                        Tus productos, pedidos y conversaciones en un mismo lugar. Un poco más de orden para el día a día.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#000000] p-8 sm:p-12 lg:p-24 relative">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="mb-10">
                        <Link to="/" className="wordmark">
                            <span className="brand-mark">m.</span>MiCatálogo.
                        </Link>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold mb-2">Qué bueno verte.</h2>
                        <p className="text-gray-400 text-sm">Ingresa tus credenciales para acceder a tu panel.</p>
                    </div>

                    {passwordUpdated && !error && <p role="status" className="text-sm text-accent">Contraseña actualizada. Entra con tu nueva contraseña.</p>}
                    {sessionExpired && !error && (
                        <div role="status" className="bg-amber-500/10 border border-amber-500/40 text-amber-300 p-3 rounded-lg text-sm">
                            Tu sesión expiró o fue cerrada. Inicia sesión nuevamente.
                        </div>
                    )}

                    {error && (
                        <div role="alert" className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label htmlFor="login-email" className="block text-sm font-medium text-gray-300">Correo electrónico</label>
                            <input 
                                id="login-email" autoComplete="email" type="email"
                                className="w-full bg-[#0a0a0a] text-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="login-password" className="block text-sm font-medium text-gray-300">Contraseña</label>
                            <div className="relative">
                                <input 
                                    id="login-password" autoComplete="current-password" type={showPassword ? "text" : "password"}
                                    className="w-full bg-[#0a0a0a] text-white border border-white/10 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-accent hover:bg-accentHover text-white font-bold py-3.5 rounded-full transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] mt-4"
                        >
                            Iniciar Sesión
                        </button>
                    </form>

                    <div className="text-center mt-8">
                        <p className="text-gray-500 text-sm">
                            ¿No tienes una tienda?{' '}
                            <Link to="/register" className="text-accent hover:text-accentHover font-semibold transition-colors">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
