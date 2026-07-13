const express = require('express');
const authn = require('../middleware/authn');
const loginRateLimit = require('../middleware/loginRateLimit');
const authService = require('../services/authService');

const router = express.Router();

const ACCESS_TOKEN_TTL_MINUTES = Number(process.env.ACCESS_TOKEN_TTL_MINUTES || 15);
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);

const isProd = process.env.NODE_ENV === 'production';

function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: maxAgeMs,
  };
}

function setSessionCookies(res, { accessToken, refreshToken }) {
  res.cookie('access_token', accessToken, cookieOptions(ACCESS_TOKEN_TTL_MINUTES * 60 * 1000));
  res.cookie('refresh_token', refreshToken, cookieOptions(REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000));
}

function clearSessionCookies(res) {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
}

function handleServiceError(err, res, next) {
  if (err instanceof authService.HttpError) {
    return res.status(err.status).json({ error: err.publicMessage });
  }
  return next(err);
}

// FR-001..FR-005, FR-010
router.post('/login', loginRateLimit, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(401).json({ error: authService.INVALID_CREDENTIALS_MESSAGE });
    }

    const { accessToken, refreshToken, userId, role } = await authService.login({ email, password });
    setSessionCookies(res, { accessToken, refreshToken });
    return res.status(200).json({ userId, role });
  } catch (err) {
    return handleServiceError(err, res, next);
  }
});

// FR-002a
router.post('/refresh', async (req, res, next) => {
  try {
    const { accessToken, refreshToken, userId, role } = await authService.refresh(req.cookies.refresh_token);
    setSessionCookies(res, { accessToken, refreshToken });
    return res.status(200).json({ userId, role });
  } catch (err) {
    return handleServiceError(err, res, next);
  }
});

// FR-009
router.post('/logout', authn, async (req, res, next) => {
  try {
    await authService.logout(req.cookies.refresh_token);
    clearSessionCookies(res);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return handleServiceError(err, res, next);
  }
});

module.exports = router;
