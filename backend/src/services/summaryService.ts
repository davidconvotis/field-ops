export {};

const { SUMMARY_TIMEOUT_MS } = require('../constants');

const FALLBACK_MESSAGE = 'Evidencia insuficiente para generar resumen';
const MIN_WORDS = 20;

class SummaryUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SummaryUnavailableError';
  }
}

class SummaryTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SummaryTimeoutError';
  }
}

interface SummaryResult {
  summary: string | null;
  fallback: boolean;
  message?: string;
}

/**
 * Principio IV (constitución): resumen extractivo (tomado literalmente de las
 * notas, nunca inventado) con fallback explícito si hay evidencia insuficiente.
 */
function generateSummarySync(notes: string): SummaryResult {
  const trimmed = (notes || '').trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  if (!trimmed || wordCount < MIN_WORDS) {
    return { summary: null, fallback: true, message: FALLBACK_MESSAGE };
  }

  const sentences = trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed];
  const summary = sentences.slice(0, 2).join(' ').trim();
  return { summary, fallback: false };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new SummaryTimeoutError(`timeout tras ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function summarizeWithTimeout(notes: string): Promise<SummaryResult> {
  if (process.env.SUMMARY_SIMULATE_FAILURE === 'true') {
    throw new SummaryUnavailableError('servicio de resumen no disponible (simulado)');
  }
  if (process.env.SUMMARY_SIMULATE_TIMEOUT === 'true') {
    return withTimeout(
      new Promise<SummaryResult>((resolve) => {
        setTimeout(() => resolve(undefined as unknown as SummaryResult), SUMMARY_TIMEOUT_MS + 1000);
      }),
      SUMMARY_TIMEOUT_MS,
    );
  }
  return withTimeout(Promise.resolve(generateSummarySync(notes)), SUMMARY_TIMEOUT_MS);
}

module.exports = { summarizeWithTimeout, generateSummarySync, FALLBACK_MESSAGE, SummaryUnavailableError, SummaryTimeoutError };
