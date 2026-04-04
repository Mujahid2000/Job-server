import allowRoles from './roleMiddleware';

/**
 * Middleware: allow only users with role `Admin`
 * Usage: verifyToken, allowAdmin, handler
 */
const allowAdmin = allowRoles('Admin');

export default allowAdmin;
