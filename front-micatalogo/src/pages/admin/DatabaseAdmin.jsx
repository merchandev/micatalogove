import { useEffect, useState } from 'react';
import { Database, ExternalLink } from 'lucide-react';
import api from '../../api';

export default function DatabaseAdmin() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/admin/database');
      setData(response.data);
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Base de datos</h1>
        <p className="text-gray-400 mt-1">Acceso reservado al superadmin.</p>
      </div>

      <div className="bg-cardDark border border-borderDark rounded-lg p-6 space-y-5">
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-accent" />
          <div>
            <h2 className="text-xl font-bold">phpMyAdmin</h2>
            <p className="text-sm text-gray-500">Servicio Docker en el puerto 8081.</p>
          </div>
        </div>

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-gray-500">Base de datos</p>
              <p className="font-semibold">{data.database}</p>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <p className="text-gray-500">Usuario app</p>
              <p className="font-semibold">{data.username}</p>
            </div>
          </div>
        )}

        <a
          href={data?.url || 'http://localhost:8081'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accentHover text-white px-5 py-3 rounded-lg font-bold"
        >
          Abrir phpMyAdmin
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
