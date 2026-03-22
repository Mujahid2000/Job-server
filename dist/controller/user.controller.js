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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = exports.registerUser = exports.loginUser = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const config_1 = require("../config/config");
const registerUser = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.registerUser(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, user, 'User registered successfully'));
}));
exports.registerUser = registerUser;
const loginUser = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = yield user_service_1.userService.loginUser(email, password);
    const options = {
        httpOnly: true,
        secure: config_1.config.env === 'production',
    };
    res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse_1.ApiResponse(200, { user, accessToken, refreshToken }, 'User logged in successfully'));
}));
exports.loginUser = loginUser;
const getAllUsers = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_service_1.userService.getAllUsers();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, users, 'Users fetched successfully'));
}));
exports.getAllUsers = getAllUsers;
const getUserByEmail = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const user = yield user_service_1.userService.getUserByEmail(email);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, user, 'User found'));
}));
exports.getUserByEmail = getUserByEmail;
