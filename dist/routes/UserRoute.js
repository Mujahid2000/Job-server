"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../controller/user.controller");
// User Routes register and login
router.route('/userReg').post(user_controller_1.registerUser);
router.route('/login').post(user_controller_1.loginUser);
// User Routes get user by email
router.route('/users/:email').get(user_controller_1.getUserByEmail);
// get all users
router.route('/users').get(user_controller_1.getAllUsers);
exports.default = router;
