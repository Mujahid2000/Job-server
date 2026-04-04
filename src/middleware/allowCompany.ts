import allowRoles from './roleMiddleware';

/**
 * Middleware: allow only users with role `Company`
 * Usage: verifyToken, allowCompany, handler
 */
const allowCompany = allowRoles('Company');

export default allowCompany;
