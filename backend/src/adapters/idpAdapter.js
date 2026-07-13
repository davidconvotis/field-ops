const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { prisma } = require('../db/prismaClient');

const ACCESS_TOKEN_TTL = `${process.env.ACCESS_TOKEN_TTL_MINUTES || 15}m`;
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);
const REFRESH_TOKEN_TTL = `${REFRESH_TOKEN_TTL_DAYS}d`;

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

/**
 * 002-login-rbac Research §2: emite el par access (15min) + refresh (7 días, con
 * `jti` propio) usado por /auth/login y /auth/refresh. Ambos JWT firmados con el
 * mismo secreto de dev/test (Research §1 — sin sesión server-side).
 */
function issueTokenPair({ userId, role }) {
  const secret = process.env.JWT_DEV_SECRET;
  if (!secret) throw new IdpUnavailableError('idpAdapter mal configurado: JWT_DEV_SECRET ausente');

  const jti = uuidv4();
  const accessToken = jwt.sign({ sub: userId, role }, secret, { expiresIn: ACCESS_TOKEN_TTL });
  const refreshToken = jwt.sign({ sub: userId, role, jti }, secret, { expiresIn: REFRESH_TOKEN_TTL });
  return { accessToken, refreshToken };
}

/**
 * Verifica un refresh token: firma/expiración (InvalidTokenError -> 401) y que su
 * `jti` no esté en la denylist de revocados (FR-009, Research §3).
 */
async function verifyRefreshToken(token) {
  const payload = verifyToken(token);
  if (!payload.jti) throw new InvalidTokenError('refresh token sin jti');

  const revoked = await prisma.revokedRefreshToken.findUnique({ where: { jti: payload.jti } });
  if (revoked) throw new InvalidTokenError('refresh token revocado');

  return payload;
}

/**
 * FR-009: revoca un refresh token insertando su `jti` en la denylist. Idempotente
 * (logout repetido con el mismo token no falla).
 */
async function revokeRefreshToken({ jti, userId, expiresAt }) {
  await prisma.revokedRefreshToken.upsert({
    where: { jti },
    update: {},
    create: { jti, userId, expiresAt },
  });
}

module.exports = {
  verifyToken,
  issueDevToken,
  issueTokenPair,
  verifyRefreshToken,
  revokeRefreshToken,
  IdpUnavailableError,
  InvalidTokenError,
};
