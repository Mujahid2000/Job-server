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
exports.subscriptionService = void 0;
const PaymentModels_1 = __importDefault(require("../models/PaymentModels"));
const ApiError_1 = require("../utils/ApiError");
const getSubscriptionDataByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield PaymentModels_1.default.find({ email });
    if (payments.length === 0) {
        throw new ApiError_1.ApiError(404, 'No payments found for this email');
    }
    return payments;
});
const getSubscriptionDataById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield PaymentModels_1.default.find({ userId });
    if (payments.length === 0) {
        throw new ApiError_1.ApiError(404, 'No payments found for this user');
    }
    return payments;
});
exports.subscriptionService = {
    getSubscriptionDataByEmail,
    getSubscriptionDataById,
};
