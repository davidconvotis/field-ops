import { useEffect, useState } from 'react';
import { listTechnicians, ApiError } from '../services/api.js';

// FR-003/FR-004: desplegable de asignación — solo técnicos activos.
// FR-007: mensaje claro cuando no hay ninguno disponible.
export default function TechnicianAssignSelect({ onSelect }) {
  const [technicians, setTechnicians] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    listTechnicians({ activo: true })
      .then((result) => setTechnicians(result.items))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Error inesperado'));
  }, []);

  if (error) return <p role="alert" className="text-xs text-red-700">{error}</p>;
  if (!technicians) return <p className="text-xs text-slate-500">Cargando técnicos…</p>;
  if (technicians.length === 0) return <p className="text-xs text-slate-500">No hay técnicos disponibles.</p>;

  return (
    <select
      defaultValue=""
      onChange={(e) => {
        const value = e.target.value;
        e.target.value = '';
        onSelect(value);
      }}
      className="rounded-md border border-slate-300 px-2 py-1 text-sm"
    >
      <option value="" disabled>
        Asignar técnico…
      </option>
      {technicians.map((tech) => (
        <option key={tech.id} value={tech.id}>
          {tech.nombre}
        </option>
      ))}
    </select>
  );
}
