import type { Request, Response, NextFunction } from 'express';

// FR-010: límite de 5 intentos/15min por email en POST /auth/login. Contador en
// memoria (Research §5) — suficiente para el tamaño de este slice (single-instance).
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const attempts = new Map<string, RateLimitEntry>();

function loginRateLimit(req: Request, res: Response, next: NextFunction) {
  const email = (req.body && req.body.email) || '';
  const now = Date.now();
  const entry = attempts.get(email);

  if (entry && now - entry.windowStart < WINDOW_MS) {
    if (entry.count >= MAX_ATTEMPTS) {
      return res.status(429).json({ error: 'Demasiados intentos, intenta más tarde' });
    }
  } else {
    attempts.set(email, { count: 0, windowStart: now });
  }

  res.on('finish', () => {
    if (res.statusCode === 401) {
      const current = attempts.get(email) || { count: 0, windowStart: now };
      current.count += 1;
      attempts.set(email, current);
    }
  });

  return next();
}

function _resetForTests(): void {
  attempts.clear();
}

module.exports = loginRateLimit;
module.exports._resetForTests = _resetForTests;
