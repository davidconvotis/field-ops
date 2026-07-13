import type { Request, Response, NextFunction } from 'express';

interface HttpError extends Error {
  status?: number;
  publicMessage?: string;
}

/**
 * Constitución "Seguridad mínima": los errores del backend NUNCA exponen
 * stack traces en respuestas de producción.
 */
function errorHandler(err: HttpError, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || 500;
  const body: { error: string; stack?: string } = { error: err.publicMessage || 'error interno del servidor' };
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    body.stack = err.stack;
  }
  res.status(status).json(body);
}

module.exports = errorHandler;
