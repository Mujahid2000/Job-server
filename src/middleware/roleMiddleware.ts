import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

type Role = 'Applicant' | 'Company' | 'Admin' | string;

/**
 * Role-checking middleware factory.
 * Usage:
 *   app.get('/admin', verifyToken, allowRoles(['Admin']), handler)
 *   or
 *   app.post('/company-only', verifyToken, allowRoles('Company'), handler)
 */
const allowRoles = (roles: Role[] | Role) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const decoded = (req as any).decoded;
      if (!decoded) {
        throw new ApiError(401, 'Unauthorized: missing or invalid token');
      }

      // Support tokens where payload is { id, email, role, ... }
      // or where payload is { data: { ...user } }
      const tokenRole: string | undefined = (decoded && (decoded.role || decoded?.data?.role)) as any;
      if (!tokenRole) {
        throw new ApiError(403, 'Forbidden: role not present on token');
      }

      const normalized = tokenRole.toString().toLowerCase();
      const isAllowed = allowed.some((r) => r.toString().toLowerCase() === normalized);

      if (!isAllowed) {
        throw new ApiError(403, `Access denied: requires role ${allowed.join(' | ')}`);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

export default allowRoles;
