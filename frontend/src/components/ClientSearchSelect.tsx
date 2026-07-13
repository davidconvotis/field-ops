import { useEffect, useRef, useState } from 'react';
import { searchClients, ApiError } from '../services/api';

interface Client {
  id: string;
  nombre: string;
  email: string;
  activo: boolean;
}

interface ClientSearchSelectProps {
  onSelect: (clientId: string) => void;
  onCreateNew?: (q: string) => void;
}

// FR-021/FR-022: búsqueda de clientes por cualquier campo, debounced 300ms
// (research.md §6); sin coincidencias, ofrece crear un cliente nuevo (US6).
export default function ClientSearchSelect({ onSelect, onCreateNew }: ClientSearchSelectProps) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Client[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q) {
      setResults(null);
      return undefined;
    }
    debounceRef.current = setTimeout(() => {
      searchClients({ q })
        .then((result) => setResults(result.items))
        .catch((err) => setError(err instanceof ApiError ? err.message : 'Error inesperado'));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q]);

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar cliente por nombre, email o id…"
        className="w-full rounded-md border border-slate-300 px-3 py-2"
      />
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
      {results && results.length === 0 && (
        <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">
          <p>No se encontraron clientes.</p>
          {onCreateNew && (
            <button
              type="button"
              onClick={() => onCreateNew(q)}
              className="mt-2 rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
            >
              Crear cliente nuevo
            </button>
          )}
        </div>
      )}
      {results && results.length > 0 && (
        <ul className="divide-y divide-slate-100 rounded-md border border-slate-200 bg-white">
          {results.map((client) => (
            <li key={client.id}>
              <button
                type="button"
                onClick={() => onSelect(client.id)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
              >
                {client.nombre} — {client.email}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
