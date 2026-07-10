const express = require('express');
const authn = require('../middleware/authn');
const rbac = require('../middleware/rbac');
const orderService = require('../services/orderService');
const { summarizeWithTimeout } = require('../services/summaryService');
const { ROLES } = require('../constants');

const router = express.Router();

function handleServiceError(err, res, next) {
  if (err instanceof orderService.HttpError) {
    const body = { error: err.publicMessage };
    if (err.currentStatus) body.status = err.currentStatus;
    return res.status(err.status).json(body);
  }
  return next(err);
}

router.post('/', authn, rbac(ROLES.DISPATCHER), async (req, res, next) => {
  try {
    const order = await orderService.createOrder({ clientId: req.body.clientId, dispatcherId: req.user.id });
    res.status(201).json(order);
  } catch (err) {
    handleServiceError(err, res, next);
  }
});

router.patch('/:orderId/assign', authn, rbac(ROLES.DISPATCHER), async (req, res, next) => {
  try {
    const order = await orderService.assignTechnician({
      orderId: req.params.orderId,
      technicianId: req.body.technicianId,
      expectedVersion: req.body.expectedVersion,
      dispatcherId: req.user.id,
    });
    res.status(200).json(order);
  } catch (err) {
    handleServiceError(err, res, next);
  }
});

router.get('/', authn, rbac(ROLES.CLIENTE, ROLES.TECNICO, ROLES.DISPATCHER, ROLES.SUPERVISOR), async (req, res, next) => {
  try {
    const orders = await orderService.listForRole({ role: req.user.role, userId: req.user.id });
    res.status(200).json(orders);
  } catch (err) {
    handleServiceError(err, res, next);
  }
});

router.get('/:orderId', authn, rbac(ROLES.CLIENTE, ROLES.TECNICO, ROLES.DISPATCHER, ROLES.SUPERVISOR), async (req, res, next) => {
  try {
    const order = await orderService.getByIdForRole({ orderId: req.params.orderId, role: req.user.role, userId: req.user.id });
    const body = { ...order };

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
});

module.exports = router;
