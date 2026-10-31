import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function AccountSecurity() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async event => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      await api.put('/account/password', form);
      await logout({ remote: false });
      navigate('/admin/login?password=updated');
    } catch (err) { setError(Object.values(err.response?.data?.errors || {}).flat()[0] || err.response?.data?.message || 'No pudimos cambiar tu contraseña.'); }
    finally { setBusy(false); }
  };
  return <div className="max-w-xl"><h1>Cambiar contraseña</h1><p className="text-gray-400 mt-2 mb-7">Usa al menos 12 caracteres. Al guardar, se cerrarán tus sesiones y tendrás que entrar con la nueva contraseña.</p><form className="platform-edit" onSubmit={submit}>{error && <p role="alert" className="platform-alert">{error}</p>}{[['current_password', 'Contraseña actual'], ['password', 'Nueva contraseña'], ['password_confirmation', 'Repite la nueva contraseña']].map(([field, label]) => <label key={field}>{label}<input required type="password" minLength={field === 'current_password' ? undefined : 12} maxLength={128} autoComplete={field === 'current_password' ? 'current-password' : 'new-password'} value={form[field]} onChange={event => setForm(old => ({ ...old, [field]: event.target.value }))} /></label>)}<button disabled={busy} className="platform-primary">{busy ? 'Guardando…' : 'Guardar nueva contraseña'}</button></form></div>;
}
