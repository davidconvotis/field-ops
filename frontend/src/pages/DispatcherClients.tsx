import { useCallback, useState } from 'react';
import { searchClients, createClient, updateClient, setClientActive, ApiError } from '../services/api';

interface Client {
  id: string;
  nombre?: string;
  email?: string;
  activo: boolean;
  [key: string]: unknown;
}

interface ClientsResult {
  items: Client[];
  page: number;
  total: number;
  pageSize: number;
}

// FR-015..FR-017: CRUD de clientes (crear/editar/baja lógica).
export default function DispatcherClients() {
  const [result, setResult] = useState<ClientsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const fetchClients = useCallback(async (nextPage = page) => {
    setError(null);
    try {
      const data = await searchClients({ page: nextPage });
      setResult(data);
      setPage(nextPage);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }, [page]);

  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setInitialized(true);
    fetchClients(1);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createClient({ nombre, email });
      setNombre('');
      setEmail('');
      await fetchClients(1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }

  function startEdit(client: Client) {
    setEditingId(client.id);
    setEditNombre(client.nombre || '');
    setEditEmail(client.email || '');
  }

  async function handleSaveEdit(clientId: string) {
    try {
      await updateClient(clientId, { nombre: editNombre, email: editEmail });
      setEditingId(null);
      await fetchClients();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }

  async function handleToggleActive(clientId: string, activo: boolean) {
    try {
      await setClientActive(clientId, activo);
      await fetchClients();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold text-slate-800">Clientes</h2>

      <form onSubmit={handleCreate} className="flex items-end gap-3 rounded-lg bg-white p-4 shadow-sm">
        <label className="block text-sm text-slate-600">
          Nombre
          <input
            value={nombre}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm text-slate-600">
          Email
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Crear
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && result.items.length === 0 && <p className="text-sm text-slate-500">No hay clientes registrados.</p>}

      {result && result.items.length > 0 && (
        <>
          <table className="w-full table-auto rounded-lg bg-white shadow-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                <th className="p-3">Nombre</th>
                <th className="p-3">Email</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((client) => (
                <tr key={client.id} className="border-b border-slate-100 text-sm">
                  {editingId === client.id ? (
                    <>
                      <td className="p-3">
                        <input
                          value={editNombre}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditNombre(e.target.value)}
                          className="w-full rounded-md border border-slate-300 px-2 py-1"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          value={editEmail}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditEmail(e.target.value)}
                          className="w-full rounded-md border border-slate-300 px-2 py-1"
                        />
                      </td>
                      <td className="p-3">{client.activo ? 'activo' : 'inactivo'}</td>
                      <td className="p-3 space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(client.id)}
                          className="rounded-md bg-emerald-600 px-2 py-1 text-xs text-white hover:bg-emerald-700"
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-md bg-slate-200 px-2 py-1 text-xs hover:bg-slate-300"
                        >
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">{client.nombre}</td>
                      <td className="p-3">{client.email}</td>
                      <td className="p-3">{client.activo ? 'activo' : 'inactivo'}</td>
                      <td className="p-3 space-x-2">
                        <button
                          type="button"
                          onClick={() => startEdit(client)}
                          className="rounded-md bg-slate-200 px-2 py-1 text-xs hover:bg-slate-300"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(client.id, !client.activo)}
                          className="rounded-md bg-slate-200 px-2 py-1 text-xs hover:bg-slate-300"
                        >
                          {client.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => fetchClients(page - 1)}
              className="rounded-md bg-slate-200 px-3 py-1 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {result.page} — {result.total} clientes en total
            </span>
            <button
              type="button"
              disabled={page * result.pageSize >= result.total}
              onClick={() => fetchClients(page + 1)}
              className="rounded-md bg-slate-200 px-3 py-1 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
