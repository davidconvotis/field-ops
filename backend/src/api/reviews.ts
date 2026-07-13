import type { NextFunction, Request, Response } from 'express';

const express = require('express');
const authn = require('../middleware/authn');
const rbac = require('../middleware/rbac');
import reviewService = require('../services/reviewService');
const { ROLES } = require('../constants');

const router = express.Router();

type AuthedRequest = Request & { user?: { id: string; role: string } };

function handleServiceError(err: unknown, res: Response, next: NextFunction): void {
  if (err instanceof reviewService.HttpError) {
    const body: { error: string; status?: unknown } = { error: err.publicMessage };
    if (err.currentStatus) body.status = err.currentStatus;
    res.status(err.status).json(body);
    return;
  }
  next(err);
}

router.post('/:orderId/approve', authn, rbac(ROLES.SUPERVISOR), async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const order = await reviewService.approve({ orderId: req.params.orderId, supervisorId: req.user!.id });
    res.status(200).json(order);
  } catch (err) {
    handleServiceError(err, res, next);
  }
});

router.post('/:orderId/reject', authn, rbac(ROLES.SUPERVISOR), async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const order = await reviewService.reject({ orderId: req.params.orderId, supervisorId: req.user!.id, reason: req.body.reason });
    res.status(200).json(order);
  } catch (err) {
    handleServiceError(err, res, next);
  }
});

module.exports = router;
