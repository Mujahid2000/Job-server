"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const UserModels_1 = __importDefault(require("../models/UserModels"));
const router = express_1.default.Router();
// Create tokens for a DB user. Accepts either { userId } or { email, password } in body.
router.post('/token', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, email, password } = req.body || {};
        let user = null;
        if (userId) {
            user = yield UserModels_1.default.findById(userId);
        }
        else if (email && password) {
            user = yield UserModels_1.default.findOne({ email });
            if (!user)
                throw new ApiError_1.ApiError(404, 'User not found');
            const valid = yield user.isPasswordCorrect(password);
            if (!valid)
                throw new ApiError_1.ApiError(401, 'Invalid credentials');
        }
        else {
            throw new ApiError_1.ApiError(400, 'Provide userId or email and password');
        }
        if (!user)
            throw new ApiError_1.ApiError(404, 'User not found');
        const accessToken = yield user.generateAccessToken();
        const refreshToken = yield user.generateRefreshToken();
        // Persist the refresh token for later validation/rotation
        user.refreshToken = refreshToken;
        yield user.save({ validateBeforeSave: false });
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, { accessToken, refreshToken }, 'Tokens generated successfully'));
    }
    catch (err) {
        return next(err);
    }
}));
// Refresh tokens securely using the stored refresh token on the user record
router.post('/refresh', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { refreshToken } = req.body || {};
        if (!refreshToken)
            throw new ApiError_1.ApiError(401, 'Refresh token is required');
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.jwt.refreshSecret);
        }
        catch (e) {
            throw new ApiError_1.ApiError(401, 'Invalid or expired refresh token');
        }
        const userId = (decoded === null || decoded === void 0 ? void 0 : decoded.id) || ((_a = decoded === null || decoded === void 0 ? void 0 : decoded.data) === null || _a === void 0 ? void 0 : _a.id);
        if (!userId)
            throw new ApiError_1.ApiError(401, 'Invalid refresh token payload');
        const user = yield UserModels_1.default.findById(userId);
        if (!user)
            throw new ApiError_1.ApiError(404, 'User not found');
        // Optional: ensure the stored refresh token matches (rotation)
        if (!user.refreshToken || user.refreshToken !== refreshToken) {
            throw new ApiError_1.ApiError(401, 'Refresh token mismatch');
        }
        const accessToken = yield user.generateAccessToken();
        const newRefreshToken = yield user.generateRefreshToken();
        user.refreshToken = newRefreshToken;
        yield user.save({ validateBeforeSave: false });
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Tokens refreshed successfully'));
    }
    catch (err) {
        return next(err);
    }
}));
exports.default = router;
