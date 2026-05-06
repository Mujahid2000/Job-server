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
exports.userService = void 0;
const mongoose_1 = require("mongoose");
const UserModels_1 = __importDefault(require("../models/UserModels"));
const NotificationSchema_1 = __importDefault(require("../models/NotificationSchema"));
const JobAlertsSchema_1 = __importDefault(require("../models/JobAlertsSchema"));
const ProfilePrivacySchema_1 = __importDefault(require("../models/ProfilePrivacySchema"));
const ApiError_1 = require("../utils/ApiError");
const EmailService_1 = require("../utils/EmailService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const generateAccessAndRefreshTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModels_1.default.findById(new mongoose_1.Types.ObjectId(userId));
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    const accessToken = yield user.generateAccessToken();
    const refreshToken = yield user.generateRefreshToken();
    user.refreshToken = refreshToken;
    yield user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
});
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, phoneNumber } = userData;
    const userExists = yield UserModels_1.default.findOne({ email });
    if (userExists) {
        throw new ApiError_1.ApiError(400, 'User already exists');
    }
    const session = yield UserModels_1.default.startSession();
    session.startTransaction();
    try {
        const newUser = new UserModels_1.default({
            name,
            email,
            password,
            role,
            phoneNumber,
        });
        const savedUser = yield newUser.save({ session });
        if (role.toLowerCase() === 'applicant') {
            yield new NotificationSchema_1.default({ userId: savedUser._id }).save({ session });
            yield new JobAlertsSchema_1.default({ userId: savedUser._id }).save({ session });
            yield new ProfilePrivacySchema_1.default({ userId: savedUser._id }).save({ session });
        }
        yield session.commitTransaction();
        return savedUser;
    }
    catch (error) {
        yield session.abortTransaction();
        throw new ApiError_1.ApiError(500, 'Failed to register user', [error.message]);
    }
    finally {
        session.endSession();
    }
});
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModels_1.default.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'Email not found');
    }
    const isPasswordValid = yield user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError_1.ApiError(401, 'Invalid password');
    }
    const { accessToken, refreshToken } = yield generateAccessAndRefreshTokens(user._id.toString());
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    return { user: userResponse, accessToken, refreshToken };
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield UserModels_1.default.aggregate([
        {
            $addFields: {
                idString: { $toString: "$_id" }
            }
        },
        {
            $lookup: {
                from: "payments",
                localField: "idString",
                foreignField: "userId",
                as: "userData"
            }
        },
        {
            $unwind: {
                path: "$userData",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "companydatas",
                localField: "idString",
                foreignField: "userId",
                as: "companydata"
            }
        },
        {
            $unwind: {
                path: "$companydata",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $set: {
                packageName: "$userData.packageName",
                companyName: "$companydata.companyName",
                formatDate: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                email: 1,
                role: 1,
                packageName: 1,
                date: "$formatDate",
                companyName: 1
            }
        }
    ]);
});
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Exclude sensitive fields when returning user info
    const user = yield UserModels_1.default.findOne({ email }).select('-password -refreshToken');
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    // Convert to plain object to be safe and remove any remaining sensitive fields
    const userObj = user.toObject ? user.toObject() : user;
    if (userObj.password)
        delete userObj.password;
    if (userObj.refreshToken)
        delete userObj.refreshToken;
    return userObj;
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModels_1.default.findOne({ email });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User with this email does not exist');
    }
    const resetToken = user.getResetPasswordToken();
    yield user.save({ validateBeforeSave: false });
    const resetUrl = `${config_1.config.frontendUrl}/reset-password?token=${resetToken}`;
    const message = `
    <h1>Password Reset Request</h1>
    <p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
    <p>Please click on the following link, or paste this into your browser to complete the process within 15 minutes of receiving it:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `;
    try {
        yield (0, EmailService_1.sendEmail)(user.email, 'Password Reset Token', message);
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save({ validateBeforeSave: false });
        throw new ApiError_1.ApiError(500, 'Email could not be sent');
    }
});
const resetPassword = (token, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        const user = yield UserModels_1.default.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            throw new ApiError_1.ApiError(400, 'Invalid or expired token');
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save();
        return user;
    }
    catch (error) {
        throw new ApiError_1.ApiError(400, 'Invalid or expired token');
    }
});
exports.userService = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserByEmail,
    forgotPassword,
    resetPassword,
};
