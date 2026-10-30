import { useEffect, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { isPlatformAdmin } from '../../lib/permissions';

const statuses = [
  { value: 'new', label: 'Nueva' },
  { value: 'in_progress', label: 'En soporte' },
  { value: 'resolved', label: 'Resuelta' },
  { value: 'archived', label: 'Archivada' },
];

export default function ConversationsAdmin() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const platformAdmin = isPlatformAdmin(user);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const response = await api.get('/admin/conversations');
    setConversations(response.data);
    if (!selected && response.data.length) setSelected(response.data[0]);
  };

  const loadConversation = async (conversation) => {
    const response = await api.get(`/admin/conversations/${conversation.id}`);
    setSelected(response.data);
  };

  const updateStatus = async (conversation, status) => {
    await api.put(`/admin/conversations/${conversation.id}`, { status });
    fetchConversations();
    if (selected?.id === conversation.id) loadConversation(conversation);
  };

  const sendNote = async () => {
    if (!note.trim() || !selected) return;
    await api.post(`/admin/conversations/${selected.id}/messages`, { message: note });
    setNote('');
    loadConversation(selected);
    fetchConversations();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Conversaciones</h1>
        <p className="text-gray-400 mt-1">Mensajes iniciados desde WhatsApp y soporte.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-cardDark border border-borderDark rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="p-4">Cliente</th>
                {platformAdmin && <th className="p-4">Tienda</th>}
                <th className="p-4">Mensaje</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((conversation) => (
                <tr key={conversation.id} onClick={() => loadConversation(conversation)} className="border-t border-borderDark hover:bg-white/[0.03] cursor-pointer">
                  <td className="p-4">
                    <div className="font-semibold">{conversation.customer_name || 'Visitante'}</div>
                    <div className="text-xs text-gray-500">{conversation.customer_phone || 'Sin telefono'}</div>
                  </td>
                  {platformAdmin && <td className="p-4 text-gray-400">{conversation.tenant?.name}</td>}
                  <td className="p-4 text-gray-400 max-w-xs truncate">{conversation.message || conversation.subject}</td>
                  <td className="p-4">
                    <select
                      className="bg-gray-900 border border-borderDark rounded p-2"
                      value={conversation.status}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => updateStatus(conversation, event.target.value)}
                    >
                      {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {conversations.length === 0 && (
                <tr><td colSpan={platformAdmin ? 4 : 3} className="p-6 text-center text-gray-500">No hay conversaciones.</td></tr>
              )}
            </tbody>
          </table>
        </section>

        <aside className="bg-cardDark border border-borderDark rounded-lg p-5 min-h-[420px]">
          {selected ? (
            <div className="space-y-5">
              <div>
                <h2 className="font-bold text-xl">{selected.customer_name || 'Visitante'}</h2>
                <p className="text-sm text-gray-400">{selected.customer_phone || 'Sin telefono registrado'}</p>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {(selected.messages || []).map((message) => (
                  <div key={message.id} className={`p-3 rounded-lg ${message.direction === 'outbound' ? 'bg-accent/10 border border-accent/20' : 'bg-white/5'}`}>
                    <div className="text-xs text-gray-500 mb-1">{message.sender_name || message.sender_phone || message.direction}</div>
                    <p className="text-sm text-gray-200 whitespace-pre-wrap">{message.message}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <textarea className="w-full bg-gray-900 border border-borderDark rounded-lg p-3 min-h-24" placeholder="Nota de soporte..." value={note} onChange={(event) => setNote(event.target.value)} />
                <button onClick={sendNote} className="inline-flex items-center gap-2 bg-accent hover:bg-accentHover text-white px-4 py-2 rounded-lg font-bold">
                  <Send className="w-4 h-4" />
                  Guardar nota
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
              <MessageSquare className="w-10 h-10 mb-3" />
              Selecciona una conversacion.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
