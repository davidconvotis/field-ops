const express = require('express');
const authn = require('../middleware/authn');
const rbac = require('../middleware/rbac');
const reviewService = require('../services/reviewService');
const { ROLES } = require('../constants');

const router = express.Router();

function handleServiceError(err, res, next) {
  if (err instanceof reviewService.HttpError) {
    const body = { error: err.publicMessage };
    if (err.currentStatus) body.status = err.currentStatus;
    return res.status(err.status).json(body);
  }
  return next(err);
}

router.post('/:orderId/approve', authn, rbac(ROLES.SUPERVISOR), async (req, res, next) => {
  try {
    const order = await reviewService.approve({ orderId: req.params.orderId, supervisorId: req.user.id });
    res.status(200).json(order);
  } catch (err) {
    handleServiceError(err, res, next);
  }
});

router.post('/:orderId/reject', authn, rbac(ROLES.SUPERVISOR), async (req, res, next) => {
  try {
    const order = await reviewService.reject({ orderId: req.params.orderId, supervisorId: req.user.id, reason: req.body.reason });
    res.status(200).json(order);
  } catch (err) {
    handleServiceError(err, res, next);
  }
});

module.exports = router;
