// FR-005a: modal de confirmación obligatorio al reasignar una orden que ya
// tiene técnico asignado (no aplica a asignación inicial sobre sin_asignar).
export default function ReassignConfirmModal({ previousTechnicianNombre, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="font-medium text-slate-800">Confirmar reasignación</h3>
        <p className="text-sm text-slate-600">
          Esta orden ya está asignada a <strong>{previousTechnicianNombre || 'un técnico'}</strong>. ¿Confirmas
          reasignarla al nuevo técnico seleccionado?
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-slate-200 px-3 py-2 text-sm hover:bg-slate-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
