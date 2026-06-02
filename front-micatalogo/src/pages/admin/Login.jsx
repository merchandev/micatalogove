import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Credenciales inválidas o error en el servidor');
        }
    };

    return (
        <div className="min-h-screen flex text-white font-sans selection:bg-accent selection:text-white">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#040C08] items-center justify-center overflow-hidden">
                {/* Glow effect */}
                <div className="absolute w-[800px] h-[800px] bg-accent/10 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="relative z-10 text-center px-12">
                    <h1 className="text-5xl font-extrabold mb-6">Domina tus ventas</h1>
                    <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                        El estándar de la élite comercial. Empieza a vender sin comisiones desde tu propia plataforma conectada a WhatsApp.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#000000] p-8 sm:p-12 lg:p-24 relative">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="mb-10">
                        <Link to="/" className="text-2xl font-bold tracking-tight text-white hover:text-accent transition-colors">
                            Mi<span className="text-accent">Catálogo</span>
                        </Link>
                    </div>

                    <div>
                        <h2 className="text-3xl font-extrabold mb-2">Bienvenido de vuelta</h2>
                        <p className="text-gray-400 text-sm">Ingresa tus credenciales para acceder a tu panel.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-300">Correo Electrónico</label>
                            <input 
                                type="email" 
                                className="w-full bg-[#0a0a0a] text-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-300">Contraseña</label>
                            <input 
                                type="password" 
                                className="w-full bg-[#0a0a0a] text-white border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
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
