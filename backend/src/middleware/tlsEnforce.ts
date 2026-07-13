import type { Request, Response, NextFunction } from 'express';

/**
 * NFR-01: todo tráfico cliente-servidor MUST usar TLS 1.2+; conexiones sin TLS
 * MUST ser rechazadas. En producción, la terminación TLS ocurre normalmente en
 * un proxy/load balancer; se confía en `X-Forwarded-Proto` para detectar el
 * esquema original. En dev/test (HTTP local plano) se omite la verificación.
 */
function tlsEnforce(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV !== 'production') return next();

  const forwardedProto = req.headers['x-forwarded-proto'];
  const isSecure = req.secure || forwardedProto === 'https';

  if (!isSecure) {
    return res.status(400).json({ error: 'TLS requerido: esta API no acepta tráfico sin cifrar' });
  }
  return next();
}

module.exports = tlsEnforce;
