import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Bienvenido, {user?.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-cardDark p-6 rounded-xl border border-borderDark">
                    <h3 className="text-gray-400 mb-2">Tu Tienda</h3>
                    <p className="text-2xl font-bold text-primary">{user?.tenant?.name}</p>
                </div>
                <div className="bg-cardDark p-6 rounded-xl border border-borderDark">
                    <h3 className="text-gray-400 mb-2">Dominio</h3>
                    <p className="text-xl font-bold">/{user?.tenant?.domain}</p>
                </div>
            </div>
        </div>
    );
}
