import type { Request, Response, NextFunction } from 'express';

type RequestWithUser = Request & { user?: { id: string; role: string } };

/**
 * FR-000: RBAC transversal. Requiere que `authn` haya corrido antes (req.user seteado).
 * Rol válido pero sin permiso para la operación -> 403.
 */
function rbac(...allowedRoles: string[]) {
  return function rbacMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({ error: 'no autenticado' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `rol '${req.user.role}' sin permiso para esta operación` });
    }
    return next();
  };
}

module.exports = rbac;
