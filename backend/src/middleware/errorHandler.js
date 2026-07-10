/**
 * Constitución "Seguridad mínima": los errores del backend NUNCA exponen
 * stack traces en respuestas de producción.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || 500;
  const body = { error: err.publicMessage || 'error interno del servidor' };
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    body.stack = err.stack;
  }
  res.status(status).json(body);
}

module.exports = errorHandler;
