import { useCallback, useState } from 'react';
import { listTechnicians, setTechnicianActive, ApiError } from '../services/api.js';

// FR-011/FR-012/FR-013/FR-014: listado paginado de técnicos con estado y
// cantidad de órdenes activas asignadas.
export default function DispatcherTechnicians() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchTechnicians = useCallback(async (nextPage = page) => {
    setError(null);
    try {
      const data = await listTechnicians({ page: nextPage });
      setResult(data);
      setPage(nextPage);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }, [page]);

  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setInitialized(true);
    fetchTechnicians(1);
  }

  async function handleToggleActive(technicianId, activo) {
    try {
      await setTechnicianActive(technicianId, activo);
      await fetchTechnicians();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold text-slate-800">Técnicos</h2>

      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && result.items.length === 0 && (
        <p className="text-sm text-slate-500">No hay técnicos registrados.</p>
      )}

      {result && result.items.length > 0 && (
        <>
          <table className="w-full table-auto rounded-lg bg-white shadow-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                <th className="p-3">Nombre</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Órdenes activas</th>
                <th className="p-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((tech) => (
                <tr key={tech.id} className="border-b border-slate-100 text-sm">
                  <td className="p-3">{tech.nombre}</td>
                  <td className="p-3">{tech.activo ? 'activo' : 'inactivo'}</td>
                  <td className="p-3">{tech.activeOrderCount}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(tech.id, !tech.activo)}
                      className="rounded-md bg-slate-200 px-2 py-1 text-xs hover:bg-slate-300"
                    >
                      {tech.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => fetchTechnicians(page - 1)}
              className="rounded-md bg-slate-200 px-3 py-1 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {result.page} — {result.total} técnicos en total
            </span>
            <button
              type="button"
              disabled={page * result.pageSize >= result.total}
              onClick={() => fetchTechnicians(page + 1)}
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
