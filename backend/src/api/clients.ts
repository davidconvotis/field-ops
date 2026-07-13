import type { NextFunction, Request, Response } from 'express';

const express = require('express');
const authn = require('../middleware/authn');
const rbac = require('../middleware/rbac');
import clientService = require('../services/clientService');
const { ROLES } = require('../constants');

const router = express.Router();

type AuthedRequest = Request & { user?: { id: string; role: string } };

// 003-dispatcher-orders-ui FR-021 (búsqueda por cualquier campo) / FR-011-análogo (listado)
router.get('/', authn, rbac(ROLES.DISPATCHER), async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string | undefined;
    const page = req.query.page as string | undefined;
    const result = await clientService.searchClients({ q, page: page !== undefined ? Number(page) : undefined });
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof clientService.HttpError) {
      return res.status(err.status).json({ error: err.publicMessage });
    }
    return next(err);
  }
});

// FR-015
router.post('/', authn, rbac(ROLES.DISPATCHER), async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const client = await clientService.createClient({ nombre: req.body.nombre, email: req.body.email });
    res.status(201).json(client);
  } catch (err) {
    if (err instanceof clientService.HttpError) {
      return res.status(err.status).json({ error: err.publicMessage });
    }
    return next(err);
  }
});

// FR-016
router.patch('/:clientId', authn, rbac(ROLES.DISPATCHER), async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const client = await clientService.updateClient({
      clientId: req.params.clientId,
      nombre: req.body.nombre,
      email: req.body.email,
    });
    res.status(200).json(client);
  } catch (err) {
    if (err instanceof clientService.HttpError) {
      return res.status(err.status).json({ error: err.publicMessage });
    }
    return next(err);
  }
});

// FR-017: siempre baja lógica, sin excepción.
router.patch('/:clientId/activo', authn, rbac(ROLES.DISPATCHER), async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const client = await clientService.setClientActive({
      clientId: req.params.clientId,
      activo: req.body.activo,
    });
    res.status(200).json(client);
  } catch (err) {
    if (err instanceof clientService.HttpError) {
      return res.status(err.status).json({ error: err.publicMessage });
    }
    return next(err);
  }
});

module.exports = router;
