import type { Request, Response, NextFunction } from 'express';

const { verifyToken, IdpUnavailableError, InvalidTokenError } = require('../adapters/idpAdapter');

export interface AuthenticatedUser {
  id: string;
  role: string;
}

export type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

/**
 * NFR-03/03b: 401 en token ausente/inválido; 503 si el propio validador externo falla.
 * 002-login-rbac Research §1: el frontend envía el access JWT vía cookie httpOnly
 * `access_token` (nunca localStorage). Se mantiene también el header `Authorization:
 * Bearer` como vía alterna para no romper clientes/tests existentes de `001` que lo
 * usan directamente (p.ej. tokens de dev emitidos por `seed.js`).
 */
function authn(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token = req.cookies && req.cookies.access_token;

  if (!token) {
    const header = req.headers.authorization || '';
    const [scheme, headerToken] = header.split(' ');
    if (scheme === 'Bearer') token = headerToken;
  }

  if (!token) {
    return res.status(401).json({ error: 'token ausente o formato inválido' });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (err) {
    if (err instanceof IdpUnavailableError) {
      return res.status(503).json({ error: 'validador de identidad no disponible' });
    }
    if (err instanceof InvalidTokenError) {
      return res.status(401).json({ error: 'token inválido o expirado' });
    }
    return res.status(503).json({ error: 'fallo inesperado de autenticación' });
  }
}

module.exports = authn;
