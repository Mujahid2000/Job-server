"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = require("../utils/ApiError");
/**
 * Role-checking middleware factory.
 * Usage:
 *   app.get('/admin', verifyToken, allowRoles(['Admin']), handler)
 *   or
 *   app.post('/company-only', verifyToken, allowRoles('Company'), handler)
 */
const allowRoles = (roles) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    return (req, _res, next) => {
        var _a;
        try {
            const decoded = req.decoded;
            if (!decoded) {
                throw new ApiError_1.ApiError(401, 'Unauthorized: missing or invalid token');
            }
            // Support tokens where payload is { id, email, role, ... }
            // or where payload is { data: { ...user } }
            const tokenRole = (decoded && (decoded.role || ((_a = decoded === null || decoded === void 0 ? void 0 : decoded.data) === null || _a === void 0 ? void 0 : _a.role)));
            if (!tokenRole) {
                throw new ApiError_1.ApiError(403, 'Forbidden: role not present on token');
            }
            const normalized = tokenRole.toString().toLowerCase();
            const isAllowed = allowed.some((r) => r.toString().toLowerCase() === normalized);
            if (!isAllowed) {
                throw new ApiError_1.ApiError(403, `Access denied: requires role ${allowed.join(' | ')}`);
            }
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
};
exports.default = allowRoles;
