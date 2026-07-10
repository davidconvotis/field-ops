const express = require('express');
const multer = require('multer');
const authn = require('../middleware/authn');
const rbac = require('../middleware/rbac');
const { submitExecution, HttpError } = require('../services/executionService');
const { ROLES, MAX_PHOTO_SIZE_BYTES } = require('../constants');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_PHOTO_SIZE_BYTES } });

router.post('/:orderId/executions', authn, rbac(ROLES.TECNICO), upload.array('photos'), async (req, res, next) => {
  try {
    const idempotencyKey = req.header('Idempotency-Key');
    const files = (req.files || []).map((f) => ({ buffer: f.buffer, originalname: f.originalname }));
    const result = await submitExecution({
      orderId: req.params.orderId,
      technicianId: req.user.id,
      notes: req.body.notes,
      files,
      idempotencyKey,
    });
    res.status(result.status).json(result.body);
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ error: err.publicMessage });
    }
    return next(err);
  }
});

module.exports = router;
