const { verifyToken, IdpUnavailableError, InvalidTokenError } = require('../adapters/idpAdapter');

/**
 * NFR-03/03b: 401 en token ausente/inválido; 503 si el propio validador externo falla.
 */
function authn(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
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
