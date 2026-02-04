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
exports.getSubscriptionDataById = exports.getSubscriptionDataByEmail = void 0;
const AsyncHandler_1 = require("../utils/AsyncHandler");
const PaymentModels_1 = __importDefault(require("../models/PaymentModels"));
const PaymentModels_2 = __importDefault(require("../models/PaymentModels"));
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const getSubscriptionDataByEmail = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const payments = yield PaymentModels_1.default.find({ email: email });
        if (payments.length === 0) {
            throw new ApiError_1.ApiError(404, 'No payments found for this email');
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, payments, 'Payments fetched successfully'));
    }
    catch (error) {
        console.error('Error fetching payments:', error);
        throw new ApiError_1.ApiError(500, 'Internal server error', [error.message]);
    }
}));
exports.getSubscriptionDataByEmail = getSubscriptionDataByEmail;
const getSubscriptionDataById = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const payment = yield PaymentModels_2.default.find({ userId: id }); // Replace 'paymentId' with your custom field name
        if (!payment) {
            throw new ApiError_1.ApiError(404, 'Payment not found');
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, payment, 'Payment fetched successfully'));
    }
    catch (error) {
        console.error('Error fetching payment by id:', error);
        throw new ApiError_1.ApiError(500, 'Internal server error', [error.message]);
    }
}));
exports.getSubscriptionDataById = getSubscriptionDataById;
