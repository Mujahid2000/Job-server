"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const livenotification_controller_1 = require("../controller/livenotification.controller");
// POST: Shortlist Notification
router.post('/send', (req, res, next) => {
    req.body.type = 'shortlist';
    (0, livenotification_controller_1.sendNotification)(req, res, next);
});
// POST: Saved Profile Notification
router.post('/sendSavedProfile', (req, res, next) => {
    req.body.type = 'savedProfile';
    (0, livenotification_controller_1.sendNotification)(req, res, next);
});
// server/routes/apiRoutes.js
router.post('/customerMessage', livenotification_controller_1.customerMessage);
exports.default = router;
