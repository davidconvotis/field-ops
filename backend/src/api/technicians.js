const express = require('express');
const authn = require('../middleware/authn');
const rbac = require('../middleware/rbac');
const userService = require('../services/userService');
const { ROLES } = require('../constants');

const router = express.Router();

router.patch('/:technicianId/activo', authn, rbac(ROLES.DISPATCHER), async (req, res, next) => {
  try {
    const technician = await userService.setTechnicianActive({
      technicianId: req.params.technicianId,
      activo: req.body.activo,
      dispatcherId: req.user.id,
    });
    res.status(200).json(technician);
  } catch (err) {
    if (err instanceof userService.HttpError) {
      return res.status(err.status).json({ error: err.publicMessage });
    }
    return next(err);
  }
});

module.exports = router;
