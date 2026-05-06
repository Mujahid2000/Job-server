"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roleMiddleware_1 = __importDefault(require("./roleMiddleware"));
/**
 * Middleware: allow only users with role `Admin`
 * Usage: verifyToken, allowAdmin, handler
 */
const allowAdmin = (0, roleMiddleware_1.default)('Admin');
exports.default = allowAdmin;
