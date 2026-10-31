import { useEffect, useState } from 'react';
import { Plus, ShieldCheck, ExternalLink } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { isSuperAdmin, ROLE_LABELS, ROLES, STATUS_LABELS } from '../../lib/permissions';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: ROLES.CLIENT,
  status: 'active',
  store_name: '',
  domain: '',
  theme: 'boutique-demo',
};

export default function UsersAdmin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [domainTouched, setDomainTouched] = useState(false);
  const superadmin = isSuperAdmin(user);

  const normalizeDomain = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const fetchUsers = async () => {
    const response = await api.get('/admin/users');
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const setField = (field, value) => setFormData((current) => ({ ...current, [field]: value }));

  const createUser = async (event) => {
    event.preventDefault();
    await api.post('/admin/users', formData);
    setFormData(emptyForm);
    setDomainTouched(false);
    setShowForm(false);
    fetchUsers();
  };

  const approve = async (target) => {
    await api.post(`/admin/users/${target.id}/approve`);
    fetchUsers();
  };

  const suspend = async (target) => {
    if (!window.confirm(`Suspender a ${target.name}?`)) return;
    await api.post(`/admin/users/${target.id}/suspend`);
    fetchUsers();
  };

  const remove = async (target) => {
    if (!window.confirm(`Eliminar a ${target.name}?`)) return;
    await api.delete(`/admin/users/${target.id}`);
    fetchUsers();
  };

  const updateTheme = async (target, theme) => {
    if (!window.confirm(`¿Cambiar tema de ${target.tenant?.name} a ${theme}?`)) return;
    await api.put(`/admin/users/${target.id}`, { theme });
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-gray-400 mt-1">Clientes, administradores y estados de acceso.</p>
        </div>
        <button onClick={() => setShowForm((value) => !value)} className="inline-flex items-center gap-2 bg-primary hover:bg-primaryHover text-black font-bold py-2 px-4 rounded-lg">
          <Plus className="w-4 h-4" />
          Nuevo usuario
        </button>
      </div>

      {showForm && (
        <form onSubmit={createUser} className="bg-cardDark border border-borderDark rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required className="bg-gray-900 border border-borderDark rounded-lg p-3" placeholder="Nombre" value={formData.name} onChange={(event) => setField('name', event.target.value)} />
          <input required type="email" className="bg-gray-900 border border-borderDark rounded-lg p-3" placeholder="Email" value={formData.email} onChange={(event) => setField('email', event.target.value)} />
          <input required type="password" className="bg-gray-900 border border-borderDark rounded-lg p-3" placeholder="Password" value={formData.password} onChange={(event) => setField('password', event.target.value)} />
          <select className="bg-gray-900 border border-borderDark rounded-lg p-3" value={formData.role} onChange={(event) => setField('role', event.target.value)}>
            <option value={ROLES.CLIENT}>Cliente</option>
            {superadmin && <option value={ROLES.ADMIN}>Administrador</option>}
            {superadmin && <option value={ROLES.SUPERADMIN}>Superadmin</option>}
          </select>
          <select className="bg-gray-900 border border-borderDark rounded-lg p-3" value={formData.status} onChange={(event) => setField('status', event.target.value)}>
            <option value="pending">Pendiente</option>
            <option value="active">Activo</option>
            <option value="suspended">Suspendido</option>
          </select>
          {formData.role === ROLES.CLIENT && (
            <>
              <input
                required
                className="bg-gray-900 border border-borderDark rounded-lg p-3"
                placeholder="Nombre de tienda"
                value={formData.store_name}
                onChange={(event) => {
                  const storeName = event.target.value;
                  setFormData((current) => ({
                    ...current,
                    store_name: storeName,
                    domain: domainTouched ? current.domain : normalizeDomain(storeName),
                  }));
                }}
              />
              <div>
                <input
                  required
                  className="w-full bg-gray-900 border border-borderDark rounded-lg p-3"
                  placeholder="nombre-de-tienda"
                  value={formData.domain}
                  onChange={(event) => {
                    setDomainTouched(true);
                    setField('domain', normalizeDomain(event.target.value));
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">{window.location.host}/{formData.domain || 'nombre-de-tienda'}</p>
              </div>
            </>
          )}
          <button className="md:col-span-2 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accentHover text-white px-5 py-3 rounded-lg font-bold">
            <ShieldCheck className="w-4 h-4" />
            Crear usuario
          </button>
        </form>
      )}

      <div className="bg-cardDark border border-borderDark rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="p-4">Usuario</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Tienda</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((target) => {
              const targetIsAdmin = target.role === ROLES.ADMIN || target.role === ROLES.SUPERADMIN;
              const canDelete = superadmin || !targetIsAdmin;
              return (
                <tr key={target.id} className="border-t border-borderDark">
                  <td className="p-4">
                    <div className="font-semibold">{target.name}</div>
                    <div className="text-xs text-gray-500">{target.email}</div>
                  </td>
                  <td className="p-4">{ROLE_LABELS[target.role] || target.role}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">{target.tenant?.name || '-'}</span>
                        {target.role === ROLES.CLIENT && target.tenant?.domain && (
                          <a
                            href={`/${target.tenant.domain}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:text-primaryHover transition-colors"
                            title="Ver tienda"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      {superadmin && target.role === ROLES.CLIENT && target.tenant && (
                        <select 
                          value={target.tenant.theme || 'boutique-demo'}
                          onChange={(e) => updateTheme(target, e.target.value)}
                          className="bg-gray-900 border border-borderDark rounded p-1 text-xs text-gray-300"
                        >
                          <option value="boutique-demo">Boutique</option>
                          <option value="postres-demo">Postres</option>
                          <option value="tech-demo">Tech</option>
                          <option value="restaurant-demo">Restaurant</option>
                          <option value="minimal-demo">Minimal</option>
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${target.status === 'active' ? 'bg-green-500/20 text-green-400' : target.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {STATUS_LABELS[target.status] || target.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-3">
                    {target.status !== 'active' && <button onClick={() => approve(target)} className="text-accent hover:text-accentHover">Aprobar</button>}
                    {target.status !== 'suspended' && target.id !== user.id && <button onClick={() => suspend(target)} className="text-yellow-400 hover:text-yellow-300">Suspender</button>}
                    {canDelete && target.id !== user.id && <button onClick={() => remove(target)} className="text-red-400 hover:text-red-300">Eliminar</button>}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr><td colSpan="5" className="p-6 text-center text-gray-500">No hay usuarios.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
