"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware_1 = __importDefault(require("./roleMiddleware"));
/**
 * Middleware: allow only users with role `Company`
 * Usage: verifyToken, allowCompany, handler
 */
const allowCompany = (0, roleMiddleware_1.default)('Company');
exports.default = allowCompany;
