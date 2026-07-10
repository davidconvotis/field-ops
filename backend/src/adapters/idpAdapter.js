const jwt = require('jsonwebtoken');

class IdpUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IdpUnavailableError';
  }
}

class InvalidTokenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

/**
 * Verifica un Bearer JWT. Modo dev/test: secreto local compartido (JWT_DEV_SECRET).
 * Modo prod: verificaría contra JWKS del IdP externo real (fuera de alcance de este slice).
 * Distingue explícitamente token inválido (InvalidTokenError -> 401) de fallo del
 * verificador externo (IdpUnavailableError -> 503), per NFR-03b.
 */
function verifyToken(token) {
  if (!token) throw new InvalidTokenError('token ausente');

  if (process.env.IDP_SIMULATE_UNAVAILABLE === 'true') {
    throw new IdpUnavailableError('IdP/JWKS inalcanzable (simulado)');
  }

  const secret = process.env.JWT_DEV_SECRET;
  if (!secret) {
    // Sin secreto configurado, el validador no puede operar: es un fallo de infraestructura, no un token inválido.
    throw new IdpUnavailableError('idpAdapter mal configurado: JWT_DEV_SECRET ausente');
  }

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new InvalidTokenError(err.message);
  }
}

function issueDevToken({ userId, role }) {
  const secret = process.env.JWT_DEV_SECRET;
  return jwt.sign({ sub: userId, role }, secret, { expiresIn: '12h' });
}

module.exports = { verifyToken, issueDevToken, IdpUnavailableError, InvalidTokenError };
