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
exports.getAllUsers = exports.getUserByEmail = exports.loginUser = exports.registerUser = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const NotificationSchema_1 = __importDefault(require("../models/NotificationSchema"));
const JobAlertsSchema_1 = __importDefault(require("../models/JobAlertsSchema"));
const ProfilePrivacySchema_1 = __importDefault(require("../models/ProfilePrivacySchema"));
const UserModels_1 = __importDefault(require("../models/UserModels"));
const genarateTokens_1 = require("../utils/genarateTokens");
const registerUser = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, phoneNumber } = req.body;
    if (!name || !email || !password || !role || !phoneNumber) {
        throw new ApiError_1.ApiError(400, 'All fields are required');
    }
    const session = yield UserModels_1.default.startSession();
    session.startTransaction();
    try {
        // Create a new user instance
        const newUser = new UserModels_1.default({
            name,
            email,
            password, // In a real application, hash the password before saving
            role,
            phoneNumber,
        });
        // Save the user within the transaction
        const saveUserData = yield newUser.save({ session });
        // If role is applicant, create default records within the transaction
        if (role.toLowerCase() === 'applicant') {
            const notificationData = new NotificationSchema_1.default({
                userId: saveUserData._id,
                shortlist: false,
                jobsExpire: false,
                jobAlerts: false,
                savedProfile: false,
                rejected: false,
            });
            yield notificationData.save({ session });
            const jobAlertData = new JobAlertsSchema_1.default({
                userId: saveUserData._id,
                jobRole: '',
                location: '',
            });
            yield jobAlertData.save({ session });
            const profilePrivacyData = new ProfilePrivacySchema_1.default({
                userId: saveUserData._id,
                profilePublic: false,
                resumePublic: false,
            });
            yield profilePrivacyData.save({ session });
        }
        // Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        const accessToken = (0, genarateTokens_1.genarateTokens)(saveUserData);
        const refreashTokens = (0, genarateTokens_1.refreashToken)(saveUserData);
        res.cookie("refreashTokens", refreashTokens, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.status(201).json(new ApiResponse_1.ApiResponse(201, saveUserData, 'User registered successfully'));
    }
    catch (error) {
        // Rollback the transaction on error
        yield session.abortTransaction();
        session.endSession();
        throw new ApiError_1.ApiError(500, 'Failed to register user', [error.message]);
    }
}));
exports.registerUser = registerUser;
const loginUser = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError_1.ApiError(400, 'Email and password are required');
    }
    try {
        // Find user by email and password
        const user = yield UserModels_1.default.findOne({ email, password });
        if (!user) {
            throw new ApiError_1.ApiError(404, 'Invalid email or password');
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, user, 'User found'));
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, 'Failed to fetch user', [error.message]);
    }
}));
exports.loginUser = loginUser;
const getUserByEmail = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    if (!email) {
        throw new ApiError_1.ApiError(400, 'Email is required');
    }
    try {
        // Find user by email
        const user = yield UserModels_1.default.findOne({ email });
        if (!user) {
            throw new ApiError_1.ApiError(404, 'User not found');
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, user, 'User found'));
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, 'Failed to fetch user', [error.message]);
    }
}));
exports.getUserByEmail = getUserByEmail;
const getAllUsers = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserModels_1.default.aggregate([
            {
                $addFields: {
                    idString: { $toString: "$_id" } // Convert ObjectId to string
                }
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "idString", // Now a string version of _id
                    foreignField: "userId", // String field in payments
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
        res.status(200).json(new ApiResponse_1.ApiResponse(200, users, 'Users fetched successfully'));
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, 'Failed to fetch users', [error.message]);
    }
}));
exports.getAllUsers = getAllUsers;
