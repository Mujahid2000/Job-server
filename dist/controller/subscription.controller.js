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
exports.getSubscriptionDataById = exports.getSubscriptionDataByEmail = void 0;
const subscription_service_1 = require("../services/subscription.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const getSubscriptionDataByEmail = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const result = yield subscription_service_1.subscriptionService.getSubscriptionDataByEmail(email);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Payments fetched successfully'));
}));
exports.getSubscriptionDataByEmail = getSubscriptionDataByEmail;
const getSubscriptionDataById = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield subscription_service_1.subscriptionService.getSubscriptionDataById(id);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Payment fetched successfully'));
}));
exports.getSubscriptionDataById = getSubscriptionDataById;
