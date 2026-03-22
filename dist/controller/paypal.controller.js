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
exports.payparOrderCapture = exports.payparOrderCreate = void 0;
const paypal_service_1 = require("../services/paypal.service");
const ApiResponse_1 = require("../utils/ApiResponse");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const payparOrderCreate = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield paypal_service_1.paypalService.createOrder(req.body);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Order created successfully'));
}));
exports.payparOrderCreate = payparOrderCreate;
const payparOrderCapture = (0, AsyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield paypal_service_1.paypalService.captureOrder(req.body);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, result, 'Order captured and payment saved successfully'));
}));
exports.payparOrderCapture = payparOrderCapture;
