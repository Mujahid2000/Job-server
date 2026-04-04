import allowRoles from './roleMiddleware';

/**
 * Middleware: allow only users with role `Applicant`
 * Usage: verifyToken, allowApplicant, handler
 */
const allowApplicant = allowRoles('Applicant');

export default allowApplicant;
