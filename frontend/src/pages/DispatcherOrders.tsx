import { useCallback, useState } from 'react';
import { listOrders, createOrder, assignOrder, ApiError } from '../services/api';
import TechnicianAssignSelect from '../components/TechnicianAssignSelect';
import ReassignConfirmModal from '../components/ReassignConfirmModal';

interface Order {
  id: string;
  status: string;
  clientNombre?: string;
  technicianNombre?: string | null;
  createdAt?: string;
  version: number;
  technicianId?: string | null;
  [key: string]: unknown;
}

interface OrdersResult {
  items: Order[];
  page: number;
  total: number;
  pageSize: number;
}

interface FetchOrdersOpts {
  status?: string;
  technicianId?: string;
  page?: number;
}

interface PendingReassign {
  order: Order;
  newTechnicianId: string;
}

const STATUS_LABEL: Record<string, string> = {
  sin_asignar: 'sin_asignar',
  pendiente_de_revision: 'pendiente_de_revision',
  aprobada: 'aprobada',
  rechazada: 'rechazada',
};
const TERMINAL_STATUSES = ['aprobada', 'rechazada'];

export default function DispatcherOrders() {
  const [result, setResult] = useState<OrdersResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [page, setPage] = useState(1);
  const [pendingReassign, setPendingReassign] = useState<PendingReassign | null>(null); // { order, newTechnicianId }
  const [newClientId, setNewClientId] = useState('');

  const fetchOrders = useCallback(
    async (opts: FetchOrdersOpts = {}) => {
      const nextPage = opts.page ?? page;
      setLoading(true);
      setError(null);
      try {
        const data = await listOrders({
          status: opts.status ?? status,
          technicianId: opts.technicianId ?? technicianId,
          page: nextPage,
        });
        setResult(data);
        setPage(nextPage);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Error inesperado');
      } finally {
        setLoading(false);
      }
    },
    [page, status, technicianId],
  );

  // FR-002: carga inicial única al montar; a partir de aquí solo refresca vía
  // el botón "Refrescar" explícito, nunca automáticamente.
  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setInitialized(true);
    fetchOrders({ page: 1 });
  }

  function handleFilterChange(nextStatus: string, nextTechnicianId: string) {
    setStatus(nextStatus);
    setTechnicianId(nextTechnicianId);
    fetchOrders({ status: nextStatus, technicianId: nextTechnicianId, page: 1 });
  }

  function handleClearFilters() {
    handleFilterChange('', '');
  }

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createOrder(newClientId);
      setNewClientId('');
      await fetchOrders({ page: 1 });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }

  function handleAssignSelected(order: Order, selectedTechnicianId: string) {
    if (!selectedTechnicianId) return;
    if (order.technicianId) {
      setPendingReassign({ order, newTechnicianId: selectedTechnicianId });
    } else {
      doAssign(order, selectedTechnicianId, order.version);
    }
  }

  async function doAssign(order: Order, selectedTechnicianId: string, expectedVersion: number) {
    try {
      await assignOrder(order.id, { technicianId: selectedTechnicianId, expectedVersion });
      await fetchOrders();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error inesperado');
    }
  }

  function handleConfirmReassign() {
    if (!pendingReassign) return;
    const { order, newTechnicianId } = pendingReassign;
    setPendingReassign(null);
    doAssign(order, newTechnicianId, order.version);
  }

  function handleCancelReassign() {
    setPendingReassign(null);
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold text-slate-800">Órdenes</h2>

      <form onSubmit={handleCreateOrder} className="flex items-end gap-3 rounded-lg bg-white p-4 shadow-sm">
        <label className="block text-sm text-slate-600">
          Nueva orden — Cliente ID
          <input
            value={newClientId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewClientId(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Crear orden
        </button>
      </form>

      <div className="flex flex-wrap items-end gap-4 rounded-lg bg-white p-4 shadow-sm">
        <label className="block text-sm text-slate-600">
          Estado
          <select
            value={status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange(e.target.value, technicianId)}
            className="mt-1 rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="">Todos</option>
            {Object.keys(STATUS_LABEL).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-slate-600">
          Técnico ID
          <input
            value={technicianId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTechnicianId(e.target.value)}
            onBlur={() => handleFilterChange(status, technicianId)}
            className="mt-1 rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <button
          type="button"
          onClick={handleClearFilters}
          className="rounded-md bg-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-300"
        >
          Limpiar filtros
        </button>
        <button
          type="button"
          onClick={() => fetchOrders()}
          className="rounded-md bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-800"
        >
          Refrescar
        </button>
      </div>

      {loading && <p className="text-sm text-slate-500">Cargando…</p>}
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && result.items.length === 0 && !loading && (
        <p className="text-sm text-slate-500">No hay órdenes para mostrar.</p>
      )}

      {result && result.items.length > 0 && (
        <>
          <table className="w-full table-auto rounded-lg bg-white shadow-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                <th className="p-3">ID</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Técnico</th>
                <th className="p-3">Creada</th>
                <th className="p-3">Asignar</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 text-sm">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.status}</td>
                  <td className="p-3">{order.clientNombre}</td>
                  <td className="p-3">{order.technicianNombre || 'sin asignar'}</td>
                  <td className="p-3">{order.createdAt}</td>
                  <td className="p-3">
                    {TERMINAL_STATUSES.includes(order.status) ? (
                      <span className="text-xs text-slate-400">no asignable</span>
                    ) : (
                      <TechnicianAssignSelect onSelect={(techId: string) => handleAssignSelected(order, techId)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => fetchOrders({ page: page - 1 })}
              className="rounded-md bg-slate-200 px-3 py-1 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {result.page} — {result.total} órdenes en total
            </span>
            <button
              type="button"
              disabled={page * result.pageSize >= result.total}
              onClick={() => fetchOrders({ page: page + 1 })}
              className="rounded-md bg-slate-200 px-3 py-1 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {pendingReassign && (
        <ReassignConfirmModal
          previousTechnicianNombre={pendingReassign.order.technicianNombre ?? null}
          onConfirm={handleConfirmReassign}
          onCancel={handleCancelReassign}
        />
      )}
    </div>
  );
}
