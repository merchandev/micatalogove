import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        <div className="min-h-screen bg-bgDark flex items-center justify-center px-4">
            <div className="bg-cardDark p-8 rounded-2xl shadow-2xl w-full max-w-md border border-borderDark">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Acceso Vendedores</h1>
                
                {error && (
                    <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="w-full bg-gray-800 text-white border border-borderDark rounded p-3 focus:outline-none focus:border-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Contraseña</label>
                        <input 
                            type="password" 
                            className="w-full bg-gray-800 text-white border border-borderDark rounded p-3 focus:outline-none focus:border-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primaryHover text-black font-bold py-3 rounded transition shadow-lg mt-4"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
}
