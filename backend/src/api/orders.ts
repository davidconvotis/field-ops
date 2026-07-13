import type { NextFunction, Request, Response } from 'express';
import type { OrderStatus, UserRole } from '@prisma/client';

const express = require('express');
const authn = require('../middleware/authn');
const rbac = require('../middleware/rbac');
import orderService = require('../services/orderService');
const { summarizeWithTimeout } = require('../services/summaryService');
const { ROLES, ORDER_STATUS } = require('../constants');

const router = express.Router();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_STATUSES = Object.values(ORDER_STATUS);

type AuthedRequest = Request & { user?: { id: string; role: string } };

function handleServiceError(err: unknown, res: Response, next: NextFunction): void {
  if (err instanceof orderService.HttpError) {
    const body: { error: string; status?: unknown } = { error: err.publicMessage };
    if (err.currentStatus) body.status = err.currentStatus;
    res.status(err.status).json(body);
    return;
  }
  next(err);
}

router.post('/', authn, rbac(ROLES.DISPATCHER), async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.createOrder({ clientId: req.body.clientId, dispatcherId: req.user!.id });
    res.status(201).json(order);
  } catch (err) {
    handleServiceError(err, res, next);
  }
});

router.patch('/:orderId/assign', authn, rbac(ROLES.DISPATCHER), async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.assignTechnician({
      orderId: req.params.orderId,
      technicianId: req.body.technicianId,
      expectedVersion: req.body.expectedVersion,
      dispatcherId: req.user!.id,
    });
    res.status(200).json(order);
  } catch (err) {
    handleServiceError(err, res, next);
  }
});

router.get(
  '/',
  authn,
  rbac(ROLES.CLIENTE, ROLES.TECNICO, ROLES.DISPATCHER, ROLES.SUPERVISOR),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const status = req.query.status as string | undefined;
      const technicianId = req.query.technicianId as string | undefined;
      const page = req.query.page as string | undefined;

      if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `status inválido, valores permitidos: ${VALID_STATUSES.join(', ')}` });
      }
      if (technicianId !== undefined && !UUID_RE.test(technicianId)) {
        return res.status(400).json({ error: 'technicianId debe ser un uuid válido' });
      }

      const result = await orderService.listForRole({
        role: req.user!.role as UserRole,
        userId: req.user!.id,
        status: status as OrderStatus | undefined,
        technicianId,
        page: page !== undefined ? Number(page) : undefined,
      });
      res.status(200).json(result);
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
);

// 003-dispatcher-orders-ui FR-023
router.patch('/:orderId', authn, rbac(ROLES.DISPATCHER), async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.editClient({
      orderId: req.params.orderId,
      clientId: req.body.clientId,
      expectedVersion: req.body.expectedVersion,
      dispatcherId: req.user!.id,
    });
    res.status(200).json(order);
  } catch (err) {
    handleServiceError(err, res, next);
  }
});

// 003-dispatcher-orders-ui FR-025/FR-026
router.post('/:orderId/cancel', authn, rbac(ROLES.DISPATCHER), async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.cancelOrder({
      orderId: req.params.orderId,
      reason: req.body.reason,
      expectedVersion: req.body.expectedVersion,
      dispatcherId: req.user!.id,
    });
    res.status(200).json(order);
  } catch (err) {
    handleServiceError(err, res, next);
  }
});

router.get(
  '/:orderId',
  authn,
  rbac(ROLES.CLIENTE, ROLES.TECNICO, ROLES.DISPATCHER, ROLES.SUPERVISOR),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const order = await orderService.getByIdForRole({ orderId: req.params.orderId, role: req.user!.role as UserRole, userId: req.user!.id });
      const body: Record<string, unknown> = { ...order };

      // FR-020: resumen automático si hay notas de técnico registradas, con
      // degradación explícita (nunca bloquea la vista) si el servicio falla/excede tiempo.
      if (order.executionRecord) {
        try {
          const result = await summarizeWithTimeout(order.executionRecord.notes);
          body.summary = result.fallback ? null : result.summary;
          body.summaryUnavailable = false;
          if (result.fallback) body.summaryFallbackMessage = result.message;
        } catch {
          body.summary = null;
          body.summaryUnavailable = true;
        }
      }

      res.status(200).json(body);
    } catch (err) {
      handleServiceError(err, res, next);
    }
  },
);

module.exports = router;
