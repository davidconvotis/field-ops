import type { PrismaClient, UserRole } from '@prisma/client';

const bcrypt = require('bcrypt');
const { prisma } = require('../db/prismaClient') as { prisma: PrismaClient };
const { issueTokenPair, verifyRefreshToken, revokeRefreshToken, InvalidTokenError } = require('../adapters/idpAdapter');
const { ROLES } = require('../constants');

class HttpError extends Error {
  status: number;
  publicMessage: string;

  constructor(status: number, publicMessage: string) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

const INVALID_CREDENTIALS_MESSAGE = 'Credenciales inválidas';

interface LoginParams {
  email: string;
  password: string;
}

interface TokenPairResult {
  accessToken: string;
  refreshToken: string;
  userId: string;
  role: UserRole;
}

interface RefreshTokenPayload {
  sub: string;
  role: UserRole;
  jti: string;
  exp: number;
}

// FR-002/FR-003/FR-004: valida credenciales y emite el par access+refresh.
// El rol `cliente` queda fuera del alcance de este login (ver spec Assumptions/US1-3,
// que solo cubren Dispatcher/Technician/Supervisor) — se trata como credencial
// inválida para no revelar que la cuenta existe pero no puede usar este flujo.
async function login({ email, password }: LoginParams): Promise<TokenPairResult> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.role === ROLES.CLIENTE) {
    throw new HttpError(401, INVALID_CREDENTIALS_MESSAGE);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(401, INVALID_CREDENTIALS_MESSAGE);
  }

  const { accessToken, refreshToken } = issueTokenPair({ userId: user.id, role: user.role });
  return { accessToken, refreshToken, userId: user.id, role: user.role };
}

// FR-002a: renovación silenciosa — verifica denylist y expiración, rota el par.
async function refresh(refreshToken: string): Promise<TokenPairResult> {
  if (!refreshToken) throw new HttpError(401, 'refresh token ausente');

  let payload: RefreshTokenPayload;
  try {
    payload = await verifyRefreshToken(refreshToken);
  } catch (err: unknown) {
    if (err instanceof InvalidTokenError) throw new HttpError(401, 'refresh token inválido, expirado o revocado');
    throw err;
  }

  const { accessToken, refreshToken: newRefreshToken } = issueTokenPair({ userId: payload.sub, role: payload.role });
  return { accessToken, refreshToken: newRefreshToken, userId: payload.sub, role: payload.role };
}

// FR-009: revoca el refresh token activo insertando su jti en la denylist.
async function logout(refreshToken: string): Promise<void> {
  if (!refreshToken) return;

  let payload: RefreshTokenPayload;
  try {
    payload = await verifyRefreshToken(refreshToken);
  } catch {
    // Token ya inválido/revocado/expirado: logout es idempotente, no hay nada que revocar.
    return;
  }

  await revokeRefreshToken({ jti: payload.jti, userId: payload.sub, expiresAt: new Date(payload.exp * 1000) });
}

export = { login, refresh, logout, HttpError, INVALID_CREDENTIALS_MESSAGE };
