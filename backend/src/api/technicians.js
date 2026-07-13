const express = require('express');
const authn = require('../middleware/authn');
const rbac = require('../middleware/rbac');
const userService = require('../services/userService');
const { ROLES } = require('../constants');

const router = express.Router();

// 003-dispatcher-orders-ui FR-011/FR-012 (listado propio) + FR-003/FR-004 (desplegable
// de asignación reutiliza esta misma ruta con activo=true, research.md §5a).
router.get('/', authn, rbac(ROLES.DISPATCHER), async (req, res, next) => {
  try {
    const { activo, page } = req.query;
    const result = await userService.listTechnicians({
      activo: activo === undefined ? undefined : activo === 'true',
      page: page !== undefined ? Number(page) : undefined,
    });
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof userService.HttpError) {
      return res.status(err.status).json({ error: err.publicMessage });
    }
    return next(err);
  }
});

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
