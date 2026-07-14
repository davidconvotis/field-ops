export {};

const ROLES = Object.freeze({
  CLIENTE: 'cliente',
  TECNICO: 'tecnico',
  DISPATCHER: 'dispatcher',
  SUPERVISOR: 'supervisor',
} as const);

const ORDER_STATUS = Object.freeze({
  SIN_ASIGNAR: 'sin_asignar',
  PENDIENTE_DE_REVISION: 'pendiente_de_revision',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
  CANCELADA: 'cancelada',
} as const);

const TERMINAL_STATUSES = Object.freeze([
  ORDER_STATUS.APROBADA,
  ORDER_STATUS.RECHAZADA,
  ORDER_STATUS.CANCELADA,
] as const);

const AUDIT_ACTIONS = Object.freeze({
  CREAR: 'crear',
  ASIGNAR: 'asignar',
  REASIGNAR: 'reasignar',
  DESACTIVAR_TECNICO_REASIGNA: 'desactivar_tecnico_reasigna',
  ENVIAR_EJECUCION: 'enviar_ejecucion',
  APROBAR: 'aprobar',
  RECHAZAR: 'rechazar',
  CANCELAR: 'cancelar',
  EDITAR_CLIENTE: 'editar_cliente',
  CONFLICTO_CONCURRENTE: 'conflicto_concurrente',
} as const);

const ALLOWED_MIME_TYPES = Object.freeze(['image/jpeg', 'image/png', 'image/heic'] as const);

const RETENTION_MONTHS: number = Number(process.env.RETENTION_MONTHS || 12);
const MAX_PHOTO_SIZE_BYTES: number = 10 * 1024 * 1024; // 10 MB, SC-003/NFR-06
const SUMMARY_TIMEOUT_MS: number = Number(process.env.SUMMARY_TIMEOUT_MS || 5000);
const STORAGE_TIMEOUT_MS: number = Number(process.env.STORAGE_TIMEOUT_MS || 5000);

function addMonths(date: Date, months: number): Date {
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
