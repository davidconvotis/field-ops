const ROLES = Object.freeze({
  CLIENTE: 'cliente',
  TECNICO: 'tecnico',
  DISPATCHER: 'dispatcher',
  SUPERVISOR: 'supervisor',
});

const ORDER_STATUS = Object.freeze({
  SIN_ASIGNAR: 'sin_asignar',
  PENDIENTE_DE_REVISION: 'pendiente_de_revision',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
});

const TERMINAL_STATUSES = Object.freeze([ORDER_STATUS.APROBADA, ORDER_STATUS.RECHAZADA]);

const AUDIT_ACTIONS = Object.freeze({
  CREAR: 'crear',
  ASIGNAR: 'asignar',
  REASIGNAR: 'reasignar',
  DESACTIVAR_TECNICO_REASIGNA: 'desactivar_tecnico_reasigna',
  ENVIAR_EJECUCION: 'enviar_ejecucion',
  APROBAR: 'aprobar',
  RECHAZAR: 'rechazar',
  CONFLICTO_CONCURRENTE: 'conflicto_concurrente',
});

const ALLOWED_MIME_TYPES = Object.freeze(['image/jpeg', 'image/png', 'image/heic']);

const RETENTION_MONTHS = Number(process.env.RETENTION_MONTHS || 12);
const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB, SC-003/NFR-06
const SUMMARY_TIMEOUT_MS = Number(process.env.SUMMARY_TIMEOUT_MS || 5000);
const STORAGE_TIMEOUT_MS = Number(process.env.STORAGE_TIMEOUT_MS || 5000);

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

module.exports = {
  ROLES,
  ORDER_STATUS,
  TERMINAL_STATUSES,
  AUDIT_ACTIONS,
  ALLOWED_MIME_TYPES,
  RETENTION_MONTHS,
  MAX_PHOTO_SIZE_BYTES,
  SUMMARY_TIMEOUT_MS,
  STORAGE_TIMEOUT_MS,
  addMonths,
};
